"use client"

import { useCallback, useEffect } from "react"
import { useUnsavedChangesContext } from "./context"

export interface UseUnsavedChangesOptions {
	/** Unique ID for this form — prevents collisions if multiple forms are mounted */
	formId: string
	/** Whether the form has unsaved changes (e.g. react-hook-form `formState.isDirty`) */
	isDirty: boolean
	/** Whether the form is currently saving (shows spinner on save button) */
	isSaving?: boolean
	/** Called when the user clicks the save button in the bar */
	onSave: () => void | Promise<void>
	/**
	 * Called when the user clicks the discard button in the bar.
	 * `allowNextNavigation()` is automatically called before this runs,
	 * so navigation guards won't block the discard action.
	 */
	onDiscard: () => void
	/** Message shown in the bar. Default: "Unsaved changes" */
	message?: string
	/** Save button label. Default: "Save" */
	saveLabel?: string
	/** Discard button label. Default: "Discard" */
	discardLabel?: string
}

export interface UseUnsavedChangesReturn {
	/**
	 * Call this before programmatically navigating away after a successful save.
	 * Without it, the navigation guard will call `history.back()` to undo the
	 * extra history entry it pushed to intercept browser back-button.
	 *
	 * @example
	 * const { allowNextNavigation } = useUnsavedChanges({ ... })
	 *
	 * async function onSubmit(data) {
	 *   await saveData(data)
	 *   allowNextNavigation()
	 *   router.push("/success")
	 * }
	 */
	allowNextNavigation: () => void
}

export function useUnsavedChanges({
	formId,
	isDirty,
	isSaving = false,
	onSave,
	onDiscard,
	message = "Unsaved changes",
	saveLabel = "Save",
	discardLabel = "Discard",
}: UseUnsavedChangesOptions): UseUnsavedChangesReturn {
	const { dispatch } = useUnsavedChangesContext()

	const allowNextNavigation = useCallback(() => {
		dispatch({ type: "ALLOW_NAVIGATION" })
	}, [dispatch])

	useEffect(() => {
		const wrappedDiscard = () => {
			dispatch({ type: "ALLOW_NAVIGATION" })
			onDiscard()
		}

		dispatch({
			type: "REGISTER",
			payload: {
				formId,
				isDirty,
				message,
				onSave,
				onDiscard: wrappedDiscard,
				saveLabel,
				discardLabel,
				isSaving,
			},
		})

		return () => {
			dispatch({ type: "CLEAR", payload: { formId } })
		}
	}, [
		formId,
		isDirty,
		isSaving,
		message,
		saveLabel,
		discardLabel,
		onSave,
		onDiscard,
		dispatch,
	])

	return { allowNextNavigation }
}
