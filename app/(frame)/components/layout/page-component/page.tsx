"use client"

import { Page, PageSection } from "@/components/ui/page"
import { Button } from "@/components/ui/button"
import { ComponentExample } from "@/components/features/docs/component-example"
import { PropsTable, type PropDefinition } from "@/components/features/docs/props-table"

const pageProps: PropDefinition[] = [
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
		type: "React.ReactNode",
		description: "Breadcrumb navigation displayed above the title.",
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

const pageSectionProps: PropDefinition[] = [
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
		<Page
			title="Page"
			subtitle="A container component for page-level layout with title, actions, and breadcrumbs."
		>
			<div className="space-y-10">
				<section className="space-y-6">
					<h2 className="text-lg font-semibold">Examples</h2>

					<ComponentExample
						title="Basic"
						description="A page with just a title."
						code={`<Page title="Products">
  <p>Page content here</p>
</Page>`}
					>
						<div className="rounded-lg border bg-background">
							<Page title="Products">
								<p className="text-sm text-muted-foreground">Page content here</p>
							</Page>
						</div>
					</ComponentExample>

					<ComponentExample
						title="With Subtitle"
						description="A page with a title and subtitle."
						code={`<Page
  title="Products"
  subtitle="Manage your product catalog"
>
  <p>Page content here</p>
</Page>`}
					>
						<div className="rounded-lg border bg-background">
							<Page title="Products" subtitle="Manage your product catalog">
								<p className="text-sm text-muted-foreground">Page content here</p>
							</Page>
						</div>
					</ComponentExample>

					<ComponentExample
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
						<div className="rounded-lg border bg-background">
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
								<p className="text-sm text-muted-foreground">Page content here</p>
							</Page>
						</div>
					</ComponentExample>

					<ComponentExample
						title="Full Width"
						description="A page that spans the full viewport width without max-width constraint."
						code={`<Page title="Dashboard" fullWidth>
  <p>Full width content</p>
</Page>`}
					>
						<div className="rounded-lg border bg-background">
							<Page title="Dashboard" fullWidth>
								<p className="text-sm text-muted-foreground">Full width content</p>
							</Page>
						</div>
					</ComponentExample>

					<ComponentExample
						title="Narrow Width"
						description="A page with a narrower max-width, ideal for forms and settings."
						code={`<Page title="Settings" narrowWidth>
  <p>Narrow content for forms</p>
</Page>`}
					>
						<div className="rounded-lg border bg-background">
							<Page title="Settings" narrowWidth>
								<p className="text-sm text-muted-foreground">
									Narrow content for forms
								</p>
							</Page>
						</div>
					</ComponentExample>

					<ComponentExample
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
						<div className="rounded-lg border bg-background">
							<Page title="Settings">
								<div className="space-y-8">
									<PageSection
										title="General"
										description="Basic settings for your store"
									>
										<p className="text-sm text-muted-foreground">
											General settings content
										</p>
									</PageSection>
									<PageSection
										title="Notifications"
										description="Configure notification preferences"
									>
										<p className="text-sm text-muted-foreground">
											Notification settings content
										</p>
									</PageSection>
								</div>
							</Page>
						</div>
					</ComponentExample>
				</section>

				<section className="space-y-4">
					<h2 className="text-lg font-semibold">Page Props</h2>
					<PropsTable props={pageProps} />
				</section>

				<section className="space-y-4">
					<h2 className="text-lg font-semibold">PageSection Props</h2>
					<PropsTable props={pageSectionProps} />
				</section>

				<section className="space-y-4">
					<h2 className="text-lg font-semibold">Best Practices</h2>
					<ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
						<li>Use a single Page component as the root layout for each route</li>
						<li>Keep titles short and descriptive to clearly identify the page purpose</li>
						<li>Limit to one primary action per page to maintain a clear hierarchy</li>
						<li>Use narrowWidth for form-heavy pages like settings or creation flows</li>
						<li>Use PageSection to group related content within a page</li>
						<li>Use breadcrumbs for pages deeper than one level in the navigation hierarchy</li>
					</ul>
				</section>
			</div>
		</Page>
	)
}
