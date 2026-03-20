import { PricingTable } from "@blazz/pro/components/ai/generative/commerce/pricing-table"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"
import { highlightExamples } from "~/lib/highlight-examples"
const examples = [
	{
		key: "three-tiers",
		code: `<PricingTable
  title="Choose a plan"
  tiers={[
    { name: "Starter", price: "$29", period: "mo", features: ["5 users", "Email support"] },
    { name: "Pro", price: "$79", period: "mo", features: ["25 users", "Priority support"], recommended: true },
    { name: "Enterprise", price: "$199", period: "mo", features: ["Unlimited", "24/7 support"] },
  ]}
/>`,
	},
	{
		key: "two-tiers",
		code: `<PricingTable
  tiers={[
    { name: "Monthly", price: "$49", period: "mo", features: ["All features", "Cancel anytime"] },
    { name: "Annual", price: "$39", period: "mo", features: ["All features", "Save 20%"], recommended: true },
  ]}
/>`,
	},
] as const

const highlightedPromise = highlightExamples(examples as any)


const toc = [{ id: "examples", title: "Examples" }]

export default async function PricingTablePage() {
	const highlighted = await highlightedPromise
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

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
								features: [
									"Unlimited users",
									"1 TB storage",
									"24/7 support",
									"Custom integrations",
								],
							},
						]}
					/>
				</div>
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExampleClient
					title="Three Tiers"
					description="Standard three-tier pricing with a recommended plan."
					code={examples[0].code}
					highlightedCode={html("three-tiers")}
				>
					<div className="max-w-md">
						<PricingTable
							title="Choose a plan"
							tiers={[
								{
									name: "Starter",
									price: "$29",
									period: "mo",
									features: ["5 users", "Email support"],
								},
								{
									name: "Pro",
									price: "$79",
									period: "mo",
									features: ["25 users", "Priority support"],
									recommended: true,
								},
								{
									name: "Enterprise",
									price: "$199",
									period: "mo",
									features: ["Unlimited", "24/7 support"],
								},
							]}
						/>
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Two Tiers"
					description="Simple comparison between two options."
					code={examples[1].code}
					highlightedCode={html("two-tiers")}
				>
					<div className="max-w-sm">
						<PricingTable
							tiers={[
								{
									name: "Monthly",
									price: "$49",
									period: "mo",
									features: ["All features", "Cancel anytime"],
								},
								{
									name: "Annual",
									price: "$39",
									period: "mo",
									features: ["All features", "Save 20%"],
									recommended: true,
								},
							]}
						/>
					</div>
				</DocExampleClient>
			</DocSection>
		</DocPage>
	)
}
