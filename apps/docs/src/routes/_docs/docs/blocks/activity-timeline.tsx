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
import { ActivityTimeline } from "@blazz/ui/components/blocks/activity-timeline"
import type { TimelineEvent } from "@blazz/ui/components/blocks/activity-timeline"
import { highlightCode } from "~/lib/highlight-code"

// ---------------------------------------------------------------------------
// Sample data
// ---------------------------------------------------------------------------

const heroEvents: TimelineEvent[] = [
	{
		date: "2026-03-11T14:32:00",
		user: "Sophie Martin",
		action: "A créé le devis QT-2026-0042",
		detail: "Montant total : 12 400 € HT — client Nextera Solutions",
	},
	{
		date: "2026-03-11T11:15:00",
		user: "Antoine Dupont",
		action: "A modifié le statut du deal en « Négociation »",
	},
	{
		date: "2026-03-10T17:45:00",
		user: "Claire Lefèvre",
		action: "A ajouté une note interne",
		detail: "Le client souhaite un paiement en 3 fois, vérifier avec la comptabilité.",
	},
	{
		date: "2026-03-10T09:20:00",
		user: "Sophie Martin",
		action: "A envoyé la proposition commerciale par email",
	},
	{
		date: "2026-03-09T16:00:00",
		user: "Antoine Dupont",
		action: "A planifié un rendez-vous client",
		detail: "Visio le 15 mars à 10h — présentation de la solution.",
	},
]

const basicEvents: TimelineEvent[] = [
	{
		date: "2026-03-11T10:00:00",
		user: "Marie Duval",
		action: "A validé la commande CMD-1204",
	},
	{
		date: "2026-03-10T15:30:00",
		user: "Lucas Bernard",
		action: "A mis à jour les coordonnées du contact",
	},
	{
		date: "2026-03-09T09:45:00",
		user: "Marie Duval",
		action: "A créé la fiche client Acme Corp",
	},
]

const detailEvents: TimelineEvent[] = [
	{
		date: "2026-03-11T16:20:00",
		user: "Thomas Garnier",
		action: "A clôturé le ticket support #892",
		detail: "Résolution : mise à jour du certificat SSL sur le serveur de production.",
	},
	{
		date: "2026-03-11T14:05:00",
		user: "Émilie Rousseau",
		action: "A escaladé le ticket au niveau 2",
		detail: "Le client signale des erreurs 502 intermittentes depuis ce matin.",
	},
	{
		date: "2026-03-11T08:30:00",
		user: "Thomas Garnier",
		action: "A ouvert le ticket support #892",
		detail: "Problème de connexion à l'API rapporté par 3 clients différents.",
	},
	{
		date: "2026-03-10T17:00:00",
		user: "Émilie Rousseau",
		action: "A déployé la version 2.4.1 en production",
	},
]

// ---------------------------------------------------------------------------
// Examples (code strings for highlighting)
// ---------------------------------------------------------------------------

const examples = [
	{
		key: "basic",
		code: `import { ActivityTimeline } from "@blazz/ui/components/blocks/activity-timeline"
import type { TimelineEvent } from "@blazz/ui/components/blocks/activity-timeline"

const events: TimelineEvent[] = [
  {
    date: "2026-03-11T10:00:00",
    user: "Marie Duval",
    action: "A validé la commande CMD-1204",
  },
  {
    date: "2026-03-10T15:30:00",
    user: "Lucas Bernard",
    action: "A mis à jour les coordonnées du contact",
  },
  {
    date: "2026-03-09T09:45:00",
    user: "Marie Duval",
    action: "A créé la fiche client Acme Corp",
  },
]

<ActivityTimeline events={events} />`,
	},
	{
		key: "loading",
		code: `<ActivityTimeline events={[]} loading />`,
	},
	{
		key: "details",
		code: `const events: TimelineEvent[] = [
  {
    date: "2026-03-11T16:20:00",
    user: "Thomas Garnier",
    action: "A clôturé le ticket support #892",
    detail: "Résolution : mise à jour du certificat SSL.",
  },
  {
    date: "2026-03-11T14:05:00",
    user: "Émilie Rousseau",
    action: "A escaladé le ticket au niveau 2",
    detail: "Erreurs 502 intermittentes signalées.",
  },
  {
    date: "2026-03-11T08:30:00",
    user: "Thomas Garnier",
    action: "A ouvert le ticket support #892",
    detail: "Problème de connexion rapporté par 3 clients.",
  },
]

<ActivityTimeline events={events} />`,
	},
] as const

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

const activityTimelineProps: DocProp[] = [
	{
		name: "events",
		type: "TimelineEvent[]",
		description: "Array of timeline events to display chronologically.",
	},
	{
		name: "loading",
		type: "boolean",
		default: "false",
		description: "Show skeleton loading state with 4 placeholder items.",
	},
	{
		name: "className",
		type: "string",
		description: "Additional CSS classes for the root list element.",
	},
]

const timelineEventProps: DocProp[] = [
	{
		name: "date",
		type: "string",
		description: "ISO date string. Formatted in French locale (e.g. 11 mars 2026, 14:32).",
	},
	{
		name: "user",
		type: "string",
		description: "Name of the user who performed the action.",
	},
	{
		name: "action",
		type: "string",
		description: "Description of the action performed.",
	},
	{
		name: "detail",
		type: "string",
		description: "Optional additional detail text displayed below the action in muted color.",
	},
]

// ---------------------------------------------------------------------------
// TOC
// ---------------------------------------------------------------------------

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "activity-timeline-props", title: "ActivityTimeline Props" },
	{ id: "timeline-event-type", title: "TimelineEvent Type" },
	{ id: "related", title: "Related" },
]

// ---------------------------------------------------------------------------
// Route
// ---------------------------------------------------------------------------

export const Route = createFileRoute("/_docs/docs/blocks/activity-timeline")({
	loader: async () => {
		const highlighted = await Promise.all(
			examples.map(async (ex) => ({
				key: ex.key,
				html: await highlightCode({ data: { code: ex.code } }),
			})),
		)
		return { highlighted }
	},
	component: ActivityTimelinePage,
})

// ---------------------------------------------------------------------------
// Interactive demo for hero
// ---------------------------------------------------------------------------

function ActivityTimelineHeroDemo() {
	return (
		<div className="w-full max-w-2xl rounded-lg border border-edge bg-surface overflow-hidden p-4">
			<ActivityTimeline events={heroEvents} />
		</div>
	)
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

function ActivityTimelinePage() {
	const { highlighted } = Route.useLoaderData()
	const html = (key: string) =>
		highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="Activity Timeline"
			subtitle="A chronological event feed with connector lines, French date formatting, loading skeletons, and optional detail text."
			toc={toc}
		>
			{/* Hero */}
			<DocHero>
				<ActivityTimelineHeroDemo />
			</DocHero>

			{/* Examples */}
			<DocSection id="examples" title="Examples">
				<DocExampleClient
					title="Basic Timeline"
					description="A simple timeline with 3 events. Dates are automatically formatted in the French locale."
					code={examples[0].code}
					highlightedCode={html("basic")}
				>
					<div className="w-full max-w-2xl rounded-lg border border-edge bg-surface overflow-hidden p-4">
						<ActivityTimeline events={basicEvents} />
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Loading State"
					description="Pass the loading prop to display 4 skeleton placeholder items while data is being fetched."
					code={examples[1].code}
					highlightedCode={html("loading")}
				>
					<div className="w-full max-w-2xl rounded-lg border border-edge bg-surface overflow-hidden p-4">
						<ActivityTimeline events={[]} loading />
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="With Details"
					description="Events can include an optional detail field that renders additional context below the action text."
					code={examples[2].code}
					highlightedCode={html("details")}
				>
					<div className="w-full max-w-2xl rounded-lg border border-edge bg-surface overflow-hidden p-4">
						<ActivityTimeline events={detailEvents} />
					</div>
				</DocExampleClient>
			</DocSection>

			{/* ActivityTimeline Props */}
			<DocSection id="activity-timeline-props" title="ActivityTimeline Props">
				<DocPropsTable props={activityTimelineProps} />
			</DocSection>

			{/* TimelineEvent Type */}
			<DocSection id="timeline-event-type" title="TimelineEvent Type">
				<DocPropsTable props={timelineEventProps} />
			</DocSection>

			{/* Related */}
			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{
							title: "Inbox",
							href: "/docs/blocks/inbox",
							description: "Linear-style inbox with split-view layout and action indicators.",
						},
						{
							title: "Notification Center",
							href: "/docs/blocks/notification-center",
							description: "General-purpose notification panel with groups and actions.",
						},
						{
							title: "Stats Strip",
							href: "/docs/blocks/stats-strip",
							description: "Horizontal row of key metrics with trend indicators.",
						},
					]}
				/>
			</DocSection>
		</DocPage>
	)
}
