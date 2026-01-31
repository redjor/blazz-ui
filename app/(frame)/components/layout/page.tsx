import Link from "next/link"
import { Page } from "@/components/ui/page"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

const layoutComponents = [
	{
		title: "Bleed",
		description: "Applies negative margin to allow content to bleed out into the surrounding layout.",
		href: "/components/layout/bleed",
	},
	{
		title: "Block Stack",
		description: "Use to display children vertically with full width by default. Based on CSS Flexbox.",
		href: "/components/layout/block-stack",
	},
	{
		title: "Box",
		description: "Box is the most primitive layout component. It's a way to access design tokens.",
		href: "/components/layout/box",
	},
	{
		title: "Divider",
		description: "Use to separate or group content.",
		href: "/components/layout/divider",
	},
	{
		title: "Grid",
		description: "Create complex layouts based on CSS Grid.",
		href: "/components/layout/grid",
	},
	{
		title: "Inline Grid",
		description: "Use to lay out children horizontally with equal gap between columns. Based on CSS Grid.",
		href: "/components/layout/inline-grid",
	},
	{
		title: "Inline Stack",
		description: "Use to display children horizontally in a row. Based on CSS Flexbox.",
		href: "/components/layout/inline-stack",
	},
]

const layoutCompositions = [
	{
		title: "Callout Card",
		description: "Callout cards are used to encourage users to take an action related to a new feature.",
		href: "/components/layout/callout-card",
	},
	{
		title: "Card",
		description: "Used to group similar concepts and tasks together for easier scanning and reading.",
		href: "/components/layout/card",
	},
]

export default function LayoutComponentsPage() {
	return (
		<Page
			title="Layout and Structure"
			subtitle="Layout is the arrangement of elements on a page. A good layout helps users understand and find information more easily."
		>
			<div className="space-y-8">
				<section className="space-y-4">
					<h2 className="text-lg font-semibold">Layout Primitives</h2>
					<p className="text-sm text-muted-foreground">
						All layouts and spacing should be handled using layout primitives. This keeps our
						components simple and consistent.
					</p>
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{layoutComponents.map((component) => (
							<Link key={component.href} href={component.href}>
								<Card className="h-full transition-colors hover:bg-muted/50">
									<CardHeader>
										<CardTitle className="text-base">{component.title}</CardTitle>
										<CardDescription className="line-clamp-2">
											{component.description}
										</CardDescription>
									</CardHeader>
								</Card>
							</Link>
						))}
					</div>
				</section>

				<section className="space-y-4">
					<h2 className="text-lg font-semibold">Layout Compositions</h2>
					<p className="text-sm text-muted-foreground">
						Layout compositions are built with layout primitives. Use these components to build
						common layouts in your app.
					</p>
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{layoutCompositions.map((component) => (
							<Link key={component.href} href={component.href}>
								<Card className="h-full transition-colors hover:bg-muted/50">
									<CardHeader>
										<CardTitle className="text-base">{component.title}</CardTitle>
										<CardDescription className="line-clamp-2">
											{component.description}
										</CardDescription>
									</CardHeader>
								</Card>
							</Link>
						))}
					</div>
				</section>
			</div>
		</Page>
	)
}
