"use client"

import * as React from "react"
import { cn } from "@blazz/ui"

export interface PageProps {
	/** Slot above the header — breadcrumbs, back link */
	top?: React.ReactNode
	/** Header slot — typically a <PageHeader /> */
	header?: React.ReactNode
	/** Shows a divider line between the header and content @default true */
	separator?: boolean
	/** Slot between header and content (e.g. NavTabs) — full-width, no padding */
	nav?: React.ReactNode
	/** Custom className for the page container */
	className?: string
	/** Custom className for the header area */
	headerClassName?: string
	/** Custom className for the content area */
	contentClassName?: string
	/** Page content */
	children?: React.ReactNode
}

/**
 * Page - Full-width page layout with top, header, nav, and content zones.
 *
 * @example
 * ```tsx
 * <Page
 *   top={<Breadcrumb>...</Breadcrumb>}
 *   header={<PageHeader title="Articles" actions={<Button>Nouveau</Button>} />}
 *   nav={<NavTabs basePath="/articles" tabs={[...]} />}
 * >
 *   <PageWrapper size="sm" card>
 *     <PageSection title="Général">...</PageSection>
 *   </PageWrapper>
 * </Page>
 * ```
 */
export function Page({
	top,
	header,
	separator = true,
	nav,
	className,
	headerClassName,
	contentClassName,
	children,
}: PageProps) {
	const hasHeader = top || header

	return (
		<div className={cn("w-full", className)}>
			{top && (
				<div className="px-4 py-2 border-b border-separator">
					{top}
				</div>
			)}

			{header && (
				<div
					className={cn(
						"px-4 py-3",
						separator && "border-b border-separator",
						headerClassName
					)}
				>
					{header}
				</div>
			)}

			{nav && <div className="border-b border-separator">{nav}</div>}

			{children && <div className={cn("p-4", contentClassName)}>{children}</div>}
		</div>
	)
}

/**
 * PageWrapper - Constrains content width and optionally adds a card-like background + border.
 *
 * @example
 * ```tsx
 * <Page header={<PageHeader title="Nouveau client" />}>
 *   <PageWrapper size="sm" card>
 *     <CustomerForm />
 *   </PageWrapper>
 * </Page>
 * ```
 */
export interface PageWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
	/** Max-width preset @default 'md' */
	size?: "sm" | "md" | "lg" | "full"
	/** Add background, border, and padding (card look) @default false */
	card?: boolean
}

const sizeMap = {
	sm: "max-w-2xl",
	md: "max-w-4xl",
	lg: "max-w-6xl",
	full: "",
} as const

export const PageWrapper = React.forwardRef<HTMLDivElement, PageWrapperProps>(
	({ size = "md", card = false, className, children, ...props }, ref) => {
		return (
			<div
				ref={ref}
				className={cn(
					"mx-auto",
					sizeMap[size],
					card && "rounded-lg border border-edge bg-surface p-6",
					className
				)}
				{...props}
			>
				{children}
			</div>
		)
	}
)

PageWrapper.displayName = "PageWrapper"

/**
 * PageSection - A sub-section within a page
 */
export interface PageSectionProps extends React.HTMLAttributes<HTMLElement> {
	title?: string
	description?: string
}

export const PageSection = React.forwardRef<HTMLElement, PageSectionProps>(
	({ title, description, className, children, ...props }, ref) => {
		return (
			<section ref={ref} className={cn("space-y-4", className)} {...props}>
				{(title || description) && (
					<div className="space-y-1">
						{title && <h2 className="text-heading-lg tracking-tight">{title}</h2>}
						{description && <p className="text-body-md text-fg-muted">{description}</p>}
					</div>
				)}
				{children}
			</section>
		)
	}
)

PageSection.displayName = "PageSection"
