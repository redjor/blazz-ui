import type { Metadata } from "next"
import TodosPageClient from "./_client"

export const metadata: Metadata = {
	title: "Todos",
}

export default function TodosPage() {
	return <TodosPageClient />
}
