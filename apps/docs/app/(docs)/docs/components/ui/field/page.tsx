import { DocPage } from "@/components/docs/doc-page"
import { DocSection } from "@/components/docs/doc-section"
import { DocHero } from "@/components/docs/doc-hero"
import { DocExample } from "@/components/docs/doc-example"
import { DocPropsTable, type DocProp } from "@/components/docs/doc-props-table"
import { DocRelated } from "@/components/docs/doc-related"
import {
	FieldHeroDemo,
	FieldBasicDemo,
	FieldDescriptionDemo,
	FieldErrorDemo,
	FieldMultipleErrorsDemo,
	FieldTextareaDemo,
	FieldSelectDemo,
	FieldValidationDemo,
	FieldHorizontalDemo,
	FieldHorizontalControlledDemo,
	FieldHorizontalFieldsetDemo,
} from "./_demos"

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "horizontal", title: "Horizontal Layout" },
	{ id: "field-props", title: "Field Props" },
	{ id: "field-label-props", title: "FieldLabel Props" },
	{ id: "field-control-props", title: "FieldControl Props" },
	{ id: "field-description-props", title: "FieldDescription Props" },
	{ id: "field-error-props", title: "FieldError Props" },
	{ id: "guidelines", title: "Guidelines" },
	{ id: "related", title: "Related" },
]

const fieldProps: DocProp[] = [
	{
		name: "orientation",
		type: '"vertical" | "horizontal"',
		default: '"vertical"',
		description: "Layout direction of the field. Vertical stacks label above control; horizontal places them side by side.",
	},
	{
		name: "className",
		type: "string",
		description: "Additional CSS classes.",
	},
]

const fieldLabelProps: DocProp[] = [
	{
		name: "children",
		type: "ReactNode",
		description: "The label text.",
	},
	{
		name: "className",
		type: "string",
		description: "Additional CSS classes. Turns text-negative automatically when the field has errors.",
	},
]

const fieldControlProps: DocProp[] = [
	{
		name: "children",
		type: "ReactElement",
		description: "The form control element. Receives id, aria-describedby, and aria-invalid via cloneElement.",
	},
	{
		name: "render",
		type: "(ctx) => ReactNode",
		description: "Render function alternative. Receives { id, descriptionId, errorId, hasError }.",
	},
]

const fieldDescriptionProps: DocProp[] = [
	{
		name: "children",
		type: "ReactNode",
		description: "Helper text displayed below the control.",
	},
	{
		name: "className",
		type: "string",
		description: "Additional CSS classes.",
	},
]

const fieldErrorProps: DocProp[] = [
	{
		name: "errors",
		type: "string[]",
		description: "Array of error messages. Useful for react-hook-form integration.",
	},
	{
		name: "children",
		type: "ReactNode",
		description: "Inline error content. Used when errors prop is not provided.",
	},
	{
		name: "className",
		type: "string",
		description: "Additional CSS classes.",
	},
]

export default function FieldPage() {
	return (
		<DocPage
			title="Field"
			subtitle="A composition system for accessible form fields. Connects labels, controls, descriptions, and error messages with proper aria attributes."
			toc={toc}
		>
			{/* Hero */}
			<DocHero>
				<FieldHeroDemo />
			</DocHero>

			{/* Examples */}
			<DocSection id="examples" title="Examples">
				<DocExample
					title="Basic"
					description="A simple field with a label and input."
					code={`<Field>
  <FieldLabel>Name</FieldLabel>
  <FieldControl>
    <Input placeholder="Enter your name" />
  </FieldControl>
</Field>`}
				>
					<FieldBasicDemo />
				</DocExample>

				<DocExample
					title="With Description"
					description="Add helper text below the control."
					code={`<Field>
  <FieldLabel>Email</FieldLabel>
  <FieldControl>
    <Input type="email" placeholder="you@example.com" />
  </FieldControl>
  <FieldDescription>We will never share your email.</FieldDescription>
</Field>`}
				>
					<FieldDescriptionDemo />
				</DocExample>

				<DocExample
					title="With Error"
					description="Display validation errors. The label automatically turns red and aria-invalid is set on the control."
					code={`<Field>
  <FieldLabel>Username</FieldLabel>
  <FieldControl>
    <Input placeholder="Enter username" />
  </FieldControl>
  <FieldError>This field is required.</FieldError>
</Field>`}
				>
					<FieldErrorDemo />
				</DocExample>

				<DocExample
					title="Multiple Errors"
					description="Pass an array of error messages via the errors prop."
					code={`<Field>
  <FieldLabel>Password</FieldLabel>
  <FieldControl>
    <Input type="password" placeholder="Enter password" />
  </FieldControl>
  <FieldError errors={[
    "Must be at least 8 characters.",
    "Must contain a number.",
  ]} />
</Field>`}
				>
					<FieldMultipleErrorsDemo />
				</DocExample>

				<DocExample
					title="With Textarea"
					description="Field works with any form control."
					code={`<Field>
  <FieldLabel>Bio</FieldLabel>
  <FieldControl>
    <Textarea placeholder="Tell us about yourself..." />
  </FieldControl>
  <FieldDescription>Max 500 characters.</FieldDescription>
</Field>`}
				>
					<FieldTextareaDemo />
				</DocExample>

				<DocExample
					title="With Select"
					description="Use the render prop for components that don't accept a direct id prop."
					code={`<Field>
  <FieldLabel>Country</FieldLabel>
  <FieldControl
    render={({ id }) => (
      <Select>
        <SelectTrigger id={id}>
          <SelectValue placeholder="Select a country" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="fr">France</SelectItem>
          <SelectItem value="us">United States</SelectItem>
          <SelectItem value="uk">United Kingdom</SelectItem>
        </SelectContent>
      </Select>
    )}
  >
    <span />
  </FieldControl>
</Field>`}
				>
					<FieldSelectDemo />
				</DocExample>

				<DocExample
					title="Controlled Validation"
					description="Interactive example with client-side validation on submit."
					code={`const [value, setValue] = React.useState("")
const [submitted, setSubmitted] = React.useState(false)
const error = submitted && !value.trim()
  ? "This field is required." : undefined

<Field>
  <FieldLabel>Username</FieldLabel>
  <FieldControl>
    <Input value={value} onChange={...} />
  </FieldControl>
  <FieldDescription>Must be at least 3 characters.</FieldDescription>
  <FieldError errors={error ? [error] : undefined} />
</Field>`}
				>
					<FieldValidationDemo />
				</DocExample>
			</DocSection>

			{/* Horizontal */}
			<DocSection id="horizontal" title="Horizontal Layout">
				<DocExample
					title="Horizontal Field"
					description="Use orientation='horizontal' for side-by-side label and control. Wrap the control, description, and error in FieldContent."
					code={`<Field orientation="horizontal">
  <FieldLabel>Email</FieldLabel>
  <FieldContent>
    <FieldControl>
      <Input type="email" placeholder="you@example.com" />
    </FieldControl>
    <FieldDescription>We will never share your email.</FieldDescription>
  </FieldContent>
</Field>`}
				>
					<FieldHorizontalDemo />
				</DocExample>

				<DocExample
					title="Horizontal with Validation"
					description="Controlled horizontal field with inline validation."
					code={`<Field orientation="horizontal">
  <FieldLabel>Email</FieldLabel>
  <FieldContent>
    <FieldControl>
      <Input type="email" value={email} onChange={...} />
    </FieldControl>
    <FieldDescription>We will never share your email.</FieldDescription>
    <FieldError errors={error ? [error] : undefined} />
  </FieldContent>
</Field>`}
				>
					<FieldHorizontalControlledDemo />
				</DocExample>

				<DocExample
					title="Horizontal Fieldset"
					description="Compose multiple horizontal fields in a fieldset."
					code={`<fieldset className="space-y-4">
  <legend className="text-sm font-medium mb-2">Profile</legend>
  <Field orientation="horizontal">
    <FieldLabel>First name</FieldLabel>
    <FieldContent>
      <FieldControl><Input placeholder="Jane" /></FieldControl>
    </FieldContent>
  </Field>
  <Field orientation="horizontal">
    <FieldLabel>Last name</FieldLabel>
    <FieldContent>
      <FieldControl><Input placeholder="Doe" /></FieldControl>
    </FieldContent>
  </Field>
</fieldset>`}
				>
					<FieldHorizontalFieldsetDemo />
				</DocExample>
			</DocSection>

			{/* Props */}
			<DocSection id="field-props" title="Field Props">
				<DocPropsTable props={fieldProps} />
			</DocSection>

			<DocSection id="field-label-props" title="FieldLabel Props">
				<DocPropsTable props={fieldLabelProps} />
			</DocSection>

			<DocSection id="field-control-props" title="FieldControl Props">
				<DocPropsTable props={fieldControlProps} />
			</DocSection>

			<DocSection id="field-description-props" title="FieldDescription Props">
				<DocPropsTable props={fieldDescriptionProps} />
			</DocSection>

			<DocSection id="field-error-props" title="FieldError Props">
				<DocPropsTable props={fieldErrorProps} />
			</DocSection>

			{/* Guidelines */}
			<DocSection id="guidelines" title="Guidelines">
				<ul className="list-inside list-disc space-y-2 text-sm text-fg-muted">
					<li>Always use FieldLabel for accessibility — it auto-connects to the control via htmlFor</li>
					<li>Use FieldControl to inject aria attributes into your form control</li>
					<li>Use the render prop on FieldControl for components that don't accept an id prop directly</li>
					<li>For horizontal layouts, wrap control + description + error in FieldContent</li>
					<li>FieldError accepts either children (static) or an errors array (dynamic, e.g. from react-hook-form)</li>
					<li>Field is framework-agnostic — works with or without react-hook-form</li>
				</ul>
			</DocSection>

			{/* Related */}
			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{
							title: "Input",
							href: "/docs/components/ui/input",
							description: "The primary text input control for fields.",
						},
						{
							title: "Label",
							href: "/docs/components/ui/label",
							description: "Standalone label component used by FieldLabel.",
						},
						{
							title: "Select",
							href: "/docs/components/ui/select",
							description: "Dropdown selection control for fields.",
						},
					]}
				/>
			</DocSection>
		</DocPage>
	)
}
