import type { Metadata } from "next"
import { AgentsSettingsClient } from "./_client"

export const metadata: Metadata = { title: "Agents — Paramètres" }

export default function AgentsSettingsPage() {
	return <AgentsSettingsClient />
}
