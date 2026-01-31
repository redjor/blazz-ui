import Link from "next/link"
import { Page } from "@/components/ui/page"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

const dataDisplayComponents = [
	{
		title: "Avatar",
		href: "/components/ui/avatar",
		description: "An image element representing a user or entity.",
	},
	{
		title: "Table",
		href: "/components/ui/table",
		description: "Displays data in a structured tabular format.",
	},
]

export default function DataDisplayPage() {
	return (
		<Page
			title="Data Display"
			subtitle="Components for presenting data and information to users."
		>
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{dataDisplayComponents.map((component) => (
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
