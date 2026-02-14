"use client"

import { notFound } from "next/navigation"
import { use } from "react"
import { Edit, Trash } from "lucide-react"
import { PageHeader } from "@/components/blocks/page-header"
import { DetailPanel } from "@/components/blocks/detail-panel"
import { FieldGrid, Field } from "@/components/blocks/field-grid"
import { ActivityTimeline } from "@/components/blocks/activity-timeline"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import {
	getCompanyById,
	getContactsByCompany,
	getDealsByCompany,
	formatCurrency,
	formatDate,
	recentActivities,
} from "@/lib/sample-data"

const statusVariant: Record<string, "success" | "info" | "outline" | "critical"> = {
	active: "success",
	prospect: "info",
	inactive: "outline",
	churned: "critical",
}

const statusLabel: Record<string, string> = {
	active: "Actif",
	prospect: "Prospect",
	inactive: "Inactif",
	churned: "Perdu",
}

export default function CompanyDetailPage({
	params,
}: {
	params: Promise<{ id: string }>
}) {
	const { id } = use(params)
	const company = getCompanyById(id)

	if (!company) notFound()

	const companyContacts = getContactsByCompany(id)
	const companyDeals = getDealsByCompany(id)

	return (
		<div className="p-6 space-y-6">
			<PageHeader
				title={company.name}
				breadcrumbs={[
					{ label: "Dashboard", href: "/dashboard" },
					{ label: "Entreprises", href: "/companies" },
					{ label: company.name },
				]}
				actions={[
					{ label: "Modifier", href: `/companies/${id}/edit`, icon: Edit, variant: "outline" },
				]}
			/>

			<DetailPanel>
				<DetailPanel.Header
					title={company.name}
					subtitle={company.domain}
					status={
						<Badge variant={statusVariant[company.status] ?? "outline"}>
							{statusLabel[company.status] ?? company.status}
						</Badge>
					}
				/>

				<DetailPanel.Section title="Informations générales">
					<FieldGrid columns={3}>
						<Field label="Secteur" value={company.industry} />
						<Field label="Taille" value={company.size} />
						<Field label="Chiffre d'affaires" value={company.revenue ? formatCurrency(company.revenue) : "—"} />
						<Field label="Téléphone" value={company.phone ?? "—"} />
						<Field label="Email" value={company.email ?? "—"} />
						<Field label="Site web" value={company.domain ?? "—"} />
					</FieldGrid>
				</DetailPanel.Section>

				<DetailPanel.Section title="Adresse">
					<FieldGrid columns={3}>
						<Field label="Adresse" value={company.address ?? "—"} span={2} />
						<Field label="Ville" value={company.city ?? "—"} />
						<Field label="Pays" value={company.country} />
					</FieldGrid>
				</DetailPanel.Section>

				<DetailPanel.Section title="Métadonnées">
					<FieldGrid columns={3}>
						<Field label="Créé le" value={formatDate(company.createdAt)} />
						<Field label="Mis à jour le" value={formatDate(company.updatedAt)} />
					</FieldGrid>
				</DetailPanel.Section>
			</DetailPanel>

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
				{/* Contacts */}
				<Card>
					<CardHeader>
						<CardTitle>Contacts ({companyContacts.length})</CardTitle>
					</CardHeader>
					<CardContent>
						{companyContacts.length === 0 ? (
							<p className="text-sm text-muted-foreground">Aucun contact associé</p>
						) : (
							<div className="space-y-3">
								{companyContacts.map((ct) => (
									<a
										key={ct.id}
										href={`/contacts/${ct.id}`}
										className="flex items-center justify-between rounded-md p-2 hover:bg-muted"
									>
										<div>
											<p className="text-sm font-medium">
												{ct.firstName} {ct.lastName}
												{ct.isPrimary && <span className="ml-1 text-xs text-muted-foreground">(principal)</span>}
											</p>
											<p className="text-xs text-muted-foreground">{ct.jobTitle}</p>
										</div>
									</a>
								))}
							</div>
						)}
					</CardContent>
				</Card>

				{/* Deals */}
				<Card>
					<CardHeader>
						<CardTitle>Deals ({companyDeals.length})</CardTitle>
					</CardHeader>
					<CardContent>
						{companyDeals.length === 0 ? (
							<p className="text-sm text-muted-foreground">Aucun deal associé</p>
						) : (
							<div className="space-y-3">
								{companyDeals.map((d) => (
									<a
										key={d.id}
										href={`/deals/${d.id}`}
										className="flex items-center justify-between rounded-md p-2 hover:bg-muted"
									>
										<div>
											<p className="text-sm font-medium">{d.title}</p>
											<p className="text-xs text-muted-foreground">{d.stage}</p>
										</div>
										<span className="text-sm font-medium">{formatCurrency(d.amount)}</span>
									</a>
								))}
							</div>
						)}
					</CardContent>
				</Card>
			</div>

			{/* Activity */}
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
