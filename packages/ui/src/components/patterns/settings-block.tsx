import type * as React from "react"

import { cn } from "../../lib/utils"

/**
 * SettingsPage — Top-level wrapper for a settings page.
 * Centers content with a max-width and consistent spacing.
 *
 * @example
 * ```tsx
 * <SettingsPage>
 *   <SettingsHeader
 *     title="Settings"
 *     description="Manage your account preferences"
 *   />
 *   <SettingsSection title="General">
 *     <SettingsItem label="Language" description="Choose your preferred language">
 *       <Select>...</Select>
 *     </SettingsItem>
 *   </SettingsSection>
 * </SettingsPage>
 * ```
 */
function SettingsPage({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="settings-page"
			className={cn("mx-auto w-full max-w-2xl space-y-8 px-6 py-8", className)}
			{...props}
		/>
	)
}

/**
 * SettingsHeader — Page-level header with title and optional description.
 */
function SettingsHeader({
	className,
	title,
	description,
	children,
	...props
}: React.ComponentProps<"div"> & {
	title: React.ReactNode
	description?: React.ReactNode
}) {
	return (
		<div data-slot="settings-header" className={cn("space-y-1", className)} {...props}>
			<div className="flex items-center justify-between">
				<h1 className="text-xl font-semibold text-fg">{title}</h1>
				{children}
			</div>
			{description && <p className="text-sm text-fg-muted">{description}</p>}
		</div>
	)
}

/**
 * SettingsSection — A group of related settings with a title and optional description.
 * Renders items inside a bordered card-like container.
 */
function SettingsSection({
	className,
	title,
	description,
	children,
	...props
}: React.ComponentProps<"section"> & {
	title: string
	description?: string
}) {
	return (
		<section data-slot="settings-section" className={cn("space-y-3", className)} {...props}>
			<div className="space-y-1 px-1">
				<h2 className="text-sm font-semibold text-fg">{title}</h2>
				{description && <p className="text-xs text-fg-muted">{description}</p>}
			</div>
			<div className="divide-y divide-separator rounded-lg border border-container bg-surface">
				{children}
			</div>
		</section>
	)
}

/**
 * SettingsItem — A single settings row with label, description, and a trailing control.
 *
 * Children are rendered on the right side (e.g., Switch, Select, Button).
 *
 * @example
 * ```tsx
 * <SettingsItem label="Dark mode" description="Toggle dark appearance">
 *   <Switch />
 * </SettingsItem>
 * ```
 */
function SettingsItem({
	className,
	label,
	description,
	icon,
	children,
	...props
}: React.ComponentProps<"div"> & {
	label: string
	description?: string
	icon?: React.ReactNode
}) {
	return (
		<div
			data-slot="settings-item"
			className={cn(
				"flex items-center justify-between gap-4 px-4 py-3",
				"first:rounded-t-lg last:rounded-b-lg",
				className
			)}
			{...props}
		>
			<div className="flex items-center gap-3 min-w-0">
				{icon && (
					<div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-surface-3 text-fg-muted [&_svg]:size-4">
						{icon}
					</div>
				)}
				<div className="min-w-0 space-y-0.5">
					<div className="text-sm font-medium text-fg">{label}</div>
					{description && (
						<div className="text-xs text-fg-muted leading-snug">{description}</div>
					)}
				</div>
			</div>
			{children && (
				<div className="flex shrink-0 items-center gap-2">{children}</div>
			)}
		</div>
	)
}

/**
 * SettingsDanger — A danger zone section with red-tinted styling.
 * Use for destructive actions like account deletion.
 *
 * @example
 * ```tsx
 * <SettingsDanger
 *   title="Danger zone"
 *   description="Irreversible actions"
 * >
 *   <SettingsItem label="Delete account" description="Permanently delete your account and data">
 *     <Button variant="danger" size="sm">Delete</Button>
 *   </SettingsItem>
 * </SettingsDanger>
 * ```
 */
function SettingsDanger({
	className,
	title = "Danger zone",
	description,
	children,
	...props
}: React.ComponentProps<"section"> & {
	title?: string
	description?: string
}) {
	return (
		<section data-slot="settings-danger" className={cn("space-y-3", className)} {...props}>
			<div className="space-y-1 px-1">
				<h2 className="text-sm font-semibold text-negative">{title}</h2>
				{description && <p className="text-xs text-fg-muted">{description}</p>}
			</div>
			<div className="divide-y divide-separator rounded-lg border border-negative/25 bg-negative/5">
				{children}
			</div>
		</section>
	)
}

export { SettingsPage, SettingsHeader, SettingsSection, SettingsItem, SettingsDanger }
