"use client"

import type { DealLine } from "@blazz/pro/components/blocks/deal-lines-editor"
import { DealLinesEditor } from "@blazz/pro/components/blocks/deal-lines-editor"
import { use, useState } from "react"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { type DocProp, DocPropsTable } from "~/components/docs/doc-props-table"
import { DocRelated } from "~/components/docs/doc-related"
import { DocSection } from "~/components/docs/doc-section"
import { highlightExamples } from "~/lib/highlight-examples"

// ---------------------------------------------------------------------------
// Sample data
// ---------------------------------------------------------------------------

const sampleLines: DealLine[] = [
	{
		id: "line-1",
		product: "Audit SI",
		description: "Audit complet de l'infrastructure existante",
		quantity: 1,
		unitPrice: 4500,
	},
	{
		id: "line-2",
		product: "Développement sur mesure",
		description: "Module de gestion des commandes",
		quantity: 15,
		unitPrice: 850,
	},
	{
		id: "line-3",
		product: "Formation utilisateurs",
		description: "Session de 2 jours pour l'équipe commerciale",
		quantity: 2,
		unitPrice: 1200,
	},
]

const readOnlyLines: DealLine[] = [
	{
		id: "ro-1",
		product: "Licence ERP Cloud",
		description: "Abonnement annuel — 50 utilisateurs",
		quantity: 1,
		unitPrice: 18000,
	},
	{
		id: "ro-2",
		product: "Support Premium",
		description: "SLA 4h — support téléphonique et email",
		quantity: 12,
		unitPrice: 450,
	},
	{
		id: "ro-3",
		product: "Migration de données",
		description: "Import depuis l'ancien système (Oracle)",
		quantity: 1,
		unitPrice: 6500,
	},
]

const usdLines: DealLine[] = [
	{
		id: "usd-1",
		product: "API Integration",
		description: "REST API connector for Salesforce",
		quantity: 1,
		unitPrice: 3200,
	},
	{
		id: "usd-2",
		product: "Consulting",
		description: "Architecture review and recommendations",
		quantity: 5,
		unitPrice: 1500,
	},
]

// ---------------------------------------------------------------------------
// Examples (code strings for highlighting)
// ---------------------------------------------------------------------------

const examples = [
	{
		key: "basic",
		code: `import { useState } from "react"
import { DealLinesEditor } from "@blazz/pro/components/blocks/deal-lines-editor"
import type { DealLine } from "@blazz/pro/components/blocks/deal-lines-editor"

const initialLines: DealLine[] = [
  {
    id: "line-1",
    product: "Audit SI",
    description: "Audit complet de l'infrastructure",
    quantity: 1,
    unitPrice: 4500,
  },
  {
    id: "line-2",
    product: "Développement sur mesure",
    description: "Module de gestion des commandes",
    quantity: 15,
    unitPrice: 850,
  },
]

function MyForm() {
  const [lines, setLines] = useState<DealLine[]>(initialLines)

  return <DealLinesEditor lines={lines} onChange={setLines} />
}`,
	},
	{
		key: "readonly",
		code: `<DealLinesEditor
  lines={lines}
  onChange={() => {}}
  readOnly
/>`,
	},
	{
		key: "usd",
		code: `<DealLinesEditor
  lines={lines}
  onChange={setLines}
  currency="USD"
/>`,
	},
] as const

const highlightedPromise = highlightExamples(examples as any)

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

const dealLinesEditorProps: DocProp[] = [
	{
		name: "lines",
		type: "DealLine[]",
		description: "Array of deal line items to display and edit.",
	},
	{
		name: "onChange",
		type: "(lines: DealLine[]) => void",
		description: "Callback fired when lines are added, removed, or modified.",
	},
	{
		name: "currency",
		type: "string",
		default: '"EUR"',
		description: "ISO 4217 currency code for formatting amounts (e.g. EUR, USD, GBP).",
	},
	{
		name: "readOnly",
		type: "boolean",
		default: "false",
		description: "When true, inputs become plain text and the add/delete controls are hidden.",
	},
	{
		name: "className",
		type: "string",
		description: "Additional CSS classes for the root container.",
	},
]

const dealLineProps: DocProp[] = [
	{
		name: "id",
		type: "string",
		description: "Unique identifier for the line item.",
	},
	{
		name: "product",
		type: "string",
		description: "Product or service name.",
	},
	{
		name: "description",
		type: "string",
		description: "Line item description.",
	},
	{
		name: "quantity",
		type: "number",
		description: "Quantity of items.",
	},
	{
		name: "unitPrice",
		type: "number",
		description: "Unit price. Multiplied by quantity for the line total.",
	},
]

// ---------------------------------------------------------------------------
// TOC
// ---------------------------------------------------------------------------

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "deal-lines-editor-props", title: "DealLinesEditor Props" },
	{ id: "deal-line-type", title: "DealLine Type" },
	{ id: "related", title: "Related" },
]

// ---------------------------------------------------------------------------
// Route
// ---------------------------------------------------------------------------

,
			}))
		)
		return { highlighted }
	},
	component: DealLinesEditorPage,
})

// ---------------------------------------------------------------------------
// Interactive demos
// ---------------------------------------------------------------------------

function DealLinesHeroDemo() {
	const [lines, setLines] = useState<DealLine[]>(sampleLines)
	return (
		<div className="w-full max-w-2xl rounded-lg border border-edge bg-surface overflow-hidden p-4">
			<DealLinesEditor lines={lines} onChange={setLines} />
		</div>
	)
}

function BasicDemo() {
	const [lines, setLines] = useState<DealLine[]>(sampleLines)
	return (
		<div className="w-full max-w-2xl rounded-lg border border-edge bg-surface overflow-hidden p-4">
			<DealLinesEditor lines={lines} onChange={setLines} />
		</div>
	)
}

function UsdDemo() {
	const [lines, setLines] = useState<DealLine[]>(usdLines)
	return (
		<div className="w-full max-w-2xl rounded-lg border border-edge bg-surface overflow-hidden p-4">
			<DealLinesEditor lines={lines} onChange={setLines} currency="USD" />
		</div>
	)
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function DealLinesEditorPage() {
	const highlighted = use(highlightedPromise)
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="Deal Lines Editor"
			subtitle="An editable table for managing deal line items with product, quantity, unit price, auto-calculated totals, and multi-currency support."
			toc={toc}
		>
			{/* Hero */}
			<DocHero>
				<DealLinesHeroDemo />
			</DocHero>

			{/* Examples */}
			<DocSection id="examples" title="Examples">
				<DocExampleClient
					title="Basic Interactive"
					description="A fully interactive editor with add and remove controls. Edit any field inline, add new lines, or delete existing ones."
					code={examples[0].code}
					highlightedCode={html("basic")}
				>
					<BasicDemo />
				</DocExampleClient>

				<DocExampleClient
					title="Read Only"
					description="Pass readOnly to display line items as plain text without edit controls. Useful for quote previews or confirmed orders."
					code={examples[1].code}
					highlightedCode={html("readonly")}
				>
					<div className="w-full max-w-2xl rounded-lg border border-edge bg-surface overflow-hidden p-4">
						<DealLinesEditor lines={readOnlyLines} onChange={() => {}} readOnly />
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Custom Currency (USD)"
					description="Set the currency prop to any ISO 4217 code. Amounts are formatted using the French locale with the specified currency symbol."
					code={examples[2].code}
					highlightedCode={html("usd")}
				>
					<UsdDemo />
				</DocExampleClient>
			</DocSection>

			{/* DealLinesEditor Props */}
			<DocSection id="deal-lines-editor-props" title="DealLinesEditor Props">
				<DocPropsTable props={dealLinesEditorProps} />
			</DocSection>

			{/* DealLine Type */}
			<DocSection id="deal-line-type" title="DealLine Type">
				<DocPropsTable props={dealLineProps} />
			</DocSection>

			{/* Related */}
			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{
							title: "Quote Preview",
							href: "/docs/blocks/quote-preview",
							description:
								"Read-only quote document with line items, totals, and PDF-ready layout.",
						},
						{
							title: "Multi Step Form",
							href: "/docs/blocks/multi-step-form",
							description: "Wizard-style form with step navigation and validation.",
						},
						{
							title: "Stats Grid",
							href: "/docs/blocks/stats-grid",
							description: "Grid of metric cards with icons, values, and trend indicators.",
						},
					]}
				/>
			</DocSection>
		</DocPage>
	)
}
