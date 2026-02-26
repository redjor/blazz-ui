"use client"

import type { LucideIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import * as React from "react"
import type { NavigationSection } from "../types/navigation"

export interface CommandPaletteItem {
	id: string
	title: string
	url: string
	section?: string
	keywords?: string[]
	description?: string
	icon?: LucideIcon
	breadcrumb?: string
}

const RECENT_ITEMS_KEY = "command-palette-recent"
const MAX_RECENT_ITEMS = 5

interface UseCommandPaletteOptions {
	navigation: NavigationSection[]
	open?: boolean
	onOpenChange?: (open: boolean) => void
}

export function useCommandPalette({ navigation, open, onOpenChange }: UseCommandPaletteOptions) {
	const router = useRouter()
	const [internalOpen, setInternalOpen] = React.useState(false)
	const [recentItems, setRecentItems] = React.useState<CommandPaletteItem[]>([])

	// Use controlled state if provided, otherwise use internal state
	const isOpen = open !== undefined ? open : internalOpen
	const setIsOpen = onOpenChange ?? setInternalOpen

	// Build searchable items from navigation
	const items = React.useMemo(() => {
		const commandItems: CommandPaletteItem[] = []

		navigation.forEach((section) => {
			section.items.forEach((item) => {
				// Add main item
				commandItems.push({
					id: item.url ?? item.title,
					title: item.title,
					url: item.url ?? "",
					section: section.title,
					keywords: item.keywords,
					description: item.description,
					icon: item.icon,
					breadcrumb: section.title ?? "",
				})

				// Add nested items with parent context
				if (item.items) {
					item.items.forEach((subItem) => {
						commandItems.push({
							id: subItem.url ?? subItem.title,
							title: subItem.title,
							url: subItem.url ?? "",
							section: section.title,
							keywords: subItem.keywords,
							description: subItem.description,
							icon: subItem.icon ?? item.icon,
							breadcrumb: [section.title, item.title].filter(Boolean).join(" › "),
						})
					})
				}
			})
		})

		return commandItems
	}, [navigation])

	// Load recent items from localStorage
	React.useEffect(() => {
		try {
			const stored = localStorage.getItem(RECENT_ITEMS_KEY)
			if (stored) {
				setRecentItems(JSON.parse(stored))
			}
		} catch (error) {
			console.error("Failed to load recent items:", error)
		}
	}, [])

	// Handle keyboard shortcut (Cmd/Ctrl + K)
	React.useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault()
				setIsOpen(!isOpen)
			}
		}

		document.addEventListener("keydown", down)
		return () => document.removeEventListener("keydown", down)
	}, [])

	// Navigate to a command item
	const navigate = React.useCallback(
		(item: CommandPaletteItem) => {
			// Add to recent items (strip icon since it can't be serialized to JSON)
			const serializable = { ...item, icon: undefined }
			const newRecent = [serializable, ...recentItems.filter((i) => i.id !== item.id)].slice(
				0,
				MAX_RECENT_ITEMS
			)

			setRecentItems(newRecent)
			try {
				localStorage.setItem(RECENT_ITEMS_KEY, JSON.stringify(newRecent))
			} catch (error) {
				console.error("Failed to save recent items:", error)
			}

			// Navigate
			router.push(item.url)
			setIsOpen(false)
		},
		[recentItems, router]
	)

	return {
		isOpen,
		setIsOpen,
		items,
		recentItems,
		navigate,
	}
}
