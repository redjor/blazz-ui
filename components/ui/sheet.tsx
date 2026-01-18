"use client"

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import type * as React from "react"
import { cn } from "@/lib/utils"

// Réutiliser Dialog de Base UI comme base pour Sheet
const Sheet = DialogPrimitive.Root
const SheetTrigger = DialogPrimitive.Trigger
const SheetClose = DialogPrimitive.Close
const SheetPortal = DialogPrimitive.Portal

// Overlay backdrop similaire à Dialog
function SheetOverlay({ className, ...props }: DialogPrimitive.Backdrop.Props) {
	return (
		<DialogPrimitive.Backdrop
			className={cn(
				"fixed inset-0 z-50 bg-black/80",
				"data-open:animate-in data-closed:animate-out",
				"data-closed:fade-out-0 data-open:fade-in-0",
				"duration-200",
				className
			)}
			{...props}
		/>
	)
}

// Content qui slide depuis la gauche (ou droite)
function SheetContent({
	side = "left",
	className,
	children,
	...props
}: DialogPrimitive.Popup.Props & {
	side?: "left" | "right" | "top" | "bottom"
}) {
	const sideClasses = {
		left: "inset-y-0 left-0 h-full w-[300px] data-closed:slide-out-to-left data-open:slide-in-from-left border-r",
		right: "inset-y-0 right-0 h-full w-[300px] data-closed:slide-out-to-right data-open:slide-in-from-right border-l",
		top: "inset-x-0 top-0 w-full h-[300px] data-closed:slide-out-to-top data-open:slide-in-from-top border-b",
		bottom: "inset-x-0 bottom-0 w-full h-[300px] data-closed:slide-out-to-bottom data-open:slide-in-from-bottom border-t",
	}

	return (
		<SheetPortal>
			<SheetOverlay />
			<DialogPrimitive.Popup
				className={cn(
					"fixed z-50 bg-background shadow-lg",
					"data-open:animate-in data-closed:animate-out",
					"duration-300 ease-in-out",
					sideClasses[side],
					className
				)}
				{...props}
			>
				{children}
			</DialogPrimitive.Popup>
		</SheetPortal>
	)
}

export { Sheet, SheetTrigger, SheetClose, SheetPortal, SheetOverlay, SheetContent }
