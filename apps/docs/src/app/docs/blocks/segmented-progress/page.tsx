"use client"

import { use } from "react"
import { SegmentedProgress } from "@blazz/pro/components/blocks/segmented-progress"
import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { type DocProp, DocPropsTable } from "~/components/docs/doc-props-table"
import { DocRelated } from "~/components/docs/doc-related"
import { DocSection } from "~/components/docs/doc-section"
import { highlightExamples } from "~/lib/highlight-examples"

// ---------------------------------------------------------------------------
// Examples (code strings for highlighting)
// ---------------------------------------------------------------------------

const examples = [
	{
		key: "basic",
		code: `import { SegmentedProgress } from "@blazz/pro/components/blocks/segmented-progress"

<SegmentedProgress percent={35} />`,
	},
	{
		key: "colors",
		code: `import { SegmentedProgress } from "@blazz/pro/components/blocks/segmented-progress"

// Explicit color
<SegmentedProgress percent={50} color="brand" />
<SegmentedProgress percent={80} color="caution" />
<SegmentedProgress percent={95} color="negative" />`,
	},
	{
		key: "auto-color",
		code: `import { SegmentedProgress } from "@blazz/pro/components/blocks/segmented-progress"

// Auto-switch: brand < 75%, caution 75-90%, negative > 90%
<SegmentedProgress percent={50} autoColor />
<SegmentedProgress percent={82} autoColor />
<SegmentedProgress percent={96} autoColor />`,
	},
	{
		key: "sizes",
		code: `import { SegmentedProgress } from "@blazz/pro/components/blocks/segmented-progress"

// Default (6px dots, 2px gap)
<SegmentedProgress percent={60} />

// Larger dots
<SegmentedProgress percent={60} dotSize={8} gap={3} />

// Smaller dots
<SegmentedProgress percent={60} dotSize={4} gap={1} />`,
	},
] as const

const highlightedPromise = highlightExamples(examples as any)

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

const segmentedProgressProps: DocProp[] = [
	{
		name: "percent",
		type: "number",
		required: true,
		description: "Percentage filled (0-100+). Values over 100 are clamped to 100.",
	},
	{
		name: "color",
		type: '"brand" | "caution" | "negative"',
		default: '"brand"',
		description: "Dot fill color. Ignored when autoColor is true.",
	},
	{
		name: "autoColor",
		type: "boolean",
		default: "false",
		description:
			"Auto-switch color based on percent thresholds: brand below 75%, caution 75-90%, negative above 90%.",
	},
	{
		name: "dotSize",
		type: "number",
		default: "6",
		description: "Size of each dot in pixels.",
	},
	{
		name: "gap",
		type: "number",
		default: "2",
		description: "Gap between dots in pixels.",
	},
	{
		name: "className",
		type: "string",
		description: "Additional CSS classes for the root container.",
	},
]

// ---------------------------------------------------------------------------
// TOC
// ---------------------------------------------------------------------------

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "props", title: "Props" },
	{ id: "related", title: "Related" },
]

// ---------------------------------------------------------------------------
// Route
// ---------------------------------------------------------------------------


// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------

function SegmentedProgressHeroDemo() {
	return (
		<div className="w-full max-w-md rounded-lg border border-edge bg-surface overflow-hidden p-6">
			<BlockStack gap="400">
				<SegmentedProgress percent={65} />
				<SegmentedProgress percent={82} autoColor />
				<SegmentedProgress percent={96} autoColor />
			</BlockStack>
		</div>
	)
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function SegmentedProgressPage() {
	const highlighted = use(highlightedPromise)
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="Segmented Progress"
			subtitle="A responsive dot-based progress bar that adapts to its container width. Each dot fills based on the percentage, with automatic color thresholds for budget and consumption tracking."
			toc={toc}
		>
			<DocHero>
				<SegmentedProgressHeroDemo />
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExampleClient
					title="Basic"
					description="A simple progress bar at 35%. The number of dots adapts automatically to the container width using ResizeObserver."
					code={examples[0].code}
					highlightedCode={html("basic")}
				>
					<div className="w-full max-w-md rounded-lg border border-edge bg-surface overflow-hidden p-4">
						<SegmentedProgress percent={35} />
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Colors"
					description="Manually set the bar color with the color prop."
					code={examples[1].code}
					highlightedCode={html("colors")}
				>
					<div className="w-full max-w-md rounded-lg border border-edge bg-surface overflow-hidden p-4">
						<BlockStack gap="300">
							<SegmentedProgress percent={50} color="brand" />
							<SegmentedProgress percent={80} color="caution" />
							<SegmentedProgress percent={95} color="negative" />
						</BlockStack>
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Auto Color"
					description="With autoColor, the bar automatically switches between brand (< 75%), caution (75-90%), and negative (> 90%). Ideal for budget consumption."
					code={examples[2].code}
					highlightedCode={html("auto-color")}
				>
					<div className="w-full max-w-md rounded-lg border border-edge bg-surface overflow-hidden p-4">
						<BlockStack gap="300">
							<SegmentedProgress percent={50} autoColor />
							<SegmentedProgress percent={82} autoColor />
							<SegmentedProgress percent={96} autoColor />
						</BlockStack>
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Dot Sizes"
					description="Customize dot size and gap for different densities."
					code={examples[3].code}
					highlightedCode={html("sizes")}
				>
					<div className="w-full max-w-md rounded-lg border border-edge bg-surface overflow-hidden p-4">
						<BlockStack gap="300">
							<SegmentedProgress percent={60} />
							<SegmentedProgress percent={60} dotSize={8} gap={3} />
							<SegmentedProgress percent={60} dotSize={4} gap={1} />
						</BlockStack>
					</div>
				</DocExampleClient>
			</DocSection>

			<DocSection id="props" title="Props">
				<DocPropsTable props={segmentedProgressProps} />
			</DocSection>

			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{
							title: "Budget Card",
							href: "/docs/blocks/budget-card",
							description:
								"Card component that composes SegmentedProgress with project name, revenue, and budget label.",
						},
						{
							title: "Stats Grid",
							href: "/docs/blocks/stats-grid",
							description: "Responsive grid of KPI cards with trend indicators.",
						},
					]}
				/>
			</DocSection>
		</DocPage>
	)
}
