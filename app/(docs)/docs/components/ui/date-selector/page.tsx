import { DateSelector, DateRangeSelector } from "@/components/ui/date-selector"
import { DocPage } from "@/components/features/docs/doc-page"
import { DocSection } from "@/components/features/docs/doc-section"
import { DocHero } from "@/components/features/docs/doc-hero"
import { DocExample } from "@/components/features/docs/doc-example"
import { DocPropsTable, type DocProp } from "@/components/features/docs/doc-props-table"
import { DocRelated } from "@/components/features/docs/doc-related"
import {
	DateSelectorDemo,
	DateSelectorCustomFormatDemo,
	DateRangeSelectorDemo,
	DateRangeSelectorCustomDemo,
} from "./_demos"

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "date-range", title: "Date Range" },
	{ id: "date-selector-props", title: "DateSelector Props" },
	{ id: "date-range-selector-props", title: "DateRangeSelector Props" },
	{ id: "guidelines", title: "Guidelines" },
	{ id: "related", title: "Related" },
]

const dateSelectorProps: DocProp[] = [
	{
		name: "value",
		type: "Date | undefined",
		description: "The selected date.",
	},
	{
		name: "onValueChange",
		type: "(date: Date | undefined) => void",
		description: "Callback when the selected date changes.",
	},
	{
		name: "placeholder",
		type: "string",
		default: '"Pick a date"',
		description: "Placeholder text when no date is selected.",
	},
	{
		name: "formatStr",
		type: "string",
		default: '"PPP"',
		description: "date-fns format string for displaying the selected date.",
	},
	{
		name: "disabled",
		type: "boolean",
		default: "false",
		description: "Disable the date selector.",
	},
]

const dateRangeSelectorProps: DocProp[] = [
	{
		name: "from",
		type: "Date | undefined",
		description: "The start date.",
	},
	{
		name: "to",
		type: "Date | undefined",
		description: "The end date.",
	},
	{
		name: "onFromChange",
		type: "(date: Date | undefined) => void",
		description: "Callback when the start date changes.",
	},
	{
		name: "onToChange",
		type: "(date: Date | undefined) => void",
		description: "Callback when the end date changes.",
	},
	{
		name: "fromPlaceholder",
		type: "string",
		default: '"Start date"',
		description: "Placeholder for the start date trigger.",
	},
	{
		name: "toPlaceholder",
		type: "string",
		default: '"End date"',
		description: "Placeholder for the end date trigger.",
	},
	{
		name: "formatStr",
		type: "string",
		default: '"PP"',
		description: "date-fns format string for displaying dates.",
	},
	{
		name: "disabled",
		type: "boolean",
		default: "false",
		description: "Disable both date selectors.",
	},
]

export default function DateSelectorPage() {
	return (
		<DocPage
			title="DateSelector"
			subtitle="A popover-based date picker for forms. Supports single date and grouped start/end date selection."
			toc={toc}
		>
			<DocHero>
				<DateSelectorDemo />
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExample
					title="Basic"
					description="A single date selector with popover calendar."
					code={`const [date, setDate] = React.useState<Date | undefined>()

<DateSelector value={date} onValueChange={setDate} />`}
				>
					<DateSelectorDemo />
				</DocExample>

				<DocExample
					title="Custom Format"
					description="Use a custom date-fns format string."
					code={`<DateSelector
  value={date}
  onValueChange={setDate}
  formatStr="dd/MM/yyyy"
/>`}
				>
					<DateSelectorCustomFormatDemo />
				</DocExample>

				<DocExample
					title="Custom Placeholder"
					description="Set a placeholder for the empty state."
					code={`<DateSelector placeholder="Date de naissance" />`}
				>
					<DateSelector placeholder="Date de naissance" />
				</DocExample>

				<DocExample
					title="Disabled"
					description="Prevent interaction when disabled."
					code={`<DateSelector disabled placeholder="Disabled" />`}
				>
					<DateSelector disabled placeholder="Disabled" />
				</DocExample>
			</DocSection>

			<DocSection id="date-range" title="Date Range">
				<DocExample
					title="Start & End Date"
					description="Two grouped date selectors for selecting a date range. The start calendar blocks dates after the end date, and vice versa."
					code={`const [from, setFrom] = React.useState<Date | undefined>()
const [to, setTo] = React.useState<Date | undefined>()

<DateRangeSelector
  from={from}
  to={to}
  onFromChange={setFrom}
  onToChange={setTo}
/>`}
				>
					<DateRangeSelectorDemo />
				</DocExample>

				<DocExample
					title="Custom Placeholders"
					description="Customize placeholders and date format for each trigger."
					code={`<DateRangeSelector
  from={from}
  to={to}
  onFromChange={setFrom}
  onToChange={setTo}
  fromPlaceholder="Date de début"
  toPlaceholder="Date de fin"
  formatStr="dd MMM yyyy"
/>`}
				>
					<DateRangeSelectorCustomDemo />
				</DocExample>

				<DocExample
					title="Disabled"
					description="Disable the entire range selector."
					code={`<DateRangeSelector disabled />`}
				>
					<DateRangeSelector disabled />
				</DocExample>
			</DocSection>

			<DocSection id="date-selector-props" title="DateSelector Props">
				<DocPropsTable props={dateSelectorProps} />
			</DocSection>

			<DocSection id="date-range-selector-props" title="DateRangeSelector Props">
				<DocPropsTable props={dateRangeSelectorProps} />
			</DocSection>

			<DocSection id="guidelines" title="Guidelines">
				<ul className="list-inside list-disc space-y-2 text-sm text-fg-muted">
					<li>Use DateSelector for single date fields in forms (due date, birth date, etc.)</li>
					<li>Use DateRangeSelector for start/end date pairs (contract period, filter range, etc.)</li>
					<li>The "from" calendar automatically blocks dates after "to", preventing invalid ranges</li>
					<li>For inline calendar display (outside forms), use the Calendar component directly</li>
					<li>The trigger matches the Select trigger style for visual consistency in forms</li>
				</ul>
			</DocSection>

			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{
							title: "Calendar",
							href: "/docs/components/ui/calendar",
							description: "Inline calendar for standalone usage.",
						},
						{
							title: "Select",
							href: "/docs/components/ui/select",
							description: "Dropdown selection with similar trigger style.",
						},
						{
							title: "Input",
							href: "/docs/components/ui/input",
							description: "Text input for manual date entry.",
						},
					]}
				/>
			</DocSection>
		</DocPage>
	)
}
