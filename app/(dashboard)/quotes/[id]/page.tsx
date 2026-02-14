"use client"

import { notFound } from "next/navigation"
import { use } from "react"
import { toast } from "sonner"
import { Printer, Send } from "lucide-react"
import { PageHeader } from "@/components/blocks/page-header"
import { DetailPanel } from "@/components/blocks/detail-panel"
import { FieldGrid, Field } from "@/components/blocks/field-grid"
import { DealLinesEditor, type DealLine } from "@/components/blocks/deal-lines-editor"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { getQuoteById, getQuoteLines, formatCurrency, formatDate } from "@/lib/sample-data"

const statusVariant: Record<string, "success" | "info" | "warning" | "critical" | "outline"> = {
	draft: "outline",
	sent: "info",
	accepted: "success",
	rejected: "critical",
	expired: "warning",
}

const statusLabel: Record<string, string> = {
	draft: "Brouillon",
	sent: "Envoyé",
	accepted: "Accepté",
	rejected: "Rejeté",
	expired: "Expiré",
}

export default function QuoteDetailPage({
	params,
}: {
	params: Promise<{ id: string }>
}) {
	const { id } = use(params)
	const quote = getQuoteById(id)

	if (!quote) notFound()

	const lines = getQuoteLines(id)
	const dealLines: DealLine[] = lines.map((l) => ({
		id: l.id,
		product: l.product,
		description: l.description,
		quantity: l.quantity,
		unitPrice: l.unitPrice,
	}))

	return (
		<div className="p-6 space-y-6">
			<PageHeader
				title={quote.reference}
				breadcrumbs={[
					{ label: "Dashboard", href: "/dashboard" },
					{ label: "Devis", href: "/quotes" },
					{ label: quote.reference },
				]}
				actions={[
					{ label: "Imprimer", href: `/print/quote/${id}`, icon: Printer, variant: "outline" },
					{
						label: "Envoyer",
						onClick: () => toast.success(`Devis ${quote.reference} envoyé`),
						icon: Send,
					},
				]}
			/>

			<DetailPanel>
				<DetailPanel.Header
					title={quote.reference}
					subtitle={quote.dealTitle}
					status={
						<Badge variant={statusVariant[quote.status] ?? "outline"}>
							{statusLabel[quote.status] ?? quote.status}
						</Badge>
					}
				/>

				<DetailPanel.Section title="Informations du devis">
					<FieldGrid columns={3}>
						<Field label="Entreprise" value={quote.companyName} />
						<Field label="Deal associé" value={quote.dealTitle} />
						<Field label="Montant total" value={formatCurrency(quote.total)} />
						<Field label="Valide jusqu'au" value={formatDate(quote.validUntil)} />
						<Field label="Créé par" value={quote.createdBy} />
						<Field label="Créé le" value={formatDate(quote.createdAt)} />
					</FieldGrid>
				</DetailPanel.Section>
			</DetailPanel>

			{/* Quote line items */}
			{dealLines.length > 0 && (
				<Card>
					<CardHeader>
						<CardTitle>Lignes du devis</CardTitle>
					</CardHeader>
					<CardContent>
						<DealLinesEditor lines={dealLines} onChange={() => {}} readOnly />
					</CardContent>
				</Card>
			)}
		</div>
	)
}
