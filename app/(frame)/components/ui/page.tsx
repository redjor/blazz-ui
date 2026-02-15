import Link from "next/link"
import { Page } from "@/components/ui/page"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

const actionComponents = [
	{
		title: "Button",
		description: "Trigger actions with various styles and sizes.",
		href: "/components/ui/button",
	},
	{
		title: "Button Group",
		description: "Group related buttons together.",
		href: "/components/ui/button-group",
	},
	{
		title: "Dropdown Menu",
		description: "Display a list of actions in a dropdown.",
		href: "/components/ui/dropdown-menu",
	},
]

const formComponents = [
	{
		title: "Input",
		description: "Text input field for user data entry.",
		href: "/components/ui/input",
	},
	{
		title: "Textarea",
		description: "Multi-line text input for longer content.",
		href: "/components/ui/textarea",
	},
	{
		title: "Checkbox",
		description: "Toggle selection for options.",
		href: "/components/ui/checkbox",
	},
	{
		title: "Switch",
		description: "Toggle control for on/off settings.",
		href: "/components/ui/switch",
	},
	{
		title: "Select",
		description: "Dropdown selection from a list of options.",
		href: "/components/ui/select",
	},
	{
		title: "Combobox",
		description: "Searchable dropdown selection.",
		href: "/components/ui/combobox",
	},
	{
		title: "Field",
		description: "Form field wrapper with label and error handling.",
		href: "/components/ui/field",
	},
	{
		title: "Label",
		description: "Label for form controls.",
		href: "/components/ui/label",
	},
	{
		title: "Tags Input",
		description: "Input for multiple tag values.",
		href: "/components/ui/tags-input",
	},
]

const feedbackComponents = [
	{
		title: "Alert",
		description: "Display important messages inline.",
		href: "/components/ui/alert",
	},
	{
		title: "Badge",
		description: "Small status indicators and labels.",
		href: "/components/ui/badge",
	},
	{
		title: "Skeleton",
		description: "Placeholder loading states.",
		href: "/components/ui/skeleton",
	},
]

const overlayComponents = [
	{
		title: "Dialog",
		description: "Modal dialogs for focused interactions.",
		href: "/components/ui/dialog",
	},
	{
		title: "Sheet",
		description: "Slide-out panels from screen edges.",
		href: "/components/ui/sheet",
	},
	{
		title: "Popover",
		description: "Floating content panels.",
		href: "/components/ui/popover",
	},
	{
		title: "Tooltip",
		description: "Helpful hints on hover or focus.",
		href: "/components/ui/tooltip",
	},
	{
		title: "Confirmation Dialog",
		description: "Confirm destructive actions.",
		href: "/components/ui/confirmation-dialog",
	},
]

const navigationComponents = [
	{
		title: "Tabs",
		description: "Organize content into tabbed views.",
		href: "/components/ui/tabs",
	},
	{
		title: "Breadcrumb",
		description: "Show navigation hierarchy.",
		href: "/components/ui/breadcrumb",
	},
	{
		title: "Menu",
		description: "Navigation menu component.",
		href: "/components/ui/menu",
	},
	{
		title: "Command",
		description: "Command palette for quick actions.",
		href: "/components/ui/command",
	},
]

const dataDisplayComponents = [
	{
		title: "Avatar",
		description: "Display user profile images.",
		href: "/components/ui/avatar",
	},
	{
		title: "Table",
		description: "Display tabular data.",
		href: "/components/ui/table",
	},
]

function ComponentSection({
	title,
	components,
}: {
	title: string
	components: { title: string; description: string; href: string }[]
}) {
	return (
		<section className="space-y-4">
			<h2 className="text-lg font-semibold">{title}</h2>
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{components.map((component) => (
					<Link key={component.href} href={component.href}>
						<Card className="h-full transition-colors hover:bg-raised/50">
							<CardHeader>
								<CardTitle className="text-base">{component.title}</CardTitle>
								<CardDescription className="line-clamp-2">
									{component.description}
								</CardDescription>
							</CardHeader>
						</Card>
					</Link>
				))}
			</div>
		</section>
	)
}

export default function UIComponentsPage() {
	return (
		<Page
			title="UI Components"
			subtitle="Interactive elements for building user interfaces."
		>
			<div className="space-y-8">
				<ComponentSection title="Actions" components={actionComponents} />
				<ComponentSection title="Form Controls" components={formComponents} />
				<ComponentSection title="Feedback" components={feedbackComponents} />
				<ComponentSection title="Overlays" components={overlayComponents} />
				<ComponentSection title="Navigation" components={navigationComponents} />
				<ComponentSection title="Data Display" components={dataDisplayComponents} />
			</div>
		</Page>
	)
}
