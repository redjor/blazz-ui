import { createFileRoute } from "@tanstack/react-router"
import { Page } from "@blazz/ui/components/ui/page"
import { CategoryPageHero, ComponentSection } from "~/components/docs/component-card"
import { Type } from "lucide-react"

export const Route = createFileRoute("/_docs/docs/components/typography")({
	component: TypographyPage,
})

const typographyComponents = [
	{
		title: "Text",
		href: "/docs/components/ui/text",
		description: "Display text content with consistent typography using design system tokens and semantic HTML.",
		icon: Type,
	},
]

function TypographyPage() {
	return (
		<Page>
			<CategoryPageHero
				title="Typography"
				description="Typography components provide consistent text styling throughout your application using the design system type scale."
			/>
			<ComponentSection components={typographyComponents} />
		</Page>
	)
}
