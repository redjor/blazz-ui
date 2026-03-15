"use client"

import { useState, useEffect, useCallback, useRef } from "react"

// ── Types ───────────────────────────────────────

export interface InspectedElement {
	slot: string
	textContent: string
	rect: DOMRect
	element: HTMLElement
}

// ── Hook: useElementInspector ───────────────────

export function useElementInspector(
	containerRef: React.RefObject<HTMLElement | null>,
	enabled: boolean,
) {
	const [hovered, setHovered] = useState<InspectedElement | null>(null)
	const [selected, setSelected] = useState<InspectedElement | null>(null)
	const hoveredRef = useRef<HTMLElement | null>(null)

	// Find the deepest data-slot element under cursor
	const findSlotElement = useCallback(
		(target: HTMLElement): HTMLElement | null => {
			let el: HTMLElement | null = target
			while (el && el !== containerRef.current) {
				if (el.hasAttribute("data-slot")) return el
				el = el.parentElement
			}
			return null
		},
		[containerRef],
	)

	const getElementInfo = useCallback(
		(el: HTMLElement): InspectedElement => {
			const containerRect = containerRef.current?.getBoundingClientRect()
			const elRect = el.getBoundingClientRect()
			// Compute rect relative to container
			const rect = new DOMRect(
				elRect.x - (containerRect?.x ?? 0),
				elRect.y - (containerRect?.y ?? 0),
				elRect.width,
				elRect.height,
			)
			return {
				slot: el.getAttribute("data-slot") ?? "",
				textContent: getDirectTextContent(el),
				rect,
				element: el,
			}
		},
		[containerRef],
	)

	useEffect(() => {
		const container = containerRef.current
		if (!container || !enabled) {
			setHovered(null)
			return
		}

		const handleMouseMove = (e: MouseEvent) => {
			const target = e.target as HTMLElement
			const slotEl = findSlotElement(target)

			if (slotEl === hoveredRef.current) return
			hoveredRef.current = slotEl

			if (slotEl) {
				setHovered(getElementInfo(slotEl))
			} else {
				setHovered(null)
			}
		}

		const handleClick = (e: MouseEvent) => {
			e.preventDefault()
			e.stopPropagation()
			const target = e.target as HTMLElement
			const slotEl = findSlotElement(target)
			if (slotEl) {
				setSelected(getElementInfo(slotEl))
			}
		}

		const handleMouseLeave = () => {
			hoveredRef.current = null
			setHovered(null)
		}

		container.addEventListener("mousemove", handleMouseMove)
		container.addEventListener("click", handleClick, true)
		container.addEventListener("mouseleave", handleMouseLeave)

		return () => {
			container.removeEventListener("mousemove", handleMouseMove)
			container.removeEventListener("click", handleClick, true)
			container.removeEventListener("mouseleave", handleMouseLeave)
		}
	}, [enabled, containerRef, findSlotElement, getElementInfo])

	// Deselect on Escape
	useEffect(() => {
		if (!selected) return
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") setSelected(null)
		}
		window.addEventListener("keydown", handleKeyDown)
		return () => window.removeEventListener("keydown", handleKeyDown)
	}, [selected])

	// Clear selection when inspector is disabled
	useEffect(() => {
		if (!enabled) {
			setSelected(null)
			setHovered(null)
		}
	}, [enabled])

	return { hovered, selected, setSelected }
}

// ── Overlay component ───────────────────────────

interface InspectorOverlayProps {
	hovered: InspectedElement | null
	selected: InspectedElement | null
}

export function InspectorOverlay({ hovered, selected }: InspectorOverlayProps) {
	return (
		<>
			{/* Hovered outline */}
			{hovered && hovered.element !== selected?.element && (
				<>
					<div
						className="pointer-events-none absolute border-2 border-brand/60 rounded-sm transition-all duration-75"
						style={{
							top: hovered.rect.y,
							left: hovered.rect.x,
							width: hovered.rect.width,
							height: hovered.rect.height,
						}}
					/>
					<div
						className="pointer-events-none absolute bg-brand text-white text-[10px] font-mono px-1.5 py-0.5 rounded-sm leading-none whitespace-nowrap"
						style={{
							top: Math.max(0, hovered.rect.y - 18),
							left: hovered.rect.x,
						}}
					>
						{hovered.slot}
					</div>
				</>
			)}

			{/* Selected outline */}
			{selected && (
				<>
					<div
						className="pointer-events-none absolute border-2 border-brand rounded-sm"
						style={{
							top: selected.rect.y,
							left: selected.rect.x,
							width: selected.rect.width,
							height: selected.rect.height,
						}}
					/>
					<div
						className="pointer-events-none absolute bg-brand text-white text-[10px] font-mono px-1.5 py-0.5 rounded-sm leading-none whitespace-nowrap"
						style={{
							top: Math.max(0, selected.rect.y - 18),
							left: selected.rect.x,
						}}
					>
						{selected.slot} (selected)
					</div>
				</>
			)}
		</>
	)
}

// ── Helpers ─────────────────────────────────────

/** Get only direct text content, not text from child elements */
function getDirectTextContent(el: HTMLElement): string {
	let text = ""
	for (const node of el.childNodes) {
		if (node.nodeType === Node.TEXT_NODE) {
			text += node.textContent ?? ""
		}
	}
	return text.trim()
}
