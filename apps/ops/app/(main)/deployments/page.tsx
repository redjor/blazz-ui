import type { Metadata } from "next"
import DeploymentsPageClient from "./_client"

export const metadata: Metadata = {
	title: "Deployments",
}

export default function DeploymentsPage() {
	return <DeploymentsPageClient />
}
