import { createFileRoute } from "@tanstack/react-router"
import { DocPage } from "~/components/docs/doc-page"

export const Route = createFileRoute("/_docs/docs/blocks/stats-grid")({
	component: StubPage,
})

function StubPage() {
	return (
		<DocPage title="Stats Grid" subtitle="Documentation coming soon.">
			<p className="text-fg-muted">This page is under construction.</p>
		</DocPage>
	)
}
