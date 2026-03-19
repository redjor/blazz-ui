import type { Metadata } from "next"
import { InvoiceEditorClient } from "@/components/invoice-editor"

export const metadata: Metadata = {
	title: "Facture",
}

export default async function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params
	return <InvoiceEditorClient invoiceId={id} />
}
