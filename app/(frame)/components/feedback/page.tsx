import Link from "next/link"
import { Page } from "@/components/ui/page"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

const feedbackComponents = [
	{
		title: "Banner",
		description: "Informs users about important changes or persistent conditions.",
		href: "/components/feedback/banner",
	},
]

export default function FeedbackComponentsPage() {
	return (
		<Page
			title="Feedback Indicators"
			subtitle="Components that provide feedback to users about the state of the system or their actions."
		>
			<div className="space-y-8">
				<section className="space-y-4">
					<h2 className="text-lg font-semibold">Components</h2>
					<p className="text-sm text-muted-foreground">
						Use feedback components to communicate important information, status changes, and
						system responses to users.
					</p>
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{feedbackComponents.map((component) => (
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
					<h2 className="text-lg font-semibold">Usage Guidelines</h2>
					<ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
						<li>Use the appropriate component based on the severity and persistence of the message</li>
						<li>Keep messages concise and actionable</li>
						<li>Provide clear next steps when action is required</li>
						<li>Consider accessibility - use appropriate ARIA roles for urgent messages</li>
					</ul>
				</section>
			</div>
		</Page>
	)
}
