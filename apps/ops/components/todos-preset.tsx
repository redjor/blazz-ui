'use client'

import { DataTableColumnHeader } from '@blazz/ui/components/blocks/data-table/data-table-column-header'
import { col } from '@blazz/ui/components/blocks/data-table/factories/col'
import { createStatusViews } from '@blazz/ui/components/blocks/data-table/factories/view-builders'
import { createCRUDActions, createBulkActions } from '@blazz/ui/components/blocks/data-table/factories/action-builders'
import type { BulkAction, DataTableColumnDef, DataTableView, RowAction } from '@blazz/ui/components/blocks/data-table'
import { isToday, isTomorrow, isPast, isThisWeek, parseISO, format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { getCategoryColorClasses } from './manage-categories-sheet'
import type { Id } from '@/convex/_generated/dataModel'

// Local type — mirrors Doc<"todos"> fields we need, plus resolved projectName
export interface Todo {
	_id: Id<"todos">
	text: string
	description?: string
	status: "triage" | "todo" | "blocked" | "in_progress" | "done"
	priority?: "urgent" | "high" | "normal" | "low"
	projectId?: string
	projectName?: string
	categoryId?: Id<"categories">
	categoryName?: string
	categoryColor?: string
	dueDate?: string
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

const statusLabelMap: Record<string, string> = {
	triage: 'Triage',
	todo: 'Todo',
	blocked: 'Bloqué',
	in_progress: 'En cours',
	done: 'Fait',
}

/* ─── Due date helpers ─── */

export function formatDueDate(dueDate: string): { label: string; overdue: boolean; className: string } {
	const date = parseISO(dueDate)
	const today = new Date()
	today.setHours(0, 0, 0, 0)

	if (isToday(date)) return { label: "Aujourd'hui", overdue: false, className: 'text-orange-500 font-medium' }
	if (isTomorrow(date)) return { label: 'Demain', overdue: false, className: 'text-fg-muted' }
	if (isPast(date)) return { label: format(date, 'd MMM', { locale: fr }), overdue: true, className: 'text-destructive font-medium' }
	if (isThisWeek(date, { weekStartsOn: 1 })) return { label: format(date, 'EEEE', { locale: fr }), overdue: false, className: 'text-fg-muted' }
	return { label: format(date, 'd MMM', { locale: fr }), overdue: false, className: 'text-fg-muted' }
}

/* ─── Linear-style status icons (SVG inline, 14×14) ─── */

export function StatusIcon({ status, className = '' }: { status: string; className?: string }) {
	const size = 14
	const cn = `shrink-0 ${className}`
	switch (status) {
		case 'triage':
			// Dashed circle — unprocessed
			return (
				<svg width={size} height={size} viewBox="0 0 14 14" fill="none" className={cn}>
					<circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2" className="text-zinc-400" />
				</svg>
			)
		case 'todo':
			// Empty circle — to do
			return (
				<svg width={size} height={size} viewBox="0 0 14 14" fill="none" className={cn}>
					<circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" className="text-zinc-500" />
				</svg>
			)
		case 'blocked':
			// Circle with horizontal line — blocked
			return (
				<svg width={size} height={size} viewBox="0 0 14 14" fill="none" className={cn}>
					<circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" className="text-red-500" />
					<line x1="4" y1="7" x2="10" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-red-500" />
				</svg>
			)
		case 'in_progress':
			// Half-filled circle — in progress
			return (
				<svg width={size} height={size} viewBox="0 0 14 14" fill="none" className={cn}>
					<circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" className="text-yellow-500" />
					<path d="M7 1.5 A5.5 5.5 0 0 1 7 12.5 Z" fill="currentColor" className="text-yellow-500" />
				</svg>
			)
		case 'done':
			// Filled circle with checkmark — done
			return (
				<svg width={size} height={size} viewBox="0 0 14 14" fill="none" className={cn}>
					<circle cx="7" cy="7" r="6" fill="currentColor" className="text-green-500" />
					<path d="M4.5 7.2 L6.2 8.9 L9.5 5.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
				</svg>
			)
		default:
			return (
				<svg width={size} height={size} viewBox="0 0 14 14" fill="none" className={cn}>
					<circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" className="text-zinc-400" />
				</svg>
			)
	}
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

		// Status — Linear-style icon + label (double-coded: shape + text)
		{
			accessorKey: 'status',
			header: ({ column }) => <DataTableColumnHeader column={column} title="Statut" />,
			cell: ({ row }) => {
				const value = row.getValue('status') as string
				const label = statusLabelMap[value] ?? value
				return (
					<div className="flex items-center gap-1.5">
						<StatusIcon status={value} />
						<span className="text-sm text-fg-muted">{label}</span>
					</div>
				)
			},
			enableSorting: true,
			size: 120,
		} as DataTableColumnDef<Todo>,

		// Due date — relative label, overdue in red
		{
			accessorKey: 'dueDate',
			header: ({ column }) => <DataTableColumnHeader column={column} title="Échéance" />,
			cell: ({ row }) => {
				const value = row.getValue('dueDate') as string | undefined
				if (!value) return <span className="text-fg-muted/40 text-sm">—</span>
				const isDone = row.original.status === 'done'
				const { label, className } = formatDueDate(value)
				return (
					<span className={`text-sm ${isDone ? 'text-fg-muted/40 line-through' : className}`}>
						{label}
					</span>
				)
			},
			enableSorting: true,
			size: 110,
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
			{ id: 'blocked', name: 'Bloqué', value: 'blocked' },
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
