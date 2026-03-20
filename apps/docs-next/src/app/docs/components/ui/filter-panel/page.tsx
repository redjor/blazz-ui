"use client"

import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"

const toc = [{ id: "overview", title: "Overview" }]

export default function FilterPanelPage() {
	return (
		<DocPage
			title="Filter Panel"
			subtitle="A compact panel with tabs, sections, and checkbox filters. Ideal for faceted filtering in data-heavy interfaces."
			toc={toc}
		>
			<DocSection id="overview" title="Overview">
				<p className="text-sm text-fg-muted">
					FilterPanel documentation is being migrated. Interactive examples will be available soon.
				</p>
			</DocSection>
		</DocPage>
	)
}
