"use client"

import { Button } from "@blazz/ui/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@blazz/ui/components/ui/dialog"
import { Input } from "@blazz/ui/components/ui/input"
import { Label } from "@blazz/ui/components/ui/label"
import { useAction, useMutation } from "convex/react"
import { useState } from "react"
import { toast } from "sonner"
import { api } from "@/convex/_generated/api"
import type { Doc, Id } from "@/convex/_generated/dataModel"

interface Props {
	open: boolean
	onOpenChange: (open: boolean) => void
	projectId: Id<"projects">
	projectName: string
	clientId: Id<"clients">
	qontoClientId: string | undefined
	entries: Doc<"timeEntries">[]
	contractType?: string
}

export function InvoicePreviewDialog({
	open,
	onOpenChange,
	projectId,
	projectName,
	clientId,
	qontoClientId,
	entries,
	contractType,
}: Props) {
	const createDraft = useMutation(api.invoices.createDraft)
	const createQontoInvoice = useAction(api.qonto.createInvoice)

	const totalHT = entries.reduce((sum, e) => sum + (e.minutes / 60) * e.hourlyRate, 0)
	const dates = entries.map((e) => e.date).sort()
	const periodStart = dates[0] ?? ""
	const periodEnd = dates[dates.length - 1] ?? ""
	const periodLabel =
		periodStart.slice(0, 7) === periodEnd.slice(0, 7)
			? new Date(periodStart).toLocaleDateString("fr-FR", {
					month: "long",
					year: "numeric",
				})
			: `${new Date(periodStart).toLocaleDateString("fr-FR", { month: "short" })} — ${new Date(periodEnd).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}`

	const defaultLabel = `Prestation ${contractType === "tma" ? "TMA " : ""}${projectName} — ${periodLabel}`

	const [label, setLabel] = useState(defaultLabel)
	const [vatRate, setVatRate] = useState(0.2)
	const [sending, setSending] = useState(false)

	const totalTTC = totalHT * (1 + vatRate)

	const handleSend = async () => {
		if (!qontoClientId) {
			toast.error("Configurez l'ID Client Qonto dans la fiche client")
			return
		}

		setSending(true)
		try {
			const invoiceId = await createDraft({
				projectId,
				label,
				totalAmount: Math.round(totalHT * 100),
				vatRate,
				periodStart,
				periodEnd,
				entryIds: entries.map((e) => e._id),
			})

			await createQontoInvoice({
				invoiceId,
				qontoClientId,
				label,
				totalAmount: Math.round(totalHT * 100),
				vatRate,
			})

			toast.success("Facture envoyée à Qonto")
			onOpenChange(false)
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Erreur lors de la création")
		} finally {
			setSending(false)
		}
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent size="lg">
				<DialogHeader>
					<DialogTitle>Nouvelle facture</DialogTitle>
				</DialogHeader>

				<div className="space-y-4">
					{!qontoClientId && (
						<div className="px-4 py-2.5 rounded-lg text-sm font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400">
							ID Client Qonto manquant — configurez-le dans la fiche client.
						</div>
					)}

					<div className="space-y-1.5">
						<Label>Libellé</Label>
						<Input value={label} onChange={(e) => setLabel(e.target.value)} />
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-1.5">
							<Label>Période</Label>
							<p className="text-sm text-fg">
								{periodStart} → {periodEnd}
							</p>
						</div>
						<div className="space-y-1.5">
							<Label>Entrées</Label>
							<p className="text-sm text-fg">{entries.length} entrée(s)</p>
						</div>
					</div>

					<div className="space-y-1.5">
						<Label htmlFor="vatRate">TVA (%)</Label>
						<Input
							id="vatRate"
							type="number"
							step="1"
							value={vatRate * 100}
							onChange={(e) => setVatRate(Number(e.target.value) / 100)}
						/>
					</div>

					<div className="border-t border-edge pt-4 space-y-2">
						<div className="flex justify-between text-sm">
							<span className="text-fg-muted">Montant HT</span>
							<span className="font-mono font-medium text-fg">
								{totalHT.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
							</span>
						</div>
						<div className="flex justify-between text-sm">
							<span className="text-fg-muted">TVA ({(vatRate * 100).toFixed(0)}%)</span>
							<span className="font-mono text-fg-muted">
								{(totalHT * vatRate).toLocaleString("fr-FR", {
									minimumFractionDigits: 2,
								})}{" "}
								€
							</span>
						</div>
						<div className="flex justify-between text-sm font-medium">
							<span className="text-fg">Total TTC</span>
							<span className="font-mono text-fg">
								{totalTTC.toLocaleString("fr-FR", {
									minimumFractionDigits: 2,
								})}{" "}
								€
							</span>
						</div>
					</div>
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={() => onOpenChange(false)} disabled={sending}>
						Annuler
					</Button>
					<Button onClick={handleSend} disabled={sending || !qontoClientId}>
						{sending ? "Envoi en cours…" : "Envoyer à Qonto"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
