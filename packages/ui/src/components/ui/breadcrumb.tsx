import { ArrowLeftIcon, ChevronRight, MoreHorizontal } from "lucide-react"
import * as React from "react"

import { cn } from "../../lib/utils"

const Breadcrumb = React.forwardRef<
	HTMLElement,
	React.ComponentPropsWithoutRef<"nav"> & {
		separator?: React.ReactNode
	}
>(({ ...props }, ref) => <nav ref={ref} aria-label="breadcrumb" {...props} />)
Breadcrumb.displayName = "Breadcrumb"

const BreadcrumbList = React.forwardRef<HTMLOListElement, React.ComponentPropsWithoutRef<"ol">>(
	({ className, ...props }, ref) => (
		<ol
			ref={ref}
			className={cn(
				"flex flex-wrap items-center gap-1.5 wrap-break-word text-body-md text-fg-muted sm:gap-2",
				className
			)}
			{...props}
		/>
	)
)
BreadcrumbList.displayName = "BreadcrumbList"

const BreadcrumbItem = React.forwardRef<HTMLLIElement, React.ComponentPropsWithoutRef<"li">>(
	({ className, ...props }, ref) => (
		<li ref={ref} className={cn("inline-flex items-center gap-1.5", className)} {...props} />
	)
)
BreadcrumbItem.displayName = "BreadcrumbItem"

const BreadcrumbLink = React.forwardRef<HTMLAnchorElement, React.ComponentPropsWithoutRef<"a">>(
	({ className, ...props }, ref) => {
		return <a ref={ref} className={cn("transition-colors hover:text-fg", className)} {...props} />
	}
)
BreadcrumbLink.displayName = "BreadcrumbLink"

const BreadcrumbPage = React.forwardRef<HTMLSpanElement, React.ComponentPropsWithoutRef<"span">>(
	({ className, ...props }, ref) => (
		<span
			ref={ref}
			aria-current="page"
			className={cn("text-fg font-semibold", className)}
			{...props}
		/>
	)
)
BreadcrumbPage.displayName = "BreadcrumbPage"

function BreadcrumbSeparator({ children, className, ...props }: React.ComponentProps<"li">) {
	return (
		<li
			role="presentation"
			aria-hidden="true"
			className={cn("[&>svg]:size-3.5", className)}
			{...props}
		>
			{children ?? <ChevronRight />}
		</li>
	)
}
BreadcrumbSeparator.displayName = "BreadcrumbSeparator"

const BreadcrumbBackLink = React.forwardRef<
	HTMLAnchorElement,
	React.ComponentPropsWithoutRef<"a"> & {
		icon: React.ComponentType<{ className?: string }>
	}
>(({ icon: Icon, className, children, ...props }, ref) => {
	return (
		<a
			ref={ref}
			className={cn(
				"group/back inline-flex items-center gap-1.5 transition-colors hover:text-fg",
				className
			)}
			{...props}
		>
			<span className="relative inline-flex size-3.5 items-center justify-center overflow-hidden">
				<Icon className="size-3.5 shrink-0 transition-all duration-200 group-hover/back:-translate-y-full group-hover/back:opacity-0" />
				<ArrowLeftIcon className="absolute size-3.5 shrink-0 translate-y-full opacity-0 transition-all duration-200 group-hover/back:translate-y-0 group-hover/back:opacity-100" />
			</span>
			{children}
		</a>
	)
})
BreadcrumbBackLink.displayName = "BreadcrumbBackLink"

function BreadcrumbEllipsis({ className, ...props }: React.ComponentProps<"span">) {
	return (
		<span
			role="presentation"
			aria-hidden="true"
			className={cn("flex h-9 w-9 items-center justify-center", className)}
			{...props}
		>
			<MoreHorizontal className="h-4 w-4" />
			<span className="sr-only">More</span>
		</span>
	)
}
BreadcrumbEllipsis.displayName = "BreadcrumbElipssis"

export {
	Breadcrumb,
	BreadcrumbList,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbBackLink,
	BreadcrumbPage,
	BreadcrumbSeparator,
	BreadcrumbEllipsis,
}
