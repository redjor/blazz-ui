import type { Metadata } from "next"
import SourcesClient from "./_client"

export const metadata: Metadata = {
	title: "Sources - Veille",
}

export default function SourcesPage() {
	return <SourcesClient />
}
