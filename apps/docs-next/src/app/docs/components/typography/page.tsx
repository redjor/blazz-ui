import { Page } from "@blazz/ui/components/ui/page"
import { Type } from "lucide-react"
import { CategoryPageHero, ComponentSection } from "~/components/docs/component-card"

const typographyComponents = [
	{
		title: "Text",
		href: "/docs/components/ui/text",
		description:
			"Display text content with consistent typography using design system tokens and semantic HTML.",
		icon: Type,
	},
]

export default function TypographyPage() {
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
