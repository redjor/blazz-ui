import type { Metadata } from "next"
import ExpensesPageClient from "./_client"

export const metadata: Metadata = {
	title: "Frais professionnels",
}

export default function ExpensesPage() {
	return <ExpensesPageClient />
}
