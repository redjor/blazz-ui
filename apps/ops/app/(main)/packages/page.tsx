import type { Metadata } from "next"
import PackagesPageClient from "./_client"

export const metadata: Metadata = {
	title: "Packages",
}

export default function PackagesPage() {
	return <PackagesPageClient />
}
