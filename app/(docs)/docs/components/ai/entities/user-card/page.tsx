"use client"

import { DocPage } from "@/components/features/docs/doc-page"
import { DocSection } from "@/components/features/docs/doc-section"
import { DocHero } from "@/components/features/docs/doc-hero"
import { DocExampleSync as DocExample } from "@/components/features/docs/doc-example-client"
import { UserCard } from "@/components/ai/generative/user-card"

const toc = [{ id: "examples", title: "Examples" }]

export default function UserCardPage() {
	return (
		<DocPage
			title="User Card"
			subtitle="A compact card to mention or reference a team member inline."
			toc={toc}
		>
			<DocHero>
				<div className="max-w-xs">
					<UserCard
						name="Jean Dupont"
						avatar="https://i.pravatar.cc/150?u=jean"
						role="Account Executive"
						department="Sales"
						status="online"
					/>
				</div>
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExample
					title="Online User"
					description="Compact user mention with status."
					code={`<UserCard
  name="Jean Dupont"
  avatar="https://i.pravatar.cc/150?u=jean"
  role="Account Executive"
  department="Sales"
  status="online"
/>`}
				>
					<div className="max-w-xs">
						<UserCard
							name="Jean Dupont"
							avatar="https://i.pravatar.cc/150?u=jean"
							role="Account Executive"
							department="Sales"
							status="online"
						/>
					</div>
				</DocExample>

				<DocExample
					title="Team List"
					description="Stack multiple user cards."
					code={`<div className="space-y-2">
  <UserCard name="Jean Dupont" role="AE" status="online" />
  <UserCard name="Marie Martin" role="CSM" status="busy" />
  <UserCard name="Paul Bernard" role="SDR" status="away" />
</div>`}
				>
					<div className="max-w-xs space-y-2">
						<UserCard name="Jean Dupont" avatar="https://i.pravatar.cc/150?u=jean" role="AE" department="Sales" status="online" />
						<UserCard name="Marie Martin" avatar="https://i.pravatar.cc/150?u=mariem" role="CSM" department="Success" status="busy" />
						<UserCard name="Paul Bernard" avatar="https://i.pravatar.cc/150?u=paul" role="SDR" department="Sales" status="away" />
					</div>
				</DocExample>
			</DocSection>
		</DocPage>
	)
}
