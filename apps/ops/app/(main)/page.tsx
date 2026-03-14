import type { Metadata } from "next"
import DashboardPageClient from "./_client"

export const metadata: Metadata = {
	title: "Dashboard",
}

export default function DashboardPage() {
	return <DashboardPageClient />
}
