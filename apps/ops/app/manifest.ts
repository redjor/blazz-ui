import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "Blazz Ops",
		short_name: "Blazz Ops",
		description: "Freelance time tracking & billing",
		start_url: "/",
		scope: "/",
		display: "standalone",
		orientation: "any",
		lang: "fr",
		background_color: "#111114",
		theme_color: "#111114",
		icons: [
			{ src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
			{ src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
			{ src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
		],
	}
}
