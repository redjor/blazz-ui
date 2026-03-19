"use client"

import type {
	BulkAction,
	DataTableColumnDef,
	DataTableView,
	RowAction,
} from "@blazz/pro/components/blocks/data-table"
import { DataTable } from "@blazz/pro/components/blocks/data-table"
import { Bleed } from "@blazz/ui/components/ui/bleed"
import { Button } from "@blazz/ui/components/ui/button"
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import {
	Ban,
	CheckCircle2,
	CircleDashed,
	CircleDollarSign,
	CircleDot,
	CircleFadingArrowUp,
	Pencil,
	Receipt,
	Send,
	Trash2,
} from "lucide-react"
import { useMemo } from "react"
import { toast } from "sonner"
import type { Doc, Id } from "@/convex/_generated/dataModel"
import { formatMinutes } from "@/lib/format"
import { getAllowedTransitions, getEffectiveStatus } from "@/lib/time-entry-status"

type TimeEntryRaw = Doc<"timeEntries">
type TimeEntry = TimeEntryRaw & { dateRange: string }

const statusConfig: Record<
	string,
	{ dot: string; icon: typeof CircleDashed; iconClass: string; tint: string; label: string }
> = {
	draft: {
		dot: "bg-violet-500",
		icon: CircleDashed,
		iconClass: "text-violet-500",
		tint: "oklch(0.65 0.15 300 / 0.08)",
		label: "À valider",
	},
	ready_to_invoice: {
		dot: "bg-amber-500",
		icon: CircleFadingArrowUp,
		iconClass: "text-amber-500",
		tint: "oklch(0.75 0.15 85 / 0.08)",
		label: "Prêt à facturer",
	},
	invoiced: {
		dot: "bg-blue-500",
		icon: CircleDollarSign,
		iconClass: "text-blue-500",
		tint: "oklch(0.65 0.15 250 / 0.08)",
		label: "Facturé",
	},
	paid: {
		dot: "bg-green-500",
		icon: CheckCircle2,
		iconClass: "text-green-500",
		tint: "oklch(0.70 0.15 150 / 0.08)",
		label: "Payé",
	},
}

export { statusConfig }
export type { TimeEntry, TimeEntryRaw }

interface TimeListViewProps {
	data: TimeEntry[]
	paginationStatus: "LoadingFirstPage" | "LoadingMore" | "CanLoadMore" | "Exhausted"
	loadMore: (count: number) => void
	projectMap: Map<string, string>
	projectOptions: Array<{ label: string; value: string }>
	onEdit: (entry: TimeEntryRaw) => void
	// biome-ignore lint: accept Convex ReactMutation shape
	setStatus: (args: any) => Promise<any>
	// biome-ignore lint: accept Convex ReactMutation shape
	remove: (args: any) => Promise<any>
}

export function TimeListView({
	data,
	paginationStatus,
	loadMore,
	projectMap,
	projectOptions,
	onEdit,
	setStatus,
	remove,
}: TimeListViewProps) {
	const columns = useMemo<DataTableColumnDef<TimeEntry>[]>(
		() => [
			{
				id: "status",
				accessorFn: (row) => getEffectiveStatus(row),
				header: "Statut",
				cell: ({ row }) => {
					if (!row.getIsGrouped()) return null
					const s = getEffectiveStatus(row.original)
					const cfg = s ? statusConfig[s] : null
					const Icon = cfg?.icon ?? Ban
					return (
						<span className="flex items-center gap-1.5 text-xs font-medium text-fg">
							<Icon className={`size-3.5 ${cfg?.iconClass ?? "text-fg-muted"}`} />
							{cfg ? cfg.label : "Non facturable"}
						</span>
					)
				},
				enableSorting: false,
				filterConfig: {
					type: "select",
					options: [
						{ label: "Non facturable", value: null },
						{ label: "À valider", value: "draft" },
						{ label: "Prêt à facturer", value: "ready_to_invoice" },
						{ label: "Facturé", value: "invoiced" },
						{ label: "Payé", value: "paid" },
					],
					showInlineFilter: true,
					defaultInlineFilter: true,
					filterLabel: "Statut",
				},
			},
			{
				accessorKey: "date",
				header: "Date",
				enableSorting: true,
				filterConfig: {
					type: "date",
					showInlineFilter: true,
					defaultInlineFilter: false,
					filterLabel: "Date",
				},
			},
			{
				accessorKey: "dateRange",
				header: "Période",
				filterConfig: {
					type: "select",
					options: [
						{ label: "Cette semaine", value: "this_week" },
						{ label: "Semaine dernière", value: "last_week" },
						{ label: "Ce mois", value: "this_month" },
						{ label: "Mois dernier", value: "last_month" },
					],
					showInlineFilter: true,
					defaultInlineFilter: true,
					filterLabel: "Période",
				},
			},
			{
				accessorKey: "description",
				header: "Description",
				filterConfig: {
					type: "text",
					placeholder: "Rechercher…",
					showInlineFilter: true,
					defaultInlineFilter: false,
					filterLabel: "Description",
				},
			},
			{
				id: "tags",
				accessorFn: (row) => (row.tags ?? []).join(", "),
				header: "Tags",
				cell: ({ row }) => {
					const tags = row.original.tags
					if (!tags || tags.length === 0) return <span className="text-fg-muted">—</span>
					return (
						<span className="flex gap-1 flex-wrap">
							{tags.map((tag) => (
								<span
									key={tag}
									className="inline-block rounded-full bg-surface-3 px-1.5 py-0 text-[11px] text-fg-muted"
								>
									{tag}
								</span>
							))}
						</span>
					)
				},
				enableSorting: false,
			},
			{
				accessorKey: "minutes",
				header: "Durée",
				enableSorting: true,
			},
			{
				id: "project",
				accessorFn: (row) => projectMap.get(row.projectId) ?? "",
				header: "Projet",
				enableSorting: true,
				filterConfig: {
					type: "select",
					options: projectOptions,
					showInlineFilter: true,
					defaultInlineFilter: true,
					filterLabel: "Projet",
				},
			},
		],
		[projectMap, projectOptions]
	)

	const views = useMemo<DataTableView[]>(
		() => [
			{
				id: "all",
				name: "Tout",
				isSystem: true,
				isDefault: true,
				filters: { id: "root", operator: "AND", conditions: [] },
				sorting: [{ id: "date", desc: true }],
			},
			{
				id: "draft",
				name: "À valider",
				isSystem: true,
				filters: {
					id: "draft-filter",
					operator: "AND",
					conditions: [
						{ id: "draft-cond", column: "status", operator: "equals", value: "draft", type: "select" },
					],
				},
				sorting: [{ id: "date", desc: true }],
			},
			{
				id: "ready",
				name: "Prêt à facturer",
				isSystem: true,
				filters: {
					id: "ready-filter",
					operator: "AND",
					conditions: [
						{ id: "ready-cond", column: "status", operator: "equals", value: "ready_to_invoice", type: "select" },
					],
				},
				sorting: [{ id: "date", desc: true }],
			},
			{
				id: "invoiced",
				name: "Facturé",
				isSystem: true,
				filters: {
					id: "invoiced-filter",
					operator: "AND",
					conditions: [
						{ id: "invoiced-cond", column: "status", operator: "equals", value: "invoiced", type: "select" },
					],
				},
				sorting: [{ id: "date", desc: true }],
			},
			{
				id: "paid",
				name: "Payé",
				isSystem: true,
				filters: {
					id: "paid-filter",
					operator: "AND",
					conditions: [
						{ id: "paid-cond", column: "status", operator: "equals", value: "paid", type: "select" },
					],
				},
				sorting: [{ id: "date", desc: true }],
			},
			{
				id: "non-billable",
				name: "Non facturable",
				isSystem: true,
				filters: {
					id: "non-billable-filter",
					operator: "AND",
					conditions: [
						{ id: "non-billable-cond", column: "status", operator: "equals", value: null, type: "select" },
					],
				},
				sorting: [{ id: "date", desc: true }],
			},
		],
		[]
	)

	const rowActions = useMemo<RowAction<TimeEntry>[]>(
		() => [
			{
				id: "edit",
				label: "Modifier",
				icon: Pencil,
				handler: (row) => onEdit(row.original),
			},
			{
				id: "mark-ready",
				label: "Prêt à facturer",
				hidden: (row) => getEffectiveStatus(row.original) !== "draft",
				handler: async (row) => {
					try {
						await setStatus({ ids: [row.original._id], status: "ready_to_invoice" })
						toast.success("Marqué prêt à facturer")
					} catch {
						toast.error("Erreur")
					}
				},
			},
			{
				id: "revert-to-draft",
				label: "Remettre à valider",
				hidden: (row) => !getAllowedTransitions(getEffectiveStatus(row.original)).includes("draft"),
				handler: async (row) => {
					try {
						await setStatus({ ids: [row.original._id], status: "draft" })
						toast.success("Remis à valider")
					} catch {
						toast.error("Erreur")
					}
				},
			},
			{
				id: "mark-invoiced",
				label: "Marquer facturé",
				hidden: (row) => !getAllowedTransitions(getEffectiveStatus(row.original)).includes("invoiced"),
				handler: async (row) => {
					try {
						await setStatus({ ids: [row.original._id], status: "invoiced" })
						toast.success("Marqué facturé")
					} catch {
						toast.error("Erreur")
					}
				},
			},
			{
				id: "revert-to-ready",
				label: "Revenir à prêt à facturer",
				hidden: (row) => getEffectiveStatus(row.original) !== "invoiced",
				handler: async (row) => {
					try {
						await setStatus({ ids: [row.original._id], status: "ready_to_invoice" })
						toast.success("Revenu à prêt à facturer")
					} catch {
						toast.error("Erreur")
					}
				},
			},
			{
				id: "mark-paid",
				label: "Marquer payé",
				hidden: (row) => !getAllowedTransitions(getEffectiveStatus(row.original)).includes("paid"),
				handler: async (row) => {
					try {
						await setStatus({ ids: [row.original._id], status: "paid" })
						toast.success("Marqué payé")
					} catch {
						toast.error("Erreur")
					}
				},
			},
			{
				id: "delete",
				label: "Supprimer",
				icon: Trash2,
				variant: "destructive",
				separator: true,
				requireConfirmation: true,
				confirmationMessage: () => "Supprimer cette entrée ? Cette action est irréversible.",
				handler: async (row) => {
					try {
						await remove({ id: row.original._id })
						toast.success("Entrée supprimée")
					} catch {
						toast.error("Erreur lors de la suppression")
					}
				},
			},
		],
		[onEdit, setStatus, remove]
	)

	const bulkActions = useMemo<BulkAction<TimeEntry>[]>(
		() => [
			{
				id: "mark-ready",
				label: "Prêt à facturer",
				icon: Send,
				handler: async (rows) => {
					try {
						await setStatus({ ids: rows.map((r) => r.original._id), status: "ready_to_invoice" })
						toast.success(`${rows.length} entrée(s) marquée(s) prêt à facturer`)
					} catch {
						toast.error("Erreur")
					}
				},
			},
			{
				id: "mark-invoiced",
				label: "Facturé",
				icon: Receipt,
				handler: async (rows) => {
					try {
						await setStatus({ ids: rows.map((r) => r.original._id), status: "invoiced" })
						toast.success(`${rows.length} entrée(s) marquée(s) facturée(s)`)
					} catch {
						toast.error("Erreur")
					}
				},
			},
			{
				id: "mark-paid",
				label: "Payé",
				icon: CheckCircle2,
				handler: async (rows) => {
					try {
						await setStatus({ ids: rows.map((r) => r.original._id), status: "paid" })
						toast.success(`${rows.length} entrée(s) marquée(s) payée(s)`)
					} catch {
						toast.error("Erreur")
					}
				},
			},
			{
				id: "delete",
				label: "Supprimer",
				icon: Trash2,
				variant: "destructive",
				requireConfirmation: true,
				confirmationMessage: (count) =>
					`Supprimer ${count} entrée(s) ? Cette action est irréversible.`,
				handler: async (rows) => {
					try {
						await Promise.all(rows.map((r) => remove({ id: r.original._id })))
						toast.success(`${rows.length} entrée(s) supprimée(s)`)
					} catch {
						toast.error("Erreur lors de la suppression")
					}
				},
			},
		],
		[setStatus, remove]
	)

	return (
		<>
			<Bleed marginInline="600">
				<DataTable
					data={data}
					columns={columns}
					views={views}
					rowActions={rowActions}
					bulkActions={bulkActions}
					isLoading={paginationStatus === "LoadingFirstPage"}
					toolbarLayout="stacked"
					enableSorting
					enableGlobalSearch
					enableAdvancedFilters
					enableCustomViews
					enableRowSelection
					enableGrouping
					defaultGrouping={["status"]}
					defaultExpanded
					groupRowStyle={(row) => {
						const s = row.getValue("status") as string | null
						const cfg = s ? statusConfig[s] : null
						return cfg ? { background: cfg.tint } : undefined
					}}
					groupAggregations={{
						minutes: (values) => {
							const total = (values as number[]).reduce((a, b) => a + b, 0)
							return (
								<span className="font-mono text-xs tabular-nums">{formatMinutes(total)}</span>
							)
						},
					}}
					enablePagination={false}
					searchPlaceholder="Rechercher une entrée…"
					locale="fr"
					variant="flat"
					storageKey="ops-time-entries"
					defaultSorting={[{ id: "date", desc: true }]}
					renderRow={(row) => {
						const entry = row.original
						const s = getEffectiveStatus(entry)
						const cfg = s ? statusConfig[s] : null
						return (
							<>
								<div className="flex min-w-0 flex-1 items-center gap-3">
									<span
										className="text-fg-muted whitespace-nowrap"
										style={{ fontSize: 13, minWidth: 52 }}
									>
										{format(new Date(`${entry.date}T00:00:00`), "dd MMM", { locale: fr })}
									</span>
									{(() => {
										const Icon = cfg?.icon ?? Ban
										return (
											<Icon
												className={`size-3.5 shrink-0 ${cfg?.iconClass ?? "text-fg-muted"}`}
											/>
										)
									})()}
									<span className="font-mono text-xs tabular-nums text-fg whitespace-nowrap">
										{formatMinutes(entry.minutes)}
									</span>
									<span
										className={`truncate text-fg-muted ${!entry.description ? "italic" : ""}`}
										style={{ fontSize: 13 }}
									>
										{entry.description || "Pas de description"}
									</span>
								</div>
								<div className="flex shrink-0 items-center gap-3">
									<span className="inline-flex items-center rounded-full bg-surface-3/70 px-2 py-0.5 text-[11px] text-fg-muted whitespace-nowrap">
										{projectMap.get(entry.projectId) ?? "—"}
									</span>
								</div>
							</>
						)
					}}
				/>
			</Bleed>
			{paginationStatus === "CanLoadMore" && (
				<InlineStack align="center" className="pt-1">
					<Button
						type="button"
						variant="outline"
						size="sm"
						className="h-7 px-3 text-xs"
						onClick={() => loadMore(100)}
					>
						Charger plus d'entrées
					</Button>
				</InlineStack>
			)}
		</>
	)
}
