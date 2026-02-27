import * as React from "react"
import { createFileRoute } from "@tanstack/react-router"
import { RadioGroup } from "@blazz/ui/components/ui/radio-group"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"
import { DocHero } from "~/components/docs/doc-hero"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocPropsTable, type DocProp } from "~/components/docs/doc-props-table"
import { DocRelated } from "~/components/docs/doc-related"
import { highlightCode } from "~/lib/highlight-code"

const toc = [
	{ id: "examples", title: "Examples" },
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
] as const

export const Route = createFileRoute("/_docs/docs/components/ui/radio-group")({
	loader: async () => {
		const highlighted = await Promise.all(
			examples.map(async (ex) => ({
				key: ex.key,
				html: await highlightCode({ data: { code: ex.code } }),
			})),
		)
		return { highlighted }
	},
	component: RadioGroupPage,
})

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
			<p className="text-xs text-fg-muted">
				Selected: {value}
			</p>
		</div>
	)
}

function RadioGroupPage() {
	const { highlighted } = Route.useLoaderData()
	const html = (key: string) =>
		highlighted.find((h) => h.key === key)?.html ?? ""

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
						<p className="text-sm text-negative">
							Please select a priority level.
						</p>
					</div>
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
