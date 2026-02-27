import { createFileRoute } from "@tanstack/react-router"
import * as React from "react"
import { Combobox } from "@blazz/ui/components/ui/combobox"
import { Label } from "@blazz/ui/components/ui/label"
import { Globe } from "lucide-react"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"
import { DocHero } from "~/components/docs/doc-hero"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocPropsTable, type DocProp } from "~/components/docs/doc-props-table"
import { DocRelated } from "~/components/docs/doc-related"
import { highlightCode } from "~/lib/highlight-code"

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

export const Route = createFileRoute("/_docs/docs/components/ui/combobox")({
	loader: async () => {
		const highlighted = await Promise.all(
			examples.map(async (ex) => ({
				key: ex.key,
				html: await highlightCode({ data: { code: ex.code } }),
			}))
		)
		return { highlighted }
	},
	component: ComboboxPage,
})

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

/* ── Data ── */

const fruits = [
	{ value: "apple", label: "Apple" },
	{ value: "banana", label: "Banana" },
	{ value: "cherry", label: "Cherry" },
	{ value: "grape", label: "Grape" },
	{ value: "mango", label: "Mango" },
	{ value: "orange", label: "Orange" },
	{ value: "pear", label: "Pear" },
	{ value: "strawberry", label: "Strawberry" },
]

const languages = [
	{ value: "en", label: "English" },
	{ value: "fr", label: "French" },
	{ value: "de", label: "German" },
	{ value: "es", label: "Spanish" },
	{ value: "pt", label: "Portuguese" },
	{ value: "ja", label: "Japanese" },
]

const frameworks = [
	{ value: "react", label: "React" },
	{ value: "vue", label: "Vue" },
	{ value: "angular", label: "Angular" },
	{ value: "svelte", label: "Svelte" },
	{ value: "solid", label: "Solid" },
	{ value: "nextjs", label: "Next.js" },
]

const teamMembers = [
	{
		value: "alex",
		label: "Alex Johnson",
		description: "Software Engineer",
		avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face",
	},
	{
		value: "sarah",
		label: "Sarah Chen",
		description: "Product Manager",
		avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&crop=face",
	},
	{
		value: "michael",
		label: "Michael Rodriguez",
		description: "UX Designer",
		avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face",
	},
	{
		value: "emma",
		label: "Emma Wilson",
		description: "Technical Lead",
		avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face",
	},
	{
		value: "david",
		label: "David Kim",
		description: "CTO",
		avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=face",
	},
]

/* ── Inlined demo components ── */

function ComboboxDefaultDemo() {
	const [value, setValue] = React.useState("")
	return (
		<Combobox
			value={value}
			onValueChange={setValue}
			options={fruits}
			placeholder="Select a fruit..."
			searchPlaceholder="Search fruits..."
			className="w-[240px]"
		/>
	)
}

function ComboboxWithIconDemo() {
	const [value, setValue] = React.useState("")
	return (
		<Combobox
			value={value}
			onValueChange={setValue}
			options={languages}
			placeholder="Select language..."
			searchPlaceholder="Search languages..."
			icon={<Globe className="h-4 w-4 text-fg-muted" />}
			className="w-[240px]"
		/>
	)
}

function ComboboxWithLabelDemo() {
	const [value, setValue] = React.useState("")
	return (
		<div className="w-[240px] space-y-2">
			<Label>Framework</Label>
			<Combobox
				value={value}
				onValueChange={setValue}
				options={frameworks}
				placeholder="Select framework..."
				searchPlaceholder="Search frameworks..."
			/>
		</div>
	)
}

function ComboboxCustomEmptyDemo() {
	const [value, setValue] = React.useState("")
	return (
		<Combobox
			value={value}
			onValueChange={setValue}
			options={fruits}
			placeholder="Select a fruit..."
			searchPlaceholder="Type to search..."
			emptyMessage="No fruit matches your search."
			className="w-[240px]"
		/>
	)
}

function ComboboxTeamMemberDemo() {
	const [value, setValue] = React.useState("alex")
	return (
		<Combobox
			value={value}
			onValueChange={setValue}
			options={teamMembers}
			placeholder="Select a member..."
			searchPlaceholder="Search members..."
			className="w-[260px]"
		/>
	)
}

function ComboboxPage() {
	const { highlighted } = Route.useLoaderData()
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="Combobox"
			subtitle="A searchable dropdown that combines a text input with a list of options. Ideal for large option sets where filtering is needed."
			toc={toc}
		>
			<DocHero>
				<ComboboxTeamMemberDemo />
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExampleClient
					title="Default"
					description="A basic combobox with search functionality."
					code={examples[0].code}
					highlightedCode={html("default")}
				>
					<ComboboxDefaultDemo />
				</DocExampleClient>

				<DocExampleClient
					title="With Icon"
					description="Add a custom icon before the selected value."
					code={examples[1].code}
					highlightedCode={html("with-icon")}
				>
					<ComboboxWithIconDemo />
				</DocExampleClient>

				<DocExampleClient
					title="With Label"
					description="Pair the combobox with a Label for better accessibility."
					code={examples[2].code}
					highlightedCode={html("with-label")}
				>
					<ComboboxWithLabelDemo />
				</DocExampleClient>

				<DocExampleClient
					title="Custom Empty Message"
					description="Customize the message shown when no options match the search."
					code={examples[3].code}
					highlightedCode={html("custom-empty")}
				>
					<ComboboxCustomEmptyDemo />
				</DocExampleClient>

				<DocExampleClient
					title="Team Member Selector"
					description="Rich options with avatar and description. Perfect for user/member pickers."
					code={examples[4].code}
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
