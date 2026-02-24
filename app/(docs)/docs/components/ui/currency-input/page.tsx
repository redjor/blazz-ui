import { CurrencyInput } from "@/components/ui/currency-input"
import { DocPage } from "@/components/features/docs/doc-page"
import { DocSection } from "@/components/features/docs/doc-section"
import { DocHero } from "@/components/features/docs/doc-hero"
import { DocExample } from "@/components/features/docs/doc-example"
import { DocPropsTable, type DocProp } from "@/components/features/docs/doc-props-table"
import { DocRelated } from "@/components/features/docs/doc-related"
import { ControlledCurrencyInputDemo } from "./_demos"

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
	return (
		<DocPage
			title="CurrencyInput"
			subtitle="A formatted numeric input for currency values. Supports locale-aware formatting, configurable decimal places, and currency symbols."
			toc={toc}
		>
			{/* Hero */}
			<DocHero>
				<CurrencyInput value={1234.56} className="max-w-xs" />
			</DocHero>

			{/* Examples */}
			<DocSection id="examples" title="Examples">
				<DocExample
					title="Default"
					description="A basic currency input with default EUR formatting."
					code={`<CurrencyInput value={1234.56} />`}
				>
					<CurrencyInput value={1234.56} className="max-w-xs" />
				</DocExample>

				<DocExample
					title="USD"
					description="US Dollar formatting with the symbol on the left."
					code={`<CurrencyInput
  value={1234.56}
  currency="USD"
  locale="en-US"
  symbolPosition="left"
/>`}
				>
					<CurrencyInput
						value={1234.56}
						currency="USD"
						locale="en-US"
						symbolPosition="left"
						className="max-w-xs"
					/>
				</DocExample>

				<DocExample
					title="Custom Decimals"
					description="Display without decimal places for whole-number currencies."
					code={`<CurrencyInput value={1234} decimals={0} />`}
				>
					<CurrencyInput value={1234} decimals={0} className="max-w-xs" />
				</DocExample>

				<DocExample
					title="Controlled"
					description="Manage the value programmatically with state."
					code={`const [value, setValue] = React.useState<number | null>(99.99)

<CurrencyInput
  value={value}
  onValueChange={setValue}
  currency="EUR"
/>
<p>Value: {value !== null ? value : "null"}</p>`}
				>
					<ControlledCurrencyInputDemo />
				</DocExample>

				<DocExample
					title="Disabled"
					description="Disabled currency inputs prevent user interaction."
					code={`<CurrencyInput value={500} disabled />`}
				>
					<CurrencyInput value={500} disabled className="max-w-xs" />
				</DocExample>
			</DocSection>

			{/* Props */}
			<DocSection id="props" title="Props">
				<DocPropsTable props={currencyInputProps} />
			</DocSection>

			{/* Guidelines */}
			<DocSection id="guidelines" title="Guidelines">
				<ul className="list-inside list-disc space-y-2 text-sm text-fg-muted">
					<li>Use the appropriate locale and currency for your target audience</li>
					<li>Set decimals to 0 for currencies without minor units (e.g., JPY)</li>
					<li>Position the currency symbol according to locale conventions</li>
					<li>Pair with a Label for accessibility in forms</li>
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
