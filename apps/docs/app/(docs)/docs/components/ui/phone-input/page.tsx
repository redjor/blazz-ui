"use client"

import { useState } from "react"
import { PhoneInput } from "@blazz/ui/components/ui/phone-input"
import { DocPage } from "@/components/features/docs/doc-page"
import { DocSection } from "@/components/features/docs/doc-section"
import { DocHero } from "@/components/features/docs/doc-hero"
import { DocExampleSync as DocExample } from "@/components/features/docs/doc-example-client"
import { DocPropsTable, type DocProp } from "@/components/features/docs/doc-props-table"

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "props", title: "Props" },
	{ id: "best-practices", title: "Best Practices" },
]

const phoneInputProps: DocProp[] = [
	{
		name: "value",
		type: "string",
		description: "The phone number value in E.164 format (e.g. +33612345678).",
	},
	{
		name: "onChange",
		type: "(value: Value) => void",
		description: "Callback fired when the phone number changes.",
	},
	{
		name: "defaultCountry",
		type: "Country",
		description: 'The default country code (e.g. "FR", "US").',
	},
	{
		name: "variant",
		type: '"sm" | "default" | "lg"',
		default: '"default"',
		description: "Size variant for the input and country selector.",
	},
	{
		name: "placeholder",
		type: "string",
		description: "Placeholder text for the phone number input.",
	},
	{
		name: "disabled",
		type: "boolean",
		default: "false",
		description: "Whether the input is disabled.",
	},
	{
		name: "international",
		type: "boolean",
		description: "Whether to display the phone number in international format.",
	},
]

function HeroExample() {
	const [value, setValue] = useState("")
	return (
		<div className="w-full max-w-sm">
			<PhoneInput
				value={value}
				onChange={setValue}
				defaultCountry="FR"
				placeholder="06 12 34 56 78"
			/>
		</div>
	)
}

function DefaultExample() {
	const [value, setValue] = useState("")
	return (
		<div className="space-y-2">
			<PhoneInput
				value={value}
				onChange={setValue}
				defaultCountry="FR"
				placeholder="06 12 34 56 78"
			/>
			<p className="text-xs text-fg-muted font-mono">
				Value: {value || "(empty)"}
			</p>
		</div>
	)
}

function SizesExample() {
	const [v1, setV1] = useState("")
	const [v2, setV2] = useState("")
	const [v3, setV3] = useState("")
	return (
		<div className="space-y-3">
			<PhoneInput value={v1} onChange={setV1} variant="sm" defaultCountry="FR" placeholder="Small" />
			<PhoneInput value={v2} onChange={setV2} defaultCountry="US" placeholder="Default" />
			<PhoneInput value={v3} onChange={setV3} variant="lg" defaultCountry="GB" placeholder="Large" />
		</div>
	)
}

function DisabledExample() {
	return (
		<PhoneInput
			value="+33612345678"
			onChange={() => {}}
			defaultCountry="FR"
			disabled
		/>
	)
}

export default function PhoneInputPage() {
	return (
		<DocPage
			title="Phone Input"
			subtitle="International phone number input with country selector, flag display, and E.164 formatting."
			toc={toc}
		>
			{/* Hero */}
			<DocHero>
				<HeroExample />
			</DocHero>

			{/* Examples */}
			<DocSection id="examples" title="Examples">
				<DocExample
					title="Default"
					description="Phone input with country selector and automatic formatting."
					code={`const [value, setValue] = useState("")

<PhoneInput
  value={value}
  onChange={setValue}
  defaultCountry="FR"
  placeholder="06 12 34 56 78"
/>`}
				>
					<DefaultExample />
				</DocExample>

				<DocExample
					title="Sizes"
					description="Three size variants to fit different contexts."
					code={`<PhoneInput variant="sm" defaultCountry="FR" />
<PhoneInput defaultCountry="US" />
<PhoneInput variant="lg" defaultCountry="GB" />`}
				>
					<SizesExample />
				</DocExample>

				<DocExample
					title="Disabled"
					description="Disabled state prevents interaction."
					code={`<PhoneInput
  value="+33612345678"
  defaultCountry="FR"
  disabled
/>`}
				>
					<DisabledExample />
				</DocExample>
			</DocSection>

			{/* Props */}
			<DocSection id="props" title="Props">
				<DocPropsTable props={phoneInputProps} />
			</DocSection>

			{/* Best Practices */}
			<DocSection id="best-practices" title="Best Practices">
				<ul className="list-inside list-disc space-y-2 text-sm text-fg-muted">
					<li>Set <code className="font-mono text-fg-subtle">defaultCountry</code> to match your primary user base</li>
					<li>The value is always in E.164 format — store it as-is in your database</li>
					<li>Use with <code className="font-mono text-fg-subtle">Field</code> component for label and error handling</li>
					<li>The country selector supports keyboard search for quick navigation</li>
				</ul>
			</DocSection>
		</DocPage>
	)
}
