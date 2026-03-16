import type { Metadata } from "next"
import FinancesPageClient from "./_client"

export const metadata: Metadata = {
	title: "Finances",
}

export default function FinancesPage() {
	return <FinancesPageClient />
}
