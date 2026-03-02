// apps/ops/components/entry-status-badge.tsx

import { cn } from "@blazz/ui/lib/utils"
import type { EntryStatus } from "@/lib/time-entry-status"
import { ENTRY_STATUS_LABELS } from "@/lib/time-entry-status"

interface EntryStatusBadgeProps {
	status: EntryStatus | null
}

const statusConfig: Record<EntryStatus, { dot: string; text: string }> = {
	draft: {
		dot: "bg-fg-muted",
		text: "text-fg-muted",
	},
	ready_to_invoice: {
		dot: "bg-amber-500",
		text: "text-amber-600 dark:text-amber-400",
	},
	invoiced: {
		dot: "bg-blue-500",
		text: "text-blue-600 dark:text-blue-400",
	},
	paid: {
		dot: "bg-green-500",
		text: "text-green-600 dark:text-green-400",
	},
}

export function EntryStatusBadge({ status }: EntryStatusBadgeProps) {
	if (!status) {
		return (
			<span className="flex items-center gap-1.5 text-xs text-fg-muted">
				<span className="inline-block size-1.5 rounded-full border border-fg-muted/50" />
				Non facturable
			</span>
		)
	}

	const config = statusConfig[status]

	return (
		<span className={cn("flex items-center gap-1.5 text-xs", config.text)}>
			<span className={cn("inline-block size-1.5 rounded-full", config.dot)} />
			{ENTRY_STATUS_LABELS[status]}
		</span>
	)
}
