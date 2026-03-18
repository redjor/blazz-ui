import { NextResponse } from "next/server"

type BookmarkType = "tweet" | "youtube" | "image" | "video" | "link"

interface ExtractedMetadata {
	type: BookmarkType
	title?: string
	description?: string
	thumbnailUrl?: string
	author?: string
	siteName?: string
	embedUrl?: string
}

function detectType(url: string): BookmarkType {
	const u = url.toLowerCase()
	if (u.includes("twitter.com/") || u.includes("x.com/")) return "tweet"
	if (u.includes("youtube.com/watch") || u.includes("youtu.be/")) return "youtube"
	if (/\.(png|jpe?g|gif|webp|svg)(\?.*)?$/i.test(u)) return "image"
	if (/\.(mp4|webm|mov)(\?.*)?$/i.test(u)) return "video"
	return "link"
}

function extractYouTubeId(url: string): string | null {
	const match = url.match(
		/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/
	)
	return match?.[1] ?? null
}

function extractTweetAuthor(url: string): string | null {
	const match = url.match(/(?:twitter\.com|x\.com)\/([\w]+)\/status/)
	return match?.[1] ?? null
}

function getMetaContent(html: string, property: string): string | null {
	const regex = new RegExp(
		`<meta[^>]*(?:property|name)=["']${property}["'][^>]*content=["']([^"']*?)["']|<meta[^>]*content=["']([^"']*?)["'][^>]*(?:property|name)=["']${property}["']`,
		"i"
	)
	const match = html.match(regex)
	return match?.[1] ?? match?.[2] ?? null
}

function getTitle(html: string): string | null {
	const match = html.match(/<title[^>]*>([^<]*)<\/title>/i)
	return match?.[1]?.trim() ?? null
}

export async function POST(request: Request) {
	try {
		const { url } = await request.json()
		if (!url || typeof url !== "string") {
			return NextResponse.json({ error: "URL is required" }, { status: 400 })
		}

		const type = detectType(url)
		const metadata: ExtractedMetadata = { type }

		if (type === "youtube") {
			const videoId = extractYouTubeId(url)
			if (videoId) {
				metadata.embedUrl = `https://www.youtube.com/embed/${videoId}`
				metadata.thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
			}
			metadata.siteName = "YouTube"
		}

		if (type === "tweet") {
			metadata.author = extractTweetAuthor(url)
			metadata.siteName = "X (Twitter)"
		}

		if (type === "image") {
			metadata.thumbnailUrl = url
			metadata.title = url.split("/").pop()?.split("?")[0] ?? "Image"
		}

		if (type !== "image" && type !== "video") {
			try {
				const response = await fetch(url, {
					headers: { "User-Agent": "bot" },
					signal: AbortSignal.timeout(5000),
					redirect: "follow",
				})
				if (response.ok) {
					const html = await response.text()
					metadata.title = metadata.title ?? getMetaContent(html, "og:title") ?? getTitle(html) ?? undefined
					metadata.description = getMetaContent(html, "og:description") ?? getMetaContent(html, "description") ?? undefined
					metadata.thumbnailUrl = metadata.thumbnailUrl ?? getMetaContent(html, "og:image") ?? undefined
					metadata.siteName = metadata.siteName ?? getMetaContent(html, "og:site_name") ?? undefined
					metadata.author = metadata.author ?? getMetaContent(html, "article:author") ?? undefined
				}
			} catch {
				// Fetch failed — return what we have from URL-based detection
			}
		}

		return NextResponse.json(metadata)
	} catch {
		return NextResponse.json({ error: "Failed to extract metadata" }, { status: 500 })
	}
}
