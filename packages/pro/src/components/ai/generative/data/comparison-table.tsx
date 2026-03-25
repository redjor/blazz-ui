"use client"

import { cn } from "@blazz/ui"
import { withProGuard } from "../../../../lib/with-pro-guard"

export interface ComparisonTableProps {
	title?: string
	columns: string[]
	rows: (string | number)[][]
	className?: string
}

function ComparisonTableBase({ title, columns, rows, className }: ComparisonTableProps) {
	return (
		<div className={cn("overflow-hidden rounded-lg border border-container bg-card", className)}>
			{title && (
				<div className="px-4 pt-3 pb-2">
					<span className="text-sm font-medium text-fg">{title}</span>
				</div>
			)}
			<table className="w-full text-left">
				<thead>
					<tr className="border-b border-separator">
						{columns.map((col) => (
							<th key={col} className="px-3 py-1.5 text-xs font-medium text-fg-muted">
								{col}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{rows.map((row, i) => (
						<tr key={i} className="even:bg-muted/50">
							{row.map((cell, j) => (
								<td key={j} className="px-3 py-1.5 text-sm text-fg">
									{cell}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}

export const ComparisonTable = withProGuard(ComparisonTableBase, "ComparisonTable")
