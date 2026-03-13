"use client"

import { useCallback, useRef } from "react"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CellEdit {
	rowId: string
	columnId: string
	previousValue: unknown
	newValue: unknown
	timestamp: number
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Manages an undo/redo history stack for cell edits.
 *
 * - `push(edit)` records a new edit (truncates any redo entries).
 * - `undo()` returns the last edit so the caller can revert the value.
 * - `redo()` returns the next edit so the caller can re-apply the value.
 *
 * The stack is capped at `maxSize` entries (default 50).
 * Uses refs so the history is mutable and does not cause re-renders.
 */
export function useEditHistory(maxSize = 50) {
	const historyRef = useRef<CellEdit[]>([])
	const pointerRef = useRef(-1)

	const push = useCallback(
		(edit: Omit<CellEdit, "timestamp">) => {
			// Truncate any redo entries after the current pointer
			historyRef.current = historyRef.current.slice(0, pointerRef.current + 1)

			historyRef.current.push({ ...edit, timestamp: Date.now() })

			// Trim to max size (keep the most recent entries)
			if (historyRef.current.length > maxSize) {
				historyRef.current = historyRef.current.slice(-maxSize)
			}

			pointerRef.current = historyRef.current.length - 1
		},
		[maxSize]
	)

	const undo = useCallback((): CellEdit | null => {
		if (pointerRef.current < 0) return null
		const edit = historyRef.current[pointerRef.current]
		pointerRef.current -= 1
		return edit
	}, [])

	const redo = useCallback((): CellEdit | null => {
		if (pointerRef.current >= historyRef.current.length - 1) return null
		pointerRef.current += 1
		return historyRef.current[pointerRef.current]
	}, [])

	const canUndo = useCallback(() => pointerRef.current >= 0, [])

	const canRedo = useCallback(() => pointerRef.current < historyRef.current.length - 1, [])

	const clear = useCallback(() => {
		historyRef.current = []
		pointerRef.current = -1
	}, [])

	return { push, undo, redo, canUndo, canRedo, clear }
}
