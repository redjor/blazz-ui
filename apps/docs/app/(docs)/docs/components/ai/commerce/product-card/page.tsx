"use client"

import { DocPage } from "@/components/features/docs/doc-page"
import { DocSection } from "@/components/features/docs/doc-section"
import { DocHero } from "@/components/features/docs/doc-hero"
import { DocExampleSync as DocExample } from "@/components/features/docs/doc-example-client"
import { ProductCard } from "@blazz/ui/components/ai/generative/commerce/product-card"

const toc = [{ id: "examples", title: "Examples" }]

export default function ProductCardPage() {
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
				<DocExample
					title="Draft Product"
					description="A product not yet published to the catalog."
					code={`<ProductCard
  name="Wireless Keyboard MK7"
  price="$129.00"
  category="Peripherals"
  status="draft"
/>`}
				>
					<div className="max-w-sm">
						<ProductCard
							name="Wireless Keyboard MK7"
							price="$129.00"
							category="Peripherals"
							status="draft"
						/>
					</div>
				</DocExample>

				<DocExample
					title="Archived"
					description="A discontinued product removed from the catalog."
					code={`<ProductCard
  name="Legacy CRM Module"
  price="$299.00/yr"
  category="Enterprise"
  status="archived"
/>`}
				>
					<div className="max-w-sm">
						<ProductCard
							name="Legacy CRM Module"
							price="$299.00/yr"
							category="Enterprise"
							status="archived"
						/>
					</div>
				</DocExample>
			</DocSection>
		</DocPage>
	)
}
