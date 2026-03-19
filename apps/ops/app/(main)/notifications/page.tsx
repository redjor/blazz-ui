import type { Metadata } from "next"
import NotificationsPageClient from "./_client"

export const metadata: Metadata = {
	title: "Notifications",
}

export default function NotificationsPage() {
	return <NotificationsPageClient />
}
