"use client"

import * as React from "react"
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationPrevious,
	PaginationNext,
	PaginationEllipsis,
} from "@blazz/ui/components/ui/pagination"

export function ControlledPaginationDemo() {
	const [currentPage, setCurrentPage] = React.useState(1)
	const totalPages = 10

	const getVisiblePages = () => {
		if (totalPages <= 7) {
			return Array.from({ length: totalPages }, (_, i) => i + 1)
		}

		if (currentPage <= 3) return [1, 2, 3, 4, 5]
		if (currentPage >= totalPages - 2)
			return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]

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
						<PaginationPrevious
							onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
							disabled={currentPage === 1}
						/>
					</PaginationItem>

					{visiblePages[0] > 1 && (
						<PaginationItem>
							<PaginationLink onClick={() => setCurrentPage(1)}>
								1
							</PaginationLink>
						</PaginationItem>
					)}

					{showStartEllipsis && (
						<PaginationItem>
							<PaginationEllipsis />
						</PaginationItem>
					)}

					{visiblePages.map((page) => (
						<PaginationItem key={page}>
							<PaginationLink
								isActive={page === currentPage}
								onClick={() => setCurrentPage(page)}
							>
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
							<PaginationLink onClick={() => setCurrentPage(totalPages)}>
								{totalPages}
							</PaginationLink>
						</PaginationItem>
					)}

					<PaginationItem>
						<PaginationNext
							onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
							disabled={currentPage === totalPages}
						/>
					</PaginationItem>
				</PaginationContent>
			</Pagination>
			<p className="text-center text-xs text-fg-muted">
				Page {currentPage} of {totalPages}
			</p>
		</div>
	)
}
