"use client"

import { useAppTopBar } from "@blazz/pro/components/blocks/app-frame"
import { PageHeader } from "@blazz/pro/components/blocks/page-header"
import { StatsGrid } from "@blazz/pro/components/blocks/stats-grid"
import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { Button } from "@blazz/ui/components/ui/button"
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import { Skeleton } from "@blazz/ui/components/ui/skeleton"
import { useMutation, useQuery } from "convex/react"
import { CheckCircle, FileText, Plus, Send } from "lucide-react"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import { toast } from "sonner"
import { api } from "@/convex/_generated/api"
import { formatCurrency } from "@/lib/format"

type StatusFilter = "all" | "draft" | "sent" | "paid"

const STATUS_CONFIG: Record<string, { label: string; dotClass: string }> = {
	draft: { label: "Brouillon", dotClass: "bg-fg-muted" },
	sent: { label: "Envoyée", dotClass: "bg-amber-500" },
	paid: { label: "Payée", dotClass: "bg-green-500" },
}

const FILTER_TABS: { value: StatusFilter; label: string }[] = [
	{ value: "all", label: "Toutes" },
	{ value: "draft", label: "Brouillons" },
	{ value: "sent", label: "Envoyées" },
	{ value: "paid", label: "Payées" },
]

export default function InvoicesPageClient() {
	const invoices = useQuery(api.invoices.listAll)
	const markPaid = useMutation(api.invoices.markPaid)
	const router = useRouter()
	const [filter, setFilter] = useState<StatusFilter>("all")

	const topBarActions = useMemo(
		() => (
			<Button size="icon-sm" variant="ghost" onClick={() => router.push("/invoices/new")}>
				<Plus className="size-4" />
			</Button>
		),
		[router]
	)

	useAppTopBar([{ label: "Factures" }], topBarActions)

	const { draftTotal, draftCount, sentTotal, sentCount, paidTotal, paidCount } = useMemo(() => {
		if (!invoices) return { draftTotal: 0, draftCount: 0, sentTotal: 0, sentCount: 0, paidTotal: 0, paidCount: 0 }
		let draftTotal = 0,
			draftCount = 0
		let sentTotal = 0,
			sentCount = 0
		let paidTotal = 0,
			paidCount = 0
		for (const i of invoices) {
			if (i.status === "draft") {
				draftTotal += i.totalAmount
				draftCount++
			} else if (i.status === "sent") {
				sentTotal += i.totalAmount
				sentCount++
			} else if (i.status === "paid") {
				paidTotal += i.totalAmount
				paidCount++
			}
		}
		return { draftTotal, draftCount, sentTotal, sentCount, paidTotal, paidCount }
	}, [invoices])

	const filtered = useMemo(() => {
		if (!invoices) return []
		return filter === "all" ? invoices : invoices.filter((i) => i.status === filter)
	}, [invoices, filter])

	if (!invoices) {
		return (
			<BlockStack gap="600" className="p-6">
				<Skeleton className="h-8 w-48" />
				<div className="grid grid-cols-3 gap-4">
					<Skeleton className="h-20" />
					<Skeleton className="h-20" />
					<Skeleton className="h-20" />
				</div>
				<Skeleton className="h-64" />
			</BlockStack>
		)
	}

	return (
		<BlockStack gap="600" className="p-6">
			<PageHeader title="Factures" />

			<StatsGrid
				stats={[
					{
						label: "Brouillons",
						value: formatCurrency(draftTotal / 100),
						description: `${draftCount} facture(s)`,
						icon: FileText,
					},
					{
						label: "Envoyees",
						value: formatCurrency(sentTotal / 100),
						description: `${sentCount} facture(s)`,
						icon: Send,
					},
					{
						label: "Payees",
						value: formatCurrency(paidTotal / 100),
						description: `${paidCount} facture(s)`,
						icon: CheckCircle,
					},
				]}
			/>

			<InlineStack gap="100">
				{FILTER_TABS.map((tab) => (
					<Button key={tab.value} variant={filter === tab.value ? "default" : "ghost"} size="sm" onClick={() => setFilter(tab.value)}>
						{tab.label}
					</Button>
				))}
			</InlineStack>

			{filtered.length === 0 ? (
				<BlockStack gap="200" className="py-12 items-center text-center">
					<FileText className="size-12 text-fg-muted" />
					<p className="text-sm font-medium text-fg">Aucune facture</p>
					<p className="text-xs text-fg-muted">{filter === "all" ? "Creez votre premiere facture depuis un projet." : "Aucune facture avec ce statut."}</p>
				</BlockStack>
			) : (
				<div className="border border-edge rounded-lg overflow-hidden">
					<table className="w-full text-[13px]">
						<thead>
							<tr className="bg-muted">
								<th className="text-left px-3 py-2 font-medium text-fg-muted text-xs">N°</th>
								<th className="text-left px-3 py-2 font-medium text-fg-muted text-xs">Libelle</th>
								<th className="text-left px-3 py-2 font-medium text-fg-muted text-xs">Client</th>
								<th className="text-left px-3 py-2 font-medium text-fg-muted text-xs">Projet</th>
								<th className="text-left px-3 py-2 font-medium text-fg-muted text-xs">Periode</th>
								<th className="text-right px-3 py-2 font-medium text-fg-muted text-xs">Montant HT</th>
								<th className="text-center px-3 py-2 font-medium text-fg-muted text-xs">Statut</th>
								<th className="text-right px-3 py-2 font-medium text-fg-muted text-xs" />
							</tr>
						</thead>
						<tbody>
							{filtered.map((inv) => {
								const cfg = STATUS_CONFIG[inv.status]
								return (
									<tr key={inv._id} className="border-t border-edge hover:bg-muted/50 h-10 cursor-pointer" onClick={() => router.push(`/invoices/${inv._id}`)}>
										<td className="px-3 py-2 font-mono text-fg">{inv.qontoNumber ?? "—"}</td>
										<td className="px-3 py-2 text-fg font-medium truncate max-w-[240px]">{inv.label}</td>
										<td className="px-3 py-2 text-fg-secondary">{inv.clientName}</td>
										<td className="px-3 py-2 text-fg-secondary">{inv.projectName}</td>
										<td className="px-3 py-2 text-fg-muted text-xs">
											{inv.periodStart} → {inv.periodEnd}
										</td>
										<td className="text-right px-3 py-2 font-mono tabular-nums text-fg">
											{(inv.totalAmount / 100).toLocaleString("fr-FR", {
												minimumFractionDigits: 2,
											})}{" "}
											€
										</td>
										<td className="text-center px-3 py-2">
											<InlineStack gap="100" blockAlign="center" align="center">
												<span className={`size-1.5 rounded-full ${cfg.dotClass}`} />
												<span className="text-xs text-fg-secondary">{cfg.label}</span>
											</InlineStack>
										</td>
										<td className="text-right px-3 py-2">
											{inv.status === "sent" && (
												<Button
													size="sm"
													variant="ghost"
													onClick={async () => {
														try {
															await markPaid({ id: inv._id })
															toast.success("Facture marquee payee")
														} catch (e) {
															toast.error(e instanceof Error ? e.message : "Erreur")
														}
													}}
												>
													<CheckCircle className="size-3.5 mr-1" />
													Payee
												</Button>
											)}
										</td>
									</tr>
								)
							})}
						</tbody>
					</table>
				</div>
			)}
		</BlockStack>
	)
}
