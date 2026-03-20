"use client"

import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { Button } from "@blazz/ui/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@blazz/ui/components/ui/dialog"
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import { useMutation, useQuery } from "convex/react"
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
			<BlockStack gap="600" className="mx-auto max-w-3xl p-6">
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

				{/* Past contracts list */}
				{allContracts && allContracts.filter((c) => c.status !== "active").length > 0 && (
					<BlockStack gap="200">
						<h3 className="text-xs font-medium text-fg-muted uppercase tracking-wide">
							Contrats passés
						</h3>
						<BlockStack gap="100">
							{allContracts
								.filter((c) => c.status !== "active")
								.map((c) => (
									<InlineStack
										key={c._id}
										align="space-between"
										blockAlign="center"
										className="py-2 border-b border-edge last:border-0 text-xs text-fg-muted"
									>
										<span className="font-mono">
											{c.startDate} → {c.endDate}
										</span>
										<span>
											{c.type === "tma"
												? `${c.daysPerMonth}j/mois`
												: c.type === "regie"
													? "Régie"
													: "Forfait"}{" "}
											· {c.status === "completed" ? "Terminé" : "Annulé"}
										</span>
									</InlineStack>
								))}
						</BlockStack>
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
