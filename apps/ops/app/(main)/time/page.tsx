import type { Metadata } from "next"
import TimePageClient from "./_client"

export const metadata: Metadata = {
	title: "Suivi de temps",
}

export default function TimePage() {
	return <TimePageClient />
}
