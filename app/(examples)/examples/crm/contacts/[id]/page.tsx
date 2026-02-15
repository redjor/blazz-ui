"use client"

import { notFound } from "next/navigation"
import { use } from "react"
import { toast } from "sonner"
import { Edit } from "lucide-react"
import { PageHeader } from "@/components/blocks/page-header"
import { DetailPanel } from "@/components/blocks/detail-panel"
import { FieldGrid, Field } from "@/components/blocks/field-grid"
import { ActivityTimeline } from "@/components/blocks/activity-timeline"
import { QuickLogActivity } from "@/components/blocks/quick-log-activity"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { getContactById, getCompanyById, getDealsByCompany, formatCurrency, formatDate, recentActivities } from "@/lib/sample-data"

const statusVariant: Record<string, "success" | "outline" | "warning"> = {
	active: "success",
	inactive: "outline",
	archived: "warning",
}

const statusLabel: Record<string, string> = {
	active: "Actif",
	inactive: "Inactif",
	archived: "Archivé",
}

export default function ContactDetailPage({
	params,
}: {
	params: Promise<{ id: string }>
}) {
	const { id } = use(params)
	const contact = getContactById(id)

	if (!contact) notFound()

	const company = getCompanyById(contact.companyId)
	const companyDeals = getDealsByCompany(contact.companyId)

	return (
		<div className="p-6 space-y-6">
			<PageHeader
				title={`${contact.firstName} ${contact.lastName}`}
				breadcrumbs={[
					{ label: "Dashboard", href: "/examples/crm/dashboard" },
					{ label: "Contacts", href: "/examples/crm/contacts" },
					{ label: `${contact.firstName} ${contact.lastName}` },
				]}
				actions={[
					{ label: "Modifier", href: `/contacts/${id}/edit`, icon: Edit, variant: "outline" },
				]}
			/>

			<div className="flex items-center justify-between">
				<DetailPanel.Header
					title={`${contact.firstName} ${contact.lastName}`}
					subtitle={contact.jobTitle}
					status={
						<Badge variant={statusVariant[contact.status] ?? "outline"}>
							{statusLabel[contact.status] ?? contact.status}
						</Badge>
					}
				/>
				<QuickLogActivity
					onLog={async ({ type, note }) => {
						const typeLabels = { call: "Appel", email: "Email", note: "Note", meeting: "RDV" }
						toast.success(`${typeLabels[type]} enregistré pour ${contact.firstName} ${contact.lastName} : ${note}`)
					}}
				/>
			</div>

			<Tabs defaultValue="info">
				<TabsList variant="line">
					<TabsTrigger value="info">Informations</TabsTrigger>
					<TabsTrigger value="company">Entreprise</TabsTrigger>
					<TabsTrigger value="history">Historique</TabsTrigger>
				</TabsList>

				<TabsContent value="info">
					<div className="pt-4">
						<Card>
							<CardHeader>
								<CardTitle>Informations de contact</CardTitle>
							</CardHeader>
							<CardContent>
								<FieldGrid columns={3}>
									<Field label="Prénom" value={contact.firstName} />
									<Field label="Nom" value={contact.lastName} />
									<Field label="Poste" value={contact.jobTitle ?? "—"} />
									<Field label="Email" value={contact.email} />
									<Field label="Téléphone" value={contact.phone ?? "—"} />
									<Field label="Contact principal" value={contact.isPrimary ? "Oui" : "Non"} />
									<Field label="Statut" value={statusLabel[contact.status] ?? contact.status} />
									<Field label="Ajouté le" value={formatDate(contact.createdAt)} />
								</FieldGrid>
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				<TabsContent value="company">
					<div className="space-y-6 pt-4">
						<Card>
							<CardHeader>
								<CardTitle>
									<a href={`/companies/${contact.companyId}`} className="hover:underline">
										{contact.companyName}
									</a>
								</CardTitle>
							</CardHeader>
							<CardContent>
								{company ? (
									<FieldGrid columns={3}>
										<Field label="Secteur" value={company.industry} />
										<Field label="Taille" value={company.size} />
										<Field label="Chiffre d'affaires" value={company.revenue ? formatCurrency(company.revenue) : "—"} />
										<Field label="Téléphone" value={company.phone ?? "—"} />
										<Field label="Email" value={company.email ?? "—"} />
										<Field label="Ville" value={company.city ?? "—"} />
									</FieldGrid>
								) : (
									<p className="text-sm text-muted-foreground">Entreprise non trouvée</p>
								)}
							</CardContent>
						</Card>

						{companyDeals.length > 0 && (
							<Card>
								<CardHeader>
									<CardTitle>Deals associés ({companyDeals.length})</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="divide-y">
										{companyDeals.map((d) => (
											<a
												key={d.id}
												href={`/deals/${d.id}`}
												className="flex items-center justify-between p-3 hover:bg-muted rounded-md transition-colors"
											>
												<div>
													<p className="text-sm font-medium">{d.title}</p>
													<p className="text-xs text-muted-foreground">{d.assignedTo}</p>
												</div>
												<span className="text-sm font-semibold">{formatCurrency(d.amount)}</span>
											</a>
										))}
									</div>
								</CardContent>
							</Card>
						)}
					</div>
				</TabsContent>

				<TabsContent value="history">
					<div className="pt-4">
						<Card>
							<CardHeader>
								<CardTitle>Historique d&apos;activité</CardTitle>
							</CardHeader>
							<CardContent>
								<ActivityTimeline events={recentActivities.slice(0, 5)} />
							</CardContent>
						</Card>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	)
}
