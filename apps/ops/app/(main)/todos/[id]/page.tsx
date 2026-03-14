import type { Metadata } from "next"
import TodoDetailPageClient from "./_client"

export const metadata: Metadata = {
	title: "Todo",
}

export default function TodoDetailPage() {
	return <TodoDetailPageClient />
}
