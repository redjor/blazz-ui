"use client"

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"
import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible"
import { CheckIcon, ChevronRightIcon } from "lucide-react"
import * as React from "react"
import { cn } from "../../lib/utils"

// ---------------------------------------------------------------------------
// FilterPanel — Root container
// ---------------------------------------------------------------------------

interface FilterPanelProps extends React.ComponentProps<"div"> {
	/** Width of the panel @default 340 */
	width?: number
}

function FilterPanel({ className, width = 340, style, ...props }: FilterPanelProps) {
	return <div data-slot="filter-panel" className={cn("bg-popover ring-edge/40 flex flex-col rounded-lg shadow-md ring-1 overflow-hidden", className)} style={{ width, ...style }} {...props} />
}

// ---------------------------------------------------------------------------
// FilterPanelHeader — Top bar with tabs + optional actions
// ---------------------------------------------------------------------------

interface FilterPanelHeaderProps extends React.ComponentProps<"div"> {}

function FilterPanelHeader({ className, ...props }: FilterPanelHeaderProps) {
	return <div data-slot="filter-panel-header" className={cn("flex items-center justify-between gap-2 border-b border-edge/40 px-2 py-1.5", className)} {...props} />
}

// ---------------------------------------------------------------------------
// FilterPanelTabs — Pill-style tab switcher
// ---------------------------------------------------------------------------

interface FilterPanelTabsProps {
	tabs: string[]
	value: string
	onValueChange: (value: string) => void
	className?: string
}

function FilterPanelTabs({ tabs, value, onValueChange, className }: FilterPanelTabsProps) {
	return (
		<div data-slot="filter-panel-tabs" className={cn("flex items-center gap-0.5 rounded-md bg-muted p-0.5", className)}>
			{tabs.map((tab) => {
				const isActive = tab === value
				return (
					<button
						key={tab}
						type="button"
						onClick={() => onValueChange(tab)}
						className={cn("rounded-[5px] px-2.5 py-1 text-xs font-medium transition-colors duration-150 ease-out", isActive ? "bg-card text-fg shadow-sm" : "text-fg-muted hover:text-fg")}
					>
						{tab}
					</button>
				)
			})}
		</div>
	)
}

// ---------------------------------------------------------------------------
// FilterPanelActions — Right-side icon buttons in header
// ---------------------------------------------------------------------------

interface FilterPanelActionsProps extends React.ComponentProps<"div"> {}

function FilterPanelActions({ className, ...props }: FilterPanelActionsProps) {
	return <div data-slot="filter-panel-actions" className={cn("flex items-center gap-0.5", className)} {...props} />
}

// ---------------------------------------------------------------------------
// FilterPanelAction — Single icon button
// ---------------------------------------------------------------------------

interface FilterPanelActionProps extends React.ComponentProps<"button"> {}

function FilterPanelAction({ className, ...props }: FilterPanelActionProps) {
	return (
		<button
			type="button"
			data-slot="filter-panel-action"
			className={cn("flex size-7 items-center justify-center rounded-md text-fg-muted transition-colors duration-150 ease-out hover:bg-muted hover:text-fg", className)}
			{...props}
		/>
	)
}

// ---------------------------------------------------------------------------
// FilterPanelSection — Labelled group of items
// ---------------------------------------------------------------------------

interface FilterPanelSectionProps extends React.ComponentProps<"div"> {
	label?: string
}

function FilterPanelSection({ label, className, children, ...props }: FilterPanelSectionProps) {
	return (
		<div data-slot="filter-panel-section" className={cn("flex flex-col", className)} {...props}>
			{label && (
				<div className="px-3 pb-1 pt-2.5">
					<span className="text-[11px] font-medium uppercase tracking-wider text-fg-muted">{label}</span>
				</div>
			)}
			<div className="flex flex-col">{children}</div>
		</div>
	)
}

// ---------------------------------------------------------------------------
// FilterPanelCheckboxItem — Checkbox row with label + optional count
// ---------------------------------------------------------------------------

interface FilterPanelCheckboxItemProps {
	label: string
	count?: number
	checked?: boolean
	defaultChecked?: boolean
	onCheckedChange?: (checked: boolean) => void
	disabled?: boolean
	/** Nesting depth for tree indentation (0 = root, 1 = child, etc.) @default 0 */
	depth?: number
	/** Icon rendered before the checkbox */
	icon?: React.ReactNode
	className?: string
}

function FilterPanelCheckboxItem({ label, count, checked, defaultChecked, onCheckedChange, disabled = false, depth = 0, icon, className }: FilterPanelCheckboxItemProps) {
	const id = React.useId()

	return (
		<label
			htmlFor={id}
			data-slot="filter-panel-checkbox-item"
			className={cn("group flex cursor-pointer items-center gap-2 px-3 py-1.5 transition-colors duration-150 ease-out hover:bg-muted", disabled && "cursor-not-allowed opacity-50", className)}
			style={depth > 0 ? { paddingLeft: `${12 + depth * 16}px` } : undefined}
		>
			{icon && <span className="flex size-4 shrink-0 items-center justify-center text-fg-muted">{icon}</span>}
			<CheckboxPrimitive.Root
				id={id}
				checked={checked}
				defaultChecked={defaultChecked}
				onCheckedChange={onCheckedChange}
				disabled={disabled}
				className={cn(
					"flex size-3.5 shrink-0 items-center justify-center rounded-[3px] border transition-colors",
					"border-edge/60 bg-card",
					"data-checked:bg-brand data-checked:border-brand data-checked:text-brand-fg",
					"focus-visible:border-brand focus-visible:ring-brand/20 focus-visible:ring-[3px] outline-none"
				)}
			>
				<CheckboxPrimitive.Indicator className="grid place-content-center text-current">
					<CheckIcon className="size-2.5" strokeWidth={3} />
				</CheckboxPrimitive.Indicator>
			</CheckboxPrimitive.Root>
			<span className="flex-1 text-[13px] text-fg">{label}</span>
			{count !== undefined && <span className="tabular-nums text-[13px] text-fg-muted">{count}</span>}
		</label>
	)
}

// ---------------------------------------------------------------------------
// FilterPanelTreeItem — Collapsible parent with nested children
// ---------------------------------------------------------------------------

interface FilterPanelTreeItemProps {
	label: string
	count?: number
	icon?: React.ReactNode
	/** Controlled open state */
	open?: boolean
	/** Default open state (uncontrolled) @default true */
	defaultOpen?: boolean
	/** Callback when open state changes */
	onOpenChange?: (open: boolean) => void
	children: React.ReactNode
	className?: string
}

function FilterPanelTreeItem({ label, count, icon, open, defaultOpen = true, onOpenChange, children, className }: FilterPanelTreeItemProps) {
	return (
		<CollapsiblePrimitive.Root data-slot="filter-panel-tree-item" open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange} className={cn("flex flex-col", className)}>
			<CollapsiblePrimitive.Trigger className={cn("group/tree flex cursor-pointer items-center gap-2 px-3 py-1.5 transition-colors duration-150 ease-out hover:bg-muted")}>
				<ChevronRightIcon className="size-3 shrink-0 text-fg-muted transition-transform duration-150 ease-out group-data-[panel-open]/tree:rotate-90" />
				{icon && <span className="flex size-4 shrink-0 items-center justify-center text-fg-muted">{icon}</span>}
				<span className="flex-1 text-left text-[13px] text-fg">{label}</span>
				{count !== undefined && <span className="tabular-nums text-[13px] text-fg-muted">{count}</span>}
			</CollapsiblePrimitive.Trigger>
			<CollapsiblePrimitive.Panel className="flex flex-col overflow-hidden transition-all duration-150 ease-out data-[ending-style]:h-0 data-[starting-style]:h-0">
				{children}
			</CollapsiblePrimitive.Panel>
		</CollapsiblePrimitive.Root>
	)
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export { FilterPanel, FilterPanelHeader, FilterPanelTabs, FilterPanelActions, FilterPanelAction, FilterPanelSection, FilterPanelCheckboxItem, FilterPanelTreeItem }

export type {
	FilterPanelProps,
	FilterPanelHeaderProps,
	FilterPanelTabsProps,
	FilterPanelActionsProps,
	FilterPanelActionProps,
	FilterPanelSectionProps,
	FilterPanelCheckboxItemProps,
	FilterPanelTreeItemProps,
}
