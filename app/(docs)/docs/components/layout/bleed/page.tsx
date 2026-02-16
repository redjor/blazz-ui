import { Bleed } from "@/components/ui/bleed"
import { Card, CardContent } from "@/components/ui/card"
import { DocPage } from "@/components/features/docs/doc-page"
import { DocSection } from "@/components/features/docs/doc-section"
import { DocExample } from "@/components/features/docs/doc-example"
import { DocPropsTable, type DocProp } from "@/components/features/docs/doc-props-table"
import { DocRelated } from "@/components/features/docs/doc-related"

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "props", title: "Props" },
	{ id: "related", title: "Related" },
]

const bleedProps: DocProp[] = [
	{
		name: "marginInline",
		type: "SpaceScale",
		description: "Negative horizontal space around children (both left and right).",
	},
	{
		name: "marginBlock",
		type: "SpaceScale",
		description: "Negative vertical space around children (both top and bottom).",
	},
	{
		name: "marginBlockStart",
		type: "SpaceScale",
		description: "Negative top space around children.",
	},
	{
		name: "marginBlockEnd",
		type: "SpaceScale",
		description: "Negative bottom space around children.",
	},
	{
		name: "marginInlineStart",
		type: "SpaceScale",
		description: "Negative left space around children.",
	},
	{
		name: "marginInlineEnd",
		type: "SpaceScale",
		description: "Negative right space around children.",
	},
	{
		name: "children",
		type: "React.ReactNode",
		description: "The content that will bleed into the surrounding layout.",
	},
]

export default function BleedPage() {
	return (
		<DocPage
			title="Bleed"
			subtitle="Applies negative margin to allow content to bleed out into the surrounding layout."
			toc={toc}
		>
			<DocSection id="examples" title="Examples">
				<DocExample
					title="Horizontal Bleed"
					description="Content will bleed horizontally into the surrounding layout using the marginInline prop."
					code={`<Card>
  <CardContent>
    <p>Content inside a card</p>
    <Bleed marginInline="400">
      <div className="bg-blue-100 p-4">
        This content bleeds horizontally
      </div>
    </Bleed>
  </CardContent>
</Card>`}
				>
					<Card>
						<CardContent>
							<p className="mb-4 text-sm">Content inside a card</p>
							<Bleed marginInline="400">
								<div className="bg-brand/10 px-4 py-3 text-sm">
									This content bleeds horizontally
								</div>
							</Bleed>
						</CardContent>
					</Card>
				</DocExample>

				<DocExample
					title="Vertical Bleed"
					description="Content will bleed vertically using the marginBlock prop."
					code={`<Card>
  <CardContent>
    <Bleed marginBlock="400">
      <div className="bg-blue-100 p-4">
        This content bleeds vertically
      </div>
    </Bleed>
    <p>Content below the bleed</p>
  </CardContent>
</Card>`}
				>
					<Card>
						<CardContent>
							<Bleed marginBlock="400">
								<div className="bg-brand/10 px-4 py-3 text-sm">
									This content bleeds vertically
								</div>
							</Bleed>
							<p className="mt-4 text-sm">Content below the bleed</p>
						</CardContent>
					</Card>
				</DocExample>

				<DocExample
					title="Specific Direction"
					description="Bleed in a specific direction using individual margin props."
					code={`<Card>
  <CardContent>
    <Bleed marginInlineStart="400">
      <div className="bg-blue-100 p-4">
        Bleeds only to the left
      </div>
    </Bleed>
  </CardContent>
</Card>`}
				>
					<Card>
						<CardContent>
							<Bleed marginInlineStart="400">
								<div className="bg-brand/10 px-4 py-3 text-sm">Bleeds only to the left</div>
							</Bleed>
						</CardContent>
					</Card>
				</DocExample>

				<DocExample
					title="Full Bleed"
					description="Combine marginInline and marginBlock for a full bleed effect."
					code={`<Card>
  <CardContent>
    <p>Content above</p>
    <Bleed marginInline="400" marginBlock="400">
      <div className="bg-blue-100 p-4">
        Full bleed content
      </div>
    </Bleed>
    <p>Content below</p>
  </CardContent>
</Card>`}
				>
					<Card>
						<CardContent>
							<p className="mb-4 text-sm">Content above</p>
							<Bleed marginInline="400" marginBlock="200">
								<div className="bg-brand/10 px-4 py-3 text-sm">Full bleed content</div>
							</Bleed>
							<p className="mt-4 text-sm">Content below</p>
						</CardContent>
					</Card>
				</DocExample>
			</DocSection>

			<DocSection id="props" title="Props">
				<DocPropsTable props={bleedProps} />
			</DocSection>

			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{
							title: "Box",
							href: "/docs/components/layout/box",
							description: "The most primitive layout component for accessing design tokens.",
						},
						{
							title: "Card",
							href: "/docs/components/layout/card",
							description: "Group similar concepts and tasks together.",
						},
					]}
				/>
			</DocSection>
		</DocPage>
	)
}
