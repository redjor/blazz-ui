import { Text } from "@blazz/ui/components/ui/text"
import { createFileRoute } from "@tanstack/react-router"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { type DocProp, DocPropsTable } from "~/components/docs/doc-props-table"
import { DocSection } from "~/components/docs/doc-section"
import { highlightCode } from "~/lib/highlight-code"

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "props", title: "Props" },
	{ id: "guidelines", title: "Guidelines" },
]

const textProps: DocProp[] = [
	{
		name: "variant",
		type: '"heading-3xl" | "heading-2xl" | "heading-xl" | "heading-lg" | "heading-md" | "heading-sm" | "heading-xs" | "body-lg" | "body-md" | "body-sm" | "body-xs"',
		default: '"body-md"',
		description: "Typographic preset from the design system scale.",
	},
	{
		name: "as",
		type: '"h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "strong" | "em" | "dt" | "dd" | "label" | "legend"',
		default: "varies by variant",
		description:
			"The HTML element to render. Defaults to the semantic element for the variant (e.g. heading-xl renders as h3, body-md as p).",
	},
	{
		name: "tone",
		type: '"default" | "muted" | "subtle" | "success" | "danger" | "warning" | "info" | "inherit"',
		default: '"default"',
		description: "Semantic color tone.",
	},
	{
		name: "truncate",
		type: "boolean",
		default: "false",
		description: "Truncate text with ellipsis on overflow.",
	},
	{
		name: "numeric",
		type: "boolean",
		default: "false",
		description: "Use tabular figures for aligned numbers in tables and data.",
	},
]

const examples = [
	{
		key: "heading-scale",
		code: `<Text variant="heading-3xl">Heading 3XL</Text>  {/* → h1 */}
<Text variant="heading-2xl">Heading 2XL</Text>  {/* → h2 */}
<Text variant="heading-xl">Heading XL</Text>    {/* → h3 */}
<Text variant="heading-lg">Heading LG</Text>    {/* → h4 */}
<Text variant="heading-md">Heading MD</Text>    {/* → h5 */}
<Text variant="heading-sm">Heading SM</Text>    {/* → h6 */}
<Text variant="heading-xs">Heading XS</Text>    {/* → h6 */}`,
	},
	{
		key: "body-scale",
		code: `<Text variant="body-lg">Large body text</Text>    {/* → p */}
<Text variant="body-md">Medium body text</Text>  {/* → p */}
<Text variant="body-sm">Small body text</Text>    {/* → span */}
<Text variant="body-xs">Extra small text</Text>   {/* → span */}`,
	},
	{
		key: "semantic-defaults",
		code: `{/* Uses default h3 from heading-xl */}
<Text variant="heading-xl">Section Title</Text>

{/* Override: render heading-xl as h1 */}
<Text variant="heading-xl" as="h1">Page Title</Text>

{/* Uses default p from body-md */}
<Text>Paragraph content</Text>

{/* Override: render body-md as label */}
<Text as="label">Field label</Text>`,
	},
	{
		key: "tones",
		code: `<Text tone="default">Default text</Text>
<Text tone="muted">Muted secondary text</Text>
<Text tone="subtle">Subtle disabled text</Text>
<Text tone="success">Success message</Text>
<Text tone="danger">Error message</Text>
<Text tone="warning">Warning message</Text>
<Text tone="info">Information</Text>`,
	},
	{
		key: "truncate",
		code: `<div className="max-w-xs">
  <Text truncate>
    This very long text will be truncated...
  </Text>
</div>`,
	},
	{
		key: "numeric",
		code: `<Text>Regular: $1,234.56</Text>
<Text numeric>Numeric: $1,234.56</Text>`,
	},
	{
		key: "composition",
		code: `<Text variant="heading-lg">Invoice #1042</Text>
<Text tone="muted">Due in 14 days</Text>
<Text tone="muted" className="line-through">$99.99</Text>
<Text tone="danger" className="font-semibold">$79.99</Text>`,
	},
] as const

export const Route = createFileRoute("/_docs/docs/components/ui/text")({
	loader: async () => {
		const highlighted = await Promise.all(
			examples.map(async (ex) => ({
				key: ex.key,
				html: await highlightCode({ data: { code: ex.code } }),
			}))
		)
		return { highlighted }
	},
	component: TextPage,
})

function TextPage() {
	const { highlighted } = Route.useLoaderData()
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="Text"
			subtitle="Consistent typography across your application. Enforces a type scale so every heading and paragraph stays in sync."
			toc={toc}
		>
			<DocHero>
				<div className="space-y-1 text-center">
					<Text variant="heading-lg">Invoice #1042</Text>
					<Text tone="muted">Due in 14 days</Text>
				</div>
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExampleClient
					title="Heading Scale"
					description="Seven heading sizes for content hierarchy. Each variant renders the appropriate HTML element by default."
					code={examples[0].code}
					highlightedCode={html("heading-scale")}
				>
					<div className="space-y-4">
						<Text variant="heading-3xl">Heading 3XL</Text>
						<Text variant="heading-2xl">Heading 2XL</Text>
						<Text variant="heading-xl">Heading XL</Text>
						<Text variant="heading-lg">Heading LG</Text>
						<Text variant="heading-md">Heading MD</Text>
						<Text variant="heading-sm">Heading SM</Text>
						<Text variant="heading-xs">Heading XS</Text>
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Body Scale"
					description="Four body sizes for content, descriptions, and captions."
					code={examples[1].code}
					highlightedCode={html("body-scale")}
				>
					<div className="space-y-3">
						<Text variant="body-lg">Large body text for introductory paragraphs.</Text>
						<Text variant="body-md">Medium body text (default) for most content.</Text>
						<Text variant="body-sm">Small body text for secondary information.</Text>
						<Text variant="body-xs">Extra small for captions, labels, metadata.</Text>
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Semantic Defaults"
					description="Each variant maps to a sensible HTML element. Use as to override when needed."
					code={examples[2].code}
					highlightedCode={html("semantic-defaults")}
				>
					<div className="space-y-3">
						<Text variant="heading-xl">Section Title (h3)</Text>
						<Text variant="heading-xl" as="h1">
							Page Title (h1 override)
						</Text>
						<Text>Paragraph content (p)</Text>
						<Text as="label">Field label (label override)</Text>
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Tones"
					description="Semantic color tones for meaning."
					code={examples[3].code}
					highlightedCode={html("tones")}
				>
					<div className="space-y-2">
						<div>
							<Text tone="default">Default text</Text>
						</div>
						<div>
							<Text tone="muted">Muted secondary text</Text>
						</div>
						<div>
							<Text tone="subtle">Subtle disabled text</Text>
						</div>
						<div>
							<Text tone="success">Success message</Text>
						</div>
						<div>
							<Text tone="danger">Error message</Text>
						</div>
						<div>
							<Text tone="warning">Warning message</Text>
						</div>
						<div>
							<Text tone="info">Information</Text>
						</div>
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Truncate"
					description="Cut off long text with ellipsis."
					code={examples[4].code}
					highlightedCode={html("truncate")}
				>
					<div className="max-w-xs border border-edge rounded-lg p-4">
						<Text truncate>
							This is a very long text that will be truncated with an ellipsis when it exceeds the
							container width.
						</Text>
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Numeric"
					description="Tabular figures for aligned numbers in tables and financial data."
					code={examples[5].code}
					highlightedCode={html("numeric")}
				>
					<div className="space-y-2">
						<div>
							<Text>Regular: $1,234.56</Text>
						</div>
						<div>
							<Text numeric>Numeric: $1,234.56</Text>
						</div>
						<div>
							<Text numeric>Phone: +1 (555) 123-4567</Text>
						</div>
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Composition"
					description="Combine variant, tone, and className for full control."
					code={examples[6].code}
					highlightedCode={html("composition")}
				>
					<div className="space-y-2">
						<Text variant="heading-lg">Invoice #1042</Text>
						<Text tone="muted">Due in 14 days</Text>
						<div>
							<Text tone="muted" className="line-through">
								$99.99
							</Text>{" "}
							<Text tone="danger" className="font-semibold">
								$79.99
							</Text>
						</div>
					</div>
				</DocExampleClient>
			</DocSection>

			<DocSection id="props" title="Props">
				<DocPropsTable props={textProps} />
			</DocSection>

			<DocSection id="guidelines" title="Guidelines">
				<ul className="list-inside list-disc space-y-2 text-sm text-fg-muted">
					<li>
						Use <code>variant</code> for size -- never set <code>text-lg</code> directly on Text
					</li>
					<li>
						Use <code>tone</code> for semantic color -- not <code>className="text-red-500"</code>
					</li>
					<li>
						Omit <code>as</code> to get the right semantic element automatically (heading-xl = h3,
						body-md = p)
					</li>
					<li>
						Use <code>as</code> only when the visual variant and semantic element differ (e.g.
						heading-xl styled as h1)
					</li>
					<li>
						For anything else (alignment, decoration, weight override), use <code>className</code>
					</li>
					<li>
						Keep the API surface small -- <code>className</code> handles edge cases
					</li>
				</ul>
			</DocSection>
		</DocPage>
	)
}
