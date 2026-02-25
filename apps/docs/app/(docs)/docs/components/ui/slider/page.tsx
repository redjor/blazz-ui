import { Slider } from "@blazz/ui/components/ui/slider"
import { DocPage } from "@/components/features/docs/doc-page"
import { DocSection } from "@/components/features/docs/doc-section"
import { DocHero } from "@/components/features/docs/doc-hero"
import { DocExample } from "@/components/features/docs/doc-example"
import { DocPropsTable, type DocProp } from "@/components/features/docs/doc-props-table"
import { DocRelated } from "@/components/features/docs/doc-related"
import { ControlledSliderDemo } from "./_demos"

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

export default function SliderPage() {
	return (
		<DocPage
			title="Slider"
			subtitle="A draggable control for selecting a numeric value within a range."
			toc={toc}
		>
			{/* Hero */}
			<DocHero>
				<Slider defaultValue={50} className="max-w-sm" />
			</DocHero>

			{/* Examples */}
			<DocSection id="examples" title="Examples">
				<DocExample
					title="Default"
					description="A basic slider with default range 0-100."
					code={`<Slider defaultValue={50} />`}
				>
					<Slider defaultValue={50} className="max-w-sm" />
				</DocExample>

				<DocExample
					title="With Min/Max/Step"
					description="Customize the range and step increment."
					code={`<Slider defaultValue={20} min={0} max={50} step={5} />`}
				>
					<Slider defaultValue={20} min={0} max={50} step={5} className="max-w-sm" />
				</DocExample>

				<DocExample
					title="Controlled"
					description="Control the slider value programmatically and display it."
					code={`const [value, setValue] = React.useState(50)

<Slider
  value={value}
  onValueChange={(v) => setValue(v as number)}
/>
<p>Value: {value}</p>`}
				>
					<ControlledSliderDemo />
				</DocExample>

				<DocExample
					title="Disabled"
					description="Disabled sliders prevent user interaction."
					code={`<Slider disabled defaultValue={30} />`}
				>
					<Slider disabled defaultValue={30} className="max-w-sm" />
				</DocExample>
			</DocSection>

			{/* Props */}
			<DocSection id="props" title="Props">
				<DocPropsTable props={sliderProps} />
			</DocSection>

			{/* Guidelines */}
			<DocSection id="guidelines" title="Guidelines">
				<ul className="list-inside list-disc space-y-2 text-sm text-fg-muted">
					<li>Use sliders when the precise value matters less than the relative position</li>
					<li>For exact numeric input, consider using NumberInput instead</li>
					<li>Use onValueCommitted for expensive operations (e.g., API calls) and onValueChange for live previews</li>
					<li>Always provide visible labels or context so users understand the scale</li>
				</ul>
			</DocSection>

			{/* Related */}
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
