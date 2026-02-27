import * as React from "react"
import { createFileRoute } from "@tanstack/react-router"
import { Slider } from "@blazz/ui/components/ui/slider"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"
import { DocHero } from "~/components/docs/doc-hero"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocPropsTable, type DocProp } from "~/components/docs/doc-props-table"
import { DocRelated } from "~/components/docs/doc-related"
import { highlightCode } from "~/lib/highlight-code"

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
		default: "0",
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
		name: "disabled",
		type: "boolean",
		default: "false",
		description: "Whether the slider is disabled.",
	},
	{
		name: "showValue",
		type: "boolean",
		default: "false",
		description: "Show a label for each thumb with the current value.",
	},
]

const examples = [
	{
		key: "default",
		code: `<Slider defaultValue={50} />`,
	},
	{
		key: "min-max-step",
		code: `<Slider defaultValue={20} min={0} max={50} step={5} />`,
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

export const Route = createFileRoute("/_docs/docs/components/ui/slider")({
	loader: async () => {
		const highlighted = await Promise.all(
			examples.map(async (ex) => ({
				key: ex.key,
				html: await highlightCode({ data: { code: ex.code } }),
			})),
		)
		return { highlighted }
	},
	component: SliderPage,
})

function ControlledSliderDemo() {
	const [value, setValue] = React.useState(50)

	return (
		<div className="max-w-sm space-y-3">
			<Slider
				value={value}
				onValueChange={(v) => setValue(v as number)}
			/>
			<p className="text-xs text-fg-muted">
				Value: {value}
			</p>
		</div>
	)
}

function SliderPage() {
	const { highlighted } = Route.useLoaderData()
	const html = (key: string) =>
		highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="Slider"
			subtitle="A draggable control for selecting a numeric value within a range."
			toc={toc}
		>
			<DocHero>
				<Slider defaultValue={50} className="max-w-sm" />
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExampleClient
					title="Default"
					description="A basic slider with default range 0-100."
					code={examples[0].code}
					highlightedCode={html("default")}
				>
					<Slider defaultValue={50} className="max-w-sm" />
				</DocExampleClient>

				<DocExampleClient
					title="With Min/Max/Step"
					description="Customize the range and step increment."
					code={examples[1].code}
					highlightedCode={html("min-max-step")}
				>
					<Slider defaultValue={20} min={0} max={50} step={5} className="max-w-sm" />
				</DocExampleClient>

				<DocExampleClient
					title="Controlled"
					description="Control the slider value programmatically and display it."
					code={examples[2].code}
					highlightedCode={html("controlled")}
				>
					<ControlledSliderDemo />
				</DocExampleClient>

				<DocExampleClient
					title="Disabled"
					description="Disabled sliders prevent user interaction."
					code={examples[3].code}
					highlightedCode={html("disabled")}
				>
					<Slider disabled defaultValue={30} className="max-w-sm" />
				</DocExampleClient>
			</DocSection>

			<DocSection id="props" title="Props">
				<DocPropsTable props={sliderProps} />
			</DocSection>

			<DocSection id="guidelines" title="Guidelines">
				<ul className="list-inside list-disc space-y-2 text-sm text-fg-muted">
					<li>Use sliders when the precise value matters less than the relative position</li>
					<li>For exact numeric input, consider using NumberInput instead</li>
					<li>Use onValueCommitted for expensive operations (e.g., API calls) and onValueChange for live previews</li>
					<li>Always provide visible labels or context so users understand the scale</li>
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
