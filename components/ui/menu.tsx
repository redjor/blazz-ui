"use client"

import { Menu as MenuPrimitive } from "@base-ui/react/menu"
import * as React from "react"
import { cn } from "@/lib/utils"

const Menu = MenuPrimitive.Root

const MenuTrigger = MenuPrimitive.Trigger

const MenuPortal = MenuPrimitive.Portal

const MenuPositioner = React.forwardRef<
	React.ElementRef<typeof MenuPrimitive.Positioner>,
	React.ComponentPropsWithoutRef<typeof MenuPrimitive.Positioner>
>((props, ref) => <MenuPrimitive.Positioner ref={ref} {...props} />)
MenuPositioner.displayName = "MenuPositioner"

const MenuPopup = React.forwardRef<
	React.ElementRef<typeof MenuPrimitive.Popup>,
	React.ComponentPropsWithoutRef<typeof MenuPrimitive.Popup>
>(({ className, ...props }, ref) => (
	<MenuPrimitive.Popup
		ref={ref}
		className={cn(
			"z-50 min-w-32 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
			"origin-[var(--transform-origin)] transition-[transform,scale,opacity]",
			"data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
			"data-[ending-style]:scale-95 data-[ending-style]:opacity-0",
			className
		)}
		{...props}
	/>
))
MenuPopup.displayName = "MenuPopup"

const MenuItem = React.forwardRef<
	React.ElementRef<typeof MenuPrimitive.Item>,
	React.ComponentPropsWithoutRef<typeof MenuPrimitive.Item>
>(({ className, ...props }, ref) => (
	<MenuPrimitive.Item
		ref={ref}
		className={cn(
			"relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
			"transition-colors",
			"data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground",
			"data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
			className
		)}
		{...props}
	/>
))
MenuItem.displayName = "MenuItem"

const MenuSeparator = React.forwardRef<
	React.ElementRef<typeof MenuPrimitive.Separator>,
	React.ComponentPropsWithoutRef<typeof MenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
	<MenuPrimitive.Separator
		ref={ref}
		className={cn("-mx-1 my-1 h-px bg-border", className)}
		{...props}
	/>
))
MenuSeparator.displayName = "MenuSeparator"

const MenuGroup = MenuPrimitive.Group

const MenuGroupLabel = React.forwardRef<
	React.ElementRef<typeof MenuPrimitive.GroupLabel>,
	React.ComponentPropsWithoutRef<typeof MenuPrimitive.GroupLabel>
>(({ className, ...props }, ref) => (
	<MenuPrimitive.GroupLabel
		ref={ref}
		className={cn("px-2 py-1.5 text-sm font-semibold", className)}
		{...props}
	/>
))
MenuGroupLabel.displayName = "MenuGroupLabel"

const MenuRadioGroup = MenuPrimitive.RadioGroup

const MenuRadioItem = React.forwardRef<
	React.ElementRef<typeof MenuPrimitive.RadioItem>,
	React.ComponentPropsWithoutRef<typeof MenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
	<MenuPrimitive.RadioItem
		ref={ref}
		className={cn(
			"relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
			"transition-colors",
			"data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground",
			"data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
			className
		)}
		{...props}
	>
		<span className="absolute left-2 flex size-3.5 items-center justify-center">
			<MenuPrimitive.RadioItemIndicator>
				<div className="size-2 rounded-full bg-current" />
			</MenuPrimitive.RadioItemIndicator>
		</span>
		<span className="pl-6">{children}</span>
	</MenuPrimitive.RadioItem>
))
MenuRadioItem.displayName = "MenuRadioItem"

const MenuCheckboxItem = React.forwardRef<
	React.ElementRef<typeof MenuPrimitive.CheckboxItem>,
	React.ComponentPropsWithoutRef<typeof MenuPrimitive.CheckboxItem>
>(({ className, children, ...props }, ref) => (
	<MenuPrimitive.CheckboxItem
		ref={ref}
		className={cn(
			"relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
			"transition-colors",
			"data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground",
			"data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
			className
		)}
		{...props}
	>
		<span className="absolute left-2 flex size-3.5 items-center justify-center">
			<MenuPrimitive.CheckboxItemIndicator>
				<svg
					width="15"
					height="15"
					viewBox="0 0 15 15"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z"
						fill="currentColor"
					/>
				</svg>
			</MenuPrimitive.CheckboxItemIndicator>
		</span>
		<span className="pl-6">{children}</span>
	</MenuPrimitive.CheckboxItem>
))
MenuCheckboxItem.displayName = "MenuCheckboxItem"

export {
	Menu,
	MenuTrigger,
	MenuPortal,
	MenuPositioner,
	MenuPopup,
	MenuItem,
	MenuSeparator,
	MenuGroup,
	MenuGroupLabel,
	MenuRadioGroup,
	MenuRadioItem,
	MenuCheckboxItem,
}
