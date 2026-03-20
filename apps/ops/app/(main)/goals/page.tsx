import type { Metadata } from "next"
import GoalsPageClient from "./_client"

export const metadata: Metadata = {
	title: "Objectifs",
}

export default function GoalsPage() {
	return <GoalsPageClient />
}
