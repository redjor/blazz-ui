"use client"

import { DocPage } from "@/components/features/docs/doc-page"
import { DocSection } from "@/components/features/docs/doc-section"
import { DocHero } from "@/components/features/docs/doc-hero"
import { DocExampleSync as DocExample } from "@/components/features/docs/doc-example-client"
import { PricingTable } from "@/components/ai/generative/pricing-table"

const toc = [{ id: "examples", title: "Examples" }]

export default function PricingTablePage() {
	return (
		<DocPage
			title="Pricing Table"
			subtitle="A comparison table for pricing tiers with features and recommendations."
			toc={toc}
		>
			<DocHero>
				<div className="max-w-md">
					<PricingTable
						title="Choose a plan"
						tiers={[
							{
								name: "Starter",
								price: "$29",
								period: "mo",
								description: "For small teams",
								features: ["5 users", "10 GB storage", "Email support"],
							},
							{
								name: "Pro",
								price: "$79",
								period: "mo",
								description: "For growing teams",
								features: ["25 users", "100 GB storage", "Priority support", "API access"],
								recommended: true,
							},
							{
								name: "Enterprise",
								price: "$199",
								period: "mo",
								description: "For large organizations",
								features: ["Unlimited users", "1 TB storage", "24/7 support", "Custom integrations"],
							},
						]}
					/>
				</div>
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExample
					title="Three Tiers"
					description="Standard three-tier pricing with a recommended plan."
					code={`<PricingTable
  title="Choose a plan"
  tiers={[
    { name: "Starter", price: "$29", period: "mo", features: ["5 users", "Email support"] },
    { name: "Pro", price: "$79", period: "mo", features: ["25 users", "Priority support"], recommended: true },
    { name: "Enterprise", price: "$199", period: "mo", features: ["Unlimited", "24/7 support"] },
  ]}
/>`}
				>
					<div className="max-w-md">
						<PricingTable
							title="Choose a plan"
							tiers={[
								{ name: "Starter", price: "$29", period: "mo", features: ["5 users", "Email support"] },
								{ name: "Pro", price: "$79", period: "mo", features: ["25 users", "Priority support"], recommended: true },
								{ name: "Enterprise", price: "$199", period: "mo", features: ["Unlimited", "24/7 support"] },
							]}
						/>
					</div>
				</DocExample>

				<DocExample
					title="Two Tiers"
					description="Simple comparison between two options."
					code={`<PricingTable
  tiers={[
    { name: "Monthly", price: "$49", period: "mo", features: ["All features", "Cancel anytime"] },
    { name: "Annual", price: "$39", period: "mo", features: ["All features", "Save 20%"], recommended: true },
  ]}
/>`}
				>
					<div className="max-w-sm">
						<PricingTable
							tiers={[
								{ name: "Monthly", price: "$49", period: "mo", features: ["All features", "Cancel anytime"] },
								{ name: "Annual", price: "$39", period: "mo", features: ["All features", "Save 20%"], recommended: true },
							]}
						/>
					</div>
				</DocExample>
			</DocSection>
		</DocPage>
	)
}
