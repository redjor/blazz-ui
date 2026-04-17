import type { Metadata } from "next"
import { MissionControlClient } from "./_client"

export const metadata: Metadata = { title: "Mission Control — Blazz Ops" }

export default function MissionControlPage() {
	return <MissionControlClient />
}
