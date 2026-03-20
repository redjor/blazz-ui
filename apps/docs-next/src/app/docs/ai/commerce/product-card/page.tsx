import { ProductCard } from "@blazz/pro/components/ai/generative/commerce/product-card"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"
import { highlightExamples } from "~/lib/highlight-examples"
const examples = [
	{
		key: "draft",
		code: `<ProductCard
  name="Wireless Keyboard MK7"
  price="$129.00"
  category="Peripherals"
  status="draft"
/>`,
	},
	{
		key: "archived",
		code: `<ProductCard
  name="Legacy CRM Module"
  price="$299.00/yr"
  category="Enterprise"
  status="archived"
/>`,
	},
] as const

const highlightedPromise = highlightExamples(examples as any)


const toc = [{ id: "examples", title: "Examples" }]

export default async function ProductCardPage() {
	const highlighted = await highlightedPromise
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="Product Card"
			subtitle="A compact product display with image, price, category and status."
			toc={toc}
		>
			<DocHero>
				<div className="max-w-sm">
					<ProductCard
						name="Pro Analytics Suite"
						price="$49.00/mo"
						category="Software"
						status="active"
						image="https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=80&h=80&fit=crop"
					/>
				</div>
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExampleClient
					title="Draft Product"
					description="A product not yet published to the catalog."
					code={examples[0].code}
					highlightedCode={html("draft")}
				>
					<div className="max-w-sm">
						<ProductCard
							name="Wireless Keyboard MK7"
							price="$129.00"
							category="Peripherals"
							status="draft"
						/>
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Archived"
					description="A discontinued product removed from the catalog."
					code={examples[1].code}
					highlightedCode={html("archived")}
				>
					<div className="max-w-sm">
						<ProductCard
							name="Legacy CRM Module"
							price="$299.00/yr"
							category="Enterprise"
							status="archived"
						/>
					</div>
				</DocExampleClient>
			</DocSection>
		</DocPage>
	)
}
