"use client"

import { cn } from "@/lib/utils"

export interface GenComparisonTableProps {
	title?: string
	columns: string[]
	rows: (string | number)[][]
	className?: string
}

export function GenComparisonTable({
	title,
	columns,
	rows,
	className,
}: GenComparisonTableProps) {
	return (
		<div
			className={cn(
				"overflow-hidden rounded-lg border border-edge bg-surface",
				className,
			)}
		>
			{title && (
				<div className="px-4 pt-3 pb-2">
					<span className="text-sm font-medium text-fg">{title}</span>
				</div>
			)}
			<table className="w-full text-left">
				<thead>
					<tr className="border-b border-edge">
						{columns.map((col) => (
							<th
								key={col}
								className="px-3 py-1.5 text-xs font-medium text-fg-muted"
							>
								{col}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{rows.map((row, i) => (
						<tr key={i} className="even:bg-raised/50">
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
