import type { Metadata } from "next"
import { AgentOverviewClient } from "./_client"

export const metadata: Metadata = { title: "Agent — Blazz Ops" }

export default async function AgentOverviewPage({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params
	return <AgentOverviewClient slug={slug} />
}
