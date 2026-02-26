import { DocPage } from "@/components/docs/doc-page"
import { DocSection } from "@/components/docs/doc-section"
import { DocHero } from "@/components/docs/doc-hero"
import { DocExample } from "@/components/docs/doc-example"
import { DocPropsTable, type DocProp } from "@/components/docs/doc-props-table"
import { DocRelated } from "@/components/docs/doc-related"
import {
	ComboboxDefaultDemo,
	ComboboxWithIconDemo,
	ComboboxWithLabelDemo,
	ComboboxCustomEmptyDemo,
	ComboboxTeamMemberDemo,
} from "./_demos"

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "props", title: "Props" },
	{ id: "guidelines", title: "Guidelines" },
	{ id: "related", title: "Related" },
]

const comboboxProps: DocProp[] = [
	{
		name: "value",
		type: "string",
		description: "The controlled selected value.",
	},
	{
		name: "onValueChange",
		type: "(value: string) => void",
		description: "Callback when the selected value changes.",
	},
	{
		name: "options",
		type: "ComboboxOption[]",
		description:
			"Array of options. Each option has value, label, and optional description, avatar (image URL), icon (ReactNode).",
	},
	{
		name: "placeholder",
		type: "string",
		default: '"Select..."',
		description: "Placeholder text shown when no value is selected.",
	},
	{
		name: "searchPlaceholder",
		type: "string",
		default: '"Search..."',
		description: "Placeholder text for the search input inside the dropdown.",
	},
	{
		name: "emptyMessage",
		type: "string",
		default: '"No results found."',
		description: "Message displayed when no options match the search query.",
	},
	{
		name: "icon",
		type: "React.ReactNode",
		description: "Optional icon rendered before the selected label.",
	},
	{
		name: "className",
		type: "string",
		description: "Additional CSS classes for the trigger button.",
	},
]

export default function ComboboxPage() {
	return (
		<DocPage
			title="Combobox"
			subtitle="A searchable dropdown that combines a text input with a list of options. Ideal for large option sets where filtering is needed."
			category="Components"
			toc={toc}
		>
			<DocHero>
				<ComboboxTeamMemberDemo />
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExample
					title="Default"
					description="A basic combobox with search functionality."
					code={`const [value, setValue] = React.useState("")

<Combobox
  value={value}
  onValueChange={setValue}
  options={[
    { value: "apple", label: "Apple" },
    { value: "banana", label: "Banana" },
    { value: "cherry", label: "Cherry" },
  ]}
  placeholder="Select a fruit..."
  searchPlaceholder="Search fruits..."
/>`}
				>
					<ComboboxDefaultDemo />
				</DocExample>

				<DocExample
					title="With Icon"
					description="Add a custom icon before the selected value."
					code={`<Combobox
  value={value}
  onValueChange={setValue}
  options={languages}
  placeholder="Select language..."
  icon={<Globe className="h-4 w-4 text-fg-muted" />}
/>`}
				>
					<ComboboxWithIconDemo />
				</DocExample>

				<DocExample
					title="With Label"
					description="Pair the combobox with a Label for better accessibility."
					code={`<div className="space-y-2">
  <Label>Framework</Label>
  <Combobox
    value={value}
    onValueChange={setValue}
    options={frameworks}
    placeholder="Select framework..."
  />
</div>`}
				>
					<ComboboxWithLabelDemo />
				</DocExample>

				<DocExample
					title="Custom Empty Message"
					description="Customize the message shown when no options match the search."
					code={`<Combobox
  value={value}
  onValueChange={setValue}
  options={fruits}
  placeholder="Select a fruit..."
  emptyMessage="No fruit matches your search."
/>`}
				>
					<ComboboxCustomEmptyDemo />
				</DocExample>

				<DocExample
					title="Team Member Selector"
					description="Rich options with avatar and description. Perfect for user/member pickers."
					code={`const members = [
  {
    value: "alex",
    label: "Alex Johnson",
    description: "Software Engineer",
    avatar: "https://example.com/alex.jpg",
  },
  // ...
]

<Combobox
  value={value}
  onValueChange={setValue}
  options={members}
  placeholder="Select a member..."
  searchPlaceholder="Search members..."
/>`}
				>
					<ComboboxTeamMemberDemo />
				</DocExample>
			</DocSection>

			<DocSection id="props" title="Props">
				<DocPropsTable props={comboboxProps} />
			</DocSection>

			<DocSection id="guidelines" title="Guidelines">
				<ul className="list-inside list-disc space-y-2 text-sm text-fg-muted">
					<li>
						Use Combobox when you have more than 7-10 options that benefit from
						search filtering
					</li>
					<li>
						For fewer options without search, prefer a standard Select component
					</li>
					<li>
						Provide clear placeholder and searchPlaceholder text to guide users
					</li>
					<li>
						Customize emptyMessage to give helpful feedback when search yields
						no results
					</li>
				</ul>
			</DocSection>

			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{
							title: "Select",
							href: "/docs/components/ui/select",
							description:
								"A dropdown for selecting from a short list of options.",
						},
						{
							title: "Command",
							href: "/docs/components/ui/command",
							description:
								"A command palette for searching and executing actions.",
						},
						{
							title: "Search Input",
							href: "/docs/components/ui/search-input",
							description:
								"A text input with search icon for search interactions.",
						},
					]}
				/>
			</DocSection>
		</DocPage>
	)
}
