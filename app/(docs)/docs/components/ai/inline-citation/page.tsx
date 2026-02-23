"use client"

import { DocPage } from "@/components/features/docs/doc-page"
import { DocSection } from "@/components/features/docs/doc-section"
import { DocHero } from "@/components/features/docs/doc-hero"
import { DocExampleSync as DocExample } from "@/components/features/docs/doc-example-client"
import {
	InlineCitation,
	InlineCitationText,
	InlineCitationCard,
	InlineCitationCardTrigger,
	InlineCitationCardBody,
	InlineCitationCarousel,
	InlineCitationCarouselContent,
	InlineCitationCarouselItem,
	InlineCitationCarouselHeader,
	InlineCitationCarouselIndex,
	InlineCitationCarouselPrev,
	InlineCitationCarouselNext,
	InlineCitationSource,
} from "@/components/ai/reasoning/inline-citation"

const toc = [{ id: "examples", title: "Examples" }]

export default function InlineCitationPage() {
	return (
		<DocPage
			title="Inline Citation"
			subtitle="Inline citation pills that link text to source references with hover card previews and carousel navigation."
			toc={toc}
		>
			<DocHero>
				<div className="w-full max-w-lg text-sm leading-relaxed">
					<p>
						React Server Components allow you to render components on the server{" "}
						<InlineCitation>
							<InlineCitationText>reducing the JavaScript sent to the client</InlineCitationText>
							<InlineCitationCard>
								<InlineCitationCardTrigger sources={["https://react.dev/blog/2023/03/22/react-labs"]} />
								<InlineCitationCardBody>
									<InlineCitationCarousel>
										<InlineCitationCarouselHeader>
											<InlineCitationCarouselPrev />
											<InlineCitationCarouselIndex />
											<InlineCitationCarouselNext />
										</InlineCitationCarouselHeader>
										<InlineCitationCarouselContent>
											<InlineCitationCarouselItem>
												<InlineCitationSource
													title="React Labs - March 2023"
													url="https://react.dev/blog/2023/03/22/react-labs"
													description="Server Components let you run components on the server, reducing bundle size and improving performance."
												/>
											</InlineCitationCarouselItem>
										</InlineCitationCarouselContent>
									</InlineCitationCarousel>
								</InlineCitationCardBody>
							</InlineCitationCard>
						</InlineCitation>
						. This approach improves initial page load performance significantly.
					</p>
				</div>
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExample
					title="Single Source Citation"
					description="A citation pill linking to a single source with hover preview."
					code={`<InlineCitation>
  <InlineCitationText>
    some referenced text
  </InlineCitationText>
  <InlineCitationCard>
    <InlineCitationCardTrigger
      sources={["https://example.com"]}
    />
    <InlineCitationCardBody>
      <InlineCitationCarousel>
        <InlineCitationCarouselHeader>
          <InlineCitationCarouselPrev />
          <InlineCitationCarouselIndex />
          <InlineCitationCarouselNext />
        </InlineCitationCarouselHeader>
        <InlineCitationCarouselContent>
          <InlineCitationCarouselItem>
            <InlineCitationSource
              title="Source Title"
              url="https://example.com"
              description="Description."
            />
          </InlineCitationCarouselItem>
        </InlineCitationCarouselContent>
      </InlineCitationCarousel>
    </InlineCitationCardBody>
  </InlineCitationCard>
</InlineCitation>`}
				>
					<p className="text-sm leading-relaxed">
						TypeScript provides static type checking{" "}
						<InlineCitation>
							<InlineCitationText>catching errors at compile time</InlineCitationText>
							<InlineCitationCard>
								<InlineCitationCardTrigger sources={["https://www.typescriptlang.org/docs"]} />
								<InlineCitationCardBody>
									<InlineCitationCarousel>
										<InlineCitationCarouselHeader>
											<InlineCitationCarouselPrev />
											<InlineCitationCarouselIndex />
											<InlineCitationCarouselNext />
										</InlineCitationCarouselHeader>
										<InlineCitationCarouselContent>
											<InlineCitationCarouselItem>
												<InlineCitationSource
													title="TypeScript Handbook"
													url="https://www.typescriptlang.org/docs"
													description="TypeScript adds optional static typing and class-based object-oriented programming to the language."
												/>
											</InlineCitationCarouselItem>
										</InlineCitationCarouselContent>
									</InlineCitationCarousel>
								</InlineCitationCardBody>
							</InlineCitationCard>
						</InlineCitation>
						{" "}rather than at runtime.
					</p>
				</DocExample>

				<DocExample
					title="Multiple Sources"
					description="A citation referencing multiple sources shows the count in the pill."
					code={`<InlineCitationCardTrigger
  sources={[
    "https://react.dev",
    "https://nextjs.org",
  ]}
/>`}
				>
					<p className="text-sm leading-relaxed">
						Modern frameworks support streaming SSR{" "}
						<InlineCitation>
							<InlineCitationText>for better time-to-first-byte</InlineCitationText>
							<InlineCitationCard>
								<InlineCitationCardTrigger sources={["https://react.dev", "https://nextjs.org"]} />
								<InlineCitationCardBody>
									<InlineCitationCarousel>
										<InlineCitationCarouselHeader>
											<InlineCitationCarouselPrev />
											<InlineCitationCarouselIndex />
											<InlineCitationCarouselNext />
										</InlineCitationCarouselHeader>
										<InlineCitationCarouselContent>
											<InlineCitationCarouselItem>
												<InlineCitationSource
													title="React - Streaming SSR"
													url="https://react.dev"
													description="React 18 introduces streaming server-side rendering with Suspense."
												/>
											</InlineCitationCarouselItem>
											<InlineCitationCarouselItem>
												<InlineCitationSource
													title="Next.js - Streaming"
													url="https://nextjs.org"
													description="Next.js supports streaming with the App Router out of the box."
												/>
											</InlineCitationCarouselItem>
										</InlineCitationCarouselContent>
									</InlineCitationCarousel>
								</InlineCitationCardBody>
							</InlineCitationCard>
						</InlineCitation>
						.
					</p>
				</DocExample>
			</DocSection>
		</DocPage>
	)
}
