"use client"

import type { TestAccount } from "@blazz/quick-login"
import { QuickAccountSelector } from "@blazz/quick-login"
import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { type DocProp, DocPropsTable } from "~/components/docs/doc-props-table"
import { DocSection } from "~/components/docs/doc-section"
import { highlightCode } from "~/lib/highlight-code"

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "setup", title: "Setup" },
	{ id: "selector-props", title: "QuickAccountSelector Props" },
	{ id: "account-type", title: "TestAccount Type" },
]

const DEMO_ACCOUNTS: TestAccount[] = [
	{
		label: "👑 Admin",
		username: "admin",
		password: "Admin1234!",
		group: "Admin",
		description: "Full access",
	},
	{
		label: "🌍 Manager",
		username: "manager",
		password: "Test1234!",
		group: "Users",
		subgroup: "Management",
		description: "Can view all resources",
	},
	{
		label: "👤 Viewer",
		username: "viewer",
		password: "Test1234!",
		group: "Users",
		subgroup: "Read-only",
		description: "Read-only access",
	},
]

const examples = [
	{
		key: "basic",
		code: `import { QuickAccountSelector } from "@blazz/quick-login"
import "@blazz/quick-login/styles.css"

const ACCOUNTS = [
  {
    label: "👑 Admin",
    username: "admin",
    password: "Admin1234!",
    group: "Admin",
  },
  {
    label: "👤 Viewer",
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
  label: string        // Display name ("👑 Admin")
  username: string     // Login username
  password: string     // Login password
  avatarUrl?: string   // Optional avatar image
  group?: string       // Group for section headers
  subgroup?: string    // Sub-section within a group
  description?: string // Optional subtitle
}`,
	},
] as const

export const Route = createFileRoute("/_docs/docs/utils/quick-login")({
	loader: async () => {
		const highlighted = await Promise.all(
			examples.map(async (ex) => ({
				key: ex.key,
				html: await highlightCode({ data: { code: ex.code } }),
			}))
		)
		return { highlighted }
	},
	component: QuickLoginPage,
})

// ── Demo ─────────────────────────────────────────────────────────────────────

function Demo({ position }: { position?: "top-right" | "bottom-right" }) {
	const [selected, setSelected] = useState<string | null>(null)
	const pos = position ?? "top-right"

	return (
		<div className="relative w-full min-h-24 flex items-center justify-center">
			<QuickAccountSelector
				accounts={DEMO_ACCOUNTS}
				onAccountSelect={(username) => setSelected(username)}
				forceShow
				position={pos}
				sheetSide="right"
				triggerClassName={`absolute z-10 ${pos === "bottom-right" ? "right-0 bottom-0" : "right-0 top-0"}`}
			/>
			<p className="text-sm text-fg-muted">
				{selected ? (
					<>
						Connected as{" "}
						<code className="text-fg font-mono text-xs bg-surface px-1.5 py-0.5 rounded border border-edge">
							{selected}
						</code>
					</>
				) : (
					"Click the button to select a test account"
				)}
			</p>
		</div>
	)
}

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
		description: 'Display name shown in the list. Supports emojis ("👑 Admin").',
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

function QuickLoginPage() {
	const { highlighted } = Route.useLoaderData()
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="Quick Login"
			subtitle="A development-only floating button that opens an account selector. Click any account to instantly fill your login form — no typing credentials during dev."
			toc={toc}
		>
			<DocHero>
				<Demo />
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExampleClient
					title="Basic setup"
					description="Import the component and the CSS, pass your accounts array and a callback to fill your form."
					code={examples[0].code}
					highlightedCode={html("basic")}
				>
					<Demo />
				</DocExampleClient>

				<DocExampleClient
					title="Custom position"
					description="Control the corner where the trigger button appears and which side the sheet slides from."
					code={examples[1].code}
					highlightedCode={html("position")}
				>
					<Demo position="bottom-right" />
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
