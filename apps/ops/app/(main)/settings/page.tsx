import type { Metadata } from "next"
import SettingsGeneralClient from "./_general-client"

export const metadata: Metadata = {
	title: "Paramètres",
}

export default function SettingsPage() {
	return <SettingsGeneralClient />
}
