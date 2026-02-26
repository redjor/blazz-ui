import { Page } from "@blazz/ui/components/ui/page"
import { ComponentSection } from "@/components/docs/component-card"
import {
	Expand,
	Rows3,
	Square,
	SeparatorHorizontal,
	LayoutGrid,
	Columns3,
	GalleryHorizontal,
	Megaphone,
	RectangleHorizontal,
	PanelsTopLeft,
	FileText,
} from "lucide-react"

const layoutPrimitives = [
	{
		title: "Bleed",
		description: "Applies negative margin to allow content to bleed out into the surrounding layout.",
		href: "/docs/components/layout/bleed",
		icon: Expand,
		thumbnail: "bleed",
	},
	{
		title: "Block Stack",
		description: "Use to display children vertically with full width by default. Based on CSS Flexbox.",
		href: "/docs/components/layout/block-stack",
		icon: Rows3,
		thumbnail: "block-stack",
	},
	{
		title: "Box",
		description: "Box is the most primitive layout component. It's a way to access design tokens.",
		href: "/docs/components/layout/box",
		icon: Square,
		thumbnail: "box",
	},
	{
		title: "Divider",
		description: "Use to separate or group content.",
		href: "/docs/components/layout/divider",
		icon: SeparatorHorizontal,
		thumbnail: "divider",
	},
	{
		title: "Grid",
		description: "Create complex layouts based on CSS Grid.",
		href: "/docs/components/layout/grid",
		icon: LayoutGrid,
		thumbnail: "grid",
	},
	{
		title: "Inline Grid",
		description: "Use to lay out children horizontally with equal gap between columns. Based on CSS Grid.",
		href: "/docs/components/layout/inline-grid",
		icon: Columns3,
		thumbnail: "inline-grid",
	},
	{
		title: "Inline Stack",
		description: "Use to display children horizontally in a row. Based on CSS Flexbox.",
		href: "/docs/components/layout/inline-stack",
		icon: GalleryHorizontal,
		thumbnail: "inline-stack",
	},
]

const layoutCompositions = [
	{
		title: "Callout Card",
		description: "Callout cards are used to encourage users to take an action related to a new feature.",
		href: "/docs/components/layout/callout-card",
		icon: Megaphone,
		thumbnail: "callout-card",
	},
	{
		title: "Card",
		description: "Used to group similar concepts and tasks together for easier scanning and reading.",
		href: "/docs/components/layout/card",
		icon: RectangleHorizontal,
		thumbnail: "card",
	},
	{
		title: "Frame",
		description: "Groups related panels with consistent spacing, borders, and visual hierarchy.",
		href: "/docs/components/ui/frame-panel",
		icon: PanelsTopLeft,
		thumbnail: "frame-panel",
	},
	{
		title: "Page",
		description: "A container component for page-level layout with title, actions, and breadcrumbs.",
		href: "/docs/components/layout/page-component",
		icon: FileText,
		thumbnail: "page-component",
	},
]

export default function LayoutComponentsPage() {
	return (
		<Page
			title="Layout and Structure"
			subtitle="Layout is the arrangement of elements on a page. A good layout helps users understand and find information more easily."
		>
			<div className="space-y-10">
				<ComponentSection
					title="Layout Primitives"
					description="All layouts and spacing should be handled using layout primitives. This keeps our components simple and consistent."
					components={layoutPrimitives}
				/>
				<ComponentSection
					title="Layout Compositions"
					description="Layout compositions are built with layout primitives. Use these components to build common layouts in your app."
					components={layoutCompositions}
				/>
			</div>
		</Page>
	)
}
