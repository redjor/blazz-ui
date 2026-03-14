import type { Metadata } from "next"
import RecapPageClient from "./_client"

export const metadata: Metadata = {
	title: "Récapitulatif",
}

export default function RecapPage() {
	return <RecapPageClient />
}
