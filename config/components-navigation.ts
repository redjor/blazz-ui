import {
	LayoutGrid,
	MessageSquare,
	MousePointerClick,
	FormInput,
	Layers,
	Navigation,
	Table2,
	type LucideIcon,
} from "lucide-react"

export interface ComponentNavItem {
	title: string
	href: string
}

export interface ComponentNavCategory {
	id: string
	title: string
	icon: LucideIcon
	items: ComponentNavItem[]
}

export const componentsNavigation: ComponentNavCategory[] = [
	{
		id: "layout",
		title: "Layout and Structure",
		icon: LayoutGrid,
		items: [
			{ title: "Bleed", href: "/components/layout/bleed" },
			{ title: "Block Stack", href: "/components/layout/block-stack" },
			{ title: "Box", href: "/components/layout/box" },
			{ title: "Callout Card", href: "/components/layout/callout-card" },
			{ title: "Card", href: "/components/layout/card" },
			{ title: "Divider", href: "/components/layout/divider" },
			{ title: "Grid", href: "/components/layout/grid" },
			{ title: "Inline Grid", href: "/components/layout/inline-grid" },
			{ title: "Inline Stack", href: "/components/layout/inline-stack" },
		],
	},
	{
		id: "actions",
		title: "Actions",
		icon: MousePointerClick,
		items: [
			{ title: "Button", href: "/components/ui/button" },
			{ title: "Button Group", href: "/components/ui/button-group" },
			{ title: "Dropdown Menu", href: "/components/ui/dropdown-menu" },
		],
	},
	{
		id: "forms",
		title: "Selection and Input",
		icon: FormInput,
		items: [
			{ title: "Checkbox", href: "/components/ui/checkbox" },
			{ title: "Combobox", href: "/components/ui/combobox" },
			{ title: "Field", href: "/components/ui/field" },
			{ title: "Input", href: "/components/ui/input" },
			{ title: "Label", href: "/components/ui/label" },
			{ title: "Select", href: "/components/ui/select" },
			{ title: "Switch", href: "/components/ui/switch" },
			{ title: "Tags Input", href: "/components/ui/tags-input" },
			{ title: "Textarea", href: "/components/ui/textarea" },
		],
	},
	{
		id: "feedback",
		title: "Feedback Indicators",
		icon: MessageSquare,
		items: [
			{ title: "Alert", href: "/components/ui/alert" },
			{ title: "Badge", href: "/components/ui/badge" },
			{ title: "Banner", href: "/components/ui/banner" },
			{ title: "Skeleton", href: "/components/ui/skeleton" },
		],
	},
	{
		id: "overlays",
		title: "Overlays",
		icon: Layers,
		items: [
			{ title: "Confirmation Dialog", href: "/components/ui/confirmation-dialog" },
			{ title: "Dialog", href: "/components/ui/dialog" },
			{ title: "Popover", href: "/components/ui/popover" },
			{ title: "Sheet", href: "/components/ui/sheet" },
			{ title: "Tooltip", href: "/components/ui/tooltip" },
		],
	},
	{
		id: "navigation",
		title: "Navigation",
		icon: Navigation,
		items: [
			{ title: "Breadcrumb", href: "/components/ui/breadcrumb" },
			{ title: "Command", href: "/components/ui/command" },
			{ title: "Menu", href: "/components/ui/menu" },
			{ title: "Tabs", href: "/components/ui/tabs" },
		],
	},
	{
		id: "data-display",
		title: "Data Display",
		icon: Table2,
		items: [
			{ title: "Avatar", href: "/components/ui/avatar" },
			{ title: "Table", href: "/components/ui/table" },
		],
	},
]
