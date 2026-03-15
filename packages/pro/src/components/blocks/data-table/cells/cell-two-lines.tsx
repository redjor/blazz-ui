"use client"

export interface CellTwoLinesProps {
	/** Primary text (top line) */
	main: string
	/** Secondary text (bottom line) */
	sub: string
}

/**
 * Renders two stacked text lines: a primary and a muted secondary.
 */
export function CellTwoLines({ main, sub }: CellTwoLinesProps) {
	if (!main && !sub) {
		return <span className="text-fg-muted">&mdash;</span>
	}

	return (
		<div className="flex flex-col">
			<span className="text-body-md text-fg">{main}</span>
			<span className="text-body-sm text-fg-muted">{sub}</span>
		</div>
	)
}
