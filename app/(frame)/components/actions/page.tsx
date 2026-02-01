import { Page } from "@/components/ui/page"
import { ComponentSection } from "@/components/features/docs/component-card"
import { MousePointerClick, Menu, MoreHorizontal } from "lucide-react"

const actionComponents = [
	{
		title: "Button",
		href: "/components/ui/button",
		description: "Triggers an action or event when clicked. Supports multiple variants and sizes.",
		icon: MousePointerClick,
	},
	{
		title: "Button Group",
		href: "/components/ui/button-group",
		description: "Groups related buttons together for better organization and visual hierarchy.",
		icon: Menu,
	},
	{
		title: "Dropdown Menu",
		href: "/components/ui/dropdown-menu",
		description: "Displays a menu of actions in a dropdown overlay with keyboard navigation support.",
		icon: MoreHorizontal,
	},
]

export default function ActionsPage() {
	return (
		<Page
			title="Actions"
			subtitle="Components that allow users to trigger actions and interact with your application."
		>
			<ComponentSection
				title="Actions"
				description="Action components enable users to perform tasks and navigate through your application. They provide clear affordances for interaction and follow consistent visual patterns."
				components={actionComponents}
			/>
		</Page>
	)
}
