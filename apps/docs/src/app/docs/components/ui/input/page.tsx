"use client"

import { Input } from "@blazz/ui/components/ui/input"
import { Label } from "@blazz/ui/components/ui/label"
import { use } from "react"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { type DocProp, DocPropsTable } from "~/components/docs/doc-props-table"
import { DocSection } from "~/components/docs/doc-section"
import { highlightExamples } from "~/lib/highlight-examples"

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "props", title: "Props" },
	{ id: "tokens", title: "Design Tokens" },
	{ id: "guidelines", title: "Guidelines" },
]

const inputProps: DocProp[] = [
	{
		name: "type",
		type: "string",
		default: '"text"',
		description: "The type of input (text, email, password, number, etc.).",
	},
	{
		name: "placeholder",
		type: "string",
		description: "Placeholder text shown when input is empty.",
	},
	{
		name: "disabled",
		type: "boolean",
		default: "false",
		description: "Whether the input is disabled.",
	},
	{
		name: "aria-invalid",
		type: "boolean",
		description: "Indicates the input has an error.",
	},
]

const examples = [
	{
		key: "default",
		code: `<Input placeholder="Enter your name" />`,
	},
	{
		key: "with-label",
		code: `<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" placeholder="name@example.com" />
</div>`,
	},
	{
		key: "types",
		code: `<Input type="text" placeholder="Text" />
<Input type="email" placeholder="Email" />
<Input type="password" placeholder="Password" />
<Input type="number" placeholder="Number" />`,
	},
	{
		key: "file",
		code: `<Input type="file" />`,
	},
	{
		key: "disabled",
		code: `<Input disabled placeholder="Disabled input" />`,
	},
	{
		key: "error",
		code: `<Input aria-invalid placeholder="Invalid input" />`,
	},
] as const

const highlightedPromise = highlightExamples(examples as any)

export default function InputPage() {
	const highlighted = use(highlightedPromise)
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage title="Input" subtitle="Text input field for collecting user data. Supports various types like text, email, password, and more." toc={toc}>
			<DocHero>
				<Input placeholder="Enter your name" className="max-w-sm" />
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExampleClient title="Default" description="A basic text input field." code={examples[0].code} highlightedCode={html("default")}>
					<Input placeholder="Enter your name" className="max-w-sm" />
				</DocExampleClient>

				<DocExampleClient title="With Label" description="Input with an associated label for accessibility." code={examples[1].code} highlightedCode={html("with-label")}>
					<div className="max-w-sm space-y-2">
						<Label htmlFor="email">Email</Label>
						<Input id="email" type="email" placeholder="name@example.com" />
					</div>
				</DocExampleClient>

				<DocExampleClient title="Input Types" description="Different input types for various data formats." code={examples[2].code} highlightedCode={html("types")}>
					<div className="grid max-w-sm gap-4">
						<Input type="text" placeholder="Text input" />
						<Input type="email" placeholder="email@example.com" />
						<Input type="password" placeholder="Password" />
						<Input type="number" placeholder="0" />
					</div>
				</DocExampleClient>

				<DocExampleClient title="File Input" description="Input for file uploads." code={examples[3].code} highlightedCode={html("file")}>
					<Input type="file" className="max-w-sm" />
				</DocExampleClient>

				<DocExampleClient title="Disabled" description="Disabled inputs prevent user interaction." code={examples[4].code} highlightedCode={html("disabled")}>
					<Input disabled placeholder="Disabled input" className="max-w-sm" />
				</DocExampleClient>

				<DocExampleClient title="Error State" description="Show validation errors using aria-invalid." code={examples[5].code} highlightedCode={html("error")}>
					<Input aria-invalid placeholder="Invalid input" className="max-w-sm" />
				</DocExampleClient>
			</DocSection>

			<DocSection id="props" title="Props">
				<DocPropsTable props={inputProps} />
			</DocSection>

			<DocSection id="tokens" title="Design Tokens">
				<p className="text-sm text-fg-muted">Input uses the design system tokens for consistent styling:</p>
				<ul className="list-inside list-disc space-y-2 text-sm text-fg-muted">
					<li>
						<code className="text-xs">bg-card</code> - Input-specific background
					</li>
					<li>
						<code className="text-xs">border-edge</code> - Input-specific border color
					</li>
					<li>
						<code className="text-xs">text-sm</code> - Base font size with proper line height
					</li>
					<li>
						<code className="text-xs">rounded-lg</code> - Consistent border radius
					</li>
					<li>
						<code className="text-xs">shadow-p-inset</code> - Subtle inset shadow on focus
					</li>
				</ul>
			</DocSection>

			<DocSection id="guidelines" title="Guidelines">
				<ul className="list-inside list-disc space-y-2 text-sm text-fg-muted">
					<li>Always associate inputs with labels for accessibility</li>
					<li>Use appropriate input types for better mobile keyboards</li>
					<li>Provide clear placeholder text as hints, not labels</li>
					<li>Show validation errors inline near the input</li>
					<li>Use the Field component for complete form field layouts</li>
				</ul>
			</DocSection>
		</DocPage>
	)
}
