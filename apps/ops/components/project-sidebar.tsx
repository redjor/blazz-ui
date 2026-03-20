"use client"

import { BlockStack } from "@blazz/ui/components/ui/block-stack"
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

interface ProjectSidebarProps {
	basePath: string
}

const navItems = [
	{ label: "Vue d'ensemble", href: "", icon: LayoutDashboard },
	{ label: "Temps", href: "/time", icon: Clock },
	{ label: "Todos", href: "/todos", icon: CheckSquare },
	{ label: "Factures", href: "/invoices", icon: Receipt },
	{ label: "Notes", href: "/notes", icon: StickyNote },
	{ label: "Contrats", href: "/contracts", icon: FileStack },
]

export function ProjectSidebar({ basePath }: ProjectSidebarProps) {
	const pathname = usePathname()

	function isActive(href: string) {
		const full = basePath + href
		if (href === "") {
			return pathname === full || pathname === full + "/"
		}
		return pathname.startsWith(full)
	}

	return (
		<nav className="w-[200px] shrink-0 border-r border-edge py-2">
			<BlockStack gap="050">
				{navItems.map((item) => {
					const active = isActive(item.href)
					const Icon = item.icon
					return (
						<Link
							key={item.href}
							href={basePath + item.href}
							className={`flex items-center gap-2 px-3 py-1.5 text-[13px] mx-1 rounded-md transition-colors ${
								active
									? "bg-surface-2 text-fg font-medium"
									: "text-fg-muted hover:text-fg hover:bg-surface-2/50"
							}`}
						>
							<Icon className="size-4 shrink-0" />
							{item.label}
						</Link>
					)
				})}
			</BlockStack>
		</nav>
	)
}
