import type { Metadata } from "next"
import TodayPageClient from "./_client"

export const metadata: Metadata = {
	title: "Aujourd'hui",
}

export default function TodayPage() {
	return <TodayPageClient />
}
