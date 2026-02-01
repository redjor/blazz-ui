"use client"

import { Page } from "@/components/ui/page"
import { ComponentExample } from "@/components/features/docs/component-example"
import { PropsTable, type PropDefinition } from "@/components/features/docs/props-table"
import { Text } from "@/components/ui/text"

const textProps: PropDefinition[] = [
	{
		name: "variant",
		type: '"heading-3xl" | "heading-2xl" | "heading-xl" | "heading-lg" | "heading-md" | "heading-sm" | "heading-xs" | "body-lg" | "body-md" | "body-sm" | "body-xs"',
		default: '"body-md"',
		description: "The typographic style variant to apply.",
	},
	{
		name: "as",
		type: '"h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "strong" | "em" | "dt" | "dd" | "legend"',
		default: '"span"',
		description: "The HTML element to render for semantic markup.",
	},
	{
		name: "tone",
		type: '"base" | "subdued" | "disabled" | "success" | "critical" | "caution" | "warning" | "info" | "text-inverse" | "inherit"',
		default: '"base"',
		description: "The color tone to apply to the text.",
	},
	{
		name: "alignment",
		type: '"start" | "center" | "end" | "justify"',
		description: "Text alignment within the container.",
	},
	{
		name: "fontWeight",
		type: '"regular" | "medium" | "semibold" | "bold"',
		description: "Font weight override (uses Polaris weight scale).",
	},
	{
		name: "truncate",
		type: "boolean",
		default: "false",
		description: "Truncate text with ellipsis when it overflows.",
	},
	{
		name: "breakWord",
		type: "boolean",
		default: "false",
		description: "Break long words to prevent overflow.",
	},
	{
		name: "numeric",
		type: "boolean",
		default: "false",
		description: "Use monospace font for numeric values.",
	},
	{
		name: "visuallyHidden",
		type: "boolean",
		default: "false",
		description: "Hide visually but keep accessible to screen readers.",
	},
	{
		name: "textDecorationLine",
		type: '"line-through"',
		description: "Add text decoration (currently supports line-through).",
	},
]

export default function TextPage() {
	return (
		<Page
			title="Text"
			subtitle="Display text content with consistent typography based on the Polaris design system."
		>
			<div className="space-y-12">
				{/* Heading Variants */}
				<ComponentExample
					title="Heading Variants"
					description="Seven heading sizes from 3xl to xs for hierarchical typography."
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
				</ComponentExample>

				{/* Body Variants */}
				<ComponentExample
					title="Body Variants"
					description="Four body text sizes for different content types."
					code={`<Text variant="body-lg" as="p">
  Large body text for introductory paragraphs
</Text>
<Text variant="body-md" as="p">
  Medium body text (default) for most content
</Text>
<Text variant="body-sm" as="p">
  Small body text for secondary information
</Text>
<Text variant="body-xs" as="p">
  Extra small body text for captions and labels
</Text>`}
				>
					<div className="space-y-3">
						<Text variant="body-lg" as="p">
							Large body text for introductory paragraphs and emphasized content.
						</Text>
						<Text variant="body-md" as="p">
							Medium body text (default) for most content and general paragraphs.
						</Text>
						<Text variant="body-sm" as="p">
							Small body text for secondary information and descriptions.
						</Text>
						<Text variant="body-xs" as="p">
							Extra small body text for captions, labels, and metadata.
						</Text>
					</div>
				</ComponentExample>

				{/* Tones */}
				<ComponentExample
					title="Text Tones"
					description="Different color tones for semantic meaning."
					code={`<Text tone="base">Base text color</Text>
<Text tone="subdued">Subdued secondary text</Text>
<Text tone="disabled">Disabled text</Text>
<Text tone="success">Success message</Text>
<Text tone="critical">Critical error</Text>
<Text tone="caution">Caution warning</Text>
<Text tone="info">Information text</Text>`}
				>
					<div className="space-y-2">
						<div><Text tone="base">Base text color (default)</Text></div>
						<div><Text tone="subdued">Subdued secondary text</Text></div>
						<div><Text tone="disabled">Disabled text</Text></div>
						<div><Text tone="success">Success message</Text></div>
						<div><Text tone="critical">Critical error</Text></div>
						<div><Text tone="caution">Caution warning</Text></div>
						<div><Text tone="info">Information text</Text></div>
					</div>
				</ComponentExample>

				{/* Alignment */}
				<ComponentExample
					title="Text Alignment"
					description="Control horizontal alignment of text."
					code={`<Text alignment="start">Left aligned text</Text>
<Text alignment="center">Center aligned text</Text>
<Text alignment="end">Right aligned text</Text>
<Text alignment="justify">Justified text...</Text>`}
				>
					<div className="space-y-3">
						<Text alignment="start" as="p">Left aligned text (start)</Text>
						<Text alignment="center" as="p">Center aligned text</Text>
						<Text alignment="end" as="p">Right aligned text (end)</Text>
						<Text alignment="justify" as="p">
							Justified text stretches to fill the width of the container, creating even edges on both sides. This is useful for formal documents and longer paragraphs.
						</Text>
					</div>
				</ComponentExample>

				{/* Font Weight */}
				<ComponentExample
					title="Font Weight"
					description="Override font weight using Polaris weight scale."
					code={`<Text fontWeight="regular">Regular weight (450)</Text>
<Text fontWeight="medium">Medium weight (550)</Text>
<Text fontWeight="semibold">Semibold weight (650)</Text>
<Text fontWeight="bold">Bold weight (700)</Text>`}
				>
					<div className="space-y-2">
						<div><Text fontWeight="regular">Regular weight (450)</Text></div>
						<div><Text fontWeight="medium">Medium weight (550)</Text></div>
						<div><Text fontWeight="semibold">Semibold weight (650)</Text></div>
						<div><Text fontWeight="bold">Bold weight (700)</Text></div>
					</div>
				</ComponentExample>

				{/* Truncate */}
				<ComponentExample
					title="Truncate"
					description="Truncate long text with ellipsis."
					code={`<div className="max-w-xs">
  <Text truncate>
    This is a very long text that will be truncated with an ellipsis...
  </Text>
</div>`}
				>
					<div className="max-w-xs border border-p-border rounded-p-lg p-p-4">
						<Text truncate>
							This is a very long text that will be truncated with an ellipsis when it exceeds the container width.
						</Text>
					</div>
				</ComponentExample>

				{/* Break Word */}
				<ComponentExample
					title="Break Word"
					description="Break long words to prevent overflow."
					code={`<div className="max-w-xs">
  <Text breakWord>
    Supercalifragilisticexpialidocious
  </Text>
</div>`}
				>
					<div className="max-w-xs border border-p-border rounded-p-lg p-p-4">
						<Text breakWord>
							Supercalifragilisticexpialidocious is a very long word that would normally overflow but will break with breakWord.
						</Text>
					</div>
				</ComponentExample>

				{/* Numeric */}
				<ComponentExample
					title="Numeric"
					description="Use monospace font for numbers and financial data."
					code={`<Text>Regular: $1,234.56</Text>
<Text numeric>Numeric: $1,234.56</Text>
<Text numeric>123456789</Text>`}
				>
					<div className="space-y-2">
						<div><Text>Regular: $1,234.56</Text></div>
						<div><Text numeric>Numeric: $1,234.56</Text></div>
						<div><Text numeric>Phone: +1 (555) 123-4567</Text></div>
						<div><Text numeric>Account: 123456789</Text></div>
					</div>
				</ComponentExample>

				{/* Text Decoration */}
				<ComponentExample
					title="Text Decoration"
					description="Add line-through decoration for strikethrough text."
					code={`<Text>Regular price: $99.99</Text>
<Text textDecorationLine="line-through">Sale price: $79.99</Text>`}
				>
					<div className="space-y-2">
						<div>
							<Text tone="subdued" textDecorationLine="line-through">$99.99</Text>
							{" "}
							<Text tone="critical" fontWeight="semibold">$79.99</Text>
						</div>
					</div>
				</ComponentExample>

				{/* Semantic HTML */}
				<ComponentExample
					title="Semantic HTML"
					description="Use the 'as' prop to render the appropriate HTML element."
					code={`<Text variant="heading-lg" as="h1">Page Title</Text>
<Text variant="body-md" as="p">Paragraph content</Text>
<Text as="strong">Strong emphasis</Text>
<Text as="em">Italic emphasis</Text>
<dl>
  <Text as="dt">Term</Text>
  <Text as="dd">Definition</Text>
</dl>`}
				>
					<div className="space-y-3">
						<Text variant="heading-lg" as="h1">Page Title (h1)</Text>
						<Text variant="body-md" as="p">This is a paragraph element with body-md styling.</Text>
						<div>
							<Text as="strong">This is strong text</Text> and{" "}
							<Text as="em">this is emphasized text</Text>.
						</div>
						<dl className="space-y-2">
							<div>
								<Text as="dt" fontWeight="semibold">Definition Term</Text>
								<Text as="dd" tone="subdued">Definition description goes here.</Text>
							</div>
						</dl>
					</div>
				</ComponentExample>

				{/* Props Table */}
				<section className="space-y-4">
					<h2 className="text-lg font-semibold">Props</h2>
					<PropsTable props={textProps} />
				</section>

				{/* Design Tokens */}
				<section className="space-y-4">
					<h2 className="text-xl font-semibold">Design Tokens</h2>
					<p className="text-sm text-p-text-secondary">
						Text component uses Polaris typography tokens defined in globals.css:
					</p>
					<ul className="list-inside list-disc space-y-2 text-sm text-p-text-secondary">
						<li>
							<code className="text-xs">--p-text-heading-*</code> - Heading presets (3xl through xs)
						</li>
						<li>
							<code className="text-xs">--p-text-body-*</code> - Body text presets (lg through xs)
						</li>
						<li>
							<code className="text-xs">--p-font-weight-*</code> - Font weights (regular: 450, medium: 550, semibold: 650, bold: 700)
						</li>
						<li>
							<code className="text-xs">--p-color-text-*</code> - Text color tokens for different tones
						</li>
						<li>
							<code className="text-xs">--p-font-letter-spacing-*</code> - Letter spacing values
						</li>
						<li>
							<code className="text-xs">--p-font-line-height-*</code> - Line height values
						</li>
					</ul>
				</section>

				{/* Best Practices */}
				<section className="space-y-4">
					<h2 className="text-xl font-semibold">Best Practices</h2>
					<ul className="list-disc list-inside space-y-2 text-muted-foreground">
						<li>Use semantic HTML with the <code>as</code> prop for proper document structure</li>
						<li>Choose heading variants based on content hierarchy (h1 = heading-3xl, h2 = heading-2xl, etc.)</li>
						<li>Use <code>tone="subdued"</code> for secondary information</li>
						<li>Apply <code>numeric</code> for financial data, phone numbers, and measurements</li>
						<li>Use <code>truncate</code> in constrained spaces like table cells</li>
						<li>Prefer <code>breakWord</code> over <code>truncate</code> when full content must be visible</li>
						<li>Don't override font weight on heading variants unless necessary</li>
						<li>Use consistent variants throughout your application for visual harmony</li>
					</ul>
				</section>

				{/* Typography Scale */}
				<section className="space-y-4">
					<h2 className="text-xl font-semibold">Typography Scale</h2>
					<div className="space-y-3">
						<div className="border border-p-border rounded-p-lg p-p-4">
							<h3 className="font-semibold text-sm mb-2">Heading Scale</h3>
							<ul className="text-sm text-muted-foreground space-y-1">
								<li>heading-3xl: 2.25rem (36px) • Bold • Dense spacing</li>
								<li>heading-2xl: 1.875rem (30px) • Bold • Denser spacing</li>
								<li>heading-xl: 1.5rem (24px) • Bold • Dense spacing</li>
								<li>heading-lg: 1.25rem (20px) • Semibold • Dense spacing</li>
								<li>heading-md: 0.875rem (14px) • Semibold • Normal spacing</li>
								<li>heading-sm: 0.8125rem (13px) • Semibold • Normal spacing</li>
								<li>heading-xs: 0.75rem (12px) • Semibold • Normal spacing</li>
							</ul>
						</div>
						<div className="border border-p-border rounded-p-lg p-p-4">
							<h3 className="font-semibold text-sm mb-2">Body Scale</h3>
							<ul className="text-sm text-muted-foreground space-y-1">
								<li>body-lg: 0.875rem (14px) • Regular • 1.25rem line-height</li>
								<li>body-md: 0.8125rem (13px) • Regular • 1.25rem line-height</li>
								<li>body-sm: 0.75rem (12px) • Regular • 1rem line-height</li>
								<li>body-xs: 0.6875rem (11px) • Regular • 0.75rem line-height</li>
							</ul>
						</div>
					</div>
				</section>

				{/* Accessibility */}
				<section className="space-y-4">
					<h2 className="text-xl font-semibold">Accessibility</h2>
					<ul className="list-disc list-inside space-y-2 text-muted-foreground">
						<li>Use semantic HTML elements (h1-h6, p, strong, em) for proper document structure</li>
						<li>Maintain proper heading hierarchy (don't skip levels)</li>
						<li>Use <code>visuallyHidden</code> for screen reader-only content</li>
						<li>Ensure sufficient color contrast for all tones (WCAG AA minimum)</li>
						<li>Don't rely solely on color to convey meaning</li>
						<li>Use <code>as="strong"</code> for semantic emphasis, not just bold styling</li>
					</ul>
				</section>

				{/* Related Components */}
				<section className="space-y-4">
					<h2 className="text-lg font-semibold">Related Components</h2>
					<ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
						<li>For simple labels, use the Label component</li>
						<li>For page titles, use the Page component with title prop</li>
						<li>For inline code, use the code HTML element with appropriate styling</li>
					</ul>
				</section>
			</div>
		</Page>
	)
}
