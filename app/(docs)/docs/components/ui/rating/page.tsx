import { Rating } from "@/components/ui/rating"
import { DocPage } from "@/components/features/docs/doc-page"
import { DocSection } from "@/components/features/docs/doc-section"
import { DocHero } from "@/components/features/docs/doc-hero"
import { DocExample } from "@/components/features/docs/doc-example"
import { DocPropsTable, type DocProp } from "@/components/features/docs/doc-props-table"
import { DocRelated } from "@/components/features/docs/doc-related"
import { ControlledRatingDemo } from "./_demos"

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "props", title: "Props" },
	{ id: "guidelines", title: "Guidelines" },
	{ id: "related", title: "Related" },
]

const ratingProps: DocProp[] = [
	{
		name: "value",
		type: "number",
		description: "The controlled rating value.",
	},
	{
		name: "defaultValue",
		type: "number",
		default: "0",
		description: "The default value for uncontrolled usage.",
	},
	{
		name: "onValueChange",
		type: "(value: number) => void",
		description: "Callback fired when the rating changes.",
	},
	{
		name: "max",
		type: "number",
		default: "5",
		description: "The maximum number of stars.",
	},
	{
		name: "allowHalf",
		type: "boolean",
		default: "false",
		description: "Whether half-star selections are allowed.",
	},
	{
		name: "readOnly",
		type: "boolean",
		default: "false",
		description: "Whether the rating is read-only (displays value but prevents interaction).",
	},
	{
		name: "disabled",
		type: "boolean",
		default: "false",
		description: "Whether the rating is disabled.",
	},
	{
		name: "size",
		type: '"sm" | "default" | "lg"',
		default: '"default"',
		description: "The size of the star icons.",
	},
]

export default function RatingPage() {
	return (
		<DocPage
			title="Rating"
			subtitle="A star-based rating component for collecting or displaying user feedback. Supports half-star precision, multiple sizes, and read-only mode."
			toc={toc}
		>
			{/* Hero */}
			<DocHero>
				<Rating defaultValue={3} />
			</DocHero>

			{/* Examples */}
			<DocSection id="examples" title="Examples">
				<DocExample
					title="Default"
					description="A basic interactive star rating."
					code={`<Rating defaultValue={0} />`}
				>
					<Rating defaultValue={0} />
				</DocExample>

				<DocExample
					title="Sizes"
					description="Available rating sizes."
					code={`<Rating size="sm" defaultValue={3} />
<Rating size="default" defaultValue={3} />
<Rating size="lg" defaultValue={3} />`}
				>
					<div className="flex flex-col gap-4">
						<div className="flex items-center gap-3">
							<Rating size="sm" defaultValue={3} />
							<span className="text-xs text-fg-muted">Small</span>
						</div>
						<div className="flex items-center gap-3">
							<Rating size="default" defaultValue={3} />
							<span className="text-xs text-fg-muted">Default</span>
						</div>
						<div className="flex items-center gap-3">
							<Rating size="lg" defaultValue={3} />
							<span className="text-xs text-fg-muted">Large</span>
						</div>
					</div>
				</DocExample>

				<DocExample
					title="Half Stars"
					description="Allow half-star precision for more granular ratings."
					code={`<Rating allowHalf defaultValue={2.5} />`}
				>
					<Rating allowHalf defaultValue={2.5} />
				</DocExample>

				<DocExample
					title="Read Only"
					description="Display a rating value without allowing interaction."
					code={`<Rating readOnly value={3.5} allowHalf />`}
				>
					<Rating readOnly value={3.5} allowHalf />
				</DocExample>

				<DocExample
					title="Controlled"
					description="Manage the rating value programmatically."
					code={`const [value, setValue] = React.useState(3)

<Rating value={value} onValueChange={setValue} />
<p>Rating: {value} / 5</p>`}
				>
					<ControlledRatingDemo />
				</DocExample>

				<DocExample
					title="Disabled"
					description="Disabled ratings prevent user interaction."
					code={`<Rating disabled defaultValue={2} />`}
				>
					<Rating disabled defaultValue={2} />
				</DocExample>
			</DocSection>

			{/* Props */}
			<DocSection id="props" title="Props">
				<DocPropsTable props={ratingProps} />
			</DocSection>

			{/* Guidelines */}
			<DocSection id="guidelines" title="Guidelines">
				<ul className="list-inside list-disc space-y-2 text-sm text-fg-muted">
					<li>Use read-only mode when displaying aggregate or historical ratings</li>
					<li>Enable half stars when more precise feedback is needed</li>
					<li>Use the small size for compact layouts like lists or cards</li>
					<li>Provide context labels (e.g., "4.5 out of 5") for accessibility</li>
				</ul>
			</DocSection>

			{/* Related */}
			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{
							title: "Input",
							href: "/docs/components/ui/input",
							description: "Basic text input for general-purpose data entry.",
						},
					]}
				/>
			</DocSection>
		</DocPage>
	)
}
