"use client"

import { use } from "react"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { type DocProp, DocPropsTable } from "~/components/docs/doc-props-table"
import { DocSection } from "~/components/docs/doc-section"
import { highlightExamples } from "~/lib/highlight-examples"
import { QuickLoginDemo } from "./demos"

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "setup", title: "Setup" },
	{ id: "selector-props", title: "QuickAccountSelector Props" },
	{ id: "account-type", title: "TestAccount Type" },
]

const examples = [
	{
		key: "basic",
		code: `import { QuickAccountSelector } from "@blazz/quick-login"
import "@blazz/quick-login/styles.css"

const ACCOUNTS = [
  {
    label: "Admin",
    username: "admin",
    password: "Admin1234!",
    group: "Admin",
  },
  {
    label: "Viewer",
    username: "viewer",
    password: "Test1234!",
    group: "Users",
    description: "Read-only access",
  },
]

export function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  return (
    <div>
      <QuickAccountSelector
        accounts={ACCOUNTS}
        onAccountSelect={(u, p) => {
          setUsername(u)
          setPassword(p)
        }}
      />
      {/* Your login form */}
    </div>
  )
}`,
	},
	{
		key: "position",
		code: `// Position the button in a corner
<QuickAccountSelector
  accounts={ACCOUNTS}
  onAccountSelect={handleSelect}
  position="bottom-right"
  sheetSide="right"
/>`,
	},
	{
		key: "account-type",
		code: `interface TestAccount {
  label: string        // Display name ("Admin")
  username: string     // Login username
  password: string     // Login password
  avatarUrl?: string   // Optional avatar image
  group?: string       // Group for section headers
  subgroup?: string    // Sub-section within a group
  description?: string // Optional subtitle
}`,
	},
] as const

const highlightedPromise = highlightExamples(examples as any)

// ── Props tables ─────────────────────────────────────────────────────────────

const selectorProps: DocProp[] = [
	{
		name: "accounts",
		type: "TestAccount[]",
		required: true,
		description: "List of test accounts to display in the selector sheet.",
	},
	{
		name: "onAccountSelect",
		type: "(username: string, password: string) => void",
		required: true,
		description: "Called when the user clicks an account. Use to fill your login form.",
	},
	{
		name: "forceShow",
		type: "boolean",
		description:
			"Show the selector even in production. Do not use in production builds. Default: false.",
	},
	{
		name: "position",
		type: '"top-left" | "top-right" | "bottom-left" | "bottom-right"',
		description: 'Corner where the trigger button is fixed. Default: "top-right".',
	},
	{
		name: "sheetSide",
		type: '"left" | "right"',
		description: 'Side the account sheet slides in from. Default: "right".',
	},
]

const accountProps: DocProp[] = [
	{
		name: "label",
		type: "string",
		required: true,
		description: 'Display name shown in the list. Supports emojis ("Admin").',
	},
	{
		name: "username",
		type: "string",
		required: true,
		description: "Username passed to onAccountSelect when clicked.",
	},
	{
		name: "password",
		type: "string",
		required: true,
		description: "Password passed to onAccountSelect when clicked.",
	},
	{
		name: "group",
		type: "string",
		description: 'Section header in the sheet (e.g. "Admin", "Users").',
	},
	{
		name: "subgroup",
		type: "string",
		description: "Sub-section within a group.",
	},
	{
		name: "description",
		type: "string",
		description: "Optional subtitle shown below the label.",
	},
	{
		name: "avatarUrl",
		type: "string",
		description:
			"Optional avatar image URL. Falls back to initials if not provided or fails to load.",
	},
]

// ── Page ─────────────────────────────────────────────────────────────────────

export default function QuickLoginPage() {
	const highlighted = use(highlightedPromise)
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="Quick Login"
			subtitle="A development-only floating button that opens an account selector. Click any account to instantly fill your login form — no typing credentials during dev."
			toc={toc}
		>
			<DocHero>
				<QuickLoginDemo />
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExampleClient
					title="Basic setup"
					description="Import the component and the CSS, pass your accounts array and a callback to fill your form."
					code={examples[0].code}
					highlightedCode={html("basic")}
				>
					<QuickLoginDemo />
				</DocExampleClient>

				<DocExampleClient
					title="Custom position"
					description="Control the corner where the trigger button appears and which side the sheet slides from."
					code={examples[1].code}
					highlightedCode={html("position")}
				>
					<QuickLoginDemo position="bottom-right" />
				</DocExampleClient>
			</DocSection>

			<DocSection id="setup" title="Setup">
				<ol className="list-decimal list-inside space-y-2 text-sm text-fg-muted">
					<li>
						Add <code className="text-fg">@blazz/quick-login</code> to your app's dependencies.
					</li>
					<li>
						Import the CSS once at the root of your app:{" "}
						<code className="text-fg">import "@blazz/quick-login/styles.css"</code> — required for
						the slide animations to work.
					</li>
					<li>
						Drop <code className="text-fg">{"<QuickAccountSelector />"}</code> anywhere in your
						login page tree. It renders as <code className="text-fg">null</code> outside of{" "}
						<code className="text-fg">NODE_ENV === "development"</code> unless you pass{" "}
						<code className="text-fg">forceShow</code>.
					</li>
					<li>
						In <code className="text-fg">onAccountSelect</code>, fill your form's username and
						password fields (or call your auth mutation directly).
					</li>
				</ol>
			</DocSection>

			<DocSection id="selector-props" title="QuickAccountSelector Props">
				<DocPropsTable props={selectorProps} />
			</DocSection>

			<DocSection id="account-type" title="TestAccount Type">
				<DocExampleClient
					title="TestAccount interface"
					description="Shape of each account object passed to the accounts array."
					code={examples[2].code}
					highlightedCode={html("account-type")}
				>
					{null}
				</DocExampleClient>
				<DocPropsTable props={accountProps} />
			</DocSection>
		</DocPage>
	)
}
