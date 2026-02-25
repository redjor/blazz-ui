import { Page } from "@blazz/ui/components/ui/page"
import { ComponentSection } from "@/components/features/docs/component-card"
import { MousePointerClick, Menu, MoreHorizontal } from "lucide-react"

const actionComponents = [
	{
		title: "Button",
		href: "/docs/components/ui/button",
		description: "Triggers an action or event when clicked. Supports multiple variants and sizes.",
		icon: MousePointerClick,
		thumbnail: "button",
	},
	{
		title: "Button Group",
		href: "/docs/components/ui/button-group",
		description: "Groups related buttons together for better organization and visual hierarchy.",
		icon: Menu,
		thumbnail: "button-group",
	},
	{
		title: "Dropdown Menu",
		href: "/docs/components/ui/dropdown-menu",
		description: "Displays a menu of actions in a dropdown overlay with keyboard navigation support.",
		icon: MoreHorizontal,
		thumbnail: "dropdown-menu",
	},
]

export default function ActionsPage() {
	return (
		<Page
			title="Actions"
			subtitle="Action components enable users to perform tasks and navigate through your application. They provide clear affordances for interaction and follow consistent visual patterns."
		>
			<ComponentSection components={actionComponents} />
		</Page>
	)
}
