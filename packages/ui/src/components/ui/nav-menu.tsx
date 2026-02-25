import { Slot } from "@radix-ui/react-slot"
import type * as React from "react"
import { Separator } from "./separator"
import { cn } from "../../lib/utils"

function NavMenu({ className, ...props }: React.ComponentProps<"nav">) {
	return (
		<nav
			data-slot="nav-menu"
			className={cn("flex min-w-0 flex-col gap-1", className)}
			{...props}
		/>
	)
}

function NavMenuGroup({
	className,
	label,
	children,
	...props
}: React.ComponentProps<"div"> & { label?: string }) {
	return (
		<div data-slot="nav-menu-group" className={cn("flex flex-col gap-1", className)} {...props}>
			{label && (
				<span className="flex h-6 shrink-0 items-center px-2 text-xs font-medium text-fg/70">
					{label}
				</span>
			)}
			{children}
		</div>
	)
}

function NavMenuItem({
	className,
	active = false,
	asChild = false,
	...props
}: React.ComponentProps<"a"> & { active?: boolean; asChild?: boolean }) {
	const Comp = asChild ? Slot : "a"

	return (
		<Comp
			data-slot="nav-menu-item"
			data-active={active}
			className={cn(
				"flex w-full items-center gap-2 rounded-lg px-2 h-7 text-xs font-semibold text-fg/70 outline-none ring-brand/20 transition-colors hover:bg-raised/50 hover:text-fg focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:scale-[0.8125] [&>span]:truncate",
				"data-[active=true]:bg-raised data-[active=true]:text-fg",
				className
			)}
			{...props}
		/>
	)
}

function NavMenuSeparator({ className, ...props }: React.ComponentProps<typeof Separator>) {
	return (
		<Separator
			data-slot="nav-menu-separator"
			className={cn("my-1 bg-edge", className)}
			{...props}
		/>
	)
}

export { NavMenu, NavMenuGroup, NavMenuItem, NavMenuSeparator }
