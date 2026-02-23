import { Calendar } from "@/components/ui/calendar"
import { DocPage } from "@/components/features/docs/doc-page"
import { DocSection } from "@/components/features/docs/doc-section"
import { DocHero } from "@/components/features/docs/doc-hero"
import { DocExample } from "@/components/features/docs/doc-example"
import { DocPropsTable, type DocProp } from "@/components/features/docs/doc-props-table"
import { DocRelated } from "@/components/features/docs/doc-related"

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "calendar-props", title: "Props" },
	{ id: "guidelines", title: "Guidelines" },
	{ id: "related", title: "Related" },
]

const calendarProps: DocProp[] = [
	{
		name: "mode",
		type: '"single" | "range" | "multiple"',
		description: "The selection mode of the calendar.",
	},
	{
		name: "selected",
		type: "Date | DateRange | Date[]",
		description: "The currently selected date(s).",
	},
	{
		name: "onSelect",
		type: "(date: Date | DateRange | Date[] | undefined) => void",
		description: "Callback when the selection changes.",
	},
	{
		name: "disabled",
		type: "Matcher | Matcher[]",
		description: "Days that cannot be selected. Accepts dates, date ranges, or functions.",
	},
	{
		name: "showOutsideDays",
		type: "boolean",
		default: "true",
		description: "Show days from adjacent months.",
	},
	{
		name: "className",
		type: "string",
		description: "Additional CSS classes for the root element.",
	},
	{
		name: "classNames",
		type: "Partial<ClassNames>",
		description: "Override individual element class names.",
	},
]

export default function CalendarPage() {
	return (
		<DocPage
			title="Calendar"
			subtitle="An inline date calendar built on react-day-picker. Use as a standalone component or as the foundation for DateSelector."
			toc={toc}
		>
			<DocHero>
				<Calendar mode="single" className="rounded-lg border border-edge" />
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExample
					title="Default"
					description="A basic inline calendar."
					code={`<Calendar mode="single" className="rounded-lg border border-edge" />`}
				>
					<Calendar mode="single" className="rounded-lg border border-edge" />
				</DocExample>

				<DocExample
					title="Without Outside Days"
					description="Hide days from adjacent months for a cleaner look."
					code={`<Calendar mode="single" showOutsideDays={false} className="rounded-lg border border-edge" />`}
				>
					<Calendar mode="single" showOutsideDays={false} className="rounded-lg border border-edge" />
				</DocExample>

				<DocExample
					title="Disabled Days"
					description="Prevent selection of specific days, like weekends."
					code={`<Calendar
  mode="single"
  disabled={{ dayOfWeek: [0, 6] }}
  className="rounded-lg border border-edge"
/>`}
				>
					<Calendar
						mode="single"
						disabled={{ dayOfWeek: [0, 6] }}
						className="rounded-lg border border-edge"
					/>
				</DocExample>
			</DocSection>

			<DocSection id="calendar-props" title="Props">
				<p className="mb-4 text-sm text-fg-muted">
					Calendar accepts all <code className="text-xs">react-day-picker</code> DayPicker props. Key ones listed below.
				</p>
				<DocPropsTable props={calendarProps} />
			</DocSection>

			<DocSection id="guidelines" title="Guidelines">
				<ul className="list-inside list-disc space-y-2 text-sm text-fg-muted">
					<li>Use Calendar inline when the date picker is the primary focus of the UI</li>
					<li>For form fields, prefer DateSelector which wraps Calendar in a Popover</li>
					<li>Use the <code className="text-xs">disabled</code> prop to enforce date constraints (no past dates, weekdays only, etc.)</li>
				</ul>
			</DocSection>

			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{
							title: "DateSelector",
							href: "/docs/components/ui/date-selector",
							description: "Popover-based date picker for forms.",
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
