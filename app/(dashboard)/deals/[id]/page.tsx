"use client"

import { notFound } from "next/navigation"
import { use } from "react"
import { toast } from "sonner"
import { Edit } from "lucide-react"
import { PageHeader } from "@/components/blocks/page-header"
import { DetailPanel } from "@/components/blocks/detail-panel"
import { StatusFlow } from "@/components/blocks/status-flow"
import { FieldGrid, Field } from "@/components/blocks/field-grid"
import { ActivityTimeline } from "@/components/blocks/activity-timeline"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { getDealById, formatCurrency, formatDate, recentActivities } from "@/lib/sample-data"

const stageLabel: Record<string, string> = {
	lead: "Lead",
	qualified: "Qualifié",
	proposal: "Proposition",
	negotiation: "Négociation",
	closed_won: "Gagné",
	closed_lost: "Perdu",
}

const dealStatuses = [
	{ id: "lead", label: "Lead", color: "gray" as const },
	{ id: "qualified", label: "Qualifié", color: "blue" as const },
	{ id: "proposal", label: "Proposition", color: "yellow" as const },
	{ id: "negotiation", label: "Négociation", color: "purple" as const },
	{ id: "closed_won", label: "Gagné", color: "green" as const },
	{ id: "closed_lost", label: "Perdu", color: "red" as const },
]

const dealTransitions = [
	{ from: "lead", to: "qualified", action: "Qualifier" },
	{ from: "qualified", to: "proposal", action: "Envoyer proposition" },
	{ from: "proposal", to: "negotiation", action: "Négocier" },
	{ from: "negotiation", to: "closed_won", action: "Marquer gagné" },
	{ from: "negotiation", to: "closed_lost", action: "Marquer perdu" },
]

export default function DealDetailPage({
	params,
}: {
	params: Promise<{ id: string }>
}) {
	const { id } = use(params)
	const deal = getDealById(id)

	if (!deal) notFound()

	return (
		<div className="p-6 space-y-6">
			<PageHeader
				title={deal.title}
				breadcrumbs={[
					{ label: "Dashboard", href: "/dashboard" },
					{ label: "Pipeline", href: "/deals" },
					{ label: deal.title },
				]}
				actions={[
					{ label: "Modifier", href: `/deals/${id}/edit`, icon: Edit, variant: "outline" },
				]}
			/>

			<StatusFlow
				currentStatus={deal.stage}
				statuses={dealStatuses}
				transitions={dealTransitions}
				onTransition={async (from, to) => {
					toast.success(`Transition: ${stageLabel[from]} → ${stageLabel[to]}`)
				}}
			/>

			<DetailPanel>
				<DetailPanel.Header
					title={deal.title}
					subtitle={deal.companyName}
					status={
						<Badge variant={deal.stage === "closed_won" ? "success" : deal.stage === "closed_lost" ? "critical" : "info"}>
							{stageLabel[deal.stage] ?? deal.stage}
						</Badge>
					}
				/>

				<DetailPanel.Section title="Détails du deal">
					<FieldGrid columns={3}>
						<Field label="Montant" value={formatCurrency(deal.amount)} />
						<Field label="Probabilité" value={`${deal.probability}%`} />
						<Field label="Date de clôture prévue" value={formatDate(deal.expectedCloseDate)} />
						<Field label="Source" value={deal.source} />
						<Field label="Assigné à" value={deal.assignedTo} />
						<Field label="Créé le" value={formatDate(deal.createdAt)} />
					</FieldGrid>
				</DetailPanel.Section>

				<DetailPanel.Section title="Entreprise & Contact">
					<FieldGrid columns={2}>
						<Field
							label="Entreprise"
							value={
								<a href={`/companies/${deal.companyId}`} className="hover:underline">
									{deal.companyName}
								</a>
							}
						/>
						<Field label="Contact" value={deal.contactName} />
					</FieldGrid>
				</DetailPanel.Section>
			</DetailPanel>

			<Card>
				<CardHeader>
					<CardTitle>Historique</CardTitle>
				</CardHeader>
				<CardContent>
					<ActivityTimeline events={recentActivities.slice(0, 4)} />
				</CardContent>
			</Card>
		</div>
	)
}
