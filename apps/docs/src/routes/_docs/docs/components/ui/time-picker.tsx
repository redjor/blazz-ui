import { TimePicker } from "@blazz/ui/components/ui/time-picker"
import { createFileRoute } from "@tanstack/react-router"
import * as React from "react"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { type DocProp, DocPropsTable } from "~/components/docs/doc-props-table"
import { DocRelated } from "~/components/docs/doc-related"
import { DocSection } from "~/components/docs/doc-section"
import { highlightCode } from "~/lib/highlight-code"

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "props", title: "Props" },
	{ id: "guidelines", title: "Guidelines" },
	{ id: "related", title: "Related" },
]

const timePickerProps: DocProp[] = [
	{
		name: "value",
		type: "string",
		description: "Controlled value in HH:MM format.",
	},
	{
		name: "onValueChange",
		type: "(value: string) => void",
		description: "Callback when the time value changes.",
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
		default: '"HH:MM"',
		description: "Placeholder text shown when no value is set.",
	},
	{
		name: "use24h",
		type: "boolean",
		default: "true",
		description: "Use 24-hour time format.",
	},
	{
		name: "step",
		type: "number",
		default: "1",
		description: "Minute step interval.",
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
		code: `<TimePicker />`,
	},
	{
		key: "with-default-value",
		code: `<TimePicker value="14:30" />`,
	},
	{
		key: "controlled",
		code: `const [time, setTime] = React.useState("09:00")

<TimePicker
  value={time}
  onValueChange={setTime}
/>
<p>Selected: {time}</p>`,
	},
	{
		key: "disabled",
		code: `<TimePicker disabled value="12:00" />`,
	},
] as const

export const Route = createFileRoute("/_docs/docs/components/ui/time-picker")({
	loader: async () => {
		const highlighted = await Promise.all(
			examples.map(async (ex) => ({
				key: ex.key,
				html: await highlightCode({ data: { code: ex.code } }),
			}))
		)
		return { highlighted }
	},
	component: TimePickerPage,
})

function ControlledTimePickerDemo() {
	const [time, setTime] = React.useState("09:00")

	return (
		<div className="space-y-3">
			<TimePicker value={time} onValueChange={setTime} className="max-w-[180px]" />
			<p className="text-xs text-fg-muted">Selected: {time || "none"}</p>
		</div>
	)
}

function TimePickerPage() {
	const { highlighted } = Route.useLoaderData()
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="TimePicker"
			subtitle="A time input with a clock icon for selecting hours and minutes."
			toc={toc}
		>
			<DocHero>
				<TimePicker className="max-w-[180px]" />
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExampleClient
					title="Default"
					description="A basic time picker."
					code={examples[0].code}
					highlightedCode={html("default")}
				>
					<TimePicker className="max-w-[180px]" />
				</DocExampleClient>

				<DocExampleClient
					title="With Default Value"
					description="Pre-fill the time picker with a value."
					code={examples[1].code}
					highlightedCode={html("with-default-value")}
				>
					<TimePicker value="14:30" className="max-w-[180px]" />
				</DocExampleClient>

				<DocExampleClient
					title="Controlled"
					description="Control the time value programmatically."
					code={examples[2].code}
					highlightedCode={html("controlled")}
				>
					<ControlledTimePickerDemo />
				</DocExampleClient>

				<DocExampleClient
					title="Disabled"
					description="Disabled time pickers prevent user interaction."
					code={examples[3].code}
					highlightedCode={html("disabled")}
				>
					<TimePicker disabled value="12:00" className="max-w-[180px]" />
				</DocExampleClient>
			</DocSection>

			<DocSection id="props" title="Props">
				<DocPropsTable props={timePickerProps} />
			</DocSection>

			<DocSection id="guidelines" title="Guidelines">
				<ul className="list-inside list-disc space-y-2 text-sm text-fg-muted">
					<li>Use 24-hour format for international applications and 12-hour for US-centric ones</li>
					<li>Set appropriate step values (e.g., 15 for quarter-hour increments)</li>
					<li>Pair with a DateSelector when both date and time are needed</li>
					<li>Provide clear labels indicating the expected time zone if applicable</li>
				</ul>
			</DocSection>

			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{
							title: "DateSelector",
							href: "/docs/components/ui/date-selector",
							description: "For selecting dates, often paired with a time picker.",
						},
					]}
				/>
			</DocSection>
		</DocPage>
	)
}
