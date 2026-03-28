"use client"

import { Button } from "@blazz/ui"
import { UnsavedChangesBar, UnsavedChangesProvider, useUnsavedChanges } from "@blazz/ui/components/patterns/unsaved-changes-bar"
import { useState } from "react"

function InnerDemo({ isDirty, isSaving, side, onDirty, onSaving }: { isDirty: boolean; isSaving: boolean; side?: "top" | "bottom"; onDirty: (v: boolean) => void; onSaving: (v: boolean) => void }) {
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
			<Button variant={isDirty ? "outline" : "default"} size="sm" onClick={() => onDirty(!isDirty)} disabled={isSaving}>
				{isDirty ? "Form is dirty — click to reset" : "Simulate form edit"}
			</Button>
		</div>
	)
}

export function DemoWrapper({ side }: { side?: "top" | "bottom" }) {
	const [isDirty, setIsDirty] = useState(false)
	const [isSaving, setIsSaving] = useState(false)

	return (
		<UnsavedChangesProvider>
			<InnerDemo isDirty={isDirty} isSaving={isSaving} side={side} onDirty={setIsDirty} onSaving={setIsSaving} />
		</UnsavedChangesProvider>
	)
}
