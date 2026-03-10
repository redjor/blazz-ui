import { createFileRoute } from "@tanstack/react-router"
import { DocPage } from "~/components/docs/doc-page"

export const Route = createFileRoute("/_docs/docs/blocks/multi-step-form")({
	component: StubPage,
})

function StubPage() {
	return (
		<DocPage title="Multi Step Form" subtitle="Documentation coming soon.">
			<p className="text-fg-muted">This page is under construction.</p>
		</DocPage>
	)
}
