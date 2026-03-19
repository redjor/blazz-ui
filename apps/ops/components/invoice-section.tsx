"use client"

import { Button } from "@blazz/ui/components/ui/button"
import { Card, CardContent } from "@blazz/ui/components/ui/card"
import { useMutation, useQuery } from "convex/react"
import { toast } from "sonner"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"

interface Props {
	projectId: Id<"projects">
}

const STATUS_LABEL: Record<string, string> = {
	draft: "À valider",
	sent: "Envoyée",
	paid: "Payée",
}

const STATUS_COLOR: Record<string, string> = {
	draft: "text-fg-muted",
	sent: "text-amber-600 dark:text-amber-400",
	paid: "text-green-600 dark:text-green-400",
}

export function InvoiceSection({ projectId }: Props) {
	const invoices = useQuery(api.invoices.listByProject, { projectId })
	const markPaid = useMutation(api.invoices.markPaid)

	if (!invoices || invoices.length === 0) return null

	const totalInvoiced = invoices
		.filter((i) => i.status === "sent" || i.status === "paid")
		.reduce((s, i) => s + i.totalAmount, 0)
	const totalPaid = invoices
		.filter((i) => i.status === "paid")
		.reduce((s, i) => s + i.totalAmount, 0)

	return (
		<div className="space-y-4">
			<h2 className="text-sm font-medium text-fg">Factures</h2>

			<div className="grid grid-cols-2 gap-4">
				<Card>
					<CardContent className="p-4">
						<p className="text-xs text-fg-muted mb-1">Facturé</p>
						<p className="text-xl font-semibold font-mono">
							{(totalInvoiced / 100).toLocaleString("fr-FR")} €
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-4">
						<p className="text-xs text-fg-muted mb-1">Encaissé</p>
						<p className="text-xl font-semibold font-mono text-green-600 dark:text-green-400">
							{(totalPaid / 100).toLocaleString("fr-FR")} €
						</p>
					</CardContent>
				</Card>
			</div>

			<div className="border border-edge rounded-lg overflow-hidden">
				<table className="w-full text-xs">
					<thead>
						<tr className="bg-surface-3">
							<th className="text-left px-3 py-2 font-medium text-fg-muted">N°</th>
							<th className="text-left px-3 py-2 font-medium text-fg-muted">Libellé</th>
							<th className="text-right px-3 py-2 font-medium text-fg-muted">Montant HT</th>
							<th className="text-center px-3 py-2 font-medium text-fg-muted">Statut</th>
							<th className="text-right px-3 py-2 font-medium text-fg-muted">Actions</th>
						</tr>
					</thead>
					<tbody>
						{invoices.map((inv) => (
							<tr key={inv._id} className="border-t border-edge">
								<td className="px-3 py-2 font-mono text-fg">{inv.qontoNumber ?? "—"}</td>
								<td className="px-3 py-2 text-fg truncate max-w-[200px]">{inv.label}</td>
								<td className="text-right px-3 py-2 font-mono text-fg">
									{(inv.totalAmount / 100).toLocaleString("fr-FR")} €
								</td>
								<td className={`text-center px-3 py-2 font-medium ${STATUS_COLOR[inv.status]}`}>
									{STATUS_LABEL[inv.status]}
								</td>
								<td className="text-right px-3 py-2">
									{inv.status === "sent" && (
										<Button
											size="sm"
											variant="ghost"
											onClick={async () => {
												try {
													await markPaid({ id: inv._id })
													toast.success("Facture marquée payée")
												} catch (e) {
													toast.error(e instanceof Error ? e.message : "Erreur")
												}
											}}
										>
											Payée
										</Button>
									)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	)
}
