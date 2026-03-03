'use client'

import { DataTableColumnHeader } from '@blazz/ui/components/blocks/data-table/data-table-column-header'
import { col } from '@blazz/ui/components/blocks/data-table/factories/col'
import { createStatusViews } from '@blazz/ui/components/blocks/data-table/factories/view-builders'
import { createCRUDActions, createBulkActions } from '@blazz/ui/components/blocks/data-table/factories/action-builders'
import type { BulkAction, DataTableColumnDef, DataTableView, RowAction } from '@blazz/ui/components/blocks/data-table'
import { getCategoryColorClasses } from './manage-categories-sheet'
import type { Id } from '@/convex/_generated/dataModel'

// Local type — mirrors Doc<"todos"> fields we need, plus resolved projectName
export interface Todo {
	_id: Id<"todos">
	text: string
	description?: string
	status: "triage" | "todo" | "in_progress" | "done"
	priority?: "urgent" | "high" | "normal" | "low"
	projectId?: string
	projectName?: string
	categoryId?: Id<"categories">
	categoryName?: string
	categoryColor?: string
	tags?: string[]
	createdAt: number
}

export interface TodosPresetConfig {
	onEdit?: (todo: Todo) => void
	onDelete?: (todo: Todo) => void
	onBulkDelete?: (todos: Todo[]) => void
}

export interface TodosPreset {
	columns: DataTableColumnDef<Todo>[]
	views: DataTableView[]
	rowActions: RowAction<Todo>[]
	bulkActions: BulkAction<Todo>[]
}

/* ─── Color Maps ─── */

const priorityBarMap: Record<string, string> = {
	urgent: 'bg-destructive',
	high: 'bg-orange-500',
	normal: 'bg-edge',
	low: 'bg-fg-muted/30',
}

const statusDotMap: Record<string, string> = {
	triage: 'bg-zinc-400',
	todo: 'bg-zinc-500',
	in_progress: 'bg-yellow-500',
	done: 'bg-green-500',
}

const statusLabelMap: Record<string, string> = {
	triage: 'Triage',
	todo: 'Todo',
	in_progress: 'En cours',
	done: 'Fait',
}

export function createTodosPreset(config: TodosPresetConfig = {}): TodosPreset {
	const { onEdit, onDelete, onBulkDelete } = config

	const columns: DataTableColumnDef<Todo>[] = [
		// Priority — colored vertical bar, no label (Tufte: data-ink)
		{
			accessorKey: 'priority',
			header: () => null,
			cell: ({ row }) => {
				const value = (row.getValue('priority') as string) ?? 'normal'
				const barClass = priorityBarMap[value] ?? 'bg-edge'
				return (
					<div className="flex items-center justify-center">
						<span className={`h-3.5 w-0.5 shrink-0 rounded-sm ${barClass}`} />
					</div>
				)
			},
			enableSorting: true,
			enableHiding: false,
			size: 24,
		} as DataTableColumnDef<Todo>,

		// Title + description (two-lines cell, blazz-ui dense style)
		{
			accessorKey: 'text',
			header: ({ column }) => <DataTableColumnHeader column={column} title="Tâche" />,
			cell: ({ row }) => {
				const text = row.getValue('text') as string
				const description = row.original.description
				return (
					<div className="flex flex-col gap-0.5 min-w-0">
						<span className="text-sm font-medium text-fg truncate">{text}</span>
						{description && (
							<span className="text-xs text-fg-muted truncate">{description}</span>
						)}
					</div>
				)
			},
			enableSorting: true,
		} as DataTableColumnDef<Todo>,

		// Status — dot 6px + label (double-coded: color + text)
		{
			accessorKey: 'status',
			header: ({ column }) => <DataTableColumnHeader column={column} title="Statut" />,
			cell: ({ row }) => {
				const value = row.getValue('status') as string
				const dotClass = statusDotMap[value] ?? 'bg-zinc-400'
				const label = statusLabelMap[value] ?? value
				return (
					<div className="flex items-center gap-1.5">
						<span className={`h-1.5 w-1.5 shrink-0 rounded-full ${dotClass}`} />
						<span className="text-sm text-fg-muted">{label}</span>
					</div>
				)
			},
			enableSorting: true,
			size: 120,
		} as DataTableColumnDef<Todo>,

		// Category — colored badge
		{
			accessorKey: 'categoryName',
			header: ({ column }) => <DataTableColumnHeader column={column} title="Catégorie" />,
			cell: ({ row }) => {
				const name = row.getValue('categoryName') as string | undefined
				const color = row.original.categoryColor
				if (!name) return <span className="text-fg-muted/40 text-sm">—</span>
				const cls = getCategoryColorClasses(color)
				return (
					<span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${cls.bg} ${cls.text}`}>
						{name}
					</span>
				)
			},
			enableSorting: true,
			size: 120,
		} as DataTableColumnDef<Todo>,

		// Tags — chips
		{
			accessorKey: 'tags',
			header: ({ column }) => <DataTableColumnHeader column={column} title="Tags" />,
			cell: ({ row }) => {
				const tags = row.getValue('tags') as string[] | undefined
				if (!tags || tags.length === 0) return <span className="text-fg-muted/40 text-sm">—</span>
				return (
					<div className="flex flex-wrap gap-1">
						{tags.map((tag) => (
							<span key={tag} className="inline-flex items-center rounded-full bg-surface px-1.5 py-0.5 text-xs text-fg-muted border border-edge">
								{tag}
							</span>
						))}
					</div>
				)
			},
			enableSorting: false,
			size: 200,
		} as DataTableColumnDef<Todo>,

		// Project — resolved name, em-dash if absent
		{
			accessorKey: 'projectName',
			header: ({ column }) => <DataTableColumnHeader column={column} title="Projet" />,
			cell: ({ row }) => {
				const name = row.getValue('projectName') as string | undefined
				return (
					<span className={`text-sm ${name ? 'text-fg-muted' : 'text-fg-muted/40'}`}>
						{name ?? '—'}
					</span>
				)
			},
			enableSorting: false,
			size: 160,
		} as DataTableColumnDef<Todo>,

		// Created at — relative date fr-FR
		col.relativeDate<Todo>('createdAt', {
			title: 'Créé',
			locale: 'fr-FR',
		}),
	]

	const views = createStatusViews({
		column: 'status',
		statuses: [
			{ id: 'triage', name: 'Triage', value: 'triage' },
			{ id: 'todo', name: 'Todo', value: 'todo' },
			{ id: 'in_progress', name: 'En cours', value: 'in_progress' },
			{ id: 'done', name: 'Fait', value: 'done' },
		],
		allViewName: 'Tous',
	})

	const rowActions = createCRUDActions<Todo>({
		onEdit,
		onDelete,
		deleteConfirmation: (row) => `Supprimer "${row.original.text}" ?`,
		labels: { edit: 'Modifier', delete: 'Supprimer' },
	})

	const bulkActions = createBulkActions<Todo>({
		onDelete: onBulkDelete,
		deleteConfirmation: (count) => `Supprimer ${count} todo(s) ?`,
		labels: { delete: 'Supprimer la sélection' },
	})

	return { columns, views, rowActions, bulkActions }
}
