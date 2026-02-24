import { OtpInput } from "@/components/ui/otp-input"
import { DocPage } from "@/components/features/docs/doc-page"
import { DocSection } from "@/components/features/docs/doc-section"
import { DocHero } from "@/components/features/docs/doc-hero"
import { DocExample } from "@/components/features/docs/doc-example"
import { DocPropsTable, type DocProp } from "@/components/features/docs/doc-props-table"
import { DocRelated } from "@/components/features/docs/doc-related"
import { ControlledOtpInputDemo } from "./_demos"

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

export default function OtpInputPage() {
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
				<DocExample
					title="Default"
					description="A 6-digit OTP input."
					code={`<OtpInput length={6} />`}
				>
					<OtpInput length={6} />
				</DocExample>

				<DocExample
					title="4 Digits"
					description="A shorter 4-digit OTP for simpler codes."
					code={`<OtpInput length={4} />`}
				>
					<OtpInput length={4} />
				</DocExample>

				<DocExample
					title="Masked / PIN"
					description="Mask the digits for PIN-style secure entry."
					code={`<OtpInput length={4} mask />`}
				>
					<OtpInput length={4} mask />
				</DocExample>

				<DocExample
					title="Controlled"
					description="Control the OTP value programmatically."
					code={`const [otp, setOtp] = React.useState("")

<OtpInput
  length={6}
  value={otp}
  onValueChange={setOtp}
  onComplete={(code) => console.log("Complete:", code)}
/>
<p>Value: {otp}</p>`}
				>
					<ControlledOtpInputDemo />
				</DocExample>

				<DocExample
					title="Error State"
					description="Show validation errors using aria-invalid."
					code={`<div className="space-y-2">
  <OtpInput length={6} aria-invalid />
  <p className="text-sm text-negative">
    Invalid verification code. Please try again.
  </p>
</div>`}
				>
					<div className="space-y-2">
						<OtpInput length={6} aria-invalid />
						<p className="text-sm text-negative">
							Invalid verification code. Please try again.
						</p>
					</div>
				</DocExample>
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
