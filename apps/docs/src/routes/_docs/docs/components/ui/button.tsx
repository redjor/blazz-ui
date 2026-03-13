import { Button } from "@blazz/ui/components/ui/button"
import { Spinner } from "@blazz/ui/components/ui/spinner"
import { createFileRoute, useLoaderData } from "@tanstack/react-router"
import { ChevronRight, Mail, Plus } from "lucide-react"
import { DocDoDont } from "~/components/docs/doc-do-dont"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { type DocProp, DocPropsTable } from "~/components/docs/doc-props-table"
import { DocRelated } from "~/components/docs/doc-related"
import { DocSection } from "~/components/docs/doc-section"
import { highlightCode } from "~/lib/highlight-code"

const examples = [
	{
		key: "variants",
		code: `<Button variant="default">Default</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="link">Link</Button>`,
	},
	{
		key: "sizes",
		code: `<Button size="xs">Extra Small</Button>
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>`,
	},
	{
		key: "with-icons",
		code: `<Button>
  <Mail /> Send Email
</Button>
<Button variant="outline">
  Next <ChevronRight />
</Button>
<Button variant="secondary">
  <Plus /> Add Item
</Button>`,
	},
	{
		key: "icon-only",
		code: `<Button size="icon-xs"><Plus /></Button>
<Button size="icon-sm"><Plus /></Button>
<Button size="icon"><Plus /></Button>
<Button size="icon-lg"><Plus /></Button>`,
	},
	{
		key: "loading",
		code: `<Button disabled>
  <Spinner />
  Please wait
</Button>`,
	},
	{
		key: "on-dark",
		code: `<div className="bg-[var(--bg-app)] rounded-lg p-4">
  <Button variant="default">Default</Button>
  <Button variant="outline">Outline</Button>
</div>`,
	},
] as const

export const Route = createFileRoute("/_docs/docs/components/ui/button")({
	loader: async () => {
		const highlighted = await Promise.all(
			examples.map(async (ex) => ({
				key: ex.key,
				html: await highlightCode({ data: { code: ex.code } }),
			}))
		)
		return { highlighted }
	},
	component: ButtonPage,
})

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

function ButtonPage() {
	const { highlighted } = useLoaderData({ from: "/_docs/docs/components/ui/button" })

	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

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
				<DocExampleClient
					title="Variants"
					description="Visual styles for different contexts."
					code={examples[0].code}
					highlightedCode={html("variants")}
				>
					<div className="flex flex-wrap items-center gap-2">
						<Button variant="default">Default</Button>
						<Button variant="outline">Outline</Button>
						<Button variant="secondary">Secondary</Button>
						<Button variant="ghost">Ghost</Button>
						<Button variant="destructive">Destructive</Button>
						<Button variant="link">Link</Button>
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Sizes"
					description="Available sizes for different contexts."
					code={examples[1].code}
					highlightedCode={html("sizes")}
				>
					<div className="flex flex-wrap items-center gap-2">
						<Button size="xs">Extra Small</Button>
						<Button size="sm">Small</Button>
						<Button size="default">Default</Button>
						<Button size="lg">Large</Button>
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="With Icons"
					description="Add icons to buttons for visual context."
					code={examples[2].code}
					highlightedCode={html("with-icons")}
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
				</DocExampleClient>

				<DocExampleClient
					title="Icon Only"
					description="Compact icon-only buttons."
					code={examples[3].code}
					highlightedCode={html("icon-only")}
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
				</DocExampleClient>

				<DocExampleClient
					title="Loading State"
					description="Show a spinner while processing."
					code={examples[4].code}
					highlightedCode={html("loading")}
				>
					<Button disabled>
						<Spinner />
						Please wait
					</Button>
				</DocExampleClient>

				<DocExampleClient
					title="On Dark Surface"
					description="How variants render on a dark background."
					code={examples[5].code}
					highlightedCode={html("on-dark")}
				>
					<div className="flex flex-wrap items-center gap-2 rounded-lg bg-[var(--bg-app)] p-4">
						<Button variant="default">Default</Button>
						<Button variant="outline">Outline</Button>
						<Button variant="secondary">Secondary</Button>
						<Button variant="ghost">Ghost</Button>
					</div>
				</DocExampleClient>
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
					dontText="Don't use multiple primary buttons -- it creates confusion about the main action."
				/>
				<DocDoDont
					doExample={<Button variant="destructive">Delete account</Button>}
					doText="Use destructive variant only for irreversible, dangerous actions."
					dontExample={<Button variant="destructive">Cancel</Button>}
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
