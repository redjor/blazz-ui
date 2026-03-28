"use client"

import { InlineEdit } from "@blazz/pro/components/blocks/inline-edit"
import { use, useState } from "react"
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
	{ id: "related", title: "Related" },
]

const inlineEditProps: DocProp[] = [
	{
		name: "value",
		type: "string",
		description: "Current display value.",
	},
	{
		name: "onSave",
		type: "(value: string) => void | Promise<void>",
		description: "Callback fired when the user confirms the edit (Enter, blur, or check icon).",
	},
	{
		name: "type",
		type: '"text" | "number"',
		default: '"text"',
		description: "HTML input type.",
	},
	{
		name: "placeholder",
		type: "string",
		default: '"—"',
		description: "Text shown when value is empty.",
	},
	{
		name: "className",
		type: "string",
		description: "Additional classes for the wrapper.",
	},
	{
		name: "inputClassName",
		type: "string",
		description: "Additional classes for the input element in edit mode.",
	},
	{
		name: "renderValue",
		type: "(value: string) => React.ReactNode",
		description: "Custom renderer for the display value in read mode.",
	},
]

const examples = [
	{
		key: "basic",
		code: `import { InlineEdit } from "@blazz/pro/components/blocks/inline-edit"

function BasicExample() {
  const [name, setName] = useState("Acme Corporation")

  return (
    <div className="space-y-1">
      <span className="text-xs text-fg-muted">Nom de l'entreprise</span>
      <InlineEdit value={name} onSave={setName} />
    </div>
  )
}`,
	},
	{
		key: "number",
		code: `import { InlineEdit } from "@blazz/pro/components/blocks/inline-edit"

function NumberExample() {
  const [amount, setAmount] = useState("45000")

  return (
    <div className="space-y-1">
      <span className="text-xs text-fg-muted">Montant (€)</span>
      <InlineEdit
        value={amount}
        onSave={setAmount}
        type="number"
        placeholder="0"
      />
    </div>
  )
}`,
	},
	{
		key: "custom-render",
		code: `import { InlineEdit } from "@blazz/pro/components/blocks/inline-edit"

function CustomRenderExample() {
  const [status, setStatus] = useState("En cours")

  return (
    <div className="space-y-1">
      <span className="text-xs text-fg-muted">Statut du projet</span>
      <InlineEdit
        value={status}
        onSave={setStatus}
        renderValue={(v) => (
          <span className="font-semibold text-brand">{v}</span>
        )}
      />
    </div>
  )
}`,
	},
] as const

const highlightedPromise = highlightExamples(examples as any)

function HeroDemo() {
	const [company, setCompany] = useState("Acme Corporation")
	const [revenue, setRevenue] = useState("12500000")
	const [contact, setContact] = useState("Jean Dupont")

	return (
		<div className="w-full max-w-2xl rounded-lg border border-edge bg-card overflow-hidden p-4">
			<div className="space-y-4">
				<div className="space-y-1">
					<span className="text-xs text-fg-muted">Entreprise</span>
					<InlineEdit value={company} onSave={setCompany} />
				</div>
				<div className="space-y-1">
					<span className="text-xs text-fg-muted">Chiffre d'affaires</span>
					<InlineEdit value={revenue} onSave={setRevenue} type="number" renderValue={(v) => <span className="font-semibold text-fg">{Number(v).toLocaleString("fr-FR")} €</span>} />
				</div>
				<div className="space-y-1">
					<span className="text-xs text-fg-muted">Contact principal</span>
					<InlineEdit value={contact} onSave={setContact} />
				</div>
			</div>
		</div>
	)
}

function BasicDemo() {
	const [name, setName] = useState("Acme Corporation")

	return (
		<div className="space-y-1">
			<span className="text-xs text-fg-muted">Nom de l'entreprise</span>
			<InlineEdit value={name} onSave={setName} />
		</div>
	)
}

function NumberDemo() {
	const [amount, setAmount] = useState("45000")

	return (
		<div className="space-y-1">
			<span className="text-xs text-fg-muted">Montant (€)</span>
			<InlineEdit value={amount} onSave={setAmount} type="number" placeholder="0" />
		</div>
	)
}

function CustomRenderDemo() {
	const [status, setStatus] = useState("En cours")

	return (
		<div className="space-y-1">
			<span className="text-xs text-fg-muted">Statut du projet</span>
			<InlineEdit value={status} onSave={setStatus} renderValue={(v) => <span className="font-semibold text-brand">{v}</span>} />
		</div>
	)
}

export default function InlineEditPage() {
	const highlighted = use(highlightedPromise)
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage title="Inline Edit" subtitle="Click-to-edit field that toggles between read and edit mode. Saves on Enter or blur, cancels on Escape." toc={toc}>
			{/* Hero */}
			<DocHero>
				<HeroDemo />
			</DocHero>

			{/* Examples */}
			<DocSection id="examples" title="Examples">
				<DocExampleClient title="Basic Text" description="Click the value to edit. Press Enter to save, Escape to cancel." code={examples[0].code} highlightedCode={html("basic")}>
					<BasicDemo />
				</DocExampleClient>

				<DocExampleClient
					title="Number Type"
					description="Use type='number' for numeric fields. The input shows a numeric keyboard on mobile."
					code={examples[1].code}
					highlightedCode={html("number")}
				>
					<NumberDemo />
				</DocExampleClient>

				<DocExampleClient
					title="Custom Render"
					description="Use renderValue to customize how the value is displayed in read mode (bold, colored, formatted)."
					code={examples[2].code}
					highlightedCode={html("custom-render")}
				>
					<CustomRenderDemo />
				</DocExampleClient>
			</DocSection>

			{/* Props */}
			<DocSection id="props" title="Props">
				<DocPropsTable props={inlineEditProps} />
			</DocSection>

			{/* Related */}
			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{
							title: "Detail Panel",
							href: "/docs/blocks/detail-panel",
							description: "Side panel for entity details with inline editing.",
						},
						{
							title: "PropertyCard",
							href: "/docs/blocks/property-card",
							description: "Key-value card — pair with InlineEdit for editable fields.",
						},
						{
							title: "Data Table",
							href: "/docs/blocks/data-table",
							description: "Tabular data with inline cell editing support.",
						},
					]}
				/>
			</DocSection>
		</DocPage>
	)
}
