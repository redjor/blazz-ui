"use client"

import { use } from "react"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { type DocProp, DocPropsTable } from "~/components/docs/doc-props-table"
import { DocRelated } from "~/components/docs/doc-related"
import { DocSection } from "~/components/docs/doc-section"
import { highlightExamples } from "~/lib/highlight-examples"
import { ComboboxCustomEmptyDemo, ComboboxDefaultDemo, ComboboxIconTriggerDemo, ComboboxTeamMemberDemo, ComboboxWithIconDemo, ComboboxWithLabelDemo } from "./demos"

const examples = [
	{
		key: "default",
		code: `const [value, setValue] = React.useState("")

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
/>`,
	},
	{
		key: "with-icon",
		code: `<Combobox
  value={value}
  onValueChange={setValue}
  options={languages}
  placeholder="Select language..."
  icon={<Globe className="h-4 w-4 text-fg-muted" />}
/>`,
	},
	{
		key: "with-label",
		code: `<div className="space-y-2">
  <Label>Framework</Label>
  <Combobox
    value={value}
    onValueChange={setValue}
    options={frameworks}
    placeholder="Select framework..."
  />
</div>`,
	},
	{
		key: "custom-empty",
		code: `<Combobox
  value={value}
  onValueChange={setValue}
  options={fruits}
  placeholder="Select a fruit..."
  emptyMessage="No fruit matches your search."
/>`,
	},
	{
		key: "icon-trigger",
		code: `const priorities = [
  { value: "urgent", label: "Urgent", icon: <Flag fill="currentColor" className="size-3.5 text-destructive" /> },
  { value: "high",   label: "High",   icon: <Flag fill="currentColor" className="size-3.5 text-orange-500" /> },
  { value: "normal", label: "Normal", icon: <Flag className="size-3.5 text-fg-muted" /> },
  { value: "low",    label: "Low",    icon: <Flag className="size-3.5 text-fg-muted opacity-40" /> },
]

<Combobox
  value={value}
  onValueChange={(v) => setValue(v || "normal")}
  options={priorities}
  iconTrigger
  icon={<Flag className="size-3.5 text-fg-muted" />}
/>`,
	},
	{
		key: "team-member",
		code: `const members = [
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
/>`,
	},
] as const

const highlightedPromise = highlightExamples(examples as any)

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
		description: "Array of options. Each option has value, label, and optional description, avatar (image URL), icon (ReactNode).",
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
		description: "Optional icon rendered before the selected label. Used as fallback in iconTrigger mode when no option is selected.",
	},
	{
		name: "iconTrigger",
		type: "boolean",
		default: "false",
		description: "When true, the trigger renders as a compact icon-only button (32×32px). Shows the selected option's icon, or the icon prop as fallback.",
	},
	{
		name: "className",
		type: "string",
		description: "Additional CSS classes for the trigger button.",
	},
]

export default function ComboboxPage() {
	const highlighted = use(highlightedPromise)
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage title="Combobox" subtitle="A searchable dropdown that combines a text input with a list of options. Ideal for large option sets where filtering is needed." toc={toc}>
			<DocHero>
				<ComboboxTeamMemberDemo />
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExampleClient title="Default" description="A basic combobox with search functionality." code={examples[0].code} highlightedCode={html("default")}>
					<ComboboxDefaultDemo />
				</DocExampleClient>

				<DocExampleClient title="With Icon" description="Add a custom icon before the selected value." code={examples[1].code} highlightedCode={html("with-icon")}>
					<ComboboxWithIconDemo />
				</DocExampleClient>

				<DocExampleClient title="With Label" description="Pair the combobox with a Label for better accessibility." code={examples[2].code} highlightedCode={html("with-label")}>
					<ComboboxWithLabelDemo />
				</DocExampleClient>

				<DocExampleClient title="Custom Empty Message" description="Customize the message shown when no options match the search." code={examples[3].code} highlightedCode={html("custom-empty")}>
					<ComboboxCustomEmptyDemo />
				</DocExampleClient>

				<DocExampleClient
					title="Icon Trigger"
					description="Trigger compact icon-only — idéal pour les contrôles inline comme un sélecteur de priorité."
					code={examples[4].code}
					highlightedCode={html("icon-trigger")}
				>
					<ComboboxIconTriggerDemo />
				</DocExampleClient>

				<DocExampleClient
					title="Team Member Selector"
					description="Rich options with avatar and description. Perfect for user/member pickers."
					code={examples[5].code}
					highlightedCode={html("team-member")}
				>
					<ComboboxTeamMemberDemo />
				</DocExampleClient>
			</DocSection>

			<DocSection id="props" title="Props">
				<DocPropsTable props={comboboxProps} />
			</DocSection>

			<DocSection id="guidelines" title="Guidelines">
				<ul className="list-inside list-disc space-y-2 text-sm text-fg-muted">
					<li>Use Combobox when you have more than 7-10 options that benefit from search filtering</li>
					<li>For fewer options without search, prefer a standard Select component</li>
					<li>Provide clear placeholder and searchPlaceholder text to guide users</li>
					<li>Customize emptyMessage to give helpful feedback when search yields no results</li>
				</ul>
			</DocSection>

			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{
							title: "Select",
							href: "/docs/components/ui/select",
							description: "A dropdown for selecting from a short list of options.",
						},
						{
							title: "Command",
							href: "/docs/components/ui/command",
							description: "A command palette for searching and executing actions.",
						},
						{
							title: "Search Input",
							href: "/docs/components/ui/search-input",
							description: "A text input with search icon for search interactions.",
						},
					]}
				/>
			</DocSection>
		</DocPage>
	)
}
