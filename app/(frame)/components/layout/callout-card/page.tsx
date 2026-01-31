"use client"

import * as React from "react"
import { Page } from "@/components/ui/page"
import { CalloutCard } from "@/components/ui/callout-card"
import { ComponentExample } from "@/components/features/docs/component-example"
import { PropsTable, type PropDefinition } from "@/components/features/docs/props-table"

const calloutCardProps: PropDefinition[] = [
	{
		name: "title",
		type: "React.ReactNode",
		required: true,
		description: "The title of the card.",
	},
	{
		name: "children",
		type: "React.ReactNode",
		description: "The content to display inside the callout card.",
	},
	{
		name: "illustration",
		type: "string",
		description: "URL to the card illustration.",
	},
	{
		name: "primaryAction",
		type: "{ content: string; url?: string; onAction?: () => void }",
		required: true,
		description: "Primary action for the card.",
	},
	{
		name: "secondaryAction",
		type: '{ content: string; url?: string; onAction?: () => void; variant?: "default" | "outline" | "secondary" | "ghost" | "destructive" | "link" }',
		description: "Secondary action for the card.",
	},
	{
		name: "onDismiss",
		type: "() => void",
		description: "Callback when banner is dismissed. Shows a dismiss button when provided.",
	},
]

export default function CalloutCardPage() {
	const [dismissed1, setDismissed1] = React.useState(false)

	return (
		<Page
			title="Callout Card"
			subtitle="Callout cards are used to encourage users to take an action related to a new feature or opportunity."
		>
			<div className="space-y-10">
				<section className="space-y-6">
					<h2 className="text-lg font-semibold">Examples</h2>

					<ComponentExample
						title="Default"
						description="Use to let users know about a feature or opportunity where there is a clear, single action they need to take."
						code={`<CalloutCard
  title="Customize the style of your checkout"
  illustration="/images/checkout.svg"
  primaryAction={{
    content: "Customize checkout",
    url: "/settings/checkout"
  }}
>
  Upload your store's logo, change colors and fonts, and more.
</CalloutCard>`}
					>
						<CalloutCard
							title="Customize the style of your checkout"
							primaryAction={{
								content: "Customize checkout",
								onAction: () => alert("Customize checkout clicked"),
							}}
						>
							Upload your store's logo, change colors and fonts, and more.
						</CalloutCard>
					</ComponentExample>

					<ComponentExample
						title="With Secondary Action"
						description="Use when there's a secondary action that's less important than the primary action."
						code={`<CalloutCard
  title="Set up two-step authentication"
  primaryAction={{
    content: "Enable",
    onAction: () => {}
  }}
  secondaryAction={{
    content: "Learn more",
    variant: "ghost",
    onAction: () => {}
  }}
>
  Add an extra layer of security to your account.
</CalloutCard>`}
					>
						<CalloutCard
							title="Set up two-step authentication"
							primaryAction={{
								content: "Enable",
								onAction: () => alert("Enable clicked"),
							}}
							secondaryAction={{
								content: "Learn more",
								variant: "ghost",
								onAction: () => alert("Learn more clicked"),
							}}
						>
							Add an extra layer of security to your account by requiring a code in addition
							to your password.
						</CalloutCard>
					</ComponentExample>

					<ComponentExample
						title="Dismissable"
						description="Allow users to dismiss the callout card when they're not interested."
						code={`<CalloutCard
  title="Try the new inventory management"
  primaryAction={{
    content: "Get started",
    onAction: () => {}
  }}
  onDismiss={() => setDismissed(true)}
>
  Track your inventory across multiple locations.
</CalloutCard>`}
					>
						{dismissed1 ? (
							<div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
								<p>Callout card was dismissed.</p>
								<button
									type="button"
									className="mt-2 text-primary underline"
									onClick={() => setDismissed1(false)}
								>
									Show again
								</button>
							</div>
						) : (
							<CalloutCard
								title="Try the new inventory management"
								primaryAction={{
									content: "Get started",
									onAction: () => alert("Get started clicked"),
								}}
								onDismiss={() => setDismissed1(true)}
							>
								Track your inventory across multiple locations with our new tools.
							</CalloutCard>
						)}
					</ComponentExample>

					<ComponentExample
						title="With Illustration"
						description="Add an illustration to make the callout card more visually appealing."
						code={`<CalloutCard
  title="Start selling on Facebook and Instagram"
  illustration="/images/social-selling.svg"
  primaryAction={{
    content: "Connect accounts",
    url: "/channels/social"
  }}
  secondaryAction={{
    content: "Learn more",
    variant: "link"
  }}
>
  Reach millions of shoppers and grow your business.
</CalloutCard>`}
					>
						<CalloutCard
							title="Start selling on Facebook and Instagram"
							illustration="https://cdn.shopify.com/s/assets/admin/checkout/settings-customizecart-705f57c725ac05be5a34ec20c05b94514f5cc91768e42bb4e3c3cc3766b54290.svg"
							primaryAction={{
								content: "Connect accounts",
								onAction: () => alert("Connect clicked"),
							}}
							secondaryAction={{
								content: "Learn more",
								variant: "link",
								onAction: () => alert("Learn more clicked"),
							}}
						>
							Reach millions of shoppers and grow your business by selling on social media.
						</CalloutCard>
					</ComponentExample>
				</section>

				<section className="space-y-4">
					<h2 className="text-lg font-semibold">Props</h2>
					<PropsTable props={calloutCardProps} />
				</section>

				<section className="space-y-4">
					<h2 className="text-lg font-semibold">Best Practices</h2>
					<p className="text-sm text-muted-foreground">Callout cards should:</p>
					<ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
						<li>Clearly articulate the benefit of the feature and what it does</li>
						<li>Provide users with a clear call to action</li>
						<li>Be targeted to users who will most benefit from the feature</li>
						<li>
							Be dismissable so users can get rid of cards about features they're not
							interested in
						</li>
						<li>
							Use an illustration that helps to communicate the subject or user benefit
						</li>
					</ul>
				</section>

				<section className="space-y-4">
					<h2 className="text-lg font-semibold">Content Guidelines</h2>
					<div className="space-y-4">
						<div>
							<h3 className="text-sm font-medium">Title</h3>
							<p className="text-sm text-muted-foreground">
								Keep titles short and actionable. Focus on the benefit, not the feature.
							</p>
						</div>
						<div>
							<h3 className="text-sm font-medium">Body Content</h3>
							<ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
								<li>Start sentences with imperative verbs when telling users what actions are available</li>
								<li>Put the most critical information first</li>
								<li>Keep it concise - 1-2 sentences maximum</li>
							</ul>
						</div>
						<div>
							<h3 className="text-sm font-medium">Call to Action</h3>
							<ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
								<li>Be clear and predictable about what will happen</li>
								<li>Lead with a strong verb that encourages action</li>
								<li>Avoid unnecessary words like "the", "an", or "a"</li>
							</ul>
						</div>
					</div>
				</section>

				<section className="space-y-4">
					<h2 className="text-lg font-semibold">Related Components</h2>
					<ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
						<li>To group similar concepts and tasks together, use the Card component</li>
						<li>To create page-level layout, use the Layout component</li>
						<li>
							To explain a feature that users haven't tried yet, use the Empty State
							component
						</li>
					</ul>
				</section>
			</div>
		</Page>
	)
}
