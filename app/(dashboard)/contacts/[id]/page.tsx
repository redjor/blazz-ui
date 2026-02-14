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
import { getContactById, formatDate, recentActivities } from "@/lib/sample-data"

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

	return (
		<div className="p-6 space-y-6">
			<PageHeader
				title={`${contact.firstName} ${contact.lastName}`}
				breadcrumbs={[
					{ label: "Dashboard", href: "/dashboard" },
					{ label: "Contacts", href: "/contacts" },
					{ label: `${contact.firstName} ${contact.lastName}` },
				]}
				actions={[
					{ label: "Modifier", href: `/contacts/${id}/edit`, icon: Edit, variant: "outline" },
				]}
			/>

			<div className="flex justify-end">
				<QuickLogActivity
					onLog={async ({ type, note }) => {
						const typeLabels = { call: "Appel", email: "Email", note: "Note", meeting: "RDV" }
						toast.success(`${typeLabels[type]} enregistré pour ${contact.firstName} ${contact.lastName} : ${note}`)
					}}
				/>
			</div>

			<DetailPanel>
				<DetailPanel.Header
					title={`${contact.firstName} ${contact.lastName}`}
					subtitle={contact.jobTitle}
					status={
						<Badge variant={statusVariant[contact.status] ?? "outline"}>
							{statusLabel[contact.status] ?? contact.status}
						</Badge>
					}
				/>

				<DetailPanel.Section title="Informations de contact">
					<FieldGrid columns={3}>
						<Field label="Prénom" value={contact.firstName} />
						<Field label="Nom" value={contact.lastName} />
						<Field label="Poste" value={contact.jobTitle ?? "—"} />
						<Field label="Email" value={contact.email} />
						<Field label="Téléphone" value={contact.phone ?? "—"} />
						<Field label="Contact principal" value={contact.isPrimary ? "Oui" : "Non"} />
					</FieldGrid>
				</DetailPanel.Section>

				<DetailPanel.Section title="Entreprise">
					<FieldGrid columns={2}>
						<Field
							label="Entreprise"
							value={
								<a href={`/companies/${contact.companyId}`} className="hover:underline">
									{contact.companyName}
								</a>
							}
						/>
						<Field label="Ajouté le" value={formatDate(contact.createdAt)} />
					</FieldGrid>
				</DetailPanel.Section>
			</DetailPanel>

			<Card>
				<CardHeader>
					<CardTitle>Historique</CardTitle>
				</CardHeader>
				<CardContent>
					<ActivityTimeline events={recentActivities.slice(0, 3)} />
				</CardContent>
			</Card>
		</div>
	)
}
