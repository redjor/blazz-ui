"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

export interface SplitViewProps {
	master: React.ReactNode
	detail: React.ReactNode
	emptyDetail?: React.ReactNode
	defaultRatio?: number
	minRatio?: number
	maxRatio?: number
	className?: string
}

export function SplitView({
	master,
	detail,
	emptyDetail,
	defaultRatio = 0.4,
	minRatio = 0.25,
	maxRatio = 0.6,
	className,
}: SplitViewProps) {
	const [ratio, setRatio] = useState(defaultRatio)
	const containerRef = useRef<HTMLDivElement>(null)
	const isDragging = useRef(false)

	const handleMouseDown = useCallback(() => {
		isDragging.current = true
		document.body.style.cursor = "col-resize"
		document.body.style.userSelect = "none"
	}, [])

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			if (!isDragging.current || !containerRef.current) return
			const rect = containerRef.current.getBoundingClientRect()
			const newRatio = (e.clientX - rect.left) / rect.width
			setRatio(Math.max(minRatio, Math.min(maxRatio, newRatio)))
		}

		const handleMouseUp = () => {
			isDragging.current = false
			document.body.style.cursor = ""
			document.body.style.userSelect = ""
		}

		document.addEventListener("mousemove", handleMouseMove)
		document.addEventListener("mouseup", handleMouseUp)

		return () => {
			document.removeEventListener("mousemove", handleMouseMove)
			document.removeEventListener("mouseup", handleMouseUp)
		}
	}, [minRatio, maxRatio])

	return (
		<div
			ref={containerRef}
			className={cn("flex h-full overflow-hidden rounded-lg border", className)}
		>
			{/* Master panel */}
			<div
				className="overflow-y-auto border-r"
				style={{ width: `${ratio * 100}%` }}
			>
				{master}
			</div>

			{/* Resize handle */}
			<div
				className="flex w-1 shrink-0 cursor-col-resize items-center justify-center hover:bg-raised"
				onMouseDown={handleMouseDown}
			>
				<div className="h-8 w-0.5 rounded-full bg-border" />
			</div>

			{/* Detail panel */}
			<div className="flex-1 overflow-y-auto">
				{detail || emptyDetail}
			</div>
		</div>
	)
}
