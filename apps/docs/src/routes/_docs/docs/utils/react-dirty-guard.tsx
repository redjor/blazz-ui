"use client"

import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { type DocProp, DocPropsTable } from "~/components/docs/doc-props-table"
import { DocRelated } from "~/components/docs/doc-related"
import { DocSection } from "~/components/docs/doc-section"
import { highlightCode } from "~/lib/highlight-code"
import { Alert, AlertAction, AlertTitle } from "@blazz/ui/components/ui/alert"
import { Button } from "@blazz/ui"

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "headless", title: "Headless" },
	{ id: "rhf-adapter", title: "React Hook Form" },
	{ id: "use-is-dirty", title: "useIsDirty" },
	{ id: "options-props", title: "useDirtyGuard Options" },
	{ id: "state-props", title: "DirtyGuardState" },
	{ id: "bar-props", title: "DirtyGuardBar Props" },
	{ id: "rhf-props", title: "useDirtyGuardRHF Options" },
	{ id: "limitations", title: "Known Limitations" },
	{ id: "related", title: "Related" },
]

const examples = [
	{
		key: "styled",
		code: `import { useDirtyGuard } from "react-dirty-guard"
import { DirtyGuardBar } from "react-dirty-guard/bar"

function MyForm() {
  const guard = useDirtyGuard({
    isDirty: form.formState.isDirty,
    onSave: form.handleSubmit(onSubmit),
    onDiscard: () => form.reset(),
  })

  return (
    <>
      <DirtyGuardBar {...guard} position="bottom" />
      <form>{/* ... */}</form>
    </>
  )
}`,
	},
	{
		key: "headless",
		code: `import { useDirtyGuard } from "react-dirty-guard"
import { Alert, AlertAction, AlertTitle } from "@blazz/ui/components/ui/alert"
import { Button } from "@blazz/ui"

function MyForm() {
  const [isDirty, setIsDirty] = useState(false)

  const guard = useDirtyGuard({
    isDirty,
    onSave: async () => { await saveData(); setIsDirty(false) },
    onDiscard: () => setIsDirty(false),
  })

  return (
    <form>
      {guard.isBlocking && (
        <Alert>
          <AlertTitle>You have unsaved changes</AlertTitle>
          <AlertAction className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={guard.discard}>
              Discard
            </Button>
            <Button size="sm" onClick={guard.save} disabled={guard.isSaving}>
              {guard.isSaving ? "Saving…" : "Save"}
            </Button>
          </AlertAction>
        </Alert>
      )}
      {/* form fields */}
    </form>
  )
}`,
	},
	{
		key: "rhf",
		code: `import { useForm } from "react-hook-form"
import { useDirtyGuardRHF } from "react-dirty-guard/adapters/react-hook-form"
import { DirtyGuardBar } from "react-dirty-guard/bar"

function MyForm() {
  const form = useForm({ defaultValues: { name: "" } })
  const guard = useDirtyGuardRHF({
    form,
    onSave: form.handleSubmit(onSubmit),
  })

  return (
    <>
      <DirtyGuardBar {...guard} />
      <form>{/* ... */}</form>
    </>
  )
}`,
	},
	{
		key: "useIsDirty",
		code: `import { useIsDirty, useDirtyGuard } from "react-dirty-guard"
import { DirtyGuardBar } from "react-dirty-guard/bar"

function MyForm() {
  const { isDirty, markDirty, markClean } = useIsDirty()
  const guard = useDirtyGuard({
    isDirty,
    onSave: () => save(),
    onDiscard: markClean,
  })

  return (
    <>
      <DirtyGuardBar {...guard} />
      <input onChange={() => markDirty()} />
    </>
  )
}`,
	},
	{
		key: "disabled",
		code: `const guard = useDirtyGuard({
  isDirty: true,
  onSave: handleSave,
  disabled: isReadOnly,        // disables all blocking
  blockRouteNavigation: false, // disables popstate only, keeps beforeunload
})`,
	},
	{
		key: "custom-adapter",
		code: `import { useDirtyGuard } from "react-dirty-guard"

// Formik adapter — 5 lines
function useDirtyGuardFormik(formik) {
  return useDirtyGuard({
    isDirty: formik.dirty,
    isSaving: formik.isSubmitting,
    onSave: () => formik.submitForm(),
    onDiscard: () => formik.resetForm(),
  })
}`,
	},
] as const

export const Route = createFileRoute("/_docs/docs/utils/react-dirty-guard")({
	loader: async () => {
		const highlighted = await Promise.all(
			examples.map(async (ex) => ({
				key: ex.key,
				html: await highlightCode({ data: { code: ex.code } }),
			}))
		)
		return { highlighted }
	},
	component: ReactDirtyGuardPage,
})

// ── Demos (visual only — no useDirtyGuard to avoid history/popstate conflicts with TanStack Router) ──

function MockBar({ position = "top", isSaving = false, onSave, onDiscard }: {
	position?: "top" | "bottom"
	isSaving?: boolean
	onSave: () => void
	onDiscard: () => void
}) {
	const positionClasses = position === "top" ? "top-0 left-0 right-0 border-b" : "bottom-0 left-0 right-0 border-t"
	return (
		<div className={`absolute z-50 flex items-center gap-2 border-zinc-200 bg-white/80 px-3 py-1.5 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80 ${positionClasses}`}>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-3.5 shrink-0 text-amber-500" aria-hidden="true">
				<path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
			</svg>
			<span className="min-w-0 flex-1 truncate text-xs font-medium text-zinc-900 dark:text-zinc-100">You have unsaved changes</span>
			<div className="flex shrink-0 items-center gap-1">
				<button type="button" onClick={onDiscard} disabled={isSaving} className="rounded-md px-2 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-100 disabled:opacity-50 dark:text-zinc-400 dark:hover:bg-zinc-800">Discard</button>
				<button type="button" onClick={onSave} disabled={isSaving} className="inline-flex items-center gap-1 rounded-md bg-zinc-900 px-2 py-1 text-xs font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200">
					{isSaving && <svg className="size-3 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" /><path fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" className="opacity-75" /></svg>}
					Save
				</button>
			</div>
		</div>
	)
}

function DemoButton({ isDirty, isSaving, onClick }: { isDirty: boolean; isSaving: boolean; onClick: () => void }) {
	return (
		<button
			type="button"
			onClick={onClick}
			disabled={isSaving}
			className="rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
		>
			{isDirty ? "Form is dirty — click to reset" : "Simulate form edit"}
		</button>
	)
}

function StyledDemo() {
	const [isDirty, setIsDirty] = useState(false)
	const [isSaving, setIsSaving] = useState(false)

	const handleSave = async () => {
		setIsSaving(true)
		await new Promise((r) => setTimeout(r, 1200))
		setIsSaving(false)
		setIsDirty(false)
	}

	return (
		<div className="relative w-full min-h-[120px]">
			{isDirty && <MockBar position="top" isSaving={isSaving} onSave={handleSave} onDiscard={() => setIsDirty(false)} />}
			<div className="flex items-center justify-center pt-16">
				<DemoButton isDirty={isDirty} isSaving={isSaving} onClick={() => setIsDirty(!isDirty)} />
			</div>
		</div>
	)
}

function BottomDemo() {
	const [isDirty, setIsDirty] = useState(false)
	const [isSaving, setIsSaving] = useState(false)

	const handleSave = async () => {
		setIsSaving(true)
		await new Promise((r) => setTimeout(r, 1200))
		setIsSaving(false)
		setIsDirty(false)
	}

	return (
		<div className="relative w-full min-h-[120px]">
			<div className="flex items-center justify-center pb-16">
				<DemoButton isDirty={isDirty} isSaving={isSaving} onClick={() => setIsDirty(!isDirty)} />
			</div>
			{isDirty && <MockBar position="bottom" isSaving={isSaving} onSave={handleSave} onDiscard={() => setIsDirty(false)} />}
		</div>
	)
}

function HeadlessDemo() {
	const [isDirty, setIsDirty] = useState(false)
	const [isSaving, setIsSaving] = useState(false)

	const handleSave = async () => {
		setIsSaving(true)
		await new Promise((r) => setTimeout(r, 1200))
		setIsSaving(false)
		setIsDirty(false)
	}

	return (
		<div className="w-full space-y-3">
			{isDirty && (
				<Alert>
					<AlertTitle>You have unsaved changes</AlertTitle>
					<AlertAction className="flex items-center gap-2">
						<Button variant="ghost" size="sm" onClick={() => setIsDirty(false)}>
							Discard
						</Button>
						<Button size="sm" onClick={handleSave} disabled={isSaving}>
							{isSaving ? "Saving…" : "Save"}
						</Button>
					</AlertAction>
				</Alert>
			)}
			<div className="flex justify-center">
				<DemoButton isDirty={isDirty} isSaving={isSaving} onClick={() => setIsDirty(!isDirty)} />
			</div>
		</div>
	)
}

// ── Props tables ────────────────────────────────────────────────────────────

const optionsProps: DocProp[] = [
	{
		name: "isDirty",
		type: "boolean",
		required: true,
		description: "Whether the form has unsaved changes.",
	},
	{
		name: "isSaving",
		type: "boolean",
		default: "false",
		description: "Whether a save is in progress.",
	},
	{
		name: "onSave",
		type: "() => void | Promise<void>",
		description:
			"Called when user clicks Save. If it returns a rejecting Promise, isSaving resets to false and the guard stays active.",
	},
	{
		name: "onDiscard",
		type: "() => void",
		description: "Called when user clicks Discard.",
	},
	{
		name: "blockRouteNavigation",
		type: "boolean",
		default: "true",
		description:
			"Block in-page navigation via popstate interception. Uses a phantom history entry. Set to false if conflicting with your router.",
	},
	{
		name: "disabled",
		type: "boolean",
		default: "false",
		description:
			"Disable all blocking. Useful for conditional opt-out (e.g. read-only mode). Returns inert state with no-op callbacks.",
	},
]

const stateProps: DocProp[] = [
	{
		name: "isBlocking",
		type: "boolean",
		description: "Whether the guard UI should be visible (isDirty && !isSaving && !disabled).",
	},
	{
		name: "isShaking",
		type: "boolean",
		description: "True briefly (~500ms) when the user tries to navigate away. Use for shake animation.",
	},
	{
		name: "isSaving",
		type: "boolean",
		description: "Whether a save is in progress (external isSaving OR internal async onSave).",
	},
	{
		name: "save",
		type: "() => void | Promise<void>",
		description: "Trigger save. Manages isSaving automatically for async onSave.",
	},
	{
		name: "discard",
		type: "() => void",
		description: "Trigger discard, set navigation bypass, and call onDiscard.",
	},
	{
		name: "allowNextNavigation",
		type: "() => void",
		description:
			"One-shot bypass for the next navigation event. Call after a successful save before router.push().",
	},
]

const barProps: DocProp[] = [
	{
		name: "position",
		type: '"top" | "bottom"',
		default: '"top"',
		description: "Fixed position of the bar.",
	},
	{
		name: "saveLabel",
		type: "string",
		default: '"Save changes"',
		description: "Label for the save button.",
	},
	{
		name: "discardLabel",
		type: "string",
		default: '"Discard"',
		description: "Label for the discard button.",
	},
	{
		name: "message",
		type: "string",
		default: '"You have unsaved changes"',
		description: "Message displayed in the bar.",
	},
	{
		name: "className",
		type: "string",
		description: "Additional Tailwind classes on the outer container.",
	},
]

const rhfOptionsProps: DocProp[] = [
	{
		name: "form",
		type: "UseFormReturn<any>",
		required: true,
		description: "React Hook Form instance. isDirty and isSubmitting are read automatically.",
	},
	{
		name: "onSave",
		type: "() => void | Promise<void>",
		required: true,
		description: "Called when user clicks Save.",
	},
	{
		name: "onDiscard",
		type: "() => void",
		default: "form.reset()",
		description: "Called when user clicks Discard. Defaults to form.reset().",
	},
	{
		name: "blockRouteNavigation",
		type: "boolean",
		default: "true",
		description: "Block in-page navigation via popstate.",
	},
	{
		name: "disabled",
		type: "boolean",
		default: "false",
		description: "Disable all blocking.",
	},
]

// ── Page ────────────────────────────────────────────────────────────────────

function ReactDirtyGuardPage() {
	const { highlighted } = Route.useLoaderData()
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="react-dirty-guard"
			subtitle="Standalone package to protect users from losing unsaved form changes. Headless hook + optional styled Tailwind bar. Works with any form library."
			toc={toc}
		>
			<DocHero>
				<StyledDemo />
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExampleClient
					title="Styled bar"
					description="Drop-in notification bar with save/discard buttons. Spread the guard state directly as props."
					code={examples[0].code}
					highlightedCode={html("styled")}
				>
					<StyledDemo />
				</DocExampleClient>

				<DocExampleClient
					title="Bottom placement"
					description='Use position="bottom" to place the bar at the bottom of the screen.'
					code={examples[0].code}
					highlightedCode={html("styled")}
				>
					<BottomDemo />
				</DocExampleClient>

				<DocExampleClient
					title="Disabling the guard"
					description="Use disabled to opt-out entirely, or blockRouteNavigation: false to disable popstate blocking only."
					code={examples[4].code}
					highlightedCode={html("disabled")}
				/>
			</DocSection>

			<DocSection id="headless" title="Headless">
				<p className="text-sm text-fg-muted mb-4">
					Use <code className="text-fg">useDirtyGuard</code> without the styled bar.
					Build your own UI using the returned state — here with a <code className="text-fg">{"<Alert>"}</code> component.
				</p>
				<DocExampleClient
					title="Custom UI with Alert"
					description="The hook manages beforeunload, popstate, and shake state. You render whatever you want."
					code={examples[1].code}
					highlightedCode={html("headless")}
				>
					<HeadlessDemo />
				</DocExampleClient>
			</DocSection>

			<DocSection id="rhf-adapter" title="React Hook Form">
				<p className="text-sm text-fg-muted mb-4">
					<code className="text-fg">useDirtyGuardRHF</code> reads{" "}
					<code className="text-fg">isDirty</code>,{" "}
					<code className="text-fg">isSubmitting</code>, and{" "}
					<code className="text-fg">reset()</code> directly from the form instance.
					Import from <code className="text-fg">react-dirty-guard/adapters/react-hook-form</code>.
				</p>
				<DocExampleClient
					title="RHF adapter"
					description="No manual wiring — the adapter extracts form state automatically."
					code={examples[2].code}
					highlightedCode={html("rhf")}
				/>
				<DocExampleClient
					title="Custom adapter"
					description="Any adapter is a 5-line mapping to useDirtyGuard. Here's a Formik example."
					code={examples[5].code}
					highlightedCode={html("custom-adapter")}
				/>
			</DocSection>

			<DocSection id="use-is-dirty" title="useIsDirty">
				<p className="text-sm text-fg-muted mb-4">
					A minimal dirty-tracking hook for forms without a form library.
					Returns <code className="text-fg">isDirty</code>,{" "}
					<code className="text-fg">markDirty()</code>, and{" "}
					<code className="text-fg">markClean()</code>.
				</p>
				<DocExampleClient
					title="Zero-dependency usage"
					description="Track dirty state with plain onChange handlers."
					code={examples[3].code}
					highlightedCode={html("useIsDirty")}
				/>
			</DocSection>

			<DocSection id="options-props" title="useDirtyGuard Options">
				<DocPropsTable props={optionsProps} />
			</DocSection>

			<DocSection id="state-props" title="DirtyGuardState">
				<DocPropsTable props={stateProps} />
			</DocSection>

			<DocSection id="bar-props" title="DirtyGuardBar Props">
				<p className="text-sm text-fg-muted mb-4">
					Extends <code className="text-fg">DirtyGuardState</code> — spread the hook
					return value directly: <code className="text-fg">{"<DirtyGuardBar {...guard} />"}</code>
				</p>
				<DocPropsTable props={barProps} />
			</DocSection>

			<DocSection id="rhf-props" title="useDirtyGuardRHF Options">
				<DocPropsTable props={rhfOptionsProps} />
			</DocSection>

			<DocSection id="limitations" title="Known Limitations">
				<ul className="list-disc list-inside space-y-2 text-sm text-fg-muted">
					<li>
						<strong className="text-fg">Phantom history entry</strong> —{" "}
						<code className="text-fg">popstate</code> blocking works by pushing a phantom
						entry to <code className="text-fg">history</code>. This can conflict with SPA
						routers that also manipulate history.
					</li>
					<li>
						<strong className="text-fg">Double-tap back</strong> — Rapidly pressing back
						twice may slip through the guard.
					</li>
					<li>
						<strong className="text-fg">Mobile Safari swipe-back</strong> — The swipe-back
						gesture on iOS is inconsistent with <code className="text-fg">popstate</code>{" "}
						interception.
					</li>
					<li>
						<strong className="text-fg">beforeunload message</strong> — Modern browsers
						ignore custom messages and show a generic prompt instead.
					</li>
					<li>
						Set <code className="text-fg">blockRouteNavigation: false</code> if you
						experience router conflicts. Tab close/reload blocking works independently and
						is always reliable.
					</li>
				</ul>
			</DocSection>

			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{
							title: "Unsaved Changes Bar",
							description: "The @blazz/ui integrated version with context provider.",
							href: "/docs/utils/unsaved-changes-bar",
						},
						{
							title: "Form Field",
							description: "Composable form field with react-hook-form integration.",
							href: "/docs/components/patterns/form-field",
						},
					]}
				/>
			</DocSection>
		</DocPage>
	)
}
