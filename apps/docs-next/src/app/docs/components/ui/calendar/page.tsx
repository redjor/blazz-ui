"use client"

import { use } from "react"
import { Calendar } from "@blazz/ui/components/ui/calendar"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { type DocProp, DocPropsTable } from "~/components/docs/doc-props-table"
import { DocRelated } from "~/components/docs/doc-related"
import { DocSection } from "~/components/docs/doc-section"
import { highlightExamples } from "~/lib/highlight-examples"
import { ControlledDemo, RangeSelectionDemo, SingleSelectionDemo } from "./demos"

const examples = [
	{
		key: "controlled",
		code: `const [date, setDate] = React.useState<Date | undefined>()

<Calendar
  mode="single"
  selected={date}
  onSelect={setDate}
  className="rounded-lg border border-edge"
/>`,
	},
	{
		key: "without-outside-days",
		code: `<Calendar
  mode="single"
  showOutsideDays={false}
  className="rounded-lg border border-edge"
/>`,
	},
	{
		key: "disabled-weekends",
		code: `<Calendar
  mode="single"
  disabled={{ dayOfWeek: [0, 6] }}
  className="rounded-lg border border-edge"
/>`,
	},
	{
		key: "range",
		code: `const [range, setRange] = React.useState<DateRange | undefined>({
  from: new Date(),
  to: addDays(new Date(), 6),
})

<Calendar
  mode="range"
  selected={range}
  onSelect={setRange}
  numberOfMonths={2}
  className="rounded-lg border border-edge"
/>`,
	},
] as const

const highlightedPromise = highlightExamples(examples as any)

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "range", title: "Range Selection" },
	{ id: "calendar-props", title: "Props" },
	{ id: "tokens", title: "Design Tokens" },
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
		type: "(date: ...) => void",
		description: "Callback when the selection changes. Type depends on mode.",
	},
	{
		name: "disabled",
		type: "Matcher | Matcher[]",
		description:
			"Days that cannot be selected. Accepts dates, date ranges, day-of-week arrays, or functions.",
	},
	{
		name: "numberOfMonths",
		type: "number",
		default: "1",
		description: "Number of months to display side by side.",
	},
	{
		name: "showOutsideDays",
		type: "boolean",
		default: "true",
		description: "Show days from adjacent months.",
	},
	{
		name: "captionLayout",
		type: '"label" | "dropdown"',
		default: '"label"',
		description: "Month/year caption style. Use dropdown for date-of-birth pickers.",
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
	const highlighted = use(highlightedPromise)
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="Calendar"
			subtitle="An inline date calendar built on react-day-picker. Use as a standalone component or as the foundation for DateSelector."
			toc={toc}
		>
			<DocHero>
				<SingleSelectionDemo />
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExampleClient
					title="Controlled Selection"
					description="Click a day to select it. The selection state is managed via value/onChange."
					code={examples[0].code}
					highlightedCode={html("controlled")}
				>
					<ControlledDemo />
				</DocExampleClient>

				<DocExampleClient
					title="Without Outside Days"
					description="Hide days from adjacent months for a cleaner look."
					code={examples[1].code}
					highlightedCode={html("without-outside-days")}
				>
					<Calendar
						mode="single"
						showOutsideDays={false}
						className="rounded-lg border border-edge"
					/>
				</DocExampleClient>

				<DocExampleClient
					title="Disabled Weekends"
					description="Prevent selection of specific days using the disabled prop."
					code={examples[2].code}
					highlightedCode={html("disabled-weekends")}
				>
					<Calendar
						mode="single"
						disabled={{ dayOfWeek: [0, 6] }}
						className="rounded-lg border border-edge"
					/>
				</DocExampleClient>
			</DocSection>

			<DocSection id="range" title="Range Selection">
				<DocExampleClient
					title="Date Range"
					description="Select a start and end date. Uses two months side by side for better visibility."
					code={examples[3].code}
					highlightedCode={html("range")}
				>
					<RangeSelectionDemo />
				</DocExampleClient>
			</DocSection>

			<DocSection id="calendar-props" title="Props">
				<p className="mb-4 text-sm text-fg-muted">
					Calendar accepts all <code className="text-xs">react-day-picker</code> DayPicker props.
					Key ones listed below.
				</p>
				<DocPropsTable props={calendarProps} />
			</DocSection>

			<DocSection id="tokens" title="Design Tokens">
				<p className="text-sm text-fg-muted">
					Calendar uses the design system tokens for consistent styling:
				</p>
				<ul className="list-inside list-disc space-y-2 text-sm text-fg-muted">
					<li>
						<code className="text-xs">text-fg</code> — Day text and caption label
					</li>
					<li>
						<code className="text-xs">text-fg-muted</code> — Weekday headers, nav chevrons, outside
						days
					</li>
					<li>
						<code className="text-xs">bg-surface-3</code> — Today highlight, day hover, range middle
					</li>
					<li>
						<code className="text-xs">bg-brand / text-brand-fg</code> — Selected day
					</li>
					<li>
						<code className="text-xs">bg-brand-hover</code> — Selected day hover
					</li>
					<li>
						<code className="text-xs">border-edge</code> — Nav button borders
					</li>
					<li>
						<code className="text-xs">ring-brand/40</code> — Focus ring on day buttons
					</li>
				</ul>
			</DocSection>

			<DocSection id="guidelines" title="Guidelines">
				<ul className="list-inside list-disc space-y-2 text-sm text-fg-muted">
					<li>Use Calendar inline when the date picker is the primary focus of the UI</li>
					<li>For form fields, prefer DateSelector which wraps Calendar in a Popover</li>
					<li>
						Use <code className="text-xs">disabled</code> to enforce constraints (no past dates,
						weekdays only, etc.)
					</li>
					<li>
						Use <code className="text-xs">numberOfMonths=&#123;2&#125;</code> for range selection to
						show context
					</li>
					<li>
						Use <code className="text-xs">captionLayout="dropdown"</code> for date-of-birth pickers
						where users need to jump years
					</li>
					<li>
						Always provide <code className="text-xs">selected</code> and{" "}
						<code className="text-xs">onSelect</code> for interactive use — without them, clicks
						have no visible effect
					</li>
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
