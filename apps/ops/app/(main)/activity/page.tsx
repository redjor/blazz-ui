import type { Metadata } from "next"
import { ActivityClient } from "./_client"

export const metadata: Metadata = { title: "Activité — Blazz Ops" }

export default function ActivityPage() {
	return <ActivityClient />
}
