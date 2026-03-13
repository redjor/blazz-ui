import type { Row } from "@tanstack/react-table"
import { Archive, CheckCircle, Edit, Eye, Trash } from "lucide-react"
import type { BulkAction, RowAction } from "../data-table.types"

/**
 * Configuration for createCRUDActions factory
 */
export interface CRUDActionsConfig<TData> {
	/** Handler for viewing a single item (optional) */
	onView?: (item: TData) => void | Promise<void>
	/** Handler for editing a single item (optional) */
	onEdit?: (item: TData) => void | Promise<void>
	/** Handler for deleting a single item (optional) */
	onDelete?: (item: TData) => void | Promise<void>
	/** Handler for archiving a single item (optional) */
	onArchive?: (item: TData) => void | Promise<void>
	/** Custom confirmation message for delete (can be function) */
	deleteConfirmation?: string | ((row: Row<TData>) => string)
	/** Custom confirmation message for archive (can be function) */
	archiveConfirmation?: string | ((row: Row<TData>) => string)
	/** Function to hide archive action for specific rows */
	hideArchive?: (row: Row<TData>) => boolean
	/** Function to hide delete action for specific rows */
	hideDelete?: (row: Row<TData>) => boolean
	/** Function to hide edit action for specific rows */
	hideEdit?: (row: Row<TData>) => boolean
	/** Function to hide view action for specific rows */
	hideView?: (row: Row<TData>) => boolean
	/** Custom labels for actions */
	labels?: {
		view?: string
		edit?: string
		delete?: string
		archive?: string
	}
}

/**
 * Creates a standard set of CRUD actions (View, Edit, Delete, Archive).
 * Only includes actions for which handlers are provided.
 *
 * @example
 * ```typescript
 * const rowActions = createCRUDActions<Product>({
 *   onView: (product) => router.push(`/products/${product.id}`),
 *   onEdit: (product) => router.push(`/products/${product.id}/edit`),
 *   onArchive: async (product) => await archiveProduct(product.id),
 *   archiveConfirmation: (row) => `Archive ${row.original.name}?`,
 *   hideArchive: (row) => row.original.status === "archived",
 *   labels: {
 *     view: "View Details",
 *     edit: "Edit Product",
 *     archive: "Archive Product",
 *   },
 * })
 * ```
 */
export function createCRUDActions<TData>(config: CRUDActionsConfig<TData>): RowAction<TData>[] {
	const {
		onView,
		onEdit,
		onDelete,
		onArchive,
		deleteConfirmation = "Are you sure you want to delete this item?",
		archiveConfirmation = "Are you sure you want to archive this item?",
		hideArchive,
		hideDelete,
		hideEdit,
		hideView,
		labels = {},
	} = config

	const actions: RowAction<TData>[] = []

	// View action
	if (onView) {
		actions.push({
			id: "view",
			label: labels.view || "View Details",
			icon: Eye,
			variant: "ghost",
			handler: (row) => onView(row.original),
			hidden: hideView,
		})
	}

	// Edit action
	if (onEdit) {
		actions.push({
			id: "edit",
			label: labels.edit || "Edit",
			icon: Edit,
			variant: "ghost",
			handler: (row) => onEdit(row.original),
			hidden: hideEdit,
		})
	}

	// Archive action (with separator if there are previous actions)
	if (onArchive) {
		actions.push({
			id: "archive",
			label: labels.archive || "Archive",
			icon: Archive,
			variant: "ghost",
			separator: actions.length > 0,
			requireConfirmation: true,
			confirmationMessage:
				typeof archiveConfirmation === "function"
					? (row) => archiveConfirmation(row)
					: archiveConfirmation,
			handler: (row) => onArchive(row.original),
			hidden: hideArchive,
		})
	}

	// Delete action (always has separator if there are previous actions)
	if (onDelete) {
		actions.push({
			id: "delete",
			label: labels.delete || "Delete",
			icon: Trash,
			variant: "destructive",
			separator: actions.length > 0,
			requireConfirmation: true,
			confirmationMessage:
				typeof deleteConfirmation === "function"
					? (row) => deleteConfirmation(row)
					: deleteConfirmation,
			handler: (row) => onDelete(row.original),
			hidden: hideDelete,
		})
	}

	return actions
}

/**
 * Configuration for createBulkActions factory
 */
export interface BulkActionsConfig<TData> {
	/** Handler for activating multiple items (optional) */
	onActivate?: (items: TData[]) => void | Promise<void>
	/** Handler for archiving multiple items (optional) */
	onArchive?: (items: TData[]) => void | Promise<void>
	/** Handler for deleting multiple items (optional) */
	onDelete?: (items: TData[]) => void | Promise<void>
	/** Custom handler with manual action definition (optional) */
	customActions?: Array<{
		id: string
		label: string
		icon?: any
		variant?: "default" | "outline" | "destructive"
		handler: (items: TData[]) => void | Promise<void>
		requireConfirmation?: boolean
		confirmationMessage?: string | ((count: number) => string)
		disabled?: (items: TData[]) => boolean
	}>
	/** Custom confirmation message for archive (can be function) */
	archiveConfirmation?: string | ((count: number) => string)
	/** Custom confirmation message for delete (can be function) */
	deleteConfirmation?: string | ((count: number) => string)
	/** Custom confirmation message for activate (can be function) */
	activateConfirmation?: string | ((count: number) => string)
	/** Function to disable activate action based on selection */
	disableActivate?: (items: TData[]) => boolean
	/** Function to disable archive action based on selection */
	disableArchive?: (items: TData[]) => boolean
	/** Function to disable delete action based on selection */
	disableDelete?: (items: TData[]) => boolean
	/** Custom labels for actions */
	labels?: {
		activate?: string
		archive?: string
		delete?: string
	}
}

/**
 * Creates a standard set of bulk actions (Activate, Archive, Delete).
 * Only includes actions for which handlers are provided.
 *
 * @example
 * ```typescript
 * const bulkActions = createBulkActions<Product>({
 *   onActivate: async (products) => {
 *     const ids = products.map(p => p.id)
 *     await bulkActivateProducts(ids)
 *   },
 *   onArchive: async (products) => {
 *     const ids = products.map(p => p.id)
 *     await bulkArchiveProducts(ids)
 *   },
 *   archiveConfirmation: (count) => `Archive ${count} product(s)?`,
 *   disableActivate: (products) => products.every(p => p.status === "active"),
 *   labels: {
 *     activate: "Activate Selected",
 *     archive: "Archive Selected",
 *   },
 * })
 * ```
 */
export function createBulkActions<TData>(config: BulkActionsConfig<TData>): BulkAction<TData>[] {
	const {
		onActivate,
		onArchive,
		onDelete,
		customActions = [],
		archiveConfirmation = (count) => `Are you sure you want to archive ${count} item(s)?`,
		deleteConfirmation = (count) => `Are you sure you want to delete ${count} item(s)?`,
		activateConfirmation,
		disableActivate,
		disableArchive,
		disableDelete,
		labels = {},
	} = config

	const actions: BulkAction<TData>[] = []

	// Activate action
	if (onActivate) {
		actions.push({
			id: "activate",
			label: labels.activate || "Activate Selected",
			icon: CheckCircle,
			variant: "default",
			requireConfirmation: activateConfirmation !== undefined,
			confirmationMessage:
				typeof activateConfirmation === "function"
					? (count) => activateConfirmation(count)
					: activateConfirmation,
			handler: (rows) => onActivate(rows.map((r) => r.original)),
			disabled: disableActivate
				? (rows) => disableActivate(rows.map((r) => r.original))
				: undefined,
		})
	}

	// Archive action
	if (onArchive) {
		actions.push({
			id: "archive",
			label: labels.archive || "Archive Selected",
			icon: Archive,
			variant: "outline",
			requireConfirmation: true,
			confirmationMessage:
				typeof archiveConfirmation === "function"
					? (count) => archiveConfirmation(count)
					: archiveConfirmation,
			handler: (rows) => onArchive(rows.map((r) => r.original)),
			disabled: disableArchive ? (rows) => disableArchive(rows.map((r) => r.original)) : undefined,
		})
	}

	// Delete action
	if (onDelete) {
		actions.push({
			id: "delete",
			label: labels.delete || "Delete Selected",
			icon: Trash,
			variant: "destructive",
			requireConfirmation: true,
			confirmationMessage:
				typeof deleteConfirmation === "function"
					? (count) => deleteConfirmation(count)
					: deleteConfirmation,
			handler: (rows) => onDelete(rows.map((r) => r.original)),
			disabled: disableDelete ? (rows) => disableDelete(rows.map((r) => r.original)) : undefined,
		})
	}

	// Add custom actions
	customActions.forEach((action) => {
		actions.push({
			id: action.id,
			label: action.label,
			icon: action.icon,
			variant: action.variant || "outline",
			requireConfirmation: action.requireConfirmation || false,
			confirmationMessage: action.confirmationMessage,
			handler: (rows) => action.handler(rows.map((r) => r.original)),
			disabled: action.disabled
				? (rows) => action.disabled?.(rows.map((r) => r.original)) ?? false
				: undefined,
		})
	})

	return actions
}

/**
 * Configuration for a custom single action (advanced usage)
 */
export interface CustomRowActionConfig<TData> {
	/** Unique ID */
	id: string
	/** Display label */
	label: string
	/** Optional icon */
	icon?: any
	/** Visual variant */
	variant?: "default" | "outline" | "ghost" | "destructive"
	/** Handler function */
	handler: (item: TData) => void | Promise<void>
	/** Function to conditionally hide */
	hidden?: (item: TData) => boolean
	/** Function to conditionally disable */
	disabled?: (item: TData) => boolean
	/** Require confirmation dialog */
	requireConfirmation?: boolean
	/** Confirmation message */
	confirmationMessage?: string | ((item: TData) => string)
	/** Show visual separator */
	separator?: boolean
	/** Keyboard shortcut (display only) */
	shortcut?: string
}

/**
 * Creates a custom single row action with full control.
 * For advanced usage when createCRUDActions doesn't fit.
 *
 * @example
 * ```typescript
 * const customAction = createCustomRowAction<Product>({
 *   id: "duplicate",
 *   label: "Duplicate",
 *   icon: Copy,
 *   handler: async (product) => await duplicateProduct(product.id),
 *   disabled: (product) => product.status === "archived",
 * })
 * ```
 */
export function createCustomRowAction<TData>(
	config: CustomRowActionConfig<TData>
): RowAction<TData> {
	const {
		id,
		label,
		icon,
		variant = "ghost",
		handler,
		hidden,
		disabled,
		requireConfirmation = false,
		confirmationMessage,
		separator = false,
		shortcut,
	} = config

	return {
		id,
		label,
		icon,
		variant,
		handler: (row) => handler(row.original),
		hidden: hidden ? (row) => hidden(row.original) : undefined,
		disabled: disabled ? (row) => disabled(row.original) : undefined,
		requireConfirmation,
		confirmationMessage:
			typeof confirmationMessage === "function"
				? (row) => confirmationMessage(row.original)
				: confirmationMessage,
		separator,
		shortcut,
	}
}
