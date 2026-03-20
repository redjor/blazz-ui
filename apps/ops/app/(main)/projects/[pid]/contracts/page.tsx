"use client"

import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { Box } from "@blazz/ui/components/ui/box"
import { Button } from "@blazz/ui/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@blazz/ui/components/ui/dialog"
import { Grid } from "@blazz/ui/components/ui/grid"
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import { useMutation, useQuery } from "convex/react"
import { format, parse } from "date-fns"
import { fr } from "date-fns/locale"
import { use, useState } from "react"
import { toast } from "sonner"
import { ContractForm } from "@/components/contract-form"
import { ContractSection } from "@/components/contract-section"
import { api } from "@/convex/_generated/api"
import type { Doc, Id } from "@/convex/_generated/dataModel"
import { computeContractMetrics, computeForfaitMetrics } from "@/lib/contracts"

export default function ProjectContractsPage({
	params,
}: { params: Promise<{ pid: string }> }) {
	const { pid } = use(params)
	const [contractOpen, setContractOpen] = useState(false)
	const [editingContract, setEditingContract] = useState<Doc<"contracts"> | null>(null)

	const data = useQuery(api.projects.getWithStats, { id: pid as Id<"projects"> })
	const activeContract = useQuery(api.contracts.getActiveByProject, {
		projectId: pid as Id<"projects">,
	})
	const allContracts = useQuery(api.contracts.listByProject, {
		projectId: pid as Id<"projects">,
	})
	const completeContract = useMutation(api.contracts.complete)

	if (data === undefined) {
		return <div className="p-6 text-fg-muted text-sm">Chargement…</div>
	}

	if (data === null) {
		return <div className="p-6 text-fg-muted text-sm">Projet introuvable.</div>
	}

	const { project, entries } = data

	const contractMetrics =
		activeContract && activeContract.type === "tma" && activeContract.daysPerMonth
			? computeContractMetrics({
					daysPerMonth: activeContract.daysPerMonth,
					carryOver: activeContract.carryOver,
					prestationStartDate: activeContract.prestationStartDate,
					startDate: activeContract.startDate,
					endDate: activeContract.endDate,
					hoursPerDay: project.hoursPerDay,
					entries: entries.map((e) => ({
						date: e.date,
						minutes: e.minutes,
						billable: e.billable,
					})),
				})
			: null

	const forfaitMetrics =
		activeContract && activeContract.type === "forfait" && activeContract.budgetAmount
			? computeForfaitMetrics({
					budgetAmount: activeContract.budgetAmount,
					entries: entries.map((e) => ({
						date: e.date,
						minutes: e.minutes,
						hourlyRate: e.hourlyRate,
						billable: e.billable,
					})),
					startDate: activeContract.startDate,
					endDate: activeContract.endDate,
				})
			: null

	return (
		<>
			<BlockStack gap="600" className="p-6">
				{/* Active contract */}
				{activeContract && (
					<ContractSection
						contract={activeContract}
						metrics={contractMetrics}
						forfaitMetrics={forfaitMetrics}
						onEdit={() => setEditingContract(activeContract)}
						onComplete={async () => {
							try {
								await completeContract({ id: activeContract._id })
								toast.success("Contrat clôturé")
							} catch (e) {
								toast.error(e instanceof Error ? e.message : "Erreur")
							}
						}}
					/>
				)}

				{/* No active contract — CTA */}
				{!activeContract && (
					<BlockStack gap="300" className="py-12 text-center">
						<p className="text-sm text-fg-muted">Aucun contrat actif</p>
						<div>
							<Button size="sm" onClick={() => setContractOpen(true)}>
								Nouveau contrat
							</Button>
						</div>
					</BlockStack>
				)}

				{/* Contract management — only show button if active contract exists */}
				{activeContract && (
					<InlineStack align="end">
						<Button size="sm" variant="outline" onClick={() => setContractOpen(true)}>
							Nouveau contrat
						</Button>
					</InlineStack>
				)}

				{/* Past contracts */}
				{allContracts && allContracts.filter((c) => c.status !== "active").length > 0 && (
					<BlockStack gap="300">
						<h3 className="text-xs font-medium text-fg-muted uppercase tracking-wide">
							Contrats passés
						</h3>
						<Grid>
							{allContracts
								.filter((c) => c.status !== "active")
								.map((c) => {
									const typeLabel = c.type === "tma" ? "TMA" : c.type === "regie" ? "Régie" : "Forfait"
									const statusLabel = c.status === "completed" ? "Terminé" : "Annulé"
									const statusColor = c.status === "completed" ? "bg-fg-muted" : "bg-red-500"
									let startFormatted: string
									let endFormatted: string
									try {
										startFormatted = format(parse(c.startDate, "yyyy-MM-dd", new Date()), "d MMM yyyy", { locale: fr })
										endFormatted = format(parse(c.endDate, "yyyy-MM-dd", new Date()), "d MMM yyyy", { locale: fr })
									} catch {
										startFormatted = c.startDate
										endFormatted = c.endDate
									}
									return (
										<Grid.Cell key={c._id} columnSpan={{ xs: 12, sm: 6, md: 4 }}>
											<Box background="surface" border="default" borderRadius="lg">
												<BlockStack gap="050">
													<InlineStack gap="200" blockAlign="center">
														<span className="text-sm font-medium text-fg">{typeLabel}</span>
														<InlineStack gap="100" blockAlign="center">
															<span className={`size-1.5 rounded-full ${statusColor}`} />
															<span className="text-xs text-fg-muted">{statusLabel}</span>
														</InlineStack>
													</InlineStack>
													<span className="text-xs text-fg-muted">
														{startFormatted} → {endFormatted}
														{c.daysPerMonth && <> · {c.daysPerMonth}j/mois</>}
													</span>
												</BlockStack>
											</Box>
										</Grid.Cell>
									)
								})}
						</Grid>
					</BlockStack>
				)}
			</BlockStack>

			{/* New contract dialog */}
			<Dialog open={contractOpen} onOpenChange={setContractOpen}>
				<DialogContent size="lg" className="max-h-[85vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>Nouveau contrat</DialogTitle>
					</DialogHeader>
					<ContractForm
						projectId={pid as Id<"projects">}
						onSuccess={() => setContractOpen(false)}
						onCancel={() => setContractOpen(false)}
					/>
				</DialogContent>
			</Dialog>

			{/* Edit contract dialog */}
			<Dialog open={!!editingContract} onOpenChange={(open) => !open && setEditingContract(null)}>
				<DialogContent size="lg" className="max-h-[85vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>Modifier le contrat</DialogTitle>
					</DialogHeader>
					{editingContract && (
						<ContractForm
							projectId={pid as Id<"projects">}
							defaultValues={{
								id: editingContract._id,
								type: editingContract.type,
								daysPerMonth: editingContract.daysPerMonth,
								carryOver: editingContract.carryOver,
								prestationStartDate: editingContract.prestationStartDate,
								startDate: editingContract.startDate,
								endDate: editingContract.endDate,
								status: editingContract.status,
								notes: editingContract.notes,
							}}
							onSuccess={() => setEditingContract(null)}
							onCancel={() => setEditingContract(null)}
						/>
					)}
				</DialogContent>
			</Dialog>
		</>
	)
}
