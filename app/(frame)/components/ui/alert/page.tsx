"use client"

import { Page } from "@/components/ui/page"
import { Alert, AlertTitle, AlertDescription, AlertAction } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { ComponentExample } from "@/components/features/docs/component-example"
import { PropsTable, type PropDefinition } from "@/components/features/docs/props-table"
import { AlertCircle, CheckCircle, Info, X } from "lucide-react"

const alertProps: PropDefinition[] = [
	{
		name: "variant",
		type: '"default" | "destructive"',
		default: '"default"',
		description: "The visual style of the alert.",
	},
	{
		name: "children",
		type: "React.ReactNode",
		description: "The content of the alert (AlertTitle, AlertDescription, etc.).",
	},
]

export default function AlertPage() {
	return (
		<Page
			title="Alert"
			subtitle="Displays important messages in a highlighted box. Use for inline feedback and notifications."
		>
			<div className="space-y-10">
				<section className="space-y-6">
					<h2 className="text-lg font-semibold">Examples</h2>

					<ComponentExample
						title="Default"
						description="A simple alert with title and description."
						code={`<Alert>
  <Info />
  <AlertTitle>Information</AlertTitle>
  <AlertDescription>
    Your session will expire in 5 minutes.
  </AlertDescription>
</Alert>`}
					>
						<Alert>
							<Info />
							<AlertTitle>Information</AlertTitle>
							<AlertDescription>Your session will expire in 5 minutes.</AlertDescription>
						</Alert>
					</ComponentExample>

					<ComponentExample
						title="Destructive"
						description="Use for error messages or critical warnings."
						code={`<Alert variant="destructive">
  <AlertCircle />
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>
    Your payment could not be processed.
  </AlertDescription>
</Alert>`}
					>
						<Alert variant="destructive">
							<AlertCircle />
							<AlertTitle>Error</AlertTitle>
							<AlertDescription>
								Your payment could not be processed. Please try again.
							</AlertDescription>
						</Alert>
					</ComponentExample>

					<ComponentExample
						title="Success"
						description="Indicate successful operations."
						code={`<Alert>
  <CheckCircle className="text-green-600" />
  <AlertTitle>Success</AlertTitle>
  <AlertDescription>
    Your changes have been saved.
  </AlertDescription>
</Alert>`}
					>
						<Alert>
							<CheckCircle className="text-green-600" />
							<AlertTitle>Success</AlertTitle>
							<AlertDescription>Your changes have been saved successfully.</AlertDescription>
						</Alert>
					</ComponentExample>

					<ComponentExample
						title="With Action"
						description="Add an action button for dismissible alerts."
						code={`<Alert>
  <Info />
  <AlertTitle>New update available</AlertTitle>
  <AlertDescription>
    A new version is ready to install.
  </AlertDescription>
  <AlertAction>
    <Button size="icon-sm" variant="ghost">
      <X />
    </Button>
  </AlertAction>
</Alert>`}
					>
						<Alert>
							<Info />
							<AlertTitle>New update available</AlertTitle>
							<AlertDescription>A new version is ready to install.</AlertDescription>
							<AlertAction>
								<Button size="icon-sm" variant="ghost">
									<X />
								</Button>
							</AlertAction>
						</Alert>
					</ComponentExample>

					<ComponentExample
						title="Without Icon"
						description="Alerts can be used without an icon."
						code={`<Alert>
  <AlertTitle>Note</AlertTitle>
  <AlertDescription>
    This is a simple alert without an icon.
  </AlertDescription>
</Alert>`}
					>
						<Alert>
							<AlertTitle>Note</AlertTitle>
							<AlertDescription>This is a simple alert without an icon.</AlertDescription>
						</Alert>
					</ComponentExample>
				</section>

				<section className="space-y-4">
					<h2 className="text-lg font-semibold">Props</h2>
					<PropsTable props={alertProps} />
				</section>

				{/* Design Tokens */}
				<section className="space-y-4">
					<h2 className="text-xl font-semibold">Design Tokens</h2>
					<p className="text-sm text-p-text-secondary">
						Alert uses the design system tokens for consistent styling:
					</p>
					<ul className="list-inside list-disc space-y-2 text-sm text-p-text-secondary">
						<li>
							<code className="text-xs">bg-p-bg-surface</code> - Default alert background
						</li>
						<li>
							<code className="text-xs">text-p-text</code> - Alert text color
						</li>
						<li>
							<code className="text-xs">bg-p-info-surface</code> - Info variant background
						</li>
						<li>
							<code className="text-xs">text-p-info-text</code> - Info variant text
						</li>
						<li>
							<code className="text-xs">bg-p-success-surface</code> - Success variant background
						</li>
						<li>
							<code className="text-xs">bg-p-warning-surface</code> - Warning variant background
						</li>
						<li>
							<code className="text-xs">bg-p-critical-surface</code> - Destructive variant background
						</li>
						<li>
							<code className="text-xs">border-p-border</code> - Alert border color
						</li>
						<li>
							<code className="text-xs">rounded-p-lg</code> - Border radius (0.5rem)
						</li>
					</ul>
				</section>

				<section className="space-y-4">
					<h2 className="text-lg font-semibold">Best Practices</h2>
					<ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
						<li>Use alerts for important, inline messages</li>
						<li>Keep alert content concise and actionable</li>
						<li>Use destructive variant only for errors</li>
						<li>For page-level messages, consider using Banner instead</li>
						<li>Provide a way to dismiss non-critical alerts</li>
					</ul>
				</section>

				<section className="space-y-4">
					<h2 className="text-lg font-semibold">Related Components</h2>
					<ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
						<li>For page-level notifications, use the Banner component</li>
						<li>For temporary feedback, use a Toast component</li>
					</ul>
				</section>
			</div>
		</Page>
	)
}
