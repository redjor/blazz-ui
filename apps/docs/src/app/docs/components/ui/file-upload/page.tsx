"use client"

import { FileUpload } from "@blazz/ui/components/ui/file-upload"
import { use } from "react"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { type DocProp, DocPropsTable } from "~/components/docs/doc-props-table"
import { DocRelated } from "~/components/docs/doc-related"
import { DocSection } from "~/components/docs/doc-section"
import { highlightExamples } from "~/lib/highlight-examples"
import { ControlledFileUploadDemo } from "./demos"

const examples = [
	{
		key: "default",
		code: `<FileUpload />`,
	},
	{
		key: "multiple",
		code: `<FileUpload multiple />`,
	},
	{
		key: "restrictions",
		code: `<FileUpload
  accept="image/*,.pdf"
  maxSize={5 * 1024 * 1024}
  maxFiles={3}
  multiple
  description="Images or PDF, max 5MB each, up to 3 files"
/>`,
	},
	{
		key: "controlled",
		code: `const [files, setFiles] = React.useState<File[]>([])

<FileUpload
  value={files}
  onValueChange={setFiles}
  multiple
/>
<p>{files.length} file(s) selected</p>`,
	},
	{
		key: "disabled",
		code: `<FileUpload disabled />`,
	},
] as const

const highlightedPromise = highlightExamples(examples as any)

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "props", title: "Props" },
	{ id: "guidelines", title: "Guidelines" },
	{ id: "related", title: "Related" },
]

const fileUploadProps: DocProp[] = [
	{
		name: "value",
		type: "File[]",
		default: "[]",
		description: "Controlled array of selected files.",
	},
	{
		name: "onValueChange",
		type: "(files: File[]) => void",
		description: "Callback when the file list changes.",
	},
	{
		name: "accept",
		type: "string",
		description: 'Accepted file types (e.g. "image/*,.pdf").',
	},
	{
		name: "multiple",
		type: "boolean",
		default: "false",
		description: "Allow multiple file selection.",
	},
	{
		name: "maxSize",
		type: "number",
		description: "Maximum file size in bytes.",
	},
	{
		name: "maxFiles",
		type: "number",
		description: "Maximum number of files allowed.",
	},
	{
		name: "disabled",
		type: "boolean",
		default: "false",
		description: "Whether the upload area is disabled.",
	},
	{
		name: "placeholder",
		type: "string",
		default: '"Drag and drop files here, or click to browse"',
		description: "Placeholder text displayed in the drop zone.",
	},
	{
		name: "description",
		type: "string",
		description: "Description text below the placeholder.",
	},
]

export default function FileUploadPage() {
	const highlighted = use(highlightedPromise)
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage title="FileUpload" subtitle="A drag-and-drop file upload area with click-to-browse support and file list management." toc={toc}>
			<DocHero>
				<FileUpload accept="image/*" description="PNG, JPG up to 10MB" className="max-w-md" />
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExampleClient title="Default" description="A basic file upload drop zone." code={examples[0].code} highlightedCode={html("default")}>
					<FileUpload className="max-w-md" />
				</DocExampleClient>

				<DocExampleClient title="Multiple Files" description="Allow users to select multiple files." code={examples[1].code} highlightedCode={html("multiple")}>
					<FileUpload multiple className="max-w-md" />
				</DocExampleClient>

				<DocExampleClient title="With Restrictions" description="Restrict accepted file types, max size, and max number of files." code={examples[2].code} highlightedCode={html("restrictions")}>
					<FileUpload accept="image/*,.pdf" maxSize={5 * 1024 * 1024} maxFiles={3} multiple description="Images or PDF, max 5MB each, up to 3 files" className="max-w-md" />
				</DocExampleClient>

				<DocExampleClient title="Controlled" description="Manage the file list programmatically." code={examples[3].code} highlightedCode={html("controlled")}>
					<ControlledFileUploadDemo />
				</DocExampleClient>

				<DocExampleClient title="Disabled" description="Disabled file uploads prevent interaction." code={examples[4].code} highlightedCode={html("disabled")}>
					<FileUpload disabled className="max-w-md" />
				</DocExampleClient>
			</DocSection>

			<DocSection id="props" title="Props">
				<DocPropsTable props={fileUploadProps} />
			</DocSection>

			<DocSection id="guidelines" title="Guidelines">
				<ul className="list-inside list-disc space-y-2 text-sm text-fg-muted">
					<li>Always specify accepted file types to guide users</li>
					<li>Provide a description with size limits and allowed formats</li>
					<li>Use maxSize and maxFiles to prevent oversized uploads</li>
					<li>Show uploaded file names and sizes to confirm selection</li>
					<li>Consider adding upload progress indicators for large files</li>
				</ul>
			</DocSection>

			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{
							title: "Input",
							href: "/docs/components/ui/input",
							description: "Base input with type='file' for simple file selection.",
						},
					]}
				/>
			</DocSection>
		</DocPage>
	)
}
