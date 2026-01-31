import type * as React from "react"

import { cn } from "@/lib/utils"

function Card({
	className,
	size = "default",
	...props
}: React.ComponentProps<"div"> & { size?: "default" | "sm" }) {
	return (
		<div
			data-slot="card"
			data-size={size}
			className={cn(
				"bg-p-bg-surface text-p-text",
				"border border-p-border",
				"rounded-p-xl",
				"shadow-p-md",
				"p-p-4",
				"gap-p-4",
				"overflow-hidden",
				"has-data-[slot=card-footer]:pb-0",
				"has-[>img:first-child]:pt-0",
				"data-[size=sm]:gap-p-3 data-[size=sm]:p-p-3 data-[size=sm]:has-data-[slot=card-footer]:pb-0",
				"*:[img:first-child]:rounded-t-p-xl *:[img:last-child]:rounded-b-p-xl",
				"group/card flex flex-col",
				className
			)}
			{...props}
		/>
	)
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-header"
			className={cn(
				"flex flex-col gap-p-1.5",
				"pb-p-4",
				"group-data-[size=sm]/card:pb-p-3",
				"[.border-b]:pb-p-4 group-data-[size=sm]/card:[.border-b]:pb-p-3",
				"group/card-header @container/card-header grid auto-rows-min items-start",
				"has-data-[slot=card-action]:grid-cols-[1fr_auto]",
				"has-data-[slot=card-description]:grid-rows-[auto_auto]",
				className
			)}
			{...props}
		/>
	)
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-title"
			className={cn(
				"text-p-md font-p-semibold text-p-text",
				"leading-[var(--p-font-line-height-500)]",
				"group-data-[size=sm]/card:text-p-base",
				className
			)}
			{...props}
		/>
	)
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-description"
			className={cn("text-p-text-secondary text-p-sm", className)}
			{...props}
		/>
	)
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-action"
			className={cn("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className)}
			{...props}
		/>
	)
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-content"
			className={cn("group-data-[size=sm]/card:px-0", className)}
			{...props}
		/>
	)
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-footer"
			className={cn(
				"bg-p-bg-surface-secondary rounded-b-p-xl border-t border-p-border",
				"p-p-4 group-data-[size=sm]/card:p-p-3",
				"flex items-center",
				className
			)}
			{...props}
		/>
	)
}

export { Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent }
