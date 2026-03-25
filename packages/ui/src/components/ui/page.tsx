import * as React from "react"
import { cn } from "../../lib/utils"
import {
	Breadcrumb,
	BreadcrumbBackLink,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "./breadcrumb"

export interface BreadcrumbParent {
	label: string
	href: string
}

export interface BreadcrumbConfig {
	backHref: string
	backIcon: React.ComponentType<{ className?: string }>
	parent?: BreadcrumbParent
	title: React.ReactNode
}

export interface PageBreadcrumbItem {
	label: string
	href?: string
	icon?: React.ComponentType<{ className?: string }>
}

function isBreadcrumbConfig(value: unknown): value is BreadcrumbConfig {
	return typeof value === "object" && value !== null && "backHref" in value && "title" in value
}

function isPageBreadcrumbArray(value: unknown): value is PageBreadcrumbItem[] {
	return (
		Array.isArray(value) && value.length > 0 && typeof value[0] === "object" && "label" in value[0]
	)
}

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
	 * Breadcrumb navigation displayed above the title.
	 * - ReactNode: fully custom breadcrumbs
	 * - BreadcrumbConfig: icon link > optional parent > title
	 * - PageBreadcrumbItem[]: array of items; the last item without href
	 *   automatically becomes the page title (no need to pass `title` separately)
	 */
	breadcrumbs?: React.ReactNode | BreadcrumbConfig | PageBreadcrumbItem[]

	/**
	 * Inline metadata displayed next to the title or breadcrumb title (e.g., status badge)
	 */
	titleMetadata?: React.ReactNode

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
	 * When true, uses a narrower max-width (max-w-3xl instead of max-w-5xl)
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
 * Provides a consistent structure
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
			titleMetadata,
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
		// Resolve breadcrumb array → extract title from last item + build trail
		let resolvedTitle = title
		let resolvedBreadcrumbs: React.ReactNode = null

		if (isPageBreadcrumbArray(breadcrumbs)) {
			const items = breadcrumbs
			const lastItem = items[items.length - 1]
			const trailItems = lastItem && !lastItem.href ? items.slice(0, -1) : items

			// Extract title from last item if it has no href and no explicit title was passed
			if (!title && lastItem && !lastItem.href) {
				resolvedTitle = lastItem.label
			}

			if (trailItems.length > 0) {
				resolvedBreadcrumbs = (
					<Breadcrumb>
						<BreadcrumbList>
							{trailItems.map((item, i) => (
								<React.Fragment key={i}>
									{i > 0 && <BreadcrumbSeparator />}
									<BreadcrumbItem>
										{item.href ? (
											i === 0 && item.icon ? (
												<BreadcrumbBackLink href={item.href} icon={item.icon}>
													{item.label}
												</BreadcrumbBackLink>
											) : (
												<BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
											)
										) : (
											<BreadcrumbPage>{item.label}</BreadcrumbPage>
										)}
									</BreadcrumbItem>
								</React.Fragment>
							))}
						</BreadcrumbList>
					</Breadcrumb>
				)
			}
		} else if (isBreadcrumbConfig(breadcrumbs)) {
			resolvedBreadcrumbs = (
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink href={breadcrumbs.backHref}>
								<breadcrumbs.backIcon className="h-4 w-4" />
							</BreadcrumbLink>
						</BreadcrumbItem>
						{breadcrumbs.parent && (
							<>
								<BreadcrumbSeparator />
								<BreadcrumbItem>
									<BreadcrumbLink
										href={breadcrumbs.parent.href}
										className="inline-block max-w-[8ch] truncate align-bottom transition-all duration-200 ease-out hover:max-w-[200px]"
									>
										{breadcrumbs.parent.label}
									</BreadcrumbLink>
								</BreadcrumbItem>
							</>
						)}
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage>{breadcrumbs.title}</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			)
		} else {
			resolvedBreadcrumbs = breadcrumbs
		}

		const hasHeader =
			resolvedTitle ||
			primaryAction ||
			secondaryActions ||
			resolvedBreadcrumbs ||
			titleMetadata ||
			additionalMetadata

		// Actions block — shared between all header layouts
		const actionsBlock = (primaryAction || secondaryActions) && (
			<div className="flex flex-col gap-2 sm:flex-row sm:items-center">
				{secondaryActions && <div className="flex items-center gap-2">{secondaryActions}</div>}
				{primaryAction && <div className="flex items-center">{primaryAction}</div>}
			</div>
		)

		// Title row — either title-based or breadcrumb-based or actions-only
		const titleDisplay = resolvedTitle ? (
			<>
				{resolvedBreadcrumbs && (
					<div className="flex items-center gap-3">{resolvedBreadcrumbs}</div>
				)}
				<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
					<div className="flex-1 space-y-1">
						<div className="flex items-center gap-3">
							<h1 className="text-xl font-semibold leading-none text-fg">{resolvedTitle}</h1>
							{titleMetadata}
						</div>
						{subtitle && <p className="text-sm text-fg-muted">{subtitle}</p>}
					</div>
					{actionsBlock}
				</div>
			</>
		) : resolvedBreadcrumbs ? (
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex items-center gap-3">
					{resolvedBreadcrumbs}
					{titleMetadata}
				</div>
				{actionsBlock}
			</div>
		) : actionsBlock ? (
			<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
				{actionsBlock}
			</div>
		) : null

		return (
			<div
				ref={ref}
				className={cn(
					"w-full px-6",
					!fullWidth && "mx-auto",
					!fullWidth && !narrowWidth && "max-w-5xl",
					!fullWidth && narrowWidth && "max-w-3xl",
					className
				)}
				{...props}
			>
				{/* Page Header */}
				{hasHeader && (
					<div
						className={cn(
							"space-y-4 py-4",
							divider && "border-b border-separator",
							headerClassName
						)}
					>
						{titleDisplay}
						{additionalMetadata && <div className="flex items-center">{additionalMetadata}</div>}
					</div>
				)}

				{/* Page Content */}
				<div className={cn("pb-8", hasHeader ? "pt-6" : "pt-6", contentClassName)}>{children}</div>
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
						{description && <p className="text-body-md text-fg-muted">{description}</p>}
					</div>
				)}
				{children}
			</section>
		)
	}
)

PageSection.displayName = "PageSection"

/**
 * PageWrapper - Constrains content width and optionally adds a card-like background + border.
 *
 * Used inside `<Page>` children to wrap content sections at a specific width,
 * or to give them a visual card treatment.
 *
 * @example
 * ```tsx
 * <Page title="Nouveau client">
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
