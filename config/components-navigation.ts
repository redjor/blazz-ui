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
			{ title: "Bleed", href: "/docs/components/layout/bleed" },
			{ title: "Block Stack", href: "/docs/components/layout/block-stack" },
			{ title: "Box", href: "/docs/components/layout/box" },
			{ title: "Callout Card", href: "/docs/components/layout/callout-card" },
			{ title: "Card", href: "/docs/components/layout/card" },
			{ title: "Divider", href: "/docs/components/layout/divider" },
			{ title: "Grid", href: "/docs/components/layout/grid" },
			{ title: "Inline Grid", href: "/docs/components/layout/inline-grid" },
			{ title: "Inline Stack", href: "/docs/components/layout/inline-stack" },
		],
	},
	{
		id: "actions",
		title: "Actions",
		icon: MousePointerClick,
		items: [
			{ title: "Button", href: "/docs/components/ui/button" },
			{ title: "Button Group", href: "/docs/components/ui/button-group" },
			{ title: "Dropdown Menu", href: "/docs/components/ui/dropdown-menu" },
		],
	},
	{
		id: "forms",
		title: "Selection and Input",
		icon: FormInput,
		items: [
			{ title: "Checkbox", href: "/docs/components/ui/checkbox" },
			{ title: "Combobox", href: "/docs/components/ui/combobox" },
			{ title: "Field", href: "/docs/components/ui/field" },
			{ title: "Input", href: "/docs/components/ui/input" },
			{ title: "Label", href: "/docs/components/ui/label" },
			{ title: "Select", href: "/docs/components/ui/select" },
			{ title: "Switch", href: "/docs/components/ui/switch" },
			{ title: "Tags Input", href: "/docs/components/ui/tags-input" },
			{ title: "Textarea", href: "/docs/components/ui/textarea" },
		],
	},
	{
		id: "feedback",
		title: "Feedback Indicators",
		icon: MessageSquare,
		items: [
			{ title: "Alert", href: "/docs/components/ui/alert" },
			{ title: "Badge", href: "/docs/components/ui/badge" },
			{ title: "Banner", href: "/docs/components/ui/banner" },
			{ title: "Skeleton", href: "/docs/components/ui/skeleton" },
		],
	},
	{
		id: "overlays",
		title: "Overlays",
		icon: Layers,
		items: [
			{ title: "Confirmation Dialog", href: "/docs/components/ui/confirmation-dialog" },
			{ title: "Dialog", href: "/docs/components/ui/dialog" },
			{ title: "Popover", href: "/docs/components/ui/popover" },
			{ title: "Sheet", href: "/docs/components/ui/sheet" },
			{ title: "Tooltip", href: "/docs/components/ui/tooltip" },
		],
	},
	{
		id: "navigation",
		title: "Navigation",
		icon: Navigation,
		items: [
			{ title: "Breadcrumb", href: "/docs/components/ui/breadcrumb" },
			{ title: "Command", href: "/docs/components/ui/command" },
			{ title: "Menu", href: "/docs/components/ui/menu" },
			{ title: "Tabs", href: "/docs/components/ui/tabs" },
		],
	},
	{
		id: "data-display",
		title: "Data Display",
		icon: Table2,
		items: [
			{ title: "Avatar", href: "/docs/components/ui/avatar" },
			{ title: "Table", href: "/docs/components/ui/table" },
		],
	},
]
