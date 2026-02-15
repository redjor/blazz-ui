import { Box } from "@/components/ui/box"
import { DocPage } from "@/components/features/docs/doc-page"
import { DocSection } from "@/components/features/docs/doc-section"
import { DocExample } from "@/components/features/docs/doc-example"
import { DocPropsTable, type DocProp } from "@/components/features/docs/doc-props-table"
import { DocRelated } from "@/components/features/docs/doc-related"
const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "props", title: "Props" },
	{ id: "related", title: "Related" },
]
const boxProps: DocProp[] = [
	{
		name: "as",
		type: "React.ElementType",
		default: '"div"',
		description: "The HTML element type to render.",
	},
	{
		name: "padding",
		type: '"0" | "2" | "4" | "6" | "8"',
		default: '"0"',
		description: "Padding around the content.",
	},
	{
		name: "background",
		type: '"transparent" | "white" | "muted" | "accent"',
		default: '"transparent"',
		description: "Background color of the box.",
	},
	{
		name: "border",
		type: '"none" | "default"',
		default: '"none"',
		description: "Border style of the box.",
	},
	{
		name: "borderRadius",
		type: '"none" | "sm" | "md" | "lg" | "xl"',
		default: '"none"',
		description: "Border radius of the box.",
	},
	{
		name: "shadow",
		type: '"none" | "sm" | "md" | "lg"',
		default: '"none"',
		description: "Shadow applied to the box.",
	},
]
export default function BoxPage() {
	return (
		<DocPage
			title="Box"
			subtitle="Box is the most primitive layout component. It's a way to access design tokens for background, padding, border, and shadow."
			toc={toc}
		>
			<DocSection id="examples" title="Examples">
					<DocExample
						title="Background"
						description="Use different background colors."
						code={`<Box background="muted" padding="4">
  <p>Content with muted background</p>
</Box>`}
					>
						<div className="flex gap-4">
							<Box background="muted" padding="4" borderRadius="md">
								<p className="text-sm">Muted</p>
							</Box>
							<Box background="accent" padding="4" borderRadius="md">
								<p className="text-sm">Accent</p>
							</Box>
							<Box background="white" padding="4" borderRadius="md" border="default">
								<p className="text-sm">White</p>
							</Box>
						</div>
					</DocExample>
					<DocExample
						title="Padding"
						description="Apply different padding values."
						code={`<Box padding="4" background="muted" borderRadius="md">
  <p>Padding 4</p>
</Box>`}
					>
						<div className="flex items-start gap-4">
							<Box padding="2" background="muted" borderRadius="md">
								<p className="text-sm">p-2</p>
							</Box>
							<Box padding="4" background="muted" borderRadius="md">
								<p className="text-sm">p-4</p>
							</Box>
							<Box padding="6" background="muted" borderRadius="md">
								<p className="text-sm">p-6</p>
							</Box>
							<Box padding="8" background="muted" borderRadius="md">
								<p className="text-sm">p-8</p>
							</Box>
						</div>
					</DocExample>
					<DocExample
						title="Border"
						description="Add borders to the box."
						code={`<Box border="default" padding="4" borderRadius="md">
  <p>Box with border</p>
</Box>`}
					>
						<Box border="default" padding="4" borderRadius="md">
							<p className="text-sm text-fg-muted">Box with border</p>
						</Box>
					</DocExample>
					<DocExample
						title="Border Radius"
						description="Different border radius options."
						code={`<Box background="muted" padding="4" borderRadius="lg">
  Large radius
</Box>`}
					>
						<div className="flex items-start gap-4">
							<Box background="muted" padding="4" borderRadius="sm">
								<p className="text-sm">sm</p>
							</Box>
							<Box background="muted" padding="4" borderRadius="md">
								<p className="text-sm">md</p>
							</Box>
							<Box background="muted" padding="4" borderRadius="lg">
								<p className="text-sm">lg</p>
							</Box>
							<Box background="muted" padding="4" borderRadius="xl">
								<p className="text-sm">xl</p>
							</Box>
						</div>
					</DocExample>
					<DocExample
						title="Shadow"
						description="Apply different shadow levels."
						code={`<Box shadow="md" padding="4" background="white" borderRadius="lg">
  Medium shadow
</Box>`}
					>
						<div className="flex items-start gap-4 p-4">
							<Box shadow="sm" padding="4" background="white" borderRadius="lg">
								<p className="text-sm">sm</p>
							</Box>
							<Box shadow="md" padding="4" background="white" borderRadius="lg">
								<p className="text-sm">md</p>
							</Box>
							<Box shadow="lg" padding="4" background="white" borderRadius="lg">
								<p className="text-sm">lg</p>
							</Box>
						</div>
					</DocExample>
					<DocExample
						title="Polymorphic"
						description="Render as different HTML elements using the 'as' prop."
						code={`<Box as="section" background="muted" padding="4" borderRadius="md">
  <p>Rendered as a section element</p>
</Box>`}
					>
						<Box as="section" background="muted" padding="4" borderRadius="md">
							<p className="text-sm text-fg-muted">
								Rendered as a section element
							</p>
						</Box>
					</DocExample>
			</DocSection>
			<DocSection id="props" title="Props">
				<DocPropsTable props={boxProps} />
			</DocSection>
			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{
							title: "Card",
							href: "/docs/components/layout/card",
							description: "For more specific use cases, use the Card component.",
						},
					]}
				/>
			</DocSection>
		</DocPage>
	)
}
