import { Alert, AlertTitle, AlertDescription, AlertAction } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { DocPage } from "@/components/features/docs/doc-page"
import { DocSection } from "@/components/features/docs/doc-section"
import { DocHero } from "@/components/features/docs/doc-hero"
import { DocExample } from "@/components/features/docs/doc-example"
import { DocPropsTable, type DocProp } from "@/components/features/docs/doc-props-table"
import { DocRelated } from "@/components/features/docs/doc-related"
import { AlertCircle, CheckCircle, Info, X } from "lucide-react"

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "props", title: "Props" },
	{ id: "tokens", title: "Design Tokens" },
	{ id: "guidelines", title: "Guidelines" },
	{ id: "related", title: "Related" },
]

const alertProps: DocProp[] = [
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
		<DocPage
			title="Alert"
			subtitle="Displays important messages in a highlighted box. Use for inline feedback and notifications."
			toc={toc}
		>
			<DocHero>
				<Alert className="max-w-md">
					<Info />
					<AlertTitle>Information</AlertTitle>
					<AlertDescription>Your session will expire in 5 minutes.</AlertDescription>
				</Alert>
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExample
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
				</DocExample>

				<DocExample
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
				</DocExample>

				<DocExample
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
				</DocExample>

				<DocExample
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
				</DocExample>

				<DocExample
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
				</DocExample>
			</DocSection>

			<DocSection id="props" title="Props">
				<DocPropsTable props={alertProps} />
			</DocSection>

			<DocSection id="tokens" title="Design Tokens">
				<p className="text-sm text-fg-muted">
					Alert uses the design system tokens for consistent styling:
				</p>
				<ul className="list-inside list-disc space-y-2 text-sm text-fg-muted">
					<li>
						<code className="text-xs">bg-surface</code> - Default alert background
					</li>
					<li>
						<code className="text-xs">text-fg</code> - Alert text color
					</li>
					<li>
						<code className="text-xs">bg-inform</code> - Info variant background
					</li>
					<li>
						<code className="text-xs">text-inform</code> - Info variant text
					</li>
					<li>
						<code className="text-xs">bg-positive</code> - Success variant background
					</li>
					<li>
						<code className="text-xs">bg-caution</code> - Warning variant background
					</li>
					<li>
						<code className="text-xs">bg-negative</code> - Destructive variant background
					</li>
					<li>
						<code className="text-xs">border-edge</code> - Alert border color
					</li>
					<li>
						<code className="text-xs">rounded-lg</code> - Border radius (0.5rem)
					</li>
				</ul>
			</DocSection>

			<DocSection id="guidelines" title="Guidelines">
				<ul className="list-inside list-disc space-y-2 text-sm text-fg-muted">
					<li>Use alerts for important, inline messages</li>
					<li>Keep alert content concise and actionable</li>
					<li>Use destructive variant only for errors</li>
					<li>For page-level messages, consider using Banner instead</li>
					<li>Provide a way to dismiss non-critical alerts</li>
				</ul>
			</DocSection>

			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{
							title: "Banner",
							href: "/docs/components/ui/banner",
							description: "Page-level notifications and messages.",
						},
						{
							title: "Dialog",
							href: "/docs/components/ui/dialog",
							description: "Modal dialogs for confirmations and forms.",
						},
					]}
				/>
			</DocSection>
		</DocPage>
	)
}
