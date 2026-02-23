"use client"

import { DocPage } from "@/components/features/docs/doc-page"
import { DocSection } from "@/components/features/docs/doc-section"
import { DocHero } from "@/components/features/docs/doc-hero"
import { DocExampleSync as DocExample } from "@/components/features/docs/doc-example-client"
import { FileCard } from "@/components/ai/generative/content/file-card"

const toc = [{ id: "examples", title: "Examples" }]

export default function FileCardPage() {
	return (
		<DocPage
			title="File Card"
			subtitle="Displays an attached file with icon, size and optional download link."
			toc={toc}
		>
			<DocHero>
				<div className="max-w-sm space-y-2">
					<FileCard name="Q4-Report.pdf" size="2.4 MB" type="PDF" href="#" />
					<FileCard name="contacts-export.csv" size="840 KB" type="CSV" href="#" />
				</div>
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExample
					title="Downloadable File"
					description="File card with download link."
					code={`<FileCard
  name="Q4-Report.pdf"
  size="2.4 MB"
  type="PDF"
  href="/files/q4-report.pdf"
/>`}
				>
					<div className="max-w-sm">
						<FileCard name="Q4-Report.pdf" size="2.4 MB" type="PDF" href="#" />
					</div>
				</DocExample>

				<DocExample
					title="Multiple Files"
					description="Stack file cards for a list of attachments."
					code={`<div className="space-y-2">
  <FileCard name="proposal.docx" size="1.2 MB" type="Word" href="#" />
  <FileCard name="screenshot.png" size="340 KB" type="Image" href="#" />
  <FileCard name="data.json" size="18 KB" type="JSON" />
</div>`}
				>
					<div className="max-w-sm space-y-2">
						<FileCard name="proposal.docx" size="1.2 MB" type="Word" href="#" />
						<FileCard name="screenshot.png" size="340 KB" type="Image" href="#" />
						<FileCard name="data.json" size="18 KB" type="JSON" />
					</div>
				</DocExample>
			</DocSection>
		</DocPage>
	)
}
