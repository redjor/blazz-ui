import { Circle, type LucideIcon } from "lucide-react"
import type { NavigationItem } from "@blazz/ui/types/navigation"
import { sidebarConfig } from "./navigation"

export interface ComponentNavItem {
	title: string
	href: string
}

export interface ComponentNavCategory {
	id: string
	title: string
	description: string
	icon: LucideIcon
	items: ComponentNavItem[]
}

const categoryDescriptions: Record<string, string> = {
	"comp-layout": "Primitives for spacing, alignment and page composition.",
	"comp-actions": "Buttons, menus and interactive triggers.",
	"comp-forms": "Form controls for collecting and editing data.",
	"comp-feedback": "Alerts, badges and loading states.",
	"comp-overlays": "Dialogs, popovers and floating surfaces.",
	"comp-navigation": "Breadcrumbs, tabs and wayfinding patterns.",
	"comp-charts": "Bar, line, area, pie and radar chart components.",
	"comp-data-display": "Tables, avatars and content presentation.",
	"comp-foundations": "Design tokens, color and typography fundamentals.",
	"ai-chat": "Conversation, messages and prompt input components.",
	"ai-reasoning": "Reasoning, chain-of-thought and source components.",
	"ai-tools": "Confirmation, model selection and context components.",
	"ai-data": "KPIs, charts, tables and progress indicators.",
	"ai-entities": "Profile cards and entity representations.",
	"ai-workflow": "Tasks, approvals, polls and communication previews.",
	"ai-planning": "Timelines, events, calendars and availability.",
	"ai-commerce": "Invoices, pricing and transaction components.",
	"ai-content": "Media previews and content summary components.",
}

function normalizeId(value: string) {
	return value
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "")
}

function mapCategoryItem(item: NavigationItem): ComponentNavItem | null {
	if (!item.url) return null
	return { title: item.title, href: item.url }
}

function mapCategory(item: NavigationItem): ComponentNavCategory | null {
	if (!item.items?.length) return null

	const id = item.id ?? normalizeId(item.title)
	const mappedItems = item.items
		.map(mapCategoryItem)
		.filter((entry): entry is ComponentNavItem => Boolean(entry))

	if (mappedItems.length === 0) return null

	return {
		id,
		title: item.title,
		description: categoryDescriptions[id] ?? item.description ?? "Component category.",
		icon: item.icon ?? Circle,
		items: mappedItems,
	}
}

export const componentsNavigation: ComponentNavCategory[] = sidebarConfig.navigation
	.filter((section) => section.id === "components" || section.id === "ai")
	.flatMap((section) => section.items)
	.map(mapCategory)
	.filter((category): category is ComponentNavCategory => Boolean(category))
