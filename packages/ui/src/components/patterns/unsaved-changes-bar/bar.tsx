"use client"

import { AlertCircle, Loader2 } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { cn } from "../../../lib/utils"
import { Button } from "../../ui/button"
import { useUnsavedChangesContext } from "./context"
import { useUnsavedChangesNavigationGuard } from "./use-navigation-guard"

export interface UnsavedChangesBarProps {
	className?: string
	/**
	 * Direction the bar slides in from.
	 * - "top" → slides down (use when the bar is placed at the top of the screen)
	 * - "bottom" → slides up (use when the bar is placed at the bottom of the screen)
	 * @default "top"
	 */
	side?: "top" | "bottom"
	/**
	 * When true, activates the navigation guard: blocks browser back/forward and
	 * tab close while the form has unsaved changes.
	 * Equivalent to calling `useUnsavedChangesNavigationGuard()` in the same component.
	 * @default false
	 */
	blockNavigation?: boolean
}

/** Rendered conditionally so the hook is always called at the top level of a component */
function NavigationGuard() {
	useUnsavedChangesNavigationGuard()
	return null
}

export function UnsavedChangesBar({
	className,
	side = "top",
	blockNavigation = false,
}: UnsavedChangesBarProps) {
	const { state, dispatch } = useUnsavedChangesContext()
	const { isDirty, message, onSave, onDiscard, saveLabel, discardLabel, isSaving, isShaking } =
		state

	const visible = isDirty && (onSave !== null || onDiscard !== null)
	const yOffset = side === "top" ? -8 : 8

	return (
		<>
			{blockNavigation && <NavigationGuard />}
			<AnimatePresence mode="wait">
				{visible && (
					<motion.div
						key="unsaved-changes-bar"
						initial={{ opacity: 0, y: yOffset, scale: 0.98 }}
						animate={{
							opacity: 1,
							y: 0,
							scale: 1,
							x: isShaking ? [0, -8, 8, -6, 6, -3, 3, 0] : 0,
						}}
						exit={{ opacity: 0, y: yOffset, scale: 0.98 }}
						transition={{
							duration: 0.15,
							ease: [0.42, 0, 0.58, 1],
							x: isShaking ? { duration: 0.45, ease: "easeOut" } : undefined,
						}}
						onAnimationComplete={() => {
							if (isShaking) dispatch({ type: "CLEAR_SHAKE" })
						}}
						className={cn("w-full", className)}
					>
						<div className="flex items-center gap-2.5 rounded-lg border border-edge bg-muted px-3 py-1.5 shadow-sm w-full">
							<AlertCircle className="size-3.5 shrink-0 text-fg-muted" />
							<span className="flex-1 truncate text-xs font-medium text-fg">{message}</span>
							<div className="flex shrink-0 items-center gap-1">
								<Button
									type="button"
									variant="ghost"
									size="sm"
									onClick={onDiscard ?? undefined}
									disabled={isSaving}
								>
									{discardLabel}
								</Button>
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={onSave ?? undefined}
									disabled={isSaving}
								>
									{isSaving ? (
										<>
											<Loader2 className="mr-1.5 size-3.5 animate-spin" />
											{saveLabel}
										</>
									) : (
										saveLabel
									)}
								</Button>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	)
}
