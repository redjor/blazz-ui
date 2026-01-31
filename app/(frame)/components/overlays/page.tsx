import Link from "next/link"
import { Page } from "@/components/ui/page"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

const overlayComponents = [
	{
		title: "Confirmation Dialog",
		href: "/components/ui/confirmation-dialog",
		description: "A dialog for confirming user actions.",
	},
	{
		title: "Dialog",
		href: "/components/ui/dialog",
		description: "A modal window that appears on top of the main content.",
	},
	{
		title: "Popover",
		href: "/components/ui/popover",
		description: "A floating panel for displaying additional content.",
	},
	{
		title: "Sheet",
		href: "/components/ui/sheet",
		description: "A panel that slides in from the edge of the screen.",
	},
	{
		title: "Tooltip",
		href: "/components/ui/tooltip",
		description: "A small popup that provides additional information on hover.",
	},
]

export default function OverlaysPage() {
	return (
		<Page
			title="Overlays"
			subtitle="Components that display content on top of the main interface."
		>
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{overlayComponents.map((component) => (
					<Link key={component.href} href={component.href}>
						<Card className="h-full transition-colors hover:bg-muted/50">
							<CardHeader>
								<CardTitle className="text-base">{component.title}</CardTitle>
								<CardDescription>{component.description}</CardDescription>
							</CardHeader>
						</Card>
					</Link>
				))}
			</div>
		</Page>
	)
}
