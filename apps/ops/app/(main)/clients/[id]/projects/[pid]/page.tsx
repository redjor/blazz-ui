import type { Metadata } from "next"
import ProjectDetailPageClient from "./_client"

export const metadata: Metadata = {
	title: "Projet",
}

export default function ProjectDetailPage(props: { params: Promise<{ id: string; pid: string }> }) {
	return <ProjectDetailPageClient params={props.params} />
}
