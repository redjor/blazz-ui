"use client"

import { DocPage } from "@/components/features/docs/doc-page"
import { DocSection } from "@/components/features/docs/doc-section"
import { DocHero } from "@/components/features/docs/doc-hero"
import { DocExampleSync as DocExample } from "@/components/features/docs/doc-example-client"
import {
	Attachments,
	Attachment,
	AttachmentPreview,
	AttachmentInfo,
	AttachmentRemove,
} from "@/components/ai-elements/attachments"
import type { AttachmentData } from "@/components/ai-elements/attachments"

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
				<DocExample
					title="Grid Variant"
					description="Displays attachments as a grid of square thumbnails. Ideal for image-heavy content."
					code={`<Attachments variant="grid">
  <Attachment data={file} onRemove={() => {}}>
    <AttachmentPreview />
    <AttachmentRemove />
  </Attachment>
</Attachments>`}
				>
					<Attachments variant="grid">
						{mockFiles.map((file) => (
							<Attachment key={file.id} data={file} onRemove={() => {}}>
								<AttachmentPreview />
								<AttachmentRemove />
							</Attachment>
						))}
					</Attachments>
				</DocExample>

				<DocExample
					title="Inline Variant"
					description="Compact inline chips suitable for embedding in a prompt input area."
					code={`<Attachments variant="inline">
  <Attachment data={file} onRemove={() => {}}>
    <AttachmentPreview />
    <AttachmentInfo />
    <AttachmentRemove />
  </Attachment>
</Attachments>`}
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
				</DocExample>

				<DocExample
					title="List Variant"
					description="Full-width list items with file info and media type details."
					code={`<Attachments variant="list">
  <Attachment data={file} onRemove={() => {}}>
    <AttachmentPreview />
    <AttachmentInfo showMediaType />
    <AttachmentRemove />
  </Attachment>
</Attachments>`}
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
				</DocExample>
			</DocSection>
		</DocPage>
	)
}
