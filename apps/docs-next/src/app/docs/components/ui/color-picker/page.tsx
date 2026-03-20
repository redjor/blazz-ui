import { ColorPicker } from "@blazz/ui/components/ui/color-picker"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { type DocProp, DocPropsTable } from "~/components/docs/doc-props-table"
import { DocRelated } from "~/components/docs/doc-related"
import { DocSection } from "~/components/docs/doc-section"
import { highlightExamples } from "~/lib/highlight-examples"
import { ControlledColorPickerDemo } from "./demos"

const examples = [
	{
		key: "default",
		code: `<ColorPicker />`,
	},
	{
		key: "with-value",
		code: `<ColorPicker value="#3b82f6" />`,
	},
	{
		key: "custom-presets",
		code: `<ColorPicker
  presets={[
    "#ef4444", "#f97316", "#eab308",
    "#22c55e", "#3b82f6", "#8b5cf6",
  ]}
/>`,
	},
	{
		key: "controlled",
		code: `const [color, setColor] = React.useState("#3b82f6")

<ColorPicker value={color} onValueChange={setColor} />
<p>Selected: {color || "none"}</p>`,
	},
	{
		key: "disabled",
		code: `<ColorPicker disabled />`,
	},
] as const

const highlightedPromise = highlightExamples(examples as any)

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


export default async function ColorPickerPage() {
	const highlighted = await highlightedPromise
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="ColorPicker"
			subtitle="A popover-based color picker with preset swatches and a custom color input. Supports hex values and native color input."
			toc={toc}
		>
			<DocHero>
				<ColorPicker />
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExampleClient
					title="Default"
					description="A basic color picker with default presets."
					code={examples[0].code}
					highlightedCode={html("default")}
				>
					<ColorPicker />
				</DocExampleClient>

				<DocExampleClient
					title="With Value"
					description="Pre-select a color value."
					code={examples[1].code}
					highlightedCode={html("with-value")}
				>
					<ColorPicker value="#3b82f6" />
				</DocExampleClient>

				<DocExampleClient
					title="Custom Presets"
					description="Provide a custom set of preset colors."
					code={examples[2].code}
					highlightedCode={html("custom-presets")}
				>
					<ColorPicker
						presets={["#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#8b5cf6"]}
					/>
				</DocExampleClient>

				<DocExampleClient
					title="Controlled"
					description="Manage the selected color with state."
					code={examples[3].code}
					highlightedCode={html("controlled")}
				>
					<ControlledColorPickerDemo />
				</DocExampleClient>

				<DocExampleClient
					title="Disabled"
					description="Disabled color pickers prevent interaction."
					code={examples[4].code}
					highlightedCode={html("disabled")}
				>
					<ColorPicker disabled />
				</DocExampleClient>
			</DocSection>

			<DocSection id="props" title="Props">
				<DocPropsTable props={colorPickerProps} />
			</DocSection>

			<DocSection id="guidelines" title="Guidelines">
				<ul className="list-inside list-disc space-y-2 text-sm text-fg-muted">
					<li>Provide relevant preset colors for common use cases in your app</li>
					<li>Use the custom color input for precise hex values</li>
					<li>Pair with a Label to describe what the color is used for</li>
					<li>Consider accessibility when users rely on the selected color for meaning</li>
				</ul>
			</DocSection>

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
