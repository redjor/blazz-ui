"use client"
import { use } from "react"

import { SearchInput } from "@blazz/ui/components/ui/search-input"
import * as React from "react"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { type DocProp, DocPropsTable } from "~/components/docs/doc-props-table"
import { DocRelated } from "~/components/docs/doc-related"
import { DocSection } from "~/components/docs/doc-section"
import { highlightExamples } from "~/lib/highlight-examples"

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "props", title: "Props" },
	{ id: "guidelines", title: "Guidelines" },
	{ id: "related", title: "Related" },
]

const searchInputProps: DocProp[] = [
	{
		name: "onClear",
		type: "() => void",
		description:
			"Callback when the clear button is clicked. The clear button is only visible when a value is present.",
	},
	{
		name: "value",
		type: "string",
		description: "Controlled value of the input.",
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
]

const examples = [
	{
		key: "default",
		code: `<SearchInput placeholder="Search..." />`,
	},
	{
		key: "with-clear",
		code: `const [value, setValue] = React.useState("design tokens")

<SearchInput
  placeholder="Search..."
  value={value}
  onChange={(e) => setValue(e.target.value)}
  onClear={() => setValue("")}
/>`,
	},
	{
		key: "disabled",
		code: `<SearchInput disabled placeholder="Search..." />`,
	},
] as const

const highlightedPromise = highlightExamples(examples as any)

function SearchInputWithClearDemo() {
	const [value, setValue] = React.useState("design tokens")

	return (
		<div className="max-w-sm space-y-2">
			<SearchInput
				placeholder="Search..."
				value={value}
				onChange={(e) => setValue(e.target.value)}
				onClear={() => setValue("")}
			/>
			<p className="text-xs text-fg-muted">Value: {value || "(empty)"}</p>
		</div>
	)
}

export default function SearchInputPage() {
	const highlighted = use(highlightedPromise)
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="SearchInput"
			subtitle="A text input with a search icon and optional clear button for search interactions."
			toc={toc}
		>
			{/* Hero */}
			<DocHero>
				<SearchInput placeholder="Search..." className="max-w-sm" />
			</DocHero>

			{/* Examples */}
			<DocSection id="examples" title="Examples">
				<DocExampleClient
					title="Default"
					description="A basic search input with a search icon."
					code={examples[0].code}
					highlightedCode={html("default")}
				>
					<SearchInput placeholder="Search..." className="max-w-sm" />
				</DocExampleClient>

				<DocExampleClient
					title="With Clear"
					description="When a value is present and onClear is provided, a clear button appears."
					code={examples[1].code}
					highlightedCode={html("with-clear")}
				>
					<SearchInputWithClearDemo />
				</DocExampleClient>

				<DocExampleClient
					title="Disabled"
					description="Disabled search inputs prevent user interaction."
					code={examples[2].code}
					highlightedCode={html("disabled")}
				>
					<SearchInput disabled placeholder="Search..." className="max-w-sm" />
				</DocExampleClient>
			</DocSection>

			{/* Props */}
			<DocSection id="props" title="Props">
				<DocPropsTable props={searchInputProps} />
			</DocSection>

			{/* Guidelines */}
			<DocSection id="guidelines" title="Guidelines">
				<ul className="list-inside list-disc space-y-2 text-sm text-fg-muted">
					<li>Use for filtering or searching through content</li>
					<li>Always provide the onClear callback to let users easily reset the search</li>
					<li>Consider debouncing the search callback for performance</li>
					<li>Provide helpful placeholder text that describes what can be searched</li>
				</ul>
			</DocSection>

			{/* Related */}
			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{
							title: "Input",
							href: "/docs/components/ui/input",
							description: "Base text input for general data collection.",
						},
						{
							title: "PasswordInput",
							href: "/docs/components/ui/password-input",
							description: "Specialized input for password fields with visibility toggle.",
						},
					]}
				/>
			</DocSection>
		</DocPage>
	)
}
