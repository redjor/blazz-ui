import { Page } from "@/components/ui/page"
import { ComponentSection } from "@/components/features/docs/component-card"
import { AlertCircle, Tag, MessageSquare, Loader2 } from "lucide-react"

const feedbackComponents = [
	{
		title: "Alert",
		href: "/components/ui/alert",
		description: "Displays important inline messages and notifications with different severity levels.",
		icon: AlertCircle,
	},
	{
		title: "Badge",
		href: "/components/ui/badge",
		description: "Small status indicators for labeling, categorizing, or showing counts with semantic colors.",
		icon: Tag,
	},
	{
		title: "Banner",
		href: "/components/ui/banner",
		description: "Informs users about important page-level changes or persistent conditions that need attention.",
		icon: MessageSquare,
	},
	{
		title: "Skeleton",
		href: "/components/ui/skeleton",
		description: "Display placeholder content while data is loading to improve perceived performance.",
		icon: Loader2,
	},
]

export default function FeedbackComponentsPage() {
	return (
		<Page
			title="Feedback Indicators"
			subtitle="Components that provide feedback to users about the state of the system or their actions."
		>
			<ComponentSection
				title="Feedback Indicators"
				description="Feedback components communicate important information, status changes, and system responses to users. Choose the right component based on the severity, persistence, and context of your message."
				components={feedbackComponents}
			/>
		</Page>
	)
}
