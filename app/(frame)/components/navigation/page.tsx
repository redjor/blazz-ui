import Link from "next/link"
import { Page } from "@/components/ui/page"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

const navigationComponents = [
	{
		title: "Breadcrumb",
		href: "/components/ui/breadcrumb",
		description: "Shows the user's current location within the application hierarchy.",
	},
	{
		title: "Command",
		href: "/components/ui/command",
		description: "A command palette for searching and executing actions.",
	},
	{
		title: "Menu",
		href: "/components/ui/menu",
		description: "A list of options for navigating or taking actions.",
	},
	{
		title: "Tabs",
		href: "/components/ui/tabs",
		description: "Organizes content into separate views within the same context.",
	},
]

export default function NavigationPage() {
	return (
		<Page
			title="Navigation"
			subtitle="Components that help users navigate through your application."
		>
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{navigationComponents.map((component) => (
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
