import type { Metadata } from "next"
import { MissionsClient } from "./_client"

export const metadata: Metadata = { title: "Mission Control — Blazz Ops" }

export default function MissionsPage() {
	return <MissionsClient />
}
