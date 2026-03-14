import type { Metadata } from "next"
import ProjectsPageClient from "./_client"

export const metadata: Metadata = {
	title: "Projets",
}

export default function ProjectsPage() {
	return <ProjectsPageClient />
}
