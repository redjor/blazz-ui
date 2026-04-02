import type { Metadata } from "next"
import { ConnectionDetailClient } from "./_client"

export const metadata: Metadata = {
	title: "Configuration connexion",
}

export default async function ConnectionDetailPage({ params }: { params: Promise<{ provider: string }> }) {
	const { provider } = await params
	return <ConnectionDetailClient providerId={provider} />
}
