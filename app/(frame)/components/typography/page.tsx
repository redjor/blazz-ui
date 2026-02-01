import { Page } from "@/components/ui/page"
import { ComponentSection } from "@/components/features/docs/component-card"
import { Type } from "lucide-react"

const typographyComponents = [
	{
		title: "Text",
		href: "/components/ui/text",
		description: "Display text content with consistent typography using Polaris design tokens and semantic HTML.",
		icon: Type,
	},
]

export default function TypographyPage() {
	return (
		<Page
			title="Typography"
			subtitle="Typography components provide consistent text styling throughout your application using the Polaris design system."
		>
			<ComponentSection components={typographyComponents} />
		</Page>
	)
}
