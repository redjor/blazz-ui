"use client"

import {
	CheckSquare,
	Clock,
	FileStack,
	LayoutDashboard,
	Receipt,
	StickyNote,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@blazz/ui/lib/utils"

interface ProjectTabsProps {
	basePath: string
}

const tabs = [
	{ label: "Vue d'ensemble", href: "", icon: LayoutDashboard },
	{ label: "Temps", href: "/time", icon: Clock },
	{ label: "Todos", href: "/todos", icon: CheckSquare },
	{ label: "Factures", href: "/invoices", icon: Receipt },
	{ label: "Notes", href: "/notes", icon: StickyNote },
	{ label: "Contrats", href: "/contracts", icon: FileStack },
]

export function ProjectTabs({ basePath }: ProjectTabsProps) {
	const pathname = usePathname()

	function isActive(href: string) {
		const full = basePath + href
		if (href === "") {
			return pathname === full || pathname === full + "/"
		}
		return pathname.startsWith(full)
	}

	return (
		<nav className="border-b border-edge">
			<div className="flex items-center gap-1 px-6">
				{tabs.map((item) => {
					const active = isActive(item.href)
					const Icon = item.icon
					return (
						<Link
							key={item.href}
							href={basePath + item.href}
							className={cn(
								"relative inline-flex items-center gap-1.5 px-2.5 py-2 text-sm font-medium whitespace-nowrap transition-colors",
								"[&_svg]:size-4 [&_svg]:shrink-0",
								active ? "text-fg" : "text-fg-muted hover:text-fg",
								// Underline indicator — same pattern as TabsTrigger variant=line
								"after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-fg after:rounded-full after:transition-opacity",
								active ? "after:opacity-100" : "after:opacity-0"
							)}
						>
							<Icon />
							{item.label}
						</Link>
					)
				})}
			</div>
		</nav>
	)
}
