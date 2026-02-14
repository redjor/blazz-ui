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

const stageLabel: Record<string, string> = {
	lead: "Lead",
	qualified: "Qualifié",
	proposal: "Proposition",
	negotiation: "Négociation",
	closed_won: "Gagné",
	closed_lost: "Perdu",
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

			<div className="flex items-center justify-between">
				<DetailPanel.Header
					title={company.name}
					subtitle={company.domain}
					status={
						<Badge variant={statusVariant[company.status] ?? "outline"}>
							{statusLabel[company.status] ?? company.status}
						</Badge>
					}
				/>
				<QuickLogActivity
					onLog={async ({ type, note }) => {
						const typeLabels = { call: "Appel", email: "Email", note: "Note", meeting: "RDV" }
						toast.success(`${typeLabels[type]} enregistré pour ${company.name} : ${note}`)
					}}
				/>
			</div>

			<Tabs defaultValue="overview">
				<TabsList variant="line">
					<TabsTrigger value="overview">Aperçu</TabsTrigger>
					<TabsTrigger value="contacts">Contacts ({companyContacts.length})</TabsTrigger>
					<TabsTrigger value="deals">Deals ({companyDeals.length})</TabsTrigger>
					<TabsTrigger value="history">Historique</TabsTrigger>
				</TabsList>

				<TabsContent value="overview">
					<div className="space-y-6 pt-4">
						<Card>
							<CardHeader>
								<CardTitle>Informations générales</CardTitle>
							</CardHeader>
							<CardContent>
								<FieldGrid columns={3}>
									<Field label="Secteur" value={company.industry} />
									<Field label="Taille" value={company.size} />
									<Field label="Chiffre d'affaires" value={company.revenue ? formatCurrency(company.revenue) : "—"} />
									<Field label="Téléphone" value={company.phone ?? "—"} />
									<Field label="Email" value={company.email ?? "—"} />
									<Field label="Site web" value={company.domain ?? "—"} />
								</FieldGrid>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Adresse</CardTitle>
							</CardHeader>
							<CardContent>
								<FieldGrid columns={3}>
									<Field label="Adresse" value={company.address ?? "—"} span={2} />
									<Field label="Ville" value={company.city ?? "—"} />
									<Field label="Pays" value={company.country} />
								</FieldGrid>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Métadonnées</CardTitle>
							</CardHeader>
							<CardContent>
								<FieldGrid columns={3}>
									<Field label="Assigné à" value={company.assignedTo ?? "—"} />
									<Field label="Créé le" value={formatDate(company.createdAt)} />
									<Field label="Mis à jour le" value={formatDate(company.updatedAt)} />
								</FieldGrid>
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				<TabsContent value="contacts">
					<div className="pt-4">
						<Card>
							<CardHeader>
								<CardTitle>Contacts ({companyContacts.length})</CardTitle>
							</CardHeader>
							<CardContent>
								{companyContacts.length === 0 ? (
									<p className="py-6 text-center text-sm text-muted-foreground">Aucun contact associé</p>
								) : (
									<div className="divide-y">
										{companyContacts.map((ct) => (
											<a
												key={ct.id}
												href={`/contacts/${ct.id}`}
												className="flex items-center justify-between p-3 hover:bg-muted rounded-md transition-colors"
											>
												<div>
													<p className="text-sm font-medium">
														{ct.firstName} {ct.lastName}
														{ct.isPrimary && (
															<Badge variant="outline" className="ml-2 text-xs">Principal</Badge>
														)}
													</p>
													<p className="text-xs text-muted-foreground">{ct.jobTitle}</p>
												</div>
												<div className="text-right">
													<p className="text-sm text-muted-foreground">{ct.email}</p>
													{ct.phone && <p className="text-xs text-muted-foreground">{ct.phone}</p>}
												</div>
											</a>
										))}
									</div>
								)}
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				<TabsContent value="deals">
					<div className="pt-4">
						<Card>
							<CardHeader>
								<CardTitle>Deals ({companyDeals.length})</CardTitle>
							</CardHeader>
							<CardContent>
								{companyDeals.length === 0 ? (
									<p className="py-6 text-center text-sm text-muted-foreground">Aucun deal associé</p>
								) : (
									<div className="divide-y">
										{companyDeals.map((d) => (
											<a
												key={d.id}
												href={`/deals/${d.id}`}
												className="flex items-center justify-between p-3 hover:bg-muted rounded-md transition-colors"
											>
												<div>
													<p className="text-sm font-medium">{d.title}</p>
													<p className="text-xs text-muted-foreground">
														{stageLabel[d.stage] ?? d.stage} · {d.assignedTo}
													</p>
												</div>
												<div className="text-right">
													<p className="text-sm font-semibold">{formatCurrency(d.amount)}</p>
													<p className="text-xs text-muted-foreground">{d.probability}%</p>
												</div>
											</a>
										))}
									</div>
								)}
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
								<ActivityTimeline events={recentActivities.slice(0, 6)} />
							</CardContent>
						</Card>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	)
}
