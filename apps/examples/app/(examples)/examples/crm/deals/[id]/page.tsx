"use client"

import { ActivityTimeline } from "@blazz/ui/components/blocks/activity-timeline"
import { type DealLine, DealLinesEditor } from "@blazz/ui/components/blocks/deal-lines-editor"
import { DetailPanel } from "@blazz/ui/components/blocks/detail-panel"
import { PageHeader } from "@blazz/ui/components/blocks/page-header"
import { QuickLogActivity } from "@blazz/ui/components/blocks/quick-log-activity"
import { StatusFlow } from "@blazz/ui/components/blocks/status-flow"
import { Field, FieldGrid } from "@blazz/ui/components/patterns/field-grid"
import { Badge } from "@blazz/ui/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@blazz/ui/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@blazz/ui/components/ui/tabs"
import { Edit } from "lucide-react"
import { notFound } from "next/navigation"
import { use } from "react"
import { toast } from "sonner"
import { formatCurrency, formatDate, getDealById, recentActivities } from "@/lib/sample-data"

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

const sampleDealLines: DealLine[] = [
	{
		id: "dl1",
		product: "Licence CRM Enterprise",
		description: "50 utilisateurs, 12 mois",
		quantity: 1,
		unitPrice: 24000,
	},
	{
		id: "dl2",
		product: "Module Analytics",
		description: "Tableaux de bord avancés",
		quantity: 1,
		unitPrice: 8500,
	},
	{
		id: "dl3",
		product: "Formation sur site",
		description: "2 jours, 10 participants",
		quantity: 2,
		unitPrice: 1500,
	},
]

export default function DealDetailPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = use(params)
	const deal = getDealById(id)

	if (!deal) notFound()

	return (
		<div className="p-6 space-y-6">
			<PageHeader
				title={deal.title}
				breadcrumbs={[
					{ label: "Dashboard", href: "/examples/crm/dashboard" },
					{ label: "Pipeline", href: "/examples/crm/deals" },
					{ label: deal.title },
				]}
				actions={[{ label: "Modifier", href: `/deals/${id}/edit`, icon: Edit, variant: "outline" }]}
			/>

			<div className="flex items-center justify-between">
				<StatusFlow
					currentStatus={deal.stage}
					statuses={dealStatuses}
					transitions={dealTransitions}
					onTransition={async (from, to) => {
						toast.success(`Transition: ${stageLabel[from]} → ${stageLabel[to]}`)
					}}
				/>
				<QuickLogActivity
					onLog={async ({ type, note }) => {
						const typeLabels = { call: "Appel", email: "Email", note: "Note", meeting: "RDV" }
						toast.success(`${typeLabels[type]} enregistré : ${note}`)
					}}
				/>
			</div>

			<DetailPanel>
				<DetailPanel.Header
					title={deal.title}
					subtitle={deal.companyName}
					status={
						<Badge
							variant={
								deal.stage === "closed_won"
									? "success"
									: deal.stage === "closed_lost"
										? "critical"
										: "info"
							}
						>
							{stageLabel[deal.stage] ?? deal.stage}
						</Badge>
					}
				/>
			</DetailPanel>

			<Tabs defaultValue="details">
				<TabsList variant="line">
					<TabsTrigger value="details">Détails</TabsTrigger>
					<TabsTrigger value="lines">Lignes</TabsTrigger>
					<TabsTrigger value="history">Historique</TabsTrigger>
				</TabsList>

				<TabsContent value="details">
					<div className="space-y-6 pt-4">
						<Card>
							<CardHeader>
								<CardTitle>Informations du deal</CardTitle>
							</CardHeader>
							<CardContent>
								<FieldGrid columns={3}>
									<Field label="Montant" value={formatCurrency(deal.amount)} />
									<Field label="Probabilité" value={`${deal.probability}%`} />
									<Field
										label="Date de clôture prévue"
										value={formatDate(deal.expectedCloseDate)}
									/>
									<Field label="Source" value={deal.source} />
									<Field label="Assigné à" value={deal.assignedTo} />
									<Field label="Créé le" value={formatDate(deal.createdAt)} />
								</FieldGrid>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Entreprise & Contact</CardTitle>
							</CardHeader>
							<CardContent>
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
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				<TabsContent value="lines">
					<div className="pt-4">
						<Card>
							<CardHeader>
								<CardTitle>Lignes du deal</CardTitle>
							</CardHeader>
							<CardContent>
								<DealLinesEditor lines={sampleDealLines} onChange={() => {}} readOnly />
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				<TabsContent value="history">
					<div className="pt-4">
						<Card>
							<CardHeader>
								<CardTitle>Historique d&apos;activité</CardTitle>
							</CardHeader>
							<CardContent>
								<ActivityTimeline events={recentActivities.slice(0, 8)} />
							</CardContent>
						</Card>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	)
}
