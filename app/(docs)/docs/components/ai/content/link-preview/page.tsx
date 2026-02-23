"use client"

import { DocPage } from "@/components/features/docs/doc-page"
import { DocSection } from "@/components/features/docs/doc-section"
import { DocHero } from "@/components/features/docs/doc-hero"
import { DocExampleSync as DocExample } from "@/components/features/docs/doc-example-client"
import { LinkPreview } from "@/components/ai/generative/link-preview"

const toc = [{ id: "examples", title: "Examples" }]

export default function LinkPreviewPage() {
	return (
		<DocPage
			title="Link Preview"
			subtitle="A rich preview card for external links with title, description and image."
			toc={toc}
		>
			<DocHero>
				<div className="max-w-sm">
					<LinkPreview
						url="https://nextjs.org"
						title="Next.js by Vercel"
						description="The React Framework for the Web. Used by some of the world's largest companies."
						image="https://nextjs.org/static/twitter-cards/home.jpg"
					/>
				</div>
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExample
					title="With Image"
					description="Full link preview with thumbnail."
					code={`<LinkPreview
  url="https://nextjs.org"
  title="Next.js by Vercel"
  description="The React Framework for the Web."
  image="https://nextjs.org/static/twitter-cards/home.jpg"
/>`}
				>
					<div className="max-w-sm">
						<LinkPreview
							url="https://nextjs.org"
							title="Next.js by Vercel"
							description="The React Framework for the Web."
							image="https://nextjs.org/static/twitter-cards/home.jpg"
						/>
					</div>
				</DocExample>

				<DocExample
					title="Without Image"
					description="Text-only preview when no image is available."
					code={`<LinkPreview
  url="https://github.com/vercel/next.js"
  title="vercel/next.js"
  description="The React Framework — GitHub repository with 120k+ stars."
/>`}
				>
					<div className="max-w-sm">
						<LinkPreview
							url="https://github.com/vercel/next.js"
							title="vercel/next.js"
							description="The React Framework — GitHub repository with 120k+ stars."
						/>
					</div>
				</DocExample>
			</DocSection>
		</DocPage>
	)
}
