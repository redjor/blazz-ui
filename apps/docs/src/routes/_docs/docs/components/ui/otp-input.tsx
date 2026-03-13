import { OtpInput } from "@blazz/ui/components/ui/otp-input"
import { createFileRoute } from "@tanstack/react-router"
import * as React from "react"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { type DocProp, DocPropsTable } from "~/components/docs/doc-props-table"
import { DocRelated } from "~/components/docs/doc-related"
import { DocSection } from "~/components/docs/doc-section"
import { highlightCode } from "~/lib/highlight-code"

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "props", title: "Props" },
	{ id: "guidelines", title: "Guidelines" },
	{ id: "related", title: "Related" },
]

const otpInputProps: DocProp[] = [
	{
		name: "length",
		type: "number",
		default: "6",
		description: "Number of digit fields.",
	},
	{
		name: "value",
		type: "string",
		default: '""',
		description: "Controlled value of the OTP input.",
	},
	{
		name: "onValueChange",
		type: "(value: string) => void",
		description: "Callback when the value changes.",
	},
	{
		name: "onComplete",
		type: "(value: string) => void",
		description: "Callback when all digits are filled.",
	},
	{
		name: "disabled",
		type: "boolean",
		default: "false",
		description: "Whether the input is disabled.",
	},
	{
		name: "mask",
		type: "boolean",
		default: "false",
		description: "Mask input characters for PIN-style entry.",
	},
	{
		name: "aria-invalid",
		type: "boolean",
		description: "Indicates the input has an error.",
	},
]

const examples = [
	{
		key: "default",
		code: `<OtpInput length={6} />`,
	},
	{
		key: "four-digits",
		code: `<OtpInput length={4} />`,
	},
	{
		key: "masked",
		code: `<OtpInput length={4} mask />`,
	},
	{
		key: "controlled",
		code: `const [otp, setOtp] = React.useState("")

<OtpInput
  length={6}
  value={otp}
  onValueChange={setOtp}
  onComplete={(code) => console.log("Complete:", code)}
/>
<p>Value: {otp}</p>`,
	},
	{
		key: "error",
		code: `<div className="space-y-2">
  <OtpInput length={6} aria-invalid />
  <p className="text-sm text-negative">
    Invalid verification code. Please try again.
  </p>
</div>`,
	},
] as const

export const Route = createFileRoute("/_docs/docs/components/ui/otp-input")({
	loader: async () => {
		const highlighted = await Promise.all(
			examples.map(async (ex) => ({
				key: ex.key,
				html: await highlightCode({ data: { code: ex.code } }),
			}))
		)
		return { highlighted }
	},
	component: OtpInputPage,
})

function ControlledOtpInputDemo() {
	const [otp, setOtp] = React.useState("")

	return (
		<div className="flex flex-col items-start gap-3">
			<OtpInput
				length={6}
				value={otp}
				onValueChange={setOtp}
				onComplete={(code) => console.log("Complete:", code)}
			/>
			<p className="text-sm text-fg-muted">Value: {otp || "(empty)"}</p>
		</div>
	)
}

function OtpInputPage() {
	const { highlighted } = Route.useLoaderData()
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="OtpInput"
			subtitle="A one-time password input with individual digit fields, supporting paste and keyboard navigation."
			toc={toc}
		>
			{/* Hero */}
			<DocHero>
				<OtpInput length={6} />
			</DocHero>

			{/* Examples */}
			<DocSection id="examples" title="Examples">
				<DocExampleClient
					title="Default"
					description="A 6-digit OTP input."
					code={examples[0].code}
					highlightedCode={html("default")}
				>
					<OtpInput length={6} />
				</DocExampleClient>

				<DocExampleClient
					title="4 Digits"
					description="A shorter 4-digit OTP for simpler codes."
					code={examples[1].code}
					highlightedCode={html("four-digits")}
				>
					<OtpInput length={4} />
				</DocExampleClient>

				<DocExampleClient
					title="Masked / PIN"
					description="Mask the digits for PIN-style secure entry."
					code={examples[2].code}
					highlightedCode={html("masked")}
				>
					<OtpInput length={4} mask />
				</DocExampleClient>

				<DocExampleClient
					title="Controlled"
					description="Control the OTP value programmatically."
					code={examples[3].code}
					highlightedCode={html("controlled")}
				>
					<ControlledOtpInputDemo />
				</DocExampleClient>

				<DocExampleClient
					title="Error State"
					description="Show validation errors using aria-invalid."
					code={examples[4].code}
					highlightedCode={html("error")}
				>
					<div className="space-y-2">
						<OtpInput length={6} aria-invalid />
						<p className="text-sm text-negative">Invalid verification code. Please try again.</p>
					</div>
				</DocExampleClient>
			</DocSection>

			{/* Props */}
			<DocSection id="props" title="Props">
				<DocPropsTable props={otpInputProps} />
			</DocSection>

			{/* Guidelines */}
			<DocSection id="guidelines" title="Guidelines">
				<ul className="list-inside list-disc space-y-2 text-sm text-fg-muted">
					<li>Use 6 digits for verification codes and 4 digits for PINs</li>
					<li>Enable mask mode for sensitive PIN entries</li>
					<li>Use the onComplete callback to auto-submit when all digits are filled</li>
					<li>Support paste so users can paste codes from SMS or email</li>
					<li>Provide clear error feedback when the code is invalid</li>
				</ul>
			</DocSection>

			{/* Related */}
			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{
							title: "Input",
							href: "/docs/components/ui/input",
							description: "Base text input for general data collection.",
						},
						{
							title: "PasswordInput",
							href: "/docs/components/ui/password-input",
							description: "Password input with visibility toggle.",
						},
					]}
				/>
			</DocSection>
		</DocPage>
	)
}
