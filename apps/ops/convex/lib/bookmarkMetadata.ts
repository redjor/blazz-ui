export type BookmarkType = "tweet" | "youtube" | "image" | "video" | "link"

export interface ExtractedMetadata {
	type: BookmarkType
	title?: string
	description?: string
	thumbnailUrl?: string
	author?: string
	siteName?: string
	embedUrl?: string
}

const DESKTOP_UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"

function detectType(url: string): BookmarkType {
	const u = url.toLowerCase()
	if (u.includes("twitter.com/") || u.includes("x.com/")) return "tweet"
	if (u.includes("youtube.com/watch") || u.includes("youtu.be/")) return "youtube"
	if (u.includes("instagram.com/")) return "video"
	if (/\.(png|jpe?g|gif|webp|svg)(\?.*)?$/i.test(u)) return "image"
	if (/\.(mp4|webm|mov)(\?.*)?$/i.test(u)) return "video"
	return "link"
}

function extractYouTubeId(url: string): string | null {
	const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/)
	return match?.[1] ?? null
}

function extractTweetId(url: string): { author: string | null; id: string | null } {
	const match = url.match(/(?:twitter\.com|x\.com)\/([\w]+)\/status\/(\d+)/)
	return { author: match?.[1] ?? null, id: match?.[2] ?? null }
}

function getMetaContent(html: string, property: string): string | null {
	const regex = new RegExp(`<meta[^>]*(?:property|name)=["']${property}["'][^>]*content=["']([^"']*?)["']|<meta[^>]*content=["']([^"']*?)["'][^>]*(?:property|name)=["']${property}["']`, "i")
	const match = html.match(regex)
	return match?.[1] ?? match?.[2] ?? null
}

function getTitle(html: string): string | null {
	const match = html.match(/<title[^>]*>([^<]*)<\/title>/i)
	return match?.[1]?.trim() ?? null
}

function decodeEntities(text: string): string {
	return text
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/&amp;/g, "&")
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">")
		.replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
}

async function fetchYouTubeOEmbed(url: string): Promise<Partial<ExtractedMetadata> | null> {
	try {
		const res = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`, { signal: AbortSignal.timeout(5000) })
		if (!res.ok) return null
		const data = (await res.json()) as { title?: string; author_name?: string; thumbnail_url?: string }
		return {
			title: data.title,
			author: data.author_name,
			thumbnailUrl: data.thumbnail_url,
			siteName: "YouTube",
		}
	} catch {
		return null
	}
}

async function fetchTweetFx(tweetId: string): Promise<Partial<ExtractedMetadata> | null> {
	try {
		const res = await fetch(`https://api.fxtwitter.com/status/${tweetId}`, {
			headers: { "User-Agent": DESKTOP_UA },
			signal: AbortSignal.timeout(5000),
		})
		if (!res.ok) return null
		const data = (await res.json()) as {
			tweet?: {
				text?: string
				author?: { name?: string; screen_name?: string }
				media?: { photos?: { url: string }[]; videos?: { thumbnail_url: string }[] }
			}
		}
		const tweet = data.tweet
		if (!tweet) return null
		const thumb = tweet.media?.photos?.[0]?.url ?? tweet.media?.videos?.[0]?.thumbnail_url ?? undefined
		const authorLabel = tweet.author?.name ? `${tweet.author.name}${tweet.author.screen_name ? ` (@${tweet.author.screen_name})` : ""}` : (tweet.author?.screen_name ?? undefined)
		return {
			title: tweet.text,
			author: authorLabel,
			thumbnailUrl: thumb,
			siteName: "X (Twitter)",
		}
	} catch {
		return null
	}
}

async function fetchTwitterOEmbed(url: string): Promise<Partial<ExtractedMetadata> | null> {
	try {
		const res = await fetch(`https://publish.twitter.com/oembed?url=${encodeURIComponent(url)}&omit_script=true`, { signal: AbortSignal.timeout(5000) })
		if (!res.ok) return null
		const data = (await res.json()) as { author_name?: string; html?: string }
		const textMatch = data.html?.match(/<p[^>]*>([\s\S]*?)<\/p>/)
		const text = textMatch?.[1]
			?.replace(/<[^>]+>/g, " ")
			.replace(/\s+/g, " ")
			.trim()
		return {
			title: text ? decodeEntities(text) : undefined,
			author: data.author_name,
			siteName: "X (Twitter)",
		}
	} catch {
		return null
	}
}

async function fetchHtmlMeta(url: string): Promise<Partial<ExtractedMetadata> | null> {
	try {
		const response = await fetch(url, {
			headers: {
				"User-Agent": DESKTOP_UA,
				Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
				"Accept-Language": "en-US,en;q=0.9",
			},
			signal: AbortSignal.timeout(7000),
			redirect: "follow",
		})
		if (!response.ok) return null
		const html = await response.text()
		const title = getMetaContent(html, "og:title") ?? getMetaContent(html, "twitter:title") ?? getTitle(html)
		const description = getMetaContent(html, "og:description") ?? getMetaContent(html, "twitter:description") ?? getMetaContent(html, "description")
		const thumbnailUrl = getMetaContent(html, "og:image") ?? getMetaContent(html, "twitter:image") ?? undefined
		const siteName = getMetaContent(html, "og:site_name") ?? undefined
		const author = getMetaContent(html, "article:author") ?? undefined
		return {
			title: title ? decodeEntities(title) : undefined,
			description: description ? decodeEntities(description) : undefined,
			thumbnailUrl: thumbnailUrl ?? undefined,
			siteName,
			author,
		}
	} catch {
		return null
	}
}

async function resolveYouTube(url: string): Promise<ExtractedMetadata> {
	const videoId = extractYouTubeId(url)
	const base: ExtractedMetadata = { type: "youtube", siteName: "YouTube" }
	if (videoId) {
		base.embedUrl = `https://www.youtube.com/embed/${videoId}`
		base.thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
	}
	const oembed = await fetchYouTubeOEmbed(url)
	return oembed ? { ...base, ...oembed } : base
}

async function resolveTweet(url: string): Promise<ExtractedMetadata> {
	const { author, id } = extractTweetId(url)
	const base: ExtractedMetadata = {
		type: "tweet",
		siteName: "X (Twitter)",
		author: author ?? undefined,
	}
	if (!id) return base
	const fx = await fetchTweetFx(id)
	if (fx) return { ...base, ...fx }
	const oembed = await fetchTwitterOEmbed(url)
	return oembed ? { ...base, ...oembed } : base
}

async function resolveInstagram(url: string): Promise<ExtractedMetadata> {
	const base: ExtractedMetadata = { type: "video", siteName: "Instagram" }
	const meta = await fetchHtmlMeta(url)
	return meta ? { ...base, ...meta } : base
}

function resolveImage(url: string): ExtractedMetadata {
	return {
		type: "image",
		thumbnailUrl: url,
		title: url.split("/").pop()?.split("?")[0] ?? "Image",
	}
}

async function resolveLink(url: string): Promise<ExtractedMetadata> {
	const meta = await fetchHtmlMeta(url)
	return { type: "link", ...(meta ?? {}) }
}

export async function extractMetadata(url: string): Promise<ExtractedMetadata> {
	const type = detectType(url)
	if (type === "youtube") return resolveYouTube(url)
	if (type === "tweet") return resolveTweet(url)
	if (type === "image") return resolveImage(url)
	if (type === "video" && url.toLowerCase().includes("instagram.com/")) return resolveInstagram(url)
	if (type === "link") return resolveLink(url)
	return { type }
}
