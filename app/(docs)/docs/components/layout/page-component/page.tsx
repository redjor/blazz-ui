import { Page, PageSection } from "@/components/ui/page"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package, Tag } from "lucide-react"
import { DocPage } from "@/components/features/docs/doc-page"
import { DocSection } from "@/components/features/docs/doc-section"
import { DocExample } from "@/components/features/docs/doc-example"
import { DocPropsTable, type DocProp } from "@/components/features/docs/doc-props-table"
import { DocRelated } from "@/components/features/docs/doc-related"

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "page-props", title: "Page Props" },
	{ id: "section-props", title: "PageSection Props" },
	{ id: "related", title: "Related" },
]

const pageProps: DocProp[] = [
	{
		name: "title",
		type: "React.ReactNode",
		description: "The main title of the page.",
	},
	{
		name: "subtitle",
		type: "React.ReactNode",
		description: "Subtitle or description text displayed below the title.",
	},
	{
		name: "primaryAction",
		type: "React.ReactNode",
		description: "Primary action button(s) displayed in the header.",
	},
	{
		name: "secondaryActions",
		type: "React.ReactNode",
		description: "Secondary action button(s) displayed in the header.",
	},
	{
		name: "breadcrumbs",
		type: "React.ReactNode | BreadcrumbConfig",
		description:
			"Breadcrumb navigation. Accepts a ReactNode for custom breadcrumbs, or a BreadcrumbConfig object { backHref, backIcon, title } for the common pattern.",
	},
	{
		name: "titleMetadata",
		type: "React.ReactNode",
		description: "Inline metadata displayed next to the title or breadcrumb title (e.g., status badge).",
	},
	{
		name: "additionalMetadata",
		type: "React.ReactNode",
		description: "Additional content in the header (e.g., tabs, metadata).",
	},
	{
		name: "fullWidth",
		type: "boolean",
		default: "false",
		description: "When true, removes max-width constraint and uses full viewport width.",
	},
	{
		name: "narrowWidth",
		type: "boolean",
		default: "false",
		description: "When true, uses a narrower max-width (max-w-5xl instead of max-w-7xl).",
	},
	{
		name: "divider",
		type: "boolean",
		default: "true",
		description: "Shows a divider line between the header and content.",
	},
	{
		name: "className",
		type: "string",
		description: "Custom className for the page container.",
	},
	{
		name: "headerClassName",
		type: "string",
		description: "Custom className for the page header.",
	},
	{
		name: "contentClassName",
		type: "string",
		description: "Custom className for the page content area.",
	},
]

const pageSectionProps: DocProp[] = [
	{
		name: "title",
		type: "string",
		description: "The title of the section.",
	},
	{
		name: "description",
		type: "string",
		description: "A description displayed below the section title.",
	},
	{
		name: "className",
		type: "string",
		description: "Additional CSS classes to apply to the section.",
	},
	{
		name: "children",
		type: "React.ReactNode",
		description: "The content to display inside the section.",
	},
]

export default function PageComponentPage() {
	return (
		<DocPage
			title="Page"
			subtitle="A container component for page-level layout with title, actions, and breadcrumbs."
			toc={toc}
		>
			<DocSection id="examples" title="Examples">
				<DocExample
					title="Basic"
					description="A page with just a title."
					code={`<Page title="Products">
  <p>Page content here</p>
</Page>`}
				>
					<div className="rounded-lg border border-edge bg-raised">
						<Page title="Products">
							<p className="text-sm text-fg-muted">Page content here</p>
						</Page>
					</div>
				</DocExample>

				<DocExample
					title="With Subtitle"
					description="A page with a title and subtitle."
					code={`<Page
  title="Products"
  subtitle="Manage your product catalog"
>
  <p>Page content here</p>
</Page>`}
				>
					<div className="rounded-lg border border-edge bg-raised">
						<Page title="Products" subtitle="Manage your product catalog">
							<p className="text-sm text-fg-muted">Page content here</p>
						</Page>
					</div>
				</DocExample>

				<DocExample
					title="With Actions"
					description="A page with primary and secondary action buttons."
					code={`<Page
  title="Products"
  subtitle="Manage your product catalog"
  primaryAction={<Button>Add product</Button>}
  secondaryActions={
    <Button variant="outline">Export</Button>
  }
>
  <p>Page content here</p>
</Page>`}
				>
					<div className="rounded-lg border border-edge bg-raised">
						<Page
							title="Products"
							subtitle="Manage your product catalog"
							primaryAction={<Button size="sm">Add product</Button>}
							secondaryActions={
								<Button variant="outline" size="sm">
									Export
								</Button>
							}
						>
							<p className="text-sm text-fg-muted">Page content here</p>
						</Page>
					</div>
				</DocExample>

				<DocExample
					title="With Breadcrumbs (object)"
					description="Pass a BreadcrumbConfig object to automatically render breadcrumb navigation in place of the title."
					code={`<Page
  narrowWidth
  breadcrumbs={{
    backHref: "/products",
    backIcon: Package,
    title: "Wireless Headphones",
  }}
  primaryAction={<Button>Save</Button>}
>
  <p>Page content here</p>
</Page>`}
				>
					<div className="rounded-lg border border-edge bg-raised">
						<Page
							narrowWidth
							breadcrumbs={{
								backHref: "/products",
								backIcon: Package,
								title: "Wireless Headphones",
							}}
							primaryAction={<Button size="sm">Save</Button>}
						>
							<p className="text-sm text-fg-muted">Page content here</p>
						</Page>
					</div>
				</DocExample>

				<DocExample
					title="With Breadcrumbs (parent step)"
					description="Add a parent step that truncates to save space. Hover to reveal the full text."
					code={`<Page
  narrowWidth
  breadcrumbs={{
    backHref: "/collections",
    backIcon: Package,
    parent: {
      label: "The Connoisseur Collection",
      href: "/collections/12",
    },
    title: "Sunset",
  }}
  primaryAction={<Button>Save</Button>}
>
  <p>Page content here</p>
</Page>`}
				>
					<div className="rounded-lg border border-edge bg-raised">
						<Page
							narrowWidth
							breadcrumbs={{
								backHref: "/collections",
								backIcon: Package,
								parent: {
									label: "The Connoisseur Collection",
									href: "/collections/12",
								},
								title: "Sunset",
							}}
							primaryAction={<Button size="sm">Save</Button>}
						>
							<p className="text-sm text-fg-muted">Page content here</p>
						</Page>
					</div>
				</DocExample>

				<DocExample
					title="With Breadcrumbs and Title Metadata"
					description="Combine breadcrumbs with titleMetadata to display a badge inline next to the title."
					code={`<Page
  narrowWidth
  breadcrumbs={{
    backHref: "/products",
    backIcon: Tag,
    title: "Wireless Headphones",
  }}
  titleMetadata={
    <Badge variant="outline">Active</Badge>
  }
  primaryAction={<Button>Save</Button>}
>
  <p>Page content here</p>
</Page>`}
				>
					<div className="rounded-lg border border-edge bg-raised">
						<Page
							narrowWidth
							breadcrumbs={{
								backHref: "/products",
								backIcon: Tag,
								title: "Wireless Headphones",
							}}
							titleMetadata={
								<Badge variant="outline">Active</Badge>
							}
							primaryAction={<Button size="sm">Save</Button>}
						>
							<p className="text-sm text-fg-muted">Page content here</p>
						</Page>
					</div>
				</DocExample>

				<DocExample
					title="With Additional Metadata"
					description="Use additionalMetadata to display contextual information below the title row."
					code={`<Page
  title="Wireless Headphones"
  subtitle="SKU: WH-1000"
  primaryAction={<Button>Save</Button>}
  additionalMetadata={
    <p className="text-sm text-fg-muted">
      Updated by an app on January 2 at 10:39
    </p>
  }
>
  <p>Page content here</p>
</Page>`}
				>
					<div className="rounded-lg border border-edge bg-raised">
						<Page
							title="Wireless Headphones"
							subtitle="SKU: WH-1000"
							primaryAction={<Button size="sm">Save</Button>}
							additionalMetadata={
								<p className="text-sm text-fg-muted">
									Updated by an app on January 2 at 10:39
								</p>
							}
						>
							<p className="text-sm text-fg-muted">Page content here</p>
						</Page>
					</div>
				</DocExample>

				<DocExample
					title="With Additional Metadata (Tabs)"
					description="additionalMetadata can also be used for tabs or filters below the header."
					code={`<Page
  title="Products"
  subtitle="Manage your product catalog"
  primaryAction={<Button>Add product</Button>}
  additionalMetadata={
    <Tabs defaultValue="all">
      <TabsList>
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="active">Active</TabsTrigger>
        <TabsTrigger value="draft">Draft</TabsTrigger>
        <TabsTrigger value="archived">Archived</TabsTrigger>
      </TabsList>
    </Tabs>
  }
>
  <p>Page content here</p>
</Page>`}
				>
					<div className="rounded-lg border border-edge bg-raised">
						<Page
							title="Products"
							subtitle="Manage your product catalog"
							primaryAction={<Button size="sm">Add product</Button>}
							additionalMetadata={
								<Tabs defaultValue="all">
									<TabsList>
										<TabsTrigger value="all">All</TabsTrigger>
										<TabsTrigger value="active">Active</TabsTrigger>
										<TabsTrigger value="draft">Draft</TabsTrigger>
										<TabsTrigger value="archived">Archived</TabsTrigger>
									</TabsList>
								</Tabs>
							}
						>
							<p className="text-sm text-fg-muted">Page content here</p>
						</Page>
					</div>
				</DocExample>

				<DocExample
					title="Full Width"
					description="A page that spans the full viewport width without max-width constraint."
					code={`<Page title="Dashboard" fullWidth>
  <p>Full width content</p>
</Page>`}
				>
					<div className="rounded-lg border border-edge bg-raised">
						<Page title="Dashboard" fullWidth>
							<p className="text-sm text-fg-muted">Full width content</p>
						</Page>
					</div>
				</DocExample>

				<DocExample
					title="Narrow Width"
					description="A page with a narrower max-width, ideal for forms and settings."
					code={`<Page title="Settings" narrowWidth>
  <p>Narrow content for forms</p>
</Page>`}
				>
					<div className="rounded-lg border border-edge bg-raised">
						<Page title="Settings" narrowWidth>
							<p className="text-sm text-fg-muted">
								Narrow content for forms
							</p>
						</Page>
					</div>
				</DocExample>

				<DocExample
					title="PageSection"
					description="Use PageSection to organize content into sub-sections within a page."
					code={`<Page title="Settings">
  <PageSection
    title="General"
    description="Basic settings for your store"
  >
    <p>General settings content</p>
  </PageSection>
  <PageSection
    title="Notifications"
    description="Configure notification preferences"
  >
    <p>Notification settings content</p>
  </PageSection>
</Page>`}
				>
					<div className="rounded-lg border border-edge bg-raised">
						<Page title="Settings">
							<div className="space-y-8">
								<PageSection
									title="General"
									description="Basic settings for your store"
								>
									<p className="text-sm text-fg-muted">
										General settings content
									</p>
								</PageSection>
								<PageSection
									title="Notifications"
									description="Configure notification preferences"
								>
									<p className="text-sm text-fg-muted">
										Notification settings content
									</p>
								</PageSection>
							</div>
						</Page>
					</div>
				</DocExample>
			</DocSection>

			<DocSection id="page-props" title="Page Props">
				<DocPropsTable props={pageProps} />
			</DocSection>

			<DocSection id="section-props" title="PageSection Props">
				<DocPropsTable props={pageSectionProps} />
			</DocSection>

			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{
							title: "Card",
							href: "/docs/components/layout/card",
							description: "Group similar concepts and tasks together within a page.",
						},
						{
							title: "Block Stack",
							href: "/docs/components/layout/block-stack",
							description: "Stack content vertically with consistent spacing.",
						},
					]}
				/>
			</DocSection>
		</DocPage>
	)
}
