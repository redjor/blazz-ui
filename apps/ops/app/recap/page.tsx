"use client"

import { PageHeader } from "@blazz/ui/components/blocks/page-header"
import { Button } from "@blazz/ui/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@blazz/ui/components/ui/dialog"
import { Empty } from "@blazz/ui/components/ui/empty"
import { Input } from "@blazz/ui/components/ui/input"
import { Label } from "@blazz/ui/components/ui/label"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@blazz/ui/components/ui/select"
import { useMutation, useQuery } from "convex/react"
import { endOfMonth, format, startOfMonth, subMonths } from "date-fns"
import { fr } from "date-fns/locale"
import { CheckCheck, Download, FileText } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { OpsFrame } from "@/components/ops-frame"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { formatCurrency, formatMinutes } from "@/lib/format"

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

export default function RecapPage() {
	const [clientId, setClientId] = useState<string>("")
	const [projectId, setProjectId] = useState<string>("")
	const [period, setPeriod] = useState("current")
	const [showConfirm, setShowConfirm] = useState(false)
	const [from, setFrom] = useState(format(startOfMonth(new Date()), "yyyy-MM-dd"))
	const [to, setTo] = useState(format(endOfMonth(new Date()), "yyyy-MM-dd"))

	const clients = useQuery(api.clients.list)
	const clientProjects = useQuery(
		api.projects.listByClient,
		clientId ? { clientId: clientId as Id<"clients"> } : "skip"
	)
	const markInvoiced = useMutation(api.timeEntries.markInvoiced)

	const periodDates = period !== "custom" ? getPeriodDates(period) : { from, to }

	const entries = useQuery(api.timeEntries.listForRecap, {
		projectId: projectId ? (projectId as Id<"projects">) : undefined,
		from: periodDates?.from,
		to: periodDates?.to,
	})

	// Filter by client client-side if client selected but no project selected
	const filteredEntries =
		!projectId && clientId && clientProjects
			? entries?.filter((e) => clientProjects.some((p) => p._id === e.projectId))
			: entries

	const totalMinutes = filteredEntries?.reduce((s, e) => s + e.minutes, 0) ?? 0
	const totalAmount = filteredEntries?.reduce((s, e) => s + (e.minutes / 60) * e.hourlyRate, 0) ?? 0
	const totalDays = totalMinutes / 60 / 8

	const handleMarkInvoiced = async () => {
		if (!filteredEntries?.length) return
		const ids = filteredEntries.map((e) => e._id)
		try {
			await markInvoiced({ ids })
			toast.success(`${ids.length} entrée(s) marquées comme facturées`)
			setShowConfirm(false)
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
		a.download = `recap-${periodDates?.from ?? "custom"}-${periodDates?.to ?? "custom"}.csv`
		a.click()
		URL.revokeObjectURL(url)
		toast.success("Export CSV téléchargé")
	}

	return (
		<OpsFrame>
			<div className="p-6 space-y-6">
				<PageHeader title="Récapitulatif" description="Export et facturation par période" />

				{/* Filters */}
				<div className="flex flex-wrap gap-4 p-4 rounded-xl border border-edge bg-raised">
					<div className="space-y-1.5">
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
								<SelectItem value="_all">Tous les clients</SelectItem>
								{clients?.map((c) => (
									<SelectItem key={c._id} value={c._id}>
										{c.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{clientId && (
						<div className="space-y-1.5">
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
									<SelectItem value="_all">Tous les projets</SelectItem>
									{clientProjects?.map((p) => (
										<SelectItem key={p._id} value={p._id}>
											{p.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					)}

					<div className="space-y-1.5">
						<Label>Période</Label>
						<Select value={period} onValueChange={setPeriod}>
							<SelectTrigger className="w-44">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="current">Mois en cours</SelectItem>
								<SelectItem value="last">Mois précédent</SelectItem>
								<SelectItem value="custom">Personnalisée</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{period === "custom" && (
						<>
							<div className="space-y-1.5">
								<Label>Du</Label>
								<Input
									type="date"
									value={from}
									onChange={(e) => setFrom(e.target.value)}
									className="w-40"
								/>
							</div>
							<div className="space-y-1.5">
								<Label>Au</Label>
								<Input
									type="date"
									value={to}
									onChange={(e) => setTo(e.target.value)}
									className="w-40"
								/>
							</div>
						</>
					)}
				</div>

				{/* Table */}
				{filteredEntries === undefined ? (
					<Empty size="sm" title="Chargement…" />
				) : filteredEntries.length === 0 ? (
					<Empty
						icon={FileText}
						size="sm"
						title="Aucune entrée non facturée"
						description="Aucune entrée non facturée sur cette période."
					/>
				) : (
					<>
						<div className="rounded-xl border border-edge overflow-hidden">
							<table className="w-full text-sm">
								<thead className="bg-raised border-b border-edge">
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
												{format(new Date(entry.date + "T00:00:00"), "dd MMM", { locale: fr })}
											</td>
											<td className="p-3 text-fg">{entry.description ?? "—"}</td>
											<td className="p-3 text-right font-mono text-fg">
												{formatMinutes(entry.minutes)}
											</td>
											<td className="p-3 text-right text-fg-muted tabular-nums">
												{entry.hourlyRate}€/h
											</td>
											<td className="p-3 text-right font-medium text-fg tabular-nums">
												{formatCurrency((entry.minutes / 60) * entry.hourlyRate)}
											</td>
										</tr>
									))}
								</tbody>
								<tfoot className="bg-raised border-t border-edge">
									<tr>
										<td colSpan={2} className="p-3 font-medium text-fg">
											Total
										</td>
										<td className="p-3 text-right font-mono font-medium text-fg">
											{formatMinutes(totalMinutes)}
										</td>
										<td className="p-3 text-right text-fg-muted">{totalDays.toFixed(1)}j</td>
										<td className="p-3 text-right font-semibold text-fg tabular-nums">
											{formatCurrency(totalAmount)}
										</td>
									</tr>
								</tfoot>
							</table>
						</div>

						<div className="flex gap-3">
							<Button variant="outline" onClick={handleExportCSV}>
								<Download className="size-4 mr-1.5" />
								Export CSV
							</Button>
							<Button onClick={() => setShowConfirm(true)}>
								<CheckCheck className="size-4 mr-1.5" />
								Marquer comme facturé ({filteredEntries.length})
							</Button>
						</div>
					</>
				)}
			</div>

			<Dialog open={showConfirm} onOpenChange={setShowConfirm}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Marquer comme facturé ?</DialogTitle>
					</DialogHeader>
					<p className="text-sm text-fg-muted">
						{filteredEntries?.length ?? 0} entrée(s) seront marquées comme facturées et
						disparaîtront de cette vue. Cette action peut être annulée depuis la page Temps.
					</p>
					<DialogFooter>
						<Button type="button" variant="outline" onClick={() => setShowConfirm(false)}>
							Annuler
						</Button>
						<Button onClick={handleMarkInvoiced}>Confirmer</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</OpsFrame>
	)
}
