"use client"

import * as React from "react"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CellNavigationOptions {
	/** Enable cell navigation */
	enabled: boolean
	/** Ordered list of visible row IDs */
	rowIds: string[]
	/** Ordered list of visible column IDs (navigable ones) */
	columnIds: string[]
}

interface CellPosition {
	rowId: string
	columnId: string
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Manages cell-level focus and keyboard navigation for the DataTable.
 *
 * Navigation (when focused but not editing):
 * - Arrow keys move the focus ring between cells
 * - Tab / Shift+Tab move to next/prev cell (wrapping rows)
 * - Enter / F2 enter edit mode on the active cell
 * - Escape clears the active cell
 * - Any printable character enters edit mode (type-to-edit)
 *
 * Editing mode:
 * - Escape exits edit mode (keeps focus on the cell)
 * - Tab moves to the next editable cell
 * - Enter confirms and moves down one row
 */
export function useCellNavigation({ enabled, rowIds, columnIds }: CellNavigationOptions) {
	const [activeCell, setActiveCell] = React.useState<CellPosition | null>(null)
	const [isEditing, setIsEditing] = React.useState(false)

	// Reset active cell when it becomes invalid (e.g. row removed, column hidden)
	React.useEffect(() => {
		if (!activeCell) return
		const rowValid = rowIds.includes(activeCell.rowId)
		const colValid = columnIds.includes(activeCell.columnId)
		if (!rowValid || !colValid) {
			setActiveCell(null)
			setIsEditing(false)
		}
	}, [activeCell, rowIds, columnIds])

	const handleKeyDown = React.useCallback(
		(e: React.KeyboardEvent) => {
			if (!enabled || !activeCell) return

			const rowIdx = rowIds.indexOf(activeCell.rowId)
			const colIdx = columnIds.indexOf(activeCell.columnId)

			if (rowIdx === -1 || colIdx === -1) return

			// --- Editing mode: limited key handling ---
			if (isEditing) {
				if (e.key === "Escape") {
					e.preventDefault()
					setIsEditing(false)
				} else if (e.key === "Tab") {
					e.preventDefault()
					setIsEditing(false)
					const nextColIdx = e.shiftKey ? colIdx - 1 : colIdx + 1
					if (nextColIdx >= 0 && nextColIdx < columnIds.length) {
						setActiveCell({ rowId: activeCell.rowId, columnId: columnIds[nextColIdx] })
					}
				} else if (e.key === "Enter") {
					e.preventDefault()
					setIsEditing(false)
					const nextRowIdx = rowIdx + 1
					if (nextRowIdx < rowIds.length) {
						setActiveCell({ rowId: rowIds[nextRowIdx], columnId: activeCell.columnId })
					}
				}
				return
			}

			// --- Focus mode (not editing) ---
			switch (e.key) {
				case "ArrowUp":
					e.preventDefault()
					if (rowIdx > 0) {
						setActiveCell({ rowId: rowIds[rowIdx - 1], columnId: activeCell.columnId })
					}
					break

				case "ArrowDown":
					e.preventDefault()
					if (rowIdx < rowIds.length - 1) {
						setActiveCell({ rowId: rowIds[rowIdx + 1], columnId: activeCell.columnId })
					}
					break

				case "ArrowLeft":
					e.preventDefault()
					if (colIdx > 0) {
						setActiveCell({ rowId: activeCell.rowId, columnId: columnIds[colIdx - 1] })
					}
					break

				case "ArrowRight":
					e.preventDefault()
					if (colIdx < columnIds.length - 1) {
						setActiveCell({ rowId: activeCell.rowId, columnId: columnIds[colIdx + 1] })
					}
					break

				case "Tab":
					e.preventDefault()
					if (e.shiftKey) {
						// Shift+Tab: prev cell (wrap to end of previous row)
						if (colIdx > 0) {
							setActiveCell({ rowId: activeCell.rowId, columnId: columnIds[colIdx - 1] })
						} else if (rowIdx > 0) {
							setActiveCell({
								rowId: rowIds[rowIdx - 1],
								columnId: columnIds[columnIds.length - 1],
							})
						}
					} else {
						// Tab: next cell (wrap to start of next row)
						if (colIdx < columnIds.length - 1) {
							setActiveCell({ rowId: activeCell.rowId, columnId: columnIds[colIdx + 1] })
						} else if (rowIdx < rowIds.length - 1) {
							setActiveCell({ rowId: rowIds[rowIdx + 1], columnId: columnIds[0] })
						}
					}
					break

				case "Enter":
				case "F2":
					e.preventDefault()
					setIsEditing(true)
					break

				case "Escape":
					e.preventDefault()
					setActiveCell(null)
					break

				default:
					// Printable character -> enter edit mode (type-to-edit)
					if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
						setIsEditing(true)
						// Don't prevent default so the character gets typed into the input
					}
					break
			}
		},
		[enabled, activeCell, isEditing, rowIds, columnIds]
	)

	const focusCell = React.useCallback((rowId: string, columnId: string) => {
		setActiveCell({ rowId, columnId })
		setIsEditing(false)
	}, [])

	const startEditing = React.useCallback(() => {
		setIsEditing(true)
	}, [])

	const stopEditing = React.useCallback(() => {
		setIsEditing(false)
	}, [])

	return {
		activeCell,
		isEditing,
		handleKeyDown,
		focusCell,
		startEditing,
		stopEditing,
		setActiveCell,
	}
}
