"use client"

import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { Button } from "@blazz/ui/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@blazz/ui/components/ui/card"
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@blazz/ui/components/ui/tooltip"
import { useMutation, useQuery } from "convex/react"
import { Check, X } from "lucide-react"
import { toast } from "sonner"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { formatCurrency } from "@/lib/format"

const FREQ_LABELS: Record<string, string> = {
	monthly: "/mois",
	quarterly: "/trim",
	yearly: "/an",
}

export function SuggestionsSection() {
	const suggestions = useQuery(api.syncSuggestions.listPending)
	const acceptMutation = useMutation(api.syncSuggestions.accept)
	const rejectMutation = useMutation(api.syncSuggestions.reject)
	const acceptAllMutation = useMutation(api.syncSuggestions.acceptAll)
	const rejectAllMutation = useMutation(api.syncSuggestions.rejectAll)

	if (!suggestions || suggestions.length === 0) return null

	async function handleAccept(id: Id<"syncSuggestions">, name: string) {
		await acceptMutation({ id })
		toast.success(`${name} ajouté aux dépenses récurrentes`)
	}

	async function handleReject(id: Id<"syncSuggestions">) {
		await rejectMutation({ id })
	}

	async function handleAcceptAll() {
		const result = await acceptAllMutation()
		toast.success(`${result.accepted} dépenses ajoutées`)
	}

	async function handleRejectAll() {
		await rejectAllMutation()
	}

	return (
		<Card>
			<CardHeader>
				<InlineStack align="space-between" blockAlign="center">
					<BlockStack gap="050">
						<CardTitle className="text-sm font-medium">
							Suggestions Qonto
						</CardTitle>
						<span className="text-xs text-fg-muted">
							{suggestions.length} dépenses détectées
						</span>
					</BlockStack>
					<InlineStack gap="200">
						<Button
							variant="outline"
							size="sm"
							onClick={handleAcceptAll}
						>
							Tout accepter ({suggestions.length})
						</Button>
						<Button
							variant="ghost"
							size="sm"
							onClick={handleRejectAll}
						>
							Tout rejeter
						</Button>
					</InlineStack>
				</InlineStack>
			</CardHeader>
			<CardContent className="p-0">
				<TooltipProvider>
					<div className="divide-y divide-separator">
						{suggestions.map((suggestion) => (
							<div
								key={suggestion._id}
								className={`flex items-center justify-between px-inset py-3${
									suggestion.confidence < 0.7 ? " opacity-60" : ""
								}`}
							>
								<div className="flex flex-col gap-0.5 min-w-0 flex-1">
									<Tooltip>
										<TooltipTrigger className="text-left">
											<span className="text-sm font-medium text-fg truncate cursor-default">
												{suggestion.name}
											</span>
										</TooltipTrigger>
										<TooltipContent>
											{suggestion.transactionLabels.length > 0
												? suggestion.transactionLabels.join(", ")
												: "Aucun libellé"}
										</TooltipContent>
									</Tooltip>
									<span className="text-xs text-fg-muted">
										{suggestion.category} · {suggestion.transactionIds.length} transactions
									</span>
								</div>
								<InlineStack gap="200" blockAlign="center">
									<span className="text-sm font-medium tabular-nums text-fg">
										{formatCurrency(suggestion.amountCents / 100)}
										{FREQ_LABELS[suggestion.frequency] ?? ""}
									</span>
									<span className="text-xs text-fg-muted tabular-nums">
										{Math.round(suggestion.confidence * 100)}%
									</span>
									<InlineStack gap="050">
										<Button
											variant="ghost"
											size="icon-sm"
											onClick={() =>
												handleAccept(suggestion._id, suggestion.name)
											}
											title="Accepter"
										>
											<Check className="size-3.5 text-positive" />
										</Button>
										<Button
											variant="ghost"
											size="icon-sm"
											onClick={() => handleReject(suggestion._id)}
											title="Rejeter"
										>
											<X className="size-3.5 text-destructive" />
										</Button>
									</InlineStack>
								</InlineStack>
							</div>
						))}
					</div>
				</TooltipProvider>
			</CardContent>
		</Card>
	)
}
