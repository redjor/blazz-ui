"use client"

import * as React from "react"
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { cn } from "@/lib/utils"

export interface BreadcrumbItemType {
	label: string
	href?: string
}

export interface PageHeaderProps {
	breadcrumbs?: BreadcrumbItemType[]
	title?: string
	description?: string
	actions?: React.ReactNode
	className?: string
}

/**
 * PageHeader - Header de page avec breadcrumbs, titre et actions
 *
 * Ce composant est utilisé dans chaque page pour afficher:
 * - Breadcrumbs de navigation
 * - Titre de la page
 * - Description
 * - Actions (boutons, etc.)
 *
 * @example
 * <PageHeader
 *   breadcrumbs={[
 *     { label: 'Home', href: '/' },
 *     { label: 'Products', href: '/products' },
 *     { label: 'Product Detail' }
 *   ]}
 *   title="Products"
 *   description="Manage your product inventory"
 *   actions={<Button>Add Product</Button>}
 * />
 */
export function PageHeader({
	breadcrumbs,
	title,
	description,
	actions,
	className,
}: PageHeaderProps) {
	return (
		<div className={cn("border-b border-gray-200 bg-white px-6 py-4", className)}>
			{/* Breadcrumbs */}
			{breadcrumbs && breadcrumbs.length > 0 && (
				<Breadcrumb className="mb-2">
					<BreadcrumbList>
						{breadcrumbs.map((breadcrumb, index) => {
							const isLast = index === breadcrumbs.length - 1

							return (
								// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
								<React.Fragment key={index}>
									<BreadcrumbItem>
										{isLast || !breadcrumb.href ? (
											<BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
										) : (
											<BreadcrumbLink href={breadcrumb.href}>{breadcrumb.label}</BreadcrumbLink>
										)}
									</BreadcrumbItem>
									{!isLast && <BreadcrumbSeparator />}
								</React.Fragment>
							)
						})}
					</BreadcrumbList>
				</Breadcrumb>
			)}

			{/* Title + Actions */}
			{(title || actions) && (
				<div className="flex items-center justify-between">
					{/* Title + Description */}
					{(title || description) && (
						<div>
							{title && <h1 className="text-2xl font-bold tracking-tight">{title}</h1>}
							{description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
						</div>
					)}

					{/* Actions */}
					{actions && <div className="flex items-center gap-2">{actions}</div>}
				</div>
			)}
		</div>
	)
}
