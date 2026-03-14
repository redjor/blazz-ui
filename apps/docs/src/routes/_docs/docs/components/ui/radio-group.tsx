import { Card } from "@blazz/ui/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@blazz/ui/components/ui/radio-group"
import { Separator } from "@blazz/ui/components/ui/separator"
import { cn } from "@blazz/ui/lib/utils"
import { createFileRoute } from "@tanstack/react-router"
import {
	ChartNoAxesColumnDecreasingIcon,
	CircleDollarSignIcon,
	CreditCardIcon,
	FileTextIcon,
	MailIcon,
	MessageCircleIcon,
	SmartphoneIcon,
} from "lucide-react"
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
	{ id: "composition", title: "Composition" },
	{ id: "radio-group-props", title: "RadioGroup Props" },
	{ id: "radio-group-option", title: "RadioGroupOption" },
	{ id: "guidelines", title: "Guidelines" },
	{ id: "related", title: "Related" },
]

const radioGroupProps: DocProp[] = [
	{
		name: "label",
		type: "string",
		description: "Group label rendered above the options.",
	},
	{
		name: "description",
		type: "string",
		description: "Description displayed below the group label.",
	},
	{
		name: "options",
		type: "RadioGroupOption[]",
		description: "Array of radio options to render.",
	},
	{
		name: "value",
		type: "string",
		description: "Controlled selected value.",
	},
	{
		name: "defaultValue",
		type: "string",
		description: "Default selected value for uncontrolled usage.",
	},
	{
		name: "onValueChange",
		type: "(value: string) => void",
		description: "Callback when the selection changes.",
	},
	{
		name: "disabled",
		type: "boolean",
		default: "false",
		description: "Disable all radio options in the group.",
	},
	{
		name: "aria-invalid",
		type: "boolean",
		description: "Show error state on all radio options.",
	},
	{
		name: "orientation",
		type: '"vertical" | "horizontal"',
		default: '"vertical"',
		description: "Layout direction of the radio options.",
	},
]

const radioGroupOptionProps: DocProp[] = [
	{
		name: "value",
		type: "string",
		description: "Unique value for this option.",
	},
	{
		name: "label",
		type: "string",
		description: "Display label for the radio option.",
	},
	{
		name: "description",
		type: "string",
		description: "Optional description below the label.",
	},
	{
		name: "disabled",
		type: "boolean",
		description: "Disable this specific option.",
	},
]

const examples = [
	{
		key: "basic",
		code: `<RadioGroup
  label="Notifications"
  options={[
    { value: "email", label: "Email" },
    { value: "sms", label: "SMS" },
    { value: "push", label: "Push" },
  ]}
  defaultValue="email"
/>`,
	},
	{
		key: "descriptions",
		code: `<RadioGroup
  label="Plan"
  description="Select a plan that works for you."
  options={[
    { value: "free", label: "Free", description: "Up to 5 projects" },
    { value: "pro", label: "Pro", description: "Unlimited projects" },
    { value: "enterprise", label: "Enterprise", description: "Custom solutions" },
  ]}
  defaultValue="free"
/>`,
	},
	{
		key: "horizontal",
		code: `<RadioGroup
  label="Size"
  orientation="horizontal"
  options={[
    { value: "sm", label: "Small" },
    { value: "md", label: "Medium" },
    { value: "lg", label: "Large" },
  ]}
  defaultValue="md"
/>`,
	},
	{
		key: "controlled",
		code: `const [value, setValue] = React.useState("email")

<RadioGroup
  label="Contact method"
  options={[
    { value: "email", label: "Email" },
    { value: "sms", label: "SMS" },
    { value: "push", label: "Push" },
  ]}
  value={value}
  onValueChange={setValue}
/>
<p>Selected: {value}</p>`,
	},
	{
		key: "disabled",
		code: `<RadioGroup
  label="Notifications"
  disabled
  options={[
    { value: "email", label: "Email" },
    { value: "sms", label: "SMS" },
    { value: "push", label: "Push" },
  ]}
  defaultValue="email"
/>`,
	},
	{
		key: "error",
		code: `<div className="space-y-2">
  <RadioGroup
    label="Priority"
    aria-invalid
    options={[
      { value: "low", label: "Low" },
      { value: "medium", label: "Medium" },
      { value: "high", label: "High" },
    ]}
  />
  <p className="text-sm text-negative">
    Please select a priority level.
  </p>
</div>`,
	},
	{
		key: "card-list",
		code: `const [value, setValue] = React.useState("email")

const options = [
  { value: "email", label: "Email", icon: MailIcon },
  { value: "phone", label: "Phone", icon: SmartphoneIcon },
  { value: "chat", label: "Chat", icon: MessageCircleIcon },
]

<Card className="w-full max-w-xs p-0 overflow-hidden">
  <RadioGroup value={value} onValueChange={setValue}>
    {options.map((option, i) => (
      <React.Fragment key={option.value}>
        {i > 0 && <Separator />}
        <div
          onClick={() => setValue(option.value)}
          className={cn(
            "flex cursor-pointer items-center justify-between px-4 py-3 transition-colors",
            value === option.value && "bg-brand/5"
          )}
        >
          <span className="flex items-center gap-2 text-sm font-medium">
            <option.icon className="size-4 opacity-60" />
            {option.label}
          </span>
          <RadioGroupItem value={option.value} />
        </div>
      </React.Fragment>
    ))}
  </RadioGroup>
</Card>`,
	},
	{
		key: "button-group",
		code: `const [value, setValue] = React.useState("monthly")

const options = [
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "yearly", label: "Yearly" },
]

<RadioGroup value={value} onValueChange={setValue} className="inline-flex rounded-lg border border-edge bg-surface p-1 gap-1">
  {options.map((option) => (
    <label
      key={option.value}
      className={cn(
        "cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium transition-colors select-none",
        value === option.value
          ? "bg-surface-3 text-fg shadow-sm"
          : "text-fg-muted hover:text-fg"
      )}
    >
      <RadioGroupItem value={option.value} className="sr-only" />
      {option.label}
    </label>
  ))}
</RadioGroup>`,
	},
	{
		key: "card-grid",
		code: `const [value, setValue] = React.useState("payments")

const items = [
  { title: "Payments", description: "Receive payments", value: "payments", icon: CircleDollarSignIcon },
  { title: "Invoices", description: "Create and send invoices", value: "invoices", icon: FileTextIcon },
  { title: "Billing", description: "Manage subscriptions", value: "billing", icon: CreditCardIcon },
  { title: "Reports", description: "View analytics", value: "reports", icon: ChartNoAxesColumnDecreasingIcon },
]

<RadioGroup value={value} onValueChange={setValue} className="grid w-full max-w-xs grid-cols-2 gap-3">
  {items.map((item) => (
    <div
      key={item.value}
      onClick={() => setValue(item.value)}
      className={cn(
        "relative cursor-pointer rounded-lg border border-edge p-3 transition-colors",
        value === item.value && "border-brand bg-brand/5"
      )}
    >
      <div className="absolute top-3 right-3">
        <RadioGroupItem value={item.value} />
      </div>
      <div className="flex flex-col items-start gap-3">
        <div className="rounded-xl flex items-center justify-center border border-edge p-2">
          <item.icon className="size-4" />
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-semibold">{item.title}</span>
          <span className="text-fg-muted text-xs">{item.description}</span>
        </div>
      </div>
    </div>
  ))}
</RadioGroup>`,
	},
] as const

export const Route = createFileRoute("/_docs/docs/components/ui/radio-group")({
	loader: async () => {
		const highlighted = await Promise.all(
			examples.map(async (ex) => ({
				key: ex.key,
				html: await highlightCode({ data: { code: ex.code } }),
			}))
		)
		return { highlighted }
	},
	component: RadioGroupPage,
})

const cardGridItems = [
	{
		title: "Payments",
		description: "Receive payments",
		value: "payments",
		icon: CircleDollarSignIcon,
	},
	{
		title: "Invoices",
		description: "Create and send invoices",
		value: "invoices",
		icon: FileTextIcon,
	},
	{ title: "Billing", description: "Manage subscriptions", value: "billing", icon: CreditCardIcon },
	{
		title: "Reports",
		description: "View analytics",
		value: "reports",
		icon: ChartNoAxesColumnDecreasingIcon,
	},
]

const cardListOptions = [
	{ value: "email", label: "Email", icon: MailIcon },
	{ value: "phone", label: "Phone", icon: SmartphoneIcon },
	{ value: "chat", label: "Chat", icon: MessageCircleIcon },
]

const buttonGroupOptions = [
	{ value: "monthly", label: "Monthly" },
	{ value: "quarterly", label: "Quarterly" },
	{ value: "yearly", label: "Yearly" },
]

function ButtonGroupRadioDemo() {
	const [value, setValue] = React.useState("monthly")

	return (
		<RadioGroup
			value={value}
			onValueChange={setValue}
			className="inline-flex rounded-lg border border-edge bg-surface p-1 gap-1"
		>
			{buttonGroupOptions.map((option) => (
				<label
					key={option.value}
					className={cn(
						"cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium transition-colors select-none",
						value === option.value ? "bg-surface-3 text-fg shadow-sm" : "text-fg-muted hover:text-fg"
					)}
				>
					<RadioGroupItem value={option.value} className="sr-only" />
					{option.label}
				</label>
			))}
		</RadioGroup>
	)
}

function CardGridRadioDemo() {
	const [value, setValue] = React.useState("payments")

	return (
		<RadioGroup
			value={value}
			onValueChange={setValue}
			className="grid w-full max-w-xs grid-cols-2 gap-3"
		>
			{cardGridItems.map((item) => (
				<div
					key={item.value}
					onClick={() => setValue(item.value)}
					className={cn(
						"relative cursor-pointer rounded-lg border border-edge p-3 transition-colors",
						value === item.value && "border-brand bg-brand/5"
					)}
				>
					<div className="absolute top-3 right-3">
						<RadioGroupItem value={item.value} />
					</div>
					<div className="flex flex-col items-start gap-3">
						<div className="rounded-xl flex items-center justify-center border border-edge p-2">
							<item.icon aria-hidden="true" className="size-4" />
						</div>
						<div className="flex flex-col gap-0.5">
							<span className="text-sm font-semibold">{item.title}</span>
							<span className="text-fg-muted text-xs">{item.description}</span>
						</div>
					</div>
				</div>
			))}
		</RadioGroup>
	)
}

function CardListRadioDemo() {
	const [value, setValue] = React.useState("email")

	return (
		<Card className="w-full max-w-xs p-0 overflow-hidden">
			<RadioGroup value={value} onValueChange={setValue}>
				{cardListOptions.map((option, i) => (
					<React.Fragment key={option.value}>
						{i > 0 && <Separator />}
						<div
							onClick={() => setValue(option.value)}
							className={cn(
								"flex cursor-pointer items-center justify-between px-4 py-3 transition-colors",
								value === option.value && "bg-brand/5"
							)}
						>
							<span className="flex items-center gap-2 text-sm font-medium">
								<option.icon aria-hidden="true" className="size-4 opacity-60" />
								{option.label}
							</span>
							<RadioGroupItem value={option.value} />
						</div>
					</React.Fragment>
				))}
			</RadioGroup>
		</Card>
	)
}

function ControlledRadioGroupDemo() {
	const [value, setValue] = React.useState("email")

	return (
		<div className="space-y-3">
			<RadioGroup
				label="Contact method"
				options={[
					{ value: "email", label: "Email" },
					{ value: "sms", label: "SMS" },
					{ value: "push", label: "Push" },
				]}
				value={value}
				onValueChange={setValue}
			/>
			<p className="text-xs text-fg-muted">Selected: {value}</p>
		</div>
	)
}

function RadioGroupPage() {
	const { highlighted } = Route.useLoaderData()
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="RadioGroup"
			subtitle="A set of mutually exclusive options where only one can be selected at a time."
			toc={toc}
		>
			{/* Hero */}
			<DocHero>
				<RadioGroup
					label="Notifications"
					options={[
						{ value: "email", label: "Email" },
						{ value: "sms", label: "SMS" },
						{ value: "push", label: "Push" },
					]}
					defaultValue="email"
				/>
			</DocHero>

			{/* Examples */}
			<DocSection id="examples" title="Examples">
				<DocExampleClient
					title="Basic"
					description="A simple radio group with a label."
					code={examples[0].code}
					highlightedCode={html("basic")}
				>
					<RadioGroup
						label="Notifications"
						options={[
							{ value: "email", label: "Email" },
							{ value: "sms", label: "SMS" },
							{ value: "push", label: "Push" },
						]}
						defaultValue="email"
					/>
				</DocExampleClient>

				<DocExampleClient
					title="With Descriptions"
					description="Each option can have a description for more context."
					code={examples[1].code}
					highlightedCode={html("descriptions")}
				>
					<RadioGroup
						label="Plan"
						description="Select a plan that works for you."
						options={[
							{ value: "free", label: "Free", description: "Up to 5 projects" },
							{ value: "pro", label: "Pro", description: "Unlimited projects" },
							{ value: "enterprise", label: "Enterprise", description: "Custom solutions" },
						]}
						defaultValue="free"
					/>
				</DocExampleClient>

				<DocExampleClient
					title="Horizontal"
					description="Lay out radio options horizontally for compact groups."
					code={examples[2].code}
					highlightedCode={html("horizontal")}
				>
					<RadioGroup
						label="Size"
						orientation="horizontal"
						options={[
							{ value: "sm", label: "Small" },
							{ value: "md", label: "Medium" },
							{ value: "lg", label: "Large" },
						]}
						defaultValue="md"
					/>
				</DocExampleClient>

				<DocExampleClient
					title="Controlled"
					description="Manage the selected value programmatically."
					code={examples[3].code}
					highlightedCode={html("controlled")}
				>
					<ControlledRadioGroupDemo />
				</DocExampleClient>

				<DocExampleClient
					title="Disabled"
					description="Disable the entire group."
					code={examples[4].code}
					highlightedCode={html("disabled")}
				>
					<RadioGroup
						label="Notifications"
						disabled
						options={[
							{ value: "email", label: "Email" },
							{ value: "sms", label: "SMS" },
							{ value: "push", label: "Push" },
						]}
						defaultValue="email"
					/>
				</DocExampleClient>

				<DocExampleClient
					title="Error State"
					description="Show validation errors on the entire group."
					code={examples[5].code}
					highlightedCode={html("error")}
				>
					<div className="space-y-2">
						<RadioGroup
							label="Priority"
							aria-invalid
							options={[
								{ value: "low", label: "Low" },
								{ value: "medium", label: "Medium" },
								{ value: "high", label: "High" },
							]}
						/>
						<p className="text-sm text-negative">Please select a priority level.</p>
					</div>
				</DocExampleClient>
			</DocSection>

			{/* Composition */}
			<DocSection id="composition" title="Composition">
				<DocExampleClient
					title="Card List"
					description="Clickable rows with active highlight. Uses composition mode without the options prop."
					code={examples[6].code}
					highlightedCode={html("card-list")}
				>
					<CardListRadioDemo />
				</DocExampleClient>

				<DocExampleClient
					title="Button Group"
					description="Radio options styled as a segmented button group. The radio dot is visually hidden."
					code={examples[7].code}
					highlightedCode={html("button-group")}
				>
					<ButtonGroupRadioDemo />
				</DocExampleClient>

				<DocExampleClient
					title="Card Grid"
					description="A 2-column grid of selectable cards with active border and background."
					code={examples[8].code}
					highlightedCode={html("card-grid")}
				>
					<CardGridRadioDemo />
				</DocExampleClient>
			</DocSection>

			{/* Props */}
			<DocSection id="radio-group-props" title="RadioGroup Props">
				<DocPropsTable props={radioGroupProps} />
			</DocSection>

			<DocSection id="radio-group-option" title="RadioGroupOption">
				<DocPropsTable props={radioGroupOptionProps} />
			</DocSection>

			{/* Guidelines */}
			<DocSection id="guidelines" title="Guidelines">
				<ul className="list-inside list-disc space-y-2 text-sm text-fg-muted">
					<li>Use radio groups for mutually exclusive selections from a small set of options</li>
					<li>Use checkboxes instead when multiple selections are allowed</li>
					<li>Use a Select for more than 5-7 options to save space</li>
					<li>Use horizontal orientation only for short labels (1-2 words)</li>
					<li>Always provide a default value when the selection is required</li>
				</ul>
			</DocSection>

			{/* Related */}
			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{
							title: "Checkbox",
							href: "/docs/components/ui/checkbox",
							description: "For multiple selections from a set of options.",
						},
						{
							title: "Select",
							href: "/docs/components/ui/select",
							description: "For single selection from a larger set of options.",
						},
					]}
				/>
			</DocSection>
		</DocPage>
	)
}
