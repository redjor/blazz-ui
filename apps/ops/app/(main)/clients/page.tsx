import type { Metadata } from "next"
import ClientsPageClient from "./_client"

export const metadata: Metadata = {
	title: "Clients",
}

export default function ClientsPage() {
	return <ClientsPageClient />
}
