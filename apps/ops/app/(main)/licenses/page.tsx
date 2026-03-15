import type { Metadata } from "next"
import LicensesPageClient from "./_client"

export const metadata: Metadata = {
	title: "Licences",
}

export default function LicensesPage() {
	return <LicensesPageClient />
}
