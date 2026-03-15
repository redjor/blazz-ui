import type { ActivityType } from "@blazz/pro/components/blocks/quick-log-activity"
import { QuickLogActivity } from "@blazz/pro/components/blocks/quick-log-activity"
import { Button } from "@blazz/ui/components/ui/button"
import { createFileRoute } from "@tanstack/react-router"
import { StickyNote } from "lucide-react"
import { useState } from "react"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { type DocProp, DocPropsTable } from "~/components/docs/doc-props-table"
import { DocRelated } from "~/components/docs/doc-related"
import { DocSection } from "~/components/docs/doc-section"
import { highlightCode } from "~/lib/highlight-code"

// ---------------------------------------------------------------------------
// TOC
// ---------------------------------------------------------------------------

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "quick-log-activity-props", title: "QuickLogActivity Props" },
	{ id: "activity-type", title: "ActivityType" },
	{ id: "related", title: "Related" },
]

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

const quickLogActivityProps: DocProp[] = [
	{
		name: "onLog",
		type: "(activity: { type: ActivityType; note: string }) => void | Promise<void>",
		description:
			"Callback fired when the user submits an activity. Supports async — the button shows a loading state until the promise resolves.",
	},
	{
		name: "trigger",
		type: "React.ReactElement",
		description:
			'Custom trigger element rendered via the render prop pattern. Defaults to an outline button labeled "Activité".',
	},
	{
		name: "className",
		type: "string",
		description: "Additional classes applied to the default trigger button.",
	},
]

const activityTypeProps: DocProp[] = [
	{
		name: "call",
		type: '"call"',
		description: "Phone call activity. Displays the Phone icon.",
	},
	{
		name: "email",
		type: '"email"',
		description: "Email activity. Displays the Mail icon.",
	},
	{
		name: "note",
		type: '"note"',
		description: "Free-form note. Displays the StickyNote icon.",
	},
	{
		name: "meeting",
		type: '"meeting"',
		description: "Meeting / appointment. Displays the Calendar icon.",
	},
]

// ---------------------------------------------------------------------------
// Examples (code strings)
// ---------------------------------------------------------------------------

const examples = [
	{
		key: "basic",
		code: `<QuickLogActivity
  onLog={(activity) => {
    console.log("Logged:", activity)
    // { type: "call" | "email" | "note" | "meeting", note: "..." }
  }}
/>`,
	},
	{
		key: "custom-trigger",
		code: `<QuickLogActivity
  onLog={(activity) => console.log(activity)}
  trigger={
    <Button variant="ghost" size="icon-sm">
      <StickyNote className="size-4" />
    </Button>
  }
/>`,
	},
	{
		key: "toast",
		code: `<QuickLogActivity
  onLog={async (activity) => {
    await saveActivity(activity)
    // Show success feedback
    toast.success(\`\${activity.type} enregistré\`)
  }}
/>`,
	},
] as const

// ---------------------------------------------------------------------------
// Route
// ---------------------------------------------------------------------------

export const Route = createFileRoute("/_docs/docs/blocks/quick-log-activity")({
	loader: async () => {
		const highlighted = await Promise.all(
			[...examples].map(async (ex) => ({
				key: ex.key,
				html: await highlightCode({ data: { code: ex.code } }),
			}))
		)
		return { highlighted }
	},
	component: QuickLogActivityPage,
})

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

function QuickLogActivityPage() {
	const { highlighted } = Route.useLoaderData()
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="QuickLogActivity"
			subtitle="A popover-based micro-form to quickly log activities (calls, emails, notes, meetings) on a record. Ideal for CRM contact pages and deal timelines."
			toc={toc}
		>
			{/* Hero */}
			<DocHero>
				<div className="w-full max-w-2xl rounded-lg border border-edge bg-surface overflow-hidden p-4">
					<HeroDemo />
				</div>
			</DocHero>

			{/* Examples */}
			<DocSection id="examples" title="Examples">
				<DocExampleClient
					title="Basic"
					description="Default trigger with console output. Click the button and fill the form to log an activity."
					code={examples[0].code}
					highlightedCode={html("basic")}
				>
					<div className="w-full max-w-2xl rounded-lg border border-edge bg-surface overflow-hidden p-4">
						<QuickLogActivity onLog={(activity) => console.log("Logged:", activity)} />
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Custom Trigger"
					description="Replace the default trigger with a compact icon button using the trigger prop."
					code={examples[1].code}
					highlightedCode={html("custom-trigger")}
				>
					<div className="w-full max-w-2xl rounded-lg border border-edge bg-surface overflow-hidden p-4">
						<QuickLogActivity
							onLog={(activity) => console.log(activity)}
							trigger={
								<Button variant="ghost" size="icon-sm">
									<StickyNote className="size-4" />
								</Button>
							}
						/>
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="With Toast Feedback"
					description="Use an async onLog handler to show loading state and provide user feedback after logging."
					code={examples[2].code}
					highlightedCode={html("toast")}
				>
					<div className="w-full max-w-2xl rounded-lg border border-edge bg-surface overflow-hidden p-4">
						<QuickLogActivity
							onLog={async (activity) => {
								await new Promise((r) => setTimeout(r, 800))
								console.log("Saved:", activity)
							}}
						/>
					</div>
				</DocExampleClient>
			</DocSection>

			{/* Props */}
			<DocSection id="quick-log-activity-props" title="QuickLogActivity Props">
				<DocPropsTable props={quickLogActivityProps} />
			</DocSection>

			<DocSection id="activity-type" title="ActivityType">
				<p className="mb-4 text-sm text-fg-muted">
					Union type:{" "}
					<code className="rounded bg-surface-3 px-1.5 py-0.5 text-xs">
						"call" | "email" | "note" | "meeting"
					</code>
				</p>
				<DocPropsTable props={activityTypeProps} />
			</DocSection>

			{/* Related */}
			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{
							title: "Activity Timeline",
							href: "/docs/blocks/activity-timeline",
							description: "Chronological feed of logged activities and events.",
						},
						{
							title: "Inbox",
							href: "/docs/blocks/inbox",
							description: "Linear-style notification inbox with filters and split view.",
						},
						{
							title: "Detail Panel",
							href: "/docs/blocks/detail-panel",
							description: "Side panel for record details with tabs and actions.",
						},
					]}
				/>
			</DocSection>
		</DocPage>
	)
}

// ---------------------------------------------------------------------------
// Hero Demo
// ---------------------------------------------------------------------------

function HeroDemo() {
	const [logs, setLogs] = useState<{ type: ActivityType; note: string }[]>([])

	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center justify-between">
				<div>
					<p className="text-sm font-medium text-fg">Dupont & Associés</p>
					<p className="text-xs text-fg-muted">Contact : Marie Dupont</p>
				</div>
				<QuickLogActivity
					onLog={async (activity) => {
						await new Promise((r) => setTimeout(r, 500))
						setLogs((prev) => [activity, ...prev])
					}}
				/>
			</div>
			{logs.length > 0 && (
				<div className="space-y-1 border-t pt-3">
					<p className="text-xs font-medium text-fg-muted">Activités enregistrées :</p>
					{logs.map((log, i) => (
						<div key={i} className="flex items-center gap-2 text-xs text-fg-muted">
							<span className="rounded bg-surface-3 px-1.5 py-0.5 font-mono text-[10px] uppercase">
								{log.type}
							</span>
							<span className="truncate">{log.note}</span>
						</div>
					))}
				</div>
			)}
		</div>
	)
}
