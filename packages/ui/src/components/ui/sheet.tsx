"use client"

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { XIcon } from "lucide-react"
import type * as React from "react"
import { cn } from "../../lib/utils"
import { Button } from "./button"

// Réutiliser Dialog de Base UI comme base pour Sheet
const Sheet = DialogPrimitive.Root
const SheetTrigger = DialogPrimitive.Trigger
const SheetClose = DialogPrimitive.Close
const SheetPortal = DialogPrimitive.Portal

// Overlay backdrop similaire à Dialog
function SheetOverlay({
	className,
	topOffset,
	...props
}: DialogPrimitive.Backdrop.Props & { topOffset?: string }) {
	return (
		<DialogPrimitive.Backdrop
			className={cn(
				"fixed z-50 bg-black/80",
				"data-open:animate-in data-closed:animate-out",
				"data-closed:fade-out-0 data-open:fade-in-0",
				"duration-200",
				topOffset ? `inset-x-0 bottom-0` : "inset-0",
				className
			)}
			style={topOffset ? { top: topOffset } : undefined}
			{...props}
		/>
	)
}

const sheetSizeClasses = {
	sm: { width: "w-[320px]", height: "h-[240px]" },
	md: { width: "w-[400px]", height: "h-[300px]" },
	lg: { width: "w-[520px]", height: "h-[400px]" },
	xl: { width: "w-[680px]", height: "h-[520px]" },
	full: { width: "max-w-[90vw] w-[90vw]", height: "max-h-[90vh] h-[90vh]" },
} as const

// Content qui slide depuis la gauche (ou droite)
function SheetContent({
	side = "left",
	size = "md",
	className,
	children,
	topOffset,
	...props
}: DialogPrimitive.Popup.Props & {
	side?: "left" | "right" | "top" | "bottom"
	size?: keyof typeof sheetSizeClasses
	topOffset?: string
}) {
	const isHorizontal = side === "left" || side === "right"
	const sizeClass = isHorizontal ? sheetSizeClasses[size].width : sheetSizeClasses[size].height

	const sideClasses = topOffset
		? {
				left: `left-2 bottom-2 ${sizeClass} data-closed:slide-out-to-left data-open:slide-in-from-left`,
				right: `right-2 bottom-2 ${sizeClass} data-closed:slide-out-to-right data-open:slide-in-from-right`,
				top: `left-2 right-2 ${sizeClass} data-closed:slide-out-to-top data-open:slide-in-from-top`,
				bottom: `left-2 right-2 bottom-2 ${sizeClass} data-closed:slide-out-to-bottom data-open:slide-in-from-bottom`,
			}
		: {
				left: `top-2 bottom-2 left-2 ${sizeClass} data-closed:slide-out-to-left data-open:slide-in-from-left`,
				right: `top-2 bottom-2 right-2 ${sizeClass} data-closed:slide-out-to-right data-open:slide-in-from-right`,
				top: `top-2 left-2 right-2 ${sizeClass} data-closed:slide-out-to-top data-open:slide-in-from-top`,
				bottom: `bottom-2 left-2 right-2 ${sizeClass} data-closed:slide-out-to-bottom data-open:slide-in-from-bottom`,
			}

	const isVerticalSide = side === "left" || side === "right"
	const computedStyle: React.CSSProperties | undefined =
		topOffset && isVerticalSide
			? { top: `calc(${topOffset} + 0.5rem)` }
			: topOffset && side === "top"
				? { top: `calc(${topOffset} + 0.5rem)` }
				: undefined

	return (
		<SheetPortal>
			<SheetOverlay topOffset={topOffset} />
			<DialogPrimitive.Popup
				data-slot="sheet-content"
				className={cn(
					"fixed z-50 flex flex-col bg-surface-4 shadow-lg border border-container",
					"rounded-[var(--radius-xl)] overflow-hidden",
					sideClasses[side],
					className
				)}
				style={computedStyle}
				{...props}
			>
				{children}
			</DialogPrimitive.Popup>
		</SheetPortal>
	)
}

function SheetHeader({
	className,
	children,
	showCloseButton = true,
	...props
}: React.ComponentProps<"div"> & { showCloseButton?: boolean }) {
	return (
		<div
			data-slot="sheet-header"
			className={cn("flex flex-col gap-1.5 p-inset border-b border-separator", className)}
			{...props}
		>
			{children}
			{showCloseButton && (
				<DialogPrimitive.Close
					data-slot="sheet-close"
					render={<Button variant="ghost" className="absolute top-2 right-2" size="icon-sm" />}
				>
					<XIcon />
					<span className="sr-only">Close</span>
				</DialogPrimitive.Close>
			)}
		</div>
	)
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="sheet-footer"
			className={cn(
				"bg-surface-3 border-t border-separator px-inset flex gap-2 justify-end",
				className
			)}
			style={{ paddingBlock: "calc(var(--inset) * 0.75)" }}
			{...props}
		/>
	)
}

function SheetTitle({ className, ...props }: DialogPrimitive.Title.Props) {
	return (
		<DialogPrimitive.Title
			data-slot="sheet-title"
			className={cn("text-sm font-medium text-fg leading-none", className)}
			{...props}
		/>
	)
}

function SheetDescription({ className, ...props }: DialogPrimitive.Description.Props) {
	return (
		<DialogPrimitive.Description
			data-slot="sheet-description"
			className={cn("text-sm text-fg-muted", className)}
			{...props}
		/>
	)
}

export {
	Sheet,
	SheetTrigger,
	SheetClose,
	SheetPortal,
	SheetOverlay,
	SheetContent,
	SheetHeader,
	SheetFooter,
	SheetTitle,
	SheetDescription,
}
