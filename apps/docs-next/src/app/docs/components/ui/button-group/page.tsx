import { Button } from "@blazz/ui/components/ui/button"
import { ButtonGroup } from "@blazz/ui/components/ui/button-group"
import { Bold, ChevronLeft, ChevronRight, Italic, Underline } from "lucide-react"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { type DocProp, DocPropsTable } from "~/components/docs/doc-props-table"
import { DocRelated } from "~/components/docs/doc-related"
import { DocSection } from "~/components/docs/doc-section"
import { highlightExamples } from "~/lib/highlight-examples"

const examples = [
	{
		key: "basic",
		code: `<ButtonGroup>
  <Button variant="outline">Left</Button>
  <Button variant="outline">Center</Button>
  <Button variant="outline">Right</Button>
</ButtonGroup>`,
	},
	{
		key: "with-icons",
		code: `<ButtonGroup>
  <Button variant="outline" size="icon">
    <ChevronLeft className="h-4 w-4" />
  </Button>
  <Button variant="outline" size="icon">
    <ChevronRight className="h-4 w-4" />
  </Button>
</ButtonGroup>`,
	},
	{
		key: "toolbar",
		code: `<ButtonGroup>
  <Button variant="outline" size="icon">
    <Bold className="h-4 w-4" />
  </Button>
  <Button variant="outline" size="icon">
    <Italic className="h-4 w-4" />
  </Button>
  <Button variant="outline" size="icon">
    <Underline className="h-4 w-4" />
  </Button>
</ButtonGroup>`,
	},
	{
		key: "variants",
		code: `<div className="flex flex-col gap-4">
  <ButtonGroup>
    <Button>Save</Button>
    <Button>Cancel</Button>
  </ButtonGroup>

  <ButtonGroup>
    <Button variant="secondary">Option A</Button>
    <Button variant="secondary">Option B</Button>
    <Button variant="secondary">Option C</Button>
  </ButtonGroup>
</div>`,
	},
] as const

const highlightedPromise = highlightExamples(examples as any)

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

export default async function ButtonGroupPage() {
	const highlighted = await highlightedPromise
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="Button Group"
			subtitle="Groups related buttons together with connected styling."
			toc={toc}
		>
			<DocHero>
				<ButtonGroup>
					<Button variant="outline">Left</Button>
					<Button variant="outline">Center</Button>
					<Button variant="outline">Right</Button>
				</ButtonGroup>
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExampleClient
					title="Basic Button Group"
					description="Group buttons together for related actions."
					code={examples[0].code}
					highlightedCode={html("basic")}
				>
					<ButtonGroup>
						<Button variant="outline">Left</Button>
						<Button variant="outline">Center</Button>
						<Button variant="outline">Right</Button>
					</ButtonGroup>
				</DocExampleClient>

				<DocExampleClient
					title="With Icons"
					description="Button groups work well with icon-only buttons."
					code={examples[1].code}
					highlightedCode={html("with-icons")}
				>
					<ButtonGroup>
						<Button variant="outline" size="icon">
							<ChevronLeft className="h-4 w-4" />
						</Button>
						<Button variant="outline" size="icon">
							<ChevronRight className="h-4 w-4" />
						</Button>
					</ButtonGroup>
				</DocExampleClient>

				<DocExampleClient
					title="Toolbar"
					description="Create a text formatting toolbar with button groups."
					code={examples[2].code}
					highlightedCode={html("toolbar")}
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
				</DocExampleClient>

				<DocExampleClient
					title="Different Variants"
					description="Button groups work with different button variants."
					code={examples[3].code}
					highlightedCode={html("variants")}
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
				</DocExampleClient>
			</DocSection>

			<DocSection id="props" title="Props">
				<DocPropsTable props={buttonGroupProps} />
			</DocSection>

			<DocSection id="best-practices" title="Best Practices">
				<ul className="list-disc list-inside space-y-2 text-fg-muted">
					<li>Use button groups for related actions that should be visually connected</li>
					<li>Keep the number of buttons in a group small (2-4 buttons)</li>
					<li>Use consistent button variants within a group</li>
					<li>Consider icon-only buttons for compact toolbars</li>
					<li>Ensure buttons in the group have similar importance levels</li>
				</ul>
			</DocSection>

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
