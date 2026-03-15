"use client"

import { Check } from "lucide-react"
import { useState } from "react"
import { cn } from "@blazz/ui"
import { withProGuard } from "../../../../lib/with-pro-guard"

export interface PollOption {
	label: string
	votes?: number
}

export interface PollCardProps {
	question: string
	options: PollOption[]
	totalVotes?: number
	showResults?: boolean
	onVote?: (index: number) => void
	className?: string
}

function PollCardBase({
	question,
	options,
	totalVotes: totalVotesProp,
	showResults: showResultsProp = false,
	onVote,
	className,
}: PollCardProps) {
	const [selected, setSelected] = useState<number | null>(null)
	const showResults = showResultsProp || selected !== null

	const totalVotes = totalVotesProp ?? options.reduce((sum, o) => sum + (o.votes ?? 0), 0)

	function handleVote(index: number) {
		if (selected !== null) return
		setSelected(index)
		onVote?.(index)
	}

	return (
		<div className={cn("rounded-lg border border-container bg-surface p-4", className)}>
			<span className="block text-sm font-medium text-fg">{question}</span>
			<div className="mt-3 space-y-2">
				{options.map((option, i) => {
					const votes = option.votes ?? 0
					const pct = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0
					const isSelected = selected === i

					return (
						<button
							key={i}
							type="button"
							onClick={() => handleVote(i)}
							disabled={selected !== null}
							className={cn(
								"relative flex w-full items-center gap-2 rounded-md border px-3 py-2 text-left text-sm transition-colors",
								isSelected
									? "border-brand bg-brand/5 text-fg"
									: "border-container text-fg hover:bg-surface-3 cursor-pointer",
								selected !== null && !isSelected && "opacity-70"
							)}
						>
							{showResults && (
								<div
									className="absolute inset-0 rounded-md bg-brand/10 transition-all"
									style={{ width: `${pct}%` }}
								/>
							)}
							<span className="relative flex-1">{option.label}</span>
							{showResults && (
								<span className="relative text-xs font-medium text-fg-muted">{pct}%</span>
							)}
							{isSelected && <Check className="relative size-3.5 text-brand" />}
						</button>
					)
				})}
			</div>
			{showResults && totalVotes > 0 && (
				<p className="mt-2 text-xs text-fg-muted">
					{totalVotes} vote{totalVotes > 1 ? "s" : ""}
				</p>
			)}
		</div>
	)
}

export const PollCard = withProGuard(PollCardBase, "PollCard")
