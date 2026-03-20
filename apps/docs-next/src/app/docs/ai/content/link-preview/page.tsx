"use client"

import { use } from "react"
import { LinkPreview } from "@blazz/pro/components/ai/generative/content/link-preview"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"
import { highlightExamples } from "~/lib/highlight-examples"
const examples = [
	{
		key: "with-image",
		code: `<LinkPreview
  url="https://nextjs.org"
  title="Next.js by Vercel"
  description="The React Framework for the Web."
  image="https://nextjs.org/static/twitter-cards/home.jpg"
/>`,
	},
	{
		key: "without-image",
		code: `<LinkPreview
  url="https://github.com/vercel/next.js"
  title="vercel/next.js"
  description="The React Framework — GitHub repository with 120k+ stars."
/>`,
	},
] as const

const highlightedPromise = highlightExamples(examples as any)


const toc = [{ id: "examples", title: "Examples" }]

export default function LinkPreviewPage() {
	const highlighted = use(highlightedPromise)
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

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
				<DocExampleClient
					title="With Image"
					description="Full link preview with thumbnail."
					code={examples[0].code}
					highlightedCode={html("with-image")}
				>
					<div className="max-w-sm">
						<LinkPreview
							url="https://nextjs.org"
							title="Next.js by Vercel"
							description="The React Framework for the Web."
							image="https://nextjs.org/static/twitter-cards/home.jpg"
						/>
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Without Image"
					description="Text-only preview when no image is available."
					code={examples[1].code}
					highlightedCode={html("without-image")}
				>
					<div className="max-w-sm">
						<LinkPreview
							url="https://github.com/vercel/next.js"
							title="vercel/next.js"
							description="The React Framework — GitHub repository with 120k+ stars."
						/>
					</div>
				</DocExampleClient>
			</DocSection>
		</DocPage>
	)
}
