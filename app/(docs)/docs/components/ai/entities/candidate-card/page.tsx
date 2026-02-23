"use client"

import { CalendarPlus, MessageCircle, ExternalLink } from "lucide-react"
import { DocPage } from "@/components/features/docs/doc-page"
import { DocSection } from "@/components/features/docs/doc-section"
import { DocHero } from "@/components/features/docs/doc-hero"
import { DocExampleSync as DocExample } from "@/components/features/docs/doc-example-client"
import { CandidateCard } from "@/components/ai/generative/candidate-card"
import { Button } from "@/components/ui/button"

const toc = [{ id: "examples", title: "Examples" }]

export default function CandidateCardPage() {
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
				<DocExample
					title="Full Profile"
					description="Complete candidate card with all fields, status badge and match score."
					code={`<CandidateCard
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
/>`}
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
				</DocExample>

				<DocExample
					title="Minimal"
					description="Just name and role — everything else is optional."
					code={`<CandidateCard
  name="John Doe"
  role="Product Designer"
  status="in-process"
/>`}
				>
					<div className="max-w-sm">
						<CandidateCard
							name="John Doe"
							role="Product Designer"
							status="in-process"
						/>
					</div>
				</DocExample>

				<DocExample
					title="With Actions"
					description="Pass custom action buttons via the actions slot."
					code={`<CandidateCard
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
/>`}
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
				</DocExample>

				<DocExample
					title="Clickable Link"
					description="Pass href to make the entire card a navigable link."
					code={`<CandidateCard
  href="/candidates/42"
  name="Sarah Connor"
  avatar="https://i.pravatar.cc/150?u=sarah"
  role="Senior Frontend Engineer"
  company="Cyberdyne Systems"
  status="available"
  matchScore={92}
  skills={["React", "TypeScript"]}
/>`}
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
				</DocExample>

				<DocExample
					title="Multiple Candidates"
					description="Stack cards vertically to show a list of results."
					code={`<div className="space-y-3">
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
</div>`}
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
				</DocExample>
			</DocSection>
		</DocPage>
	)
}
