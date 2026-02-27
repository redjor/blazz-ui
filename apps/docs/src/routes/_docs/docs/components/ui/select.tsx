import { createFileRoute } from "@tanstack/react-router"
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
	SelectGroup,
	SelectLabel,
	SelectSeparator,
} from "@blazz/ui/components/ui/select"
import { Label } from "@blazz/ui/components/ui/label"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"
import { DocHero } from "~/components/docs/doc-hero"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocPropsTable, type DocProp } from "~/components/docs/doc-props-table"
import { highlightCode } from "~/lib/highlight-code"

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "select-props", title: "Select Props" },
	{ id: "trigger-props", title: "Trigger Props" },
	{ id: "tokens", title: "Design Tokens" },
	{ id: "guidelines", title: "Guidelines" },
]

const selectProps: DocProp[] = [
	{
		name: "value",
		type: "string",
		description: "The controlled value of the select.",
	},
	{
		name: "defaultValue",
		type: "string",
		description: "The default value for uncontrolled usage.",
	},
	{
		name: "onValueChange",
		type: "(value: string) => void",
		description: "Callback when the value changes.",
	},
	{
		name: "disabled",
		type: "boolean",
		default: "false",
		description: "Whether the select is disabled.",
	},
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

const examples = [
	{
		key: "default",
		code: `<Select>
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
  <Select>
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
		code: `<Select>
  <SelectTrigger size="sm">
    <SelectValue placeholder="Small" />
  </SelectTrigger>
  ...
</Select>
<Select>
  <SelectTrigger size="default">
    <SelectValue placeholder="Default" />
  </SelectTrigger>
  ...
</Select>`,
	},
	{
		key: "groups",
		code: `<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select timezone" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>North America</SelectLabel>
      <SelectItem value="est">Eastern Time</SelectItem>
      <SelectItem value="pst">Pacific Time</SelectItem>
    </SelectGroup>
    <SelectSeparator />
    <SelectGroup>
      <SelectLabel>Europe</SelectLabel>
      <SelectItem value="gmt">GMT</SelectItem>
      <SelectItem value="cet">Central European</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>`,
	},
	{
		key: "disabled",
		code: `<Select disabled>
  <SelectTrigger>
    <SelectValue placeholder="Disabled" />
  </SelectTrigger>
  ...
</Select>`,
	},
] as const

export const Route = createFileRoute("/_docs/docs/components/ui/select")({
	loader: async () => {
		const highlighted = await Promise.all(
			examples.map(async (ex) => ({
				key: ex.key,
				html: await highlightCode({ data: { code: ex.code } }),
			})),
		)
		return { highlighted }
	},
	component: SelectPage,
})

function SelectPage() {
	const { highlighted } = Route.useLoaderData()
	const html = (key: string) =>
		highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="Select"
			subtitle="A dropdown menu for selecting a single value from a list of options."
			toc={toc}
		>
			<DocHero>
				<Select>
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
				<DocExampleClient
					title="Default"
					description="A basic select dropdown."
					code={examples[0].code}
					highlightedCode={html("default")}
				>
					<Select>
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

				<DocExampleClient
					title="With Label"
					description="Select with an associated label."
					code={examples[1].code}
					highlightedCode={html("with-label")}
				>
					<div className="w-[200px] space-y-2">
						<Label htmlFor="country">Country</Label>
						<Select>
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

				<DocExampleClient
					title="Sizes"
					description="Available select trigger sizes."
					code={examples[2].code}
					highlightedCode={html("sizes")}
				>
					<div className="flex items-center gap-4">
						<Select>
							<SelectTrigger size="sm" className="w-[140px]">
								<SelectValue placeholder="Small" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="1">Option 1</SelectItem>
								<SelectItem value="2">Option 2</SelectItem>
							</SelectContent>
						</Select>
						<Select>
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

				<DocExampleClient
					title="With Groups"
					description="Organize options into labeled groups."
					code={examples[3].code}
					highlightedCode={html("groups")}
				>
					<Select>
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

				<DocExampleClient
					title="Disabled"
					description="Disabled select prevents interaction."
					code={examples[4].code}
					highlightedCode={html("disabled")}
				>
					<Select disabled>
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
				<DocPropsTable props={selectProps} />
			</DocSection>

			<DocSection id="trigger-props" title="SelectTrigger Props">
				<DocPropsTable props={triggerProps} />
			</DocSection>

			<DocSection id="tokens" title="Design Tokens">
				<p className="text-sm text-fg-muted">
					Select components use the design system tokens:
				</p>
				<ul className="list-inside list-disc space-y-2 text-sm text-fg-muted">
					<li>
						<code className="text-xs">bg-surface</code> - Trigger background
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
