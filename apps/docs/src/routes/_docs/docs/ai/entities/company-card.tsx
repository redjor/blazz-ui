import { CompanyCard } from "@blazz/ui/components/ai/generative/entities/company-card"
import { createFileRoute } from "@tanstack/react-router"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"
import { highlightCode } from "~/lib/highlight-code"

const examples = [
	{
		key: "full",
		code: `<CompanyCard
  name="Acme Corp"
  industry="SaaS · B2B"
  size="250–500 employees"
  revenue="$42M ARR"
  location="San Francisco, CA"
  website="acme.com"
  status="Customer"
  statusVariant="success"
/>`,
	},
	{
		key: "prospect",
		code: `<CompanyCard
  name="Datadog"
  industry="Monitoring"
  location="New York, NY"
  status="Prospect"
  statusVariant="info"
/>`,
	},
] as const

export const Route = createFileRoute("/_docs/docs/ai/entities/company-card")({
	loader: async () => {
		const highlighted = await Promise.all(
			examples.map(async (ex) => ({
				key: ex.key,
				html: await highlightCode({ data: { code: ex.code } }),
			}))
		)
		return { highlighted }
	},
	component: CompanyCardPage,
})

const toc = [{ id: "examples", title: "Examples" }]

function CompanyCardPage() {
	const { highlighted } = Route.useLoaderData()
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="Company Card"
			subtitle="Displays a company profile with industry, size, revenue and location."
			toc={toc}
		>
			<DocHero>
				<div className="max-w-sm">
					<CompanyCard
						name="Acme Corp"
						industry="SaaS · B2B"
						size="250–500 employees"
						revenue="$42M ARR"
						location="San Francisco, CA"
						website="acme.com"
						status="Customer"
						statusVariant="success"
					/>
				</div>
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExampleClient
					title="Full Profile"
					description="Company card with all fields."
					code={examples[0].code}
					highlightedCode={html("full")}
				>
					<div className="max-w-sm">
						<CompanyCard
							name="Acme Corp"
							industry="SaaS · B2B"
							size="250–500 employees"
							revenue="$42M ARR"
							location="San Francisco, CA"
							website="acme.com"
							status="Customer"
							statusVariant="success"
						/>
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Prospect"
					description="Minimal company card for a prospect."
					code={examples[1].code}
					highlightedCode={html("prospect")}
				>
					<div className="max-w-sm">
						<CompanyCard
							name="Datadog"
							industry="Monitoring"
							location="New York, NY"
							status="Prospect"
							statusVariant="info"
						/>
					</div>
				</DocExampleClient>
			</DocSection>
		</DocPage>
	)
}
