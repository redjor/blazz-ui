export type BookmarkType = "tweet" | "youtube" | "image" | "video" | "link"

const TWEET_HOSTS = /(^|\.)((?:mobile\.)?twitter\.com|x\.com)$/i
const YOUTUBE_HOSTS = /(^|\.)(youtube\.com|youtu\.be)$/i
const INSTAGRAM_HOST = /(^|\.)instagram\.com$/i
const TIKTOK_HOST = /(^|\.)tiktok\.com$/i
const IMAGE_EXT = /\.(jpe?g|png|gif|webp|avif|bmp|svg)(?:\?|$|#)/i
const VIDEO_EXT = /\.(mp4|mov|webm|mkv|m4v)(?:\?|$|#)/i

function safeUrl(raw: string): URL | null {
	try {
		return new URL(raw.trim())
	} catch {
		return null
	}
}

export function extractHost(raw: string): string | null {
	const u = safeUrl(raw)
	if (!u) return null
	return u.hostname.replace(/^www\./i, "")
}

export function classifyUrl(raw: string): BookmarkType {
	const u = safeUrl(raw)
	if (!u) return "link"

	const host = u.hostname
	const pathAndQuery = `${u.pathname}${u.search}`

	if (TWEET_HOSTS.test(host)) return "tweet"
	if (YOUTUBE_HOSTS.test(host)) return "youtube"
	if (INSTAGRAM_HOST.test(host)) return "video"
	if (TIKTOK_HOST.test(host)) return "video"
	if (VIDEO_EXT.test(pathAndQuery)) return "video"
	if (IMAGE_EXT.test(pathAndQuery)) return "image"
	return "link"
}
