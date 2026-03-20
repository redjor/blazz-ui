import { ContactCard } from "@blazz/pro/components/ai/generative/entities/contact-card"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"
import { highlightExamples } from "~/lib/highlight-examples"
const examples = [
	{
		key: "full",
		code: `<ContactCard
  name="Laura Chen"
  avatar="https://i.pravatar.cc/150?u=laura"
  role="VP of Engineering"
  company="Stripe"
  email="laura@stripe.com"
  phone="+1 555-0142"
  lastContact="2 days ago"
  tags={["Enterprise", "Decision Maker"]}
/>`,
	},
	{
		key: "clickable",
		code: `<ContactCard
  href="/contacts/42"
  name="Laura Chen"
  role="VP of Engineering"
  company="Stripe"
/>`,
	},
] as const

const highlightedPromise = highlightExamples(examples as any)


const toc = [{ id: "examples", title: "Examples" }]

export default async function ContactCardPage() {
	const highlighted = await highlightedPromise
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

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
						company="Stripe"
						email="laura@stripe.com"
						phone="+1 555-0142"
						lastContact="2 days ago"
						tags={["Enterprise", "Decision Maker"]}
					/>
				</div>
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExampleClient
					title="Full Contact"
					description="All fields displayed."
					code={examples[0].code}
					highlightedCode={html("full")}
				>
					<div className="max-w-sm">
						<ContactCard
							name="Laura Chen"
							avatar="https://i.pravatar.cc/150?u=laura"
							company="Stripe"
							email="laura@stripe.com"
							phone="+1 555-0142"
							lastContact="2 days ago"
							tags={["Enterprise", "Decision Maker"]}
						/>
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Clickable Link"
					description="Pass href to make the card navigable."
					code={examples[1].code}
					highlightedCode={html("clickable")}
				>
					<div className="max-w-sm">
						<ContactCard
							href="#"
							name="Laura Chen"
							avatar="https://i.pravatar.cc/150?u=laura"
							company="Stripe"
						/>
					</div>
				</DocExampleClient>
			</DocSection>
		</DocPage>
	)
}
