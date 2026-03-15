"use client"

import { Switch as SwitchPrimitive } from "@base-ui/react/switch"
import type { LucideIcon } from "lucide-react"
import * as React from "react"
import { cn } from "@blazz/ui"
import { withProGuard } from "../../lib/with-pro-guard"

// ---------------------------------------------------------------------------
// ViewConfigPanel — Root container
// ---------------------------------------------------------------------------

interface ViewConfigPanelProps extends React.ComponentProps<"div"> {
	/** Panel width @default 280 */
	width?: number
}

function ViewConfigPanelBase({ className, width = 280, style, ...props }: ViewConfigPanelProps) {
	return (
		<div
			data-slot="view-config-panel"
			className={cn(
				"bg-surface-4 ring-edge/40 flex flex-col rounded-lg shadow-md ring-1 overflow-hidden",
				className
			)}
			style={{ width, ...style }}
			{...props}
		/>
	)
}

// ---------------------------------------------------------------------------
// ViewConfigTabs — Icon tabs switcher (List / Board / etc.)
// ---------------------------------------------------------------------------

interface ViewConfigTab {
	value: string
	label: string
	icon: LucideIcon
}

interface ViewConfigTabsProps {
	tabs: ViewConfigTab[]
	value: string
	onValueChange: (value: string) => void
	className?: string
}

function ViewConfigTabs({ tabs, value, onValueChange, className }: ViewConfigTabsProps) {
	return (
		<div
			data-slot="view-config-tabs"
			className={cn("mx-3 mt-3 mb-1 flex items-center gap-0.5 rounded-lg bg-surface-3 p-1", className)}
		>
			{tabs.map((tab) => {
				const isActive = tab.value === value
				const Icon = tab.icon
				return (
					<button
						key={tab.value}
						type="button"
						onClick={() => onValueChange(tab.value)}
						className={cn(
							"flex flex-1 cursor-pointer flex-col items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors duration-150 ease-out",
							isActive ? "bg-surface text-fg shadow-sm" : "text-fg-muted hover:text-fg"
						)}
					>
						<Icon className="size-4" />
						<span>{tab.label}</span>
					</button>
				)
			})}
		</div>
	)
}

// ---------------------------------------------------------------------------
// ViewConfigSection — Group with optional title
// ---------------------------------------------------------------------------

interface ViewConfigSectionProps extends React.ComponentProps<"div"> {
	/** Optional section heading */
	title?: string
}

function ViewConfigSection({ title, className, children, ...props }: ViewConfigSectionProps) {
	return (
		<div data-slot="view-config-section" className={cn("flex flex-col", className)} {...props}>
			{title && (
				<div className="px-3 pb-1 pt-3">
					<span className="text-[13px] font-medium text-fg">{title}</span>
				</div>
			)}
			<div className="flex flex-col">{children}</div>
		</div>
	)
}

// ---------------------------------------------------------------------------
// ViewConfigDivider — Visual separator between sections
// ---------------------------------------------------------------------------

function ViewConfigDivider({ className }: { className?: string }) {
	return (
		<div
			data-slot="view-config-divider"
			className={cn("mx-3 my-1.5 border-t border-edge/40", className)}
		/>
	)
}

// ---------------------------------------------------------------------------
// ViewConfigFilterRow — Icon + label + control (select, etc.)
// ---------------------------------------------------------------------------

interface ViewConfigFilterRowProps extends React.ComponentProps<"div"> {
	icon?: LucideIcon
	label: string
}

function ViewConfigFilterRow({
	icon: Icon,
	label,
	className,
	children,
	...props
}: ViewConfigFilterRowProps) {
	return (
		<div
			data-slot="view-config-filter-row"
			className={cn("flex items-center gap-2 px-3 py-1.5", className)}
			{...props}
		>
			{Icon && <Icon className="size-3.5 shrink-0 text-fg-muted" />}
			<span className="w-[72px] shrink-0 text-[13px] text-fg-muted">{label}</span>
			<div className="flex flex-1 items-center gap-1">{children}</div>
		</div>
	)
}

// ---------------------------------------------------------------------------
// ViewConfigToggle — Label + switch toggle row
// ---------------------------------------------------------------------------

interface ViewConfigToggleProps {
	label: string
	checked?: boolean
	defaultChecked?: boolean
	onCheckedChange?: (checked: boolean) => void
	disabled?: boolean
	className?: string
}

function ViewConfigToggle({
	label,
	checked,
	defaultChecked,
	onCheckedChange,
	disabled = false,
	className,
}: ViewConfigToggleProps) {
	const id = React.useId()

	return (
		<label
			htmlFor={id}
			data-slot="view-config-toggle"
			className={cn(
				"flex cursor-pointer items-center justify-between gap-3 px-3 py-1.5 transition-colors duration-150 ease-out hover:bg-surface-3",
				disabled && "cursor-not-allowed opacity-50",
				className
			)}
		>
			<span className="text-[13px] text-fg">{label}</span>
			<SwitchPrimitive.Root
				id={id}
				checked={checked}
				defaultChecked={defaultChecked}
				onCheckedChange={onCheckedChange}
				disabled={disabled}
				className={cn(
					"bg-surface-3 data-checked:bg-brand",
					"shrink-0 rounded-full border border-transparent",
					"focus-visible:border-brand focus-visible:ring-brand/20 focus-visible:ring-[3px] outline-none",
					"h-[18.4px] w-[32px]",
					"peer group/switch relative inline-flex items-center transition-all",
					"data-disabled:cursor-not-allowed data-disabled:opacity-50"
				)}
			>
				<SwitchPrimitive.Thumb className="bg-fg rounded-full size-4 data-checked:translate-x-[calc(100%-2px)] data-unchecked:translate-x-0 pointer-events-none block ring-0 transition-transform" />
			</SwitchPrimitive.Root>
		</label>
	)
}

// ---------------------------------------------------------------------------
// ViewConfigPropertyToggles — Togglable property chips
// ---------------------------------------------------------------------------

interface ViewConfigProperty {
	value: string
	label: string
}

interface ViewConfigPropertyTogglesProps {
	properties: ViewConfigProperty[]
	/** Active property values */
	value: string[]
	onValueChange?: (value: string[]) => void
	className?: string
}

function ViewConfigPropertyToggles({
	properties,
	value,
	onValueChange,
	className,
}: ViewConfigPropertyTogglesProps) {
	const toggle = (propertyValue: string) => {
		if (!onValueChange) return
		if (value.includes(propertyValue)) {
			onValueChange(value.filter((v) => v !== propertyValue))
		} else {
			onValueChange([...value, propertyValue])
		}
	}

	return (
		<div
			data-slot="view-config-property-toggles"
			className={cn("flex flex-wrap gap-1.5 px-3 py-1.5", className)}
		>
			{properties.map((property) => {
				const isActive = value.includes(property.value)
				return (
					<button
						key={property.value}
						type="button"
						onClick={() => toggle(property.value)}
						className={cn(
							"rounded-md px-2 py-0.5 text-xs font-medium transition-colors duration-150 ease-out",
							isActive
								? "bg-surface-3 text-fg ring-1 ring-edge/60"
								: "text-fg-muted hover:text-fg hover:bg-surface-3/50"
						)}
					>
						{property.label}
					</button>
				)
			})}
		</div>
	)
}

// ---------------------------------------------------------------------------
// ViewConfigFooter — Bottom actions (Reset, Set default, etc.)
// ---------------------------------------------------------------------------

interface ViewConfigFooterProps extends React.ComponentProps<"div"> {}

function ViewConfigFooter({ className, ...props }: ViewConfigFooterProps) {
	return (
		<div
			data-slot="view-config-footer"
			className={cn(
				"flex items-center justify-between border-t border-edge/40 px-3 py-2",
				className
			)}
			{...props}
		/>
	)
}

// ---------------------------------------------------------------------------
// ViewConfigFooterAction — Individual footer action button
// ---------------------------------------------------------------------------

interface ViewConfigFooterActionProps extends React.ComponentProps<"button"> {
	variant?: "default" | "accent"
}

function ViewConfigFooterAction({
	variant = "default",
	className,
	...props
}: ViewConfigFooterActionProps) {
	return (
		<button
			type="button"
			data-slot="view-config-footer-action"
			className={cn(
				"text-[13px] font-medium transition-colors duration-150 ease-out",
				variant === "accent" ? "text-brand hover:text-brand/80" : "text-fg-muted hover:text-fg",
				className
			)}
			{...props}
		/>
	)
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

const ViewConfigPanel = withProGuard(ViewConfigPanelBase, "ViewConfigPanel")

export {
	ViewConfigPanel,
	ViewConfigTabs,
	ViewConfigSection,
	ViewConfigDivider,
	ViewConfigFilterRow,
	ViewConfigToggle,
	ViewConfigPropertyToggles,
	ViewConfigFooter,
	ViewConfigFooterAction,
}

export type {
	ViewConfigPanelProps,
	ViewConfigTab,
	ViewConfigTabsProps,
	ViewConfigSectionProps,
	ViewConfigFilterRowProps,
	ViewConfigToggleProps,
	ViewConfigProperty,
	ViewConfigPropertyTogglesProps,
	ViewConfigFooterProps,
	ViewConfigFooterActionProps,
}
