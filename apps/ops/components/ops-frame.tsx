"use client"

import { AppFrame, type NavGroup, type NavItem } from "@blazz/pro/components/blocks/app-frame"
import { Frame, FrameFooter, FramePanel } from "@blazz/ui/components/ui/frame-panel"
import { useMutation, useQuery } from "convex/react"
import {
	Activity,
	Banknote,
	Bell,
	Bookmark,
	Bot,
	CheckSquare,
	Clock,
	FileText,
	FolderOpen,
	Key,
	LayoutDashboard,
	MessageSquare,
	Package,
	PiggyBank,
	Receipt,
	ReceiptText,
	Rocket,
	Rss,
	Settings,
	Star,
	Sun,
	Target,
	Users,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { ComponentType, ReactNode } from "react"
import { useEffect, useMemo } from "react"
import { BlazzLogo } from "@/components/blazz-logo"
import { api } from "@/convex/_generated/api"
import { useFeatureFlags } from "@/lib/feature-flags-context"
import type { FeatureFlag } from "@/lib/features"
import { getIcon } from "@/lib/icon-palette"
import { OpsUserMenu } from "./ops-user-menu"

function AgentNavIcon({ name, status }: { name: string; status: string }) {
	const url = `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(name)}`
	return (
		<span className="relative">
			<Image src={url} alt={name} width={16} height={16} className="size-4 rounded-full shrink-0" />
			{status === "busy" && <span className="absolute -bottom-0.5 -right-0.5 size-2 rounded-full bg-emerald-500 animate-pulse ring-1 ring-surface" />}
			{status === "paused" && <span className="absolute -bottom-0.5 -right-0.5 size-2 rounded-full bg-amber-400 ring-1 ring-surface" />}
			{status === "error" && <span className="absolute -bottom-0.5 -right-0.5 size-2 rounded-full bg-red-500 ring-1 ring-surface" />}
			{status === "disabled" && <span className="absolute -bottom-0.5 -right-0.5 size-2 rounded-full bg-fg-muted/40 ring-1 ring-surface" />}
		</span>
	)
}

function createAgentIconWithStatus(name: string, status: string): ComponentType<{ className?: string }> {
	function Icon() {
		return <AgentNavIcon name={name} status={status} />
	}
	Icon.displayName = `AgentIcon(${name})`
	return Icon
}

const projectIconHex: Record<string, string> = {
	indigo: "#818cf8",
	violet: "#a78bfa",
	rose: "#fb7185",
	orange: "#fb923c",
	amber: "#fbbf24",
	emerald: "#34d399",
	sky: "#38bdf8",
	zinc: "#a1a1aa",
}

function createProjectIcon(iconId?: string, color?: string): ComponentType<{ className?: string }> {
	const ResolvedIcon = getIcon(iconId) ?? FolderOpen
	const hex = color ? projectIconHex[color] : undefined
	function ProjectNavIcon({ className }: { className?: string }) {
		return <ResolvedIcon className={className} style={hex ? { color: hex } : undefined} />
	}
	ProjectNavIcon.displayName = `ProjectIcon(${iconId})`
	return ProjectNavIcon
}

const entityTypeIcons: Record<string, ComponentType<{ className?: string }>> = {
	client: Users,
	project: FolderOpen,
	todo: CheckSquare,
	note: FileText,
	bookmark: Bookmark,
	feedItem: Rss,
}

const urlMap: Record<string, (id: string) => string> = {
	client: (id) => `/clients/${id}`,
	project: (id) => `/projects/${id}`,
	todo: () => "/todos",
	note: (id) => `/notes/${id}`,
	bookmark: () => "/bookmarks",
	feedItem: () => "/veille",
}

interface NavItemWithFlag extends NavItem {
	flag?: FeatureFlag
	children?: NavItemWithFlag[]
}

interface NavGroupWithFlag {
	label?: string
	items: NavItemWithFlag[]
	display?: "list" | "shortcuts"
}

const shortcutItems: NavItemWithFlag[] = [
	{ title: "Todos", url: "/todos", icon: CheckSquare, flag: "todos" },
	{ title: "Notes", url: "/notes", icon: FileText },
	{ title: "Bookmarks", url: "/bookmarks", icon: Bookmark, flag: "bookmarks" },
	{ title: "Veille", url: "/veille", icon: Rss, flag: "veille" },
	{ title: "Chat", url: "/chat", icon: MessageSquare, flag: "chat" },
]

const allNavGroups: NavGroupWithFlag[] = [
	{
		items: [
			{
				title: "Dashboard",
				url: "/",
				icon: LayoutDashboard,
				flag: "dashboard",
			},
			{ title: "Aujourd'hui", url: "/today", icon: Sun, flag: "today" },
			{
				title: "Inbox",
				url: "/notifications",
				icon: Bell,
				flag: "notifications",
			},
			{
				title: "Activité",
				url: "/activity",
				icon: Activity,
				flag: "agents",
			},
			{
				title: "Mission Control",
				url: "/missions",
				icon: Bot,
				flag: "missions",
			},
		],
	},
	{
		label: "Clients",
		items: [
			{ title: "Clients", url: "/clients", icon: Users, flag: "clients" },
			{
				title: "Projets",
				url: "/projects",
				icon: FolderOpen,
				flag: "projects",
			},
		],
	},
	{
		label: "Finances",
		items: [
			{ title: "Objectifs", url: "/goals", icon: Target, flag: "goals" },
			{
				title: "Suivi de temps",
				url: "/time",
				icon: Clock,
				flag: "time",
				children: [{ title: "Récapitulatif", url: "/recap", flag: "recap" }],
			},
			{ title: "Factures", url: "/invoices", icon: Receipt, flag: "invoicing" },
			{ title: "Finances", url: "/finances", icon: Banknote, flag: "finances" },
			{
				title: "Trésorerie",
				url: "/treasury",
				icon: PiggyBank,
				flag: "treasury",
			},
			{ title: "Frais pro", url: "/expenses", icon: ReceiptText, flag: "expenses" },
		],
	},
	{
		label: "Admin",
		items: [
			{
				title: "Deployments",
				url: "/deployments",
				icon: Rocket,
				flag: "deployments",
			},
			{ title: "Packages", url: "/packages", icon: Package, flag: "packages" },
			{ title: "Licences", url: "/licenses", icon: Key, flag: "licenses" },
			{
				title: "Paramètres",
				url: "/settings",
				icon: Settings,
				flag: "settings",
			},
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
			display: group.display,
			items: filterItems(group.items, isEnabled),
		}))
		.filter((group) => group.items.length > 0)
}

function OpsFooterPanel({ shortcuts }: { shortcuts: NavItem[] }) {
	const pathname = usePathname()
	const isActive = (url?: string) => {
		if (!pathname || !url) return false
		if (url === "/") return pathname === "/"
		return pathname.startsWith(url)
	}

	return (
		<Frame spacing="none">
			<FramePanel>
				<div className="grid grid-cols-[repeat(auto-fill,minmax(48px,1fr))] gap-1">
					{shortcuts.map((item) => (
						<Link
							key={item.title}
							href={item.url}
							data-active={isActive(item.url) || undefined}
							className="flex items-center justify-center aspect-square rounded-lg bg-background border border-transparent text-fg-muted transition-colors hover:border-border hover:bg-muted-foreground hover:text-fg data-[active]:bg-muted data-[active]:text-fg data-[active]:border-primary"
						>
							{item.icon && <item.icon className="size-4" />}
						</Link>
					))}
				</div>
			</FramePanel>
			<FrameFooter>
				<OpsUserMenu />
			</FrameFooter>
		</Frame>
	)
}

export function OpsFrame({ children }: { children: ReactNode }) {
	const { isEnabled } = useFeatureFlags()
	const unreadCount = useQuery(api.notifications.unreadCount)
	const agents = useQuery(api.agents.list)
	const favorites = useQuery(api.favorites.list)
	const syncFavoriteLabels = useMutation(api.favorites.syncLabels)

	useEffect(() => {
		if (favorites && favorites.length > 0) {
			syncFavoriteLabels()
		}
	}, [favorites?.length, favorites, syncFavoriteLabels]) // eslint-disable-line react-hooks/exhaustive-deps

	const filteredShortcuts = useMemo(() => filterItems(shortcutItems, isEnabled), [isEnabled])

	const navGroups = useMemo(() => {
		const filtered = filterGroups(allNavGroups, isEnabled)

		// Insert Favoris group after main nav (after Inbox)
		if (favorites && favorites.length > 0) {
			const favGroup: NavGroup = {
				label: "Favoris",
				items: favorites.map((fav) => ({
					title: fav.label,
					url: (urlMap[fav.entityType] ?? (() => "/"))(fav.entityId),
					icon: fav.entityType === "project" ? createProjectIcon((fav as any).projectIcon, (fav as any).projectColor) : (entityTypeIcons[fav.entityType] ?? Star),
				})),
			}
			// Insert before Clients group
			const insertIdx = filtered.findIndex((g) => g.label === "Clients")
			if (insertIdx >= 0) {
				filtered.splice(insertIdx, 0, favGroup)
			} else {
				filtered.push(favGroup)
			}
		}

		// Build Agents group dynamically from live data
		if (agents && agents.length > 0 && isEnabled("agents")) {
			const agentsGroup: NavGroup = {
				label: "Agents",
				items: agents.map((agent) => ({
					title: agent.name,
					url: `/agents/${agent.slug}`,
					icon: createAgentIconWithStatus(agent.name, agent.status),
				})),
			}
			// Insert Agents group after the first group (main nav)
			const firstGroup = filtered[0]
			const rest = filtered.slice(1)
			const withAgents = [firstGroup, agentsGroup, ...rest]
			if (!unreadCount) return withAgents
			return withAgents.map((group) => ({
				...group,
				items: group.items.map((item) => (item.url === "/notifications" ? { ...item, badge: unreadCount } : item)),
			}))
		}

		if (!unreadCount) return filtered
		return filtered.map((group) => ({
			...group,
			items: group.items.map((item) => (item.url === "/notifications" ? { ...item, badge: unreadCount } : item)),
		}))
	}, [isEnabled, unreadCount, agents, favorites])

	return (
		<AppFrame
			logo={<BlazzLogo className="text-fg" />}
			navItems={navGroups}
			sidebarFooter={<OpsFooterPanel shortcuts={filteredShortcuts} />}
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
