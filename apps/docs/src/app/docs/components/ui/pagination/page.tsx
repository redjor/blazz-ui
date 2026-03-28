"use client"

import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@blazz/ui/components/ui/pagination"
import * as React from "react"
import { use } from "react"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { type DocProp, DocPropsTable } from "~/components/docs/doc-props-table"
import { DocRelated } from "~/components/docs/doc-related"
import { DocSection } from "~/components/docs/doc-section"
import { highlightExamples } from "~/lib/highlight-examples"

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "props", title: "Props" },
	{ id: "guidelines", title: "Guidelines" },
	{ id: "related", title: "Related" },
]

const paginationLinkProps: DocProp[] = [
	{
		name: "isActive",
		type: "boolean",
		default: "false",
		description: "Whether this page link represents the current page.",
	},
]

const examples = [
	{
		key: "basic",
		code: `<Pagination>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious />
    </PaginationItem>
    <PaginationItem>
      <PaginationLink>1</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationLink>2</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationLink>3</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationNext />
    </PaginationItem>
  </PaginationContent>
</Pagination>`,
	},
	{
		key: "active",
		code: `<PaginationLink isActive>2</PaginationLink>`,
	},
	{
		key: "ellipsis",
		code: `<Pagination>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious />
    </PaginationItem>
    <PaginationItem>
      <PaginationLink>1</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationEllipsis />
    </PaginationItem>
    <PaginationItem>
      <PaginationLink>4</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationLink isActive>5</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationLink>6</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationEllipsis />
    </PaginationItem>
    <PaginationItem>
      <PaginationLink>20</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationNext />
    </PaginationItem>
  </PaginationContent>
</Pagination>`,
	},
	{
		key: "controlled",
		code: `const [currentPage, setCurrentPage] = React.useState(1)
const totalPages = 10

<Pagination>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious
        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
        disabled={currentPage === 1}
      />
    </PaginationItem>
    {/* ... page links ... */}
    <PaginationItem>
      <PaginationNext
        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
        disabled={currentPage === totalPages}
      />
    </PaginationItem>
  </PaginationContent>
</Pagination>`,
	},
] as const

const highlightedPromise = highlightExamples(examples as any)

function ControlledPaginationDemo() {
	const [currentPage, setCurrentPage] = React.useState(1)
	const totalPages = 10

	const getVisiblePages = () => {
		if (totalPages <= 7) {
			return Array.from({ length: totalPages }, (_, i) => i + 1)
		}

		if (currentPage <= 3) return [1, 2, 3, 4, 5]
		if (currentPage >= totalPages - 2) return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]

		return [currentPage - 1, currentPage, currentPage + 1]
	}

	const visiblePages = getVisiblePages()
	const showStartEllipsis = visiblePages[0] > 2
	const showEndEllipsis = visiblePages[visiblePages.length - 1] < totalPages - 1

	return (
		<div className="space-y-3">
			<Pagination>
				<PaginationContent>
					<PaginationItem>
						<PaginationPrevious onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} />
					</PaginationItem>

					{visiblePages[0] > 1 && (
						<PaginationItem>
							<PaginationLink onClick={() => setCurrentPage(1)}>1</PaginationLink>
						</PaginationItem>
					)}

					{showStartEllipsis && (
						<PaginationItem>
							<PaginationEllipsis />
						</PaginationItem>
					)}

					{visiblePages.map((page) => (
						<PaginationItem key={page}>
							<PaginationLink isActive={page === currentPage} onClick={() => setCurrentPage(page)}>
								{page}
							</PaginationLink>
						</PaginationItem>
					))}

					{showEndEllipsis && (
						<PaginationItem>
							<PaginationEllipsis />
						</PaginationItem>
					)}

					{visiblePages[visiblePages.length - 1] < totalPages && (
						<PaginationItem>
							<PaginationLink onClick={() => setCurrentPage(totalPages)}>{totalPages}</PaginationLink>
						</PaginationItem>
					)}

					<PaginationItem>
						<PaginationNext onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} />
					</PaginationItem>
				</PaginationContent>
			</Pagination>
			<p className="text-center text-xs text-fg-muted">
				Page {currentPage} of {totalPages}
			</p>
		</div>
	)
}

export default function PaginationPage() {
	const highlighted = use(highlightedPromise)
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage title="Pagination" subtitle="A composable pagination component for navigating between pages of content. Built with accessible navigation semantics." toc={toc}>
			{/* Hero */}
			<DocHero>
				<Pagination>
					<PaginationContent>
						<PaginationItem>
							<PaginationPrevious />
						</PaginationItem>
						<PaginationItem>
							<PaginationLink>1</PaginationLink>
						</PaginationItem>
						<PaginationItem>
							<PaginationLink isActive>2</PaginationLink>
						</PaginationItem>
						<PaginationItem>
							<PaginationLink>3</PaginationLink>
						</PaginationItem>
						<PaginationItem>
							<PaginationLink>4</PaginationLink>
						</PaginationItem>
						<PaginationItem>
							<PaginationLink>5</PaginationLink>
						</PaginationItem>
						<PaginationItem>
							<PaginationEllipsis />
						</PaginationItem>
						<PaginationItem>
							<PaginationLink>10</PaginationLink>
						</PaginationItem>
						<PaginationItem>
							<PaginationNext />
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			</DocHero>

			{/* Examples */}
			<DocSection id="examples" title="Examples">
				<DocExampleClient title="Basic" description="A simple pagination with page numbers." code={examples[0].code} highlightedCode={html("basic")}>
					<Pagination>
						<PaginationContent>
							<PaginationItem>
								<PaginationPrevious />
							</PaginationItem>
							<PaginationItem>
								<PaginationLink>1</PaginationLink>
							</PaginationItem>
							<PaginationItem>
								<PaginationLink>2</PaginationLink>
							</PaginationItem>
							<PaginationItem>
								<PaginationLink>3</PaginationLink>
							</PaginationItem>
							<PaginationItem>
								<PaginationNext />
							</PaginationItem>
						</PaginationContent>
					</Pagination>
				</DocExampleClient>

				<DocExampleClient title="Active Page" description="Highlight the currently active page." code={examples[1].code} highlightedCode={html("active")}>
					<Pagination>
						<PaginationContent>
							<PaginationItem>
								<PaginationPrevious />
							</PaginationItem>
							<PaginationItem>
								<PaginationLink>1</PaginationLink>
							</PaginationItem>
							<PaginationItem>
								<PaginationLink isActive>2</PaginationLink>
							</PaginationItem>
							<PaginationItem>
								<PaginationLink>3</PaginationLink>
							</PaginationItem>
							<PaginationItem>
								<PaginationNext />
							</PaginationItem>
						</PaginationContent>
					</Pagination>
				</DocExampleClient>

				<DocExampleClient title="With Ellipsis" description="Use ellipsis to indicate skipped page ranges." code={examples[2].code} highlightedCode={html("ellipsis")}>
					<Pagination>
						<PaginationContent>
							<PaginationItem>
								<PaginationPrevious />
							</PaginationItem>
							<PaginationItem>
								<PaginationLink>1</PaginationLink>
							</PaginationItem>
							<PaginationItem>
								<PaginationEllipsis />
							</PaginationItem>
							<PaginationItem>
								<PaginationLink>4</PaginationLink>
							</PaginationItem>
							<PaginationItem>
								<PaginationLink isActive>5</PaginationLink>
							</PaginationItem>
							<PaginationItem>
								<PaginationLink>6</PaginationLink>
							</PaginationItem>
							<PaginationItem>
								<PaginationEllipsis />
							</PaginationItem>
							<PaginationItem>
								<PaginationLink>20</PaginationLink>
							</PaginationItem>
							<PaginationItem>
								<PaginationNext />
							</PaginationItem>
						</PaginationContent>
					</Pagination>
				</DocExampleClient>

				<DocExampleClient title="Controlled" description="Manage current page state with click handlers." code={examples[3].code} highlightedCode={html("controlled")}>
					<ControlledPaginationDemo />
				</DocExampleClient>
			</DocSection>

			{/* Props */}
			<DocSection id="props" title="PaginationLink Props">
				<DocPropsTable props={paginationLinkProps} />
			</DocSection>

			{/* Guidelines */}
			<DocSection id="guidelines" title="Guidelines">
				<ul className="list-inside list-disc space-y-2 text-sm text-fg-muted">
					<li>Use ellipsis to truncate large page ranges</li>
					<li>Disable Previous on the first page and Next on the last page</li>
					<li>Show the first and last page numbers for orientation</li>
					<li>Highlight the active page to indicate current position</li>
					<li>Consider the DataTable component for paginated table data</li>
				</ul>
			</DocSection>

			{/* Related */}
			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{
							title: "Button",
							href: "/docs/components/ui/button",
							description: "Interactive button element for triggering actions.",
						},
					]}
				/>
			</DocSection>
		</DocPage>
	)
}
