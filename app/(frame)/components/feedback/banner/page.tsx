"use client"

import * as React from "react"
import { Page } from "@/components/ui/page"
import { Banner } from "@/components/ui/banner"
import { ComponentExample } from "@/components/features/docs/component-example"
import { PropsTable, type PropDefinition } from "@/components/features/docs/props-table"

const bannerProps: PropDefinition[] = [
	{
		name: "title",
		type: "React.ReactNode",
		description: "Title of the banner.",
	},
	{
		name: "children",
		type: "React.ReactNode",
		description: "Body content of the banner.",
	},
	{
		name: "tone",
		type: '"info" | "success" | "warning" | "critical"',
		default: '"info"',
		description: "Sets the banner's visual style and semantic meaning.",
	},
	{
		name: "icon",
		type: "LucideIcon",
		description: "Custom icon to display. Uses default tone icon if not provided.",
	},
	{
		name: "hideIcon",
		type: "boolean",
		default: "false",
		description: "Hides the status icon.",
	},
	{
		name: "action",
		type: "{ content: string; url?: string; onAction?: () => void; loading?: boolean; disabled?: boolean }",
		description: "Primary action button configuration.",
	},
	{
		name: "secondaryAction",
		type: "{ content: string; url?: string; onAction?: () => void; loading?: boolean; disabled?: boolean }",
		description: "Secondary action button configuration.",
	},
	{
		name: "onDismiss",
		type: "() => void",
		description: "Callback when the banner is dismissed. Shows dismiss button when provided.",
	},
	{
		name: "stopAnnouncements",
		type: "boolean",
		default: "false",
		description: "Disables screen reader live announcements.",
	},
]

export default function BannerPage() {
	const [showDismissable, setShowDismissable] = React.useState(true)

	return (
		<Page
			title="Banner"
			subtitle="Informs users about important changes or persistent conditions. Use for contextual information that requires attention."
		>
			<div className="space-y-10">
				<section className="space-y-6">
					<h2 className="text-lg font-semibold">Examples</h2>

					<ComponentExample
						title="Default (Info)"
						description="Use for general information or updates that don't require immediate action."
						code={`<Banner title="Order archived">
  This order was archived on March 7, 2023 at 3:12pm EDT.
</Banner>`}
					>
						<Banner title="Order archived">
							This order was archived on March 7, 2023 at 3:12pm EDT.
						</Banner>
					</ComponentExample>

					<ComponentExample
						title="Success"
						description="Use to inform about positive outcomes. Prefer toasts for immediate feedback."
						code={`<Banner tone="success" title="Your changes have been saved">
  Customer information has been updated successfully.
</Banner>`}
					>
						<Banner tone="success" title="Your changes have been saved">
							Customer information has been updated successfully.
						</Banner>
					</ComponentExample>

					<ComponentExample
						title="Warning"
						description="Use when something requires attention but isn't blocking. Appears with alert role for accessibility."
						code={`<Banner tone="warning" title="Before you can purchase a shipping label">
  You need to enter the total weight of your shipment, including packaging.
</Banner>`}
					>
						<Banner tone="warning" title="Before you can purchase a shipping label">
							You need to enter the total weight of your shipment, including packaging.
						</Banner>
					</ComponentExample>

					<ComponentExample
						title="Critical"
						description="Use for errors or urgent problems that block task completion."
						code={`<Banner tone="critical" title="High risk of fraud detected">
  Before fulfilling this order, verify the shipping address with the customer.
</Banner>`}
					>
						<Banner tone="critical" title="High risk of fraud detected">
							Before fulfilling this order, verify the shipping address with the customer.
						</Banner>
					</ComponentExample>

					<ComponentExample
						title="With Actions"
						description="Add primary and secondary actions to help users resolve the issue."
						code={`<Banner
  tone="warning"
  title="Some of your product variants are missing weights"
  action={{ content: "Edit variant weights", onAction: () => {} }}
  secondaryAction={{ content: "Learn more", onAction: () => {} }}
>
  Add weights to variants so accurate shipping rates can display at checkout.
</Banner>`}
					>
						<Banner
							tone="warning"
							title="Some of your product variants are missing weights"
							action={{
								content: "Edit variant weights",
								onAction: () => alert("Edit weights clicked"),
							}}
							secondaryAction={{
								content: "Learn more",
								onAction: () => alert("Learn more clicked"),
							}}
						>
							Add weights to variants so accurate shipping rates can display at checkout.
						</Banner>
					</ComponentExample>

					<ComponentExample
						title="Dismissable"
						description="Allow users to dismiss non-critical banners. Don't make critical banners dismissable."
						code={`<Banner
  tone="info"
  title="New shipping options available"
  onDismiss={() => setShowBanner(false)}
>
  You can now offer expedited shipping to your customers.
</Banner>`}
					>
						{showDismissable ? (
							<Banner
								tone="info"
								title="New shipping options available"
								onDismiss={() => setShowDismissable(false)}
							>
								You can now offer expedited shipping to your customers.
							</Banner>
						) : (
							<div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
								<p>Banner was dismissed.</p>
								<button
									type="button"
									className="mt-2 text-primary underline"
									onClick={() => setShowDismissable(true)}
								>
									Show again
								</button>
							</div>
						)}
					</ComponentExample>

					<ComponentExample
						title="Without Title"
						description="Use for simple messages that don't need a title."
						code={`<Banner tone="success">
  Your changes have been saved.
</Banner>`}
					>
						<Banner tone="success">Your changes have been saved.</Banner>
					</ComponentExample>

					<ComponentExample
						title="Without Icon"
						description="Hide the icon for a more minimal appearance."
						code={`<Banner hideIcon title="Note">
  This is a banner without an icon.
</Banner>`}
					>
						<Banner hideIcon title="Note">
							This is a banner without an icon.
						</Banner>
					</ComponentExample>

					<ComponentExample
						title="All Tones"
						description="Compare all available tone options side by side."
						code={`<Banner tone="info" title="Info">Information message</Banner>
<Banner tone="success" title="Success">Success message</Banner>
<Banner tone="warning" title="Warning">Warning message</Banner>
<Banner tone="critical" title="Critical">Critical message</Banner>`}
					>
						<div className="space-y-4">
							<Banner tone="info" title="Info">
								Information message
							</Banner>
							<Banner tone="success" title="Success">
								Success message
							</Banner>
							<Banner tone="warning" title="Warning">
								Warning message
							</Banner>
							<Banner tone="critical" title="Critical">
								Critical message
							</Banner>
						</div>
					</ComponentExample>
				</section>

				<section className="space-y-4">
					<h2 className="text-lg font-semibold">Props</h2>
					<PropsTable props={bannerProps} />
				</section>

				<section className="space-y-4">
					<h2 className="text-lg font-semibold">Best Practices</h2>
					<p className="text-sm text-muted-foreground">Banners should:</p>
					<ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
						<li>Be placed at the top of the page or section they relate to</li>
						<li>Focus on a single topic or message</li>
						<li>Be concise and scannable (1-2 sentences)</li>
						<li>Include no more than one primary action</li>
						<li>Be dismissable unless they contain critical information</li>
						<li>Use the appropriate tone for the severity of the message</li>
					</ul>
				</section>

				<section className="space-y-4">
					<h2 className="text-lg font-semibold">When to Use Each Tone</h2>
					<div className="space-y-4 text-sm text-muted-foreground">
						<div>
							<h3 className="font-medium text-foreground">Info</h3>
							<p>General information, tips, or updates that don't require action.</p>
						</div>
						<div>
							<h3 className="font-medium text-foreground">Success</h3>
							<p>
								Confirmation of completed actions. For immediate feedback, consider using a
								toast instead.
							</p>
						</div>
						<div>
							<h3 className="font-medium text-foreground">Warning</h3>
							<p>
								Situations that need attention but aren't blocking. Use sparingly as
								warnings can cause stress.
							</p>
						</div>
						<div>
							<h3 className="font-medium text-foreground">Critical</h3>
							<p>
								Urgent problems that block task completion. Should not be dismissable
								until resolved.
							</p>
						</div>
					</div>
				</section>

				<section className="space-y-4">
					<h2 className="text-lg font-semibold">Accessibility</h2>
					<ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
						<li>
							Critical and warning banners use <code className="rounded bg-muted px-1">role="alert"</code> for
							screen reader announcements
						</li>
						<li>
							Info and success banners use <code className="rounded bg-muted px-1">role="status"</code> with
							polite announcements
						</li>
						<li>Color is not the only indicator of meaning - icons reinforce the tone</li>
						<li>
							Use <code className="rounded bg-muted px-1">stopAnnouncements</code> to prevent
							repeated announcements in dynamic content
						</li>
					</ul>
				</section>

				<section className="space-y-4">
					<h2 className="text-lg font-semibold">Related Components</h2>
					<ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
						<li>For feature announcements and promotions, use the CalloutCard component</li>
						<li>For inline form validation errors, use the Field component with error state</li>
						<li>For brief, temporary feedback, use a Toast component</li>
					</ul>
				</section>
			</div>
		</Page>
	)
}
