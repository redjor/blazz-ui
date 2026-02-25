"use client"

import { Fragment } from "react"
import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import {
	Breadcrumb,
	BreadcrumbList,
	BreadcrumbItem as BreadcrumbItemPrimitive,
	BreadcrumbLink,
	BreadcrumbSeparator,
	BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { cn } from "@/lib/utils"

export interface PageHeaderBreadcrumb {
	label: string
	href?: string
}

export interface PageHeaderAction {
	label: string
	onClick?: () => void | Promise<void>
	href?: string
	icon?: LucideIcon
	variant?: "default" | "outline" | "ghost" | "destructive"
}

export interface PageHeaderProps {
	title: string
	description?: string
	breadcrumbs?: PageHeaderBreadcrumb[]
	actions?: PageHeaderAction[]
	className?: string
}

export function PageHeader({
	title,
	description,
	breadcrumbs,
	actions,
	className,
}: PageHeaderProps) {
	return (
		<div className={cn("space-y-3 pb-6", className)}>
			{breadcrumbs && breadcrumbs.length > 0 && (
				<Breadcrumb>
					<BreadcrumbList>
						{breadcrumbs.map((item, i) => (
							<Fragment key={i}>
								{i > 0 && <BreadcrumbSeparator />}
								<BreadcrumbItemPrimitive>
									{item.href ? (
										<BreadcrumbLink href={item.href}>
											{item.label}
										</BreadcrumbLink>
									) : (
										<BreadcrumbPage>{item.label}</BreadcrumbPage>
									)}
								</BreadcrumbItemPrimitive>
							</Fragment>
						))}
					</BreadcrumbList>
				</Breadcrumb>
			)}

			<div className="flex items-start justify-between gap-4">
				<div className="space-y-1">
					<h1 className="text-lg font-semibold leading-normal text-fg">
						{title}
					</h1>
					{description && (
						<p className="text-sm text-fg-muted">{description}</p>
					)}
				</div>

				{actions && actions.length > 0 && (
					<div className="flex items-center gap-2">
						{actions.map((action, i) => {
							const icon = action.icon ? (
								<action.icon className="size-4" data-icon="inline-start" />
							) : null

							if (action.href) {
								return (
									<Link
										key={i}
										href={action.href}
										className={cn(
											buttonVariants({
												variant: action.variant || "default",
											})
										)}
									>
										{icon}
										{action.label}
									</Link>
								)
							}

							return (
								<Button
									key={i}
									variant={action.variant || "default"}
									onClick={action.onClick}
								>
									{icon}
									{action.label}
								</Button>
							)
						})}
					</div>
				)}
			</div>
		</div>
	)
}
