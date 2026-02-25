import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardAction } from "@blazz/ui/components/ui/card"
import { Button } from "@blazz/ui/components/ui/button"
import { DocPage } from "@/components/features/docs/doc-page"
import { DocSection } from "@/components/features/docs/doc-section"
import { DocExample } from "@/components/features/docs/doc-example"
import { DocPropsTable, type DocProp } from "@/components/features/docs/doc-props-table"
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
export default function CardPage() {
	return (
		<DocPage
			title="Card"
			subtitle="Cards are used to group similar concepts and tasks together for users to scan, read, and get things done more easily."
			toc={toc}
		>
			<DocSection id="examples" title="Examples">
					<DocExample
						title="Default"
						description="A basic card with content."
						code={`<Card>
  <CardContent>
    <p>Content inside a card</p>
  </CardContent>
</Card>`}
					>
						<Card>
							<CardContent>
								<p className="text-sm text-fg-muted">Content inside a card</p>
							</CardContent>
						</Card>
					</DocExample>
					<DocExample
						title="With Header"
						description="A card with a header section including title and description."
						code={`<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>
      Card description goes here
    </CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content</p>
  </CardContent>
</Card>`}
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
					</DocExample>
					<DocExample
						title="With Header Action"
						description="A card with an action button in the header."
						code={`<Card>
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
</Card>`}
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
					</DocExample>
					<DocExample
						title="Small Size"
						description="A compact card with reduced padding."
						code={`<Card size="sm">
  <CardHeader>
    <CardTitle>Compact Card</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Smaller padding for dense UIs</p>
  </CardContent>
</Card>`}
					>
						<Card size="sm">
							<CardHeader>
								<CardTitle>Compact Card</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-sm text-fg-muted">Smaller padding for dense UIs</p>
							</CardContent>
						</Card>
					</DocExample>
				<DocExample
					title="With Footer"
					description="A card with a footer for actions."
					code={`<Card>
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
</Card>`}
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
				</DocExample>
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
