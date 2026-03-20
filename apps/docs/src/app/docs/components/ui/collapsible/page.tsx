"use client"

import { use } from "react"
import { Button } from "@blazz/ui/components/ui/button"
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@blazz/ui/components/ui/collapsible"
import { ChevronsUpDown } from "lucide-react"
import { ControlledCollapsibleDemo } from "./demos"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { type DocProp, DocPropsTable } from "~/components/docs/doc-props-table"
import { DocRelated } from "~/components/docs/doc-related"
import { DocSection } from "~/components/docs/doc-section"
import { highlightExamples } from "~/lib/highlight-examples"

const examples = [
	{
		key: "default",
		code: `<Collapsible>
  <CollapsibleTrigger>Toggle</CollapsibleTrigger>
  <CollapsibleContent>
    <p>Collapsible content goes here.</p>
  </CollapsibleContent>
</Collapsible>`,
	},
	{
		key: "with-button",
		code: `<Collapsible className="space-y-2">
  <div className="flex items-center justify-between gap-4">
    <h4 className="text-sm font-semibold">3 items</h4>
    <CollapsibleTrigger render={<Button variant="ghost" size="sm" />}>
      <ChevronsUpDown className="size-4" />
      <span className="sr-only">Toggle</span>
    </CollapsibleTrigger>
  </div>
  <div className="rounded-md border border-edge px-4 py-3 text-sm">
    Item 1
  </div>
  <CollapsibleContent className="space-y-2">
    <div className="rounded-md border border-edge px-4 py-3 text-sm">
      Item 2
    </div>
    <div className="rounded-md border border-edge px-4 py-3 text-sm">
      Item 3
    </div>
  </CollapsibleContent>
</Collapsible>`,
	},
	{
		key: "controlled",
		code: `const [open, setOpen] = React.useState(false)

<Collapsible open={open} onOpenChange={setOpen}>
  <CollapsibleTrigger render={<Button variant="outline" size="sm" />}>
    {open ? "Hide" : "Show"} details
  </CollapsibleTrigger>
  <CollapsibleContent className="mt-2">
    <div className="rounded-md border border-edge px-4 py-3 text-sm text-fg-muted">
      These are the details that can be toggled on and off.
    </div>
  </CollapsibleContent>
</Collapsible>`,
	},
	{
		key: "default-open",
		code: `<Collapsible defaultOpen>
  <CollapsibleTrigger render={<Button variant="ghost" size="sm" />}>
    Toggle section
  </CollapsibleTrigger>
  <CollapsibleContent className="mt-2">
    <div className="rounded-md border border-edge px-4 py-3 text-sm text-fg-muted">
      This content is visible by default.
    </div>
  </CollapsibleContent>
</Collapsible>`,
	},
	{
		key: "disabled",
		code: `<Collapsible disabled>
  <CollapsibleTrigger render={<Button variant="outline" size="sm" />}>
    Cannot toggle
  </CollapsibleTrigger>
  <CollapsibleContent className="mt-2">
    <p>This content is hidden and cannot be revealed.</p>
  </CollapsibleContent>
</Collapsible>`,
	},
] as const

const highlightedPromise = highlightExamples(examples as any)

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "collapsible-props", title: "Collapsible Props" },
	{ id: "trigger-props", title: "CollapsibleTrigger Props" },
	{ id: "content-props", title: "CollapsibleContent Props" },
	{ id: "guidelines", title: "Guidelines" },
	{ id: "related", title: "Related" },
]

const collapsibleProps: DocProp[] = [
	{
		name: "open",
		type: "boolean",
		description: "Controlled open state.",
	},
	{
		name: "defaultOpen",
		type: "boolean",
		default: "false",
		description: "Whether the collapsible is open by default (uncontrolled).",
	},
	{
		name: "onOpenChange",
		type: "(open: boolean) => void",
		description: "Callback fired when the open state changes.",
	},
	{
		name: "disabled",
		type: "boolean",
		default: "false",
		description: "Prevents the collapsible from being toggled.",
	},
]

const triggerProps: DocProp[] = [
	{
		name: "render",
		type: "React.ReactElement",
		description:
			"Render the trigger as a custom element. Use this to compose with Button or other components.",
	},
]

const contentProps: DocProp[] = [
	{
		name: "keepMounted",
		type: "boolean",
		default: "false",
		description: "Whether the content remains in the DOM when collapsed.",
	},
]


export default function CollapsiblePage() {
	const highlighted = use(highlightedPromise)
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="Collapsible"
			subtitle="An interactive section that toggles the visibility of its content. Useful for progressive disclosure of secondary information."
			toc={toc}
		>
			<DocHero>
				<Collapsible className="w-full max-w-sm space-y-2">
					<div className="flex items-center justify-between gap-4">
						<h4 className="text-sm font-semibold">3 items</h4>
						<CollapsibleTrigger render={<Button variant="ghost" size="sm" />}>
							<ChevronsUpDown className="size-4" />
							<span className="sr-only">Toggle</span>
						</CollapsibleTrigger>
					</div>
					<div className="rounded-md border border-edge px-4 py-3 text-sm">Item 1</div>
					<CollapsibleContent className="space-y-2">
						<div className="rounded-md border border-edge px-4 py-3 text-sm">Item 2</div>
						<div className="rounded-md border border-edge px-4 py-3 text-sm">Item 3</div>
					</CollapsibleContent>
				</Collapsible>
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExampleClient
					title="Default"
					description="A basic collapsible with a text trigger."
					code={examples[0].code}
					highlightedCode={html("default")}
				>
					<Collapsible>
						<CollapsibleTrigger>Toggle</CollapsibleTrigger>
						<CollapsibleContent>
							<p>Collapsible content goes here.</p>
						</CollapsibleContent>
					</Collapsible>
				</DocExampleClient>

				<DocExampleClient
					title="With Button Trigger"
					description="Use the render prop to compose the trigger with a Button."
					code={examples[1].code}
					highlightedCode={html("with-button")}
				>
					<Collapsible className="w-full max-w-sm space-y-2">
						<div className="flex items-center justify-between gap-4">
							<h4 className="text-sm font-semibold">3 items</h4>
							<CollapsibleTrigger render={<Button variant="ghost" size="sm" />}>
								<ChevronsUpDown className="size-4" />
								<span className="sr-only">Toggle</span>
							</CollapsibleTrigger>
						</div>
						<div className="rounded-md border border-edge px-4 py-3 text-sm">Item 1</div>
						<CollapsibleContent className="space-y-2">
							<div className="rounded-md border border-edge px-4 py-3 text-sm">Item 2</div>
							<div className="rounded-md border border-edge px-4 py-3 text-sm">Item 3</div>
						</CollapsibleContent>
					</Collapsible>
				</DocExampleClient>

				<DocExampleClient
					title="Controlled"
					description="Control the open state programmatically."
					code={examples[2].code}
					highlightedCode={html("controlled")}
				>
					<ControlledCollapsibleDemo />
				</DocExampleClient>

				<DocExampleClient
					title="Default Open"
					description="Start with the content expanded."
					code={examples[3].code}
					highlightedCode={html("default-open")}
				>
					<Collapsible defaultOpen>
						<CollapsibleTrigger render={<Button variant="ghost" size="sm" />}>
							Toggle section
						</CollapsibleTrigger>
						<CollapsibleContent className="mt-2">
							<div className="rounded-md border border-edge px-4 py-3 text-sm text-fg-muted">
								This content is visible by default.
							</div>
						</CollapsibleContent>
					</Collapsible>
				</DocExampleClient>

				<DocExampleClient
					title="Disabled"
					description="Prevent the collapsible from being toggled."
					code={examples[4].code}
					highlightedCode={html("disabled")}
				>
					<Collapsible disabled>
						<CollapsibleTrigger render={<Button variant="outline" size="sm" />}>
							Cannot toggle
						</CollapsibleTrigger>
						<CollapsibleContent className="mt-2">
							<p>This content is hidden and cannot be revealed.</p>
						</CollapsibleContent>
					</Collapsible>
				</DocExampleClient>
			</DocSection>

			<DocSection id="collapsible-props" title="Collapsible Props">
				<DocPropsTable props={collapsibleProps} />
			</DocSection>

			<DocSection id="trigger-props" title="CollapsibleTrigger Props">
				<DocPropsTable props={triggerProps} />
			</DocSection>

			<DocSection id="content-props" title="CollapsibleContent Props">
				<DocPropsTable props={contentProps} />
			</DocSection>

			<DocSection id="guidelines" title="Guidelines">
				<ul className="list-inside list-disc space-y-2 text-sm text-fg-muted">
					<li>
						Use Collapsible for progressive disclosure — show the essential first, reveal details on
						demand
					</li>
					<li>
						Use the <code className="text-xs">render</code> prop on CollapsibleTrigger to compose
						with Button (never use asChild)
					</li>
					<li>For multiple collapsible sections (FAQ, settings), consider Accordion instead</li>
					<li>Keep the trigger label descriptive so users know what will be revealed</li>
					<li>Add a visual indicator (chevron icon) to signal that the section is expandable</li>
				</ul>
			</DocSection>

			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{
							title: "Accordion",
							href: "/docs/components/ui/accordion",
							description: "For multiple collapsible sections where only one or some can be open.",
						},
						{
							title: "Dialog",
							href: "/docs/components/ui/dialog",
							description:
								"For content that requires focus and blocks interaction with the rest of the page.",
						},
						{
							title: "Tabs",
							href: "/docs/components/ui/tabs",
							description: "For switching between views where all content is equally important.",
						},
					]}
				/>
			</DocSection>
		</DocPage>
	)
}
