import { CascadingSelect, type CascadingSelectNode } from "@blazz/ui/components/ui/cascading-select"
import { Label } from "@blazz/ui/components/ui/label"
import { createFileRoute } from "@tanstack/react-router"
import * as React from "react"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { type DocProp, DocPropsTable } from "~/components/docs/doc-props-table"
import { DocRelated } from "~/components/docs/doc-related"
import { DocSection } from "~/components/docs/doc-section"
import { highlightCode } from "~/lib/highlight-code"

const PRODUCT_CATEGORIES: CascadingSelectNode[] = [
	{
		id: "boissons",
		label: "Boissons",
		children: [
			{
				id: "alcools",
				label: "Alcools",
				children: [
					{ id: "aperitifs", label: "Apéritifs" },
					{ id: "vins", label: "Vins" },
					{ id: "bieres", label: "Bières" },
				],
			},
			{ id: "eaux", label: "Eaux" },
			{ id: "jus", label: "Jus de fruits" },
			{ id: "sodas", label: "Sodas & Soft drinks" },
		],
	},
	{
		id: "alimentation",
		label: "Alimentation",
		children: [
			{
				id: "frais",
				label: "Frais",
				children: [
					{ id: "viandes", label: "Viandes" },
					{ id: "poissons", label: "Poissons" },
					{ id: "produits-laitiers", label: "Produits laitiers" },
				],
			},
			{ id: "epicerie", label: "Épicerie" },
			{ id: "surgeles", label: "Surgelés" },
		],
	},
	{
		id: "electronique",
		label: "Électronique",
		children: [
			{ id: "smartphones", label: "Smartphones" },
			{ id: "ordinateurs", label: "Ordinateurs" },
			{ id: "audio", label: "Audio" },
		],
	},
]

const GEOGRAPHIC: CascadingSelectNode[] = [
	{
		id: "france",
		label: "France",
		children: [
			{
				id: "ile-de-france",
				label: "Île-de-France",
				children: [
					{ id: "paris", label: "Paris" },
					{ id: "versailles", label: "Versailles" },
				],
			},
			{
				id: "paca",
				label: "PACA",
				children: [
					{ id: "marseille", label: "Marseille" },
					{ id: "nice", label: "Nice" },
				],
			},
		],
	},
	{
		id: "belgique",
		label: "Belgique",
		children: [
			{ id: "bruxelles", label: "Bruxelles" },
			{ id: "liege", label: "Liège" },
		],
	},
]

const examples = [
	{
		key: "default",
		code: `const [value, setValue] = React.useState("")

<CascadingSelect
  nodes={categories}
  value={value}
  onValueChange={setValue}
  placeholder="Select a category..."
/>`,
	},
	{
		key: "with-label",
		code: `<div className="space-y-1.5">
  <Label>Category <span className="text-negative">*</span></Label>
  <CascadingSelect
    nodes={categories}
    value={value}
    onValueChange={setValue}
    placeholder="Select a category..."
  />
</div>`,
	},
	{
		key: "geographic",
		code: `<CascadingSelect
  nodes={geographicZones}
  value={value}
  onValueChange={setValue}
  placeholder="Select a region..."
/>`,
	},
] as const

export const Route = createFileRoute("/_docs/docs/components/ui/cascading-select")({
	loader: async () => {
		const highlighted = await Promise.all(
			examples.map(async (ex) => ({
				key: ex.key,
				html: await highlightCode({ data: { code: ex.code } }),
			}))
		)
		return { highlighted }
	},
	component: CascadingSelectPage,
})

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "props", title: "Props" },
	{ id: "guidelines", title: "Guidelines" },
	{ id: "related", title: "Related" },
]

const cascadingSelectProps: DocProp[] = [
	{
		name: "nodes",
		type: "CascadingSelectNode[]",
		description:
			"Root-level nodes of the tree. Each node has id, label, and optional children array.",
	},
	{
		name: "value",
		type: "string",
		description: "The controlled selected node id.",
	},
	{
		name: "onValueChange",
		type: "(id: string) => void",
		description: "Callback fired when the user selects a node.",
	},
	{
		name: "placeholder",
		type: "string",
		default: '"Select..."',
		description: "Text shown in the trigger when no value is selected.",
	},
	{
		name: "id",
		type: "string",
		description: "HTML id forwarded to the trigger button, used for label association.",
	},
	{
		name: "className",
		type: "string",
		description: "Additional CSS classes for the trigger button.",
	},
]

/* ── Demo components ── */

function DefaultDemo() {
	const [value, setValue] = React.useState("")
	return (
		<div className="w-[300px]">
			<CascadingSelect
				nodes={PRODUCT_CATEGORIES}
				value={value}
				onValueChange={setValue}
				placeholder="Select a category..."
			/>
		</div>
	)
}

function WithLabelDemo() {
	const [value, setValue] = React.useState("aperitifs")
	return (
		<div className="w-[300px] space-y-1.5">
			<Label>
				Category <span className="text-negative">*</span>
			</Label>
			<CascadingSelect
				nodes={PRODUCT_CATEGORIES}
				value={value}
				onValueChange={setValue}
				placeholder="Select a category..."
			/>
		</div>
	)
}

function GeographicDemo() {
	const [value, setValue] = React.useState("")
	return (
		<div className="w-[300px]">
			<CascadingSelect
				nodes={GEOGRAPHIC}
				value={value}
				onValueChange={setValue}
				placeholder="Select a region..."
			/>
		</div>
	)
}

function CascadingSelectPage() {
	const { highlighted } = Route.useLoaderData()
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="Cascading Select"
			subtitle="A drill-down select for hierarchical data. Navigate level by level with breadcrumb orientation, selecting any node at any depth."
			toc={toc}
		>
			<DocHero>
				<WithLabelDemo />
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExampleClient
					title="Default"
					description="Navigate a product category tree. Click a label to select, click › to drill into sub-categories."
					code={examples[0].code}
					highlightedCode={html("default")}
				>
					<DefaultDemo />
				</DocExampleClient>

				<DocExampleClient
					title="With Label and Pre-selected Value"
					description="Pair with a Label component. The trigger shows the full path when a deep node is selected."
					code={examples[1].code}
					highlightedCode={html("with-label")}
				>
					<WithLabelDemo />
				</DocExampleClient>

				<DocExampleClient
					title="Geographic Zones"
					description="Works for any hierarchical data — countries, regions, cities."
					code={examples[2].code}
					highlightedCode={html("geographic")}
				>
					<GeographicDemo />
				</DocExampleClient>
			</DocSection>

			<DocSection id="props" title="Props">
				<DocPropsTable props={cascadingSelectProps} />
			</DocSection>

			<DocSection id="guidelines" title="Guidelines">
				<ul className="list-inside list-disc space-y-2 text-sm text-fg-muted">
					<li>
						Use CascadingSelect when data has natural parent-child hierarchy (categories,
						geographies, org structures)
					</li>
					<li>Any node at any level is selectable — users are not forced to reach leaf nodes</li>
					<li>
						The trigger displays the full path (e.g., "Boissons › Alcools › Apéritifs") so the
						selection is always clear
					</li>
					<li>
						For react-hook-form integration, use the CategorySelect block from
						@blazz/pro/components/blocks/category-select
					</li>
				</ul>
			</DocSection>

			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{
							title: "Select",
							href: "/docs/components/ui/select",
							description: "A simple dropdown for flat option lists.",
						},
						{
							title: "Combobox",
							href: "/docs/components/ui/combobox",
							description: "A searchable dropdown for large flat option sets.",
						},
						{
							title: "Tree View",
							href: "/docs/components/ui/tree-view",
							description: "A full tree display with expand/collapse for complex hierarchies.",
						},
					]}
				/>
			</DocSection>
		</DocPage>
	)
}
