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
 *     <Item>
 *       <ItemMedia variant="icon"><Globe /></ItemMedia>
 *       <ItemContent>
 *         <ItemTitle>Language</ItemTitle>
 *         <ItemDescription>Choose your preferred language</ItemDescription>
 *       </ItemContent>
 *       <ItemActions><Select>...</Select></ItemActions>
 *     </Item>
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
 * Renders children (use Item components) inside a bordered card with dividers.
 *
 * @example
 * ```tsx
 * <SettingsSection title="Notifications" description="Configure how you receive alerts">
 *   <Item>
 *     <ItemContent>
 *       <ItemTitle>Email notifications</ItemTitle>
 *       <ItemDescription>Receive updates via email</ItemDescription>
 *     </ItemContent>
 *     <ItemActions><Switch /></ItemActions>
 *   </Item>
 * </SettingsSection>
 * ```
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
			<div className="divide-y divide-separator rounded-lg border border-container bg-surface [&>[data-slot=item]]:rounded-none [&>:first-child[data-slot=item]]:rounded-t-lg [&>:last-child[data-slot=item]]:rounded-b-lg">
				{children}
			</div>
		</section>
	)
}

/**
 * SettingsDanger — A danger zone section with red-tinted styling.
 * Use for destructive actions like account deletion.
 * Children should be Item components.
 *
 * @example
 * ```tsx
 * <SettingsDanger title="Danger zone" description="Irreversible actions">
 *   <Item>
 *     <ItemContent>
 *       <ItemTitle>Delete account</ItemTitle>
 *       <ItemDescription>Permanently delete your account and data</ItemDescription>
 *     </ItemContent>
 *     <ItemActions><Button variant="danger" size="sm">Delete</Button></ItemActions>
 *   </Item>
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
			<div className="divide-y divide-separator rounded-lg border border-negative/25 bg-negative/5 [&>[data-slot=item]]:rounded-none [&>:first-child[data-slot=item]]:rounded-t-lg [&>:last-child[data-slot=item]]:rounded-b-lg">
				{children}
			</div>
		</section>
	)
}

export { SettingsPage, SettingsHeader, SettingsSection, SettingsDanger }
