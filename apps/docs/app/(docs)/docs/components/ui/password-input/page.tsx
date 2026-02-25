import { PasswordInput } from "@blazz/ui/components/ui/password-input"
import { DocPage } from "@/components/features/docs/doc-page"
import { DocSection } from "@/components/features/docs/doc-section"
import { DocHero } from "@/components/features/docs/doc-hero"
import { DocExample } from "@/components/features/docs/doc-example"
import { DocPropsTable, type DocProp } from "@/components/features/docs/doc-props-table"
import { DocRelated } from "@/components/features/docs/doc-related"

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "props", title: "Props" },
	{ id: "guidelines", title: "Guidelines" },
	{ id: "related", title: "Related" },
]

const passwordInputProps: DocProp[] = [
	{
		name: "showToggle",
		type: "boolean",
		default: "true",
		description: "Show password visibility toggle button.",
	},
	{
		name: "placeholder",
		type: "string",
		description: "Placeholder text shown when input is empty.",
	},
	{
		name: "disabled",
		type: "boolean",
		default: "false",
		description: "Whether the input is disabled.",
	},
	{
		name: "aria-invalid",
		type: "boolean",
		description: "Indicates the input has an error.",
	},
]

export default function PasswordInputPage() {
	return (
		<DocPage
			title="PasswordInput"
			subtitle="A password input field with an optional visibility toggle for showing or hiding the entered value."
			toc={toc}
		>
			{/* Hero */}
			<DocHero>
				<PasswordInput placeholder="Enter your password" className="max-w-sm" />
			</DocHero>

			{/* Examples */}
			<DocSection id="examples" title="Examples">
				<DocExample
					title="Default"
					description="A password input with a visibility toggle."
					code={`<PasswordInput placeholder="Enter your password" />`}
				>
					<PasswordInput placeholder="Enter your password" className="max-w-sm" />
				</DocExample>

				<DocExample
					title="Without Toggle"
					description="Hide the visibility toggle for a simpler appearance."
					code={`<PasswordInput showToggle={false} placeholder="Enter your password" />`}
				>
					<PasswordInput showToggle={false} placeholder="Enter your password" className="max-w-sm" />
				</DocExample>

				<DocExample
					title="Disabled"
					description="Disabled password inputs prevent user interaction."
					code={`<PasswordInput disabled placeholder="Disabled" />`}
				>
					<PasswordInput disabled placeholder="Disabled" className="max-w-sm" />
				</DocExample>

				<DocExample
					title="Error State"
					description="Show validation errors using aria-invalid."
					code={`<div className="space-y-2">
  <PasswordInput aria-invalid placeholder="Enter your password" />
  <p className="text-sm text-negative">
    Password must be at least 8 characters.
  </p>
</div>`}
				>
					<div className="max-w-sm space-y-2">
						<PasswordInput aria-invalid placeholder="Enter your password" />
						<p className="text-sm text-negative">
							Password must be at least 8 characters.
						</p>
					</div>
				</DocExample>
			</DocSection>

			{/* Props */}
			<DocSection id="props" title="Props">
				<DocPropsTable props={passwordInputProps} />
			</DocSection>

			{/* Guidelines */}
			<DocSection id="guidelines" title="Guidelines">
				<ul className="list-inside list-disc space-y-2 text-sm text-fg-muted">
					<li>Always include a visibility toggle unless security policy requires hiding the password</li>
					<li>Provide clear validation feedback for password requirements</li>
					<li>Use with a Label component for accessibility</li>
					<li>Consider pairing with a strength indicator for sign-up forms</li>
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
							title: "SearchInput",
							href: "/docs/components/ui/search-input",
							description: "Specialized input with search icon and clear button.",
						},
					]}
				/>
			</DocSection>
		</DocPage>
	)
}
