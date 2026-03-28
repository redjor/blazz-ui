"use client"

import type { KanbanColumn } from "@blazz/pro/components/blocks/kanban-board"
import { KanbanBoard } from "@blazz/pro/components/blocks/kanban-board"
import { Badge } from "@blazz/ui/components/ui/badge"
import { use, useCallback, useState } from "react"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { type DocProp, DocPropsTable } from "~/components/docs/doc-props-table"
import { DocRelated } from "~/components/docs/doc-related"
import { DocSection } from "~/components/docs/doc-section"
import { highlightExamples } from "~/lib/highlight-examples"

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "kanban-board-props", title: "KanbanBoard Props" },
	{ id: "kanban-column-type", title: "KanbanColumn Type" },
	{ id: "related", title: "Related" },
]

const kanbanBoardProps: DocProp[] = [
	{
		name: "columns",
		type: "KanbanColumn<T>[]",
		description: "Column definitions (id, label, optional variant).",
	},
	{
		name: "items",
		type: "T[]",
		description: "All items to distribute across columns.",
	},
	{
		name: "getColumnId",
		type: "(item: T) => string",
		description: "Function that returns the column id an item belongs to.",
	},
	{
		name: "onMove",
		type: "(itemId: string, fromColumn: string, toColumn: string) => void | Promise<void>",
		description: "Callback when an item is dragged to another column. Omit to disable drag-and-drop.",
	},
	{
		name: "renderCard",
		type: "(item: T) => React.ReactNode",
		description: "Render function for each card.",
	},
	{
		name: "renderColumnHeader",
		type: "(column: KanbanColumn<T>, items: T[]) => React.ReactNode",
		description: "Custom column header renderer. Falls back to label + count badge.",
	},
	{
		name: "columnClassName",
		type: "string",
		description: "Additional classes for each column container.",
	},
	{
		name: "className",
		type: "string",
		description: "Additional classes for the board wrapper.",
	},
]

const kanbanColumnProps: DocProp[] = [
	{
		name: "id",
		type: "string",
		description: "Unique column identifier, matched by getColumnId.",
	},
	{
		name: "label",
		type: "string",
		description: "Display label for the column header.",
	},
	{
		name: "variant",
		type: '"default" | "success" | "info" | "warning" | "critical" | "outline"',
		default: '"default"',
		description: "Badge variant for the column header count.",
	},
]

interface Deal {
	id: string
	name: string
	company: string
	amount: number
	stage: string
}

const sampleDeals: Deal[] = [
	{ id: "1", name: "Refonte SI", company: "Acme Corp", amount: 45000, stage: "qualification" },
	{
		id: "2",
		name: "Migration Cloud",
		company: "TechVision",
		amount: 120000,
		stage: "qualification",
	},
	{ id: "3", name: "App Mobile", company: "RetailPlus", amount: 35000, stage: "proposition" },
	{
		id: "4",
		name: "ERP Integration",
		company: "IndustrieMax",
		amount: 85000,
		stage: "proposition",
	},
	{ id: "5", name: "Data Platform", company: "FinanceOne", amount: 200000, stage: "negociation" },
	{ id: "6", name: "CRM Setup", company: "StartupLab", amount: 18000, stage: "negociation" },
	{ id: "7", name: "Audit Securite", company: "BankSecure", amount: 55000, stage: "gagne" },
]

const pipelineColumns: KanbanColumn<Deal>[] = [
	{ id: "qualification", label: "Qualification", variant: "outline" },
	{ id: "proposition", label: "Proposition", variant: "info" },
	{ id: "negociation", label: "Negociation", variant: "warning" },
	{ id: "gagne", label: "Gagne", variant: "success" },
]

function DealCard({ deal }: { deal: Deal }) {
	return (
		<div className="rounded-lg border border-edge bg-card p-3 space-y-2">
			<div className="flex items-center justify-between">
				<span className="text-sm font-medium text-fg">{deal.name}</span>
			</div>
			<p className="text-xs text-fg-muted">{deal.company}</p>
			<p className="text-sm font-semibold text-fg">{deal.amount.toLocaleString("fr-FR")} €</p>
		</div>
	)
}

const examples = [
	{
		key: "basic",
		code: `import { useState } from "react"
import { KanbanBoard } from "@blazz/pro/components/blocks/kanban-board"
import type { KanbanColumn } from "@blazz/pro/components/blocks/kanban-board"

interface Deal {
  id: string
  name: string
  company: string
  amount: number
  stage: string
}

const columns: KanbanColumn<Deal>[] = [
  { id: "qualification", label: "Qualification", variant: "outline" },
  { id: "proposition", label: "Proposition", variant: "info" },
  { id: "negociation", label: "Negociation", variant: "warning" },
  { id: "gagne", label: "Gagne", variant: "success" },
]

const initialDeals: Deal[] = [
  { id: "1", name: "Refonte SI", company: "Acme Corp", amount: 45000, stage: "qualification" },
  { id: "2", name: "App Mobile", company: "RetailPlus", amount: 35000, stage: "proposition" },
  { id: "3", name: "Data Platform", company: "FinanceOne", amount: 200000, stage: "negociation" },
]

function BasicPipeline() {
  const [deals, setDeals] = useState(initialDeals)

  return (
    <KanbanBoard
      columns={columns}
      items={deals}
      getColumnId={(d) => d.stage}
      onMove={(id, _from, to) => {
        setDeals((prev) =>
          prev.map((d) => (d.id === id ? { ...d, stage: to } : d))
        )
      }}
      renderCard={(deal) => (
        <div className="rounded-lg border bg-card p-3 space-y-1">
          <p className="text-sm font-medium">{deal.name}</p>
          <p className="text-xs text-fg-muted">{deal.company}</p>
          <p className="text-sm font-semibold">{deal.amount.toLocaleString("fr-FR")} €</p>
        </div>
      )}
    />
  )
}`,
	},
	{
		key: "custom-card",
		code: `import { KanbanBoard } from "@blazz/pro/components/blocks/kanban-board"
import { Badge } from "@blazz/ui/components/ui/badge"

function CustomCardExample() {
  const [deals, setDeals] = useState(initialDeals)

  return (
    <KanbanBoard
      columns={columns}
      items={deals}
      getColumnId={(d) => d.stage}
      onMove={(id, _from, to) => {
        setDeals((prev) =>
          prev.map((d) => (d.id === id ? { ...d, stage: to } : d))
        )
      }}
      renderCard={(deal) => (
        <div className="rounded-lg border bg-card p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{deal.name}</span>
            <Badge variant="outline" className="text-xs">
              {deal.amount >= 100000 ? "Enterprise" : "SMB"}
            </Badge>
          </div>
          <p className="text-xs text-fg-muted">{deal.company}</p>
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">{deal.amount.toLocaleString("fr-FR")} €</p>
          </div>
        </div>
      )}
    />
  )
}`,
	},
	{
		key: "read-only",
		code: `import { KanbanBoard } from "@blazz/pro/components/blocks/kanban-board"

function ReadOnlyBoard() {
  return (
    <KanbanBoard
      columns={columns}
      items={deals}
      getColumnId={(d) => d.stage}
      renderCard={(deal) => (
        <div className="rounded-lg border bg-card p-3 space-y-1">
          <p className="text-sm font-medium">{deal.name}</p>
          <p className="text-xs text-fg-muted">{deal.company}</p>
          <p className="text-sm font-semibold">{deal.amount.toLocaleString("fr-FR")} €</p>
        </div>
      )}
    />
  )
}`,
	},
] as const

const highlightedPromise = highlightExamples(examples as any)

function HeroDemo() {
	const [deals, setDeals] = useState<Deal[]>(sampleDeals)

	const handleMove = useCallback((itemId: string, _from: string, toColumn: string) => {
		setDeals((prev) => prev.map((d) => (d.id === itemId ? { ...d, stage: toColumn } : d)))
	}, [])

	return (
		<div className="w-full max-w-4xl rounded-lg border border-edge bg-card overflow-hidden p-4" style={{ minHeight: 420 }}>
			<KanbanBoard columns={pipelineColumns} items={deals} getColumnId={(d) => d.stage} onMove={handleMove} renderCard={(deal) => <DealCard deal={deal} />} />
		</div>
	)
}

function BasicPipelineDemo() {
	const [deals, setDeals] = useState<Deal[]>([
		{ id: "1", name: "Refonte SI", company: "Acme Corp", amount: 45000, stage: "qualification" },
		{ id: "2", name: "App Mobile", company: "RetailPlus", amount: 35000, stage: "proposition" },
		{ id: "3", name: "Data Platform", company: "FinanceOne", amount: 200000, stage: "negociation" },
	])

	return (
		<KanbanBoard
			columns={pipelineColumns}
			items={deals}
			getColumnId={(d) => d.stage}
			onMove={(id, _from, to) => {
				setDeals((prev) => prev.map((d) => (d.id === id ? { ...d, stage: to } : d)))
			}}
			renderCard={(deal) => (
				<div className="rounded-lg border border-edge bg-card p-3 space-y-1">
					<p className="text-sm font-medium text-fg">{deal.name}</p>
					<p className="text-xs text-fg-muted">{deal.company}</p>
					<p className="text-sm font-semibold text-fg">{deal.amount.toLocaleString("fr-FR")} €</p>
				</div>
			)}
		/>
	)
}

function CustomCardDemo() {
	const [deals, setDeals] = useState<Deal[]>([
		{ id: "1", name: "Refonte SI", company: "Acme Corp", amount: 45000, stage: "qualification" },
		{
			id: "2",
			name: "Migration Cloud",
			company: "TechVision",
			amount: 120000,
			stage: "qualification",
		},
		{ id: "3", name: "App Mobile", company: "RetailPlus", amount: 35000, stage: "proposition" },
		{ id: "4", name: "Data Platform", company: "FinanceOne", amount: 200000, stage: "negociation" },
	])

	return (
		<KanbanBoard
			columns={pipelineColumns}
			items={deals}
			getColumnId={(d) => d.stage}
			onMove={(id, _from, to) => {
				setDeals((prev) => prev.map((d) => (d.id === id ? { ...d, stage: to } : d)))
			}}
			renderCard={(deal) => (
				<div className="rounded-lg border border-edge bg-card p-3 space-y-2">
					<div className="flex items-center justify-between">
						<span className="text-sm font-medium text-fg">{deal.name}</span>
						<Badge variant="outline" className="text-xs">
							{deal.amount >= 100000 ? "Enterprise" : "SMB"}
						</Badge>
					</div>
					<p className="text-xs text-fg-muted">{deal.company}</p>
					<p className="text-sm font-semibold text-fg">{deal.amount.toLocaleString("fr-FR")} €</p>
				</div>
			)}
		/>
	)
}

function ReadOnlyDemo() {
	const readOnlyDeals: Deal[] = [
		{ id: "1", name: "Refonte SI", company: "Acme Corp", amount: 45000, stage: "qualification" },
		{ id: "2", name: "App Mobile", company: "RetailPlus", amount: 35000, stage: "proposition" },
		{ id: "3", name: "Audit Securite", company: "BankSecure", amount: 55000, stage: "gagne" },
	]

	return (
		<KanbanBoard
			columns={pipelineColumns}
			items={readOnlyDeals}
			getColumnId={(d) => d.stage}
			renderCard={(deal) => (
				<div className="rounded-lg border border-edge bg-card p-3 space-y-1">
					<p className="text-sm font-medium text-fg">{deal.name}</p>
					<p className="text-xs text-fg-muted">{deal.company}</p>
					<p className="text-sm font-semibold text-fg">{deal.amount.toLocaleString("fr-FR")} €</p>
				</div>
			)}
		/>
	)
}

export default function KanbanBoardPage() {
	const highlighted = use(highlightedPromise)
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage title="KanbanBoard" subtitle="Drag-and-drop board for pipeline visualization. Distribute items across columns with custom card rendering." toc={toc}>
			{/* Hero */}
			<DocHero>
				<HeroDemo />
			</DocHero>

			{/* Examples */}
			<DocSection id="examples" title="Examples">
				<DocExampleClient title="Basic Pipeline" description="A CRM deal pipeline with drag-and-drop between stages. Drag a card to move it." code={examples[0].code} highlightedCode={html("basic")}>
					<BasicPipelineDemo />
				</DocExampleClient>

				<DocExampleClient
					title="Custom Card Render"
					description="Use renderCard to add badges, icons, or any custom layout to each card."
					code={examples[1].code}
					highlightedCode={html("custom-card")}
				>
					<CustomCardDemo />
				</DocExampleClient>

				<DocExampleClient title="Read Only" description="Omit onMove to disable drag-and-drop. Cards are displayed but not movable." code={examples[2].code} highlightedCode={html("read-only")}>
					<ReadOnlyDemo />
				</DocExampleClient>
			</DocSection>

			{/* KanbanBoard Props */}
			<DocSection id="kanban-board-props" title="KanbanBoard Props">
				<DocPropsTable props={kanbanBoardProps} />
			</DocSection>

			{/* KanbanColumn Type */}
			<DocSection id="kanban-column-type" title="KanbanColumn Type">
				<DocPropsTable props={kanbanColumnProps} />
			</DocSection>

			{/* Related */}
			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{
							title: "Status Flow",
							href: "/docs/blocks/status-flow",
							description: "Visual status transitions, often paired with Kanban stages.",
						},
						{
							title: "Data Table",
							href: "/docs/blocks/data-table",
							description: "Tabular alternative for the same dataset.",
						},
						{
							title: "Stats Grid",
							href: "/docs/blocks/stats-grid",
							description: "Summary cards to display pipeline metrics above the board.",
						},
					]}
				/>
			</DocSection>
		</DocPage>
	)
}
