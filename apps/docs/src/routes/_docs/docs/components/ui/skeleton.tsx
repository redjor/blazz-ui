import { createFileRoute } from "@tanstack/react-router"
import { Skeleton } from "@blazz/ui/components/ui/skeleton"
import { Card, CardHeader, CardContent } from "@blazz/ui/components/ui/card"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"
import { DocHero } from "~/components/docs/doc-hero"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { highlightCode } from "~/lib/highlight-code"

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "tokens", title: "Tokens" },
	{ id: "guidelines", title: "Guidelines" },
]

const examples = [
	{
		key: "basic",
		code: `<div className="space-y-2">
  <Skeleton className="h-4 w-full" />
  <Skeleton className="h-4 w-full" />
  <Skeleton className="h-4 w-3/4" />
</div>`,
	},
	{
		key: "card",
		code: `<Card>
  <CardHeader>
    <div className="flex items-center gap-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
  </CardHeader>
  <CardContent>
    <div className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  </CardContent>
</Card>`,
	},
	{
		key: "list",
		code: `<div className="space-y-4">
  {[1, 2, 3].map((i) => (
    <div key={i} className="flex items-center gap-4">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  ))}
</div>`,
	},
	{
		key: "table",
		code: `<div className="space-y-3">
  <div className="flex gap-4">
    <Skeleton className="h-8 flex-1" />
    <Skeleton className="h-8 flex-1" />
    <Skeleton className="h-8 flex-1" />
    <Skeleton className="h-8 w-24" />
  </div>
  {[1, 2, 3, 4].map((i) => (
    <div key={i} className="flex gap-4">
      <Skeleton className="h-6 flex-1" />
      <Skeleton className="h-6 flex-1" />
      <Skeleton className="h-6 flex-1" />
      <Skeleton className="h-6 w-24" />
    </div>
  ))}
</div>`,
	},
	{
		key: "article",
		code: `<div className="space-y-4">
  <Skeleton className="h-8 w-3/4" />
  <Skeleton className="h-4 w-1/2" />
  <Skeleton className="h-48 w-full" />
  <div className="space-y-2">
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-2/3" />
  </div>
</div>`,
	},
] as const

export const Route = createFileRoute("/_docs/docs/components/ui/skeleton")({
	loader: async () => {
		const highlighted = await Promise.all(
			examples.map(async (ex) => ({
				key: ex.key,
				html: await highlightCode({ data: { code: ex.code } }),
			})),
		)
		return { highlighted }
	},
	component: SkeletonPage,
})

function SkeletonPage() {
	const { highlighted } = Route.useLoaderData()
	const html = (key: string) =>
		highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="Skeleton"
			subtitle="Display placeholder content while data is loading."
			toc={toc}
		>
			<DocHero>
				<div className="w-full max-w-sm space-y-3">
					<div className="flex items-center gap-3">
						<Skeleton className="h-10 w-10 rounded-full" />
						<div className="space-y-2 flex-1">
							<Skeleton className="h-4 w-1/2" />
							<Skeleton className="h-3 w-1/3" />
						</div>
					</div>
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-3/4" />
				</div>
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExampleClient
					title="Basic Skeleton"
					description="Simple skeleton shapes for loading states."
					code={examples[0].code}
					highlightedCode={html("basic")}
				>
					<div className="space-y-2">
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-3/4" />
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Card Skeleton"
					description="Skeleton for a card with avatar and text."
					code={examples[1].code}
					highlightedCode={html("card")}
				>
					<Card>
						<CardHeader>
							<div className="flex items-center gap-4">
								<Skeleton className="h-12 w-12 rounded-full" />
								<div className="space-y-2 flex-1">
									<Skeleton className="h-4 w-1/2" />
									<Skeleton className="h-3 w-1/3" />
								</div>
							</div>
						</CardHeader>
						<CardContent>
							<div className="space-y-2">
								<Skeleton className="h-4 w-full" />
								<Skeleton className="h-4 w-full" />
								<Skeleton className="h-4 w-2/3" />
							</div>
						</CardContent>
					</Card>
				</DocExampleClient>

				<DocExampleClient
					title="List Skeleton"
					description="Skeleton for a list of items."
					code={examples[2].code}
					highlightedCode={html("list")}
				>
					<div className="space-y-4">
						{[1, 2, 3].map((i) => (
							<div key={i} className="flex items-center gap-4">
								<Skeleton className="h-10 w-10 rounded-full" />
								<div className="space-y-2 flex-1">
									<Skeleton className="h-4 w-1/3" />
									<Skeleton className="h-3 w-1/2" />
								</div>
							</div>
						))}
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Table Skeleton"
					description="Skeleton for a table layout."
					code={examples[3].code}
					highlightedCode={html("table")}
				>
					<div className="space-y-3">
						<div className="flex gap-4">
							<Skeleton className="h-8 flex-1" />
							<Skeleton className="h-8 flex-1" />
							<Skeleton className="h-8 flex-1" />
							<Skeleton className="h-8 w-24" />
						</div>
						{[1, 2, 3, 4].map((i) => (
							<div key={i} className="flex gap-4">
								<Skeleton className="h-6 flex-1" />
								<Skeleton className="h-6 flex-1" />
								<Skeleton className="h-6 flex-1" />
								<Skeleton className="h-6 w-24" />
							</div>
						))}
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Article Skeleton"
					description="Skeleton for article or blog post."
					code={examples[4].code}
					highlightedCode={html("article")}
				>
					<div className="space-y-4">
						<Skeleton className="h-8 w-3/4" />
						<Skeleton className="h-4 w-1/2" />
						<Skeleton className="h-48 w-full" />
						<div className="space-y-2">
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-4 w-2/3" />
						</div>
					</div>
				</DocExampleClient>
			</DocSection>

			<DocSection id="tokens" title="Design Tokens">
				<p className="text-sm text-fg-muted">
					Skeleton uses the design system tokens for consistent styling:
				</p>
				<ul className="list-inside list-disc space-y-2 text-sm text-fg-muted">
					<li><code className="text-xs">bg-raised</code> - Skeleton background color</li>
					<li><code className="text-xs">rounded-md</code> - Default border radius (0.375rem)</li>
					<li><code className="text-xs">animate-pulse</code> - Pulsing animation</li>
					<li><code className="text-xs">rounded-full</code> - For circular skeletons (avatars)</li>
				</ul>
				<div className="space-y-4">
					<h3 className="font-semibold text-sm text-fg">Common Patterns</h3>
					<div className="space-y-4">
						<div>
							<h4 className="font-semibold text-sm mb-2 text-fg-muted">Avatar + Text</h4>
							<code className="text-xs bg-raised px-2 py-1 rounded">
								&lt;Skeleton className="h-12 w-12 rounded-full" /&gt;
							</code>
						</div>
						<div>
							<h4 className="font-semibold text-sm mb-2 text-fg-muted">Text Line</h4>
							<code className="text-xs bg-raised px-2 py-1 rounded">
								&lt;Skeleton className="h-4 w-full" /&gt;
							</code>
						</div>
						<div>
							<h4 className="font-semibold text-sm mb-2 text-fg-muted">Image/Thumbnail</h4>
							<code className="text-xs bg-raised px-2 py-1 rounded">
								&lt;Skeleton className="h-48 w-full" /&gt;
							</code>
						</div>
						<div>
							<h4 className="font-semibold text-sm mb-2 text-fg-muted">Button</h4>
							<code className="text-xs bg-raised px-2 py-1 rounded">
								&lt;Skeleton className="h-10 w-24" /&gt;
							</code>
						</div>
					</div>
				</div>
			</DocSection>

			<DocSection id="guidelines" title="Guidelines">
				<ul className="list-inside list-disc space-y-2 text-sm text-fg-muted">
					<li>Match skeleton shape to final content layout</li>
					<li>Use similar proportions to actual content</li>
					<li>Keep animation subtle - pulse is less distracting than shimmer</li>
					<li>Show skeleton for minimum 300ms to avoid flash</li>
					<li>Use consistent skeleton patterns across your app</li>
					<li>Consider showing partial content instead of full skeleton</li>
					<li>Avoid showing skeleton for very fast operations (&lt;200ms)</li>
					<li>Combine with Suspense for automatic loading states</li>
					<li>Consider adding aria-busy="true" to parent container</li>
					<li>Use aria-label="Loading" on skeleton containers</li>
					<li>Ensure sufficient color contrast for visibility</li>
				</ul>
			</DocSection>
		</DocPage>
	)
}
