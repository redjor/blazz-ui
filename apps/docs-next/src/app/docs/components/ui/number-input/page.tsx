"use client"
import { use } from "react"

import { NumberInput } from "@blazz/ui/components/ui/number-input"
import * as React from "react"
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

const numberInputProps: DocProp[] = [
	{
		name: "value",
		type: "number | null",
		description: "Controlled value of the input.",
	},
	{
		name: "defaultValue",
		type: "number",
		description: "Default value for uncontrolled usage.",
	},
	{
		name: "onValueChange",
		type: "(value: number | null) => void",
		description: "Callback when the value changes.",
	},
	{
		name: "min",
		type: "number",
		description: "Minimum allowed value.",
	},
	{
		name: "max",
		type: "number",
		description: "Maximum allowed value.",
	},
	{
		name: "step",
		type: "number",
		default: "1",
		description: "Step increment for the stepper buttons.",
	},
	{
		name: "disabled",
		type: "boolean",
		default: "false",
		description: "Whether the input is disabled.",
	},
	{
		name: "placeholder",
		type: "string",
		description: "Placeholder text shown when input is empty.",
	},
	{
		name: "aria-invalid",
		type: "boolean",
		description: "Indicates the input has an error.",
	},
]

const examples = [
	{
		key: "default",
		code: `<NumberInput defaultValue={5} />`,
	},
	{
		key: "min-max",
		code: `<NumberInput defaultValue={5} min={0} max={10} />`,
	},
	{
		key: "step",
		code: `<NumberInput defaultValue={0} step={5} min={0} max={100} />`,
	},
	{
		key: "controlled",
		code: `const [value, setValue] = React.useState<number | null>(10)

<NumberInput
  value={value}
  onValueChange={setValue}
  min={0}
  max={100}
/>
<p>Value: {value ?? "empty"}</p>`,
	},
	{
		key: "disabled",
		code: `<NumberInput disabled defaultValue={5} />`,
	},
] as const

const highlightedPromise = highlightExamples(examples as any)

function ControlledNumberInputDemo() {
	const [value, setValue] = React.useState<number | null>(10)

	return (
		<div className="flex flex-col items-start gap-3">
			<NumberInput
				value={value}
				onValueChange={setValue}
				min={0}
				max={100}
				className="max-w-[180px]"
			/>
			<p className="text-sm text-fg-muted">Value: {value ?? "empty"}</p>
		</div>
	)
}

export default function NumberInputPage() {
	const highlighted = use(highlightedPromise)
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="NumberInput"
			subtitle="A numeric input with increment and decrement stepper buttons for precise value adjustments."
			toc={toc}
		>
			{/* Hero */}
			<DocHero>
				<NumberInput defaultValue={5} min={0} max={100} className="max-w-[180px]" />
			</DocHero>

			{/* Examples */}
			<DocSection id="examples" title="Examples">
				<DocExampleClient
					title="Default"
					description="A basic number input with stepper buttons."
					code={examples[0].code}
					highlightedCode={html("default")}
				>
					<NumberInput defaultValue={5} className="max-w-[180px]" />
				</DocExampleClient>

				<DocExampleClient
					title="With Min/Max"
					description="Constrain the value to a specific range."
					code={examples[1].code}
					highlightedCode={html("min-max")}
				>
					<NumberInput defaultValue={5} min={0} max={10} className="max-w-[180px]" />
				</DocExampleClient>

				<DocExampleClient
					title="With Step"
					description="Customize the increment and decrement step size."
					code={examples[2].code}
					highlightedCode={html("step")}
				>
					<NumberInput defaultValue={0} step={5} min={0} max={100} className="max-w-[180px]" />
				</DocExampleClient>

				<DocExampleClient
					title="Controlled"
					description="Control the value programmatically."
					code={examples[3].code}
					highlightedCode={html("controlled")}
				>
					<ControlledNumberInputDemo />
				</DocExampleClient>

				<DocExampleClient
					title="Disabled"
					description="Disabled number inputs prevent user interaction."
					code={examples[4].code}
					highlightedCode={html("disabled")}
				>
					<NumberInput disabled defaultValue={5} className="max-w-[180px]" />
				</DocExampleClient>
			</DocSection>

			{/* Props */}
			<DocSection id="props" title="Props">
				<DocPropsTable props={numberInputProps} />
			</DocSection>

			{/* Guidelines */}
			<DocSection id="guidelines" title="Guidelines">
				<ul className="list-inside list-disc space-y-2 text-sm text-fg-muted">
					<li>Use for numeric values where precise adjustment is needed</li>
					<li>Always set min and max when the value has natural bounds</li>
					<li>
						Choose a step size that makes sense for the data (e.g., 0.1 for prices, 5 for
						percentages)
					</li>
					<li>
						Use a Slider instead when the exact value is less important than the relative position
					</li>
				</ul>
			</DocSection>

			{/* Related */}
			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{
							title: "Input",
							href: "/docs/components/ui/input",
							description: "Base text input for general data collection.",
						},
						{
							title: "Slider",
							href: "/docs/components/ui/slider",
							description: "For selecting a value within a range using a draggable handle.",
						},
					]}
				/>
			</DocSection>
		</DocPage>
	)
}
