import { Building, Plus, SearchX, RotateCcw, Rocket, FileText, Users } from "lucide-react"
import { Empty, EmptyIcon, EmptyTitle, EmptyDescription, EmptyActions } from "@/components/ui/empty"
import { Button } from "@/components/ui/button"
import { DocPage } from "@/components/features/docs/doc-page"
import { DocSection } from "@/components/features/docs/doc-section"
import { DocHero } from "@/components/features/docs/doc-hero"
import { DocExample } from "@/components/features/docs/doc-example"
import { DocPropsTable, type DocProp } from "@/components/features/docs/doc-props-table"
import { DocRelated } from "@/components/features/docs/doc-related"

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "sizes", title: "Sizes" },
	{ id: "composition", title: "Composition" },
	{ id: "empty-props", title: "Empty Props" },
	{ id: "action-props", title: "EmptyAction Props" },
	{ id: "tokens", title: "Design Tokens" },
	{ id: "guidelines", title: "Guidelines" },
	{ id: "related", title: "Related" },
]

const emptyProps: DocProp[] = [
	{
		name: "icon",
		type: "LucideIcon",
		description: "Lucide icon displayed in a circular container.",
	},
	{
		name: "title",
		type: "string",
		description: "Title text displayed below the icon.",
	},
	{
		name: "description",
		type: "string",
		description: "Description text displayed below the title.",
	},
	{
		name: "action",
		type: "EmptyAction",
		description: "Primary action button configuration.",
	},
	{
		name: "secondaryAction",
		type: "EmptyAction",
		description: "Secondary action button configuration.",
	},
	{
		name: "size",
		type: '"sm" | "default" | "lg"',
		default: '"default"',
		description: "Controls padding and icon size. Use sm for cards, default for page sections, lg for full-page states.",
	},
	{
		name: "children",
		type: "React.ReactNode",
		description: "When provided, enables compositional mode. Props-based content (icon, title, etc.) is ignored.",
	},
]

const actionProps: DocProp[] = [
	{
		name: "label",
		type: "string",
		description: "The text content of the action button.",
	},
	{
		name: "href",
		type: "string",
		description: "URL for the action. Renders a Next.js Link.",
	},
	{
		name: "onClick",
		type: "() => void",
		description: "Callback when the action is clicked.",
	},
	{
		name: "icon",
		type: "LucideIcon",
		description: "Icon displayed before the action label.",
	},
]

export default function EmptyPage() {
	return (
		<DocPage
			title="Empty"
			subtitle="Communicate empty states with context and actionable guidance. Use when data doesn't exist yet or search results are empty."
			toc={toc}
		>
			{/* Hero */}
			<DocHero>
				<Empty
					icon={Building}
					title="No companies"
					description="Create your first company to get started."
					action={{ label: "Add company", icon: Plus }}
				/>
			</DocHero>

			{/* Examples */}
			<DocSection id="examples" title="Examples">
				<DocExample
					title="Basic"
					description="A minimal empty state with just an icon and title."
					code={`<Empty
  icon={Building}
  title="No companies"
/>`}
				>
					<Empty icon={Building} title="No companies" />
				</DocExample>

				<DocExample
					title="With Description"
					description="Add context to help the user understand why the area is empty."
					code={`<Empty
  icon={Users}
  title="No contacts"
  description="Import your contacts or create them manually."
/>`}
				>
					<Empty
						icon={Users}
						title="No contacts"
						description="Import your contacts or create them manually."
					/>
				</DocExample>

				<DocExample
					title="With Action"
					description="Provide a clear next step. The primary pattern for 'no data' states."
					code={`<Empty
  icon={Building}
  title="No companies"
  description="Create your first company to get started."
  action={{ label: "Add company", href: "/companies/new", icon: Plus }}
/>`}
				>
					<Empty
						icon={Building}
						title="No companies"
						description="Create your first company to get started."
						action={{ label: "Add company", icon: Plus }}
					/>
				</DocExample>

				<DocExample
					title="With Two Actions"
					description="Offer primary and secondary paths when multiple options exist."
					code={`<Empty
  icon={FileText}
  title="No documents"
  description="Upload a file or create a new document from scratch."
  action={{ label: "Upload file", icon: Plus }}
  secondaryAction={{ label: "Create blank", onClick: () => {} }}
/>`}
				>
					<Empty
						icon={FileText}
						title="No documents"
						description="Upload a file or create a new document from scratch."
						action={{ label: "Upload file", icon: Plus }}
						secondaryAction={{ label: "Create blank" }}
					/>
				</DocExample>

				<DocExample
					title="No Results"
					description="Use when filters or search return nothing. Always offer a way to reset."
					code={`<Empty
  icon={SearchX}
  title="No results"
  description="No companies match your current filters."
  action={{ label: "Reset filters", icon: RotateCcw, onClick: () => {} }}
  size="sm"
/>`}
				>
					<Empty
						icon={SearchX}
						title="No results"
						description="No companies match your current filters."
						action={{ label: "Reset filters", icon: RotateCcw }}
						size="sm"
					/>
				</DocExample>
			</DocSection>

			{/* Sizes */}
			<DocSection id="sizes" title="Sizes">
				<DocExample
					title="Small"
					description="Use inside cards, kanban columns, or compact sections."
					code={`<Empty
  icon={Users}
  title="No contacts"
  size="sm"
/>`}
				>
					<Empty icon={Users} title="No contacts" size="sm" />
				</DocExample>

				<DocExample
					title="Default"
					description="Standard size for page sections and tables."
					code={`<Empty
  icon={Users}
  title="No contacts"
  description="Add contacts to this company."
  action={{ label: "Add contact", icon: Plus }}
/>`}
				>
					<Empty
						icon={Users}
						title="No contacts"
						description="Add contacts to this company."
						action={{ label: "Add contact", icon: Plus }}
					/>
				</DocExample>

				<DocExample
					title="Large"
					description="Use for full-page states like onboarding or first-run experiences."
					code={`<Empty
  icon={Rocket}
  title="Welcome to Forge CRM"
  description="Get started by importing your data or creating your first company."
  action={{ label: "Import data", icon: Plus }}
  secondaryAction={{ label: "Create manually" }}
  size="lg"
/>`}
				>
					<Empty
						icon={Rocket}
						title="Welcome to Forge CRM"
						description="Get started by importing your data or creating your first company."
						action={{ label: "Import data", icon: Plus }}
						secondaryAction={{ label: "Create manually" }}
						size="lg"
					/>
				</DocExample>
			</DocSection>

			{/* Composition */}
			<DocSection id="composition" title="Composition">
				<DocExample
					title="Compositional API"
					description="Use sub-components for full layout control when the props-based API isn't enough."
					code={`<Empty size="lg">
  <EmptyIcon size="lg">
    <Rocket />
  </EmptyIcon>
  <EmptyTitle>Build your pipeline</EmptyTitle>
  <EmptyDescription>
    Start by adding deals from the contacts page, or import a CSV.
  </EmptyDescription>
  <EmptyActions>
    <Button size="sm">Import CSV</Button>
    <Button size="sm" variant="outline">Create deal</Button>
  </EmptyActions>
</Empty>`}
				>
					<Empty size="lg">
						<EmptyIcon size="lg">
							<Rocket />
						</EmptyIcon>
						<EmptyTitle>Build your pipeline</EmptyTitle>
						<EmptyDescription>
							Start by adding deals from the contacts page, or import a CSV.
						</EmptyDescription>
						<EmptyActions>
							<Button size="sm">Import CSV</Button>
							<Button size="sm" variant="outline">Create deal</Button>
						</EmptyActions>
					</Empty>
				</DocExample>
			</DocSection>

			{/* Props */}
			<DocSection id="empty-props" title="Empty Props">
				<DocPropsTable props={emptyProps} />
			</DocSection>

			<DocSection id="action-props" title="EmptyAction Props">
				<DocPropsTable props={actionProps} />
			</DocSection>

			{/* Design Tokens */}
			<DocSection id="tokens" title="Design Tokens">
				<p className="text-sm text-fg-muted">
					Empty uses the design system tokens for consistent styling:
				</p>
				<ul className="list-inside list-disc space-y-2 text-sm text-fg-muted">
					<li>
						<code className="text-xs">bg-raised</code> — Icon circle background
					</li>
					<li>
						<code className="text-xs">text-fg</code> — Title text
					</li>
					<li>
						<code className="text-xs">text-fg-muted</code> — Icon color and description text
					</li>
					<li>
						<code className="text-xs">py-6 / py-12 / py-20</code> — Size-dependent vertical padding
					</li>
				</ul>
			</DocSection>

			{/* Guidelines */}
			<DocSection id="guidelines" title="Guidelines">
				<ul className="list-inside list-disc space-y-2 text-sm text-fg-muted">
					<li>Distinguish between "no data" (first-time) and "no results" (filters too restrictive)</li>
					<li>"No data" states should include a CTA to create the first item</li>
					<li>"No results" states should offer a way to reset filters</li>
					<li>Always provide an action — never leave the user without a next step</li>
					<li>Keep descriptions short and actionable (1 sentence max)</li>
					<li>Use <code className="text-xs">sm</code> size inside cards and panels, <code className="text-xs">lg</code> for full-page onboarding</li>
					<li>Icons should be descriptive of the content type, not decorative</li>
				</ul>
			</DocSection>

			{/* Related */}
			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{
							title: "Banner",
							href: "/docs/components/ui/banner",
							description: "Page-level messages and notifications.",
						},
						{
							title: "Alert",
							href: "/docs/components/ui/alert",
							description: "Inline feedback within sections.",
						},
						{
							title: "Skeleton",
							href: "/docs/components/ui/skeleton",
							description: "Loading placeholders while data is being fetched.",
						},
					]}
				/>
			</DocSection>
		</DocPage>
	)
}
