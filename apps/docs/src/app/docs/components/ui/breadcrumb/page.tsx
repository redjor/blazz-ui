"use client"

import {
	Breadcrumb,
	BreadcrumbBackLink,
	BreadcrumbPage as BreadcrumbCurrent,
	BreadcrumbEllipsis,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
} from "@blazz/ui/components/ui/breadcrumb"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@blazz/ui/components/ui/dropdown-menu"
import { Home, Slash } from "lucide-react"
import { use } from "react"
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
		code: `<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink href="/products">Products</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbCurrent>Current Page</BreadcrumbCurrent>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>`,
	},
	{
		key: "custom-separator",
		code: `<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator>
      <Slash />
    </BreadcrumbSeparator>
    <BreadcrumbItem>
      <BreadcrumbLink href="/docs">Docs</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator>
      <Slash />
    </BreadcrumbSeparator>
    <BreadcrumbItem>
      <BreadcrumbCurrent>Components</BreadcrumbCurrent>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>`,
	},
	{
		key: "with-dropdown",
		code: `<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <button className="flex items-center gap-1 hover:text-fg">
              <BreadcrumbEllipsis />
            </button>
          }
        />
        <DropdownMenuContent align="start">
          <DropdownMenuGroup>
            <DropdownMenuItem>Documentation</DropdownMenuItem>
            <DropdownMenuItem>Components</DropdownMenuItem>
            <DropdownMenuItem>Examples</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbCurrent>Breadcrumb</BreadcrumbCurrent>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>`,
	},
	{
		key: "with-icon",
		code: `<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbBackLink href="/" icon={Home}>
        Home
      </BreadcrumbBackLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink href="/products">Products</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbCurrent>Electronics</BreadcrumbCurrent>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>`,
	},
] as const

const highlightedPromise = highlightExamples(examples as any)

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "props", title: "Props" },
	{ id: "design-tokens", title: "Design Tokens" },
	{ id: "best-practices", title: "Best Practices" },
	{ id: "accessibility", title: "Accessibility" },
	{ id: "related", title: "Related" },
]

const breadcrumbProps: DocProp[] = [
	{
		name: "separator",
		type: "React.ReactNode",
		description: "Custom separator to use between breadcrumb items.",
	},
]

export default function BreadcrumbPage() {
	const highlighted = use(highlightedPromise)
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage title="Breadcrumb" subtitle="Displays the path to the current location within a hierarchical structure." toc={toc}>
			<DocHero>
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink href="/">Home</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbLink href="/products">Products</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbCurrent>Current Page</BreadcrumbCurrent>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExampleClient title="Basic Breadcrumb" description="A simple breadcrumb navigation showing the current path." code={examples[0].code} highlightedCode={html("basic")}>
					<Breadcrumb>
						<BreadcrumbList>
							<BreadcrumbItem>
								<BreadcrumbLink href="/">Home</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<BreadcrumbLink href="/products">Products</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<BreadcrumbCurrent>Current Page</BreadcrumbCurrent>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
				</DocExampleClient>

				<DocExampleClient title="Custom Separator" description="Use a custom separator between breadcrumb items." code={examples[1].code} highlightedCode={html("custom-separator")}>
					<Breadcrumb>
						<BreadcrumbList>
							<BreadcrumbItem>
								<BreadcrumbLink href="/">Home</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator>
								<Slash />
							</BreadcrumbSeparator>
							<BreadcrumbItem>
								<BreadcrumbLink href="/docs">Docs</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator>
								<Slash />
							</BreadcrumbSeparator>
							<BreadcrumbItem>
								<BreadcrumbCurrent>Components</BreadcrumbCurrent>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
				</DocExampleClient>

				<DocExampleClient title="With Dropdown Menu" description="Use a dropdown menu to collapse intermediate items." code={examples[2].code} highlightedCode={html("with-dropdown")}>
					<Breadcrumb>
						<BreadcrumbList>
							<BreadcrumbItem>
								<BreadcrumbLink href="/">Home</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<DropdownMenu>
									<DropdownMenuTrigger
										render={
											<button type="button" className="flex items-center gap-1 hover:text-fg">
												<BreadcrumbEllipsis />
											</button>
										}
									/>
									<DropdownMenuContent align="start">
										<DropdownMenuGroup>
											<DropdownMenuItem>Documentation</DropdownMenuItem>
											<DropdownMenuItem>Components</DropdownMenuItem>
											<DropdownMenuItem>Examples</DropdownMenuItem>
										</DropdownMenuGroup>
									</DropdownMenuContent>
								</DropdownMenu>
							</BreadcrumbItem>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<BreadcrumbCurrent>Breadcrumb</BreadcrumbCurrent>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
				</DocExampleClient>

				<DocExampleClient title="With Icon" description="Use BreadcrumbBackLink with an icon. On hover, the icon morphs into a back arrow." code={examples[3].code} highlightedCode={html("with-icon")}>
					<Breadcrumb>
						<BreadcrumbList>
							<BreadcrumbItem>
								<BreadcrumbBackLink href="/" icon={Home}>
									Home
								</BreadcrumbBackLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<BreadcrumbLink href="/products">Products</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<BreadcrumbCurrent>Electronics</BreadcrumbCurrent>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
				</DocExampleClient>
			</DocSection>

			<DocSection id="props" title="Props">
				<DocPropsTable props={breadcrumbProps} />
			</DocSection>

			<DocSection id="design-tokens" title="Design Tokens">
				<p className="text-sm text-fg-muted">Breadcrumb uses the design system tokens for consistent styling:</p>
				<ul className="list-inside list-disc space-y-2 text-sm text-fg-muted">
					<li>
						<code className="text-xs">text-fg-muted</code> - Breadcrumb link color
					</li>
					<li>
						<code className="text-xs">text-fg</code> - Current page and hover color
					</li>
					<li>
						<code className="text-xs">gap-1.5</code> - Spacing between items (0.375rem)
					</li>
					<li>
						<code className="text-xs">text-body-md</code> - Body medium text size
					</li>
					<li>
						<code className="text-xs">font-semibold</code> - Current page font weight
					</li>
					<li>
						<code className="text-xs">text-lg</code> - Current page larger size
					</li>
				</ul>
			</DocSection>

			<DocSection id="best-practices" title="Best Practices">
				<ul className="list-disc list-inside space-y-2 text-fg-muted">
					<li>Always make the current page non-interactive (use BreadcrumbCurrent)</li>
					<li>Use breadcrumbs for hierarchical navigation with 2+ levels</li>
					<li>Keep breadcrumb labels concise (1-2 words when possible)</li>
					<li>Use ellipsis with dropdown for paths longer than 4 levels</li>
					<li>Place breadcrumbs at the top of the page, below the header</li>
					<li>Ensure all links are accessible and keyboard navigable</li>
					<li>The first item is typically "Home" or the root section</li>
					<li>Use consistent separators throughout your application</li>
				</ul>
			</DocSection>

			<DocSection id="accessibility" title="Accessibility">
				<ul className="list-disc list-inside space-y-2 text-fg-muted">
					<li>
						Uses semantic <code className="text-xs">&lt;nav&gt;</code> element with aria-label="breadcrumb"
					</li>
					<li>
						Current page marked with <code className="text-xs">aria-current="page"</code>
					</li>
					<li>
						Separators have <code className="text-xs">aria-hidden="true"</code> to avoid screen reader verbosity
					</li>
					<li>All links are keyboard accessible with standard tab navigation</li>
					<li>Provides clear visual feedback on hover and focus states</li>
				</ul>
			</DocSection>

			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{
							title: "Dropdown Menu",
							href: "/docs/components/ui/dropdown-menu",
							description: "Use with ellipsis for collapsing long breadcrumb paths.",
						},
						{
							title: "Tabs",
							href: "/docs/components/ui/tabs",
							description: "Alternative navigation pattern for switching between views.",
						},
					]}
				/>
			</DocSection>
		</DocPage>
	)
}
