import { DocPage } from "@/components/features/docs/doc-page"
import { DocSection } from "@/components/features/docs/doc-section"
import { DocHero } from "@/components/features/docs/doc-hero"
import { DocExample } from "@/components/features/docs/doc-example"
import { DocPropsTable, type DocProp } from "@/components/features/docs/doc-props-table"
import { DocRelated } from "@/components/features/docs/doc-related"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { ChevronLeft, ChevronRight, Bold, Italic, Underline } from "lucide-react"

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "props", title: "Props" },
	{ id: "best-practices", title: "Best Practices" },
	{ id: "related", title: "Related" },
]

const buttonGroupProps: DocProp[] = [
	{
		name: "children",
		type: "React.ReactNode",
		required: true,
		description: "The buttons to group together.",
	},
	{
		name: "className",
		type: "string",
		description: "Additional CSS classes to apply.",
	},
]

export default function ButtonGroupPage() {
	return (
		<DocPage
			title="Button Group"
			subtitle="Groups related buttons together with connected styling."
			toc={toc}
		>
			{/* Hero */}
			<DocHero>
				<ButtonGroup>
					<Button variant="outline">Left</Button>
					<Button variant="outline">Center</Button>
					<Button variant="outline">Right</Button>
				</ButtonGroup>
			</DocHero>

			{/* Examples */}
			<DocSection id="examples" title="Examples">
				<DocExample
					title="Basic Button Group"
					description="Group buttons together for related actions."
					code={`<ButtonGroup>
  <Button variant="outline">Left</Button>
  <Button variant="outline">Center</Button>
  <Button variant="outline">Right</Button>
</ButtonGroup>`}
				>
					<ButtonGroup>
						<Button variant="outline">Left</Button>
						<Button variant="outline">Center</Button>
						<Button variant="outline">Right</Button>
					</ButtonGroup>
				</DocExample>

				<DocExample
					title="With Icons"
					description="Button groups work well with icon-only buttons."
					code={`<ButtonGroup>
  <Button variant="outline" size="icon">
    <ChevronLeft className="h-4 w-4" />
  </Button>
  <Button variant="outline" size="icon">
    <ChevronRight className="h-4 w-4" />
  </Button>
</ButtonGroup>`}
				>
					<ButtonGroup>
						<Button variant="outline" size="icon">
							<ChevronLeft className="h-4 w-4" />
						</Button>
						<Button variant="outline" size="icon">
							<ChevronRight className="h-4 w-4" />
						</Button>
					</ButtonGroup>
				</DocExample>

				<DocExample
					title="Toolbar"
					description="Create a text formatting toolbar with button groups."
					code={`<ButtonGroup>
  <Button variant="outline" size="icon">
    <Bold className="h-4 w-4" />
  </Button>
  <Button variant="outline" size="icon">
    <Italic className="h-4 w-4" />
  </Button>
  <Button variant="outline" size="icon">
    <Underline className="h-4 w-4" />
  </Button>
</ButtonGroup>`}
				>
					<ButtonGroup>
						<Button variant="outline" size="icon">
							<Bold className="h-4 w-4" />
						</Button>
						<Button variant="outline" size="icon">
							<Italic className="h-4 w-4" />
						</Button>
						<Button variant="outline" size="icon">
							<Underline className="h-4 w-4" />
						</Button>
					</ButtonGroup>
				</DocExample>

				<DocExample
					title="Different Variants"
					description="Button groups work with different button variants."
					code={`<div className="flex flex-col gap-4">
  <ButtonGroup>
    <Button>Save</Button>
    <Button>Cancel</Button>
  </ButtonGroup>

  <ButtonGroup>
    <Button variant="secondary">Option A</Button>
    <Button variant="secondary">Option B</Button>
    <Button variant="secondary">Option C</Button>
  </ButtonGroup>
</div>`}
				>
					<div className="flex flex-col gap-4">
						<ButtonGroup>
							<Button>Save</Button>
							<Button>Cancel</Button>
						</ButtonGroup>

						<ButtonGroup>
							<Button variant="secondary">Option A</Button>
							<Button variant="secondary">Option B</Button>
							<Button variant="secondary">Option C</Button>
						</ButtonGroup>
					</div>
				</DocExample>
			</DocSection>

			{/* Props */}
			<DocSection id="props" title="Props">
				<DocPropsTable props={buttonGroupProps} />
			</DocSection>

			{/* Best Practices */}
			<DocSection id="best-practices" title="Best Practices">
				<ul className="list-disc list-inside space-y-2 text-fg-muted">
					<li>Use button groups for related actions that should be visually connected</li>
					<li>Keep the number of buttons in a group small (2-4 buttons)</li>
					<li>Use consistent button variants within a group</li>
					<li>Consider icon-only buttons for compact toolbars</li>
					<li>Ensure buttons in the group have similar importance levels</li>
				</ul>
			</DocSection>

			{/* Related */}
			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{
							title: "Button",
							href: "/docs/components/ui/button",
							description: "The individual button component used within groups.",
						},
						{
							title: "Toolbar",
							href: "/docs/components/ui/toolbar",
							description: "A more structured toolbar component for complex toolbars.",
						},
					]}
				/>
			</DocSection>
		</DocPage>
	)
}
