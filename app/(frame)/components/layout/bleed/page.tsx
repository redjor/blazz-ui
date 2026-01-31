"use client"

import { Page } from "@/components/ui/page"
import { Bleed } from "@/components/ui/bleed"
import { Card, CardContent } from "@/components/ui/card"
import { ComponentExample } from "@/components/features/docs/component-example"
import { PropsTable, type PropDefinition } from "@/components/features/docs/props-table"

const bleedProps: PropDefinition[] = [
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
		<Page
			title="Bleed"
			subtitle="Applies negative margin to allow content to bleed out into the surrounding layout."
		>
			<div className="space-y-10">
				<section className="space-y-6">
					<h2 className="text-lg font-semibold">Examples</h2>

					<ComponentExample
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
									<div className="bg-primary/10 px-4 py-3 text-sm">
										This content bleeds horizontally
									</div>
								</Bleed>
							</CardContent>
						</Card>
					</ComponentExample>

					<ComponentExample
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
									<div className="bg-primary/10 px-4 py-3 text-sm">
										This content bleeds vertically
									</div>
								</Bleed>
								<p className="mt-4 text-sm">Content below the bleed</p>
							</CardContent>
						</Card>
					</ComponentExample>

					<ComponentExample
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
									<div className="bg-primary/10 px-4 py-3 text-sm">Bleeds only to the left</div>
								</Bleed>
							</CardContent>
						</Card>
					</ComponentExample>

					<ComponentExample
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
									<div className="bg-primary/10 px-4 py-3 text-sm">Full bleed content</div>
								</Bleed>
								<p className="mt-4 text-sm">Content below</p>
							</CardContent>
						</Card>
					</ComponentExample>
				</section>

				<section className="space-y-4">
					<h2 className="text-lg font-semibold">Props</h2>
					<PropsTable props={bleedProps} />
				</section>

				<section className="space-y-4">
					<h2 className="text-lg font-semibold">Bleed Values</h2>
					<p className="text-sm text-muted-foreground">
						Content should never go beyond the edges of the parent container. Choose a bleed
						value that works with your container's padding. Available values: 0, 050, 100,
						150, 200, 300, 400, 500, 600, 800, 1000, 1200, 1600.
					</p>
				</section>

				<section className="space-y-4">
					<h2 className="text-lg font-semibold">Related Resources</h2>
					<ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
						<li>
							Bleed props are named following the convention of CSS logical properties,
							such as marginInlineStart instead of marginLeft
						</li>
					</ul>
				</section>
			</div>
		</Page>
	)
}
