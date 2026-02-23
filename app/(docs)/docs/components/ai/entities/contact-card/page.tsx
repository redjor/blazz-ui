"use client"

import { DocPage } from "@/components/features/docs/doc-page"
import { DocSection } from "@/components/features/docs/doc-section"
import { DocHero } from "@/components/features/docs/doc-hero"
import { DocExampleSync as DocExample } from "@/components/features/docs/doc-example-client"
import { ContactCard } from "@/components/ai/generative/entities/contact-card"

const toc = [{ id: "examples", title: "Examples" }]

export default function ContactCardPage() {
	return (
		<DocPage
			title="Contact Card"
			subtitle="Displays a CRM contact with email, phone, company and last interaction."
			toc={toc}
		>
			<DocHero>
				<div className="max-w-sm">
					<ContactCard
						name="Laura Chen"
						avatar="https://i.pravatar.cc/150?u=laura"
						role="VP of Engineering"
						company="Stripe"
						email="laura@stripe.com"
						phone="+1 555-0142"
						lastContact="2 days ago"
						tags={["Enterprise", "Decision Maker"]}
					/>
				</div>
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExample
					title="Full Contact"
					description="All fields displayed."
					code={`<ContactCard
  name="Laura Chen"
  avatar="https://i.pravatar.cc/150?u=laura"
  role="VP of Engineering"
  company="Stripe"
  email="laura@stripe.com"
  phone="+1 555-0142"
  lastContact="2 days ago"
  tags={["Enterprise", "Decision Maker"]}
/>`}
				>
					<div className="max-w-sm">
						<ContactCard
							name="Laura Chen"
							avatar="https://i.pravatar.cc/150?u=laura"
							role="VP of Engineering"
							company="Stripe"
							email="laura@stripe.com"
							phone="+1 555-0142"
							lastContact="2 days ago"
							tags={["Enterprise", "Decision Maker"]}
						/>
					</div>
				</DocExample>

				<DocExample
					title="Clickable Link"
					description="Pass href to make the card navigable."
					code={`<ContactCard
  href="/contacts/42"
  name="Laura Chen"
  role="VP of Engineering"
  company="Stripe"
/>`}
				>
					<div className="max-w-sm">
						<ContactCard
							href="#"
							name="Laura Chen"
							avatar="https://i.pravatar.cc/150?u=laura"
							role="VP of Engineering"
							company="Stripe"
						/>
					</div>
				</DocExample>
			</DocSection>
		</DocPage>
	)
}
