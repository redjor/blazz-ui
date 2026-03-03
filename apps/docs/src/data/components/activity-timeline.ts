// apps/docs/src/data/components/activity-timeline.ts
import type { ComponentData } from "../types"

export const activityTimelineData: ComponentData = {
	name: "ActivityTimeline",
	category: "blocks",
	description: "Timeline d'activités et d'événements chronologiques.",
	docPath: "/docs/components/blocks/activity-timeline",
	imports: {
		path: "@blazz/ui/components/blocks/activity-timeline",
		named: ["ActivityTimeline"],
	},
	props: [
		{
			name: "events",
			type: "TimelineEvent[]",
			required: true,
			description:
				"Tableau d'événements. Chaque item: { date: string (ISO), user: string, action: string, detail?: string }.",
		},
		{ name: "loading", type: "boolean", default: "false", description: "Affiche un skeleton." },
		{ name: "className", type: "string", description: "Classe CSS additionnelle sur la liste." },
	],
	gotchas: [
		"The prop is 'events', not 'activities' — the component uses TimelineEvent, not Activity",
		"'user' is a plain string (display name), not an object — no avatarUrl or id",
		"'date' must be an ISO string parseable by new Date() — the component formats it internally",
		"'action' is the main event label; 'detail' is an optional secondary line shown in muted text",
		"Always provide loading state — timeline is usually async",
	],
	canonicalExample: `const events = [
  { date: new Date().toISOString(), user: "Alice", action: "Called the client", detail: "Left a voicemail" },
  { date: new Date().toISOString(), user: "Bob", action: "Sent proposal email" },
]

<ActivityTimeline events={events} loading={false} />`,
}
