import { createFileRoute } from "@tanstack/react-router"
import { UserCard } from "@blazz/ui/components/ai/generative/entities/user-card"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"
import { DocHero } from "~/components/docs/doc-hero"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { highlightCode } from "~/lib/highlight.server"

const examples = [
	{
		key: "online",
		code: `<UserCard
  name="Jean Dupont"
  avatar="https://i.pravatar.cc/150?u=jean"
  role="Account Executive"
  department="Sales"
  status="online"
/>`,
	},
	{
		key: "team-list",
		code: `<div className="space-y-2">
  <UserCard name="Jean Dupont" role="AE" status="online" />
  <UserCard name="Marie Martin" role="CSM" status="busy" />
  <UserCard name="Paul Bernard" role="SDR" status="away" />
</div>`,
	},
] as const

export const Route = createFileRoute(
	"/_docs/docs/components/ai/entities/user-card"
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
	component: UserCardPage,
})

const toc = [{ id: "examples", title: "Examples" }]

function UserCardPage() {
	const { highlighted } = Route.useLoaderData()
	const html = (key: string) =>
		highlighted.find((h) => h.key === key)?.html ?? ""

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
				<DocExampleClient
					title="Online User"
					description="Compact user mention with status."
					code={examples[0].code}
					highlightedCode={html("online")}
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
				</DocExampleClient>

				<DocExampleClient
					title="Team List"
					description="Stack multiple user cards."
					code={examples[1].code}
					highlightedCode={html("team-list")}
				>
					<div className="max-w-xs space-y-2">
						<UserCard name="Jean Dupont" avatar="https://i.pravatar.cc/150?u=jean" role="AE" department="Sales" status="online" />
						<UserCard name="Marie Martin" avatar="https://i.pravatar.cc/150?u=mariem" role="CSM" department="Success" status="busy" />
						<UserCard name="Paul Bernard" avatar="https://i.pravatar.cc/150?u=paul" role="SDR" department="Sales" status="away" />
					</div>
				</DocExampleClient>
			</DocSection>
		</DocPage>
	)
}
