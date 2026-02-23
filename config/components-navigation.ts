import {
	Brain,
	ChartLine,
	LayoutGrid,
	MessageCircle,
	MessageSquare,
	MousePointerClick,
	FormInput,
	Layers,
	Navigation,
	Table2,
	Wrench,
	type LucideIcon,
} from "lucide-react"

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

export const componentsNavigation: ComponentNavCategory[] = [
	{
		id: "layout",
		title: "Layout and Structure",
		description: "Primitives for spacing, alignment and page composition.",
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
		description: "Buttons, menus and interactive triggers.",
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
		description: "Form controls for collecting and editing data.",
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
		description: "Alerts, badges and loading states.",
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
		description: "Dialogs, popovers and floating surfaces.",
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
		description: "Breadcrumbs, tabs and wayfinding patterns.",
		icon: Navigation,
		items: [
			{ title: "Breadcrumb", href: "/docs/components/ui/breadcrumb" },
			{ title: "Command", href: "/docs/components/ui/command" },
			{ title: "Menu", href: "/docs/components/ui/menu" },
			{ title: "Nav Menu", href: "/docs/components/ui/nav-menu" },
			{ title: "Tabs", href: "/docs/components/ui/tabs" },
		],
	},
	{
		id: "data-display",
		title: "Data Display",
		description: "Tables, avatars and content presentation.",
		icon: Table2,
		items: [
			{ title: "Avatar", href: "/docs/components/ui/avatar" },
			{ title: "Table", href: "/docs/components/ui/table" },
		],
	},
	{
		id: "ai-chat",
		title: "Chat",
		description: "Conversation, messages and prompt input components.",
		icon: MessageCircle,
		items: [
			{ title: "Conversation", href: "/docs/components/ai/chat/conversation" },
			{ title: "Message", href: "/docs/components/ai/chat/message" },
			{ title: "Prompt Input", href: "/docs/components/ai/chat/prompt-input" },
			{ title: "Suggestion", href: "/docs/components/ai/chat/suggestion" },
			{ title: "Attachments", href: "/docs/components/ai/chat/attachments" },
			{ title: "Shimmer", href: "/docs/components/ai/chat/shimmer" },
		],
	},
	{
		id: "ai-reasoning",
		title: "Reasoning",
		description: "Chain of thought, sources and citation components.",
		icon: Brain,
		items: [
			{ title: "Reasoning", href: "/docs/components/ai/reasoning" },
			{ title: "Chain of Thought", href: "/docs/components/ai/chain-of-thought" },
			{ title: "Sources", href: "/docs/components/ai/sources" },
			{ title: "Inline Citation", href: "/docs/components/ai/inline-citation" },
		],
	},
	{
		id: "ai-tools",
		title: "Tools",
		description: "Confirmation, model selection and context components.",
		icon: Wrench,
		items: [
			{ title: "Confirmation", href: "/docs/components/ai/confirmation" },
			{ title: "Model Selector", href: "/docs/components/ai/model-selector" },
			{ title: "Context", href: "/docs/components/ai/context" },
		],
	},
	{
		id: "ai-generative",
		title: "Generative UI",
		description: "Rich data blocks rendered inline in conversations.",
		icon: ChartLine,
		items: [
			{ title: "Metric Card", href: "/docs/components/ai/metric-card" },
			{ title: "Stats Row", href: "/docs/components/ai/stats-row" },
			{ title: "Mini Chart", href: "/docs/components/ai/mini-chart" },
			{ title: "Comparison Table", href: "/docs/components/ai/comparison-table" },
			{ title: "Progress Card", href: "/docs/components/ai/progress-card" },
			{ title: "Data List", href: "/docs/components/ai/data-list" },
			{ title: "Data Grid", href: "/docs/components/ai/data-grid" },
			{ title: "Candidate Card", href: "/docs/components/ai/candidate-card" },
			{ title: "Contact Card", href: "/docs/components/ai/contact-card" },
			{ title: "Company Card", href: "/docs/components/ai/company-card" },
			{ title: "Deal Card", href: "/docs/components/ai/deal-card" },
			{ title: "User Card", href: "/docs/components/ai/user-card" },
			{ title: "Timeline", href: "/docs/components/ai/timeline" },
			{ title: "Event Card", href: "/docs/components/ai/event-card" },
			{ title: "Status Update", href: "/docs/components/ai/status-update" },
			{ title: "Approval Card", href: "/docs/components/ai/approval-card" },
			{ title: "Action List", href: "/docs/components/ai/action-list" },
			{ title: "Poll Card", href: "/docs/components/ai/poll-card" },
			{ title: "File Card", href: "/docs/components/ai/file-card" },
			{ title: "Link Preview", href: "/docs/components/ai/link-preview" },
			{ title: "Image Gallery", href: "/docs/components/ai/image-gallery" },
		],
	},
]
