import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { type DocProp, DocPropsTable } from "~/components/docs/doc-props-table"
import { DocRelated } from "~/components/docs/doc-related"
import { DocSection } from "~/components/docs/doc-section"
import { highlightExamples } from "~/lib/highlight-examples"
import { DefaultDemo, GeographicDemo, WithLabelDemo } from "./demos"

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

const highlightedPromise = highlightExamples(examples as any)

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

export default async function CascadingSelectPage() {
	const highlighted = await highlightedPromise
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
