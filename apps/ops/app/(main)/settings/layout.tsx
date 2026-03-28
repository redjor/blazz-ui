"use client"

import { useAppTopBar } from "@blazz/pro/components/blocks/app-frame"
import { NavMenu, NavMenuGroup, NavMenuItem } from "@blazz/ui/components/ui/nav-menu"
import { Bot, Settings, Tag, ToggleRight } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { ReactNode } from "react"

const settingsNav: {
	group: string
	items: {
		label: string
		href: string
		icon: React.ComponentType<{ className?: string }>
	}[]
}[] = [
	{
		group: "Général",
		items: [
			{ label: "Préférences", href: "/settings", icon: Settings },
			{ label: "Fonctionnalités", href: "/settings/features", icon: ToggleRight },
		],
	},
	{
		group: "Données",
		items: [{ label: "Catégories", href: "/settings/categories", icon: Tag }],
	},
	{
		group: "Agents",
		items: [{ label: "Agents", href: "/settings/agents", icon: Bot }],
	},
]

function SettingsNav() {
	const pathname = usePathname()

	const isActive = (href: string) => {
		if (href === "/settings") return pathname === "/settings"
		return pathname.startsWith(href)
	}

	return (
		<aside className="w-52 shrink-0 p-2">
			<NavMenu>
				{settingsNav.map((group) => (
					<NavMenuGroup key={group.group} label={group.group}>
						{group.items.map((item) => (
							<NavMenuItem key={item.href} active={isActive(item.href)} asChild>
								<Link href={item.href}>
									<item.icon />
									<span>{item.label}</span>
								</Link>
							</NavMenuItem>
						))}
					</NavMenuGroup>
				))}
			</NavMenu>
		</aside>
	)
}

export default function SettingsLayout({ children }: { children: ReactNode }) {
	useAppTopBar([{ label: "Paramètres", href: "/settings" }])

	return (
		<div className="flex h-full">
			<SettingsNav />
			<main className="flex-1 min-w-0">{children}</main>
		</div>
	)
}
