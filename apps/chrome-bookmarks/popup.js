const $ = (sel) => document.querySelector(sel)

const STATES = ["not-configured", "form-state", "success-state", "error-state", "loading-state"]

function showState(id) {
	for (const s of STATES) {
		const el = document.getElementById(s)
		if (el) el.hidden = s !== id
	}
}

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

async function getConfig() {
	const data = await chrome.storage.sync.get(["convexUrl", "extensionSecret"])
	return data
}

async function loadCollections(convexUrl, extensionSecret) {
	try {
		const res = await fetch(`${convexUrl}/api/extension/collections`, {
			headers: { "X-Extension-Secret": extensionSecret },
		})
		if (!res.ok) return []
		return await res.json()
	} catch {
		return []
	}
}

function buildCollectionTree(collections) {
	const roots = collections.filter((c) => !c.parentId).sort((a, b) => a.order - b.order)
	const children = collections.filter((c) => c.parentId).sort((a, b) => a.order - b.order)

	const tree = []
	for (const root of roots) {
		tree.push(root)
		for (const child of children) {
			if (child.parentId === root._id) {
				tree.push({ ...child, _isChild: true })
			}
		}
	}
	return tree
}

function populateCollections(collections) {
	const select = $("#collection")
	const tree = buildCollectionTree(collections)
	for (const col of tree) {
		const opt = document.createElement("option")
		opt.value = col._id
		opt.textContent = col._isChild ? `  └ ${col.name}` : col.name
		if (col.icon) opt.textContent = `${col.icon} ${opt.textContent}`
		select.appendChild(opt)
	}
}

async function init() {
	showState("loading-state")

	const { convexUrl, extensionSecret } = await getConfig()

	if (!convexUrl || !extensionSecret) {
		showState("not-configured")
		$("#open-settings").addEventListener("click", () => {
			chrome.runtime.openOptionsPage()
		})
		return
	}

	// Get current tab info
	const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
	const url = tab?.url ?? ""
	const title = tab?.title ?? ""
	const type = detectType(url)

	// Populate form
	$("#title").value = title
	$("#url").value = url
	const badge = $("#type-badge")
	badge.textContent = type
	badge.dataset.type = type

	// Load collections
	const collections = await loadCollections(convexUrl, extensionSecret)
	populateCollections(collections)

	showState("form-state")

	// Save handler
	$("#save-btn").addEventListener("click", async () => {
		const saveBtn = $("#save-btn")
		saveBtn.disabled = true
		saveBtn.textContent = "Sauvegarde..."

		const bookmarkUrl = $("#url").value.trim()
		const bookmarkType = detectType(bookmarkUrl)

		const payload = {
			url: bookmarkUrl,
			type: bookmarkType,
			title: $("#title").value.trim() || undefined,
			notes: $("#notes").value.trim() || undefined,
			collectionId: $("#collection").value || undefined,
		}

		// Add YouTube-specific metadata
		if (bookmarkType === "youtube") {
			const videoId = extractYouTubeId(bookmarkUrl)
			if (videoId) {
				payload.embedUrl = `https://www.youtube.com/embed/${videoId}`
				payload.thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
			}
			payload.siteName = "YouTube"
		}

		if (bookmarkType === "tweet") {
			const authorMatch = bookmarkUrl.match(/(?:twitter\.com|x\.com)\/([\w]+)\/status/)
			if (authorMatch) payload.author = authorMatch[1]
			payload.siteName = "X (Twitter)"
		}

		try {
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
				throw new Error(err.error || `Erreur ${res.status}`)
			}

			showState("success-state")
			setTimeout(() => window.close(), 1200)
		} catch (err) {
			$("#error-msg").textContent = err.message
			showState("error-state")
			$("#retry-btn").addEventListener("click", () => {
				showState("form-state")
				saveBtn.disabled = false
				saveBtn.textContent = "Sauvegarder"
			})
		}
	})
}

init()
