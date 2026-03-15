/// <reference types="vite/client" />

import { Outlet, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router"
import type { ReactNode } from "react"
import { ComponentTree } from "~/components/component-tree"
import appCss from "~/styles/app.css?url"

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{ name: "viewport", content: "width=device-width, initial-scale=1" },
			{ title: "Blazz Sandbox" },
		],
		links: [{ rel: "stylesheet", href: appCss }],
		scripts: [
			{
				children: `document.documentElement.classList.add('dark')`,
			},
		],
	}),
	shellComponent: RootDocument,
})

function RootDocument({ children }: { children: ReactNode }) {
	return (
		<html lang="en" className="dark" suppressHydrationWarning>
			<head>
				<HeadContent />
			</head>
			<body className="bg-surface text-fg antialiased">
				{children}
				<Scripts />
			</body>
		</html>
	)
}

function RootComponent() {
	return (
		<div className="flex h-screen">
			<ComponentTree />
			<main className="flex-1 overflow-hidden">
				<Outlet />
			</main>
		</div>
	)
}

// Attach route component
Route.update({ component: RootComponent })
