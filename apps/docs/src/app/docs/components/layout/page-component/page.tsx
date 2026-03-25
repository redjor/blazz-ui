"use client"

import { use } from "react"
import { Badge } from "@blazz/ui/components/ui/badge"
import { Button } from "@blazz/ui/components/ui/button"
import { Page, PageSection, PageWrapper } from "@blazz/ui/components/ui/page"
import { PageHeader } from "@blazz/ui/components/patterns/page-header-shell"
import { Tabs, TabsList, TabsTrigger } from "@blazz/ui/components/ui/tabs"
import { Package, Tag, ArrowLeft } from "lucide-react"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocPage } from "~/components/docs/doc-page"
import { type DocProp, DocPropsTable } from "~/components/docs/doc-props-table"
import { DocRelated } from "~/components/docs/doc-related"
import { DocSection } from "~/components/docs/doc-section"
import { highlightExamples } from "~/lib/highlight-examples"

/* ------------------------------------------------------------------ */
/*  Examples                                                           */
/* ------------------------------------------------------------------ */

const examples = [
	// — Page basics —
	{
		key: "basic",
		code: `<Page title="Products">
  <p>Page content here</p>
</Page>`,
	},
	{
		key: "with-subtitle",
		code: `<Page
  title="Products"
  subtitle="Manage your product catalog"
>
  <p>Page content here</p>
</Page>`,
	},
	{
		key: "with-actions",
		code: `<Page
  title="Products"
  subtitle="Manage your product catalog"
  primaryAction={<Button>Add product</Button>}
  secondaryActions={
    <Button variant="outline">Export</Button>
  }
>
  <p>Page content here</p>
</Page>`,
	},
	// — Breadcrumbs —
	{
		key: "breadcrumbs-array",
		code: `<Page
  breadcrumbs={[
    { label: "Products", href: "/products", icon: Package },
    { label: "Wireless Headphones" },
  ]}
  subtitle="SKU: WH-1000"
  primaryAction={<Button>Save</Button>}
>
  <p>Page content here</p>
</Page>`,
	},
	{
		key: "breadcrumbs-object",
		code: `<Page
  narrowWidth
  breadcrumbs={{
    backHref: "/products",
    backIcon: Package,
    title: "Wireless Headphones",
  }}
  primaryAction={<Button>Save</Button>}
>
  <p>Page content here</p>
</Page>`,
	},
	{
		key: "breadcrumbs-parent",
		code: `<Page
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
</Page>`,
	},
	// — Title metadata —
	{
		key: "title-metadata",
		code: `<Page
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
</Page>`,
	},
	// — Additional metadata —
	{
		key: "additional-metadata",
		code: `<Page
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
</Page>`,
	},
	{
		key: "metadata-tabs",
		code: `<Page
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
</Page>`,
	},
	// — Width variants —
	{
		key: "full-width",
		code: `<Page title="Dashboard" fullWidth>
  <p>Full width content</p>
</Page>`,
	},
	{
		key: "narrow-width",
		code: `<Page title="Settings" narrowWidth>
  <p>Narrow content for forms</p>
</Page>`,
	},
	// — PageSection —
	{
		key: "page-section",
		code: `<Page title="Settings">
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
</Page>`,
	},
	// — PageHeader (standalone pattern) —
	{
		key: "header-basic",
		code: `<PageHeader
  title="Products"
  description="Manage your product catalog"
  actions={<Button>Add product</Button>}
/>`,
	},
	{
		key: "header-breadcrumbs",
		code: `<PageHeader
  breadcrumbs={[
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: "Wireless Headphones" },
  ]}
  title="Wireless Headphones"
  actions={<Button>Save</Button>}
/>`,
	},
	{
		key: "header-in-page",
		code: `<Page fullWidth divider={false}>
  <PageHeader
    breadcrumbs={[
      { label: "Products", href: "/products" },
      { label: "Edit Product" },
    ]}
    title="Wireless Headphones"
    description="SKU: WH-1000"
    actions={<Button>Save</Button>}
  />
  <PageWrapper size="sm" card>
    <p>Form content...</p>
  </PageWrapper>
</Page>`,
	},
	// — PageWrapper —
	{
		key: "wrapper-basic",
		code: `<Page title="Settings" fullWidth>
  <PageWrapper size="sm">
    <p>Content constrained to max-w-2xl</p>
  </PageWrapper>
</Page>`,
	},
	{
		key: "wrapper-card",
		code: `<Page title="New Customer" fullWidth>
  <PageWrapper size="sm" card>
    <p>Card-styled content with border, background, and padding</p>
  </PageWrapper>
</Page>`,
	},
	{
		key: "wrapper-sizes",
		code: `<Page title="Width Comparison" fullWidth divider={false}>
  <PageWrapper size="sm">sm — max-w-2xl</PageWrapper>
  <PageWrapper size="md">md — max-w-4xl (default)</PageWrapper>
  <PageWrapper size="lg">lg — max-w-6xl</PageWrapper>
  <PageWrapper size="full">full — no max-width</PageWrapper>
</Page>`,
	},
	{
		key: "wrapper-composed",
		code: `<Page
  title="Product Details"
  breadcrumbs={[
    { label: "Products", href: "/products", icon: Package },
    { label: "Wireless Headphones" },
  ]}
  primaryAction={<Button>Save</Button>}
  fullWidth
>
  <PageWrapper size="sm" card>
    <PageSection title="General" description="Basic product info">
      <p>Form fields here...</p>
    </PageSection>
  </PageWrapper>
</Page>`,
	},
] as const

const highlightedPromise = highlightExamples(examples as any)

/* ------------------------------------------------------------------ */
/*  TOC                                                                */
/* ------------------------------------------------------------------ */

const toc = [
	{ id: "page-examples", title: "Page" },
	{ id: "breadcrumbs", title: "Breadcrumbs" },
	{ id: "metadata", title: "Metadata" },
	{ id: "width-variants", title: "Width Variants" },
	{ id: "page-section", title: "PageSection" },
	{ id: "page-header", title: "PageHeader" },
	{ id: "page-wrapper", title: "PageWrapper" },
	{ id: "composition", title: "Composition" },
	{ id: "page-props", title: "Page Props" },
	{ id: "section-props", title: "PageSection Props" },
	{ id: "header-props", title: "PageHeader Props" },
	{ id: "wrapper-props", title: "PageWrapper Props" },
	{ id: "related", title: "Related" },
]

/* ------------------------------------------------------------------ */
/*  Props tables                                                       */
/* ------------------------------------------------------------------ */

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
		type: "React.ReactNode | BreadcrumbConfig | PageBreadcrumbItem[]",
		description:
			"Breadcrumb navigation. Accepts a ReactNode, a BreadcrumbConfig object, or a PageBreadcrumbItem[] array where the last item without href automatically becomes the page title.",
	},
	{
		name: "titleMetadata",
		type: "React.ReactNode",
		description:
			"Inline metadata displayed next to the title or breadcrumb title (e.g., status badge).",
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
		description: "When true, uses a narrower max-width (max-w-3xl instead of max-w-5xl).",
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

const pageHeaderProps: DocProp[] = [
	{
		name: "breadcrumbs",
		type: "BreadcrumbItemType[]",
		description:
			"Array of breadcrumb items. Each item has a label and optional href. The last item (no href) renders as current page.",
	},
	{
		name: "title",
		type: "string",
		description: "The page title.",
	},
	{
		name: "description",
		type: "string",
		description: "Description text below the title.",
	},
	{
		name: "actions",
		type: "React.ReactNode",
		description: "Action buttons displayed on the right side of the title row.",
	},
	{
		name: "className",
		type: "string",
		description: "Additional CSS classes.",
	},
]

const pageWrapperProps: DocProp[] = [
	{
		name: "size",
		type: '"sm" | "md" | "lg" | "full"',
		default: '"md"',
		description:
			"Max-width preset. sm = max-w-2xl, md = max-w-4xl, lg = max-w-6xl, full = no constraint.",
	},
	{
		name: "card",
		type: "boolean",
		default: "false",
		description: "Adds background, border, border-radius, and padding for a card look.",
	},
	{
		name: "className",
		type: "string",
		description: "Additional CSS classes.",
	},
	{
		name: "children",
		type: "React.ReactNode",
		description: "The content to constrain.",
	},
]

/* ------------------------------------------------------------------ */
/*  Render                                                             */
/* ------------------------------------------------------------------ */

export default function PageComponentPage() {
	const highlighted = use(highlightedPromise)
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="Page"
			subtitle="A page-level layout container with header, breadcrumbs, actions, and composable sub-components (PageSection, PageWrapper)."
			toc={toc}
		>
			{/* ============================================================ */}
			{/*  PAGE — basics                                               */}
			{/* ============================================================ */}
			<DocSection id="page-examples" title="Page">
				<DocExampleClient
					title="Basic"
					description="A page with just a title."
					code={examples[0].code}
					highlightedCode={html("basic")}
				>
					<div className="rounded-lg border border-edge bg-muted">
						<Page title="Products">
							<p className="text-sm text-fg-muted">Page content here</p>
						</Page>
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="With Subtitle"
					description="A page with a title and subtitle."
					code={examples[1].code}
					highlightedCode={html("with-subtitle")}
				>
					<div className="rounded-lg border border-edge bg-muted">
						<Page title="Products" subtitle="Manage your product catalog">
							<p className="text-sm text-fg-muted">Page content here</p>
						</Page>
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="With Actions"
					description="A page with primary and secondary action buttons."
					code={examples[2].code}
					highlightedCode={html("with-actions")}
				>
					<div className="rounded-lg border border-edge bg-muted">
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
				</DocExampleClient>
			</DocSection>

			{/* ============================================================ */}
			{/*  BREADCRUMBS                                                 */}
			{/* ============================================================ */}
			<DocSection id="breadcrumbs" title="Breadcrumbs">
				<DocExampleClient
					title="Array of items"
					description="Pass an array of breadcrumb items. The last item without href becomes the page title automatically. The first item's icon morphs into a back arrow on hover."
					code={examples[3].code}
					highlightedCode={html("breadcrumbs-array")}
				>
					<div className="rounded-lg border border-edge bg-muted">
						<Page
							breadcrumbs={[
								{ label: "Products", href: "/products", icon: Package },
								{ label: "Wireless Headphones" },
							]}
							subtitle="SKU: WH-1000"
							primaryAction={<Button size="sm">Save</Button>}
						>
							<p className="text-sm text-fg-muted">Page content here</p>
						</Page>
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Config object"
					description="Pass a BreadcrumbConfig object to render breadcrumb navigation in place of the title."
					code={examples[4].code}
					highlightedCode={html("breadcrumbs-object")}
				>
					<div className="rounded-lg border border-edge bg-muted">
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
				</DocExampleClient>

				<DocExampleClient
					title="With parent step"
					description="Add a parent step that truncates to save space. Hover to reveal the full text."
					code={examples[5].code}
					highlightedCode={html("breadcrumbs-parent")}
				>
					<div className="rounded-lg border border-edge bg-muted">
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
				</DocExampleClient>
			</DocSection>

			{/* ============================================================ */}
			{/*  METADATA                                                    */}
			{/* ============================================================ */}
			<DocSection id="metadata" title="Metadata">
				<DocExampleClient
					title="Title Metadata"
					description="Combine breadcrumbs with titleMetadata to display a badge inline next to the title."
					code={examples[6].code}
					highlightedCode={html("title-metadata")}
				>
					<div className="rounded-lg border border-edge bg-muted">
						<Page
							narrowWidth
							breadcrumbs={{
								backHref: "/products",
								backIcon: Tag,
								title: "Wireless Headphones",
							}}
							titleMetadata={<Badge variant="outline">Active</Badge>}
							primaryAction={<Button size="sm">Save</Button>}
						>
							<p className="text-sm text-fg-muted">Page content here</p>
						</Page>
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Additional Metadata"
					description="Use additionalMetadata to display contextual information below the title row."
					code={examples[7].code}
					highlightedCode={html("additional-metadata")}
				>
					<div className="rounded-lg border border-edge bg-muted">
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
				</DocExampleClient>

				<DocExampleClient
					title="Tabs in Metadata"
					description="additionalMetadata can also be used for tabs or filters below the header."
					code={examples[8].code}
					highlightedCode={html("metadata-tabs")}
				>
					<div className="rounded-lg border border-edge bg-muted">
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
				</DocExampleClient>
			</DocSection>

			{/* ============================================================ */}
			{/*  WIDTH VARIANTS                                              */}
			{/* ============================================================ */}
			<DocSection id="width-variants" title="Width Variants">
				<DocExampleClient
					title="Full Width"
					description="Spans the full viewport width without max-width constraint."
					code={examples[9].code}
					highlightedCode={html("full-width")}
				>
					<div className="rounded-lg border border-edge bg-muted">
						<Page title="Dashboard" fullWidth>
							<p className="text-sm text-fg-muted">Full width content</p>
						</Page>
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Narrow Width"
					description="A narrower max-width (max-w-3xl), ideal for forms and settings."
					code={examples[10].code}
					highlightedCode={html("narrow-width")}
				>
					<div className="rounded-lg border border-edge bg-muted">
						<Page title="Settings" narrowWidth>
							<p className="text-sm text-fg-muted">Narrow content for forms</p>
						</Page>
					</div>
				</DocExampleClient>
			</DocSection>

			{/* ============================================================ */}
			{/*  PAGESECTION                                                 */}
			{/* ============================================================ */}
			<DocSection id="page-section" title="PageSection">
				<DocExampleClient
					title="Sections"
					description="Use PageSection to organize content into titled sub-sections within a page."
					code={examples[11].code}
					highlightedCode={html("page-section")}
				>
					<div className="rounded-lg border border-edge bg-muted">
						<Page title="Settings">
							<div className="space-y-8">
								<PageSection title="General" description="Basic settings for your store">
									<p className="text-sm text-fg-muted">General settings content</p>
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
				</DocExampleClient>
			</DocSection>

			{/* ============================================================ */}
			{/*  PAGEHEADER (standalone pattern)                             */}
			{/* ============================================================ */}
			<DocSection id="page-header" title="PageHeader">
				<p className="text-sm text-fg-muted mb-6">
					Standalone header pattern from <code className="text-xs bg-muted px-1.5 py-0.5 rounded">@blazz/ui/components/patterns/page-header-shell</code>. Use it when you need a header outside of Page, or when you want full control over the header layout separately from the content area.
				</p>

				<DocExampleClient
					title="Basic"
					description="A standalone PageHeader with title, description, and actions."
					code={examples[12].code}
					highlightedCode={html("header-basic")}
				>
					<div className="rounded-lg border border-edge bg-muted">
						<PageHeader
							title="Products"
							description="Manage your product catalog"
							actions={<Button size="sm">Add product</Button>}
						/>
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="With Breadcrumbs"
					description="Pass an array of breadcrumb items. The last item without href renders as current page."
					code={examples[13].code}
					highlightedCode={html("header-breadcrumbs")}
				>
					<div className="rounded-lg border border-edge bg-muted">
						<PageHeader
							breadcrumbs={[
								{ label: "Home", href: "/" },
								{ label: "Products", href: "/products" },
								{ label: "Wireless Headphones" },
							]}
							title="Wireless Headphones"
							actions={<Button size="sm">Save</Button>}
						/>
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Inside a Page"
					description="Combine a headless Page (no title, divider=false) with a standalone PageHeader for full layout control."
					code={examples[14].code}
					highlightedCode={html("header-in-page")}
				>
					<div className="rounded-lg border border-edge bg-muted">
						<Page fullWidth divider={false}>
							<PageHeader
								breadcrumbs={[
									{ label: "Products", href: "/products" },
									{ label: "Edit Product" },
								]}
								title="Wireless Headphones"
								description="SKU: WH-1000"
								actions={<Button size="sm">Save</Button>}
							/>
							<PageWrapper size="sm" card>
								<p className="text-sm text-fg-muted">Form content...</p>
							</PageWrapper>
						</Page>
					</div>
				</DocExampleClient>
			</DocSection>

			{/* ============================================================ */}
			{/*  PAGEWRAPPER                                                 */}
			{/* ============================================================ */}
			<DocSection id="page-wrapper" title="PageWrapper">
				<DocExampleClient
					title="Basic"
					description="Constrains content width inside a fullWidth page. Here size='sm' caps at max-w-2xl."
					code={examples[12].code}
					highlightedCode={html("wrapper-basic")}
				>
					<div className="rounded-lg border border-edge bg-muted">
						<Page title="Settings" fullWidth>
							<PageWrapper size="sm">
								<p className="text-sm text-fg-muted">
									Content constrained to max-w-2xl
								</p>
							</PageWrapper>
						</Page>
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Card mode"
					description="Add card=true for background, border, and padding — ideal for form containers."
					code={examples[13].code}
					highlightedCode={html("wrapper-card")}
				>
					<div className="rounded-lg border border-edge bg-muted">
						<Page title="New Customer" fullWidth>
							<PageWrapper size="sm" card>
								<p className="text-sm text-fg-muted">
									Card-styled content with border, background, and padding
								</p>
							</PageWrapper>
						</Page>
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Size comparison"
					description="Visual comparison of all four size presets."
					code={examples[14].code}
					highlightedCode={html("wrapper-sizes")}
				>
					<div className="rounded-lg border border-edge bg-muted">
						<Page title="Width Comparison" fullWidth divider={false}>
							<div className="space-y-3">
								<PageWrapper size="sm">
									<div className="rounded border border-dashed border-edge px-3 py-2 text-xs text-fg-muted">
										sm — max-w-2xl
									</div>
								</PageWrapper>
								<PageWrapper size="md">
									<div className="rounded border border-dashed border-edge px-3 py-2 text-xs text-fg-muted">
										md — max-w-4xl (default)
									</div>
								</PageWrapper>
								<PageWrapper size="lg">
									<div className="rounded border border-dashed border-edge px-3 py-2 text-xs text-fg-muted">
										lg — max-w-6xl
									</div>
								</PageWrapper>
								<PageWrapper size="full">
									<div className="rounded border border-dashed border-edge px-3 py-2 text-xs text-fg-muted">
										full — no max-width
									</div>
								</PageWrapper>
							</div>
						</Page>
					</div>
				</DocExampleClient>
			</DocSection>

			{/* ============================================================ */}
			{/*  COMPOSITION                                                 */}
			{/* ============================================================ */}
			<DocSection id="composition" title="Composition">
				<DocExampleClient
					title="Page + PageWrapper + PageSection"
					description="Full composition: a fullWidth page with breadcrumbs, actions, a card-wrapped form area, and sections inside."
					code={examples[15].code}
					highlightedCode={html("wrapper-composed")}
				>
					<div className="rounded-lg border border-edge bg-muted">
						<Page
							title="Product Details"
							breadcrumbs={[
								{ label: "Products", href: "/products", icon: Package },
								{ label: "Wireless Headphones" },
							]}
							primaryAction={<Button size="sm">Save</Button>}
							fullWidth
						>
							<PageWrapper size="sm" card>
								<PageSection title="General" description="Basic product info">
									<p className="text-sm text-fg-muted">Form fields here...</p>
								</PageSection>
							</PageWrapper>
						</Page>
					</div>
				</DocExampleClient>
			</DocSection>

			{/* ============================================================ */}
			{/*  PROPS TABLES                                                */}
			{/* ============================================================ */}
			<DocSection id="page-props" title="Page Props">
				<DocPropsTable props={pageProps} />
			</DocSection>

			<DocSection id="section-props" title="PageSection Props">
				<DocPropsTable props={pageSectionProps} />
			</DocSection>

			<DocSection id="wrapper-props" title="PageWrapper Props">
				<DocPropsTable props={pageWrapperProps} />
			</DocSection>

			{/* ============================================================ */}
			{/*  RELATED                                                     */}
			{/* ============================================================ */}
			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{
							title: "PageHeaderShell",
							href: "/docs/components/patterns/page-header-shell",
							description: "A standalone page header pattern with breadcrumbs, title, and actions.",
						},
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
