import type { Metadata } from "next"
import { AgentDetailClient } from "./_client"

export const metadata: Metadata = { title: "Agent — Paramètres" }

export default async function AgentDetailPage({
	params,
}: { params: Promise<{ slug: string }> }) {
	const { slug } = await params
	return <AgentDetailClient slug={slug} />
}
