import { DocPage } from "@/components/docs/doc-page"
import { DocSection } from "@/components/docs/doc-section"
import { DocHero } from "@/components/docs/doc-hero"
import { DocExample } from "@/components/docs/doc-example"
import { DocPropsTable, type DocProp } from "@/components/docs/doc-props-table"
import { DocRelated } from "@/components/docs/doc-related"
import {
	TagsInputDefaultDemo,
	TagsInputWithSuggestionsDemo,
	TagsInputMaxTagsDemo,
	TagsInputWithLabelDemo,
} from "./_demos"

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "props", title: "Props" },
	{ id: "guidelines", title: "Guidelines" },
	{ id: "related", title: "Related" },
]

const tagsInputProps: DocProp[] = [
	{
		name: "tags",
		type: "string[]",
		description: "The current array of tag values.",
	},
	{
		name: "onTagsChange",
		type: "(tags: string[]) => void",
		description: "Callback when the tags array changes (add or remove).",
	},
	{
		name: "suggestions",
		type: "string[]",
		default: "[]",
		description:
			"Optional list of suggestions shown as the user types. Filters dynamically based on input.",
	},
	{
		name: "placeholder",
		type: "string",
		default: '"Add a tag..."',
		description: "Placeholder text for the input field.",
	},
	{
		name: "maxTags",
		type: "number",
		description:
			"Maximum number of tags allowed. Input is disabled when the limit is reached.",
	},
	{
		name: "className",
		type: "string",
		description: "Additional CSS classes for the container.",
	},
]

export default function TagsInputPage() {
	return (
		<DocPage
			title="Tags Input"
			subtitle="An input that allows users to add and remove tags. Supports suggestions, keyboard navigation, and tag limits."
			toc={toc}
		>
			<DocHero>
				<TagsInputDefaultDemo />
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExample
					title="Default"
					description="A basic tags input. Press Enter to add a tag, Backspace to remove the last one."
					code={`const [tags, setTags] = React.useState(["React", "TypeScript"])

<TagsInput
  tags={tags}
  onTagsChange={setTags}
  placeholder="Add a tag..."
/>`}
				>
					<TagsInputDefaultDemo />
				</DocExample>

				<DocExample
					title="With Suggestions"
					description="Show a dropdown of filtered suggestions as the user types."
					code={`<TagsInput
  tags={tags}
  onTagsChange={setTags}
  suggestions={[
    "Design", "Development", "Marketing",
    "Product", "Engineering", "Sales",
  ]}
  placeholder="Add a skill..."
/>`}
				>
					<TagsInputWithSuggestionsDemo />
				</DocExample>

				<DocExample
					title="Max Tags"
					description="Limit the number of tags. The input is disabled once the limit is reached."
					code={`<TagsInput
  tags={tags}
  onTagsChange={setTags}
  maxTags={3}
  placeholder="Add up to 3 tags..."
/>`}
				>
					<TagsInputMaxTagsDemo />
				</DocExample>

				<DocExample
					title="With Label"
					description="Pair with a Label component for form contexts."
					code={`<div className="space-y-2">
  <Label>Categories</Label>
  <TagsInput
    tags={tags}
    onTagsChange={setTags}
    suggestions={["Frontend", "Backend", "DevOps"]}
    placeholder="Add categories..."
  />
</div>`}
				>
					<TagsInputWithLabelDemo />
				</DocExample>
			</DocSection>

			<DocSection id="props" title="Props">
				<DocPropsTable props={tagsInputProps} />
			</DocSection>

			<DocSection id="guidelines" title="Guidelines">
				<ul className="list-inside list-disc space-y-2 text-sm text-fg-muted">
					<li>Use tags input when users need to add multiple free-form or predefined values</li>
					<li>Provide suggestions when there is a known set of valid values</li>
					<li>Set maxTags when there is a practical limit to prevent overuse</li>
					<li>Tags are added with Enter and removed with the X button or Backspace</li>
					<li>Duplicate tags are automatically prevented</li>
				</ul>
			</DocSection>

			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{
							title: "Input",
							href: "/docs/components/ui/input",
							description: "A standard text input field.",
						},
						{
							title: "Badge",
							href: "/docs/components/ui/badge",
							description:
								"Visual indicator used to render each tag.",
						},
						{
							title: "Combobox",
							href: "/docs/components/ui/combobox",
							description:
								"A searchable dropdown for selecting single values.",
						},
					]}
				/>
			</DocSection>
		</DocPage>
	)
}
