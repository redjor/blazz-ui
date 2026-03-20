"use client"

import {
	Children,
	createContext,
	isValidElement,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react"
import { cn } from "@blazz/ui"
import { withProGuard } from "../../lib/with-pro-guard"

// ── Context ──────────────────────────────────────────────────────────────────

interface SplitViewContextValue {
	ratio: number
}

const SplitViewContext = createContext<SplitViewContextValue | null>(null)

// ── Props ────────────────────────────────────────────────────────────────────

export interface SplitViewProps {
	/** Initial width ratio of the master panel (0–1). @default 0.4 */
	defaultRatio?: number
	/** Minimum width ratio. @default 0.25 */
	minRatio?: number
	/** Maximum width ratio. @default 0.6 */
	maxRatio?: number
	className?: string
	children: React.ReactNode
}

export interface SplitViewPanelProps {
	className?: string
	children: React.ReactNode
}

// ── SplitView (root) ─────────────────────────────────────────────────────────

function SplitViewBase({
	defaultRatio = 0.4,
	minRatio = 0.25,
	maxRatio = 0.6,
	className,
	children,
}: SplitViewProps) {
	const [ratio, setRatio] = useState(defaultRatio)
	const containerRef = useRef<HTMLDivElement>(null)
	const isDragging = useRef(false)
	const [dragging, setDragging] = useState(false)

	const handlePointerDown = useCallback((e: React.PointerEvent) => {
		e.preventDefault()
		;(e.target as HTMLElement).setPointerCapture(e.pointerId)
		isDragging.current = true
		setDragging(true)
	}, [])

	const handlePointerMove = useCallback(
		(e: React.PointerEvent) => {
			if (!isDragging.current || !containerRef.current) return
			const rect = containerRef.current.getBoundingClientRect()
			const newRatio = (e.clientX - rect.left) / rect.width
			setRatio(Math.max(minRatio, Math.min(maxRatio, newRatio)))
		},
		[minRatio, maxRatio],
	)

	const handlePointerUp = useCallback(() => {
		isDragging.current = false
		setDragging(false)
	}, [])

	useEffect(() => {
		if (dragging) {
			document.body.style.cursor = "col-resize"
			document.body.style.userSelect = "none"
		} else {
			document.body.style.cursor = ""
			document.body.style.userSelect = ""
		}
		return () => {
			document.body.style.cursor = ""
			document.body.style.userSelect = ""
		}
	}, [dragging])

	// Separate Master and Detail from children
	let masterNode: React.ReactNode = null
	let detailNode: React.ReactNode = null

	Children.forEach(children, (child) => {
		if (!isValidElement(child)) return
		if (child.type === Master) masterNode = child
		if (child.type === Detail) detailNode = child
	})

	return (
		<SplitViewContext.Provider value={{ ratio }}>
			<div
				ref={containerRef}
				className={cn("flex h-full flex-col overflow-hidden md:flex-row", className)}
				onPointerMove={handlePointerMove}
				onPointerUp={handlePointerUp}
			>
				{/* Master panel */}
				{masterNode}

				{/* Resize handle — desktop only */}
				<div
					className={cn(
						"hidden w-1 shrink-0 cursor-col-resize items-center justify-center transition-colors duration-150 ease-out md:flex",
						dragging ? "bg-surface-3" : "hover:bg-surface-3",
					)}
					onPointerDown={handlePointerDown}
				>
					<div className="h-8 w-0.5 rounded-full bg-border" />
				</div>

				{/* Detail panel */}
				{detailNode}
			</div>
		</SplitViewContext.Provider>
	)
}

// ── Master ───────────────────────────────────────────────────────────────────

function Master({ className, children }: SplitViewPanelProps) {
	const ctx = useContext(SplitViewContext)
	if (!ctx) throw new Error("SplitView.Master must be used within <SplitView>")

	return (
		<div
			className={cn("min-h-0 shrink-0 overflow-y-auto max-md:!w-full", className)}
			style={{ width: `${ctx.ratio * 100}%` }}
		>
			{children}
		</div>
	)
}
Master.displayName = "SplitView.Master"

// ── Detail ───────────────────────────────────────────────────────────────────

function Detail({ className, children }: SplitViewPanelProps) {
	return (
		<div className={cn("min-h-0 min-w-0 flex-1 overflow-y-auto", className)}>
			{children}
		</div>
	)
}
Detail.displayName = "SplitView.Detail"

// ── Export ────────────────────────────────────────────────────────────────────

const SplitViewGuarded = withProGuard(SplitViewBase, "SplitView")

export const SplitView = Object.assign(SplitViewGuarded, {
	Master,
	Detail,
})
