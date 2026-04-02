"use client"

import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { Button } from "@blazz/ui/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@blazz/ui/components/ui/card"
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import { useMutation, useQuery } from "convex/react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Check, X } from "lucide-react"
import { toast } from "sonner"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { formatCurrency } from "@/lib/format"

export function ExpenseSuggestionsSection() {
	const suggestions = useQuery(api.expenseSuggestions.listPending)
	const acceptMutation = useMutation(api.expenseSuggestions.accept)
	const rejectMutation = useMutation(api.expenseSuggestions.reject)
	const acceptAllMutation = useMutation(api.expenseSuggestions.acceptAll)
	const rejectAllMutation = useMutation(api.expenseSuggestions.rejectAll)

	if (!suggestions || suggestions.length === 0) return null

	async function handleAccept(id: Id<"expenseSuggestions">, label: string) {
		try {
			await acceptMutation({ id })
			toast.success(`${label} ajouté aux frais`)
		} catch {
			toast.error("Impossible d'accepter")
		}
	}

	async function handleReject(id: Id<"expenseSuggestions">) {
		try {
			await rejectMutation({ id })
		} catch {
			toast.error("Impossible de rejeter")
		}
	}

	async function handleAcceptAll() {
		try {
			const result = await acceptAllMutation()
			toast.success(`${result.accepted} frais ajoutés`)
		} catch {
			toast.error("Erreur")
		}
	}

	async function handleRejectAll() {
		try {
			await rejectAllMutation()
		} catch {
			toast.error("Erreur")
		}
	}

	return (
		<Card>
			<CardHeader>
				<InlineStack align="space-between" blockAlign="center">
					<BlockStack gap="050">
						<CardTitle className="text-sm font-medium">Suggestions Qonto</CardTitle>
						<span className="text-xs text-fg-muted">{suggestions.length} restaurants détectés</span>
					</BlockStack>
					<InlineStack gap="200">
						<Button variant="outline" size="sm" onClick={handleAcceptAll}>
							Tout accepter ({suggestions.length})
						</Button>
						<Button variant="ghost" size="sm" onClick={handleRejectAll}>
							Tout rejeter
						</Button>
					</InlineStack>
				</InlineStack>
			</CardHeader>
			<CardContent className="p-0">
				<div className="divide-y divide-separator">
					{suggestions.map((suggestion) => (
						<div key={suggestion._id} className={`flex items-center justify-between px-inset py-3${suggestion.confidence < 0.7 ? " opacity-60" : ""}`}>
							<div className="flex flex-col gap-0.5 min-w-0 flex-1">
								<span className="text-sm font-medium text-fg truncate">{suggestion.label}</span>
								<span className="text-xs text-fg-muted">{format(new Date(suggestion.date), "dd MMM yyyy", { locale: fr })}</span>
							</div>
							<InlineStack gap="200" blockAlign="center">
								<span className="text-sm font-medium tabular-nums text-fg">{formatCurrency(suggestion.amountCents / 100)}</span>
								<span className="text-xs text-fg-muted tabular-nums">{Math.round(suggestion.confidence * 100)}%</span>
								<InlineStack gap="050">
									<Button variant="ghost" size="icon-sm" onClick={() => handleAccept(suggestion._id, suggestion.label)} title="Accepter">
										<Check className="size-3.5 text-positive" />
									</Button>
									<Button variant="ghost" size="icon-sm" onClick={() => handleReject(suggestion._id)} title="Rejeter">
										<X className="size-3.5 text-destructive" />
									</Button>
								</InlineStack>
							</InlineStack>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	)
}
