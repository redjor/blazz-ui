import { v } from "convex/values"
import { internal } from "./_generated/api"
import { action, internalAction, internalMutation, internalQuery } from "./_generated/server"

// ── Internal queries ──────────────────────────────────────────────

export const getItemInternal = internalQuery({
	args: { id: v.id("feedItems") },
	handler: async (ctx, { id }) => {
		return ctx.db.get(id)
	},
})

export const listActiveSources = internalQuery({
	args: {},
	handler: async (ctx) => {
		return ctx.db
			.query("feedSources")
			.filter((q) => q.eq(q.field("isActive"), true))
			.collect()
	},
})

// ── Internal mutations ────────────────────────────────────────────

export const insertItemIfNew = internalMutation({
	args: {
		userId: v.id("users"),
		sourceId: v.id("feedSources"),
		externalId: v.string(),
		type: v.union(v.literal("youtube"), v.literal("rss")),
		title: v.string(),
		content: v.string(),
		url: v.string(),
		thumbnailUrl: v.optional(v.string()),
		publishedAt: v.number(),
	},
	handler: async (ctx, args) => {
		// Dedup by externalId
		const existing = await ctx.db
			.query("feedItems")
			.withIndex("by_external", (q) => q.eq("externalId", args.externalId))
			.first()
		if (existing) return null

		return ctx.db.insert("feedItems", {
			...args,
			isRead: false,
			isFavorite: false,
			createdAt: Date.now(),
		})
	},
})

export const markSourceFetched = internalMutation({
	args: { sourceId: v.id("feedSources") },
	handler: async (ctx, { sourceId }) => {
		await ctx.db.patch(sourceId, { lastFetchedAt: Date.now() })
	},
})

export const saveEnrichment = internalMutation({
	args: {
		itemId: v.id("feedItems"),
		aiSummary: v.string(),
		aiTags: v.array(v.string()),
	},
	handler: async (ctx, { itemId, aiSummary, aiTags }) => {
		await ctx.db.patch(itemId, { aiSummary, aiTags })
	},
})

// ── RSS parser (regex-based, no external deps) ────────────────────

function stripHtml(html: string): string {
	return html
		.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
		.replace(/<[^>]*>/g, "")
		.replace(/&amp;/g, "&")
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">")
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/&apos;/g, "'")
		.trim()
}

function extractTag(xml: string, tag: string): string {
	// Handle CDATA
	const cdataRegex = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>`, "i")
	const cdataMatch = xml.match(cdataRegex)
	if (cdataMatch) return cdataMatch[1].trim()

	const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i")
	const match = xml.match(regex)
	return match ? match[1].trim() : ""
}

function extractAttr(xml: string, tag: string, attr: string): string {
	const regex = new RegExp(`<${tag}[^>]*\\s${attr}=["']([^"']*)["'][^>]*/?>`, "i")
	const match = xml.match(regex)
	return match ? match[1] : ""
}

interface ParsedFeedItem {
	title: string
	link: string
	description: string
	pubDate: string
	thumbnail: string
}

function parseRSSFeed(xml: string): ParsedFeedItem[] {
	const items: ParsedFeedItem[] = []

	// RSS 2.0: <item>...</item>
	const rssItems = xml.match(/<item[\s>][\s\S]*?<\/item>/gi) || []
	for (const itemXml of rssItems) {
		const title = stripHtml(extractTag(itemXml, "title"))
		let link = extractTag(itemXml, "link")
		if (!link) link = extractAttr(itemXml, "link", "href")
		const description = stripHtml(
			extractTag(itemXml, "description") || extractTag(itemXml, "content:encoded")
		)
		const pubDate = extractTag(itemXml, "pubDate") || extractTag(itemXml, "dc:date")
		const thumbnail =
			extractAttr(itemXml, "media:thumbnail", "url") ||
			extractAttr(itemXml, "media:content", "url") ||
			extractAttr(itemXml, "enclosure", "url")

		if (title && link) {
			items.push({ title, link, description, pubDate, thumbnail })
		}
	}

	// Atom: <entry>...</entry>
	if (items.length === 0) {
		const atomEntries = xml.match(/<entry[\s>][\s\S]*?<\/entry>/gi) || []
		for (const entryXml of atomEntries) {
			const title = stripHtml(extractTag(entryXml, "title"))
			const link = extractAttr(entryXml, "link", "href")
			const description = stripHtml(
				extractTag(entryXml, "summary") || extractTag(entryXml, "content")
			)
			const pubDate = extractTag(entryXml, "published") || extractTag(entryXml, "updated")
			const thumbnail = extractAttr(entryXml, "media:thumbnail", "url")

			if (title && link) {
				items.push({ title, link, description, pubDate, thumbnail })
			}
		}
	}

	return items
}

// ── Internal actions ──────────────────────────────────────────────

export const fetchYouTubeChannel = internalAction({
	args: {
		sourceId: v.id("feedSources"),
		userId: v.id("users"),
		channelId: v.string(),
	},
	handler: async (ctx, { sourceId, userId, channelId }) => {
		const apiKey = process.env.YOUTUBE_API_KEY
		if (!apiKey) {
			console.error("YOUTUBE_API_KEY not configured")
			return
		}

		try {
			const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${encodeURIComponent(channelId)}&maxResults=20&order=date&type=video&key=${apiKey}`
			const res = await fetch(url)
			if (!res.ok) {
				console.error(`YouTube API error: ${res.status} ${res.statusText}`)
				return
			}

			const data = await res.json()
			const items = data.items || []

			for (const item of items) {
				const videoId = item.id?.videoId
				if (!videoId) continue

				const snippet = item.snippet
				const itemId = await ctx.runMutation(internal.feed.insertItemIfNew, {
					userId,
					sourceId,
					externalId: `yt:${videoId}`,
					type: "youtube",
					title: snippet.title || "Sans titre",
					content: snippet.description || "",
					url: `https://www.youtube.com/watch?v=${videoId}`,
					thumbnailUrl: snippet.thumbnails?.high?.url || snippet.thumbnails?.default?.url,
					publishedAt: new Date(snippet.publishedAt).getTime(),
				})

				if (itemId) {
					await ctx.scheduler.runAfter(0, internal.feed.enrichItem, { itemId })
				}
			}

			await ctx.runMutation(internal.feed.markSourceFetched, { sourceId })
		} catch (e) {
			console.error(`Failed to fetch YouTube channel ${channelId}:`, e)
		}
	},
})

export const fetchRSSFeed = internalAction({
	args: {
		sourceId: v.id("feedSources"),
		userId: v.id("users"),
		feedUrl: v.string(),
	},
	handler: async (ctx, { sourceId, userId, feedUrl }) => {
		try {
			const res = await fetch(feedUrl, {
				headers: { "User-Agent": "BlazzOps/1.0" },
			})
			if (!res.ok) {
				console.error(`RSS fetch error: ${res.status} for ${feedUrl}`)
				return
			}

			const xml = await res.text()
			const items = parseRSSFeed(xml)

			for (const item of items) {
				const pubDate = item.pubDate ? new Date(item.pubDate).getTime() : Date.now()
				const itemId = await ctx.runMutation(internal.feed.insertItemIfNew, {
					userId,
					sourceId,
					externalId: `rss:${item.link}`,
					type: "rss",
					title: item.title,
					content: item.description.slice(0, 2000),
					url: item.link,
					thumbnailUrl: item.thumbnail || undefined,
					publishedAt: Number.isNaN(pubDate) ? Date.now() : pubDate,
				})

				if (itemId) {
					await ctx.scheduler.runAfter(0, internal.feed.enrichItem, { itemId })
				}
			}

			await ctx.runMutation(internal.feed.markSourceFetched, { sourceId })
		} catch (e) {
			console.error(`Failed to fetch RSS feed ${feedUrl}:`, e)
		}
	},
})

export const enrichItem = internalAction({
	args: { itemId: v.id("feedItems") },
	handler: async (ctx, { itemId }) => {
		const apiKey = process.env.OPENAI_API_KEY
		if (!apiKey) {
			console.error("OPENAI_API_KEY not configured")
			return
		}

		const item = await ctx.runQuery(internal.feed.getItemInternal, { id: itemId })
		if (!item) return

		// Skip if already enriched
		if (item.aiSummary) return

		const prompt = `Tu es un assistant de veille tech. Résume cet article/vidéo en 2-3 phrases en français, puis donne 3-5 tags pertinents (en anglais, lowercase).

Titre: ${item.title}
Contenu: ${item.content.slice(0, 1500)}

Réponds UNIQUEMENT en JSON valide:
{"summary": "...", "tags": ["tag1", "tag2", "tag3"]}`

		const maxRetries = 2
		for (let attempt = 0; attempt <= maxRetries; attempt++) {
			try {
				const res = await fetch("https://api.openai.com/v1/chat/completions", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${apiKey}`,
					},
					body: JSON.stringify({
						model: "gpt-4o-mini",
						messages: [{ role: "user", content: prompt }],
						temperature: 0.3,
						max_tokens: 300,
						response_format: { type: "json_object" },
					}),
				})

				if (!res.ok) {
					console.error(`OpenAI API error: ${res.status}`)
					if (attempt < maxRetries) continue
					return
				}

				const data = await res.json()
				const content = data.choices?.[0]?.message?.content
				if (!content) return

				const parsed = JSON.parse(content)
				const summary = parsed.summary || ""
				const tags = Array.isArray(parsed.tags)
					? parsed.tags.filter((t: unknown) => typeof t === "string").slice(0, 5)
					: []

				await ctx.runMutation(internal.feed.saveEnrichment, {
					itemId,
					aiSummary: summary,
					aiTags: tags,
				})
				return
			} catch (e) {
				console.error(`Enrichment attempt ${attempt + 1} failed for ${itemId}:`, e)
				if (attempt < maxRetries) continue
			}
		}
	},
})

export const fetchAllFeeds = internalAction({
	args: {},
	handler: async (ctx) => {
		const sources = await ctx.runQuery(internal.feed.listActiveSources)

		for (const source of sources) {
			if (source.type === "youtube") {
				await ctx.scheduler.runAfter(0, internal.feed.fetchYouTubeChannel, {
					sourceId: source._id,
					userId: source.userId,
					channelId: source.externalId,
				})
			} else if (source.type === "rss") {
				await ctx.scheduler.runAfter(0, internal.feed.fetchRSSFeed, {
					sourceId: source._id,
					userId: source.userId,
					feedUrl: source.externalId,
				})
			}
		}
	},
})

// ── Public action ─────────────────────────────────────────────────

export const fetchNow = action({
	args: {},
	handler: async (ctx) => {
		await ctx.scheduler.runAfter(0, internal.feed.fetchAllFeeds)
	},
})
