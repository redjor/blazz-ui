"use client"

import type { ReactNode } from "react"
import { useRouter } from "next/navigation"
import { ArrowDown, ArrowUp } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "../../../ui/avatar"
import { Badge } from "../../../ui/badge"
import { withProGuard } from "../../../../lib/with-pro-guard"
import { cn } from "../../../../lib/utils"

// ---------- Column definition ----------

export type DataGridAlign = "left" | "center" | "right"

export interface DataGridColumn {
	key: string
	label: string
	align?: DataGridAlign
	/** Highlight this column as sorted */
	sorted?: "asc" | "desc"
}

// ---------- Cell types ----------

export interface DataGridTextCell {
	type?: "text"
	value: string | number
}

export interface DataGridBadgeCell {
	type: "badge"
	value: string
	variant?: "default" | "success" | "warning" | "critical" | "info" | "secondary"
}

export interface DataGridAvatarCell {
	type: "avatar"
	name: string
	src?: string
	subtitle?: string
}

export interface DataGridTrendCell {
	type: "trend"
	value: number
	suffix?: string
}

export type DataGridCell =
	| DataGridTextCell
	| DataGridBadgeCell
	| DataGridAvatarCell
	| DataGridTrendCell

export type DataGridRow = Record<string, DataGridCell | string | number> & {
	/** Makes the row a clickable link */
	href?: string
}

// ---------- Props ----------

export interface DataGridProps {
	title?: string
	columns: DataGridColumn[]
	rows: DataGridRow[]
	caption?: string
	className?: string
}

// ---------- Helpers ----------

function getInitials(name: string) {
	return name
		.split(" ")
		.map((w) => w[0])
		.join("")
		.toUpperCase()
		.slice(0, 2)
}

function normalizeCell(value: DataGridCell | string | number): DataGridCell {
	if (typeof value === "string" || typeof value === "number") {
		return { type: "text", value }
	}
	if (!value.type) return { type: "text", value: (value as DataGridTextCell).value }
	return value
}

const alignClass: Record<DataGridAlign, string> = {
	left: "text-left",
	center: "text-center",
	right: "text-right",
}

// ---------- Cell renderers ----------

function CellRenderer({ cell }: { cell: DataGridCell }) {
	switch (cell.type) {
		case "badge":
			return (
				<Badge variant={cell.variant ?? "default"} size="xs" fill="subtle">
					{cell.value}
				</Badge>
			)
		case "avatar":
			return (
				<div className="flex items-center gap-2">
					<Avatar size="sm">
						{cell.src && <AvatarImage src={cell.src} alt={cell.name} />}
						<AvatarFallback>{getInitials(cell.name)}</AvatarFallback>
					</Avatar>
					<div className="min-w-0">
						<span className="block truncate text-sm font-medium text-fg">
							{cell.name}
						</span>
						{cell.subtitle && (
							<span className="block truncate text-xs text-fg-muted">
								{cell.subtitle}
							</span>
						)}
					</div>
				</div>
			)
		case "trend": {
			const positive = cell.value >= 0
			return (
				<span
					className={cn(
						"inline-flex items-center gap-1 text-sm font-medium",
						positive ? "text-positive" : "text-negative",
					)}
				>
					{positive ? (
						<ArrowUp className="size-3" />
					) : (
						<ArrowDown className="size-3" />
					)}
					{positive ? "+" : ""}
					{cell.value}
					{cell.suffix ?? "%"}
				</span>
			)
		}
		default:
			return <span className="text-sm text-fg">{cell.value}</span>
	}
}

// ---------- Component ----------

function DataGridBase({
	title,
	columns,
	rows,
	caption,
	className,
}: DataGridProps) {
	const router = useRouter()

	return (
		<div
			className={cn(
				"overflow-hidden rounded-lg border border-container bg-surface",
				className,
			)}
		>
			{title && (
				<div className="px-4 pt-3 pb-2">
					<span className="text-sm font-medium text-fg">{title}</span>
				</div>
			)}
			<div className="overflow-x-auto">
				<table className="w-full text-left">
					<thead>
						<tr className="border-b border-separator bg-raised/40">
							{columns.map((col) => (
								<th
									key={col.key}
									className={cn(
										"whitespace-nowrap px-3 py-2 text-xs font-medium text-fg-muted",
										alignClass[col.align ?? "left"],
									)}
								>
									<span className="inline-flex items-center gap-1">
										{col.label}
										{col.sorted === "asc" && (
											<ArrowUp className="size-3 text-fg-muted" />
										)}
										{col.sorted === "desc" && (
											<ArrowDown className="size-3 text-fg-muted" />
										)}
									</span>
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{rows.map((row, i) => {
							const { href, ...cells } = row
							const isLink = typeof href === "string"

							return (
								<tr
									key={i}
									className={cn(
										"border-b border-edge-subtle last:border-0",
										isLink && "transition-colors hover:bg-raised/60 cursor-pointer",
									)}
									{...(isLink && {
										role: "link",
										tabIndex: 0,
										onClick: () => router.push(href as string),
										onKeyDown: (e: React.KeyboardEvent) => {
											if (e.key === "Enter") router.push(href as string)
										},
									})}
								>
									{columns.map((col) => {
										const raw = cells[col.key]
										if (raw === undefined) {
											return (
												<td
													key={col.key}
													className="px-3 py-2 text-sm text-fg-muted"
												>
													—
												</td>
											)
										}
										const cell = normalizeCell(raw as DataGridCell | string | number)
										return (
											<td
												key={col.key}
												className={cn(
													"px-3 py-2",
													alignClass[col.align ?? "left"],
												)}
											>
												<CellRenderer cell={cell} />
											</td>
										)
									})}
								</tr>
							)
						})}
					</tbody>
				</table>
			</div>
			{caption && (
				<div className="border-t border-edge-subtle px-4 py-2">
					<span className="text-xs text-fg-muted">{caption}</span>
				</div>
			)}
		</div>
	)
}

export const DataGrid = withProGuard(DataGridBase, "DataGrid")
