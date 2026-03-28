"use client"

import { Label } from "@blazz/ui/components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from "@blazz/ui/components/ui/select"
import { use } from "react"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { type DocProp, DocPropsTable } from "~/components/docs/doc-props-table"
import { DocSection } from "~/components/docs/doc-section"
import { selectData } from "~/data/components/select"
import { highlightExamples } from "~/lib/highlight-examples"

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "select-props", title: "Select Props" },
	{ id: "trigger-props", title: "Trigger Props" },
	{ id: "tokens", title: "Design Tokens" },
	{ id: "guidelines", title: "Guidelines" },
]

const triggerProps: DocProp[] = [
	{
		name: "size",
		type: '"sm" | "default"',
		default: '"default"',
		description: "The size of the trigger button.",
	},
	{
		name: "placeholder",
		type: "string",
		description: "Placeholder text when no value is selected.",
	},
]

const FRUIT_ITEMS = [
	{ value: "apple", label: "Apple" },
	{ value: "banana", label: "Banana" },
	{ value: "orange", label: "Orange" },
]

const COUNTRY_ITEMS = [
	{ value: "us", label: "United States" },
	{ value: "uk", label: "United Kingdom" },
	{ value: "fr", label: "France" },
	{ value: "de", label: "Germany" },
]

const OPTION_ITEMS = [
	{ value: "1", label: "Option 1" },
	{ value: "2", label: "Option 2" },
]

const TIMEZONE_ITEMS = [
	{ value: "est", label: "Eastern Time (ET)" },
	{ value: "cst", label: "Central Time (CT)" },
	{ value: "pst", label: "Pacific Time (PT)" },
	{ value: "gmt", label: "GMT" },
	{ value: "cet", label: "Central European (CET)" },
]

const examples = [
	{
		key: "default",
		code: `<Select
  items={[
    { value: "apple", label: "Apple" },
    { value: "banana", label: "Banana" },
    { value: "orange", label: "Orange" },
  ]}
>
  <SelectTrigger>
    <SelectValue placeholder="Select a fruit" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="apple">Apple</SelectItem>
    <SelectItem value="banana">Banana</SelectItem>
    <SelectItem value="orange">Orange</SelectItem>
  </SelectContent>
</Select>`,
	},
	{
		key: "with-label",
		code: `<div className="space-y-2">
  <Label htmlFor="country">Country</Label>
  <Select
    items={[
      { value: "us", label: "United States" },
      { value: "uk", label: "United Kingdom" },
      { value: "fr", label: "France" },
    ]}
  >
    <SelectTrigger id="country">
      <SelectValue placeholder="Select country" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="us">United States</SelectItem>
      <SelectItem value="uk">United Kingdom</SelectItem>
      <SelectItem value="fr">France</SelectItem>
    </SelectContent>
  </Select>
</div>`,
	},
	{
		key: "sizes",
		code: `<Select items={[{ value: "1", label: "Option 1" }, { value: "2", label: "Option 2" }]}>
  <SelectTrigger size="sm">
    <SelectValue placeholder="Small" />
  </SelectTrigger>
  ...
</Select>
<Select items={[{ value: "1", label: "Option 1" }, { value: "2", label: "Option 2" }]}>
  <SelectTrigger size="default">
    <SelectValue placeholder="Default" />
  </SelectTrigger>
  ...
</Select>`,
	},
	{
		key: "groups",
		code: `<Select
  items={[
    { value: "est", label: "Eastern Time (ET)" },
    { value: "cst", label: "Central Time (CT)" },
    { value: "pst", label: "Pacific Time (PT)" },
    { value: "gmt", label: "GMT" },
    { value: "cet", label: "Central European (CET)" },
  ]}
>
  <SelectTrigger>
    <SelectValue placeholder="Select timezone" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>North America</SelectLabel>
      <SelectItem value="est">Eastern Time (ET)</SelectItem>
      <SelectItem value="pst">Pacific Time (PT)</SelectItem>
    </SelectGroup>
    <SelectSeparator />
    <SelectGroup>
      <SelectLabel>Europe</SelectLabel>
      <SelectItem value="gmt">GMT</SelectItem>
      <SelectItem value="cet">Central European (CET)</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>`,
	},
	{
		key: "disabled",
		code: `<Select items={[{ value: "1", label: "Option 1" }]} disabled>
  <SelectTrigger>
    <SelectValue placeholder="Disabled" />
  </SelectTrigger>
  ...
</Select>`,
	},
] as const

const highlightedPromise = highlightExamples(examples as any)

export default function SelectPage() {
	const highlighted = use(highlightedPromise)
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage title="Select" subtitle="A dropdown menu for selecting a single value from a list of options." toc={toc}>
			<DocHero>
				<Select items={FRUIT_ITEMS}>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Select a fruit" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="apple">Apple</SelectItem>
						<SelectItem value="banana">Banana</SelectItem>
						<SelectItem value="orange">Orange</SelectItem>
					</SelectContent>
				</Select>
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExampleClient title="Default" description="A basic select dropdown." code={examples[0].code} highlightedCode={html("default")}>
					<Select items={FRUIT_ITEMS}>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="Select a fruit" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="apple">Apple</SelectItem>
							<SelectItem value="banana">Banana</SelectItem>
							<SelectItem value="orange">Orange</SelectItem>
						</SelectContent>
					</Select>
				</DocExampleClient>

				<DocExampleClient title="With Label" description="Select with an associated label." code={examples[1].code} highlightedCode={html("with-label")}>
					<div className="w-[200px] space-y-2">
						<Label htmlFor="country">Country</Label>
						<Select items={COUNTRY_ITEMS}>
							<SelectTrigger id="country">
								<SelectValue placeholder="Select country" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="us">United States</SelectItem>
								<SelectItem value="uk">United Kingdom</SelectItem>
								<SelectItem value="fr">France</SelectItem>
								<SelectItem value="de">Germany</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</DocExampleClient>

				<DocExampleClient title="Sizes" description="Available select trigger sizes." code={examples[2].code} highlightedCode={html("sizes")}>
					<div className="flex items-center gap-4">
						<Select items={OPTION_ITEMS}>
							<SelectTrigger size="sm" className="w-[140px]">
								<SelectValue placeholder="Small" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="1">Option 1</SelectItem>
								<SelectItem value="2">Option 2</SelectItem>
							</SelectContent>
						</Select>
						<Select items={OPTION_ITEMS}>
							<SelectTrigger size="default" className="w-[140px]">
								<SelectValue placeholder="Default" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="1">Option 1</SelectItem>
								<SelectItem value="2">Option 2</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</DocExampleClient>

				<DocExampleClient title="With Groups" description="Organize options into labeled groups." code={examples[3].code} highlightedCode={html("groups")}>
					<Select items={TIMEZONE_ITEMS}>
						<SelectTrigger className="w-[200px]">
							<SelectValue placeholder="Select timezone" />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectLabel>North America</SelectLabel>
								<SelectItem value="est">Eastern Time (ET)</SelectItem>
								<SelectItem value="cst">Central Time (CT)</SelectItem>
								<SelectItem value="pst">Pacific Time (PT)</SelectItem>
							</SelectGroup>
							<SelectSeparator />
							<SelectGroup>
								<SelectLabel>Europe</SelectLabel>
								<SelectItem value="gmt">GMT</SelectItem>
								<SelectItem value="cet">Central European (CET)</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
				</DocExampleClient>

				<DocExampleClient title="Disabled" description="Disabled select prevents interaction." code={examples[4].code} highlightedCode={html("disabled")}>
					<Select items={OPTION_ITEMS} disabled>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="Disabled" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="1">Option 1</SelectItem>
						</SelectContent>
					</Select>
				</DocExampleClient>
			</DocSection>

			<DocSection id="select-props" title="Select Props">
				<DocPropsTable props={selectData.props} />
			</DocSection>

			<DocSection id="trigger-props" title="SelectTrigger Props">
				<DocPropsTable props={triggerProps} />
			</DocSection>

			<DocSection id="tokens" title="Design Tokens">
				<p className="text-sm text-fg-muted">Select components use the design system tokens:</p>
				<ul className="list-inside list-disc space-y-2 text-sm text-fg-muted">
					<li>
						<code className="text-xs">bg-card</code> - Trigger background
					</li>
					<li>
						<code className="text-xs">border-edge</code> - Trigger border
					</li>
					<li>
						<code className="text-xs">text-sm</code> - Text size with proper line height
					</li>
					<li>
						<code className="text-xs">rounded-lg</code> - Consistent border radius
					</li>
					<li>
						<code className="text-xs">shadow-md</code> - Dropdown elevation
					</li>
				</ul>
			</DocSection>

			<DocSection id="guidelines" title="Guidelines">
				<ul className="list-inside list-disc space-y-2 text-sm text-fg-muted">
					<li>Use select for 5+ options, radio buttons for fewer</li>
					<li>Provide clear placeholder text</li>
					<li>Group related options with SelectGroup and SelectLabel</li>
					<li>Consider a Combobox for searchable/filterable lists</li>
				</ul>
			</DocSection>
		</DocPage>
	)
}
