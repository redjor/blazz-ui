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
	Bell,
	MessageSquare,
	Package,
	Receipt,
	Rocket,
	Rss,
	Settings,
	Sun,
	Users,
} from "lucide-react"
import { useQuery } from "convex/react"
import type { ReactNode } from "react"
import { useMemo } from "react"
import { api } from "@/convex/_generated/api"
import { BlazzLogo } from "@/components/blazz-logo"
import type { FeatureFlag } from "@/lib/features"
import { useFeatureFlags } from "@/lib/feature-flags-context"
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
			{ title: "Veille", url: "/veille", icon: Rss, flag: "veille" },
			{ title: "Chat", url: "/chat", icon: MessageSquare, flag: "chat" },
			{ title: "Notifications", url: "/notifications", icon: Bell, flag: "notifications" },
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

function filterItems(items: NavItemWithFlag[], isEnabled: (flag: FeatureFlag) => boolean): NavItem[] {
	return items
		.filter((item) => !item.flag || isEnabled(item.flag))
		.map((item) => {
			const { flag, children, ...rest } = item
			if (children?.length) {
				const filtered = filterItems(children, isEnabled)
				return filtered.length > 0 ? { ...rest, children: filtered } : rest
			}
			return rest
		})
}

function filterGroups(groups: NavGroupWithFlag[], isEnabled: (flag: FeatureFlag) => boolean): NavGroup[] {
	return groups
		.map((group) => ({
			label: group.label,
			items: filterItems(group.items, isEnabled),
		}))
		.filter((group) => group.items.length > 0)
}

export function OpsFrame({ children }: { children: ReactNode }) {
	const { isEnabled } = useFeatureFlags()
	const unreadCount = useQuery(api.notifications.unreadCount)

	const navGroups = useMemo(() => {
		const filtered = filterGroups(allNavGroups, isEnabled)
		if (!unreadCount) return filtered
		return filtered.map((group) => ({
			...group,
			items: group.items.map((item) =>
				item.url === "/notifications"
					? { ...item, title: `Notifications (${unreadCount})` }
					: item,
			),
		}))
	}, [isEnabled, unreadCount])

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
