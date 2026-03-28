"use client"

import { Bleed } from "@blazz/ui/components/ui/bleed"
import { Card, CardContent } from "@blazz/ui/components/ui/card"
import { use } from "react"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocPage } from "~/components/docs/doc-page"
import { type DocProp, DocPropsTable } from "~/components/docs/doc-props-table"
import { DocRelated } from "~/components/docs/doc-related"
import { DocSection } from "~/components/docs/doc-section"
import { highlightExamples } from "~/lib/highlight-examples"

const examples = [
	{
		key: "horizontal",
		code: `<Card>
  <CardContent>
    <p>Content inside a card</p>
    <Bleed marginInline="400">
      <div className="bg-blue-100 p-4">
        This content bleeds horizontally
      </div>
    </Bleed>
  </CardContent>
</Card>`,
	},
	{
		key: "vertical",
		code: `<Card>
  <CardContent>
    <Bleed marginBlock="400">
      <div className="bg-blue-100 p-4">
        This content bleeds vertically
      </div>
    </Bleed>
    <p>Content below the bleed</p>
  </CardContent>
</Card>`,
	},
	{
		key: "specific-direction",
		code: `<Card>
  <CardContent>
    <Bleed marginInlineStart="400">
      <div className="bg-blue-100 p-4">
        Bleeds only to the left
      </div>
    </Bleed>
  </CardContent>
</Card>`,
	},
	{
		key: "full-bleed",
		code: `<Card>
  <CardContent>
    <p>Content above</p>
    <Bleed marginInline="400" marginBlock="400">
      <div className="bg-blue-100 p-4">
        Full bleed content
      </div>
    </Bleed>
    <p>Content below</p>
  </CardContent>
</Card>`,
	},
] as const

const highlightedPromise = highlightExamples(examples as any)

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
	const highlighted = use(highlightedPromise)
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage title="Bleed" subtitle="Applies negative margin to allow content to bleed out into the surrounding layout." toc={toc}>
			<DocSection id="examples" title="Examples">
				<DocExampleClient
					title="Horizontal Bleed"
					description="Content will bleed horizontally into the surrounding layout using the marginInline prop."
					code={examples[0].code}
					highlightedCode={html("horizontal")}
				>
					<Card>
						<CardContent>
							<p className="mb-4 text-sm">Content inside a card</p>
							<Bleed marginInline="400">
								<div className="bg-brand/10 px-4 py-3 text-sm">This content bleeds horizontally</div>
							</Bleed>
						</CardContent>
					</Card>
				</DocExampleClient>

				<DocExampleClient title="Vertical Bleed" description="Content will bleed vertically using the marginBlock prop." code={examples[1].code} highlightedCode={html("vertical")}>
					<Card>
						<CardContent>
							<Bleed marginBlock="400">
								<div className="bg-brand/10 px-4 py-3 text-sm">This content bleeds vertically</div>
							</Bleed>
							<p className="mt-4 text-sm">Content below the bleed</p>
						</CardContent>
					</Card>
				</DocExampleClient>

				<DocExampleClient title="Specific Direction" description="Bleed in a specific direction using individual margin props." code={examples[2].code} highlightedCode={html("specific-direction")}>
					<Card>
						<CardContent>
							<Bleed marginInlineStart="400">
								<div className="bg-brand/10 px-4 py-3 text-sm">Bleeds only to the left</div>
							</Bleed>
						</CardContent>
					</Card>
				</DocExampleClient>

				<DocExampleClient title="Full Bleed" description="Combine marginInline and marginBlock for a full bleed effect." code={examples[3].code} highlightedCode={html("full-bleed")}>
					<Card>
						<CardContent>
							<p className="mb-4 text-sm">Content above</p>
							<Bleed marginInline="400" marginBlock="200">
								<div className="bg-brand/10 px-4 py-3 text-sm">Full bleed content</div>
							</Bleed>
							<p className="mt-4 text-sm">Content below</p>
						</CardContent>
					</Card>
				</DocExampleClient>
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
