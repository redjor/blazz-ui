import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationPrevious,
	PaginationNext,
	PaginationEllipsis,
} from "@blazz/ui/components/ui/pagination"
import { DocPage } from "@/components/features/docs/doc-page"
import { DocSection } from "@/components/features/docs/doc-section"
import { DocHero } from "@/components/features/docs/doc-hero"
import { DocExample } from "@/components/features/docs/doc-example"
import { DocPropsTable, type DocProp } from "@/components/features/docs/doc-props-table"
import { DocRelated } from "@/components/features/docs/doc-related"
import { ControlledPaginationDemo } from "./_demos"

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

export default function PaginationPage() {
	return (
		<DocPage
			title="Pagination"
			subtitle="A composable pagination component for navigating between pages of content. Built with accessible navigation semantics."
			toc={toc}
		>
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
				<DocExample
					title="Basic"
					description="A simple pagination with page numbers."
					code={`<Pagination>
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
</Pagination>`}
				>
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
				</DocExample>

				<DocExample
					title="Active Page"
					description="Highlight the currently active page."
					code={`<PaginationLink isActive>2</PaginationLink>`}
				>
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
				</DocExample>

				<DocExample
					title="With Ellipsis"
					description="Use ellipsis to indicate skipped page ranges."
					code={`<Pagination>
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
</Pagination>`}
				>
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
				</DocExample>

				<DocExample
					title="Controlled"
					description="Manage current page state with click handlers."
					code={`const [currentPage, setCurrentPage] = React.useState(1)
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
</Pagination>`}
				>
					<ControlledPaginationDemo />
				</DocExample>
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
