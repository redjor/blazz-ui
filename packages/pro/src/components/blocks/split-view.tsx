"use client"

import { cn } from "@blazz/ui"
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
import { withProGuard } from "../../lib/with-pro-guard"

// ── Context ──────────────────────────────────────────────────────────────────

interface SplitViewContextValue {
	width: number
}

const SplitViewContext = createContext<SplitViewContextValue | null>(null)

// ── Props ────────────────────────────────────────────────────────────────────

export interface SplitViewProps {
	/** Initial width of the master panel in pixels. @default 320 */
	defaultWidth?: number
	/** Minimum width of the master panel in pixels. @default 200 */
	minWidth?: number
	/** Maximum width of the master panel in pixels. @default 600 */
	maxWidth?: number
	className?: string
	children: React.ReactNode
}

export interface SplitViewPanelProps {
	className?: string
	children: React.ReactNode
}

// ── SplitView (root) ─────────────────────────────────────────────────────────

function SplitViewBase({
	defaultWidth = 320,
	minWidth = 200,
	maxWidth = 600,
	className,
	children,
}: SplitViewProps) {
	const [width, setWidth] = useState(defaultWidth)
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
			const newWidth = e.clientX - rect.left
			setWidth(Math.max(minWidth, Math.min(maxWidth, newWidth)))
		},
		[minWidth, maxWidth]
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
		<SplitViewContext.Provider value={{ width }}>
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
						"hidden w-1 shrink-0 cursor-col-resize items-center justify-center border-l border-edge transition-colors duration-150 ease-out md:flex",
						dragging ? "bg-muted" : "hover:bg-muted"
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
			style={{ width: ctx.width }}
		>
			{children}
		</div>
	)
}
Master.displayName = "SplitView.Master"

// ── Detail ───────────────────────────────────────────────────────────────────

function Detail({ className, children }: SplitViewPanelProps) {
	return (
		<div className={cn("flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto", className)}>
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
