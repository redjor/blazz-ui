"use client"

import { DocPage } from "@/components/features/docs/doc-page"
import { DocSection } from "@/components/features/docs/doc-section"
import { DocHero } from "@/components/features/docs/doc-hero"
import { DocExampleSync as DocExample } from "@/components/features/docs/doc-example-client"
import { RatingCard } from "@blazz/ui/components/ai/generative/data/rating-card"

const toc = [{ id: "examples", title: "Examples" }]

export default function RatingCardPage() {
	return (
		<DocPage
			title="Rating Card"
			subtitle="Display star ratings, numeric scores or NPS gauges."
			toc={toc}
		>
			<DocHero>
				<div className="max-w-xs space-y-3">
					<RatingCard
						title="Customer Satisfaction"
						score={4.3}
						type="stars"
						reviewCount={128}
						label="Based on recent surveys"
					/>
					<RatingCard
						title="Net Promoter Score"
						score={62}
						type="nps"
						label="Q4 2025"
					/>
				</div>
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExample
					title="Star Rating"
					description="Classic star-based rating."
					code={`<RatingCard
  title="Customer Satisfaction"
  score={4.3}
  type="stars"
  reviewCount={128}
/>`}
				>
					<div className="max-w-xs">
						<RatingCard
							title="Customer Satisfaction"
							score={4.3}
							type="stars"
							reviewCount={128}
						/>
					</div>
				</DocExample>

				<DocExample
					title="NPS Score"
					description="Net Promoter Score with gauge."
					code={`<RatingCard
  title="Net Promoter Score"
  score={62}
  type="nps"
  label="Q4 2025"
/>`}
				>
					<div className="max-w-xs">
						<RatingCard
							title="Net Promoter Score"
							score={62}
							type="nps"
							label="Q4 2025"
						/>
					</div>
				</DocExample>

				<DocExample
					title="Numeric Score"
					description="Simple numeric rating."
					code={`<RatingCard
  title="Product Score"
  score={8.5}
  maxScore={10}
  type="numeric"
/>`}
				>
					<div className="max-w-xs">
						<RatingCard
							title="Product Score"
							score={8.5}
							maxScore={10}
							type="numeric"
						/>
					</div>
				</DocExample>
			</DocSection>
		</DocPage>
	)
}
