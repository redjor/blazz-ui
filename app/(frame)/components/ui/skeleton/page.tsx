"use client"

import * as React from "react"
import { Page } from "@/components/ui/page"
import { ComponentExample } from "@/components/features/docs/component-example"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardHeader, CardContent } from "@/components/ui/card"

export default function SkeletonPage() {
	return (
		<Page
			title="Skeleton"
			subtitle="Display placeholder content while data is loading."
		>
			<div className="space-y-12">
				{/* Basic Example */}
				<ComponentExample
					title="Basic Skeleton"
					description="Simple skeleton shapes for loading states."
					code={`<div className="space-y-2">
  <Skeleton className="h-4 w-full" />
  <Skeleton className="h-4 w-full" />
  <Skeleton className="h-4 w-3/4" />
</div>`}
				>
					<div className="space-y-2">
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-3/4" />
					</div>
				</ComponentExample>

				{/* Card Pattern */}
				<ComponentExample
					title="Card Skeleton"
					description="Skeleton for a card with avatar and text."
					code={`<Card>
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
</Card>`}
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
				</ComponentExample>

				{/* List Pattern */}
				<ComponentExample
					title="List Skeleton"
					description="Skeleton for a list of items."
					code={`<div className="space-y-4">
  {[1, 2, 3].map((i) => (
    <div key={i} className="flex items-center gap-4">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  ))}
</div>`}
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
				</ComponentExample>

				{/* Table Pattern */}
				<ComponentExample
					title="Table Skeleton"
					description="Skeleton for a table layout."
					code={`<div className="space-y-3">
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
</div>`}
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
				</ComponentExample>

				{/* Article Pattern */}
				<ComponentExample
					title="Article Skeleton"
					description="Skeleton for article or blog post."
					code={`<div className="space-y-4">
  <Skeleton className="h-8 w-3/4" />
  <Skeleton className="h-4 w-1/2" />
  <Skeleton className="h-48 w-full" />
  <div className="space-y-2">
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-2/3" />
  </div>
</div>`}
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
				</ComponentExample>

				{/* Design Tokens */}
				<section className="space-y-4">
					<h2 className="text-xl font-semibold">Design Tokens</h2>
					<p className="text-sm text-p-text-secondary">
						Skeleton uses the design system tokens for consistent styling:
					</p>
					<ul className="list-inside list-disc space-y-2 text-sm text-p-text-secondary">
						<li>
							<code className="text-xs">bg-muted</code> - Skeleton background color
						</li>
						<li>
							<code className="text-xs">rounded-md</code> - Default border radius (0.375rem)
						</li>
						<li>
							<code className="text-xs">animate-pulse</code> - Pulsing animation
						</li>
						<li>
							<code className="text-xs">rounded-full</code> - For circular skeletons (avatars)
						</li>
					</ul>
				</section>

				{/* Best Practices */}
				<section className="space-y-4">
					<h2 className="text-xl font-semibold">Best Practices</h2>
					<ul className="list-disc list-inside space-y-2 text-muted-foreground">
						<li>Match skeleton shape to final content layout</li>
						<li>Use similar proportions to actual content</li>
						<li>Keep animation subtle - pulse is less distracting than shimmer</li>
						<li>Show skeleton for minimum 300ms to avoid flash</li>
						<li>Use consistent skeleton patterns across your app</li>
						<li>Consider showing partial content instead of full skeleton</li>
						<li>Avoid showing skeleton for very fast operations (&lt;200ms)</li>
						<li>Combine with Suspense for automatic loading states</li>
					</ul>
				</section>

				{/* Common Patterns */}
				<section className="space-y-4">
					<h2 className="text-xl font-semibold">Common Patterns</h2>
					<div className="space-y-4">
						<div>
							<h3 className="font-semibold text-sm mb-2">Avatar + Text</h3>
							<code className="text-xs bg-muted px-2 py-1 rounded">
								&lt;Skeleton className="h-12 w-12 rounded-full" /&gt;
							</code>
						</div>
						<div>
							<h3 className="font-semibold text-sm mb-2">Text Line</h3>
							<code className="text-xs bg-muted px-2 py-1 rounded">
								&lt;Skeleton className="h-4 w-full" /&gt;
							</code>
						</div>
						<div>
							<h3 className="font-semibold text-sm mb-2">Image/Thumbnail</h3>
							<code className="text-xs bg-muted px-2 py-1 rounded">
								&lt;Skeleton className="h-48 w-full" /&gt;
							</code>
						</div>
						<div>
							<h3 className="font-semibold text-sm mb-2">Button</h3>
							<code className="text-xs bg-muted px-2 py-1 rounded">
								&lt;Skeleton className="h-10 w-24" /&gt;
							</code>
						</div>
					</div>
				</section>

				{/* Accessibility */}
				<section className="space-y-4">
					<h2 className="text-xl font-semibold">Accessibility</h2>
					<ul className="list-disc list-inside space-y-2 text-muted-foreground">
						<li>Consider adding aria-busy="true" to parent container</li>
						<li>Use aria-label="Loading" on skeleton containers</li>
						<li>Ensure sufficient color contrast for visibility</li>
						<li>Avoid relying solely on animation for loading indication</li>
						<li>Provide text alternative for screen readers when possible</li>
					</ul>
				</section>
			</div>
		</Page>
	)
}
