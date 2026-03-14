"use client"

import { Button } from "@blazz/ui/components/ui/button"
import { Card, CardContent } from "@blazz/ui/components/ui/card"
import { useMutation, useQuery } from "convex/react"
import { Download, FileText, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { api } from "@/convex/_generated/api"
import type { Doc } from "@/convex/_generated/dataModel"
import { type ContractMetrics, healthColor } from "@/lib/contracts"

interface ContractSectionProps {
	contract: Doc<"contracts">
	metrics: ContractMetrics | null
	onComplete?: () => void
}

const CONTRACT_STATUS_LABEL: Record<string, string> = {
	active: "Actif",
	completed: "Terminé",
	cancelled: "Annulé",
}

export function ContractSection({ contract, metrics, onComplete }: ContractSectionProps) {
	const files = useQuery(api.contractFiles.listByContract, { contractId: contract._id })
	const removeFile = useMutation(api.contractFiles.remove)
	const colors = metrics ? healthColor(metrics.contractHealth) : null
	const percentThisMonth =
		metrics && metrics.daysAllocatedThisMonth > 0
			? Math.round((metrics.daysConsumedThisMonth / metrics.daysAllocatedThisMonth) * 100 * 10) / 10
			: 0
	const clampedPercent = Math.min(percentThisMonth, 100)

	return (
		<div className="space-y-4">
			{/* Contract header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<h3 className="text-sm font-medium text-fg">
						{contract.type === "tma"
							? "Contrat TMA"
							: contract.type === "regie"
								? "Régie"
								: "Contrat Forfait"}
					</h3>
					<span className="text-xs text-fg-muted">
						{contract.startDate} &rarr; {contract.endDate}
					</span>
				</div>
				<div className="flex items-center gap-2">
					{contract.status === "active" && onComplete && (
						<Button size="sm" variant="outline" onClick={onComplete}>
							Clôturer
						</Button>
					)}
					<span className="text-xs text-fg-muted">{CONTRACT_STATUS_LABEL[contract.status]}</span>
				</div>
			</div>

			{/* Metrics section — only for TMA contracts with computed metrics */}
			{metrics && colors && (
				<>
					{/* Alert banner */}
					{metrics.contractHealth === "over" && (
						<div
							className={`px-4 py-2.5 rounded-lg text-sm font-medium ${colors.bg} ${colors.text}`}
						>
							Dépassement de {Math.abs(metrics.daysRemainingThisMonth)}j ce mois
						</div>
					)}
					{(metrics.contractHealth === "danger" || metrics.contractHealth === "warning") && (
						<div
							className={`px-4 py-2.5 rounded-lg text-sm font-medium ${colors.bg} ${colors.text}`}
						>
							{percentThisMonth}% des jours consommés ce mois
						</div>
					)}

					{/* KPI cards */}
					<div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
						<Card>
							<CardContent className="p-4">
								<p className="text-xs text-fg-muted mb-1">Ce mois</p>
								<p className="text-xl font-semibold font-mono">
									{metrics.daysConsumedThisMonth}
									<span className="text-sm text-fg-muted font-normal">
										/{metrics.daysAllocatedThisMonth}j
									</span>
								</p>
							</CardContent>
						</Card>
						<Card>
							<CardContent className="p-4">
								<p className="text-xs text-fg-muted mb-1">Restant ce mois</p>
								<p
									className={`text-xl font-semibold font-mono ${
										metrics.daysRemainingThisMonth < 0
											? "text-red-600 dark:text-red-400"
											: "text-green-600 dark:text-green-400"
									}`}
								>
									{metrics.daysRemainingThisMonth}j
								</p>
							</CardContent>
						</Card>
						{contract.carryOver && metrics.carryInThisMonth > 0 && (
							<Card>
								<CardContent className="p-4">
									<p className="text-xs text-fg-muted mb-1">Report entrant</p>
									<p className="text-xl font-semibold font-mono">+{metrics.carryInThisMonth}j</p>
								</CardContent>
							</Card>
						)}
						<Card>
							<CardContent className="p-4">
								<p className="text-xs text-fg-muted mb-1">Total contrat</p>
								<p className="text-xl font-semibold font-mono">
									{metrics.totalDaysConsumed}
									<span className="text-sm text-fg-muted font-normal">
										/{metrics.totalDaysAllocated}j
									</span>
								</p>
							</CardContent>
						</Card>
					</div>

					{/* Progress bar — this month */}
					<div className="space-y-2">
						<div className="flex items-center justify-between text-xs">
							<span className="text-fg-muted">Consommation du mois</span>
							<span className="text-fg font-mono font-medium">
								{metrics.daysConsumedThisMonth} / {metrics.daysAllocatedThisMonth}j (
								{percentThisMonth}%)
							</span>
						</div>
						<div className="h-2.5 bg-surface-3 rounded-full overflow-hidden border border-edge">
							<div
								className={`h-full rounded-full transition-all ${colors.bar}`}
								style={{ width: `${clampedPercent}%` }}
							/>
						</div>
					</div>

					{/* Monthly breakdown table */}
					{metrics.monthlyBreakdown.length > 1 && (
						<div className="space-y-2">
							<p className="text-xs text-fg-muted">Historique mensuel</p>
							<div className="border border-edge rounded-lg overflow-hidden">
								<table className="w-full text-xs">
									<thead>
										<tr className="bg-surface-3">
											<th className="text-left px-3 py-2 font-medium text-fg-muted">Mois</th>
											<th className="text-right px-3 py-2 font-medium text-fg-muted">Alloués</th>
											<th className="text-right px-3 py-2 font-medium text-fg-muted">Consommés</th>
											{contract.carryOver && (
												<th className="text-right px-3 py-2 font-medium text-fg-muted">Report</th>
											)}
											<th className="text-right px-3 py-2 font-medium text-fg-muted">Restant</th>
										</tr>
									</thead>
									<tbody>
										{metrics.monthlyBreakdown.map((row) => {
											const rowColors = healthColor(row.health)
											return (
												<tr key={row.month} className="border-t border-edge">
													<td className="px-3 py-2 font-mono text-fg">{row.month}</td>
													<td className="text-right px-3 py-2 font-mono text-fg-muted">
														{row.allocated}j
													</td>
													<td className="text-right px-3 py-2 font-mono text-fg">
														{row.consumed}j
													</td>
													{contract.carryOver && (
														<td className="text-right px-3 py-2 font-mono text-fg-muted">
															{row.carryIn > 0 ? `+${row.carryIn}j` : "—"}
														</td>
													)}
													<td
														className={`text-right px-3 py-2 font-mono font-medium ${rowColors.text}`}
													>
														{row.remaining}j
													</td>
												</tr>
											)
										})}
									</tbody>
								</table>
							</div>
						</div>
					)}
				</>
			)}

			{/* Attached files */}
			{files && files.length > 0 && (
				<div className="space-y-2">
					<p className="text-xs text-fg-muted">Pièces jointes</p>
					<ul className="space-y-1">
						{files.map((file) => (
							<li
								key={file._id}
								className="flex items-center gap-2 rounded-md border border-edge bg-surface px-3 py-2 text-sm"
							>
								<FileText className="size-4 shrink-0 text-fg-muted" />
								<span className="min-w-0 flex-1 truncate text-fg">{file.fileName}</span>
								<span className="shrink-0 text-xs text-fg-muted">
									{(file.fileSize / 1024).toFixed(0)} Ko
								</span>
								{file.url && (
									<a
										href={file.url}
										target="_blank"
										rel="noopener noreferrer"
										className="shrink-0 rounded p-1 text-fg-muted hover:text-fg"
										title="Télécharger"
									>
										<Download className="size-3.5" />
									</a>
								)}
								<button
									type="button"
									onClick={async () => {
										try {
											await removeFile({ id: file._id })
											toast.success("Fichier supprimé")
										} catch {
											toast.error("Erreur lors de la suppression")
										}
									}}
									className="shrink-0 rounded p-1 text-fg-muted hover:text-red-500"
									title="Supprimer"
								>
									<Trash2 className="size-3.5" />
								</button>
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	)
}
