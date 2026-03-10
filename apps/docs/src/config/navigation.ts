"use client"

import type { NavigationSection, SidebarConfig } from "@blazz/ui/types/navigation"
import {
	Bot,
	Brain,
	Calendar,
	ChartLine,
	CreditCard,
	FileText,
	FormInput,
	KeyRound,
	Layers,
	Layers2,
	Save,
	LayoutGrid,
	ListChecks,
	MessageCircle,
	MessageSquare,
	MousePointerClick,
	Navigation,
	Palette,
	PanelLeft,
	Puzzle,
	Table2,
	Users,
	Wrench,
} from "lucide-react"

export const sidebarConfig: SidebarConfig = {
	user: {
		name: "Jean Dupont",
		email: "",
		role: "Administrateur",
	},
	navigation: [
		{
			id: "components",
			title: "Composants",
			items: [
				{
					id: "comp-layout",
					title: "Layout and Structure",
					url: "/docs/components/layout",
					icon: LayoutGrid,
					items: [
						{
							title: "Bleed",
							url: "/docs/components/layout/bleed",
							keywords: ["edge-to-edge", "full-width", "breakout", "overflow"],
						},
						{
							title: "Block Stack",
							url: "/docs/components/layout/block-stack",
							keywords: ["vertical", "vstack", "column", "stack"],
						},
						{
							title: "Box",
							url: "/docs/components/layout/box",
							keywords: ["container", "wrapper", "div", "spacing"],
						},
						{
							title: "Callout Card",
							url: "/docs/components/layout/callout-card",
							keywords: ["info", "warning", "tip", "note", "highlight"],
						},
						{
							title: "Card",
							url: "/docs/components/layout/card",
							keywords: ["container", "panel", "surface", "tile"],
						},
						{
							title: "Divider",
							url: "/docs/components/layout/divider",
							keywords: ["separator", "line", "hr", "horizontal rule"],
						},
						{
							title: "Frame Panel",
							url: "/docs/components/ui/frame-panel",
							keywords: ["shell", "wrapper", "app frame", "layout shell"],
						},
						{
							title: "Grid",
							url: "/docs/components/layout/grid",
							keywords: ["columns", "responsive", "layout grid", "css grid"],
						},
						{
							title: "Inline Grid",
							url: "/docs/components/layout/inline-grid",
							keywords: ["horizontal grid", "row grid"],
						},
						{
							title: "Inline Stack",
							url: "/docs/components/layout/inline-stack",
							keywords: ["horizontal", "hstack", "row", "flex row"],
						},
						{
							title: "Page",
							url: "/docs/components/layout/page-component",
							keywords: ["page layout", "page wrapper", "page shell"],
						},
					],
				},
				{
					id: "comp-actions",
					title: "Actions",
					url: "/docs/components/actions",
					icon: MousePointerClick,
					items: [
						{
							title: "Button",
							url: "/docs/components/ui/button",
							keywords: ["btn", "action", "click", "submit", "cta", "press"],
						},
						{
							title: "Button Group",
							url: "/docs/components/ui/button-group",
							keywords: ["toolbar", "action bar", "button bar", "segmented"],
						},
						{
							title: "Dropdown Menu",
							url: "/docs/components/ui/dropdown-menu",
							keywords: ["context menu", "right-click", "actions menu", "menu", "popover menu"],
						},
					],
				},
				{
					id: "comp-forms",
					title: "Selection and Input",
					url: "/docs/components/forms",
					icon: FormInput,
					items: [
						{
							title: "Calendar",
							url: "/docs/components/ui/calendar",
							keywords: ["date picker", "datepicker", "month", "day"],
						},
						{
							title: "Checkbox",
							url: "/docs/components/ui/checkbox",
							keywords: ["check", "tick", "toggle", "boolean", "form"],
						},
						{
							title: "Color Picker",
							url: "/docs/components/ui/color-picker",
							keywords: ["color chooser", "palette", "hex", "rgb", "color input"],
						},
						{
							title: "Combobox",
							url: "/docs/components/ui/combobox",
							keywords: [
								"autocomplete",
								"typeahead",
								"searchable select",
								"search select",
								"filterable",
							],
						},
						{
							title: "Cascading Select",
							url: "/docs/components/ui/cascading-select",
							keywords: [
								"hierarchy",
								"drill-down",
								"nested select",
								"cascading",
								"tree select",
								"category picker",
							],
						},
						{
							title: "Currency Input",
							url: "/docs/components/ui/currency-input",
							keywords: ["money", "price", "dollar", "euro", "amount", "financial"],
						},
						{
							title: "Date Selector",
							url: "/docs/components/ui/date-selector",
							keywords: ["date picker", "datepicker", "date range", "date input"],
						},
						{
							title: "Field",
							url: "/docs/components/ui/field",
							keywords: [
								"form field",
								"input wrapper",
								"label input",
								"form group",
								"field wrapper",
							],
						},
						{
							title: "File Upload",
							url: "/docs/components/ui/file-upload",
							keywords: ["file input", "dropzone", "upload", "drag and drop", "attachment"],
						},
						{
							title: "Input",
							url: "/docs/components/ui/input",
							keywords: ["text field", "text input", "form input", "textbox"],
						},
						{
							title: "Label",
							url: "/docs/components/ui/label",
							keywords: ["form label", "field label", "input label"],
						},
						{
							title: "Number Input",
							url: "/docs/components/ui/number-input",
							keywords: ["numeric", "spinner", "counter", "stepper input", "quantity"],
						},
						{
							title: "OTP Input",
							url: "/docs/components/ui/otp-input",
							keywords: ["verification", "2fa", "code", "pin", "one-time password"],
						},
						{
							title: "Password Input",
							url: "/docs/components/ui/password-input",
							keywords: ["secret", "password field", "hide show", "visibility toggle"],
						},
						{
							title: "Phone Input",
							url: "/docs/components/ui/phone-input",
							keywords: ["telephone", "phone number", "international", "country code"],
						},
						{
							title: "Radio Group",
							url: "/docs/components/ui/radio-group",
							keywords: ["radio button", "single select", "option group", "choice"],
						},
						{
							title: "Rating",
							url: "/docs/components/ui/rating",
							keywords: ["stars", "score", "review", "rate", "feedback"],
						},
						{
							title: "Search Input",
							url: "/docs/components/ui/search-input",
							keywords: ["search bar", "search field", "filter", "find"],
						},
						{
							title: "Select",
							url: "/docs/components/ui/select",
							keywords: ["dropdown", "picker", "chooser", "option list", "single select"],
						},
						{
							title: "Slider",
							url: "/docs/components/ui/slider",
							keywords: ["range", "scrubber", "track", "value slider"],
						},
						{
							title: "Switch",
							url: "/docs/components/ui/switch",
							keywords: ["toggle", "on off", "boolean", "flip"],
						},
						{
							title: "Tags Input",
							url: "/docs/components/ui/tags-input",
							keywords: ["chips", "tokens", "multi-select", "tag", "pill input"],
						},
						{
							title: "Textarea",
							url: "/docs/components/ui/textarea",
							keywords: ["multiline", "text area", "long text", "rich input", "paragraph"],
						},
						{
							title: "Time Picker",
							url: "/docs/components/ui/time-picker",
							keywords: ["time input", "clock", "hour", "minute", "time select"],
						},
					],
				},
				{
					id: "comp-feedback",
					title: "Feedback Indicators",
					url: "/docs/components/feedback",
					icon: MessageSquare,
					items: [
						{
							title: "Alert",
							url: "/docs/components/ui/alert",
							keywords: ["warning", "info", "error", "success", "message"],
						},
						{
							title: "Badge",
							url: "/docs/components/ui/badge",
							keywords: ["tag", "chip", "label", "pill", "status"],
						},
						{
							title: "Banner",
							url: "/docs/components/ui/banner",
							keywords: ["announcement", "notice", "strip", "bar", "info bar"],
						},
						{
							title: "Empty",
							url: "/docs/components/ui/empty",
							keywords: ["no data", "placeholder", "zero state", "blank", "empty state"],
						},
						{
							title: "Skeleton",
							url: "/docs/components/ui/skeleton",
							keywords: ["loading", "placeholder", "shimmer", "ghost", "pulse"],
						},
						{
							title: "Toast",
							url: "/docs/components/ui/toast",
							keywords: ["notification", "snackbar", "sonner", "feedback", "message", "toaster"],
						},
					],
				},
				{
					id: "comp-overlays",
					title: "Overlays",
					url: "/docs/components/overlays",
					icon: Layers,
					items: [
						{
							title: "Confirmation Dialog",
							url: "/docs/components/ui/confirmation-dialog",
							keywords: ["confirm", "delete confirm", "action confirm", "are you sure"],
						},
						{
							title: "Dialog",
							url: "/docs/components/ui/dialog",
							keywords: ["modal", "popup", "overlay", "lightbox", "window"],
						},
						{
							title: "Popover",
							url: "/docs/components/ui/popover",
							keywords: ["dropdown", "popup", "floating", "bubble", "fly-out"],
						},
						{
							title: "Sheet",
							url: "/docs/components/ui/sheet",
							keywords: ["drawer", "slide panel", "side panel", "bottom sheet", "sliding"],
						},
						{
							title: "Tooltip",
							url: "/docs/components/ui/tooltip",
							keywords: ["hint", "help", "hover text", "info tip", "help text"],
						},
					],
				},
				{
					id: "comp-navigation",
					title: "Navigation",
					url: "/docs/components/navigation",
					icon: Navigation,
					items: [
						{
							title: "Breadcrumb",
							url: "/docs/components/ui/breadcrumb",
							keywords: ["path", "crumbs", "trail", "navigation path"],
						},
						{
							title: "Command",
							url: "/docs/components/ui/command",
							keywords: ["search", "cmd", "cmdk", "command palette", "spotlight"],
						},
						{
							title: "Menu",
							url: "/docs/components/ui/menu",
							keywords: ["navigation menu", "nav", "sidebar menu", "link list"],
						},
						{
							title: "Menubar",
							url: "/docs/components/ui/menubar",
							keywords: ["menu bar", "app menu", "top menu", "header menu"],
						},
						{
							title: "Nav Menu",
							url: "/docs/components/ui/nav-menu",
							keywords: ["navigation", "nav bar", "site nav", "header nav"],
						},
						{
							title: "Pagination",
							url: "/docs/components/ui/pagination",
							keywords: ["pager", "page numbers", "next previous", "page navigation"],
						},
						{
							title: "Stepper",
							url: "/docs/components/ui/stepper",
							keywords: ["wizard", "multi-step", "steps", "progress steps", "workflow"],
						},
						{
							title: "Tabs",
							url: "/docs/components/ui/tabs",
							keywords: ["tab bar", "tab navigation", "panel tabs", "tabbed"],
						},
					],
				},
				{
					id: "comp-data-display",
					title: "Data Display",
					url: "/docs/components/data-display",
					icon: Table2,
					items: [
						{
							title: "Avatar",
							url: "/docs/components/ui/avatar",
							keywords: ["profile picture", "user image", "photo", "initials"],
						},
						{
							title: "Cell Types",
							url: "/docs/components/ui/cells",
							keywords: ["table cell", "grid cell", "data cell", "column type"],
						},
						{
							title: "Data Table",
							url: "/docs/components/blocks/data-table",
							keywords: ["grid", "datagrid", "sorting", "filtering", "pagination", "bulk actions"],
						},
						{
							title: "Property",
							url: "/docs/components/ui/property",
							keywords: ["key value", "detail", "metadata", "attribute", "property list"],
						},
						{
							title: "Property Card",
							url: "/docs/components/blocks/property-card",
							keywords: ["detail card", "info card", "property group", "metadata card"],
						},
						{
							title: "Stats Strip",
							url: "/docs/components/blocks/stats-strip",
							keywords: ["metrics", "kpi", "statistics", "dashboard stats", "sparkline"],
						},
						{
							title: "Table",
							url: "/docs/components/ui/table",
							keywords: ["html table", "data table", "grid", "rows columns"],
						},
						{
							title: "Timeline",
							url: "/docs/components/ui/timeline",
							keywords: ["activity", "history", "feed", "events", "log"],
						},
						{
							title: "Tree View",
							url: "/docs/components/ui/tree-view",
							keywords: ["file tree", "hierarchy", "directory", "nested list", "expandable"],
						},
					],
				},
				// --- Patterns (merged from former "patterns" section) ---
				{
					id: "pat-app-shell",
					title: "App Shell",
					url: "/docs/components/patterns/app-frame",
					icon: PanelLeft,
					items: [
						{
							title: "App Frame",
							url: "/docs/components/patterns/app-frame",
							keywords: ["app shell", "layout wrapper", "frame", "application frame"],
						},
						{
							title: "Dashboard Layout",
							url: "/docs/components/patterns/dashboard-layout",
							keywords: ["dashboard", "layout", "admin layout", "dashboard shell"],
						},
						{
							title: "App Sidebar",
							url: "/docs/components/patterns/app-sidebar",
							keywords: ["sidebar", "nav sidebar", "app nav", "side navigation"],
						},
						{
							title: "App Top Bar",
							url: "/docs/components/patterns/app-top-bar",
							keywords: ["top bar", "header", "app header", "navbar"],
						},
						{
							title: "Top Bar",
							url: "/docs/components/patterns/top-bar",
							keywords: ["top bar", "header bar", "site header"],
						},
						{
							title: "Layout Frame",
							url: "/docs/components/patterns/layout-frame",
							keywords: ["layout", "frame", "shell", "wrapper"],
						},
					],
				},
				{
					id: "pat-navigation",
					title: "Navigation",
					url: "/docs/components/patterns/navbar",
					icon: Navigation,
					items: [
						{
							title: "Navbar",
							url: "/docs/components/patterns/navbar",
							keywords: ["navigation bar", "site nav", "top nav", "header nav"],
						},
						{
							title: "Nav Tabs",
							url: "/docs/components/patterns/nav-tabs",
							keywords: ["navigation tabs", "tab nav", "section tabs"],
						},
						{
							title: "Tab Bar",
							url: "/docs/components/patterns/tab-bar",
							keywords: ["bottom bar", "tab navigation", "mobile tabs"],
						},
						{
							title: "Navigation Tabs",
							url: "/docs/components/patterns/navigation-tabs",
							keywords: ["tabs", "page tabs", "nav tabs", "tabbed navigation"],
						},
					],
				},
				{
					id: "pat-forms",
					title: "Forms",
					url: "/docs/components/patterns/form-field",
					icon: FormInput,
					items: [
						{
							title: "Form Field",
							url: "/docs/components/patterns/form-field",
							keywords: ["field", "form input", "form group", "label input"],
						},
						{
							title: "Form Section",
							url: "/docs/components/patterns/form-section",
							keywords: ["form group", "form section", "fieldset", "form block"],
						},
						{
							title: "Field Grid",
							url: "/docs/components/patterns/field-grid",
							keywords: ["form grid", "field layout", "form columns", "input grid"],
						},
					],
				},
				{
					id: "pat-media",
					title: "Media",
					url: "/docs/components/patterns/image-upload",
					icon: FileText,
					items: [
						{
							title: "Image Upload",
							url: "/docs/components/patterns/image-upload",
							keywords: ["upload", "image", "photo", "file upload", "dropzone"],
						},
					],
				},
				{
					id: "pat-utilities",
					title: "Utilities",
					url: "/docs/components/patterns/command-palette",
					icon: Wrench,
					items: [
						{
							title: "Command Palette",
							url: "/docs/components/patterns/command-palette",
							keywords: ["search", "cmd", "cmdk", "spotlight", "quick launch"],
						},
						{
							title: "Error State",
							url: "/docs/components/patterns/error-state",
							keywords: ["error", "404", "500", "not found", "error page"],
						},
						{
							title: "Theme Toggle",
							url: "/docs/components/patterns/theme-toggle",
							keywords: ["dark mode", "light mode", "color scheme", "theme switcher"],
						},
						{
							title: "Page Header Shell",
							url: "/docs/components/patterns/page-header-shell",
							keywords: ["page header", "hero", "page title", "header shell"],
						},
						{
							title: "User Menu",
							url: "/docs/components/patterns/user-menu",
							keywords: ["user", "account", "profile", "logout", "avatar menu", "user dropdown"],
						},
					],
				},
			],
		},
		{
			id: "blocks",
			title: "Blocks",
			items: [
				{
					id: "block-charts",
					title: "Charts",
					url: "/docs/components/blocks/charts",
					icon: ChartLine,
					items: [
						{
							title: "Chart Card",
							url: "/docs/components/blocks/chart-card",
							keywords: ["chart wrapper", "chart container", "chart block"],
						},
						{
							title: "Area Chart",
							url: "/docs/components/blocks/charts/area-chart",
							keywords: ["graph", "area", "visualization", "stacked area"],
						},
						{
							title: "Bar Chart",
							url: "/docs/components/blocks/charts/bar-chart",
							keywords: ["graph", "bar", "histogram", "column chart"],
						},
						{
							title: "Line Chart",
							url: "/docs/components/blocks/charts/line-chart",
							keywords: ["graph", "line", "trend", "time series"],
						},
						{
							title: "Pie Chart",
							url: "/docs/components/blocks/charts/pie-chart",
							keywords: ["graph", "pie", "donut", "circle chart"],
						},
						{
							title: "Radar Chart",
							url: "/docs/components/blocks/charts/radar-chart",
							keywords: ["graph", "spider", "web chart", "polar"],
						},
						{
							title: "Funnel Chart",
							url: "/docs/components/blocks/chart-card",
							keywords: ["funnel", "conversion", "pipeline chart", "stages"],
						},
						{
							title: "Forecast Chart",
							url: "/docs/components/blocks/chart-card",
							keywords: ["forecast", "prediction", "trend", "projection"],
						},
					],
				},
				{
					id: "block-data",
					title: "Data",
					url: "/docs/components/blocks/data-table",
					icon: Table2,
					items: [
						{
							title: "Data Table",
							url: "/docs/components/blocks/data-table",
							keywords: ["grid", "datagrid", "spreadsheet", "tanstack", "sorting", "filtering"],
						},
{
							title: "Filter Bar",
							url: "/docs/components/blocks/filter-bar",
							keywords: ["filter", "search filters", "facets", "query bar"],
						},
						{
							title: "Bulk Action Bar",
							url: "/docs/components/blocks/bulk-action-bar",
							keywords: ["bulk", "multi-select", "batch actions", "selection bar"],
						},
					],
				},
				{
					id: "block-business",
					title: "Business",
					url: "/docs/components/blocks/activity-timeline",
					icon: Puzzle,
					items: [
						{
							title: "Activity Timeline",
							url: "/docs/components/blocks/activity-timeline",
							keywords: ["timeline", "activity feed", "history", "events log"],
						},
						{
							title: "Detail Panel",
							url: "/docs/components/blocks/detail-panel",
							keywords: ["detail", "sidebar panel", "record detail", "side panel"],
						},
						{
							title: "Deal Lines Editor",
							url: "/docs/components/blocks/deal-lines-editor",
							keywords: ["line items", "quote lines", "deal items", "product lines"],
						},
						{
							title: "Inline Edit",
							url: "/docs/components/blocks/inline-edit",
							keywords: ["inline editing", "in-place edit", "click to edit"],
						},
						{
							title: "Kanban Board",
							url: "/docs/components/blocks/kanban-board",
							keywords: ["kanban", "board", "drag drop", "pipeline", "swimlanes"],
						},
						{
							title: "Multi Step Form",
							url: "/docs/components/blocks/multi-step-form",
							keywords: ["wizard", "stepper", "multi step", "form wizard"],
						},
						{
							title: "Notification Center",
							url: "/docs/components/blocks/notification-center",
							keywords: ["notifications", "alerts", "inbox", "messages"],
						},
						{
							title: "Org Menu",
							url: "/docs/components/blocks/org-menu",
							keywords: ["organization", "workspace", "team switcher", "org switcher"],
						},
						{
							title: "Property Card",
							url: "/docs/components/blocks/property-card",
							keywords: ["detail card", "info card", "attribute card"],
						},
						{
							title: "Quick Log Activity",
							url: "/docs/components/blocks/quick-log-activity",
							keywords: ["log", "activity", "crm", "note", "call log"],
						},
						{
							title: "Quote Preview",
							url: "/docs/components/blocks/quote-preview",
							keywords: ["quote", "proposal", "estimate", "pricing preview"],
						},
						{
							title: "Split View",
							url: "/docs/components/blocks/split-view",
							keywords: ["split", "master detail", "two panel", "side by side"],
						},
						{
							title: "Stats Grid",
							url: "/docs/components/blocks/stats-grid",
							keywords: ["kpi grid", "metrics grid", "stats cards", "dashboard grid"],
						},
						{
							title: "Stats Strip",
							url: "/docs/components/blocks/stats-strip",
							keywords: ["metrics", "kpi", "numbers", "statistics", "summary bar"],
						},
						{
							title: "Status Flow",
							url: "/docs/components/blocks/status-flow",
							keywords: ["workflow", "status pipeline", "state machine", "flow"],
						},
					],
				},
			],
		},
		{
			id: "ai",
			title: "AI",
			items: [
				{
					id: "ai-chat",
					title: "Chat",
					url: "/docs/components/ai/chat/conversation",
					icon: MessageCircle,
					items: [
						{
							title: "Conversation",
							url: "/docs/components/ai/chat/conversation",
							keywords: ["chat", "messages", "thread", "dialogue"],
						},
						{
							title: "Message",
							url: "/docs/components/ai/chat/message",
							keywords: ["chat bubble", "message bubble", "chat message"],
						},
						{
							title: "Prompt Input",
							url: "/docs/components/ai/chat/prompt-input",
							keywords: ["chat input", "message input", "send message", "compose"],
						},
						{
							title: "Suggestion",
							url: "/docs/components/ai/chat/suggestion",
							keywords: ["quick reply", "suggested response", "prompt suggestion"],
						},
						{
							title: "Attachments",
							url: "/docs/components/ai/chat/attachments",
							keywords: ["files", "upload", "media", "chat files"],
						},
						{
							title: "Shimmer",
							url: "/docs/components/ai/chat/shimmer",
							keywords: ["typing", "loading", "thinking", "streaming", "animation"],
						},
					],
				},
				{
					id: "ai-reasoning",
					title: "Reasoning",
					url: "/docs/components/ai/reasoning",
					icon: Brain,
					items: [
						{
							title: "Reasoning",
							url: "/docs/components/ai/reasoning",
							keywords: ["thinking", "logic", "analysis", "ai thinking"],
						},
						{
							title: "Chain of Thought",
							url: "/docs/components/ai/chain-of-thought",
							keywords: ["cot", "step by step", "reasoning chain", "thought process"],
						},
						{
							title: "Sources",
							url: "/docs/components/ai/sources",
							keywords: ["references", "citations", "links", "bibliography"],
						},
						{
							title: "Inline Citation",
							url: "/docs/components/ai/inline-citation",
							keywords: ["reference", "footnote", "source link", "cite"],
						},
					],
				},
				{
					id: "ai-tools",
					title: "Tools",
					url: "/docs/components/ai/confirmation",
					icon: Wrench,
					items: [
						{
							title: "Confirmation",
							url: "/docs/components/ai/confirmation",
							keywords: ["approve", "confirm action", "tool approval", "permission"],
						},
						{
							title: "Model Selector",
							url: "/docs/components/ai/model-selector",
							keywords: ["model picker", "llm", "gpt", "claude", "ai model"],
						},
						{
							title: "Context",
							url: "/docs/components/ai/context",
							keywords: ["context window", "system prompt", "instructions", "ai context"],
						},
					],
				},
				{
					id: "ai-data",
					title: "Data",
					url: "/docs/components/ai/data/metric-card",
					icon: ChartLine,
					items: [
						{
							title: "Metric Card",
							url: "/docs/components/ai/data/metric-card",
							keywords: ["kpi", "number card", "statistic", "value card"],
						},
						{
							title: "Stats Row",
							url: "/docs/components/ai/data/stats-row",
							keywords: ["metrics row", "numbers", "statistics", "summary"],
						},
						{
							title: "Mini Chart",
							url: "/docs/components/ai/data/mini-chart",
							keywords: ["sparkline", "small chart", "inline chart", "trend"],
						},
						{
							title: "Comparison Table",
							url: "/docs/components/ai/data/comparison-table",
							keywords: ["compare", "versus", "side by side", "diff"],
						},
						{
							title: "Progress Card",
							url: "/docs/components/ai/data/progress-card",
							keywords: ["progress bar", "completion", "percentage", "status"],
						},
						{
							title: "Data List",
							url: "/docs/components/ai/data/data-list",
							keywords: ["list", "items", "records", "entries"],
						},
						{
							title: "Data Grid",
							url: "/docs/components/ai/data/data-grid",
							keywords: ["grid", "cards", "tile view", "gallery"],
						},
						{
							title: "Rating Card",
							url: "/docs/components/ai/data/rating-card",
							keywords: ["stars", "score", "review", "rating"],
						},
						{
							title: "Score Card",
							url: "/docs/components/ai/data/score-card",
							keywords: ["score", "points", "grade", "evaluation"],
						},
					],
				},
				{
					id: "ai-entities",
					title: "Entities",
					url: "/docs/components/ai/entities/candidate-card",
					icon: Users,
					items: [
						{
							title: "Candidate Card",
							url: "/docs/components/ai/entities/candidate-card",
							keywords: ["applicant", "recruit", "talent", "person card"],
						},
						{
							title: "Contact Card",
							url: "/docs/components/ai/entities/contact-card",
							keywords: ["person", "profile", "contact info", "vcard"],
						},
						{
							title: "Company Card",
							url: "/docs/components/ai/entities/company-card",
							keywords: ["organization", "business", "firm", "account"],
						},
						{
							title: "Deal Card",
							url: "/docs/components/ai/entities/deal-card",
							keywords: ["opportunity", "sale", "pipeline", "crm"],
						},
						{
							title: "User Card",
							url: "/docs/components/ai/entities/user-card",
							keywords: ["profile", "member", "account", "person"],
						},
					],
				},
				{
					id: "ai-workflow",
					title: "Workflow",
					url: "/docs/components/ai/workflow/task-card",
					icon: ListChecks,
					items: [
						{
							title: "Task Card",
							url: "/docs/components/ai/workflow/task-card",
							keywords: ["todo", "task", "action item", "work item"],
						},
						{
							title: "Checklist Card",
							url: "/docs/components/ai/workflow/checklist-card",
							keywords: ["todo list", "check list", "steps", "tasks"],
						},
						{
							title: "Approval Card",
							url: "/docs/components/ai/workflow/approval-card",
							keywords: ["approve", "reject", "review", "sign off"],
						},
						{
							title: "Action List",
							url: "/docs/components/ai/workflow/action-list",
							keywords: ["actions", "operations", "commands", "steps"],
						},
						{
							title: "Poll Card",
							url: "/docs/components/ai/workflow/poll-card",
							keywords: ["vote", "survey", "poll", "question"],
						},
						{
							title: "Email Preview",
							url: "/docs/components/ai/workflow/email-preview",
							keywords: ["email", "mail", "message preview", "newsletter"],
						},
						{
							title: "Message Preview",
							url: "/docs/components/ai/workflow/message-preview",
							keywords: ["sms", "text", "chat preview", "notification"],
						},
					],
				},
				{
					id: "ai-planning",
					title: "Planning",
					url: "/docs/components/ai/planning/timeline",
					icon: Calendar,
					items: [
						{
							title: "Timeline",
							url: "/docs/components/ai/planning/timeline",
							keywords: ["schedule", "gantt", "roadmap", "milestones"],
						},
						{
							title: "Event Card",
							url: "/docs/components/ai/planning/event-card",
							keywords: ["meeting", "appointment", "event", "calendar event"],
						},
						{
							title: "Status Update",
							url: "/docs/components/ai/planning/status-update",
							keywords: ["progress", "update", "report", "standup"],
						},
						{
							title: "Calendar Card",
							url: "/docs/components/ai/planning/calendar-card",
							keywords: ["date", "schedule", "planner", "agenda"],
						},
						{
							title: "Availability Card",
							url: "/docs/components/ai/planning/availability-card",
							keywords: ["schedule", "free busy", "time slots", "booking"],
						},
					],
				},
				{
					id: "ai-commerce",
					title: "Commerce",
					url: "/docs/components/ai/commerce/invoice-card",
					icon: CreditCard,
					items: [
						{
							title: "Invoice Card",
							url: "/docs/components/ai/commerce/invoice-card",
							keywords: ["bill", "receipt", "payment", "invoice"],
						},
						{
							title: "Quote Summary",
							url: "/docs/components/ai/commerce/quote-summary",
							keywords: ["estimate", "proposal", "pricing", "offer"],
						},
						{
							title: "Pricing Table",
							url: "/docs/components/ai/commerce/pricing-table",
							keywords: ["plans", "tiers", "subscription", "price comparison"],
						},
						{
							title: "Transaction Card",
							url: "/docs/components/ai/commerce/transaction-card",
							keywords: ["payment", "transfer", "purchase", "order"],
						},
						{
							title: "Product Card",
							url: "/docs/components/ai/commerce/product-card",
							keywords: ["item", "merchandise", "product", "listing"],
						},
					],
				},
				{
					id: "ai-content",
					title: "Content",
					url: "/docs/components/ai/content/insight-card",
					icon: FileText,
					items: [
						{
							title: "Insight Card",
							url: "/docs/components/ai/content/insight-card",
							keywords: ["analytics", "finding", "discovery", "highlight"],
						},
						{
							title: "Summary Card",
							url: "/docs/components/ai/content/summary-card",
							keywords: ["overview", "tldr", "abstract", "recap"],
						},
						{
							title: "File Card",
							url: "/docs/components/ai/content/file-card",
							keywords: ["document", "attachment", "file preview", "download"],
						},
						{
							title: "Link Preview",
							url: "/docs/components/ai/content/link-preview",
							keywords: ["url preview", "og card", "embed", "unfurl"],
						},
						{
							title: "Image Gallery",
							url: "/docs/components/ai/content/image-gallery",
							keywords: ["photos", "pictures", "carousel", "lightbox"],
						},
						{
							title: "Location Card",
							url: "/docs/components/ai/content/location-card",
							keywords: ["map", "address", "place", "geo", "coordinates"],
						},
						{
							title: "Video Card",
							url: "/docs/components/ai/content/video-card",
							keywords: ["player", "youtube", "video preview", "media"],
						},
					],
				},
			],
		},
		{
			id: "guide",
			title: "Guide",
			items: [
				{
					id: "guide-foundations",
					title: "Foundations",
					url: "/docs/components/colors",
					icon: Palette,
					items: [
						{
							title: "Colors",
							url: "/docs/components/colors",
							keywords: ["palette", "theme", "tokens", "design tokens", "oklch"],
						},
						{
							title: "Typography",
							url: "/docs/components/typography",
							keywords: ["fonts", "text styles", "headings", "font size", "typeface"],
						},
						{
							title: "Text",
							url: "/docs/components/ui/text",
							keywords: ["paragraph", "prose", "body text", "text component"],
						},
					],
				},
				{
					id: "guide-concepts",
					title: "Concepts",
					url: "/docs/components/layout/inset",
					icon: Layers2,
					items: [
						{
							title: "Inset",
							url: "/docs/components/layout/inset",
							keywords: ["padding", "container", "wrapper", "density", "spacing", "token", "inset"],
						},
					],
				},
				{
					id: "guide-tools",
					title: "Outils",
					url: "/docs/mcp",
					icon: Wrench,
					items: [
						{
							title: "MCP Server",
							url: "/docs/mcp",
							keywords: [
								"mcp",
								"model context protocol",
								"ai",
								"assistant",
								"claude",
								"cursor",
								"tools",
								"design system",
							],
						},
						{
							title: "Sandbox",
							url: "/docs/sandbox",
							keywords: ["sandbox", "playground", "test", "experiment"],
						},
					],
				},
				{
					id: "guide-utils",
					title: "Utils",
					url: "/docs/utils/unsaved-changes-bar",
					icon: Save,
					items: [
						{
							title: "Unsaved Changes Bar",
							url: "/docs/utils/unsaved-changes-bar",
							keywords: [
								"unsaved",
								"dirty",
								"form guard",
								"navigation guard",
								"save prompt",
								"discard",
							],
						},
						{
							title: "Quick Login",
							url: "/docs/utils/quick-login",
							keywords: [
								"dev",
								"test accounts",
								"quick login",
								"account switcher",
								"development",
								"credentials",
							],
						},
					],
				},
			],
		},
	],
}

// Backward compatibility - export navigationConfig as before
export const navigationConfig = sidebarConfig.navigation

export type SectionId = "components" | "blocks" | "ai" | "guide"

export const sectionTabs: { id: SectionId; label: string; defaultUrl: string }[] = [
	{ id: "components", label: "Composants", defaultUrl: "/docs/components" },
	{ id: "blocks", label: "Blocks", defaultUrl: "/docs/components/blocks" },
	{ id: "ai", label: "AI", defaultUrl: "/docs/components/ai" },
	{ id: "guide", label: "Guide", defaultUrl: "/docs/guide" },
]

export function getSectionForPathname(pathname: string): SectionId {
	if (pathname === "/docs/components/ai" || pathname.startsWith("/docs/components/ai/")) return "ai"
	if (pathname === "/docs/components/blocks" || pathname.startsWith("/docs/components/blocks/")) return "blocks"
	if (pathname.startsWith("/docs/guide")) return "guide"
	if (pathname.startsWith("/docs/mcp") || pathname.startsWith("/docs/sandbox") || pathname.startsWith("/docs/utils/")) return "guide"
	if (pathname.startsWith("/docs/components/colors") || pathname.startsWith("/docs/components/typography")) return "guide"
	if (pathname.startsWith("/docs/components/layout/inset")) return "guide"
	if (pathname.startsWith("/docs/components/ui/text")) return "guide"
	return "components"
}

export function getSectionNavigation(sectionId: SectionId): NavigationSection | undefined {
	return sidebarConfig.navigation.find((s) => s.id === sectionId)
}
