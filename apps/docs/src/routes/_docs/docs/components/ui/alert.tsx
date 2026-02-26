import { createFileRoute } from "@tanstack/react-router"
import { Alert, AlertTitle, AlertDescription, AlertAction } from "@blazz/ui/components/ui/alert"
import { Button } from "@blazz/ui/components/ui/button"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"
import { DocHero } from "~/components/docs/doc-hero"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocPropsTable, type DocProp } from "~/components/docs/doc-props-table"
import { DocRelated } from "~/components/docs/doc-related"
import { AlertCircle, CheckCircle, Info, X } from "lucide-react"
import { highlightCode } from "~/lib/highlight.server"

const examples = [
	{
		key: "default",
		code: `<Alert>
  <Info />
  <AlertTitle>Information</AlertTitle>
  <AlertDescription>
    Your session will expire in 5 minutes.
  </AlertDescription>
</Alert>`,
	},
	{
		key: "destructive",
		code: `<Alert variant="destructive">
  <AlertCircle />
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>
    Your payment could not be processed.
  </AlertDescription>
</Alert>`,
	},
	{
		key: "success",
		code: `<Alert>
  <CheckCircle className="text-green-600" />
  <AlertTitle>Success</AlertTitle>
  <AlertDescription>
    Your changes have been saved.
  </AlertDescription>
</Alert>`,
	},
	{
		key: "with-action",
		code: `<Alert>
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
</Alert>`,
	},
	{
		key: "without-icon",
		code: `<Alert>
  <AlertTitle>Note</AlertTitle>
  <AlertDescription>
    This is a simple alert without an icon.
  </AlertDescription>
</Alert>`,
	},
] as const

export const Route = createFileRoute("/_docs/docs/components/ui/alert")({
	loader: async () => {
		const highlighted = await Promise.all(
			examples.map(async (ex) => ({
				key: ex.key,
				html: await highlightCode({ data: { code: ex.code } }),
			}))
		)
		return { highlighted }
	},
	component: AlertPage,
})

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

function AlertPage() {
	const { highlighted } = Route.useLoaderData()
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

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
				<DocExampleClient
					title="Default"
					description="A simple alert with title and description."
					code={examples[0].code}
					highlightedCode={html("default")}
				>
					<Alert>
						<Info />
						<AlertTitle>Information</AlertTitle>
						<AlertDescription>Your session will expire in 5 minutes.</AlertDescription>
					</Alert>
				</DocExampleClient>

				<DocExampleClient
					title="Destructive"
					description="Use for error messages or critical warnings."
					code={examples[1].code}
					highlightedCode={html("destructive")}
				>
					<Alert variant="destructive">
						<AlertCircle />
						<AlertTitle>Error</AlertTitle>
						<AlertDescription>
							Your payment could not be processed. Please try again.
						</AlertDescription>
					</Alert>
				</DocExampleClient>

				<DocExampleClient
					title="Success"
					description="Indicate successful operations."
					code={examples[2].code}
					highlightedCode={html("success")}
				>
					<Alert>
						<CheckCircle className="text-green-600" />
						<AlertTitle>Success</AlertTitle>
						<AlertDescription>Your changes have been saved successfully.</AlertDescription>
					</Alert>
				</DocExampleClient>

				<DocExampleClient
					title="With Action"
					description="Add an action button for dismissible alerts."
					code={examples[3].code}
					highlightedCode={html("with-action")}
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
				</DocExampleClient>

				<DocExampleClient
					title="Without Icon"
					description="Alerts can be used without an icon."
					code={examples[4].code}
					highlightedCode={html("without-icon")}
				>
					<Alert>
						<AlertTitle>Note</AlertTitle>
						<AlertDescription>This is a simple alert without an icon.</AlertDescription>
					</Alert>
				</DocExampleClient>
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
