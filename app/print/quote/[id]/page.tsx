import { notFound } from "next/navigation"
import { QuotePreview } from "@/components/blocks/quote-preview"
import { getQuoteById, getQuoteLines, getCompanyById } from "@/lib/sample-data"

export default async function PrintQuotePage({
	params,
}: {
	params: Promise<{ id: string }>
}) {
	const { id } = await params
	const quote = getQuoteById(id)

	if (!quote) notFound()

	const lines = getQuoteLines(id)
	const company = getCompanyById(
		// Find company ID from the quote's company name
		quote.companyName
	)

	return (
		<QuotePreview
			reference={quote.reference}
			date={quote.createdAt}
			validUntil={quote.validUntil}
			company={{
				name: quote.companyName,
				address: company?.address,
				city: company?.city,
				country: company?.country,
			}}
			lines={lines.map((l) => ({
				product: l.product,
				description: l.description,
				quantity: l.quantity,
				unitPrice: l.unitPrice,
			}))}
			notes="Paiement à 30 jours. Validité du devis : 30 jours à compter de la date d'émission."
		/>
	)
}
