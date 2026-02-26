import { Label } from "@blazz/ui/components/ui/label"
import { Input } from "@blazz/ui/components/ui/input"
import { Checkbox } from "@blazz/ui/components/ui/checkbox"
import { Switch } from "@blazz/ui/components/ui/switch"
import { DocPage } from "@/components/docs/doc-page"
import { DocSection } from "@/components/docs/doc-section"
import { DocHero } from "@/components/docs/doc-hero"
import { DocExample } from "@/components/docs/doc-example"
import { DocPropsTable, type DocProp } from "@/components/docs/doc-props-table"
import { DocRelated } from "@/components/docs/doc-related"

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "props", title: "Props" },
	{ id: "guidelines", title: "Guidelines" },
	{ id: "related", title: "Related" },
]

const labelProps: DocProp[] = [
	{
		name: "htmlFor",
		type: "string",
		description:
			"The id of the form element that this label is associated with.",
	},
	{
		name: "className",
		type: "string",
		description: "Additional CSS classes.",
	},
	{
		name: "children",
		type: "React.ReactNode",
		description: "The label text or content.",
	},
]

export default function LabelPage() {
	return (
		<DocPage
			title="Label"
			subtitle="Renders an accessible label associated with a form control. Automatically handles disabled state styling."
			toc={toc}
		>
			<DocHero>
				<div className="space-y-2">
					<Label htmlFor="demo-input">Email address</Label>
					<Input id="demo-input" placeholder="you@example.com" className="max-w-xs" />
				</div>
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExample
					title="With Input"
					description="Associate a label with a text input using htmlFor."
					code={`<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input id="email" placeholder="you@example.com" />
</div>`}
				>
					<div className="w-[280px] space-y-2">
						<Label htmlFor="email">Email</Label>
						<Input id="email" placeholder="you@example.com" />
					</div>
				</DocExample>

				<DocExample
					title="With Checkbox"
					description="Pair a label with a checkbox control."
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
					title="With Switch"
					description="Label next to a switch toggle."
					code={`<div className="flex items-center gap-2">
  <Switch id="notifications" />
  <Label htmlFor="notifications">Enable notifications</Label>
</div>`}
				>
					<div className="flex items-center gap-2">
						<Switch id="notifications" />
						<Label htmlFor="notifications">Enable notifications</Label>
					</div>
				</DocExample>

				<DocExample
					title="Disabled State"
					description="When the associated control is disabled, the label visually dims via peer-disabled styling."
					code={`<div className="space-y-2">
  <Label htmlFor="disabled-input">Disabled field</Label>
  <Input id="disabled-input" disabled placeholder="Cannot edit" />
</div>`}
				>
					<div className="w-[280px] space-y-2">
						<Label htmlFor="disabled-input">Disabled field</Label>
						<Input id="disabled-input" disabled placeholder="Cannot edit" />
					</div>
				</DocExample>
			</DocSection>

			<DocSection id="props" title="Props">
				<p className="text-sm text-fg-muted mb-4">
					Label extends all native <code className="text-xs">&lt;label&gt;</code> HTML attributes.
				</p>
				<DocPropsTable props={labelProps} />
			</DocSection>

			<DocSection id="guidelines" title="Guidelines">
				<ul className="list-inside list-disc space-y-2 text-sm text-fg-muted">
					<li>Always use htmlFor to associate the label with its form control for accessibility</li>
					<li>Keep label text concise and descriptive</li>
					<li>Place labels above inputs or to the left of checkboxes and switches</li>
					<li>Label automatically handles disabled styling via peer-disabled and group-data-disabled selectors</li>
				</ul>
			</DocSection>

			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{
							title: "Input",
							href: "/docs/components/ui/input",
							description: "A text input field for collecting user data.",
						},
						{
							title: "Checkbox",
							href: "/docs/components/ui/checkbox",
							description: "A checkbox for boolean selections.",
						},
						{
							title: "Switch",
							href: "/docs/components/ui/switch",
							description: "A toggle switch for on/off states.",
						},
					]}
				/>
			</DocSection>
		</DocPage>
	)
}
