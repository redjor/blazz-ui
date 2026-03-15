"use client"

import { PageHeader } from "@blazz/pro/components/blocks/page-header"
import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { Box } from "@blazz/ui/components/ui/box"
import { Button } from "@blazz/ui/components/ui/button"
import { DateRangeSelector } from "@blazz/ui/components/ui/date-selector"
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@blazz/ui/components/ui/dialog"
import { Empty } from "@blazz/ui/components/ui/empty"
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import { Label } from "@blazz/ui/components/ui/label"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@blazz/ui/components/ui/select"
import { cn } from "@blazz/ui/lib/utils"
import { useMutation, useQuery } from "convex/react"
import { endOfMonth, format, parseISO, startOfMonth, subMonths } from "date-fns"
import { fr } from "date-fns/locale"
import { CheckCheck, Download, FileText } from "lucide-react"
import { useMemo, useState } from "react"
import { toast } from "sonner"
import { EntryStatusBadge } from "@/components/entry-status-badge"
import { JournalDayCard } from "@/components/journal-day-card"
import { useOpsTopBar } from "@/components/ops-frame"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { formatCurrency, formatMinutes } from "@/lib/format"
import { type EntryStatus, getEffectiveStatus } from "@/lib/time-entry-status"

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

export default function RecapPageClient() {
	const [clientId, setClientId] = useState<string>("")
	const [projectId, setProjectId] = useState<string>("")
	const [period, setPeriod] = useState("current")
	const [showConfirm, setShowConfirm] = useState(false)
	const [from, setFrom] = useState(format(startOfMonth(new Date()), "yyyy-MM-dd"))
	const [to, setTo] = useState(format(endOfMonth(new Date()), "yyyy-MM-dd"))
	const [statusFilter, setStatusFilter] = useState<EntryStatus>("ready_to_invoice")
	const [showMarkPaid, setShowMarkPaid] = useState(false)
	const setStatus = useMutation(api.timeEntries.setStatus)

	const clients = useQuery(api.clients.list)
	const clientProjects = useQuery(
		api.projects.listByClient,
		clientId ? { clientId: clientId as Id<"clients"> } : "skip"
	)

	const periodDates = period !== "custom" ? getPeriodDates(period) : { from, to }

	const entries = useQuery(api.timeEntries.listForRecap, {
		projectId: projectId ? (projectId as Id<"projects">) : undefined,
		from: periodDates?.from,
		to: periodDates?.to,
		includeInvoiced: true,
	})

	// Filter by client client-side if client selected but no project selected
	const filteredByClient =
		!projectId && clientId && clientProjects
			? entries?.filter((e) => clientProjects.some((p) => p._id === e.projectId))
			: entries

	const filteredEntries = filteredByClient?.filter((e) => getEffectiveStatus(e) === statusFilter)

	const totalMinutes = filteredEntries?.reduce((s, e) => s + e.minutes, 0) ?? 0
	const totalAmount = filteredEntries?.reduce((s, e) => s + (e.minutes / 60) * e.hourlyRate, 0) ?? 0
	const totalDays = totalMinutes / 60 / 8
	const journalDays = useMemo(() => {
		const groups = new Map<string, typeof filteredEntries>()
		for (const entry of filteredEntries ?? []) {
			const existing = groups.get(entry.date) ?? []
			groups.set(entry.date, [...existing, entry])
		}

		return Array.from(groups.entries())
			.sort((a, b) => b[0].localeCompare(a[0]))
			.slice(0, 6)
			.map(([date, entries]) => {
				const total = entries.reduce((sum, entry) => sum + entry.minutes, 0)
				const lead = entries[0]?.description || "Bloc sans description"
				return {
					dateLabel: format(new Date(`${date}T00:00:00`), "EEEE d MMMM", { locale: fr }),
					summary:
						entries.length > 1
							? `${entries.length} entrées regroupées. ${lead} ouvre la journée.`
							: lead,
					topActivities: entries
						.slice(0, 3)
						.map((entry) => entry.description || "Sans description"),
					note: `${formatMinutes(total)} sur cette journée.`,
				}
			})
	}, [filteredEntries])

	const handleMarkInvoiced = async () => {
		if (!filteredEntries?.length) return
		const ids = filteredEntries.map((e) => e._id)
		try {
			await setStatus({ ids, status: "invoiced" })
			toast.success(`${ids.length} entrée(s) marquées comme facturées`)
			setShowConfirm(false)
		} catch {
			toast.error("Erreur")
		}
	}

	const handleMarkPaid = async () => {
		if (!filteredEntries?.length) return
		const ids = filteredEntries.map((e) => e._id)
		try {
			await setStatus({ ids, status: "paid" })
			toast.success(`${ids.length} entrée(s) marquées comme payées`)
			setShowMarkPaid(false)
		} catch {
			toast.error("Erreur")
		}
	}

	const handleExportCSV = () => {
		if (!filteredEntries?.length) return
		const rows = [
			["Date", "Description", "Durée", "Taux (€/h)", "Montant (€)"],
			...filteredEntries.map((e) => [
				e.date,
				e.description ?? "",
				formatMinutes(e.minutes),
				e.hourlyRate.toString(),
				((e.minutes / 60) * e.hourlyRate).toFixed(2),
			]),
			["", "TOTAL", formatMinutes(totalMinutes), "", totalAmount.toFixed(2)],
		]
		const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n")
		const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
		const url = URL.createObjectURL(blob)
		const a = document.createElement("a")
		a.href = url
		a.download = `recap-${statusFilter}-${periodDates?.from ?? "custom"}-${periodDates?.to ?? "custom"}.csv`
		a.click()
		URL.revokeObjectURL(url)
		toast.success("Export CSV téléchargé")
	}

	useOpsTopBar([{ label: "Récapitulatif" }])

	return (
		<>
			<BlockStack gap="600" className="p-6">
				<PageHeader title="Récapitulatif" description="Export et facturation par période" />

				{/* Filters */}
				<InlineStack gap="400" wrap className="p-4 rounded-xl border border-edge bg-surface-3">
					<BlockStack gap="150">
						<Label>Client</Label>
						<Select
							value={clientId || "_all"}
							onValueChange={(v) => {
								setClientId(v === "_all" ? "" : v)
								setProjectId("")
							}}
							items={[
								{ value: "_all", label: "Tous les clients" },
								...(clients?.map((c) => ({ value: c._id, label: c.name })) ?? []),
							]}
						>
							<SelectTrigger className="w-44">
								<SelectValue placeholder="Tous" />
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
					</BlockStack>

					{clientId && (
						<BlockStack gap="150">
							<Label>Projet</Label>
							<Select
								value={projectId || "_all"}
								onValueChange={(v) => setProjectId(v === "_all" ? "" : v)}
								items={[
									{ value: "_all", label: "Tous les projets" },
									...(clientProjects?.map((p) => ({ value: p._id, label: p.name })) ?? []),
								]}
							>
								<SelectTrigger className="w-44">
									<SelectValue placeholder="Tous" />
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
						</BlockStack>
					)}

					<BlockStack gap="150">
						<Label>Période</Label>
						<Select
							value={period}
							onValueChange={setPeriod}
							items={[
								{ value: "current", label: "Mois en cours" },
								{ value: "last", label: "Mois précédent" },
								{ value: "custom", label: "Personnalisée" },
							]}
						>
							<SelectTrigger className="w-44">
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
					</BlockStack>

					{period === "custom" && (
						<BlockStack gap="150">
							<Label>Période</Label>
							<DateRangeSelector
								from={from ? parseISO(from) : undefined}
								to={to ? parseISO(to) : undefined}
								onRangeChange={(r) => {
									setFrom(r.from ? format(r.from, "yyyy-MM-dd") : "")
									setTo(r.to ? format(r.to, "yyyy-MM-dd") : "")
								}}
								formatStr="dd/MM/yyyy"
							/>
						</BlockStack>
					)}
				</InlineStack>

				{/* Status tabs */}
				<InlineStack gap="100" blockAlign="center" className="rounded-lg border border-edge p-0.5 bg-surface-3 w-fit">
					{(["ready_to_invoice", "invoiced", "paid"] as const).map((s) => (
						<button
							key={s}
							type="button"
							onClick={() => setStatusFilter(s)}
							className={cn(
								"h-7 px-3 rounded-md transition-colors",
								statusFilter === s
									? "bg-surface shadow-sm font-medium text-fg"
									: "text-fg-muted hover:text-fg"
							)}
						>
							<EntryStatusBadge status={s} />
						</button>
					))}
				</InlineStack>

				{/* Table */}
				{filteredEntries === undefined ? (
					<Empty size="sm" title="Chargement…" />
				) : filteredEntries.length === 0 ? (
					<Empty
						icon={FileText}
						size="sm"
						title="Aucune entrée"
						description="Aucune entrée sur cette période pour ce statut."
					/>
				) : (
					<>
						<Box className="rounded-xl overflow-hidden" border="default">
							<table className="w-full text-sm">
								<thead className="bg-surface-3 border-b border-edge">
									<tr>
										<th className="text-left p-3 font-medium text-fg-muted">Date</th>
										<th className="text-left p-3 font-medium text-fg-muted">Description</th>
										<th className="text-right p-3 font-medium text-fg-muted">Durée</th>
										<th className="text-right p-3 font-medium text-fg-muted">Taux</th>
										<th className="text-right p-3 font-medium text-fg-muted">Montant</th>
									</tr>
								</thead>
								<tbody>
									{filteredEntries.map((entry) => (
										<tr key={entry._id} className="border-b border-edge last:border-0">
											<td className="p-3 text-fg-muted">
												{format(new Date(`${entry.date}T00:00:00`), "dd MMM", { locale: fr })}
											</td>
											<td className="p-3 text-fg">{entry.description ?? "—"}</td>
											<td className="p-3 text-right font-mono text-fg">
												{formatMinutes(entry.minutes)}
											</td>
											<td className="p-3 text-right text-fg-muted font-mono">
												{Math.round(entry.hourlyRate)}€/h
											</td>
											<td className="p-3 text-right font-medium text-fg font-mono">
												{formatCurrency((entry.minutes / 60) * entry.hourlyRate)}
											</td>
										</tr>
									))}
								</tbody>
								<tfoot className="bg-surface-3 border-t border-edge">
									<tr>
										<td colSpan={2} className="p-3 font-medium text-fg">
											Total
										</td>
										<td className="p-3 text-right font-mono font-medium text-fg">
											{formatMinutes(totalMinutes)}
										</td>
										<td className="p-3 text-right text-fg-muted font-mono">
											{totalDays.toFixed(1)}j
										</td>
										<td className="p-3 text-right font-semibold text-fg font-mono">
											{formatCurrency(totalAmount)}
										</td>
									</tr>
								</tfoot>
							</table>
						</Box>

						<InlineStack gap="300">
							<Button variant="outline" onClick={handleExportCSV}>
								<Download className="size-4 mr-1.5" />
								Export CSV
							</Button>
							{statusFilter === "ready_to_invoice" && (
								<Button onClick={() => setShowConfirm(true)}>
									<CheckCheck className="size-4 mr-1.5" />
									Marquer comme facturé ({filteredEntries.length})
								</Button>
							)}
							{statusFilter === "invoiced" && (
								<Button onClick={() => setShowMarkPaid(true)}>
									<CheckCheck className="size-4 mr-1.5" />
									Marquer comme payé ({filteredEntries.length})
								</Button>
							)}
						</InlineStack>

						<BlockStack gap="300" className="pt-2">
							<BlockStack>
								<h2 className="text-sm font-medium text-fg">Journal de période</h2>
								<p className="text-xs text-fg-muted">
									Lecture compacte des dernières journées présentes dans ce récapitulatif.
								</p>
							</BlockStack>
							<div className="grid gap-4 lg:grid-cols-2">
								{journalDays.map((day) => (
									<JournalDayCard
										key={day.dateLabel}
										dateLabel={day.dateLabel}
										summary={day.summary}
										topActivities={day.topActivities}
										note={day.note}
									/>
								))}
							</div>
						</BlockStack>
					</>
				)}
			</BlockStack>

			<Dialog open={showConfirm} onOpenChange={setShowConfirm}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Marquer comme facturé ?</DialogTitle>
					</DialogHeader>
					<p className="text-sm text-fg-muted">
						{filteredEntries?.length ?? 0} entrée(s) seront marquées comme facturées et déplacées
						dans l'onglet Facturé. Cette action peut être annulée depuis la page Temps.
					</p>
					<DialogFooter>
						<Button type="button" variant="outline" onClick={() => setShowConfirm(false)}>
							Annuler
						</Button>
						<Button onClick={handleMarkInvoiced}>Confirmer</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<Dialog open={showMarkPaid} onOpenChange={setShowMarkPaid}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Marquer comme payé ?</DialogTitle>
					</DialogHeader>
					<p className="text-sm text-fg-muted">
						{filteredEntries?.length ?? 0} entrée(s) seront marquées comme payées. Cette action peut
						être annulée depuis la page Temps.
					</p>
					<DialogFooter>
						<Button type="button" variant="outline" onClick={() => setShowMarkPaid(false)}>
							Annuler
						</Button>
						<Button onClick={handleMarkPaid}>Confirmer</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	)
}
