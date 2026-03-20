"use client"

import { Button } from "@blazz/ui"
import { Alert, AlertAction, AlertTitle } from "@blazz/ui/components/ui/alert"
import { useState } from "react"

// ── Mock Bar (visual only) ──────────────────────────────────────────────────

function MockBar({
	position = "top",
	isSaving = false,
	onSave,
	onDiscard,
}: {
	position?: "top" | "bottom"
	isSaving?: boolean
	onSave: () => void
	onDiscard: () => void
}) {
	const positionClasses =
		position === "top" ? "top-0 left-0 right-0 border-b" : "bottom-0 left-0 right-0 border-t"
	return (
		<div
			className={`absolute z-50 flex items-center gap-2 border-zinc-200 bg-white/80 px-3 py-1.5 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80 ${positionClasses}`}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
				fill="currentColor"
				className="size-3.5 shrink-0 text-amber-500"
				aria-hidden="true"
			>
				<path
					fillRule="evenodd"
					d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 9a1 1 0 100-2 1 1 0 000 2z"
					clipRule="evenodd"
				/>
			</svg>
			<span className="min-w-0 flex-1 truncate text-xs font-medium text-zinc-900 dark:text-zinc-100">
				You have unsaved changes
			</span>
			<div className="flex shrink-0 items-center gap-1">
				<button
					type="button"
					onClick={onDiscard}
					disabled={isSaving}
					className="rounded-md px-2 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-100 disabled:opacity-50 dark:text-zinc-400 dark:hover:bg-zinc-800"
				>
					Discard
				</button>
				<button
					type="button"
					onClick={onSave}
					disabled={isSaving}
					className="inline-flex items-center gap-1 rounded-md bg-zinc-900 px-2 py-1 text-xs font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
				>
					{isSaving && (
						<svg className="size-3 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
							<circle
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								strokeWidth="4"
								className="opacity-25"
							/>
							<path
								fill="currentColor"
								d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
								className="opacity-75"
							/>
						</svg>
					)}
					Save
				</button>
			</div>
		</div>
	)
}

function DemoButton({
	isDirty,
	isSaving,
	onClick,
}: {
	isDirty: boolean
	isSaving: boolean
	onClick: () => void
}) {
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

// ── Exported Demos ──────────────────────────────────────────────────────────

export function StyledDemo() {
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
			{isDirty && (
				<MockBar
					position="top"
					isSaving={isSaving}
					onSave={handleSave}
					onDiscard={() => setIsDirty(false)}
				/>
			)}
			<div className="flex items-center justify-center pt-16">
				<DemoButton isDirty={isDirty} isSaving={isSaving} onClick={() => setIsDirty(!isDirty)} />
			</div>
		</div>
	)
}

export function BottomDemo() {
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
			{isDirty && (
				<MockBar
					position="bottom"
					isSaving={isSaving}
					onSave={handleSave}
					onDiscard={() => setIsDirty(false)}
				/>
			)}
		</div>
	)
}

export function HeadlessDemo() {
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
							{isSaving ? "Saving..." : "Save"}
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
