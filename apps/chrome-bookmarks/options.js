const $ = (sel) => document.querySelector(sel)

async function init() {
	const { convexUrl, extensionSecret } = await chrome.storage.sync.get([
		"convexUrl",
		"extensionSecret",
	])

	if (convexUrl) $("#convex-url").value = convexUrl
	if (extensionSecret) $("#extension-secret").value = extensionSecret

	$("#save-btn").addEventListener("click", async () => {
		const url = $("#convex-url").value.trim().replace(/\/$/, "")
		const secret = $("#extension-secret").value.trim()

		if (!url || !secret) return

		await chrome.storage.sync.set({
			convexUrl: url,
			extensionSecret: secret,
		})

		const msg = $("#saved-msg")
		msg.style.display = "block"
		setTimeout(() => {
			msg.style.display = "none"
		}, 2000)
	})
}

init()
