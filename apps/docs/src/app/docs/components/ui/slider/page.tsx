"use client"

import { Slider } from "@blazz/ui/components/ui/slider"
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

const sliderProps: DocProp[] = [
	{
		name: "value",
		type: "number | number[]",
		description: "Controlled value of the slider.",
	},
	{
		name: "defaultValue",
		type: "number | number[]",
		description: "Default value for uncontrolled usage.",
	},
	{
		name: "onValueChange",
		type: "(value: number | number[]) => void",
		description: "Callback fired continuously as the value changes.",
	},
	{
		name: "onValueCommitted",
		type: "(value: number | number[]) => void",
		description: "Callback fired when the user finishes dragging.",
	},
	{
		name: "min",
		type: "number",
		default: "0",
		description: "Minimum value of the slider.",
	},
	{
		name: "max",
		type: "number",
		default: "100",
		description: "Maximum value of the slider.",
	},
	{
		name: "step",
		type: "number",
		default: "1",
		description: "Step increment between values.",
	},
	{
		name: "orientation",
		type: '"horizontal" | "vertical"',
		default: '"horizontal"',
		description: "The orientation of the slider.",
	},
	{
		name: "disabled",
		type: "boolean",
		default: "false",
		description: "Whether the slider is disabled.",
	},
]

const examples = [
	{
		key: "default",
		code: `<Slider defaultValue={33} />`,
	},
	{
		key: "range",
		code: `<Slider defaultValue={[25, 75]} />`,
	},
	{
		key: "multiple-thumbs",
		code: `<Slider defaultValue={[10, 40, 70]} />`,
	},
	{
		key: "step",
		code: `<Slider defaultValue={50} step={10} />`,
	},
	{
		key: "vertical",
		code: `<Slider defaultValue={50} orientation="vertical" />`,
	},
	{
		key: "controlled",
		code: `const [value, setValue] = React.useState(50)

<Slider
  value={value}
  onValueChange={(v) => setValue(v as number)}
/>
<p>Value: {value}</p>`,
	},
	{
		key: "disabled",
		code: `<Slider disabled defaultValue={30} />`,
	},
] as const

const highlightedPromise = highlightExamples(examples as any)

function ControlledSliderDemo() {
	const [value, setValue] = React.useState(50)

	return (
		<div className="max-w-sm space-y-3">
			<Slider value={value} onValueChange={(v) => setValue(v as number)} />
			<p className="text-xs text-fg-muted">Value: {value}</p>
		</div>
	)
}

export default function SliderPage() {
	const highlighted = use(highlightedPromise)
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage title="Slider" subtitle="An input where the user selects a value from within a given range." toc={toc}>
			<DocHero>
				<Slider defaultValue={33} className="max-w-sm" step={10} />
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExampleClient title="Default" description="A basic slider with a single thumb." code={examples[0].code} highlightedCode={html("default")}>
					<Slider defaultValue={33} className="max-w-sm" />
				</DocExampleClient>

				<DocExampleClient title="Range" description="Use an array with two values for a range slider." code={examples[1].code} highlightedCode={html("range")}>
					<Slider defaultValue={[25, 50]} max={100} step={5} className="mx-auto w-full max-w-xs" />
				</DocExampleClient>

				<DocExampleClient title="Multiple Thumbs" description="Use an array with multiple values for multiple thumbs." code={examples[2].code} highlightedCode={html("multiple-thumbs")}>
					<Slider defaultValue={[10, 40, 70]} className="max-w-sm" />
				</DocExampleClient>

				<DocExampleClient title="Step" description="Set the step increment between values." code={examples[3].code} highlightedCode={html("step")}>
					<Slider defaultValue={50} step={10} className="max-w-sm" />
				</DocExampleClient>

				<DocExampleClient title="Vertical" description="Use the vertical orientation for a vertical slider." code={examples[4].code} highlightedCode={html("vertical")}>
					<div className="flex h-48 items-center justify-center">
						<Slider defaultValue={50} orientation="vertical" />
					</div>
				</DocExampleClient>

				<DocExampleClient title="Controlled" description="Control the slider value programmatically and display it." code={examples[5].code} highlightedCode={html("controlled")}>
					<ControlledSliderDemo />
				</DocExampleClient>

				<DocExampleClient title="Disabled" description="Disabled sliders prevent user interaction." code={examples[6].code} highlightedCode={html("disabled")}>
					<Slider disabled defaultValue={30} className="max-w-sm" />
				</DocExampleClient>
			</DocSection>

			<DocSection id="props" title="Props">
				<DocPropsTable props={sliderProps} />
			</DocSection>

			<DocSection id="guidelines" title="Guidelines">
				<ul className="list-inside list-disc space-y-2 text-sm text-fg-muted">
					<li>Use sliders when the precise value matters less than the relative position.</li>
					<li>For exact numeric input, consider using NumberInput instead.</li>
					<li>Use a range slider to let users select a bounded interval (e.g. price range, date range).</li>
					<li>Use onValueCommitted for expensive operations (e.g. API calls) and onValueChange for live previews.</li>
					<li>Always provide visible labels or context so users understand the scale.</li>
				</ul>
			</DocSection>

			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{
							title: "NumberInput",
							href: "/docs/components/ui/number-input",
							description: "For precise numeric entry with stepper buttons.",
						},
					]}
				/>
			</DocSection>
		</DocPage>
	)
}
