"use client"

import { RouteTabs } from "@blazz/ui/components/patterns/route-tabs"
import {
	CheckSquare,
	Clock,
	FileStack,
	LayoutDashboard,
	Receipt,
	StickyNote,
} from "lucide-react"

const tabs = [
	{ label: "Vue d'ensemble", href: "", icon: LayoutDashboard },
	{ label: "Temps", href: "/time", icon: Clock },
	{ label: "Todos", href: "/todos", icon: CheckSquare },
	{ label: "Factures", href: "/invoices", icon: Receipt },
	{ label: "Notes", href: "/notes", icon: StickyNote },
	{ label: "Contrats", href: "/contracts", icon: FileStack },
]

export function ProjectTabs({ basePath }: { basePath: string }) {
	return <RouteTabs tabs={tabs} basePath={basePath} />
}
