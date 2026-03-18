"use client"

import { type FeatureFlag, isEnabled } from "@/lib/features"
import { AppFrame, type NavItem } from "@blazz/pro/components/blocks/app-frame"
import {
	Banknote,
	CheckSquare,
	Clock,
	FolderOpen,
	FileText,
	Key,
	LayoutDashboard,
	MessageSquare,
	Package,
	Settings,
	Sun,
	Users,
} from "lucide-react"
import type { ReactNode } from "react"
import { useMemo } from "react"
import { BlazzLogo } from "@/components/blazz-logo"
import { OpsUserMenu } from "./ops-user-menu"

interface NavItemWithFlag extends NavItem {
	flag?: FeatureFlag
	children?: NavItemWithFlag[]
}

const allNavItems: NavItemWithFlag[] = [
	{ title: "Dashboard", url: "/", icon: LayoutDashboard, flag: "dashboard" },
	{ title: "Aujourd'hui", url: "/today", icon: Sun, flag: "today" },
	{ title: "Projets", url: "/projects", icon: FolderOpen, flag: "projects" },
	{ title: "Clients", url: "/clients", icon: Users, flag: "clients" },
	{
		title: "Suivi de temps",
		url: "/time",
		icon: Clock,
		flag: "time",
		children: [{ title: "Récapitulatif", url: "/recap", flag: "recap" }],
	},
	{ title: "Finances", url: "/finances", icon: Banknote, flag: "finances" },
	{ title: "Todos", url: "/todos", icon: CheckSquare, flag: "todos" },
	{ title: "Notes", url: "/notes", icon: FileText },
	{ title: "Chat", url: "/chat", icon: MessageSquare, flag: "chat" },
	{ title: "Packages", url: "/packages", icon: Package, flag: "packages" },
	{ title: "Licences", url: "/licenses", icon: Key, flag: "licenses" },
	{ title: "Paramètres", url: "/settings", icon: Settings, flag: "settings" },
]

function filterByFlag(items: NavItemWithFlag[]): NavItem[] {
	return items
		.filter((item) => !item.flag || isEnabled(item.flag))
		.map((item) => {
			const { flag, children, ...rest } = item
			if (children?.length) {
				const filtered = filterByFlag(children)
				return filtered.length > 0 ? { ...rest, children: filtered } : rest
			}
			return rest
		})
}

export function OpsFrame({ children }: { children: ReactNode }) {
	const navItems = useMemo(() => filterByFlag(allNavItems), [])

	return (
		<AppFrame
			logo={<BlazzLogo className="text-fg" />}
			navItems={navItems}
			sidebarFooter={<OpsUserMenu />}
			tabs={{
				storageKey: "ops-tabs",
				alwaysShow: true,
				defaultTab: { url: "/", title: "Dashboard" },
			}}
		>
			{children}
		</AppFrame>
	)
}
