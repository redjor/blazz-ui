import { RadioGroup } from "@blazz/ui/components/ui/radio-group"
import { DocPage } from "@/components/docs/doc-page"
import { DocSection } from "@/components/docs/doc-section"
import { DocHero } from "@/components/docs/doc-hero"
import { DocExample } from "@/components/docs/doc-example"
import { DocPropsTable, type DocProp } from "@/components/docs/doc-props-table"
import { DocRelated } from "@/components/docs/doc-related"
import { ControlledRadioGroupDemo } from "./_demos"

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

export default function RadioGroupPage() {
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
				<DocExample
					title="Basic"
					description="A simple radio group with a label."
					code={`<RadioGroup
  label="Notifications"
  options={[
    { value: "email", label: "Email" },
    { value: "sms", label: "SMS" },
    { value: "push", label: "Push" },
  ]}
  defaultValue="email"
/>`}
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
				</DocExample>

				<DocExample
					title="With Descriptions"
					description="Each option can have a description for more context."
					code={`<RadioGroup
  label="Plan"
  description="Select a plan that works for you."
  options={[
    { value: "free", label: "Free", description: "Up to 5 projects" },
    { value: "pro", label: "Pro", description: "Unlimited projects" },
    { value: "enterprise", label: "Enterprise", description: "Custom solutions" },
  ]}
  defaultValue="free"
/>`}
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
				</DocExample>

				<DocExample
					title="Horizontal"
					description="Lay out radio options horizontally for compact groups."
					code={`<RadioGroup
  label="Size"
  orientation="horizontal"
  options={[
    { value: "sm", label: "Small" },
    { value: "md", label: "Medium" },
    { value: "lg", label: "Large" },
  ]}
  defaultValue="md"
/>`}
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
				</DocExample>

				<DocExample
					title="Controlled"
					description="Manage the selected value programmatically."
					code={`const [value, setValue] = React.useState("email")

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
<p>Selected: {value}</p>`}
				>
					<ControlledRadioGroupDemo />
				</DocExample>

				<DocExample
					title="Disabled"
					description="Disable the entire group."
					code={`<RadioGroup
  label="Notifications"
  disabled
  options={[
    { value: "email", label: "Email" },
    { value: "sms", label: "SMS" },
    { value: "push", label: "Push" },
  ]}
  defaultValue="email"
/>`}
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
				</DocExample>

				<DocExample
					title="Error State"
					description="Show validation errors on the entire group."
					code={`<div className="space-y-2">
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
</div>`}
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
				</DocExample>
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
