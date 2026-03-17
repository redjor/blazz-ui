import type { Metadata } from "next"
import CategoriesPageClient from "./_client"

export const metadata: Metadata = {
	title: "Catégories — Paramètres",
}

export default function CategoriesPage() {
	return <CategoriesPageClient />
}
