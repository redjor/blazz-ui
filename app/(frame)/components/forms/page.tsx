import Link from "next/link"
import { Page } from "@/components/ui/page"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

const formComponents = [
	{
		title: "Checkbox",
		href: "/components/ui/checkbox",
		description: "A control that allows the user to toggle between checked and unchecked states.",
	},
	{
		title: "Combobox",
		href: "/components/ui/combobox",
		description: "An input with autocomplete functionality.",
	},
	{
		title: "Field",
		href: "/components/ui/field",
		description: "A wrapper component for form inputs with label and error handling.",
	},
	{
		title: "Input",
		href: "/components/ui/input",
		description: "A text input field for single-line data entry.",
	},
	{
		title: "Label",
		href: "/components/ui/label",
		description: "A label for form controls.",
	},
	{
		title: "Select",
		href: "/components/ui/select",
		description: "A control for selecting from a list of options.",
	},
	{
		title: "Switch",
		href: "/components/ui/switch",
		description: "A toggle switch for binary choices.",
	},
	{
		title: "Tags Input",
		href: "/components/ui/tags-input",
		description: "An input for managing multiple tags or values.",
	},
	{
		title: "Textarea",
		href: "/components/ui/textarea",
		description: "A multi-line text input field.",
	},
]

export default function FormsPage() {
	return (
		<Page
			title="Selection and Input"
			subtitle="Components for capturing user input and making selections."
		>
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{formComponents.map((component) => (
					<Link key={component.href} href={component.href}>
						<Card className="h-full transition-colors hover:bg-muted/50">
							<CardHeader>
								<CardTitle className="text-base">{component.title}</CardTitle>
								<CardDescription>{component.description}</CardDescription>
							</CardHeader>
						</Card>
					</Link>
				))}
			</div>
		</Page>
	)
}
