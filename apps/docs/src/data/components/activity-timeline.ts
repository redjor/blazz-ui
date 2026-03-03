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
			name: "activities",
			type: "Activity[]",
			required: true,
			description: "Tableau d'activités. Chaque item: { id, type, user, description, createdAt }.",
		},
		{ name: "loading", type: "boolean", default: "false", description: "Affiche un skeleton." },
	],
	gotchas: [
		"Dates in activities are displayed as relative ('2 days ago') for < 7 days, absolute for older",
		"Always provide loading state — timeline is usually async",
	],
	canonicalExample: `<ActivityTimeline
  activities={activities}
  loading={activitiesLoading}
/>`,
}
