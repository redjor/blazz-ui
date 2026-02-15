import { Text } from "@/components/ui/text"
import { DocPage } from "@/components/features/docs/doc-page"
import { DocSection } from "@/components/features/docs/doc-section"
import { DocHero } from "@/components/features/docs/doc-hero"
import { DocExample } from "@/components/features/docs/doc-example"
import { DocPropsTable, type DocProp } from "@/components/features/docs/doc-props-table"

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
		default: '"span"',
		description: "The HTML element to render.",
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
		description: "Use tabular figures (monospace numbers).",
	},
]

export default function TextPage() {
	return (
		<DocPage
			title="Text"
			subtitle="Consistent typography across your application. Enforces a type scale so every heading and paragraph stays in sync."
			toc={toc}
		>
			{/* Hero */}
			<DocHero>
				<div className="space-y-1 text-center">
					<Text variant="heading-lg" as="h2">Invoice #1042</Text>
					<Text tone="muted" as="p">Due in 14 days</Text>
				</div>
			</DocHero>

			{/* Examples */}
			<DocSection id="examples" title="Examples">
				<DocExample
					title="Heading Scale"
					description="Seven heading sizes for content hierarchy."
					code={`<Text variant="heading-3xl" as="h1">Heading 3XL</Text>
<Text variant="heading-2xl" as="h2">Heading 2XL</Text>
<Text variant="heading-xl" as="h3">Heading XL</Text>
<Text variant="heading-lg" as="h4">Heading LG</Text>
<Text variant="heading-md" as="h5">Heading MD</Text>
<Text variant="heading-sm" as="h6">Heading SM</Text>
<Text variant="heading-xs">Heading XS</Text>`}
				>
					<div className="space-y-4">
						<Text variant="heading-3xl" as="h1">Heading 3XL</Text>
						<Text variant="heading-2xl" as="h2">Heading 2XL</Text>
						<Text variant="heading-xl" as="h3">Heading XL</Text>
						<Text variant="heading-lg" as="h4">Heading LG</Text>
						<Text variant="heading-md" as="h5">Heading MD</Text>
						<Text variant="heading-sm" as="h6">Heading SM</Text>
						<Text variant="heading-xs">Heading XS</Text>
					</div>
				</DocExample>

				<DocExample
					title="Body Scale"
					description="Four body sizes for content, descriptions, and captions."
					code={`<Text variant="body-lg" as="p">Large body text</Text>
<Text variant="body-md" as="p">Medium body text (default)</Text>
<Text variant="body-sm" as="p">Small body text</Text>
<Text variant="body-xs" as="p">Extra small body text</Text>`}
				>
					<div className="space-y-3">
						<Text variant="body-lg" as="p">Large body text for introductory paragraphs.</Text>
						<Text variant="body-md" as="p">Medium body text (default) for most content.</Text>
						<Text variant="body-sm" as="p">Small body text for secondary information.</Text>
						<Text variant="body-xs" as="p">Extra small for captions, labels, metadata.</Text>
					</div>
				</DocExample>

				<DocExample
					title="Tones"
					description="Semantic color tones for meaning."
					code={`<Text tone="default">Default text</Text>
<Text tone="muted">Muted secondary text</Text>
<Text tone="subtle">Subtle disabled text</Text>
<Text tone="success">Success message</Text>
<Text tone="danger">Error message</Text>
<Text tone="warning">Warning message</Text>
<Text tone="info">Information</Text>`}
				>
					<div className="space-y-2">
						<div><Text tone="default">Default text</Text></div>
						<div><Text tone="muted">Muted secondary text</Text></div>
						<div><Text tone="subtle">Subtle disabled text</Text></div>
						<div><Text tone="success">Success message</Text></div>
						<div><Text tone="danger">Error message</Text></div>
						<div><Text tone="warning">Warning message</Text></div>
						<div><Text tone="info">Information</Text></div>
					</div>
				</DocExample>

				<DocExample
					title="Truncate"
					description="Cut off long text with ellipsis."
					code={`<div className="max-w-xs">
  <Text truncate>
    This very long text will be truncated...
  </Text>
</div>`}
				>
					<div className="max-w-xs border border-edge rounded-lg p-4">
						<Text truncate>
							This is a very long text that will be truncated with an ellipsis when it exceeds the container width.
						</Text>
					</div>
				</DocExample>

				<DocExample
					title="Numeric"
					description="Tabular figures for aligned numbers in tables and financial data."
					code={`<Text>Regular: $1,234.56</Text>
<Text numeric>Numeric: $1,234.56</Text>`}
				>
					<div className="space-y-2">
						<div><Text>Regular: $1,234.56</Text></div>
						<div><Text numeric>Numeric: $1,234.56</Text></div>
						<div><Text numeric>Phone: +1 (555) 123-4567</Text></div>
					</div>
				</DocExample>

				<DocExample
					title="Composition"
					description="Combine variant, tone, and className for full control."
					code={`<Text variant="heading-lg" as="h2">Invoice #1042</Text>
<Text tone="muted" as="p">Due in 14 days</Text>
<Text tone="muted" className="line-through">$99.99</Text>
<Text tone="danger" className="font-semibold">$79.99</Text>`}
				>
					<div className="space-y-2">
						<Text variant="heading-lg" as="h2">Invoice #1042</Text>
						<Text tone="muted" as="p">Due in 14 days</Text>
						<div>
							<Text tone="muted" className="line-through">$99.99</Text>
							{" "}
							<Text tone="danger" className="font-semibold">$79.99</Text>
						</div>
					</div>
				</DocExample>
			</DocSection>

			{/* Props */}
			<DocSection id="props" title="Props">
				<DocPropsTable props={textProps} />
			</DocSection>

			{/* Guidelines */}
			<DocSection id="guidelines" title="Guidelines">
				<ul className="list-inside list-disc space-y-2 text-sm text-fg-muted">
					<li>Use <code>variant</code> for size -- never set <code>text-lg</code> directly on Text</li>
					<li>Use <code>tone</code> for semantic color -- not <code>className="text-red-500"</code></li>
					<li>Use <code>as</code> for semantic HTML -- headings get h1-h6, paragraphs get p</li>
					<li>For anything else (alignment, decoration, weight override), use <code>className</code></li>
					<li>Keep the API surface small -- <code>className</code> handles edge cases</li>
				</ul>
			</DocSection>
		</DocPage>
	)
}
