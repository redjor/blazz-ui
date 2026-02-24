import { ColorPicker } from "@/components/ui/color-picker"
import { DocPage } from "@/components/features/docs/doc-page"
import { DocSection } from "@/components/features/docs/doc-section"
import { DocHero } from "@/components/features/docs/doc-hero"
import { DocExample } from "@/components/features/docs/doc-example"
import { DocPropsTable, type DocProp } from "@/components/features/docs/doc-props-table"
import { DocRelated } from "@/components/features/docs/doc-related"
import { ControlledColorPickerDemo } from "./_demos"

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "props", title: "Props" },
	{ id: "guidelines", title: "Guidelines" },
	{ id: "related", title: "Related" },
]

const colorPickerProps: DocProp[] = [
	{
		name: "value",
		type: "string",
		description: "The current color value as a hex string.",
	},
	{
		name: "onValueChange",
		type: "(value: string) => void",
		description: "Callback fired when the selected color changes.",
	},
	{
		name: "presets",
		type: "string[]",
		description: "Array of preset hex color strings to display as swatches.",
	},
	{
		name: "disabled",
		type: "boolean",
		default: "false",
		description: "Whether the color picker is disabled.",
	},
	{
		name: "placeholder",
		type: "string",
		default: '"Pick a color"',
		description: "Placeholder text shown when no color is selected.",
	},
]

export default function ColorPickerPage() {
	return (
		<DocPage
			title="ColorPicker"
			subtitle="A popover-based color picker with preset swatches and a custom color input. Supports hex values and native color input."
			toc={toc}
		>
			{/* Hero */}
			<DocHero>
				<ColorPicker />
			</DocHero>

			{/* Examples */}
			<DocSection id="examples" title="Examples">
				<DocExample
					title="Default"
					description="A basic color picker with default presets."
					code={`<ColorPicker />`}
				>
					<ColorPicker />
				</DocExample>

				<DocExample
					title="With Value"
					description="Pre-select a color value."
					code={`<ColorPicker value="#3b82f6" />`}
				>
					<ColorPicker value="#3b82f6" />
				</DocExample>

				<DocExample
					title="Custom Presets"
					description="Provide a custom set of preset colors."
					code={`<ColorPicker
  presets={[
    "#ef4444", "#f97316", "#eab308",
    "#22c55e", "#3b82f6", "#8b5cf6",
  ]}
/>`}
				>
					<ColorPicker
						presets={[
							"#ef4444", "#f97316", "#eab308",
							"#22c55e", "#3b82f6", "#8b5cf6",
						]}
					/>
				</DocExample>

				<DocExample
					title="Controlled"
					description="Manage the selected color with state."
					code={`const [color, setColor] = React.useState("#3b82f6")

<ColorPicker value={color} onValueChange={setColor} />
<p>Selected: {color || "none"}</p>`}
				>
					<ControlledColorPickerDemo />
				</DocExample>

				<DocExample
					title="Disabled"
					description="Disabled color pickers prevent interaction."
					code={`<ColorPicker disabled />`}
				>
					<ColorPicker disabled />
				</DocExample>
			</DocSection>

			{/* Props */}
			<DocSection id="props" title="Props">
				<DocPropsTable props={colorPickerProps} />
			</DocSection>

			{/* Guidelines */}
			<DocSection id="guidelines" title="Guidelines">
				<ul className="list-inside list-disc space-y-2 text-sm text-fg-muted">
					<li>Provide relevant preset colors for common use cases in your app</li>
					<li>Use the custom color input for precise hex values</li>
					<li>Pair with a Label to describe what the color is used for</li>
					<li>Consider accessibility when users rely on the selected color for meaning</li>
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
