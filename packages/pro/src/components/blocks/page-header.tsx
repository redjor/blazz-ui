"use client"

import type * as React from "react"
import { cn } from "@blazz/ui"
import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import { withProGuard } from "../../lib/with-pro-guard"

export interface PageHeaderProps {
	/** Page title */
	title: string
	/** Slot above the title row (breadcrumbs, back link, etc.) */
	top?: React.ReactNode
	/** Slot inline after the title (badge, status, metadata) */
	afterTitle?: React.ReactNode
	/** Slot on the right side of the title row (buttons, actions) */
	actions?: React.ReactNode
	/** Slot below the title row (tabs, filters, description) */
	bottom?: React.ReactNode
	/** Show a bottom border below the header */
	bordered?: boolean
	className?: string
}

function PageHeaderBase({
	title,
	top,
	afterTitle,
	actions,
	bottom,
	bordered = false,
	className,
}: PageHeaderProps) {
	return (
		<BlockStack gap="200" className={cn(bordered && "border-b border-edge pb-4", className)}>
			{top}

			<InlineStack align="space-between" blockAlign="center" gap="400">
				<InlineStack blockAlign="center" gap="300">
					<h1 className="text-lg font-semibold leading-normal text-fg">{title}</h1>
					{afterTitle}
				</InlineStack>

				{actions && (
					<InlineStack blockAlign="center" gap="200">
						{actions}
					</InlineStack>
				)}
			</InlineStack>

			{bottom}
		</BlockStack>
	)
}

export const PageHeader = withProGuard(PageHeaderBase, "PageHeader")
