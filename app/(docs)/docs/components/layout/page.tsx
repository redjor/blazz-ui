import { Page } from "@/components/ui/page"
import { ComponentSection } from "@/components/features/docs/component-card"
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
	},
	{
		title: "Block Stack",
		description: "Use to display children vertically with full width by default. Based on CSS Flexbox.",
		href: "/docs/components/layout/block-stack",
		icon: Rows3,
	},
	{
		title: "Box",
		description: "Box is the most primitive layout component. It's a way to access design tokens.",
		href: "/docs/components/layout/box",
		icon: Square,
	},
	{
		title: "Divider",
		description: "Use to separate or group content.",
		href: "/docs/components/layout/divider",
		icon: SeparatorHorizontal,
	},
	{
		title: "Grid",
		description: "Create complex layouts based on CSS Grid.",
		href: "/docs/components/layout/grid",
		icon: LayoutGrid,
	},
	{
		title: "Inline Grid",
		description: "Use to lay out children horizontally with equal gap between columns. Based on CSS Grid.",
		href: "/docs/components/layout/inline-grid",
		icon: Columns3,
	},
	{
		title: "Inline Stack",
		description: "Use to display children horizontally in a row. Based on CSS Flexbox.",
		href: "/docs/components/layout/inline-stack",
		icon: GalleryHorizontal,
	},
]

const layoutCompositions = [
	{
		title: "Callout Card",
		description: "Callout cards are used to encourage users to take an action related to a new feature.",
		href: "/docs/components/layout/callout-card",
		icon: Megaphone,
	},
	{
		title: "Card",
		description: "Used to group similar concepts and tasks together for easier scanning and reading.",
		href: "/docs/components/layout/card",
		icon: RectangleHorizontal,
	},
	{
		title: "Frame",
		description: "Groups related panels with consistent spacing, borders, and visual hierarchy.",
		href: "/docs/components/ui/frame-panel",
		icon: PanelsTopLeft,
	},
	{
		title: "Page",
		description: "A container component for page-level layout with title, actions, and breadcrumbs.",
		href: "/docs/components/layout/page-component",
		icon: FileText,
	},
]

export default function LayoutComponentsPage() {
	return (
		<Page
			title="Layout and Structure"
			subtitle="Layout is the arrangement of elements on a page. A good layout helps users understand and find information more easily."
		>
			<div className="space-y-10">
				<section className="space-y-4">
					<div>
						<h2 className="text-sm font-semibold text-fg">Layout Primitives</h2>
						<p className="text-xs text-fg-muted">
							All layouts and spacing should be handled using layout primitives. This keeps our
							components simple and consistent.
						</p>
					</div>
					<ComponentSection components={layoutPrimitives} />
				</section>

				<section className="space-y-4">
					<div>
						<h2 className="text-sm font-semibold text-fg">Layout Compositions</h2>
						<p className="text-xs text-fg-muted">
							Layout compositions are built with layout primitives. Use these components to build
							common layouts in your app.
						</p>
					</div>
					<ComponentSection components={layoutCompositions} />
				</section>
			</div>
		</Page>
	)
}
