"use client"

import { DocPage } from "@/components/docs/doc-page"
import { DocSection } from "@/components/docs/doc-section"
import { DocHero } from "@/components/docs/doc-hero"
import { DocExampleSync as DocExample } from "@/components/docs/doc-example-client"
import {
	Sources,
	SourcesTrigger,
	SourcesContent,
	Source,
} from "@blazz/ui/components/ai/reasoning/sources"

const toc = [{ id: "examples", title: "Examples" }]

const mockSources = [
	{ title: "React Documentation", href: "https://react.dev" },
	{ title: "MDN Web Docs - JavaScript", href: "https://developer.mozilla.org" },
	{ title: "TypeScript Handbook", href: "https://www.typescriptlang.org/docs" },
]

export default function SourcesPage() {
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
				<DocExample
					title="Expanded"
					description="Show the sources list open by default."
					code={`<Sources defaultOpen>
  <SourcesTrigger count={3} />
  <SourcesContent>
    <Source href="https://react.dev" title="React Docs" />
    <Source href="https://mdn.dev" title="MDN Web Docs" />
    <Source href="https://ts.dev" title="TypeScript" />
  </SourcesContent>
</Sources>`}
				>
					<Sources defaultOpen>
						<SourcesTrigger count={3} />
						<SourcesContent>
							<Source href="https://react.dev" title="React Documentation" />
							<Source href="https://developer.mozilla.org" title="MDN Web Docs" />
							<Source href="https://www.typescriptlang.org" title="TypeScript Handbook" />
						</SourcesContent>
					</Sources>
				</DocExample>

				<DocExample
					title="Collapsed"
					description="By default sources are collapsed, showing only the count trigger."
					code={`<Sources>
  <SourcesTrigger count={5} />
  <SourcesContent>
    <Source href="#" title="Source 1" />
    <Source href="#" title="Source 2" />
    ...
  </SourcesContent>
</Sources>`}
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
				</DocExample>

				<DocExample
					title="Single Source"
					description="Works equally well with a single source reference."
					code={`<Sources defaultOpen>
  <SourcesTrigger count={1} />
  <SourcesContent>
    <Source href="https://react.dev" title="React Docs" />
  </SourcesContent>
</Sources>`}
				>
					<Sources defaultOpen>
						<SourcesTrigger count={1} />
						<SourcesContent>
							<Source href="https://react.dev" title="React Documentation - Hooks API" />
						</SourcesContent>
					</Sources>
				</DocExample>
			</DocSection>
		</DocPage>
	)
}
