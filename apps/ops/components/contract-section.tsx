"use client"

import { Bleed } from "@blazz/ui/components/ui/bleed"
import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { Box } from "@blazz/ui/components/ui/box"
import { Button } from "@blazz/ui/components/ui/button"
import { Divider } from "@blazz/ui/components/ui/divider"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@blazz/ui/components/ui/dropdown-menu"
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import { useMutation, useQuery } from "convex/react"
import { format, parse } from "date-fns"
import { fr } from "date-fns/locale"
import { StatsStrip } from "@blazz/pro/components/blocks/stats-strip"
import { Download, FileText, MoreHorizontal, Pencil, Trash2, XCircle } from "lucide-react"
import { toast } from "sonner"
import { api } from "@/convex/_generated/api"
import type { Doc } from "@/convex/_generated/dataModel"
import { type ContractMetrics, type ForfaitMetrics, healthColor } from "@/lib/contracts"

interface ContractSectionProps {
	contract: Doc<"contracts">
	metrics: ContractMetrics | null
	forfaitMetrics: ForfaitMetrics | null
	onComplete?: () => void
	onEdit?: () => void
}

const CONTRACT_TYPE_LABEL: Record<string, string> = {
	tma: "TMA",
	regie: "Régie",
	forfait: "Forfait",
}

const CONTRACT_STATUS_LABEL: Record<string, string> = {
	active: "Actif",
	completed: "Terminé",
	cancelled: "Annulé",
}

function formatDate(iso: string): string {
	try {
		const date = parse(iso, "yyyy-MM-dd", new Date())
		return format(date, "d MMM yyyy", { locale: fr })
	} catch {
		return iso
	}
}

function formatMonth(ym: string): string {
	const date = parse(ym, "yyyy-MM", new Date())
	return format(date, "MMMM", { locale: fr })
}

function StatusDot({ status }: { status: string }) {
	const color =
		status === "active"
			? "bg-green-500"
			: status === "completed"
				? "bg-fg-muted"
				: "bg-red-500"
	return <span className={`size-1.5 rounded-full ${color}`} />
}

export function ContractSection({
	contract,
	metrics,
	forfaitMetrics,
	onComplete,
	onEdit,
}: ContractSectionProps) {
	const files = useQuery(api.contractFiles.listByContract, { contractId: contract._id })
	const removeFile = useMutation(api.contractFiles.remove)
	const colors = metrics ? healthColor(metrics.contractHealth) : null
	const percentThisMonth =
		metrics && metrics.daysAllocatedThisMonth > 0
			? Math.round((metrics.daysConsumedThisMonth / metrics.daysAllocatedThisMonth) * 100 * 10) / 10
			: 0
	const clampedPercent = Math.min(percentThisMonth, 100)

	return (
		<Box background="surface" border="default" borderRadius="lg">
			<BlockStack gap="500">
				{/* ── Header ── */}
				<InlineStack align="space-between" blockAlign="center">
					<div>
						<InlineStack gap="200" blockAlign="center">
							<span className="text-sm font-semibold text-fg">
								{CONTRACT_TYPE_LABEL[contract.type] ?? contract.type}
							</span>
							<InlineStack gap="100" blockAlign="center">
								<StatusDot status={contract.status} />
								<span className="text-xs text-fg-muted">
									{CONTRACT_STATUS_LABEL[contract.status]}
								</span>
							</InlineStack>
						</InlineStack>
						<span className="block text-xs text-fg-muted mt-0.5">
							{formatDate(contract.startDate)} → {formatDate(contract.endDate)}
							{contract.daysPerMonth && (
								<> · {contract.daysPerMonth}j/mois</>
							)}
						</span>
					</div>
					{contract.status === "active" && (onEdit || onComplete) && (
							<DropdownMenu>
								<DropdownMenuTrigger
									render={
										<Button size="icon-sm" variant="ghost" className="size-7 text-fg-muted">
											<MoreHorizontal className="size-4" />
										</Button>
									}
								/>
								<DropdownMenuContent align="end">
									{onEdit && (
										<DropdownMenuItem onClick={onEdit}>
											<Pencil className="size-3.5" />
											Modifier
										</DropdownMenuItem>
									)}
									{onComplete && (
										<>
											<DropdownMenuSeparator />
											<DropdownMenuItem onClick={onComplete} className="text-destructive">
												<XCircle className="size-3.5" />
												Clôturer
											</DropdownMenuItem>
										</>
									)}
								</DropdownMenuContent>
							</DropdownMenu>
						)}
				</InlineStack>

				{/* ── TMA metrics ── */}
				{metrics && colors && (
					<>
						{/* Alert banners */}
						{metrics.contractHealth === "over" && (
							<div className={`px-3 py-2 rounded-md text-xs font-medium ${colors.bg} ${colors.text}`}>
								Dépassement de {Math.abs(metrics.daysRemainingThisMonth)}j ce mois
							</div>
						)}
						{(metrics.contractHealth === "danger" || metrics.contractHealth === "warning") && (
							<div className={`px-3 py-2 rounded-md text-xs font-medium ${colors.bg} ${colors.text}`}>
								{percentThisMonth}% des jours consommés ce mois
							</div>
						)}
						{metrics.isAnticipated && (
							<div className="px-3 py-2 rounded-md text-xs font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400">
								Prestation anticipée — imputée sur {formatMonth(metrics.targetMonth)}
							</div>
						)}

						{/* KPIs */}
						<Bleed marginInline="400">
							<StatsStrip
								stats={[
									{
										label: metrics.isAnticipated ? formatMonth(metrics.targetMonth) : "Ce mois",
										value: `${metrics.daysConsumedThisMonth}/${metrics.daysAllocatedThisMonth}j`,
									},
									{
										label: "Restant",
										value: `${metrics.daysRemainingThisMonth}j`,
									},
									...(contract.carryOver && metrics.carryInThisMonth > 0
										? [{ label: "Report entrant", value: `+${metrics.carryInThisMonth}j` }]
										: []),
									{
										label: "Total contrat",
										value: `${metrics.totalDaysConsumed}/${metrics.totalDaysAllocated}j`,
									},
								]}
								className="border-0 rounded-none shadow-none"
							/>
						</Bleed>

						{/* Progress bar — minimal */}
						<BlockStack gap="100">
							<InlineStack align="space-between" blockAlign="center">
								<span className="text-xs text-fg-muted">
									{metrics.isAnticipated
										? `Consommation ${formatMonth(metrics.targetMonth)}`
										: "Consommation du mois"}
								</span>
								<span className="text-xs text-fg-muted tabular-nums">
									{metrics.daysConsumedThisMonth} / {metrics.daysAllocatedThisMonth}j ({percentThisMonth}%)
								</span>
							</InlineStack>
							<div className="h-1.5 bg-surface-3 rounded-full overflow-hidden">
								<div
									className={`h-full rounded-full transition-all ${colors.bar}`}
									style={{ width: `${clampedPercent}%` }}
								/>
							</div>
						</BlockStack>

						{/* Monthly breakdown */}
						{metrics.monthlyBreakdown.length > 1 && (
							<BlockStack gap="200">
								<span className="text-xs text-fg-muted">Historique mensuel</span>
								<div className="rounded-md border border-edge overflow-hidden">
									<table className="w-full text-xs">
										<thead>
											<tr className="bg-surface-3/50">
												<th className="text-left px-3 py-1.5 font-medium text-fg-muted">Mois</th>
												<th className="text-right px-3 py-1.5 font-medium text-fg-muted">Alloués</th>
												<th className="text-right px-3 py-1.5 font-medium text-fg-muted">Consommés</th>
												{contract.carryOver && (
													<th className="text-right px-3 py-1.5 font-medium text-fg-muted">Report</th>
												)}
												<th className="text-right px-3 py-1.5 font-medium text-fg-muted">Restant</th>
											</tr>
										</thead>
										<tbody>
											{metrics.monthlyBreakdown.map((row) => {
												const rowColors = healthColor(row.health)
												return (
													<tr key={row.month} className="border-t border-edge">
														<td className="px-3 py-1.5 font-mono text-fg">{row.month}</td>
														<td className="text-right px-3 py-1.5 font-mono text-fg-muted">{row.allocated}j</td>
														<td className="text-right px-3 py-1.5 font-mono text-fg">{row.consumed}j</td>
														{contract.carryOver && (
															<td className="text-right px-3 py-1.5 font-mono text-fg-muted">
																{row.carryIn > 0 ? `+${row.carryIn}j` : "—"}
															</td>
														)}
														<td className={`text-right px-3 py-1.5 font-mono font-medium ${rowColors.text}`}>
															{row.remaining}j
														</td>
													</tr>
												)
											})}
										</tbody>
									</table>
								</div>
							</BlockStack>
						)}
					</>
				)}

				{/* ── Forfait metrics ── */}
				{forfaitMetrics &&
					(() => {
						const fColors = healthColor(forfaitMetrics.health)
						const clampedForfait = Math.min(forfaitMetrics.percentUsed, 100)
						return (
							<>
								{forfaitMetrics.health === "over" && (
									<div className={`px-3 py-2 rounded-md text-xs font-medium ${fColors.bg} ${fColors.text}`}>
										Dépassement de {Math.abs(forfaitMetrics.remaining).toLocaleString("fr-FR")}€
									</div>
								)}
								{(forfaitMetrics.health === "danger" || forfaitMetrics.health === "warning") && (
									<div className={`px-3 py-2 rounded-md text-xs font-medium ${fColors.bg} ${fColors.text}`}>
										{forfaitMetrics.percentUsed}% du budget consommé
									</div>
								)}
								<BlockStack gap="100">
									<InlineStack align="space-between" blockAlign="center">
										<span className="text-xs text-fg-muted">Budget consommé</span>
										<span className="text-xs text-fg-muted tabular-nums">
											{forfaitMetrics.consumed.toLocaleString("fr-FR")}€ / {forfaitMetrics.budgetTotal.toLocaleString("fr-FR")}€ ({forfaitMetrics.percentUsed}%)
										</span>
									</InlineStack>
									<div className="h-1.5 bg-surface-3 rounded-full overflow-hidden">
										<div
											className={`h-full rounded-full transition-all ${fColors.bar}`}
											style={{ width: `${clampedForfait}%` }}
										/>
									</div>
								</BlockStack>
							</>
						)
					})()}

				{/* ── Attached files ── */}
				{files && files.length > 0 && (
					<>
						<Divider />
						<BlockStack gap="200">
							<span className="text-xs text-fg-muted">Pièces jointes</span>
							<BlockStack gap="100">
								{files.map((file) => (
									<InlineStack
										key={file._id}
										gap="200"
										blockAlign="center"
										className="rounded-md bg-app px-3 py-1.5 text-xs"
									>
										<FileText className="size-3.5 shrink-0 text-fg-muted" />
										<span className="min-w-0 flex-1 truncate text-fg">{file.fileName}</span>
										<span className="shrink-0 text-fg-muted tabular-nums">
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
												<Download className="size-3" />
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
											<Trash2 className="size-3" />
										</button>
									</InlineStack>
								))}
							</BlockStack>
						</BlockStack>
					</>
				)}

				{/* ── Notes ── */}
				{contract.notes && (
					<>
						<Divider />
						<BlockStack gap="100">
							<span className="text-xs text-fg-muted">Notes</span>
							<p className="text-xs text-fg whitespace-pre-wrap">{contract.notes}</p>
						</BlockStack>
					</>
				)}
			</BlockStack>
		</Box>
	)
}

