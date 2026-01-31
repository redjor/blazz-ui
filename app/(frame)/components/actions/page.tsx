import Link from "next/link"
import { Page } from "@/components/ui/page"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

const actionComponents = [
	{
		title: "Button",
		href: "/components/ui/button",
		description: "Triggers an action or event when clicked.",
	},
	{
		title: "Button Group",
		href: "/components/ui/button-group",
		description: "Groups related buttons together.",
	},
	{
		title: "Dropdown Menu",
		href: "/components/ui/dropdown-menu",
		description: "Displays a menu of actions in a dropdown.",
	},
]

export default function ActionsPage() {
	return (
		<Page
			title="Actions"
			subtitle="Components that allow users to trigger actions and interact with your application."
		>
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{actionComponents.map((component) => (
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
