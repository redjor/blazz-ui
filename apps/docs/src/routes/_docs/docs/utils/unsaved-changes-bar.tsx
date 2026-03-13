"use client"

import { Button } from "@blazz/ui"
import {
	UnsavedChangesBar,
	UnsavedChangesProvider,
	useUnsavedChanges,
} from "@blazz/ui/components/patterns/unsaved-changes-bar"
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
	{ id: "bar-props", title: "UnsavedChangesBar Props" },
	{ id: "hook-options", title: "useUnsavedChanges Options" },
	{ id: "best-practices", title: "Best Practices" },
]

const examples = [
	{
		key: "basic",
		code: `// 1. Wrap your app (layout.tsx)
<UnsavedChangesProvider>
  {children}
</UnsavedChangesProvider>

// 2. Place the bar in your top bar
// blockNavigation blocks browser back/forward and tab close automatically
function MyTopBar() {
  return (
    <header>
      <UnsavedChangesBar blockNavigation />
    </header>
  )
}

// 3. Register your form
function MyForm() {
  const form = useForm({ ... })

  const { allowNextNavigation } = useUnsavedChanges({
    formId: "my-form",
    isDirty: form.formState.isDirty,
    isSaving: form.formState.isSubmitting,
    onSave: async () => {
      await form.handleSubmit(onSubmit)()
      allowNextNavigation()
      router.push("/success")
    },
    onDiscard: () => form.reset(),
  })

  return <form>...</form>
}`,
	},
	{
		key: "bottom",
		code: `// Bar placed at the bottom of the screen — slides up on enter
<UnsavedChangesBar side="bottom" blockNavigation />`,
	},
	{
		key: "custom-labels",
		code: `useUnsavedChanges({
  formId: "customer-form",
  isDirty: form.formState.isDirty,
  isSaving: form.formState.isSubmitting,
  message: "Customer not saved",
  saveLabel: "Save customer",
  discardLabel: "Cancel",
  onSave: () => form.handleSubmit(onSubmit)(),
  onDiscard: () => form.reset(),
})`,
	},
] as const

export const Route = createFileRoute("/_docs/docs/utils/unsaved-changes-bar")({
	loader: async () => {
		const highlighted = await Promise.all(
			examples.map(async (ex) => ({
				key: ex.key,
				html: await highlightCode({ data: { code: ex.code } }),
			}))
		)
		return { highlighted }
	},
	component: UnsavedChangesBarPage,
})

// ── Demos ──────────────────────────────────────────────────────────────────

function DemoWrapper({ side }: { side?: "top" | "bottom" }) {
	const [isDirty, setIsDirty] = useState(false)
	const [isSaving, setIsSaving] = useState(false)

	return (
		<UnsavedChangesProvider>
			<InnerDemo
				isDirty={isDirty}
				isSaving={isSaving}
				side={side}
				onDirty={setIsDirty}
				onSaving={setIsSaving}
			/>
		</UnsavedChangesProvider>
	)
}

function InnerDemo({
	isDirty,
	isSaving,
	side,
	onDirty,
	onSaving,
}: {
	isDirty: boolean
	isSaving: boolean
	side?: "top" | "bottom"
	onDirty: (v: boolean) => void
	onSaving: (v: boolean) => void
}) {
	useUnsavedChanges({
		formId: "demo-form",
		isDirty,
		isSaving,
		onSave: async () => {
			onSaving(true)
			await new Promise((r) => setTimeout(r, 1200))
			onSaving(false)
			onDirty(false)
		},
		onDiscard: () => onDirty(false),
	})

	return (
		<div className="space-y-3 w-full">
			<UnsavedChangesBar side={side} />
			<Button
				variant={isDirty ? "outline" : "default"}
				size="sm"
				onClick={() => onDirty(!isDirty)}
				disabled={isSaving}
			>
				{isDirty ? "Form is dirty — click to reset" : "Simulate form edit"}
			</Button>
		</div>
	)
}

// ── Props tables ────────────────────────────────────────────────────────────

const barProps: DocProp[] = [
	{
		name: "side",
		type: '"top" | "bottom"',
		description:
			'Direction the bar slides in from. "top" slides down, "bottom" slides up. Default: "top".',
	},
	{
		name: "blockNavigation",
		type: "boolean",
		description:
			"When true, blocks browser back/forward and tab close while the form has unsaved changes. Equivalent to calling useUnsavedChangesNavigationGuard() in the same component. Default: false.",
	},
	{
		name: "className",
		type: "string",
		description: "Additional classes for the outer wrapper.",
	},
]

const hookProps: DocProp[] = [
	{
		name: "formId",
		type: "string",
		required: true,
		description: "Unique ID for this form. Prevents collisions if multiple forms are mounted.",
	},
	{
		name: "isDirty",
		type: "boolean",
		required: true,
		description: "Whether the form has unsaved changes. The bar is visible only when this is true.",
	},
	{
		name: "onSave",
		type: "() => void | Promise<void>",
		required: true,
		description:
			"Called when the user clicks the save button. Call allowNextNavigation() before programmatic navigation.",
	},
	{
		name: "onDiscard",
		type: "() => void",
		required: true,
		description:
			"Called when the user clicks the discard button. allowNextNavigation() is automatically called before this runs.",
	},
	{
		name: "isSaving",
		type: "boolean",
		description: "Shows a spinner on the save button and disables both actions.",
	},
	{
		name: "message",
		type: "string",
		description: 'Message shown in the bar. Default: "Unsaved changes".',
	},
	{
		name: "saveLabel",
		type: "string",
		description: 'Save button label. Default: "Save".',
	},
	{
		name: "discardLabel",
		type: "string",
		description: 'Discard button label. Default: "Discard".',
	},
]

// ── Page ────────────────────────────────────────────────────────────────────

function UnsavedChangesBarPage() {
	const { highlighted } = Route.useLoaderData()
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="Unsaved Changes Bar"
			subtitle="A floating action bar that appears when a form has unsaved changes. Provides Save / Discard actions and optionally blocks accidental navigation."
			toc={toc}
		>
			<DocHero>
				<DemoWrapper />
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExampleClient
					title="Full setup"
					description="Provider in layout, bar with blockNavigation in the top bar, hook in the form component."
					code={examples[0].code}
					highlightedCode={html("basic")}
				>
					<DemoWrapper />
				</DocExampleClient>

				<DocExampleClient
					title="Bottom placement"
					description='Use side="bottom" when placing the bar at the bottom of the screen — it slides up on enter instead of down.'
					code={examples[1].code}
					highlightedCode={html("bottom")}
				>
					<DemoWrapper side="bottom" />
				</DocExampleClient>

				<DocExampleClient
					title="Custom labels"
					description="Override the default message and button labels to match your entity or locale."
					code={examples[2].code}
					highlightedCode={html("custom-labels")}
				>
					<DemoWrapper />
				</DocExampleClient>
			</DocSection>

			<DocSection id="setup" title="Setup">
				<ol className="list-decimal list-inside space-y-2 text-sm text-fg-muted">
					<li>
						Wrap your app (or the relevant layout) with{" "}
						<code className="text-fg">UnsavedChangesProvider</code>.
					</li>
					<li>
						Place <code className="text-fg">{"<UnsavedChangesBar blockNavigation />"}</code> in your
						top bar or bottom bar. The <code className="text-fg">blockNavigation</code> prop blocks
						browser back/forward and tab close automatically — no separate hook needed. Use{" "}
						<code className="text-fg">side="bottom"</code> if placing it at the bottom.
					</li>
					<li>
						Call <code className="text-fg">useUnsavedChanges()</code> in any form component. The bar
						appears automatically when <code className="text-fg">isDirty</code> is true and
						disappears on save or discard.
					</li>
					<li>
						Before programmatic navigation after a successful save, call{" "}
						<code className="text-fg">allowNextNavigation()</code> (returned by the hook) so the
						navigation guard doesn't block the redirect.
					</li>
				</ol>
			</DocSection>

			<DocSection id="bar-props" title="UnsavedChangesBar Props">
				<DocPropsTable props={barProps} />
			</DocSection>

			<DocSection id="hook-options" title="useUnsavedChanges Options">
				<DocPropsTable props={hookProps} />
			</DocSection>

			<DocSection id="best-practices" title="Best Practices">
				<ul className="list-disc list-inside space-y-2 text-sm text-fg-muted">
					<li>
						Prefer <code className="text-fg">blockNavigation</code> on the bar over calling{" "}
						<code className="text-fg">useUnsavedChangesNavigationGuard()</code> separately — it's
						one less thing to wire up.
					</li>
					<li>
						Always call <code className="text-fg">allowNextNavigation()</code> before{" "}
						<code className="text-fg">router.push()</code> after a successful save, otherwise the
						navigation guard will call <code className="text-fg">history.back()</code> to undo the
						redirect.
					</li>
					<li>
						<code className="text-fg">onDiscard</code> gets{" "}
						<code className="text-fg">allowNextNavigation()</code> called automatically — no need to
						call it yourself in that callback.
					</li>
					<li>
						One form at a time — only one registered form is displayed. If multiple forms mount
						simultaneously, the last one to call <code className="text-fg">useUnsavedChanges</code>{" "}
						wins.
					</li>
				</ul>
			</DocSection>
		</DocPage>
	)
}
