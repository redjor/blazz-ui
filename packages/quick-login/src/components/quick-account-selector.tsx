"use client"

import { Sheet, SheetContent } from "@blazz/ui/components/ui/sheet"
import { useEffect, useState } from "react"
import type { QuickAccountSelectorProps } from "../types"
import { QuickAccountSheet } from "./quick-account-sheet"

export function QuickAccountSelector({
	onAccountSelect,
	accounts,
	forceShow = false,
	position = "top-right",
	sheetSide = "right",
	triggerClassName,
}: QuickAccountSelectorProps) {
	const [isOpen, setIsOpen] = useState(false)
	const [isMac, setIsMac] = useState(false)
	const isDevelopment = process.env.NODE_ENV === "development"
	const shouldShow = isDevelopment || forceShow

	useEffect(() => {
		setIsMac(/Mac|iPhone/.test(navigator.userAgent))
	}, [])

	useEffect(() => {
		if (!shouldShow) return

		const handleKeyDown = (e: KeyboardEvent) => {
			if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "L") {
				e.preventDefault()
				setIsOpen((prev) => !prev)
			}
		}

		document.addEventListener("keydown", handleKeyDown)
		return () => document.removeEventListener("keydown", handleKeyDown)
	}, [shouldShow])

	if (!shouldShow) return null

	const positionClasses = {
		"top-right": "right-4 top-4",
		"top-left": "left-4 top-4",
		"bottom-right": "right-4 bottom-4",
		"bottom-left": "left-4 bottom-4",
	}

	const shortcutHint = isMac ? "⌘⇧L" : "Ctrl+Shift+L"

	return (
		<>
			<div className={triggerClassName ?? `fixed z-50 ${positionClasses[position]}`}>
				<button
					type="button"
					onClick={() => setIsOpen(true)}
					className="flex items-center gap-2 rounded-full bg-black px-3 py-1.5 text-xs font-medium text-white shadow-lg transition-colors hover:bg-black/80"
					aria-label="Ouvrir la sélection de comptes de test"
				>
					Comptes de test
					<kbd className="font-mono text-[10px] text-white/50">{shortcutHint}</kbd>
				</button>
			</div>

			<Sheet open={isOpen} onOpenChange={setIsOpen}>
				<SheetContent side={sheetSide} size="sm">
					<QuickAccountSheet
						accounts={accounts}
						onAccountSelect={(username, password) => {
							onAccountSelect(username, password)
							setIsOpen(false)
						}}
					/>
				</SheetContent>
			</Sheet>
		</>
	)
}
