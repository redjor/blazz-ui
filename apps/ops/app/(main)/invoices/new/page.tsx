import type { Metadata } from "next"
import { InvoiceEditorClient } from "@/components/invoice-editor"

export const metadata: Metadata = {
	title: "Nouvelle facture",
}

export default function NewInvoicePage() {
	return <InvoiceEditorClient />
}
