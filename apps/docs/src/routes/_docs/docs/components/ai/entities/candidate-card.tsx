import { createFileRoute } from "@tanstack/react-router"
import { CalendarPlus, MessageCircle, ExternalLink } from "lucide-react"
import { CandidateCard } from "@blazz/ui/components/ai/generative/entities/candidate-card"
import { Button } from "@blazz/ui/components/ui/button"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"
import { DocHero } from "~/components/docs/doc-hero"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { highlightCode } from "~/lib/highlight-code"

const examples = [
	{
		key: "full-profile",
		code: `<CandidateCard
  name="Sarah Connor"
  avatar="https://i.pravatar.cc/150?u=sarah"
  role="Senior Frontend Engineer"
  company="Cyberdyne Systems"
  location="Los Angeles, CA"
  email="sarah@skynet.com"
  status="available"
  matchScore={92}
  skills={["React", "TypeScript", "Node.js", "GraphQL"]}
  experience="8 years in frontend development, 3 years leading teams"
/>`,
	},
	{
		key: "minimal",
		code: `<CandidateCard
  name="John Doe"
  role="Product Designer"
  status="in-process"
/>`,
	},
	{
		key: "with-actions",
		code: `<CandidateCard
  name="Marie Curie"
  avatar="https://i.pravatar.cc/150?u=marie"
  role="Data Scientist"
  company="CNRS"
  location="Paris, France"
  status="available"
  matchScore={87}
  skills={["Python", "ML", "PyTorch"]}
  actions={
    <>
      <Button size="xs" variant="default">
        <CalendarPlus className="size-3.5" /> Schedule
      </Button>
      <Button size="xs" variant="outline">
        <MessageCircle className="size-3.5" /> Message
      </Button>
      <Button size="xs" variant="ghost">
        <ExternalLink className="size-3.5" /> Profile
      </Button>
    </>
  }
/>`,
	},
	{
		key: "clickable",
		code: `<CandidateCard
  href="/candidates/42"
  name="Sarah Connor"
  avatar="https://i.pravatar.cc/150?u=sarah"
  role="Senior Frontend Engineer"
  company="Cyberdyne Systems"
  status="available"
  matchScore={92}
  skills={["React", "TypeScript"]}
/>`,
	},
	{
		key: "multiple",
		code: `<div className="space-y-3">
  <CandidateCard
    name="Alice Martin"
    role="Backend Engineer"
    company="Stripe"
    status="available"
    matchScore={95}
    skills={["Go", "Postgres", "gRPC"]}
  />
  <CandidateCard
    name="Bob Chen"
    role="Backend Engineer"
    company="Datadog"
    status="in-process"
    matchScore={88}
    skills={["Rust", "Kafka", "AWS"]}
  />
</div>`,
	},
] as const

export const Route = createFileRoute(
	"/_docs/docs/components/ai/entities/candidate-card"
)({
	loader: async () => {
		const highlighted = await Promise.all(
			examples.map(async (ex) => ({
				key: ex.key,
				html: await highlightCode({ data: { code: ex.code } }),
			}))
		)
		return { highlighted }
	},
	component: CandidateCardPage,
})

const toc = [{ id: "examples", title: "Examples" }]

function CandidateCardPage() {
	const { highlighted } = Route.useLoaderData()
	const html = (key: string) =>
		highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="Candidate Card"
			subtitle="Displays a candidate profile inline in an AI conversation — avatar, role, status, skills and match score."
			toc={toc}
		>
			<DocHero>
				<div className="max-w-sm">
					<CandidateCard
						name="Sarah Connor"
						avatar="https://i.pravatar.cc/150?u=sarah"
						role="Senior Frontend Engineer"
						company="Cyberdyne Systems"
						location="Los Angeles, CA"
						status="available"
						matchScore={92}
						skills={["React", "TypeScript", "Node.js", "GraphQL"]}
						experience="8 years in frontend development, 3 years leading teams"
					/>
				</div>
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExampleClient
					title="Full Profile"
					description="Complete candidate card with all fields, status badge and match score."
					code={examples[0].code}
					highlightedCode={html("full-profile")}
				>
					<div className="max-w-sm">
						<CandidateCard
							name="Sarah Connor"
							avatar="https://i.pravatar.cc/150?u=sarah"
							role="Senior Frontend Engineer"
							company="Cyberdyne Systems"
							location="Los Angeles, CA"
							email="sarah@skynet.com"
							status="available"
							matchScore={92}
							skills={["React", "TypeScript", "Node.js", "GraphQL"]}
							experience="8 years in frontend development, 3 years leading teams"
						/>
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Minimal"
					description="Just name and role — everything else is optional."
					code={examples[1].code}
					highlightedCode={html("minimal")}
				>
					<div className="max-w-sm">
						<CandidateCard
							name="John Doe"
							role="Product Designer"
							status="in-process"
						/>
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="With Actions"
					description="Pass custom action buttons via the actions slot."
					code={examples[2].code}
					highlightedCode={html("with-actions")}
				>
					<div className="max-w-sm">
						<CandidateCard
							name="Marie Curie"
							avatar="https://i.pravatar.cc/150?u=marie"
							role="Data Scientist"
							company="CNRS"
							location="Paris, France"
							status="available"
							matchScore={87}
							skills={["Python", "ML", "PyTorch"]}
							actions={
								<>
									<Button size="xs" variant="default">
										<CalendarPlus className="size-3.5" /> Schedule
									</Button>
									<Button size="xs" variant="outline">
										<MessageCircle className="size-3.5" /> Message
									</Button>
									<Button size="xs" variant="ghost">
										<ExternalLink className="size-3.5" /> Profile
									</Button>
								</>
							}
						/>
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Clickable Link"
					description="Pass href to make the entire card a navigable link."
					code={examples[3].code}
					highlightedCode={html("clickable")}
				>
					<div className="max-w-sm">
						<CandidateCard
							href="#"
							name="Sarah Connor"
							avatar="https://i.pravatar.cc/150?u=sarah"
							role="Senior Frontend Engineer"
							company="Cyberdyne Systems"
							status="available"
							matchScore={92}
							skills={["React", "TypeScript"]}
						/>
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Multiple Candidates"
					description="Stack cards vertically to show a list of results."
					code={examples[4].code}
					highlightedCode={html("multiple")}
				>
					<div className="max-w-sm space-y-3">
						<CandidateCard
							name="Alice Martin"
							avatar="https://i.pravatar.cc/150?u=alice"
							role="Backend Engineer"
							company="Stripe"
							status="available"
							matchScore={95}
							skills={["Go", "Postgres", "gRPC"]}
						/>
						<CandidateCard
							name="Bob Chen"
							avatar="https://i.pravatar.cc/150?u=bob"
							role="Backend Engineer"
							company="Datadog"
							status="in-process"
							matchScore={88}
							skills={["Rust", "Kafka", "AWS"]}
						/>
					</div>
				</DocExampleClient>
			</DocSection>
		</DocPage>
	)
}
