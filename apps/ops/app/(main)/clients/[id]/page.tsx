import type { Metadata } from "next"
import ClientDetailPageClient from "./_client"

export const metadata: Metadata = {
	title: "Client",
}

export default function ClientDetailPage(props: { params: Promise<{ id: string }> }) {
	return <ClientDetailPageClient params={props.params} />
}
