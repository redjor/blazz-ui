import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from "lucide-react"
import type * as React from "react"
import { cn } from "../../lib/utils"

/* ---------------------------------------------------------------------------
 * Pagination container
 * --------------------------------------------------------------------------- */

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
	return (
		<nav
			aria-label="Pagination"
			data-slot="pagination"
			className={cn("flex items-center justify-center", className)}
			{...props}
		/>
	)
}

function PaginationContent({ className, ...props }: React.ComponentProps<"ul">) {
	return (
		<ul
			data-slot="pagination-content"
			className={cn("flex items-center gap-1", className)}
			{...props}
		/>
	)
}

function PaginationItem({ className, ...props }: React.ComponentProps<"li">) {
	return <li data-slot="pagination-item" className={cn("", className)} {...props} />
}

/* ---------------------------------------------------------------------------
 * Page link / button
 * --------------------------------------------------------------------------- */

export interface PaginationLinkProps extends React.ComponentProps<"button"> {
	isActive?: boolean
}

function PaginationLink({ className, isActive, ...props }: PaginationLinkProps) {
	return (
		<button
			type="button"
			data-slot="pagination-link"
			aria-current={isActive ? "page" : undefined}
			className={cn(
				"inline-flex size-8 items-center justify-center rounded-md text-sm font-medium tabular-nums",
				"transition-colors outline-none",
				"focus-visible:ring-[3px] focus-visible:ring-brand/20",
				"disabled:opacity-50 disabled:pointer-events-none",
				isActive ? "bg-brand text-brand-fg" : "text-fg-muted hover:bg-raised hover:text-fg",
				className
			)}
			{...props}
		/>
	)
}

function PaginationPrevious({ className, ...props }: React.ComponentProps<"button">) {
	return (
		<button
			type="button"
			data-slot="pagination-previous"
			aria-label="Go to previous page"
			className={cn(
				"inline-flex size-8 items-center justify-center rounded-md text-sm",
				"text-fg-muted hover:bg-raised hover:text-fg transition-colors outline-none",
				"focus-visible:ring-[3px] focus-visible:ring-brand/20",
				"disabled:opacity-50 disabled:pointer-events-none",
				className
			)}
			{...props}
		>
			<ChevronLeftIcon className="size-4" />
		</button>
	)
}

function PaginationNext({ className, ...props }: React.ComponentProps<"button">) {
	return (
		<button
			type="button"
			data-slot="pagination-next"
			aria-label="Go to next page"
			className={cn(
				"inline-flex size-8 items-center justify-center rounded-md text-sm",
				"text-fg-muted hover:bg-raised hover:text-fg transition-colors outline-none",
				"focus-visible:ring-[3px] focus-visible:ring-brand/20",
				"disabled:opacity-50 disabled:pointer-events-none",
				className
			)}
			{...props}
		>
			<ChevronRightIcon className="size-4" />
		</button>
	)
}

function PaginationEllipsis({ className, ...props }: React.ComponentProps<"span">) {
	return (
		<span
			data-slot="pagination-ellipsis"
			aria-hidden
			className={cn("inline-flex size-8 items-center justify-center text-fg-muted", className)}
			{...props}
		>
			<MoreHorizontalIcon className="size-4" />
		</span>
	)
}

export {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationPrevious,
	PaginationNext,
	PaginationEllipsis,
}
