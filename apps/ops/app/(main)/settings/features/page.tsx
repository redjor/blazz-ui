import type { Metadata } from "next"
import FeaturesClient from "./_client"

export const metadata: Metadata = { title: "Fonctionnalités" }

export default function FeaturesPage() {
	return <FeaturesClient />
}
