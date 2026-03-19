import { v } from "convex/values"
import { internal } from "./_generated/api"
import { action, internalAction, internalMutation, internalQuery } from "./_generated/server"
import { requireAuth } from "./lib/auth"

// ── Internal queries ──────────────────────────────────────────────

export const getItemInternal = internalQuery({
	args: { id: v.id("feedItems") },
	handler: async (ctx, { id }) => {
		return ctx.db.get(id)
	},
})

export const listUnenrichedItems = internalQuery({
	args: {},
	handler: async (ctx) => {
		const all = await ctx.db.query("feedItems").collect()
		return all.filter((i) => !i.aiSummary)
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
		// Skip articles older than 30 days
		const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000
		if (args.publishedAt < thirtyDaysAgo) return null

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

export const deleteSourceInternal = internalMutation({
	args: { sourceId: v.id("feedSources") },
	handler: async (ctx, { sourceId }) => {
		const items = await ctx.db
			.query("feedItems")
			.withIndex("by_source", (q) => q.eq("sourceId", sourceId))
			.collect()
		for (const item of items) {
			await ctx.db.delete(item._id)
		}
		await ctx.db.delete(sourceId)
	},
})

export const updateSourceExternalId = internalMutation({
	args: { sourceId: v.id("feedSources"), externalId: v.string() },
	handler: async (ctx, { sourceId, externalId }) => {
		await ctx.db.patch(sourceId, { externalId })
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

		// Auto-resolve handle to channel ID if needed
		let resolvedChannelId = channelId
		if (!channelId.startsWith("UC")) {
			const handle = channelId.replace(/^@/, "")
			const resolveUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet&forHandle=${encodeURIComponent(handle)}&key=${apiKey}`
			const resolveRes = await fetch(resolveUrl)
			if (resolveRes.ok) {
				const resolveData = await resolveRes.json()
				const channel = resolveData.items?.[0]
				if (channel) {
					resolvedChannelId = channel.id
					// Update the source with the resolved channel ID
					await ctx.runMutation(internal.feed.updateSourceExternalId, {
						sourceId,
						externalId: resolvedChannelId,
					})
				} else {
					console.error(`Could not resolve YouTube handle: ${handle}`)
					return
				}
			} else {
				console.error(`YouTube resolve error: ${resolveRes.status}`)
				return
			}
		}

		try {
			const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${encodeURIComponent(resolvedChannelId)}&maxResults=10&order=date&type=video&key=${apiKey}`
			const res = await fetch(url)
			if (!res.ok) {
				const errorBody = await res.text()
				console.error(`YouTube API error: ${res.status} ${res.statusText}`, errorBody)
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

export const seedRSSSources = internalMutation({
	args: { userId: v.id("users") },
	handler: async (ctx, { userId }) => {
		const sources = [
			// AI / LLM
			{ name: "Anthropic Blog", url: "https://www.anthropic.com/rss.xml" },
			{ name: "OpenAI Blog", url: "https://openai.com/blog/rss.xml" },
			{ name: "Simon Willison", url: "https://simonwillison.net/atom/everything/" },
			{ name: "The Batch (Andrew Ng)", url: "https://www.deeplearning.ai/the-batch/feed/" },
			{ name: "Hugging Face Blog", url: "https://huggingface.co/blog/feed.xml" },
			// Dev / Web / React
			{ name: "Vercel Blog", url: "https://vercel.com/atom" },
			{ name: "Kent C. Dodds", url: "https://kentcdodds.com/blog/rss.xml" },
			{ name: "Josh Comeau", url: "https://www.joshwcomeau.com/rss.xml" },
			{ name: "Tailwind Blog", url: "https://tailwindcss.com/feeds/feed.xml" },
			{ name: "TkDodo (TanStack)", url: "https://tkdodo.eu/blog/rss.xml" },
			// Agrégateurs
			{ name: "Hacker News", url: "https://hnrss.org/frontpage" },
			{ name: "TLDR Newsletter", url: "https://tldr.tech/api/rss/tech" },
			{ name: "Lobsters", url: "https://lobste.rs/rss" },
			// AI Eng
			{ name: "Latent Space", url: "https://www.latent.space/feed" },
			{ name: "AI Snake Oil", url: "https://www.aisnakeoil.com/feed" },
		]

		let added = 0
		for (const s of sources) {
			// Skip if already exists
			const existing = await ctx.db
				.query("feedSources")
				.withIndex("by_user", (q) => q.eq("userId", userId))
				.collect()
			if (existing.some((e) => e.externalId === s.url)) continue

			await ctx.db.insert("feedSources", {
				userId,
				name: s.name,
				type: "rss",
				externalId: s.url,
				isActive: true,
				createdAt: Date.now(),
			})
			added++
		}
		return added
	},
})

// ── Public action ─────────────────────────────────────────────────

export const fetchNow = action({
	args: {},
	handler: async (ctx) => {
		await requireAuth(ctx)
		await ctx.scheduler.runAfter(0, internal.feed.fetchAllFeeds)
	},
})

export const seedDefaultSources = action({
	args: {},
	handler: async (ctx): Promise<number> => {
		const { userId } = await requireAuth(ctx)
		const added: number = await ctx.runMutation(internal.feed.seedRSSSources, { userId })
		return added
	},
})

export const enrichMissing = action({
	args: {},
	handler: async (ctx): Promise<number> => {
		await requireAuth(ctx)
		const items: Array<{ _id: string }> = await ctx.runQuery(internal.feed.listUnenrichedItems)
		for (const item of items) {
			await ctx.scheduler.runAfter(0, internal.feed.enrichItem, { itemId: item._id as any })
		}
		return items.length
	},
})

export const resolveYouTubeHandle = action({
	args: { handle: v.string() },
	handler: async (ctx, { handle }) => {
		await requireAuth(ctx)
		const apiKey = process.env.YOUTUBE_API_KEY
		if (!apiKey) throw new Error("YOUTUBE_API_KEY not configured")

		// Clean handle: accept "@melvynxdev", "melvynxdev", or full URL
		let cleanHandle = handle.trim()
		// Extract from URL like youtube.com/@melvynxdev
		const urlMatch = cleanHandle.match(/@([\w.-]+)/)
		if (urlMatch) cleanHandle = urlMatch[1]
		// Remove leading @ if present
		cleanHandle = cleanHandle.replace(/^@/, "")

		const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet&forHandle=${cleanHandle}&key=${apiKey}`
		const res = await fetch(url)
		if (!res.ok) throw new Error(`YouTube API error: ${res.status}`)

		const data = await res.json()
		const channel = data.items?.[0]
		if (!channel) return null

		return {
			channelId: channel.id as string,
			name: channel.snippet?.title as string,
			avatarUrl: (channel.snippet?.thumbnails?.default?.url ?? "") as string,
		}
	},
})
