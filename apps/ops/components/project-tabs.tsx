"use client"

import { NavTabs } from "@blazz/ui/components/patterns/nav-tabs"

const tabs = [
	{ label: "Vue d'ensemble", href: "" },
	{ label: "Temps", href: "/time" },
	{ label: "Todos", href: "/todos" },
	{ label: "Factures", href: "/invoices" },
	{ label: "Notes", href: "/notes" },
	{ label: "Contrats", href: "/contracts" },
]

export function ProjectTabs({ basePath }: { basePath: string }) {
	return <NavTabs tabs={tabs} basePath={basePath} />
}
