"use client"

import { useAppTopBar } from "@blazz/pro/components/blocks/app-frame"
import type { BulkAction, DataTableColumnDef, DataTableView } from "@blazz/pro/components/blocks/data-table"
import { DataTable } from "@blazz/pro/components/blocks/data-table"
import { PageHeader } from "@blazz/pro/components/blocks/page-header"
import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { DateRangeSelector } from "@blazz/ui/components/ui/date-selector"
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@blazz/ui/components/ui/select"
import { useMutation, useQuery } from "convex/react"
import { endOfMonth, format, parseISO, startOfMonth, subMonths } from "date-fns"
import { fr } from "date-fns/locale"
import { CheckCircle2, Download, FileText, Receipt } from "lucide-react"
import { useMemo, useState } from "react"
import { toast } from "sonner"
import { JournalDayCard } from "@/components/journal-day-card"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { formatCurrency, formatMinutes } from "@/lib/format"
import { type EntryStatus, getEffectiveStatus } from "@/lib/time-entry-status"

// biome-ignore lint/suspicious/noExplicitAny: convex doc type
type TimeEntry = any

function getPeriodDates(preset: string): { from: string; to: string } | null {
	const now = new Date()
	if (preset === "current") {
		return {
			from: format(startOfMonth(now), "yyyy-MM-dd"),
			to: format(endOfMonth(now), "yyyy-MM-dd"),
		}
	}
	if (preset === "last") {
		const last = subMonths(now, 1)
		return {
			from: format(startOfMonth(last), "yyyy-MM-dd"),
			to: format(endOfMonth(last), "yyyy-MM-dd"),
		}
	}
	return null
}

const statusConfig: Record<EntryStatus, { dot: string; tint: string; label: string }> = {
	draft: {
		dot: "bg-fg-muted",
		tint: "oklch(0.55 0 0 / 0.06)",
		label: "Brouillon",
	},
	ready_to_invoice: {
		dot: "bg-amber-500",
		tint: "oklch(0.75 0.15 80 / 0.08)",
		label: "Prêt à facturer",
	},
	invoiced: {
		dot: "bg-blue-500",
		tint: "oklch(0.65 0.15 260 / 0.08)",
		label: "Facturé",
	},
	paid: {
		dot: "bg-green-500",
		tint: "oklch(0.70 0.15 150 / 0.08)",
		label: "Payé",
	},
}

export default function RecapPageClient() {
	const [clientId, setClientId] = useState<string>("")
	const [projectId, setProjectId] = useState<string>("")
	const [period, setPeriod] = useState("current")
	const [from, setFrom] = useState(format(startOfMonth(new Date()), "yyyy-MM-dd"))
	const [to, setTo] = useState(format(endOfMonth(new Date()), "yyyy-MM-dd"))

	const setStatus = useMutation(api.timeEntries.setStatus)

	const clients = useQuery(api.clients.list)
	const clientProjects = useQuery(api.projects.listByClient, clientId ? { clientId: clientId as Id<"clients"> } : "skip")
	const allProjects = useQuery(api.projects.listAll)

	const periodDates = period !== "custom" ? getPeriodDates(period) : { from, to }

	const entries = useQuery(api.timeEntries.listForRecap, {
		projectId: projectId ? (projectId as Id<"projects">) : undefined,
		from: periodDates?.from,
		to: periodDates?.to,
		includeInvoiced: true,
	})

	// Filter by client client-side if client selected but no project selected
	const filteredByClient = useMemo(() => {
		if (!projectId && clientId && clientProjects) {
			return entries?.filter((e: TimeEntry) => clientProjects.some((p) => p._id === e.projectId))
		}
		return entries
	}, [entries, projectId, clientId, clientProjects])

	// Project name map
	const projectMap = useMemo(() => {
		const map = new Map<string, string>()
		for (const p of allProjects ?? []) {
			map.set(p._id, p.name)
		}
		return map
	}, [allProjects])

	const projectOptions = useMemo(() => (allProjects ?? []).map((p) => ({ label: p.name, value: p._id })), [allProjects])

	// ---------------------------------------------------------------------------
	// Columns
	// ---------------------------------------------------------------------------

	const columns = useMemo<DataTableColumnDef<TimeEntry>[]>(
		() => [
			{
				id: "status",
				accessorFn: (row: TimeEntry) => getEffectiveStatus(row),
				header: "Statut",
				cell: ({ row }) => {
					if (!row.getIsGrouped()) return null
					const s = getEffectiveStatus(row.original) as EntryStatus | null
					const cfg = s ? statusConfig[s] : null
					return (
						<span className="flex items-center gap-1.5 text-xs font-medium text-fg">
							<span className={`inline-block size-2 rounded-full ${cfg?.dot ?? "bg-fg-muted"}`} />
							{cfg ? cfg.label : "Non facturable"}
						</span>
					)
				},
				enableSorting: false,
				filterConfig: {
					type: "select",
					options: [
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
				cell: ({ row }) =>
					format(new Date(`${row.original.date}T00:00:00`), "dd MMM yyyy", {
						locale: fr,
					}),
			},
			{
				id: "project",
				accessorFn: (row: TimeEntry) => projectMap.get(row.projectId) ?? "—",
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
			{
				accessorKey: "description",
				header: "Description",
				cell: ({ row }) => <span className="truncate max-w-[300px] inline-block">{row.original.description ?? "—"}</span>,
			},
			{
				accessorKey: "minutes",
				header: "Durée",
				enableSorting: true,
				cell: ({ row }) => <span className="font-mono tabular-nums">{formatMinutes(row.original.minutes)}</span>,
				meta: { align: "right" },
			},
			{
				accessorKey: "hourlyRate",
				header: "Taux",
				cell: ({ row }) => <span className="font-mono tabular-nums text-fg-muted">{Math.round(row.original.hourlyRate)}€/h</span>,
				meta: { align: "right" },
			},
			{
				id: "amount",
				accessorFn: (row: TimeEntry) => (row.minutes / 60) * row.hourlyRate,
				header: "Montant",
				enableSorting: true,
				cell: ({ row }) => {
					const amount = (row.original.minutes / 60) * row.original.hourlyRate
					return <span className="font-mono font-medium tabular-nums">{formatCurrency(amount)}</span>
				},
				meta: { align: "right" },
			},
		],
		[projectMap, projectOptions]
	)

	// ---------------------------------------------------------------------------
	// Views
	// ---------------------------------------------------------------------------

	const views = useMemo<DataTableView[]>(
		() => [
			{
				id: "ready",
				name: "Prêt à facturer",
				isSystem: true,
				isDefault: true,
				filters: {
					id: "ready-filter",
					operator: "AND",
					conditions: [
						{
							id: "ready-cond",
							column: "status",
							operator: "equals",
							value: "ready_to_invoice",
							type: "select",
						},
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
						{
							id: "invoiced-cond",
							column: "status",
							operator: "equals",
							value: "invoiced",
							type: "select",
						},
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
						{
							id: "paid-cond",
							column: "status",
							operator: "equals",
							value: "paid",
							type: "select",
						},
					],
				},
				sorting: [{ id: "date", desc: true }],
			},
		],
		[]
	)

	// ---------------------------------------------------------------------------
	// Bulk actions
	// ---------------------------------------------------------------------------

	const bulkActions = useMemo<BulkAction<TimeEntry>[]>(
		() => [
			{
				id: "mark-invoiced",
				label: "Marquer facturé",
				icon: Receipt,
				handler: async (rows) => {
					try {
						await setStatus({
							ids: rows.map((r) => r.original._id),
							status: "invoiced",
						})
						toast.success(`${rows.length} entrée(s) marquée(s) facturée(s)`)
					} catch {
						toast.error("Erreur")
					}
				},
			},
			{
				id: "mark-paid",
				label: "Marquer payé",
				icon: CheckCircle2,
				handler: async (rows) => {
					try {
						await setStatus({
							ids: rows.map((r) => r.original._id),
							status: "paid",
						})
						toast.success(`${rows.length} entrée(s) marquée(s) payée(s)`)
					} catch {
						toast.error("Erreur")
					}
				},
			},
			{
				id: "export-csv",
				label: "Export CSV",
				icon: Download,
				handler: (rows) => {
					const data = rows.map((r) => r.original)
					const csvRows = [
						["Date", "Projet", "Description", "Durée", "Taux (€/h)", "Montant (€)"],
						...data.map((e: TimeEntry) => [
							e.date,
							projectMap.get(e.projectId) ?? "",
							e.description ?? "",
							formatMinutes(e.minutes),
							e.hourlyRate.toString(),
							((e.minutes / 60) * e.hourlyRate).toFixed(2),
						]),
						[
							"",
							"",
							"TOTAL",
							formatMinutes(data.reduce((s: number, e: TimeEntry) => s + e.minutes, 0)),
							"",
							data.reduce((s: number, e: TimeEntry) => s + (e.minutes / 60) * e.hourlyRate, 0).toFixed(2),
						],
					]
					const csv = csvRows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n")
					const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
					const url = URL.createObjectURL(blob)
					const a = document.createElement("a")
					a.href = url
					a.download = `recap-${periodDates?.from ?? "custom"}-${periodDates?.to ?? "custom"}.csv`
					a.click()
					URL.revokeObjectURL(url)
					toast.success("Export CSV téléchargé")
				},
			},
		],
		[setStatus, projectMap, periodDates]
	)

	// ---------------------------------------------------------------------------
	// Journal (period summary cards)
	// ---------------------------------------------------------------------------

	const journalDays = useMemo(() => {
		const groups = new Map<string, TimeEntry[]>()
		for (const entry of filteredByClient ?? []) {
			const existing = groups.get(entry.date) ?? []
			groups.set(entry.date, [...existing, entry])
		}

		return Array.from(groups.entries())
			.sort((a, b) => b[0].localeCompare(a[0]))
			.slice(0, 6)
			.map(([date, dayEntries]) => {
				const total = dayEntries.reduce((sum: number, entry: TimeEntry) => sum + entry.minutes, 0)
				const lead = dayEntries[0]?.description || "Bloc sans description"
				return {
					dateLabel: format(new Date(`${date}T00:00:00`), "EEEE d MMMM", {
						locale: fr,
					}),
					summary: dayEntries.length > 1 ? `${dayEntries.length} entrées regroupées. ${lead} ouvre la journée.` : lead,
					topActivities: dayEntries.slice(0, 3).map((entry: TimeEntry) => entry.description || "Sans description"),
					note: `${formatMinutes(total)} sur cette journée.`,
				}
			})
	}, [filteredByClient])

	// ---------------------------------------------------------------------------
	// Totals for footer
	// ---------------------------------------------------------------------------

	const totalMinutes = filteredByClient?.reduce((s: number, e: TimeEntry) => s + e.minutes, 0) ?? 0
	const totalAmount = filteredByClient?.reduce((s: number, e: TimeEntry) => s + (e.minutes / 60) * e.hourlyRate, 0) ?? 0
	const totalDays = totalMinutes / 60 / 8

	useAppTopBar([{ label: "Récapitulatif" }])

	return (
		<BlockStack gap="600" className="p-6">
			<PageHeader title="Récapitulatif" bottom={<p className="text-sm text-fg-muted">Export et facturation par période</p>} />

			{/* Scope filters — compact inline bar, no labels */}
			<InlineStack gap="200" blockAlign="center" wrap>
				<Select
					value={clientId || "_all"}
					onValueChange={(v) => {
						setClientId(v === "_all" ? "" : v)
						setProjectId("")
					}}
					items={[{ value: "_all", label: "Tous les clients" }, ...(clients?.map((c) => ({ value: c._id, label: c.name })) ?? [])]}
				>
					<SelectTrigger className="h-8 w-40 text-xs">
						<SelectValue placeholder="Client" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="_all" label="Tous les clients">
							Tous les clients
						</SelectItem>
						{clients?.map((c) => (
							<SelectItem key={c._id} value={c._id} label={c.name}>
								{c.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				{clientId && (
					<Select
						value={projectId || "_all"}
						onValueChange={(v) => setProjectId(v === "_all" ? "" : v)}
						items={[{ value: "_all", label: "Tous les projets" }, ...(clientProjects?.map((p) => ({ value: p._id, label: p.name })) ?? [])]}
					>
						<SelectTrigger className="h-8 w-40 text-xs">
							<SelectValue placeholder="Projet" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="_all" label="Tous les projets">
								Tous les projets
							</SelectItem>
							{clientProjects?.map((p) => (
								<SelectItem key={p._id} value={p._id} label={p.name}>
									{p.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				)}

				<Select
					value={period}
					onValueChange={setPeriod}
					items={[
						{ value: "current", label: "Mois en cours" },
						{ value: "last", label: "Mois précédent" },
						{ value: "custom", label: "Personnalisée" },
					]}
				>
					<SelectTrigger className="h-8 w-40 text-xs">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="current" label="Mois en cours">
							Mois en cours
						</SelectItem>
						<SelectItem value="last" label="Mois précédent">
							Mois précédent
						</SelectItem>
						<SelectItem value="custom" label="Personnalisée">
							Personnalisée
						</SelectItem>
					</SelectContent>
				</Select>

				{period === "custom" && (
					<DateRangeSelector
						from={from ? parseISO(from) : undefined}
						to={to ? parseISO(to) : undefined}
						onRangeChange={(r) => {
							setFrom(r.from ? format(r.from, "yyyy-MM-dd") : "")
							setTo(r.to ? format(r.to, "yyyy-MM-dd") : "")
						}}
						formatStr="dd/MM/yyyy"
					/>
				)}
			</InlineStack>

			{/* Summary stats */}
			<InlineStack gap="600" blockAlign="start">
				<div>
					<div className="text-[11px] font-medium text-fg-muted uppercase tracking-wide">Heures</div>
					<div className="text-lg font-semibold tabular-nums">{formatMinutes(totalMinutes)}</div>
				</div>
				<div>
					<div className="text-[11px] font-medium text-fg-muted uppercase tracking-wide">Jours</div>
					<div className="text-lg font-semibold tabular-nums">{totalDays.toFixed(1)}j</div>
				</div>
				<div>
					<div className="text-[11px] font-medium text-fg-muted uppercase tracking-wide">Montant</div>
					<div className="text-lg font-semibold tabular-nums">{formatCurrency(totalAmount)}</div>
				</div>
			</InlineStack>

			{/* DataTable */}
			<DataTable
				data={filteredByClient ?? []}
				columns={columns}
				views={views}
				bulkActions={bulkActions}
				isLoading={entries === undefined}
				enableSorting
				enableRowSelection
				enableGrouping
				enableGlobalSearch
				enableAdvancedFilters
				enablePagination={false}
				defaultSorting={[{ id: "date", desc: true }]}
				groupAggregations={{
					minutes: (values) => {
						const total = (values as number[]).reduce((a, b) => a + b, 0)
						return <span className="font-mono text-xs tabular-nums">{formatMinutes(total)}</span>
					},
					amount: (values) => {
						const total = (values as number[]).reduce((a, b) => a + b, 0)
						return <span className="font-mono text-xs font-medium tabular-nums">{formatCurrency(total)}</span>
					},
				}}
				groupRowStyle={(row) => {
					const s = row.getValue("status") as string | null
					const cfg = s ? statusConfig[s as EntryStatus] : null
					return cfg ? { background: cfg.tint } : undefined
				}}
				searchPlaceholder="Rechercher une entrée…"
				locale="fr"
				variant="default"
				storageKey="ops-recap"
				emptyComponent={
					<div className="flex flex-col items-center gap-3 py-12">
						<FileText className="size-10 text-fg-muted" />
						<p className="text-sm font-medium text-fg">Aucune entrée</p>
						<p className="text-xs text-fg-muted">Aucune entrée sur cette période pour ce statut.</p>
					</div>
				}
			/>

			{/* Journal de période */}
			{journalDays.length > 0 && (
				<BlockStack gap="300" className="pt-2">
					<BlockStack>
						<h2 className="text-sm font-medium text-fg">Journal de période</h2>
						<p className="text-xs text-fg-muted">Lecture compacte des dernières journées présentes dans ce récapitulatif.</p>
					</BlockStack>
					<div className="grid gap-4 lg:grid-cols-2">
						{journalDays.map((day) => (
							<JournalDayCard key={day.dateLabel} dateLabel={day.dateLabel} summary={day.summary} topActivities={day.topActivities} note={day.note} />
						))}
					</div>
				</BlockStack>
			)}
		</BlockStack>
	)
}
