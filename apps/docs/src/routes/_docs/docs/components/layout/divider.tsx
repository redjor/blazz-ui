import { createFileRoute } from "@tanstack/react-router"
import { Divider } from "@blazz/ui/components/ui/divider"
import { Card, CardContent } from "@blazz/ui/components/ui/card"
import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocPropsTable, type DocProp } from "~/components/docs/doc-props-table"
import { highlightCode } from "~/lib/highlight-code"

const examples = [
	{
		key: "default",
		code: `<BlockStack gap="400">
  <p>Content above</p>
  <Divider />
  <p>Content below</p>
</BlockStack>`,
	},
	{
		key: "colors",
		code: `<Divider borderColor="default" />
<Divider borderColor="secondary" />
<Divider borderColor="inverse" />`,
	},
	{
		key: "widths",
		code: `<Divider borderWidth="025" />
<Divider borderWidth="050" />
<Divider borderWidth="100" />`,
	},
] as const

export const Route = createFileRoute("/_docs/docs/components/layout/divider")({
	loader: async () => {
		const highlighted = await Promise.all(
			examples.map(async (ex) => ({
				key: ex.key,
				html: await highlightCode({ data: { code: ex.code } }),
			}))
		)
		return { highlighted }
	},
	component: DividerPage,
})

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "props", title: "Props" },
]

const dividerProps: DocProp[] = [
	{
		name: "borderColor",
		type: '"default" | "secondary" | "inverse" | "transparent"',
		default: '"secondary"',
		description: "The color of the divider line.",
	},
	{
		name: "borderWidth",
		type: '"025" | "050" | "100"',
		default: '"025"',
		description: "The width of the divider line.",
	},
	{
		name: "className",
		type: "string",
		description: "Additional CSS classes to apply.",
	},
]

function DividerPage() {
	const { highlighted } = Route.useLoaderData()
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="Divider"
			subtitle="Use to separate or group content."
			toc={toc}
		>
			<DocSection id="examples" title="Examples">
				<DocExampleClient
					title="Default"
					description="A basic divider to separate content."
					code={examples[0].code}
					highlightedCode={html("default")}
				>
					<Card>
						<CardContent>
							<BlockStack gap="400">
								<p className="text-sm">Content above</p>
								<Divider />
								<p className="text-sm">Content below</p>
							</BlockStack>
						</CardContent>
					</Card>
				</DocExampleClient>

				<DocExampleClient
					title="Border Colors"
					description="Different border color options."
					code={examples[1].code}
					highlightedCode={html("colors")}
				>
					<Card>
						<CardContent>
							<BlockStack gap="500">
								<div className="space-y-2">
									<p className="text-xs font-medium">Default</p>
									<Divider borderColor="default" />
								</div>
								<div className="space-y-2">
									<p className="text-xs font-medium">Secondary</p>
									<Divider borderColor="secondary" />
								</div>
								<div className="space-y-2">
									<p className="text-xs font-medium">Inverse</p>
									<Divider borderColor="inverse" />
								</div>
							</BlockStack>
						</CardContent>
					</Card>
				</DocExampleClient>

				<DocExampleClient
					title="Border Width"
					description="Different border width options."
					code={examples[2].code}
					highlightedCode={html("widths")}
				>
					<Card>
						<CardContent>
							<BlockStack gap="500">
								<div className="space-y-2">
									<p className="text-xs font-medium">Width 025 (1px)</p>
									<Divider borderWidth="025" borderColor="default" />
								</div>
								<div className="space-y-2">
									<p className="text-xs font-medium">Width 050 (2px)</p>
									<Divider borderWidth="050" borderColor="default" />
								</div>
								<div className="space-y-2">
									<p className="text-xs font-medium">Width 100 (4px)</p>
									<Divider borderWidth="100" borderColor="default" />
								</div>
							</BlockStack>
						</CardContent>
					</Card>
				</DocExampleClient>
			</DocSection>

			<DocSection id="props" title="Props">
				<DocPropsTable props={dividerProps} />
			</DocSection>
		</DocPage>
	)
}
