import { Divider } from "@blazz/ui/components/ui/divider"
import { Card, CardContent } from "@blazz/ui/components/ui/card"
import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { DocPage } from "@/components/features/docs/doc-page"
import { DocSection } from "@/components/features/docs/doc-section"
import { DocExample } from "@/components/features/docs/doc-example"
import { DocPropsTable, type DocProp } from "@/components/features/docs/doc-props-table"

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

export default function DividerPage() {
	return (
		<DocPage
			title="Divider"
			subtitle="Use to separate or group content."
			toc={toc}
		>
			<DocSection id="examples" title="Examples">
				<DocExample
					title="Default"
					description="A basic divider to separate content."
					code={`<BlockStack gap="400">
  <p>Content above</p>
  <Divider />
  <p>Content below</p>
</BlockStack>`}
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
				</DocExample>

				<DocExample
					title="Border Colors"
					description="Different border color options."
					code={`<Divider borderColor="default" />
<Divider borderColor="secondary" />
<Divider borderColor="inverse" />`}
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
				</DocExample>

				<DocExample
					title="Border Width"
					description="Different border width options."
					code={`<Divider borderWidth="025" />
<Divider borderWidth="050" />
<Divider borderWidth="100" />`}
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
				</DocExample>
			</DocSection>

			<DocSection id="props" title="Props">
				<DocPropsTable props={dividerProps} />
			</DocSection>
		</DocPage>
	)
}
