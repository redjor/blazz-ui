// apps/ops/lib/time-entry-status.ts

export type EntryStatus = "draft" | "ready_to_invoice" | "invoiced" | "paid"

export const ENTRY_STATUS_LABELS: Record<EntryStatus, string> = {
	draft: "Brouillon",
	ready_to_invoice: "Prêt à facturer",
	invoiced: "Facturé",
	paid: "Payé",
}

/**
 * Derives the effective status from an entry's fields.
 * Priority: explicit `status` field > legacy `invoicedAt` > default "draft"
 * Returns null for non-billable entries (outside billing scope).
 */
export function getEffectiveStatus(entry: {
	status?: EntryStatus | null
	billable: boolean
	invoicedAt?: number | null
}): EntryStatus | null {
	if (!entry.billable) return null
	if (entry.status) return entry.status
	if (entry.invoicedAt) return "invoiced"
	return "draft"
}

/** Returns all valid next statuses for a given current status. */
export function getAllowedTransitions(current: EntryStatus | null): EntryStatus[] {
	switch (current) {
		case "draft":
			return ["ready_to_invoice"]
		case "ready_to_invoice":
			return ["draft", "invoiced"]
		case "invoiced":
			return ["ready_to_invoice", "paid"]
		case "paid":
			return [] // terminal
		default:
			return []
	}
}
