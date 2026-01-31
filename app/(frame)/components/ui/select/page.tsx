"use client"

import { Page } from "@/components/ui/page"
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
	SelectGroup,
	SelectLabel,
	SelectSeparator,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { ComponentExample } from "@/components/features/docs/component-example"
import { PropsTable, type PropDefinition } from "@/components/features/docs/props-table"

const selectProps: PropDefinition[] = [
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

const triggerProps: PropDefinition[] = [
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

export default function SelectPage() {
	return (
		<Page
			title="Select"
			subtitle="A dropdown menu for selecting a single value from a list of options."
		>
			<div className="space-y-10">
				<section className="space-y-6">
					<h2 className="text-lg font-semibold">Examples</h2>

					<ComponentExample
						title="Default"
						description="A basic select dropdown."
						code={`<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select a fruit" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="apple">Apple</SelectItem>
    <SelectItem value="banana">Banana</SelectItem>
    <SelectItem value="orange">Orange</SelectItem>
  </SelectContent>
</Select>`}
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
					</ComponentExample>

					<ComponentExample
						title="With Label"
						description="Select with an associated label."
						code={`<div className="space-y-2">
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
</div>`}
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
					</ComponentExample>

					<ComponentExample
						title="Sizes"
						description="Available select trigger sizes."
						code={`<Select>
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
</Select>`}
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
					</ComponentExample>

					<ComponentExample
						title="With Groups"
						description="Organize options into labeled groups."
						code={`<Select>
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
</Select>`}
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
					</ComponentExample>

					<ComponentExample
						title="Disabled"
						description="Disabled select prevents interaction."
						code={`<Select disabled>
  <SelectTrigger>
    <SelectValue placeholder="Disabled" />
  </SelectTrigger>
  ...
</Select>`}
					>
						<Select disabled>
							<SelectTrigger className="w-[180px]">
								<SelectValue placeholder="Disabled" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="1">Option 1</SelectItem>
							</SelectContent>
						</Select>
					</ComponentExample>
				</section>

				<section className="space-y-4">
					<h2 className="text-lg font-semibold">Select Props</h2>
					<PropsTable props={selectProps} />
				</section>

				<section className="space-y-4">
					<h2 className="text-lg font-semibold">SelectTrigger Props</h2>
					<PropsTable props={triggerProps} />
				</section>

				<section className="space-y-4">
					<h2 className="text-lg font-semibold">Best Practices</h2>
					<ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
						<li>Use select for 5+ options, radio buttons for fewer</li>
						<li>Provide clear placeholder text</li>
						<li>Group related options with SelectGroup and SelectLabel</li>
						<li>Consider a Combobox for searchable/filterable lists</li>
					</ul>
				</section>
			</div>
		</Page>
	)
}
