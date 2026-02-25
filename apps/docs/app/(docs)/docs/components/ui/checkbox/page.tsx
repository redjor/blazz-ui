import { Checkbox, CheckboxGroup } from "@blazz/ui/components/ui/checkbox"
import { Label } from "@blazz/ui/components/ui/label"
import { DocPage } from "@/components/features/docs/doc-page"
import { DocSection } from "@/components/features/docs/doc-section"
import { DocHero } from "@/components/features/docs/doc-hero"
import { DocExample } from "@/components/features/docs/doc-example"
import { DocPropsTable, type DocProp } from "@/components/features/docs/doc-props-table"
import { DocRelated } from "@/components/features/docs/doc-related"
import { ControlledCheckboxDemo, ControlledCheckboxGroupDemo } from "./_demos"

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "checkbox-group", title: "CheckboxGroup" },
	{ id: "checkbox-props", title: "Checkbox Props" },
	{ id: "checkbox-group-props", title: "CheckboxGroup Props" },
	{ id: "checkbox-group-option", title: "CheckboxGroupOption" },
	{ id: "guidelines", title: "Guidelines" },
	{ id: "related", title: "Related" },
]

const checkboxProps: DocProp[] = [
	{
		name: "checked",
		type: "boolean",
		description: "Whether the checkbox is checked.",
	},
	{
		name: "defaultChecked",
		type: "boolean",
		description: "The default checked state for uncontrolled usage.",
	},
	{
		name: "onCheckedChange",
		type: "(checked: boolean) => void",
		description: "Callback when the checked state changes.",
	},
	{
		name: "disabled",
		type: "boolean",
		default: "false",
		description: "Whether the checkbox is disabled.",
	},
	{
		name: "aria-invalid",
		type: "boolean",
		description: "Indicates the checkbox has an error.",
	},
]

const checkboxGroupProps: DocProp[] = [
	{
		name: "label",
		type: "string",
		description: "Group label rendered as a fieldset legend.",
	},
	{
		name: "description",
		type: "string",
		description: "Description displayed below the group label.",
	},
	{
		name: "options",
		type: "CheckboxGroupOption[]",
		description: "Array of checkbox options to render.",
	},
	{
		name: "value",
		type: "string[]",
		description: "Controlled selected values.",
	},
	{
		name: "defaultValue",
		type: "string[]",
		description: "Default selected values for uncontrolled usage.",
	},
	{
		name: "onValueChange",
		type: "(value: string[]) => void",
		description: "Callback when the selection changes.",
	},
	{
		name: "disabled",
		type: "boolean",
		default: "false",
		description: "Disable all checkboxes in the group.",
	},
	{
		name: "aria-invalid",
		type: "boolean",
		description: "Show error state on all checkboxes.",
	},
	{
		name: "orientation",
		type: '"vertical" | "horizontal"',
		default: '"vertical"',
		description: "Layout direction of the checkboxes.",
	},
]

const checkboxGroupOptionProps: DocProp[] = [
	{
		name: "value",
		type: "string",
		description: "Unique value for this option.",
	},
	{
		name: "label",
		type: "string",
		description: "Display label for the checkbox.",
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

export default function CheckboxPage() {
	return (
		<DocPage
			title="Checkbox"
			subtitle="A control that allows users to select one or more items from a set."
			toc={toc}
		>
			{/* Hero */}
			<DocHero>
				<div className="flex items-center gap-2">
					<Checkbox id="hero-checkbox" defaultChecked />
					<Label htmlFor="hero-checkbox">Accept terms and conditions</Label>
				</div>
			</DocHero>

			{/* Checkbox Examples */}
			<DocSection id="examples" title="Examples">
				<DocExample
					title="Default"
					description="A basic checkbox."
					code={`<Checkbox />`}
				>
					<Checkbox />
				</DocExample>

				<DocExample
					title="With Label"
					description="Checkbox with an associated label for better accessibility."
					code={`<div className="flex items-center gap-2">
  <Checkbox id="terms" />
  <Label htmlFor="terms">Accept terms and conditions</Label>
</div>`}
				>
					<div className="flex items-center gap-2">
						<Checkbox id="terms" />
						<Label htmlFor="terms">Accept terms and conditions</Label>
					</div>
				</DocExample>

				<DocExample
					title="Controlled"
					description="Control the checkbox state programmatically."
					code={`const [checked, setChecked] = React.useState(false)

<div className="flex items-center gap-2">
  <Checkbox
    id="controlled"
    checked={checked}
    onCheckedChange={setChecked}
  />
  <Label htmlFor="controlled">
    {checked ? "Checked" : "Unchecked"}
  </Label>
</div>`}
				>
					<ControlledCheckboxDemo />
				</DocExample>

				<DocExample
					title="Disabled"
					description="Disabled checkboxes prevent interaction."
					code={`<Checkbox disabled />
<Checkbox disabled defaultChecked />`}
				>
					<div className="flex items-center gap-4">
						<div className="flex items-center gap-2">
							<Checkbox id="disabled" disabled />
							<Label htmlFor="disabled" className="opacity-50">
								Disabled
							</Label>
						</div>
						<div className="flex items-center gap-2">
							<Checkbox id="disabled-checked" disabled defaultChecked />
							<Label htmlFor="disabled-checked" className="opacity-50">
								Disabled checked
							</Label>
						</div>
					</div>
				</DocExample>

				<DocExample
					title="Error State"
					description="Show validation errors using aria-invalid."
					code={`<div className="space-y-2">
  <div className="flex items-center gap-2">
    <Checkbox id="error" aria-invalid />
    <Label htmlFor="error">Required field</Label>
  </div>
  <p className="text-sm text-negative">
    You must accept the terms to continue.
  </p>
</div>`}
				>
					<div className="space-y-2">
						<div className="flex items-center gap-2">
							<Checkbox id="error" aria-invalid />
							<Label htmlFor="error">Accept terms and conditions</Label>
						</div>
						<p className="text-sm text-negative">
							You must accept the terms to continue.
						</p>
					</div>
				</DocExample>
			</DocSection>

			{/* CheckboxGroup Examples */}
			<DocSection id="checkbox-group" title="CheckboxGroup">
				<DocExample
					title="Basic"
					description="A group of checkboxes with a label."
					code={`<CheckboxGroup
  label="Notifications"
  options={[
    { value: "email", label: "Email" },
    { value: "sms", label: "SMS" },
    { value: "push", label: "Push" },
  ]}
  defaultValue={["email"]}
/>`}
				>
					<CheckboxGroup
						label="Notifications"
						options={[
							{ value: "email", label: "Email" },
							{ value: "sms", label: "SMS" },
							{ value: "push", label: "Push" },
						]}
						defaultValue={["email"]}
					/>
				</DocExample>

				<DocExample
					title="With Descriptions"
					description="Each option can have a description for more context."
					code={`<CheckboxGroup
  label="Permissions"
  description="Select the permissions for this role."
  options={[
    { value: "read", label: "Read", description: "View resources" },
    { value: "write", label: "Write", description: "Create and edit resources" },
    { value: "delete", label: "Delete", description: "Remove resources permanently" },
  ]}
  defaultValue={["read"]}
/>`}
				>
					<CheckboxGroup
						label="Permissions"
						description="Select the permissions for this role."
						options={[
							{ value: "read", label: "Read", description: "View resources" },
							{ value: "write", label: "Write", description: "Create and edit resources" },
							{ value: "delete", label: "Delete", description: "Remove resources permanently" },
						]}
						defaultValue={["read"]}
					/>
				</DocExample>

				<DocExample
					title="Horizontal"
					description="Lay out checkboxes horizontally for compact groups."
					code={`<CheckboxGroup
  label="Tags"
  orientation="horizontal"
  options={[
    { value: "featured", label: "Featured" },
    { value: "new", label: "New" },
    { value: "sale", label: "Sale" },
    { value: "limited", label: "Limited" },
  ]}
  defaultValue={["new"]}
/>`}
				>
					<CheckboxGroup
						label="Tags"
						orientation="horizontal"
						options={[
							{ value: "featured", label: "Featured" },
							{ value: "new", label: "New" },
							{ value: "sale", label: "Sale" },
							{ value: "limited", label: "Limited" },
						]}
						defaultValue={["new"]}
					/>
				</DocExample>

				<DocExample
					title="Controlled"
					description="Manage the selected values programmatically."
					code={`const [value, setValue] = React.useState(["email"])

<CheckboxGroup
  label="Notifications"
  description="Choose how you want to be notified."
  options={[
    { value: "email", label: "Email", description: "Get notified by email" },
    { value: "sms", label: "SMS", description: "Get notified by text message" },
    { value: "push", label: "Push", description: "Get notified on your device" },
  ]}
  value={value}
  onValueChange={setValue}
/>
<p>Selected: {value.join(", ")}</p>`}
				>
					<ControlledCheckboxGroupDemo />
				</DocExample>

				<DocExample
					title="Disabled"
					description="Disable the entire group."
					code={`<CheckboxGroup
  label="Features"
  disabled
  options={[
    { value: "analytics", label: "Analytics" },
    { value: "reports", label: "Reports" },
  ]}
  defaultValue={["analytics"]}
/>`}
				>
					<CheckboxGroup
						label="Features"
						disabled
						options={[
							{ value: "analytics", label: "Analytics" },
							{ value: "reports", label: "Reports" },
						]}
						defaultValue={["analytics"]}
					/>
				</DocExample>

				<DocExample
					title="Partially Disabled"
					description="Disable specific options while keeping others interactive."
					code={`<CheckboxGroup
  label="Plan features"
  options={[
    { value: "basic", label: "Basic support" },
    { value: "priority", label: "Priority support", disabled: true },
    { value: "dedicated", label: "Dedicated manager", disabled: true },
  ]}
  defaultValue={["basic"]}
/>`}
				>
					<CheckboxGroup
						label="Plan features"
						options={[
							{ value: "basic", label: "Basic support" },
							{ value: "priority", label: "Priority support", disabled: true },
							{ value: "dedicated", label: "Dedicated manager", disabled: true },
						]}
						defaultValue={["basic"]}
					/>
				</DocExample>

				<DocExample
					title="Error State"
					description="Show validation errors on the entire group."
					code={`<div className="space-y-2">
  <CheckboxGroup
    label="Terms"
    aria-invalid
    options={[
      { value: "terms", label: "I accept the terms of service" },
      { value: "privacy", label: "I accept the privacy policy" },
    ]}
  />
  <p className="text-sm text-negative">
    You must accept both to continue.
  </p>
</div>`}
				>
					<div className="space-y-2">
						<CheckboxGroup
							label="Terms"
							aria-invalid
							options={[
								{ value: "terms", label: "I accept the terms of service" },
								{ value: "privacy", label: "I accept the privacy policy" },
							]}
						/>
						<p className="text-sm text-negative">
							You must accept both to continue.
						</p>
					</div>
				</DocExample>
			</DocSection>

			{/* Props */}
			<DocSection id="checkbox-props" title="Checkbox Props">
				<DocPropsTable props={checkboxProps} />
			</DocSection>

			<DocSection id="checkbox-group-props" title="CheckboxGroup Props">
				<DocPropsTable props={checkboxGroupProps} />
			</DocSection>

			<DocSection id="checkbox-group-option" title="CheckboxGroupOption">
				<DocPropsTable props={checkboxGroupOptionProps} />
			</DocSection>

			{/* Guidelines */}
			<DocSection id="guidelines" title="Guidelines">
				<ul className="list-inside list-disc space-y-2 text-sm text-fg-muted">
					<li>Always pair checkboxes with labels for accessibility</li>
					<li>Use checkboxes for multiple selections, radio buttons for single selection</li>
					<li>Use CheckboxGroup when you have 2+ related options to simplify state management</li>
					<li>Use descriptions sparingly — only when the label alone is not clear enough</li>
					<li>Use horizontal orientation only for short labels (1-2 words)</li>
				</ul>
			</DocSection>

			{/* Related */}
			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{
							title: "Switch",
							href: "/docs/components/ui/switch",
							description: "For immediate-effect toggles instead of form submissions.",
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
