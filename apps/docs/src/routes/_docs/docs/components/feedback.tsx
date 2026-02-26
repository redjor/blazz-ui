import { createFileRoute } from "@tanstack/react-router"
import { Page } from "@blazz/ui/components/ui/page"
import { ComponentSection } from "~/components/docs/component-card"
import { AlertCircle, Tag, MessageSquare, Loader2, InboxIcon } from "lucide-react"

export const Route = createFileRoute("/_docs/docs/components/feedback")({
	component: FeedbackComponentsPage,
})

const feedbackComponents = [
	{
		title: "Alert",
		href: "/docs/components/ui/alert",
		description: "Displays important inline messages and notifications with different severity levels.",
		icon: AlertCircle,
		thumbnail: "alert",
	},
	{
		title: "Badge",
		href: "/docs/components/ui/badge",
		description: "Small status indicators for labeling, categorizing, or showing counts with semantic colors.",
		icon: Tag,
		thumbnail: "badge",
	},
	{
		title: "Banner",
		href: "/docs/components/ui/banner",
		description: "Informs users about important page-level changes or persistent conditions that need attention.",
		icon: MessageSquare,
		thumbnail: "banner",
	},
	{
		title: "Empty",
		href: "/docs/components/ui/empty",
		description: "Contextual empty states with actionable guidance for when data doesn't exist yet or search returns no results.",
		icon: InboxIcon,
		thumbnail: "empty",
	},
	{
		title: "Skeleton",
		href: "/docs/components/ui/skeleton",
		description: "Display placeholder content while data is loading to improve perceived performance.",
		icon: Loader2,
		thumbnail: "skeleton",
	},
]

function FeedbackComponentsPage() {
	return (
		<Page
			title="Feedback Indicators"
			subtitle="Feedback components communicate important information, status changes, and system responses to users. Choose the right component based on the severity, persistence, and context of your message."
		>
			<ComponentSection components={feedbackComponents} />
		</Page>
	)
}
