// Minimal service worker — required for PWA installability on Chrome/Edge.
// Intentionally passthrough: no caching, no offline. Next.js handles its own asset hashing.
self.addEventListener("install", () => {
	self.skipWaiting()
})

self.addEventListener("activate", (event) => {
	event.waitUntil(self.clients.claim())
})

self.addEventListener("fetch", () => {
	// Let the browser handle all requests normally.
})
