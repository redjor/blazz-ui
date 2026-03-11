"use client"

import {
	AreaChart,
	Area,
	ResponsiveContainer,
} from "recharts"
import { withProGuard } from "../../../../lib/with-pro-guard"
import { cn } from "../../../../lib/utils"

export interface MiniChartProps {
	label: string
	data: number[]
	value?: string
	color?: string
	className?: string
}

function MiniChartBase({
	label,
	data,
	value,
	color = "var(--color-brand)",
	className,
}: MiniChartProps) {
	const chartData = data.map((v, i) => ({ i, v }))

	return (
		<div
			className={cn(
				"rounded-lg border border-container bg-surface p-4",
				className,
			)}
		>
			<div className="flex items-baseline justify-between">
				<span className="text-xs text-fg-muted">{label}</span>
				{value && (
					<span className="text-lg font-semibold text-fg">{value}</span>
				)}
			</div>
			<div className="mt-2 h-[60px]">
				<ResponsiveContainer width="100%" height="100%">
					<AreaChart data={chartData}>
						<defs>
							<linearGradient id={`fill-${label.replace(/\s/g, "")}`} x1="0" y1="0" x2="0" y2="1">
								<stop offset="0%" stopColor={color} stopOpacity={0.2} />
								<stop offset="100%" stopColor={color} stopOpacity={0} />
							</linearGradient>
						</defs>
						<Area
							type="monotone"
							dataKey="v"
							stroke={color}
							strokeWidth={1.5}
							fill={`url(#fill-${label.replace(/\s/g, "")})`}
							dot={false}
						/>
					</AreaChart>
				</ResponsiveContainer>
			</div>
		</div>
	)
}

export const MiniChart = withProGuard(MiniChartBase, "MiniChart")
