"use client"

import { Page } from "@blazz/ui/components/ui/page"
import { AlertCircle, Bell, InboxIcon, Loader2, MessageSquare, Tag } from "lucide-react"
import { CategoryPageHero, ComponentSection } from "~/components/docs/component-card"

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
	{
		title: "Toast",
		href: "/docs/components/ui/toast",
		description: "Temporary notifications triggered imperatively after user actions. Supports success, error, warning, and promise states.",
		icon: Bell,
	},
]

export default function FeedbackComponentsPage() {
	return (
		<Page>
			<CategoryPageHero
				title="Feedback Indicators"
				description="Feedback components communicate important information, status changes, and system responses to users. Choose the right component based on the severity, persistence, and context of your message."
			/>
			<ComponentSection components={feedbackComponents} />
		</Page>
	)
}
