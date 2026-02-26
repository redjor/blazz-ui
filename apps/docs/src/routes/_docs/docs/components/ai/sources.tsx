import { createFileRoute } from "@tanstack/react-router"
import {
	Sources,
	SourcesTrigger,
	SourcesContent,
	Source,
} from "@blazz/ui/components/ai/reasoning/sources"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"
import { DocHero } from "~/components/docs/doc-hero"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { highlightCode } from "~/lib/highlight.server"

const examples = [
	{
		key: "expanded",
		code: `<Sources defaultOpen>
  <SourcesTrigger count={3} />
  <SourcesContent>
    <Source href="https://react.dev" title="React Docs" />
    <Source href="https://mdn.dev" title="MDN Web Docs" />
    <Source href="https://ts.dev" title="TypeScript" />
  </SourcesContent>
</Sources>`,
	},
	{
		key: "collapsed",
		code: `<Sources>
  <SourcesTrigger count={5} />
  <SourcesContent>
    <Source href="#" title="Source 1" />
    <Source href="#" title="Source 2" />
    ...
  </SourcesContent>
</Sources>`,
	},
	{
		key: "single",
		code: `<Sources defaultOpen>
  <SourcesTrigger count={1} />
  <SourcesContent>
    <Source href="https://react.dev" title="React Docs" />
  </SourcesContent>
</Sources>`,
	},
] as const

export const Route = createFileRoute("/_docs/docs/components/ai/sources")({
	loader: async () => {
		const highlighted = await Promise.all(
			examples.map(async (ex) => ({
				key: ex.key,
				html: await highlightCode({ data: { code: ex.code } }),
			}))
		)
		return { highlighted }
	},
	component: SourcesPage,
})

const toc = [{ id: "examples", title: "Examples" }]

const mockSources = [
	{ title: "React Documentation", href: "https://react.dev" },
	{ title: "MDN Web Docs - JavaScript", href: "https://developer.mozilla.org" },
	{ title: "TypeScript Handbook", href: "https://www.typescriptlang.org/docs" },
]

function SourcesPage() {
	const { highlighted } = Route.useLoaderData()
	const html = (key: string) =>
		highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="Sources"
			subtitle="A collapsible list of referenced sources that the AI used to generate its response."
			toc={toc}
		>
			<DocHero>
				<div className="w-full max-w-lg">
					<Sources defaultOpen>
						<SourcesTrigger count={3} />
						<SourcesContent>
							{mockSources.map((source) => (
								<Source
									key={source.href}
									href={source.href}
									title={source.title}
								/>
							))}
						</SourcesContent>
					</Sources>
				</div>
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExampleClient
					title="Expanded"
					description="Show the sources list open by default."
					code={examples[0].code}
					highlightedCode={html("expanded")}
				>
					<Sources defaultOpen>
						<SourcesTrigger count={3} />
						<SourcesContent>
							<Source href="https://react.dev" title="React Documentation" />
							<Source href="https://developer.mozilla.org" title="MDN Web Docs" />
							<Source href="https://www.typescriptlang.org" title="TypeScript Handbook" />
						</SourcesContent>
					</Sources>
				</DocExampleClient>

				<DocExampleClient
					title="Collapsed"
					description="By default sources are collapsed, showing only the count trigger."
					code={examples[1].code}
					highlightedCode={html("collapsed")}
				>
					<Sources>
						<SourcesTrigger count={5} />
						<SourcesContent>
							<Source href="#" title="Next.js Documentation" />
							<Source href="#" title="Vercel Blog" />
							<Source href="#" title="React RFC - Server Components" />
							<Source href="#" title="Dan Abramov - Overreacted" />
							<Source href="#" title="Kent C. Dodds Blog" />
						</SourcesContent>
					</Sources>
				</DocExampleClient>

				<DocExampleClient
					title="Single Source"
					description="Works equally well with a single source reference."
					code={examples[2].code}
					highlightedCode={html("single")}
				>
					<Sources defaultOpen>
						<SourcesTrigger count={1} />
						<SourcesContent>
							<Source href="https://react.dev" title="React Documentation - Hooks API" />
						</SourcesContent>
					</Sources>
				</DocExampleClient>
			</DocSection>
		</DocPage>
	)
}
