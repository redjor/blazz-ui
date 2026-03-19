import type { Metadata } from "next"
import InvoicesPageClient from "./_client"

export const metadata: Metadata = {
	title: "Factures",
}

export default function InvoicesPage() {
	return <InvoicesPageClient />
}
