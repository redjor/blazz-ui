import type { Metadata } from "next"
import VeilleClient from "./_client"

export const metadata: Metadata = {
	title: "Veille",
}

export default function VeillePage() {
	return <VeilleClient />
}
