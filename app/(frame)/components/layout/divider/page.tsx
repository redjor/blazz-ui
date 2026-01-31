"use client"

import { Page } from "@/components/ui/page"
import { Divider } from "@/components/ui/divider"
import { Card, CardContent } from "@/components/ui/card"
import { BlockStack } from "@/components/ui/block-stack"
import { ComponentExample } from "@/components/features/docs/component-example"
import { PropsTable, type PropDefinition } from "@/components/features/docs/props-table"

const dividerProps: PropDefinition[] = [
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
		<Page title="Divider" subtitle="Use to separate or group content.">
			<div className="space-y-10">
				<section className="space-y-6">
					<h2 className="text-lg font-semibold">Examples</h2>

					<ComponentExample
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
					</ComponentExample>

					<ComponentExample
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
					</ComponentExample>

					<ComponentExample
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
					</ComponentExample>
				</section>

				<section className="space-y-4">
					<h2 className="text-lg font-semibold">Props</h2>
					<PropsTable props={dividerProps} />
				</section>
			</div>
		</Page>
	)
}
