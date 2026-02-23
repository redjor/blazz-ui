"use client"

import { DocPage } from "@/components/features/docs/doc-page"
import { DocSection } from "@/components/features/docs/doc-section"
import { DocHero } from "@/components/features/docs/doc-hero"
import { DocExampleSync as DocExample } from "@/components/features/docs/doc-example-client"
import { DealCard } from "@/components/ai/generative/entities/deal-card"

const toc = [{ id: "examples", title: "Examples" }]

export default function DealCardPage() {
	return (
		<DocPage
			title="Deal Card"
			subtitle="Displays a sales deal with amount, pipeline stage, probability and close date."
			toc={toc}
		>
			<DocHero>
				<div className="max-w-sm">
					<DealCard
						title="Enterprise License"
						amount="$48,000"
						stage="negotiation"
						probability={75}
						company="Acme Corp"
						closeDate="Mar 15, 2026"
						owner="Jean Dupont"
					/>
				</div>
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExample
					title="In Negotiation"
					description="Active deal with probability and close date."
					code={`<DealCard
  title="Enterprise License"
  amount="$48,000"
  stage="negotiation"
  probability={75}
  company="Acme Corp"
  closeDate="Mar 15, 2026"
  owner="Jean Dupont"
/>`}
				>
					<div className="max-w-sm">
						<DealCard
							title="Enterprise License"
							amount="$48,000"
							stage="negotiation"
							probability={75}
							company="Acme Corp"
							closeDate="Mar 15, 2026"
							owner="Jean Dupont"
						/>
					</div>
				</DocExample>

				<DocExample
					title="Closed Won"
					description="Successfully closed deal."
					code={`<DealCard
  title="Pro Upgrade"
  amount="$12,000"
  stage="closed-won"
  company="Datadog"
/>`}
				>
					<div className="max-w-sm">
						<DealCard
							title="Pro Upgrade"
							amount="$12,000"
							stage="closed-won"
							company="Datadog"
						/>
					</div>
				</DocExample>

				<DocExample
					title="Multiple Deals"
					description="Stack deal cards to show a pipeline."
					code={`<div className="space-y-3">
  <DealCard title="Enterprise" amount="$48K" stage="negotiation" company="Acme" />
  <DealCard title="Pro Plan" amount="$12K" stage="proposal" company="Stripe" />
  <DealCard title="Starter" amount="$3.6K" stage="qualification" company="Linear" />
</div>`}
				>
					<div className="max-w-sm space-y-3">
						<DealCard title="Enterprise" amount="$48K" stage="negotiation" company="Acme" />
						<DealCard title="Pro Plan" amount="$12K" stage="proposal" company="Stripe" />
						<DealCard title="Starter" amount="$3.6K" stage="qualification" company="Linear" />
					</div>
				</DocExample>
			</DocSection>
		</DocPage>
	)
}
