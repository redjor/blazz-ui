import * as React from "react"
import { cn } from "@/lib/utils"

export interface PageProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
	/**
	 * The main title of the page
	 */
	title?: React.ReactNode

	/**
	 * Subtitle or description text displayed below the title
	 */
	subtitle?: React.ReactNode

	/**
	 * Primary action button(s) displayed in the header
	 */
	primaryAction?: React.ReactNode

	/**
	 * Secondary action button(s) displayed in the header
	 */
	secondaryActions?: React.ReactNode

	/**
	 * Breadcrumb navigation displayed above the title
	 */
	breadcrumbs?: React.ReactNode

	/**
	 * Additional content in the header (e.g., tabs, metadata)
	 */
	additionalMetadata?: React.ReactNode

	/**
	 * When true, removes max-width constraint and uses full viewport width
	 * @default false
	 */
	fullWidth?: boolean

	/**
	 * When true, uses a narrower max-width (max-w-4xl instead of max-w-7xl)
	 * @default false
	 */
	narrowWidth?: boolean

	/**
	 * Shows a divider line between the header and content
	 * @default true
	 */
	divider?: boolean

	/**
	 * Custom className for the page container
	 */
	className?: string

	/**
	 * Custom className for the page header
	 */
	headerClassName?: string

	/**
	 * Custom className for the page content
	 */
	contentClassName?: string
}

/**
 * Page - A container component for page-level layout
 *
 * Inspired by Shopify Polaris Page component. Provides a consistent structure
 * for pages with title, actions, breadcrumbs, and content areas.
 *
 * @example
 * ```tsx
 * // Basic page with title
 * <Page title="Products">
 *   <p>Page content here</p>
 * </Page>
 *
 * // Page with actions and breadcrumbs
 * <Page
 *   title="Product Details"
 *   subtitle="Manage your product information"
 *   breadcrumbs={<Breadcrumb />}
 *   primaryAction={<Button>Save</Button>}
 *   secondaryActions={<Button variant="outline">Delete</Button>}
 * >
 *   <p>Page content here</p>
 * </Page>
 *
 * // Full width page
 * <Page title="Dashboard" fullWidth>
 *   <p>Full width content</p>
 * </Page>
 *
 * // Narrow width page (for forms, settings)
 * <Page title="Settings" narrowWidth>
 *   <p>Narrow content</p>
 * </Page>
 * ```
 */
export const Page = React.forwardRef<HTMLDivElement, PageProps>(
	(
		{
			title,
			subtitle,
			primaryAction,
			secondaryActions,
			breadcrumbs,
			additionalMetadata,
			fullWidth = false,
			narrowWidth = false,
			divider = true,
			className,
			headerClassName,
			contentClassName,
			children,
			...props
		},
		ref
	) => {
		const hasHeader =
			title || primaryAction || secondaryActions || breadcrumbs || additionalMetadata

		return (
			<div
				ref={ref}
				className={cn(
					"w-full px-4",
					!fullWidth && "mx-auto",
					!fullWidth && !narrowWidth && "max-w-7xl",
					!fullWidth && narrowWidth && "max-w-4xl",
					className
				)}
				{...props}
			>
				{/* Page Header */}
				{hasHeader && (
					<div className={cn("space-y-6 pt-4 pb-3", headerClassName)}>
						{/* Breadcrumbs */}
						{breadcrumbs && <div className="flex items-center">{breadcrumbs}</div>}

						{/* Title and Actions Row */}
						{(title || primaryAction || secondaryActions) && (
							<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
								{/* Title Section */}
								<div className="flex-1 space-y-1">
									{title && <h1 className="text-lg font-semibold leading-normal text-foreground">{title}</h1>}
									{subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
								</div>

								{/* Actions Section */}
								{(primaryAction || secondaryActions) && (
									<div className="flex flex-col gap-2 sm:flex-row sm:items-center">
										{secondaryActions && (
											<div className="flex items-center gap-2">{secondaryActions}</div>
										)}
										{primaryAction && <div className="flex items-center">{primaryAction}</div>}
									</div>
								)}
							</div>
						)}

						{/* Additional Metadata */}
						{additionalMetadata && <div className="flex items-center">{additionalMetadata}</div>}
					</div>
				)}

				{/* Page Content */}
				<div className={cn("pb-8", !hasHeader && "pt-6", contentClassName)}>{children}</div>
			</div>
		)
	}
)

Page.displayName = "Page"

/**
 * PageSection - A sub-section within a page
 *
 * Provides consistent spacing and optional titles for page sections
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
						{description && <p className="text-body-md text-muted-foreground">{description}</p>}
					</div>
				)}
				{children}
			</section>
		)
	}
)

PageSection.displayName = "PageSection"
