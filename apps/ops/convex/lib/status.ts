import { ConvexError } from "convex/values"

export type EntryStatus = "draft" | "ready_to_invoice" | "invoiced" | "paid"

const ALLOWED_TRANSITIONS: Record<EntryStatus, EntryStatus[]> = {
	draft: ["ready_to_invoice"],
	ready_to_invoice: ["draft", "invoiced"],
	invoiced: ["ready_to_invoice", "paid"],
	paid: [],
}

export function validateTransition(from: EntryStatus, to: EntryStatus) {
	const allowed = ALLOWED_TRANSITIONS[from] ?? []
	if (!allowed.includes(to)) {
		throw new ConvexError(`Transition invalide : ${from} → ${to}. Transitions permises : ${allowed.join(", ") || "aucune"}`)
	}
}
