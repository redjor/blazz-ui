"use client"

import { Rating } from "@blazz/ui/components/ui/rating"
import * as React from "react"
import { use } from "react"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { type DocProp, DocPropsTable } from "~/components/docs/doc-props-table"
import { DocRelated } from "~/components/docs/doc-related"
import { DocSection } from "~/components/docs/doc-section"
import { highlightExamples } from "~/lib/highlight-examples"

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "props", title: "Props" },
	{ id: "guidelines", title: "Guidelines" },
	{ id: "related", title: "Related" },
]

const ratingProps: DocProp[] = [
	{
		name: "value",
		type: "number",
		description: "The controlled rating value.",
	},
	{
		name: "defaultValue",
		type: "number",
		default: "0",
		description: "The default value for uncontrolled usage.",
	},
	{
		name: "onValueChange",
		type: "(value: number) => void",
		description: "Callback fired when the rating changes.",
	},
	{
		name: "max",
		type: "number",
		default: "5",
		description: "The maximum number of stars.",
	},
	{
		name: "allowHalf",
		type: "boolean",
		default: "false",
		description: "Whether half-star selections are allowed.",
	},
	{
		name: "readOnly",
		type: "boolean",
		default: "false",
		description: "Whether the rating is read-only (displays value but prevents interaction).",
	},
	{
		name: "disabled",
		type: "boolean",
		default: "false",
		description: "Whether the rating is disabled.",
	},
	{
		name: "size",
		type: '"sm" | "default" | "lg"',
		default: '"default"',
		description: "The size of the star icons.",
	},
]

const examples = [
	{
		key: "default",
		code: `<Rating defaultValue={0} />`,
	},
	{
		key: "sizes",
		code: `<Rating size="sm" defaultValue={3} />
<Rating size="default" defaultValue={3} />
<Rating size="lg" defaultValue={3} />`,
	},
	{
		key: "half",
		code: `<Rating allowHalf defaultValue={2.5} />`,
	},
	{
		key: "readonly",
		code: `<Rating readOnly value={3.5} allowHalf />`,
	},
	{
		key: "controlled",
		code: `const [value, setValue] = React.useState(3)

<Rating value={value} onValueChange={setValue} />
<p>Rating: {value} / 5</p>`,
	},
	{
		key: "disabled",
		code: `<Rating disabled defaultValue={2} />`,
	},
] as const

const highlightedPromise = highlightExamples(examples as any)

function ControlledRatingDemo() {
	const [value, setValue] = React.useState(3)

	return (
		<div className="space-y-3">
			<Rating value={value} onValueChange={setValue} />
			<p className="text-xs text-fg-muted">Rating: {value} / 5</p>
		</div>
	)
}

export default function RatingPage() {
	const highlighted = use(highlightedPromise)
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage title="Rating" subtitle="A star-based rating component for collecting or displaying user feedback. Supports half-star precision, multiple sizes, and read-only mode." toc={toc}>
			{/* Hero */}
			<DocHero>
				<Rating defaultValue={3} />
			</DocHero>

			{/* Examples */}
			<DocSection id="examples" title="Examples">
				<DocExampleClient title="Default" description="A basic interactive star rating." code={examples[0].code} highlightedCode={html("default")}>
					<Rating defaultValue={0} />
				</DocExampleClient>

				<DocExampleClient title="Sizes" description="Available rating sizes." code={examples[1].code} highlightedCode={html("sizes")}>
					<div className="flex flex-col gap-4">
						<div className="flex items-center gap-3">
							<Rating size="sm" defaultValue={3} />
							<span className="text-xs text-fg-muted">Small</span>
						</div>
						<div className="flex items-center gap-3">
							<Rating size="default" defaultValue={3} />
							<span className="text-xs text-fg-muted">Default</span>
						</div>
						<div className="flex items-center gap-3">
							<Rating size="lg" defaultValue={3} />
							<span className="text-xs text-fg-muted">Large</span>
						</div>
					</div>
				</DocExampleClient>

				<DocExampleClient title="Half Stars" description="Allow half-star precision for more granular ratings." code={examples[2].code} highlightedCode={html("half")}>
					<Rating allowHalf defaultValue={2.5} />
				</DocExampleClient>

				<DocExampleClient title="Read Only" description="Display a rating value without allowing interaction." code={examples[3].code} highlightedCode={html("readonly")}>
					<Rating readOnly value={3.5} allowHalf />
				</DocExampleClient>

				<DocExampleClient title="Controlled" description="Manage the rating value programmatically." code={examples[4].code} highlightedCode={html("controlled")}>
					<ControlledRatingDemo />
				</DocExampleClient>

				<DocExampleClient title="Disabled" description="Disabled ratings prevent user interaction." code={examples[5].code} highlightedCode={html("disabled")}>
					<Rating disabled defaultValue={2} />
				</DocExampleClient>
			</DocSection>

			{/* Props */}
			<DocSection id="props" title="Props">
				<DocPropsTable props={ratingProps} />
			</DocSection>

			{/* Guidelines */}
			<DocSection id="guidelines" title="Guidelines">
				<ul className="list-inside list-disc space-y-2 text-sm text-fg-muted">
					<li>Use read-only mode when displaying aggregate or historical ratings</li>
					<li>Enable half stars when more precise feedback is needed</li>
					<li>Use the small size for compact layouts like lists or cards</li>
					<li>Provide context labels (e.g., "4.5 out of 5") for accessibility</li>
				</ul>
			</DocSection>

			{/* Related */}
			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{
							title: "Input",
							href: "/docs/components/ui/input",
							description: "Basic text input for general-purpose data entry.",
						},
					]}
				/>
			</DocSection>
		</DocPage>
	)
}
