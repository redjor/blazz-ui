"use client"

import { PageHeader } from "@blazz/pro/components/blocks/page-header"
import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { Button } from "@blazz/ui/components/ui/button"
import { Card, CardContent } from "@blazz/ui/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@blazz/ui/components/ui/dialog"
import { InlineGrid } from "@blazz/ui/components/ui/inline-grid"
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import { Skeleton } from "@blazz/ui/components/ui/skeleton"
import { useMutation, useQuery } from "convex/react"
import { use, useState } from "react"
import { toast } from "sonner"
import { BudgetSection } from "@/components/budget-section"
import { ContractForm } from "@/components/contract-form"
import { ContractSection } from "@/components/contract-section"
import { ProjectForm } from "@/components/project-form"
import { api } from "@/convex/_generated/api"
import type { Doc, Id } from "@/convex/_generated/dataModel"
import { computeBudgetMetrics } from "@/lib/budget"
import { computeContractMetrics, computeForfaitMetrics } from "@/lib/contracts"
import { formatMinutes } from "@/lib/format"

interface Props {
	params: Promise<{ pid: string }>
}

export default function ProjectOverviewPage({ params }: Props) {
	const { pid } = use(params)
	const data = useQuery(api.projects.getWithStats, { id: pid as Id<"projects"> })
	const activeContract = useQuery(api.contracts.getActiveByProject, {
		projectId: pid as Id<"projects">,
	})
	const completeContract = useMutation(api.contracts.complete)
	const [editOpen, setEditOpen] = useState(false)
	const [editingContract, setEditingContract] = useState<Doc<"contracts"> | null>(null)

	// Loading state
	if (data === undefined) {
		return (
			<BlockStack gap="600" className="p-6">
				<BlockStack gap="200">
					<Skeleton className="h-4 w-32" />
					<Skeleton className="h-6 w-56" />
				</BlockStack>
				<InlineGrid columns={4} gap="400">
					{Array.from({ length: 4 }).map((_, i) => (
						<Skeleton key={i} className="h-20 rounded-lg" />
					))}
				</InlineGrid>
				<Skeleton className="h-48 rounded-lg" />
			</BlockStack>
		)
	}

	// Error / not found (layout handles this too, but just in case)
	if (data === null) {
		return <div className="p-6 text-fg-muted text-sm">Projet introuvable.</div>
	}

	const { project, entries, stats } = data

	const budgetMetrics = computeBudgetMetrics({
		budgetAmount: project.budgetAmount,
		tjm: project.tjm,
		hoursPerDay: project.hoursPerDay,
		billableMinutes: stats.billableMinutes,
		billableRevenue: stats.billableRevenue,
	})

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

	const statusDot: Record<string, string> = {
		active: "bg-green-500",
		paused: "bg-amber-500",
		closed: "bg-fg-muted",
	}
	const statusLabel: Record<string, string> = {
		active: "Actif",
		paused: "En pause",
		closed: "Clôturé",
	}

	return (
		<>
			<BlockStack gap="800" className="p-6">
				<BlockStack gap="150">
					<PageHeader
						title={project.name}
						actions={
							<Button variant="outline" onClick={() => setEditOpen(true)}>
								Modifier
							</Button>
						}
					/>
					<InlineStack as="span" gap="150" blockAlign="center" className="text-xs text-fg-muted">
						<span className={`inline-block size-1.5 rounded-full ${statusDot[project.status]}`} />
						{statusLabel[project.status]}
					</InlineStack>
				</BlockStack>

				{/* KPI cards */}
				<div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
					<Card>
						<CardContent className="p-4">
							<p className="text-xs text-fg-muted mb-1">CA total</p>
							<p className="text-xl font-semibold font-pixel">
								{stats.totalRevenue.toLocaleString("fr-FR")} €
							</p>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-4">
							<p className="text-xs text-fg-muted mb-1">Facturé</p>
							<p className="text-xl font-semibold font-pixel text-green-600 dark:text-green-400">
								{stats.invoicedRevenue.toLocaleString("fr-FR")} €
							</p>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-4">
							<p className="text-xs text-fg-muted mb-1">À facturer</p>
							<p className="text-xl font-semibold font-pixel text-amber-600 dark:text-amber-400">
								{stats.pendingRevenue.toLocaleString("fr-FR")} €
							</p>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-4">
							<p className="text-xs text-fg-muted mb-1">Temps passé</p>
							<p className="text-xl font-semibold font-pixel">
								{formatMinutes(stats.totalMinutes)}
							</p>
							<p className="text-xs text-fg-muted mt-1 tabular-nums">
								{(stats.totalMinutes / (project.hoursPerDay * 60)).toFixed(1).replace(".", ",")}{" "}
								jours
							</p>
						</CardContent>
					</Card>
				</div>

				{/* Budget section */}
				{budgetMetrics && (
					<BudgetSection
						metrics={budgetMetrics}
						tjm={project.tjm}
						weeklyBurnDown={data.weeklyBurnDown ?? null}
					/>
				)}

				{/* Contract section */}
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
			</BlockStack>

			{/* Edit project dialog */}
			<Dialog open={editOpen} onOpenChange={setEditOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Modifier le projet</DialogTitle>
					</DialogHeader>
					<ProjectForm
						clientId={project.clientId}
						defaultValues={{ ...project, id: project._id }}
						onSuccess={() => setEditOpen(false)}
						onCancel={() => setEditOpen(false)}
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
