import type { Metadata } from "next"
import TreasuryPageClient from "./_client"

export const metadata: Metadata = {
	title: "Trésorerie",
}

export default function TreasuryPage() {
	return <TreasuryPageClient />
}
