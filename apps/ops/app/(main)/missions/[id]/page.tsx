import type { Metadata } from "next"
import { MissionDetailClient } from "./_client"

export const metadata: Metadata = { title: "Mission — Blazz Ops" }

export default async function MissionDetailPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params
	return <MissionDetailClient id={id} />
}
