import { TimePicker } from "@blazz/ui/components/ui/time-picker"
import { DocPage } from "@/components/features/docs/doc-page"
import { DocSection } from "@/components/features/docs/doc-section"
import { DocHero } from "@/components/features/docs/doc-hero"
import { DocExample } from "@/components/features/docs/doc-example"
import { DocPropsTable, type DocProp } from "@/components/features/docs/doc-props-table"
import { DocRelated } from "@/components/features/docs/doc-related"
import { ControlledTimePickerDemo } from "./_demos"

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

export default function TimePickerPage() {
	return (
		<DocPage
			title="TimePicker"
			subtitle="A time input with a clock icon for selecting hours and minutes."
			toc={toc}
		>
			{/* Hero */}
			<DocHero>
				<TimePicker className="max-w-[180px]" />
			</DocHero>

			{/* Examples */}
			<DocSection id="examples" title="Examples">
				<DocExample
					title="Default"
					description="A basic time picker."
					code={`<TimePicker />`}
				>
					<TimePicker className="max-w-[180px]" />
				</DocExample>

				<DocExample
					title="With Default Value"
					description="Pre-fill the time picker with a value."
					code={`<TimePicker value="14:30" />`}
				>
					<TimePicker value="14:30" className="max-w-[180px]" />
				</DocExample>

				<DocExample
					title="Controlled"
					description="Control the time value programmatically."
					code={`const [time, setTime] = React.useState("09:00")

<TimePicker
  value={time}
  onValueChange={setTime}
/>
<p>Selected: {time}</p>`}
				>
					<ControlledTimePickerDemo />
				</DocExample>

				<DocExample
					title="Disabled"
					description="Disabled time pickers prevent user interaction."
					code={`<TimePicker disabled value="12:00" />`}
				>
					<TimePicker disabled value="12:00" className="max-w-[180px]" />
				</DocExample>
			</DocSection>

			{/* Props */}
			<DocSection id="props" title="Props">
				<DocPropsTable props={timePickerProps} />
			</DocSection>

			{/* Guidelines */}
			<DocSection id="guidelines" title="Guidelines">
				<ul className="list-inside list-disc space-y-2 text-sm text-fg-muted">
					<li>Use 24-hour format for international applications and 12-hour for US-centric ones</li>
					<li>Set appropriate step values (e.g., 15 for quarter-hour increments)</li>
					<li>Pair with a DateSelector when both date and time are needed</li>
					<li>Provide clear labels indicating the expected time zone if applicable</li>
				</ul>
			</DocSection>

			{/* Related */}
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
