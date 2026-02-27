"use client"

import Link from "next/link"
import { notFound } from "next/navigation"
import { use } from "react"
import { toast } from "sonner"
import { Edit } from "lucide-react"
import { DetailPanel } from "@blazz/ui/components/blocks/detail-panel"
import { FieldGrid, Field } from "@blazz/ui/components/patterns/field-grid"
import { ActivityTimeline } from "@blazz/ui/components/blocks/activity-timeline"
import { QuickLogActivity } from "@blazz/ui/components/blocks/quick-log-activity"
import { Badge } from "@blazz/ui/components/ui/badge"
import {
	Breadcrumb,
	BreadcrumbList,
	BreadcrumbItem as BreadcrumbItemPrimitive,
	BreadcrumbLink,
	BreadcrumbSeparator,
	BreadcrumbPage,
} from "@blazz/ui/components/ui/breadcrumb"
import { buttonVariants } from "@blazz/ui/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@blazz/ui/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@blazz/ui/components/ui/tabs"
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
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItemPrimitive>
						<BreadcrumbLink href="/examples/crm/dashboard">Dashboard</BreadcrumbLink>
					</BreadcrumbItemPrimitive>
					<BreadcrumbSeparator />
					<BreadcrumbItemPrimitive>
						<BreadcrumbLink href="/examples/crm/companies">Entreprises</BreadcrumbLink>
					</BreadcrumbItemPrimitive>
					<BreadcrumbSeparator />
					<BreadcrumbItemPrimitive>
						<BreadcrumbPage>{company.name}</BreadcrumbPage>
					</BreadcrumbItemPrimitive>
				</BreadcrumbList>
			</Breadcrumb>

			<div className="flex items-start justify-between gap-4">
				<DetailPanel.Header
					title={company.name}
					subtitle={company.domain}
					status={
						<Badge variant={statusVariant[company.status] ?? "outline"}>
							{statusLabel[company.status] ?? company.status}
						</Badge>
					}
					className="border-b-0 pb-0"
				/>
				<div className="flex items-center gap-2">
					<QuickLogActivity
						onLog={async ({ type, note }) => {
							const typeLabels = { call: "Appel", email: "Email", note: "Note", meeting: "RDV" }
							toast.success(`${typeLabels[type]} enregistré pour ${company.name} : ${note}`)
						}}
					/>
					<Link
						href={`/companies/${id}/edit`}
						className={buttonVariants({ variant: "outline", size: "sm" })}
					>
						<Edit className="size-4" data-icon="inline-start" />
						Modifier
					</Link>
				</div>
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
									<p className="py-6 text-center text-sm text-fg-muted">Aucun contact associé</p>
								) : (
									<div className="divide-y">
										{companyContacts.map((ct) => (
											<a
												key={ct.id}
												href={`/contacts/${ct.id}`}
												className="flex items-center justify-between p-3 hover:bg-raised rounded-md transition-colors"
											>
												<div>
													<p className="text-sm font-medium">
														{ct.firstName} {ct.lastName}
														{ct.isPrimary && (
															<Badge variant="outline" className="ml-2 text-xs">Principal</Badge>
														)}
													</p>
													<p className="text-xs text-fg-muted">{ct.jobTitle}</p>
												</div>
												<div className="text-right">
													<p className="text-sm text-fg-muted">{ct.email}</p>
													{ct.phone && <p className="text-xs text-fg-muted">{ct.phone}</p>}
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
									<p className="py-6 text-center text-sm text-fg-muted">Aucun deal associé</p>
								) : (
									<div className="divide-y">
										{companyDeals.map((d) => (
											<a
												key={d.id}
												href={`/deals/${d.id}`}
												className="flex items-center justify-between p-3 hover:bg-raised rounded-md transition-colors"
											>
												<div>
													<p className="text-sm font-medium">{d.title}</p>
													<p className="text-xs text-fg-muted">
														{stageLabel[d.stage] ?? d.stage} · {d.assignedTo}
													</p>
												</div>
												<div className="text-right">
													<p className="text-sm font-semibold">{formatCurrency(d.amount)}</p>
													<p className="text-xs text-fg-muted">{d.probability}%</p>
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
