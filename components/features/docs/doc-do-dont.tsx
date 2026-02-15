import { Check, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface DocDoDontProps {
	doExample: React.ReactNode
	doText: string
	dontExample: React.ReactNode
	dontText: string
	className?: string
}

export function DocDoDont({ doExample, doText, dontExample, dontText, className }: DocDoDontProps) {
	return (
		<div className={cn("grid gap-4 sm:grid-cols-2", className)}>
			<div className="space-y-3">
				<div className="rounded-lg border border-edge bg-surface p-6">
					{doExample}
				</div>
				<div className="flex items-start gap-2">
					<div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-positive/15">
						<Check className="size-3 text-positive" />
					</div>
					<p className="text-[13px] text-fg-muted">{doText}</p>
				</div>
			</div>
			<div className="space-y-3">
				<div className="rounded-lg border border-edge bg-surface p-6">
					{dontExample}
				</div>
				<div className="flex items-start gap-2">
					<div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-negative/15">
						<X className="size-3 text-negative" />
					</div>
					<p className="text-[13px] text-fg-muted">{dontText}</p>
				</div>
			</div>
		</div>
	)
}
