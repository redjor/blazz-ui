"use client"

import { use } from "react"
import type { AttachmentData } from "@blazz/pro/components/ai/chat/attachments"
import {
	Attachment,
	AttachmentInfo,
	AttachmentPreview,
	AttachmentRemove,
	Attachments,
} from "@blazz/pro/components/ai/chat/attachments"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"
import { highlightExamples } from "~/lib/highlight-examples"

const examples = [
	{
		key: "grid",
		code: `<Attachments variant="grid">
  <Attachment data={file} onRemove={() => {}}>
    <AttachmentPreview />
    <AttachmentRemove />
  </Attachment>
</Attachments>`,
	},
	{
		key: "inline",
		code: `<Attachments variant="inline">
  <Attachment data={file} onRemove={() => {}}>
    <AttachmentPreview />
    <AttachmentInfo />
    <AttachmentRemove />
  </Attachment>
</Attachments>`,
	},
	{
		key: "list",
		code: `<Attachments variant="list">
  <Attachment data={file} onRemove={() => {}}>
    <AttachmentPreview />
    <AttachmentInfo showMediaType />
    <AttachmentRemove />
  </Attachment>
</Attachments>`,
	},
] as const

const highlightedPromise = highlightExamples(examples as any)

const toc = [{ id: "examples", title: "Examples" }]

const mockFiles: AttachmentData[] = [
	{
		id: "1",
		type: "file" as const,
		filename: "screenshot.png",
		mediaType: "image/png",
		url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=200&h=200&fit=crop",
	},
	{
		id: "2",
		type: "file" as const,
		filename: "report.pdf",
		mediaType: "application/pdf",
		url: "",
	},
	{
		id: "3",
		type: "file" as const,
		filename: "data.csv",
		mediaType: "text/csv",
		url: "",
	},
]

export default function AttachmentsPage() {
	const highlighted = use(highlightedPromise)
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="Attachments"
			subtitle="Display file attachments in grid, inline, or list layouts with previews and remove actions."
			toc={toc}
		>
			<DocHero>
				<div className="w-full max-w-lg">
					<Attachments variant="grid">
						{mockFiles.map((file) => (
							<Attachment key={file.id} data={file} onRemove={() => {}}>
								<AttachmentPreview />
								<AttachmentRemove />
							</Attachment>
						))}
					</Attachments>
				</div>
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExampleClient
					title="Grid Variant"
					description="Displays attachments as a grid of square thumbnails. Ideal for image-heavy content."
					code={examples[0].code}
					highlightedCode={html("grid")}
				>
					<Attachments variant="grid">
						{mockFiles.map((file) => (
							<Attachment key={file.id} data={file} onRemove={() => {}}>
								<AttachmentPreview />
								<AttachmentRemove />
							</Attachment>
						))}
					</Attachments>
				</DocExampleClient>

				<DocExampleClient
					title="Inline Variant"
					description="Compact inline chips suitable for embedding in a prompt input area."
					code={examples[1].code}
					highlightedCode={html("inline")}
				>
					<Attachments variant="inline">
						{mockFiles.map((file) => (
							<Attachment key={file.id} data={file} onRemove={() => {}}>
								<AttachmentPreview />
								<AttachmentInfo />
								<AttachmentRemove />
							</Attachment>
						))}
					</Attachments>
				</DocExampleClient>

				<DocExampleClient
					title="List Variant"
					description="Full-width list items with file info and media type details."
					code={examples[2].code}
					highlightedCode={html("list")}
				>
					<Attachments variant="list">
						{mockFiles.map((file) => (
							<Attachment key={file.id} data={file} onRemove={() => {}}>
								<AttachmentPreview />
								<AttachmentInfo showMediaType />
								<AttachmentRemove />
							</Attachment>
						))}
					</Attachments>
				</DocExampleClient>
			</DocSection>
		</DocPage>
	)
}
