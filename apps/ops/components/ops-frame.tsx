"use client"

import { AppFrame, type NavGroup, type NavItem } from "@blazz/pro/components/blocks/app-frame"
import {
	Banknote,
	Bookmark,
	CheckSquare,
	Clock,
	FileText,
	FolderOpen,
	Key,
	LayoutDashboard,
	MessageSquare,
	Package,
	Receipt,
	Rocket,
	Settings,
	Sun,
	Users,
} from "lucide-react"
import type { ReactNode } from "react"
import { useMemo } from "react"
import { BlazzLogo } from "@/components/blazz-logo"
import { type FeatureFlag, isEnabled } from "@/lib/features"
import { OpsUserMenu } from "./ops-user-menu"

interface NavItemWithFlag extends NavItem {
	flag?: FeatureFlag
	children?: NavItemWithFlag[]
}

interface NavGroupWithFlag {
	label?: string
	items: NavItemWithFlag[]
}

const allNavGroups: NavGroupWithFlag[] = [
	{
		items: [
			{ title: "Dashboard", url: "/", icon: LayoutDashboard, flag: "dashboard" },
			{ title: "Aujourd'hui", url: "/today", icon: Sun, flag: "today" },
		],
	},
	{
		label: "Activité",
		items: [
			{ title: "Clients", url: "/clients", icon: Users, flag: "clients" },
			{ title: "Projets", url: "/projects", icon: FolderOpen, flag: "projects" },
			{
				title: "Suivi de temps",
				url: "/time",
				icon: Clock,
				flag: "time",
				children: [{ title: "Récapitulatif", url: "/recap", flag: "recap" }],
			},
			{ title: "Factures", url: "/invoices", icon: Receipt, flag: "invoicing" },
			{ title: "Finances", url: "/finances", icon: Banknote, flag: "finances" },
			{ title: "Todos", url: "/todos", icon: CheckSquare, flag: "todos" },
		],
	},
	{
		label: "Outils",
		items: [
			{ title: "Notes", url: "/notes", icon: FileText },
			{ title: "Bookmarks", url: "/bookmarks", icon: Bookmark, flag: "bookmarks" },
			{ title: "Chat", url: "/chat", icon: MessageSquare, flag: "chat" },
		],
	},
	{
		label: "Admin",
		items: [
			{ title: "Deployments", url: "/deployments", icon: Rocket, flag: "deployments" },
			{ title: "Packages", url: "/packages", icon: Package, flag: "packages" },
			{ title: "Licences", url: "/licenses", icon: Key, flag: "licenses" },
			{ title: "Paramètres", url: "/settings", icon: Settings, flag: "settings" },
		],
	},
]

function filterItems(items: NavItemWithFlag[]): NavItem[] {
	return items
		.filter((item) => !item.flag || isEnabled(item.flag))
		.map((item) => {
			const { flag, children, ...rest } = item
			if (children?.length) {
				const filtered = filterItems(children)
				return filtered.length > 0 ? { ...rest, children: filtered } : rest
			}
			return rest
		})
}

function filterGroups(groups: NavGroupWithFlag[]): NavGroup[] {
	return groups
		.map((group) => ({
			label: group.label,
			items: filterItems(group.items),
		}))
		.filter((group) => group.items.length > 0)
}

export function OpsFrame({ children }: { children: ReactNode }) {
	const navGroups = useMemo(() => filterGroups(allNavGroups), [])

	return (
		<AppFrame
			logo={<BlazzLogo className="text-fg" />}
			navItems={navGroups}
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
