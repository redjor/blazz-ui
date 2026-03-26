import type { Metadata } from "next"
import { AgentChatClient } from "./_client"

export const metadata: Metadata = { title: "Agent — Blazz Ops" }

export default async function AgentChatPage({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params
	return <AgentChatClient slug={slug} />
}
