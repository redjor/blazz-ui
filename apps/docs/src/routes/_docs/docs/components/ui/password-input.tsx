import { PasswordInput } from "@blazz/ui/components/ui/password-input"
import { createFileRoute } from "@tanstack/react-router"
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

const examples = [
	{
		key: "default",
		code: `<PasswordInput placeholder="Enter your password" />`,
	},
	{
		key: "no-toggle",
		code: `<PasswordInput showToggle={false} placeholder="Enter your password" />`,
	},
	{
		key: "disabled",
		code: `<PasswordInput disabled placeholder="Disabled" />`,
	},
	{
		key: "error",
		code: `<div className="space-y-2">
  <PasswordInput aria-invalid placeholder="Enter your password" />
  <p className="text-sm text-negative">
    Password must be at least 8 characters.
  </p>
</div>`,
	},
] as const

export const Route = createFileRoute("/_docs/docs/components/ui/password-input")({
	loader: async () => {
		const highlighted = await Promise.all(
			examples.map(async (ex) => ({
				key: ex.key,
				html: await highlightCode({ data: { code: ex.code } }),
			}))
		)
		return { highlighted }
	},
	component: PasswordInputPage,
})

function PasswordInputPage() {
	const { highlighted } = Route.useLoaderData()
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

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
				<DocExampleClient
					title="Default"
					description="A password input with a visibility toggle."
					code={examples[0].code}
					highlightedCode={html("default")}
				>
					<PasswordInput placeholder="Enter your password" className="max-w-sm" />
				</DocExampleClient>

				<DocExampleClient
					title="Without Toggle"
					description="Hide the visibility toggle for a simpler appearance."
					code={examples[1].code}
					highlightedCode={html("no-toggle")}
				>
					<PasswordInput
						showToggle={false}
						placeholder="Enter your password"
						className="max-w-sm"
					/>
				</DocExampleClient>

				<DocExampleClient
					title="Disabled"
					description="Disabled password inputs prevent user interaction."
					code={examples[2].code}
					highlightedCode={html("disabled")}
				>
					<PasswordInput disabled placeholder="Disabled" className="max-w-sm" />
				</DocExampleClient>

				<DocExampleClient
					title="Error State"
					description="Show validation errors using aria-invalid."
					code={examples[3].code}
					highlightedCode={html("error")}
				>
					<div className="max-w-sm space-y-2">
						<PasswordInput aria-invalid placeholder="Enter your password" />
						<p className="text-sm text-negative">Password must be at least 8 characters.</p>
					</div>
				</DocExampleClient>
			</DocSection>

			{/* Props */}
			<DocSection id="props" title="Props">
				<DocPropsTable props={passwordInputProps} />
			</DocSection>

			{/* Guidelines */}
			<DocSection id="guidelines" title="Guidelines">
				<ul className="list-inside list-disc space-y-2 text-sm text-fg-muted">
					<li>
						Always include a visibility toggle unless security policy requires hiding the password
					</li>
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
