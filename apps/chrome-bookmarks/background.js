// Context menu: right-click to save a link as bookmark
chrome.runtime.onInstalled.addListener(() => {
	chrome.contextMenus.create({
		id: "blazz-save-page",
		title: "Sauvegarder dans Blazz",
		contexts: ["page"],
	})

	chrome.contextMenus.create({
		id: "blazz-save-link",
		title: "Sauvegarder le lien dans Blazz",
		contexts: ["link"],
	})
})

function detectType(url) {
	const u = url.toLowerCase()
	if (u.includes("twitter.com/") || u.includes("x.com/")) return "tweet"
	if (u.includes("youtube.com/watch") || u.includes("youtu.be/")) return "youtube"
	if (/\.(png|jpe?g|gif|webp|svg)(\?.*)?$/i.test(u)) return "image"
	if (/\.(mp4|webm|mov)(\?.*)?$/i.test(u)) return "video"
	return "link"
}

function extractYouTubeId(url) {
	const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/)
	return match?.[1] ?? null
}

async function quickSave(url, title) {
	const { convexUrl, extensionSecret } = await chrome.storage.sync.get([
		"convexUrl",
		"extensionSecret",
	])

	if (!convexUrl || !extensionSecret) {
		console.warn("Blazz Bookmarks: extension not configured")
		return
	}

	const type = detectType(url)
	const payload = { url, type, title: title || undefined }

	if (type === "youtube") {
		const videoId = extractYouTubeId(url)
		if (videoId) {
			payload.embedUrl = `https://www.youtube.com/embed/${videoId}`
			payload.thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
		}
		payload.siteName = "YouTube"
	}

	if (type === "tweet") {
		const authorMatch = url.match(/(?:twitter\.com|x\.com)\/([\w]+)\/status/)
		if (authorMatch) payload.author = authorMatch[1]
		payload.siteName = "X (Twitter)"
	}

	const res = await fetch(`${convexUrl}/api/extension/bookmarks`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"X-Extension-Secret": extensionSecret,
		},
		body: JSON.stringify(payload),
	})

	if (!res.ok) {
		const err = await res.json().catch(() => ({}))
		console.error("Blazz Bookmarks: save failed", err)
	}
}

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
	if (info.menuItemId === "blazz-save-page") {
		await quickSave(tab.url, tab.title)
	} else if (info.menuItemId === "blazz-save-link") {
		await quickSave(info.linkUrl, info.linkUrl)
	}
})
