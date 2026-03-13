import { FileCard } from "@blazz/ui/components/ai/generative/content/file-card"
import { createFileRoute } from "@tanstack/react-router"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"
import { highlightCode } from "~/lib/highlight-code"

const examples = [
	{
		key: "downloadable",
		code: `<FileCard
  name="Q4-Report.pdf"
  size="2.4 MB"
  type="PDF"
  href="/files/q4-report.pdf"
/>`,
	},
	{
		key: "multiple",
		code: `<div className="space-y-2">
  <FileCard name="proposal.docx" size="1.2 MB" type="Word" href="#" />
  <FileCard name="screenshot.png" size="340 KB" type="Image" href="#" />
  <FileCard name="data.json" size="18 KB" type="JSON" />
</div>`,
	},
] as const

export const Route = createFileRoute("/_docs/docs/ai/content/file-card")({
	loader: async () => {
		const highlighted = await Promise.all(
			examples.map(async (ex) => ({
				key: ex.key,
				html: await highlightCode({ data: { code: ex.code } }),
			}))
		)
		return { highlighted }
	},
	component: FileCardPage,
})

const toc = [{ id: "examples", title: "Examples" }]

function FileCardPage() {
	const { highlighted } = Route.useLoaderData()
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

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
				<DocExampleClient
					title="Downloadable File"
					description="File card with download link."
					code={examples[0].code}
					highlightedCode={html("downloadable")}
				>
					<div className="max-w-sm">
						<FileCard name="Q4-Report.pdf" size="2.4 MB" type="PDF" href="#" />
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Multiple Files"
					description="Stack file cards for a list of attachments."
					code={examples[1].code}
					highlightedCode={html("multiple")}
				>
					<div className="max-w-sm space-y-2">
						<FileCard name="proposal.docx" size="1.2 MB" type="Word" href="#" />
						<FileCard name="screenshot.png" size="340 KB" type="Image" href="#" />
						<FileCard name="data.json" size="18 KB" type="JSON" />
					</div>
				</DocExampleClient>
			</DocSection>
		</DocPage>
	)
}
