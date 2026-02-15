import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { DocPage } from "@/components/features/docs/doc-page"
import { DocSection } from "@/components/features/docs/doc-section"
import { DocHero } from "@/components/features/docs/doc-hero"
import { DocExample } from "@/components/features/docs/doc-example"
import { DocPropsTable, type DocProp } from "@/components/features/docs/doc-props-table"
import { DocRelated } from "@/components/features/docs/doc-related"
import { ControlledCheckboxDemo } from "./_demos"

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "props", title: "Props" },
	{ id: "tokens", title: "Tokens" },
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

			{/* Examples */}
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
  <p className="text-sm text-p-critical-text">
    You must accept the terms to continue.
  </p>
</div>`}
				>
					<div className="space-y-2">
						<div className="flex items-center gap-2">
							<Checkbox id="error" aria-invalid />
							<Label htmlFor="error">Accept terms and conditions</Label>
						</div>
						<p className="text-sm text-p-critical-text">
							You must accept the terms to continue.
						</p>
					</div>
				</DocExample>

				<DocExample
					title="Checkbox Group"
					description="Group multiple checkboxes for related options."
					code={`<div className="space-y-2">
  <div className="flex items-center gap-2">
    <Checkbox id="option1" />
    <Label htmlFor="option1">Option 1</Label>
  </div>
  <div className="flex items-center gap-2">
    <Checkbox id="option2" />
    <Label htmlFor="option2">Option 2</Label>
  </div>
  <div className="flex items-center gap-2">
    <Checkbox id="option3" />
    <Label htmlFor="option3">Option 3</Label>
  </div>
</div>`}
				>
					<div className="space-y-2">
						<div className="flex items-center gap-2">
							<Checkbox id="option1" defaultChecked />
							<Label htmlFor="option1">Email notifications</Label>
						</div>
						<div className="flex items-center gap-2">
							<Checkbox id="option2" />
							<Label htmlFor="option2">SMS notifications</Label>
						</div>
						<div className="flex items-center gap-2">
							<Checkbox id="option3" defaultChecked />
							<Label htmlFor="option3">Push notifications</Label>
						</div>
					</div>
				</DocExample>
			</DocSection>

			{/* Props */}
			<DocSection id="props" title="Props">
				<DocPropsTable props={checkboxProps} />
			</DocSection>

			{/* Tokens */}
			<DocSection id="tokens" title="Design Tokens">
				<p className="text-sm text-fg-muted">
					Checkbox uses the design system for consistent styling:
				</p>
				<ul className="list-inside list-disc space-y-2 text-sm text-fg-muted">
					<li><code className="text-xs">border-edge</code> - Default border color</li>
					<li><code className="text-xs">bg-brand</code> - Checked state background</li>
					<li><code className="text-xs">rounded-md</code> - Border radius</li>
					<li><code className="text-xs">shadow-sm</code> - Subtle elevation</li>
				</ul>
			</DocSection>

			{/* Guidelines */}
			<DocSection id="guidelines" title="Guidelines">
				<ul className="list-inside list-disc space-y-2 text-sm text-fg-muted">
					<li>Always pair checkboxes with labels for accessibility</li>
					<li>Use checkboxes for multiple selections, radio buttons for single selection</li>
					<li>Group related checkboxes together with a fieldset</li>
					<li>Use clear, positive labels (avoid negative phrasing)</li>
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
