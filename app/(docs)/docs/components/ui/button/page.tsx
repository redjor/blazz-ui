import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { DocPage } from "@/components/features/docs/doc-page"
import { DocSection } from "@/components/features/docs/doc-section"
import { DocHero } from "@/components/features/docs/doc-hero"
import { DocExample } from "@/components/features/docs/doc-example"
import { DocPropsTable, type DocProp } from "@/components/features/docs/doc-props-table"
import { DocDoDont } from "@/components/features/docs/doc-do-dont"
import { DocRelated } from "@/components/features/docs/doc-related"
import { Mail, ChevronRight, Plus } from "lucide-react"
const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "props", title: "Props" },
	{ id: "guidelines", title: "Guidelines" },
	{ id: "related", title: "Related" },
]
const buttonProps: DocProp[] = [
	{
		name: "variant",
		type: '"default" | "outline" | "secondary" | "ghost" | "destructive" | "link"',
		default: '"default"',
		description: "The visual style of the button.",
	},
	{
		name: "size",
		type: '"default" | "xs" | "sm" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg"',
		default: '"default"',
		description: "The size of the button.",
	},
	{
		name: "disabled",
		type: "boolean",
		default: "false",
		description: "Whether the button is disabled.",
	},
	{
		name: "children",
		type: "React.ReactNode",
		description: "The content of the button.",
		required: true,
	},
]
export default function ButtonPage() {
	return (
		<DocPage
			title="Button"
			subtitle="Buttons trigger actions and events. Use them to submit forms, navigate, or perform operations."
			toc={toc}
		>
			{/* Hero */}
			<DocHero>
				<div className="flex flex-wrap items-center gap-3">
					<Button>Primary</Button>
					<Button variant="outline">Outline</Button>
					<Button variant="secondary">Secondary</Button>
					<Button variant="ghost">Ghost</Button>
					<Button variant="destructive">Destructive</Button>
					<Button variant="link">Link</Button>
				</div>
			</DocHero>
			{/* Examples */}
			<DocSection id="examples" title="Examples">
					<DocExample
						title="Variants"
						description="Visual styles for different contexts."
						code={`<Button variant="default">Default</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="link">Link</Button>`}
					>
						<div className="flex flex-wrap items-center gap-2">
							<Button variant="default">Default</Button>
							<Button variant="outline">Outline</Button>
							<Button variant="secondary">Secondary</Button>
							<Button variant="ghost">Ghost</Button>
							<Button variant="destructive">Destructive</Button>
							<Button variant="link">Link</Button>
						</div>
					</DocExample>
					<DocExample
						title="Sizes"
						description="Available sizes for different contexts."
						code={`<Button size="xs">Extra Small</Button>
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>`}
					>
						<div className="flex flex-wrap items-center gap-2">
							<Button size="xs">Extra Small</Button>
							<Button size="sm">Small</Button>
							<Button size="default">Default</Button>
							<Button size="lg">Large</Button>
						</div>
					</DocExample>
				<DocExample
					title="With Icons"
					description="Add icons to buttons for visual context."
					code={`<Button>
  <Mail /> Send Email
</Button>
<Button variant="outline">
  Next <ChevronRight />
</Button>
<Button variant="secondary">
  <Plus /> Add Item
</Button>`}
				>
					<div className="flex flex-wrap gap-2">
						<Button>
							<Mail /> Send Email
						</Button>
						<Button variant="outline">
							Next <ChevronRight />
						</Button>
						<Button variant="secondary">
							<Plus /> Add Item
						</Button>
					</div>
				</DocExample>
					<DocExample
						title="Icon Only"
						description="Compact icon-only buttons."
						code={`<Button size="icon-xs"><Plus /></Button>
<Button size="icon-sm"><Plus /></Button>
<Button size="icon"><Plus /></Button>
<Button size="icon-lg"><Plus /></Button>`}
					>
						<div className="flex items-center gap-2">
							<Button size="icon-xs" variant="outline">
								<Plus />
							</Button>
							<Button size="icon-sm" variant="outline">
								<Plus />
							</Button>
							<Button size="icon" variant="outline">
								<Plus />
							</Button>
							<Button size="icon-lg" variant="outline">
								<Plus />
							</Button>
						</div>
					</DocExample>
					<DocExample
						title="Loading State"
						description="Show a spinner while processing."
						code={`<Button disabled>
  <Spinner />
  Please wait
</Button>`}
					>
						<Button disabled>
							<Spinner />
							Please wait
						</Button>
					</DocExample>
				<DocExample
					title="On Dark Surface"
					description="How variants render on a dark background."
					code={`<div className="bg-[var(--bg-app)] rounded-lg p-4">
  <Button variant="default">Default</Button>
  <Button variant="outline">Outline</Button>
</div>`}
				>
					<div className="flex flex-wrap items-center gap-2 rounded-lg bg-[var(--bg-app)] p-4">
						<Button variant="default">Default</Button>
						<Button variant="outline">Outline</Button>
						<Button variant="secondary">Secondary</Button>
						<Button variant="ghost">Ghost</Button>
					</div>
				</DocExample>
			</DocSection>
			{/* Props */}
			<DocSection id="props" title="Props">
				<DocPropsTable props={buttonProps} />
			</DocSection>
			{/* Guidelines */}
			<DocSection id="guidelines" title="Guidelines">
				<DocDoDont
					doExample={<Button>Save changes</Button>}
					doText="Use clear, action-oriented labels that describe what happens."
					dontExample={<Button>Submit</Button>}
					dontText="Avoid generic labels that don't communicate the action."
				/>
				<DocDoDont
					doExample={
						<div className="flex gap-2">
							<Button>Confirm</Button>
							<Button variant="outline">Cancel</Button>
						</div>
					}
					doText="Use one primary button per section. Secondary actions use outline variant."
					dontExample={
						<div className="flex gap-2">
							<Button>Save</Button>
							<Button>Confirm</Button>
							<Button>Apply</Button>
						</div>
					}
					dontText="Don't use multiple primary buttons — it creates confusion about the main action."
				/>
				<DocDoDont
					doExample={
						<Button variant="destructive">Delete account</Button>
					}
					doText="Use destructive variant only for irreversible, dangerous actions."
					dontExample={
						<Button variant="destructive">Cancel</Button>
					}
					dontText="Don't use destructive for cancel or dismiss actions."
				/>
			</DocSection>
			{/* Related */}
			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{
							title: "Button Group",
							href: "/docs/components/ui/button-group",
							description: "Group related buttons together with consistent spacing.",
						},
						{
							title: "Dialog",
							href: "/docs/components/ui/dialog",
							description: "Modal dialogs with button actions in the footer.",
						},
						{
							title: "Dropdown Menu",
							href: "/docs/components/ui/dropdown-menu",
							description: "Button trigger with a dropdown list of actions.",
						},
					]}
				/>
			</DocSection>
		</DocPage>
	)
}
