import { createFileRoute } from "@tanstack/react-router"
import { DocPage } from "~/components/docs/doc-page"

export const Route = createFileRoute("/_docs/docs/blocks/quote-preview")({
	component: StubPage,
})

function StubPage() {
	return (
		<DocPage title="Quote Preview" subtitle="Documentation coming soon.">
			<p className="text-fg-muted">This page is under construction.</p>
		</DocPage>
	)
}
