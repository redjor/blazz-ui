import { useState } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"
import { DocHero } from "~/components/docs/doc-hero"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import {
	DocPropsTable,
	type DocProp,
} from "~/components/docs/doc-props-table"
import { DocRelated } from "~/components/docs/doc-related"
import { StatusFlow } from "@blazz/ui/components/blocks/status-flow"
import type {
	StatusDefinition,
	StatusTransition,
} from "@blazz/ui/components/blocks/status-flow"
import { highlightCode } from "~/lib/highlight-code"

// ---------------------------------------------------------------------------
// Sample data — Deal pipeline
// ---------------------------------------------------------------------------

const pipelineStatuses: StatusDefinition[] = [
	{ id: "nouveau", label: "Nouveau", color: "gray" },
	{ id: "qualifie", label: "Qualifi\u00e9", color: "blue" },
	{ id: "proposition", label: "Proposition", color: "purple" },
	{ id: "negociation", label: "N\u00e9gociation", color: "yellow" },
	{ id: "gagne", label: "Gagn\u00e9", color: "green" },
]

const pipelineTransitions: StatusTransition[] = [
	{ from: "nouveau", to: "qualifie", action: "Qualifier" },
	{ from: "qualifie", to: "proposition", action: "Envoyer proposition" },
	{ from: "proposition", to: "negociation", action: "Entrer en n\u00e9gociation" },
	{ from: "negociation", to: "gagne", action: "Marquer gagn\u00e9" },
	{ from: "negociation", to: "nouveau", action: "Recommencer" },
]

// ---------------------------------------------------------------------------
// Sample data — Order flow
// ---------------------------------------------------------------------------

const orderStatuses: StatusDefinition[] = [
	{ id: "brouillon", label: "Brouillon", color: "gray" },
	{ id: "confirme", label: "Confirm\u00e9", color: "blue" },
	{ id: "expedie", label: "Exp\u00e9di\u00e9", color: "purple" },
	{ id: "livre", label: "Livr\u00e9", color: "green" },
	{ id: "facture", label: "Factur\u00e9", color: "green" },
]

const orderTransitions: StatusTransition[] = [
	{ from: "brouillon", to: "confirme", action: "Confirmer la commande", role: "commercial" },
	{ from: "confirme", to: "expedie", action: "Marquer exp\u00e9di\u00e9", role: "logistique" },
	{ from: "expedie", to: "livre", action: "Confirmer livraison", role: "logistique" },
	{ from: "livre", to: "facture", action: "\u00c9mettre la facture", role: "comptabilit\u00e9" },
]

// ---------------------------------------------------------------------------
// Examples (code strings for highlighting)
// ---------------------------------------------------------------------------

const examples = [
	{
		key: "basic",
		code: `import { useState } from "react"
import { StatusFlow } from "@blazz/ui/components/blocks/status-flow"
import type { StatusDefinition } from "@blazz/ui/components/blocks/status-flow"

const statuses: StatusDefinition[] = [
  { id: "nouveau", label: "Nouveau", color: "gray" },
  { id: "qualifie", label: "Qualifi\u00e9", color: "blue" },
  { id: "proposition", label: "Proposition", color: "purple" },
  { id: "negociation", label: "N\u00e9gociation", color: "yellow" },
  { id: "gagne", label: "Gagn\u00e9", color: "green" },
]

function DealPipeline() {
  const [current, setCurrent] = useState("qualifie")

  return (
    <StatusFlow
      currentStatus={current}
      statuses={statuses}
      onTransition={(from, to) => setCurrent(to)}
    />
  )
}`,
	},
	{
		key: "transitions",
		code: `import { useState } from "react"
import { StatusFlow } from "@blazz/ui/components/blocks/status-flow"
import type {
  StatusDefinition,
  StatusTransition,
} from "@blazz/ui/components/blocks/status-flow"

const statuses: StatusDefinition[] = [
  { id: "nouveau", label: "Nouveau", color: "gray" },
  { id: "qualifie", label: "Qualifi\u00e9", color: "blue" },
  { id: "proposition", label: "Proposition", color: "purple" },
  { id: "negociation", label: "N\u00e9gociation", color: "yellow" },
  { id: "gagne", label: "Gagn\u00e9", color: "green" },
]

const transitions: StatusTransition[] = [
  { from: "nouveau", to: "qualifie", action: "Qualifier" },
  { from: "qualifie", to: "proposition", action: "Envoyer proposition" },
  { from: "proposition", to: "negociation", action: "Entrer en n\u00e9gociation" },
  { from: "negociation", to: "gagne", action: "Marquer gagn\u00e9" },
  { from: "negociation", to: "nouveau", action: "Recommencer" },
]

function DealPipelineWithActions() {
  const [current, setCurrent] = useState("nouveau")

  return (
    <StatusFlow
      currentStatus={current}
      statuses={statuses}
      transitions={transitions}
      onTransition={(from, to) => setCurrent(to)}
    />
  )
}`,
	},
	{
		key: "order",
		code: `import { useState } from "react"
import { StatusFlow } from "@blazz/ui/components/blocks/status-flow"
import type {
  StatusDefinition,
  StatusTransition,
} from "@blazz/ui/components/blocks/status-flow"

const statuses: StatusDefinition[] = [
  { id: "brouillon", label: "Brouillon", color: "gray" },
  { id: "confirme", label: "Confirm\u00e9", color: "blue" },
  { id: "expedie", label: "Exp\u00e9di\u00e9", color: "purple" },
  { id: "livre", label: "Livr\u00e9", color: "green" },
  { id: "facture", label: "Factur\u00e9", color: "green" },
]

const transitions: StatusTransition[] = [
  { from: "brouillon", to: "confirme", action: "Confirmer la commande", role: "commercial" },
  { from: "confirme", to: "expedie", action: "Marquer exp\u00e9di\u00e9", role: "logistique" },
  { from: "expedie", to: "livre", action: "Confirmer livraison", role: "logistique" },
  { from: "livre", to: "facture", action: "\u00c9mettre la facture", role: "comptabilit\u00e9" },
]

function OrderFlow() {
  const [current, setCurrent] = useState("brouillon")

  return (
    <StatusFlow
      currentStatus={current}
      statuses={statuses}
      transitions={transitions}
      onTransition={(from, to) => setCurrent(to)}
    />
  )
}`,
	},
] as const

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

const statusFlowProps: DocProp[] = [
	{
		name: "currentStatus",
		type: "string",
		description: "The id of the currently active status in the flow.",
	},
	{
		name: "statuses",
		type: "StatusDefinition[]",
		description: "Ordered array of status steps to display in the flow.",
	},
	{
		name: "transitions",
		type: "StatusTransition[]",
		default: "[]",
		description: "Available transitions from each status. Buttons are shown for transitions matching the current status.",
	},
	{
		name: "onTransition",
		type: "(from: string, to: string) => void | Promise<void>",
		description: "Callback when a transition button is clicked. Supports async handlers with automatic loading state.",
	},
	{
		name: "className",
		type: "string",
		description: "Additional CSS classes for the root element.",
	},
]

const statusDefinitionProps: DocProp[] = [
	{
		name: "id",
		type: "string",
		description: "Unique identifier for this status step.",
	},
	{
		name: "label",
		type: "string",
		description: "Display label for the status badge.",
	},
	{
		name: "color",
		type: '"gray" | "blue" | "green" | "yellow" | "red" | "purple"',
		description: "Color theme for the status badge. Active status uses a solid variant, past statuses use a light variant, future statuses are dimmed.",
	},
]

const statusTransitionProps: DocProp[] = [
	{
		name: "from",
		type: "string",
		description: "Source status id. The transition button only appears when currentStatus matches this value.",
	},
	{
		name: "to",
		type: "string",
		description: "Target status id to transition to.",
	},
	{
		name: "action",
		type: "string",
		description: "Label for the transition button (e.g. \"Qualifier\", \"Envoyer proposition\").",
	},
	{
		name: "role",
		type: "string",
		description: "Optional role hint for documentation or permission checks (e.g. \"commercial\", \"logistique\").",
	},
]

// ---------------------------------------------------------------------------
// TOC
// ---------------------------------------------------------------------------

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "status-flow-props", title: "StatusFlow Props" },
	{ id: "status-definition-type", title: "StatusDefinition Type" },
	{ id: "status-transition-type", title: "StatusTransition Type" },
	{ id: "related", title: "Related" },
]

// ---------------------------------------------------------------------------
// Route
// ---------------------------------------------------------------------------

export const Route = createFileRoute("/_docs/docs/blocks/status-flow")({
	loader: async () => {
		const highlighted = await Promise.all(
			examples.map(async (ex) => ({
				key: ex.key,
				html: await highlightCode({ data: { code: ex.code } }),
			})),
		)
		return { highlighted }
	},
	component: StatusFlowPage,
})

// ---------------------------------------------------------------------------
// Interactive hero demo
// ---------------------------------------------------------------------------

function StatusFlowHeroDemo() {
	const [current, setCurrent] = useState("qualifie")

	return (
		<div className="w-full max-w-2xl rounded-lg border border-edge bg-surface overflow-hidden p-4">
			<StatusFlow
				currentStatus={current}
				statuses={pipelineStatuses}
				transitions={pipelineTransitions}
				onTransition={(_from, to) => setCurrent(to)}
			/>
		</div>
	)
}

// ---------------------------------------------------------------------------
// Example wrappers (interactive with useState)
// ---------------------------------------------------------------------------

function BasicPipelineDemo() {
	const [current, setCurrent] = useState("qualifie")

	return (
		<div className="w-full max-w-2xl rounded-lg border border-edge bg-surface overflow-hidden p-4">
			<StatusFlow
				currentStatus={current}
				statuses={pipelineStatuses}
				onTransition={(_from, to) => setCurrent(to)}
			/>
		</div>
	)
}

function TransitionsPipelineDemo() {
	const [current, setCurrent] = useState("nouveau")

	return (
		<div className="w-full max-w-2xl rounded-lg border border-edge bg-surface overflow-hidden p-4">
			<StatusFlow
				currentStatus={current}
				statuses={pipelineStatuses}
				transitions={pipelineTransitions}
				onTransition={(_from, to) => setCurrent(to)}
			/>
		</div>
	)
}

function OrderFlowDemo() {
	const [current, setCurrent] = useState("brouillon")

	return (
		<div className="w-full max-w-2xl rounded-lg border border-edge bg-surface overflow-hidden p-4">
			<StatusFlow
				currentStatus={current}
				statuses={orderStatuses}
				transitions={orderTransitions}
				onTransition={(_from, to) => setCurrent(to)}
			/>
		</div>
	)
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

function StatusFlowPage() {
	const { highlighted } = Route.useLoaderData()
	const html = (key: string) =>
		highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="Status Flow"
			subtitle="A linear status pipeline with colored badges, chevron separators, transition action buttons, and async support for workflow state machines."
			toc={toc}
		>
			{/* Hero */}
			<DocHero>
				<StatusFlowHeroDemo />
			</DocHero>

			{/* Examples */}
			<DocSection id="examples" title="Examples">
				<DocExampleClient
					title="Basic Pipeline"
					description="A deal pipeline with 5 stages. Click any status badge area to see the current status highlighted, past statuses colored, and future statuses dimmed."
					code={examples[0].code}
					highlightedCode={html("basic")}
				>
					<BasicPipelineDemo />
				</DocExampleClient>

				<DocExampleClient
					title="With Transitions"
					description="Define explicit transitions to show action buttons below the flow. Each transition maps a from/to status pair with a labeled button. Multiple transitions from the same status are supported."
					code={examples[1].code}
					highlightedCode={html("transitions")}
				>
					<TransitionsPipelineDemo />
				</DocExampleClient>

				<DocExampleClient
					title="Order Status"
					description="An order fulfillment flow from draft to invoiced. Each transition includes a role hint indicating which team handles that step."
					code={examples[2].code}
					highlightedCode={html("order")}
				>
					<OrderFlowDemo />
				</DocExampleClient>
			</DocSection>

			{/* StatusFlow Props */}
			<DocSection id="status-flow-props" title="StatusFlow Props">
				<DocPropsTable props={statusFlowProps} />
			</DocSection>

			{/* StatusDefinition Type */}
			<DocSection id="status-definition-type" title="StatusDefinition Type">
				<DocPropsTable props={statusDefinitionProps} />
			</DocSection>

			{/* StatusTransition Type */}
			<DocSection id="status-transition-type" title="StatusTransition Type">
				<DocPropsTable props={statusTransitionProps} />
			</DocSection>

			{/* Related */}
			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{
							title: "Kanban Board",
							href: "/docs/blocks/kanban-board",
							description: "Drag-and-drop board for managing items across status columns.",
						},
						{
							title: "Multi Step Form",
							href: "/docs/blocks/multi-step-form",
							description: "Step-by-step form wizard with validation, progress indicator, and navigation.",
						},
						{
							title: "Stats Grid",
							href: "/docs/blocks/stats-grid",
							description: "Responsive grid of KPI cards with trend indicators and icons.",
						},
					]}
				/>
			</DocSection>
		</DocPage>
	)
}
