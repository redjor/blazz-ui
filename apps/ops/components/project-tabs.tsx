"use client"

import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
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
		<nav className="border-b border-edge px-6">
			<InlineStack gap="0" wrap={false}>
				{tabs.map((item) => {
					const active = isActive(item.href)
					const Icon = item.icon
					return (
						<Link
							key={item.href}
							href={basePath + item.href}
							className={`relative flex items-center gap-1.5 px-3 py-2.5 text-[13px] transition-colors whitespace-nowrap ${
								active
									? "text-fg font-medium"
									: "text-fg-muted hover:text-fg"
							}`}
						>
							<Icon className="size-3.5 shrink-0" />
							{item.label}
							{active && (
								<span className="absolute inset-x-0 bottom-0 h-[2px] bg-brand rounded-full" />
							)}
						</Link>
					)
				})}
			</InlineStack>
		</nav>
	)
}
