"use client"

import { TopBar } from "@blazz/ui/components/patterns/top-bar"
import type { AppTopBarState } from "./types"

export function AppFrameTopBar({ state }: { state: AppTopBarState }) {
	if (!state.breadcrumbs) return null

	return (
		<TopBar
			className="bg-surface-1 border-b border-edge-subtle"
			left={
				<>
					<TopBar.Breadcrumbs items={state.breadcrumbs} />
					{state.actions}
				</>
			}
		/>
	)
}
