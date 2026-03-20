"use client"

import { use } from "react"
import { CurrencyInput } from "@blazz/ui/components/ui/currency-input"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { type DocProp, DocPropsTable } from "~/components/docs/doc-props-table"
import { DocRelated } from "~/components/docs/doc-related"
import { DocSection } from "~/components/docs/doc-section"
import { highlightExamples } from "~/lib/highlight-examples"
import { ControlledCurrencyInputDemo } from "./demos"

const examples = [
	{
		key: "default",
		code: `<CurrencyInput value={1234.56} />`,
	},
	{
		key: "usd",
		code: `<CurrencyInput
  value={1234.56}
  currency="USD"
  locale="en-US"
  symbolPosition="left"
/>`,
	},
	{
		key: "custom-decimals",
		code: `<CurrencyInput value={1234} decimals={0} />`,
	},
	{
		key: "controlled",
		code: `const [value, setValue] = React.useState<number | null>(99.99)

<CurrencyInput
  value={value}
  onValueChange={setValue}
  currency="EUR"
/>
<p>Value: {value !== null ? value : "null"}</p>`,
	},
	{
		key: "disabled",
		code: `<CurrencyInput value={500} disabled />`,
	},
] as const

const highlightedPromise = highlightExamples(examples as any)

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "props", title: "Props" },
	{ id: "guidelines", title: "Guidelines" },
	{ id: "related", title: "Related" },
]

const currencyInputProps: DocProp[] = [
	{
		name: "value",
		type: "number | null",
		description: "The controlled numeric value of the input.",
	},
	{
		name: "onValueChange",
		type: "(value: number | null) => void",
		description: "Callback fired when the value changes.",
	},
	{
		name: "currency",
		type: "string",
		default: '"EUR"',
		description: "The ISO 4217 currency code used for the symbol.",
	},
	{
		name: "locale",
		type: "string",
		default: '"fr-FR"',
		description: "The locale used for number formatting.",
	},
	{
		name: "decimals",
		type: "number",
		default: "2",
		description: "Number of decimal places.",
	},
	{
		name: "symbolPosition",
		type: '"left" | "right"',
		default: '"right"',
		description: "Position of the currency symbol relative to the input.",
	},
	{
		name: "placeholder",
		type: "string",
		description: "Placeholder text shown when the input is empty.",
	},
]


export default function CurrencyInputPage() {
	const highlighted = use(highlightedPromise)
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="CurrencyInput"
			subtitle="A formatted numeric input for currency values. Supports locale-aware formatting, configurable decimal places, and currency symbols."
			toc={toc}
		>
			<DocHero>
				<CurrencyInput value={1234.56} className="max-w-xs" />
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExampleClient
					title="Default"
					description="A basic currency input with default EUR formatting."
					code={examples[0].code}
					highlightedCode={html("default")}
				>
					<CurrencyInput value={1234.56} className="max-w-xs" />
				</DocExampleClient>

				<DocExampleClient
					title="USD"
					description="US Dollar formatting with the symbol on the left."
					code={examples[1].code}
					highlightedCode={html("usd")}
				>
					<CurrencyInput
						value={1234.56}
						currency="USD"
						locale="en-US"
						symbolPosition="left"
						className="max-w-xs"
					/>
				</DocExampleClient>

				<DocExampleClient
					title="Custom Decimals"
					description="Display without decimal places for whole-number currencies."
					code={examples[2].code}
					highlightedCode={html("custom-decimals")}
				>
					<CurrencyInput value={1234} decimals={0} className="max-w-xs" />
				</DocExampleClient>

				<DocExampleClient
					title="Controlled"
					description="Manage the value programmatically with state."
					code={examples[3].code}
					highlightedCode={html("controlled")}
				>
					<ControlledCurrencyInputDemo />
				</DocExampleClient>

				<DocExampleClient
					title="Disabled"
					description="Disabled currency inputs prevent user interaction."
					code={examples[4].code}
					highlightedCode={html("disabled")}
				>
					<CurrencyInput value={500} disabled className="max-w-xs" />
				</DocExampleClient>
			</DocSection>

			<DocSection id="props" title="Props">
				<DocPropsTable props={currencyInputProps} />
			</DocSection>

			<DocSection id="guidelines" title="Guidelines">
				<ul className="list-inside list-disc space-y-2 text-sm text-fg-muted">
					<li>Use the appropriate locale and currency for your target audience</li>
					<li>Set decimals to 0 for currencies without minor units (e.g., JPY)</li>
					<li>Position the currency symbol according to locale conventions</li>
					<li>Pair with a Label for accessibility in forms</li>
				</ul>
			</DocSection>

			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{
							title: "Input",
							href: "/docs/components/ui/input",
							description: "Basic text input for general-purpose data entry.",
						},
						{
							title: "NumberInput",
							href: "/docs/components/ui/number-input",
							description: "Numeric input with increment and decrement controls.",
						},
					]}
				/>
			</DocSection>
		</DocPage>
	)
}
