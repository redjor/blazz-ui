import { createFileRoute } from "@tanstack/react-router"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardAction } from "@blazz/ui/components/ui/card"
import { Button } from "@blazz/ui/components/ui/button"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocPropsTable, type DocProp } from "~/components/docs/doc-props-table"
import { highlightCode } from "~/lib/highlight.server"

const examples = [
	{
		key: "default",
		code: `<Card>
  <CardContent>
    <p>Content inside a card</p>
  </CardContent>
</Card>`,
	},
	{
		key: "with-header",
		code: `<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>
      Card description goes here
    </CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content</p>
  </CardContent>
</Card>`,
	},
	{
		key: "header-action",
		code: `<Card>
  <CardHeader>
    <CardTitle>Orders</CardTitle>
    <CardDescription>
      Recent orders from your store
    </CardDescription>
    <CardAction>
      <Button variant="outline" size="sm">
        View all
      </Button>
    </CardAction>
  </CardHeader>
  <CardContent>
    <p>Order list goes here</p>
  </CardContent>
</Card>`,
	},
	{
		key: "small-size",
		code: `<Card size="sm">
  <CardHeader>
    <CardTitle>Compact Card</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Smaller padding for dense UIs</p>
  </CardContent>
</Card>`,
	},
	{
		key: "with-footer",
		code: `<Card>
  <CardHeader>
    <CardTitle>Settings</CardTitle>
    <CardDescription>
      Manage your account settings
    </CardDescription>
  </CardHeader>
  <CardContent>
    <p>Settings form goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Save changes</Button>
  </CardFooter>
</Card>`,
	},
] as const

export const Route = createFileRoute("/_docs/docs/components/layout/card")({
	loader: async () => {
		const highlighted = await Promise.all(
			examples.map(async (ex) => ({
				key: ex.key,
				html: await highlightCode({ data: { code: ex.code } }),
			}))
		)
		return { highlighted }
	},
	component: CardPage,
})

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "props", title: "Props" },
	{ id: "best-practices", title: "Best Practices" },
]

const cardProps: DocProp[] = [
	{
		name: "size",
		type: '"default" | "sm"',
		default: '"default"',
		description: "The size of the card. Affects padding and spacing.",
	},
	{
		name: "className",
		type: "string",
		description: "Additional CSS classes to apply to the card.",
	},
	{
		name: "children",
		type: "React.ReactNode",
		description: "The content to display inside the card.",
	},
]

function CardPage() {
	const { highlighted } = Route.useLoaderData()
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="Card"
			subtitle="Cards are used to group similar concepts and tasks together for users to scan, read, and get things done more easily."
			toc={toc}
		>
			<DocSection id="examples" title="Examples">
				<DocExampleClient
					title="Default"
					description="A basic card with content."
					code={examples[0].code}
					highlightedCode={html("default")}
				>
					<Card>
						<CardContent>
							<p className="text-sm text-fg-muted">Content inside a card</p>
						</CardContent>
					</Card>
				</DocExampleClient>

				<DocExampleClient
					title="With Header"
					description="A card with a header section including title and description."
					code={examples[1].code}
					highlightedCode={html("with-header")}
				>
					<Card>
						<CardHeader>
							<CardTitle>Card Title</CardTitle>
							<CardDescription>Card description goes here</CardDescription>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-fg-muted">Card content</p>
						</CardContent>
					</Card>
				</DocExampleClient>

				<DocExampleClient
					title="With Header Action"
					description="A card with an action button in the header."
					code={examples[2].code}
					highlightedCode={html("header-action")}
				>
					<Card>
						<CardHeader>
							<CardTitle>Orders</CardTitle>
							<CardDescription>Recent orders from your store</CardDescription>
							<CardAction>
								<Button variant="outline" size="sm">
									View all
								</Button>
							</CardAction>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-fg-muted">Order list goes here</p>
						</CardContent>
					</Card>
				</DocExampleClient>

				<DocExampleClient
					title="Small Size"
					description="A compact card with reduced padding."
					code={examples[3].code}
					highlightedCode={html("small-size")}
				>
					<Card size="sm">
						<CardHeader>
							<CardTitle>Compact Card</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-fg-muted">Smaller padding for dense UIs</p>
						</CardContent>
					</Card>
				</DocExampleClient>

				<DocExampleClient
					title="With Footer"
					description="A card with a footer for actions."
					code={examples[4].code}
					highlightedCode={html("with-footer")}
				>
					<Card>
						<CardHeader>
							<CardTitle>Settings</CardTitle>
							<CardDescription>Manage your account settings</CardDescription>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-fg-muted">Settings form goes here</p>
						</CardContent>
						<CardFooter>
							<Button>Save changes</Button>
						</CardFooter>
					</Card>
				</DocExampleClient>
			</DocSection>

			<DocSection id="props" title="Props">
				<DocPropsTable props={cardProps} />
			</DocSection>

			<DocSection id="best-practices" title="Best Practices">
				<ul className="list-inside list-disc space-y-2 text-sm text-fg-muted">
					<li>Group related information together</li>
					<li>Display information in a way that prioritizes what the user needs to know first</li>
					<li>Use headings that set clear expectations about the card's purpose</li>
					<li>Stick to single user flows or break more complicated flows into multiple sections</li>
					<li>Avoid too many call-to-action buttons and only one primary call to action per card</li>
				</ul>
			</DocSection>
		</DocPage>
	)
}
