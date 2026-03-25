"use client"

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react"
import { cn } from "../../lib/utils/cn"

export interface NavbarProps {
	left?: React.ReactNode
	center?: React.ReactNode
	right?: React.ReactNode
	className?: string
}

export function Navbar({ left, center, right, className }: NavbarProps) {
	return (
		<nav className={cn("h-14 shrink-0 bg-app z-50", className)}>
			<div className="flex h-full items-center px-4">
				{left && <div className="flex items-center gap-2">{left}</div>}
				{center && <div className="flex items-center justify-center">{center}</div>}
				<div className="flex-1" />
				{right && <div className="flex items-center gap-1">{right}</div>}
			</div>
		</nav>
	)
}

// --- Sliding tabs ---

const NavbarTabsContext = createContext<string | null>(null)

export interface NavbarTabsProps {
	value: string
	children: React.ReactNode
	className?: string
}

export function NavbarTabs({ value, children, className }: NavbarTabsProps) {
	const navRef = useRef<HTMLDivElement>(null)
	const [indicator, setIndicator] = useState({ left: 0, width: 0, ready: false })

	const updateIndicator = useCallback(() => {
		const nav = navRef.current
		if (!nav) return
		const activeEl = nav.querySelector<HTMLElement>("[data-active='true']")
		if (!activeEl) {
			setIndicator((prev) => ({ ...prev, ready: false }))
			return
		}
		const navRect = nav.getBoundingClientRect()
		const elRect = activeEl.getBoundingClientRect()
		setIndicator({
			left: elRect.left - navRect.left,
			width: elRect.width,
			ready: true,
		})
	}, [])

	useEffect(() => {
		updateIndicator()
	}, [updateIndicator, value])

	return (
		<NavbarTabsContext.Provider value={value}>
			<div ref={navRef} className={cn("relative flex items-center gap-1", className)}>
				<div
					className={cn(
						"absolute top-1/2 -translate-y-1/2 h-[30px] rounded-md bg-muted transition-all duration-200 ease-out",
						!indicator.ready && "opacity-0"
					)}
					style={{ left: indicator.left, width: indicator.width }}
					aria-hidden
				/>
				{children}
			</div>
		</NavbarTabsContext.Provider>
	)
}

export interface NavbarTabProps {
	value: string
	children: React.ReactNode
	className?: string
}

export function NavbarTab({ value, children, className }: NavbarTabProps) {
	const activeValue = useContext(NavbarTabsContext)
	const isActive = activeValue === value

	return (
		<div
			data-active={isActive}
			className={cn(
				"relative z-10 px-3 py-1.5 text-sm rounded-md transition-colors duration-150",
				isActive ? "text-fg font-medium" : "text-fg-muted hover:text-fg",
				className
			)}
		>
			{children}
		</div>
	)
}
