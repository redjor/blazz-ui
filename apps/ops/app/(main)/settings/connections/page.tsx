import type { Metadata } from "next"
import { ConnectionsClient } from "./_client"

export const metadata: Metadata = {
	title: "Connexions",
}

export default function ConnectionsPage() {
	return <ConnectionsClient />
}
