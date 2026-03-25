"use client"

import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar"
import type * as React from "react"

import { cn } from "../../lib/utils"

function Avatar({
	className,
	size = "default",
	...props
}: AvatarPrimitive.Root.Props & {
	size?: "default" | "sm" | "lg"
}) {
	return (
		<AvatarPrimitive.Root
			data-slot="avatar"
			data-size={size}
			className={cn(
				"size-8 rounded-full data-[size=lg]:size-10 data-[size=sm]:size-6 group/avatar relative flex shrink-0 select-none ring-1 ring-inset ring-black/[.06] dark:ring-white/[.08]",
				className
			)}
			{...props}
		/>
	)
}

function AvatarImage({ className, ...props }: AvatarPrimitive.Image.Props) {
	return (
		<AvatarPrimitive.Image
			data-slot="avatar-image"
			className={cn("rounded-full aspect-square size-full object-cover", className)}
			{...props}
		/>
	)
}

function AvatarFallback({ className, ...props }: AvatarPrimitive.Fallback.Props) {
	return (
		<AvatarPrimitive.Fallback
			data-slot="avatar-fallback"
			className={cn(
				"bg-muted text-fg-muted rounded-full flex size-full items-center justify-center text-xs font-semibold group-data-[size=sm]/avatar:text-[10px] group-data-[size=lg]/avatar:text-sm",
				className
			)}
			{...props}
		/>
	)
}

function AvatarBadge({ className, ...props }: React.ComponentProps<"span">) {
	return (
		<span
			data-slot="avatar-badge"
			className={cn(
				"bg-brand text-brand-fg ring-[var(--avatar-ring,var(--surface-2))] absolute right-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full bg-blend-color ring-2 select-none",
				"group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>svg]:hidden",
				"group-data-[size=default]/avatar:size-2.5 group-data-[size=default]/avatar:[&>svg]:size-2",
				"group-data-[size=lg]/avatar:size-3 group-data-[size=lg]/avatar:[&>svg]:size-2",
				className
			)}
			{...props}
		/>
	)
}

function AvatarGroup({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="avatar-group"
			className={cn(
				"*:data-[slot=avatar]:ring-[var(--avatar-ring,var(--surface-2))] group/avatar-group flex -space-x-2 *:data-[slot=avatar]:ring-2",
				className
			)}
			{...props}
		/>
	)
}

function AvatarGroupCount({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="avatar-group-count"
			className={cn(
				"bg-muted text-fg-muted size-8 rounded-full text-sm group-has-data-[size=lg]/avatar-group:size-10 group-has-data-[size=sm]/avatar-group:size-6 group-has-data-[size=sm]/avatar-group:text-xs group-has-data-[size=lg]/avatar-group:text-sm [&>svg]:size-4 group-has-data-[size=lg]/avatar-group:[&>svg]:size-5 group-has-data-[size=sm]/avatar-group:[&>svg]:size-3 ring-[var(--avatar-ring,var(--surface-2))] relative flex shrink-0 items-center justify-center ring-2",
				className
			)}
			{...props}
		/>
	)
}

export { Avatar, AvatarImage, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarBadge }
