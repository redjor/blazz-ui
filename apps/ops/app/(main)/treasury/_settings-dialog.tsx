"use client"

import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { Button } from "@blazz/ui/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@blazz/ui/components/ui/dialog"
import { Input } from "@blazz/ui/components/ui/input"
import { Label } from "@blazz/ui/components/ui/label"
import { useMutation } from "convex/react"
import { useForm } from "react-hook-form"
import { api } from "@/convex/_generated/api"

interface SettingsFormValues {
	manualBalance: string
	paymentDelayDays: string
	forecastMonths: string
}

interface TreasurySettingsDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	settings: {
		manualBalanceCents?: number
		defaultPaymentDelayDays: number
		forecastMonths: number
	} | null
}

export function TreasurySettingsDialog({ open, onOpenChange, settings }: TreasurySettingsDialogProps) {
	const save = useMutation(api.treasury.saveSettings)

	const {
		register,
		handleSubmit,
		formState: { isSubmitting },
	} = useForm<SettingsFormValues>({
		defaultValues: {
			manualBalance: settings?.manualBalanceCents != null
				? String(settings.manualBalanceCents / 100)
				: "",
			paymentDelayDays: String(settings?.defaultPaymentDelayDays ?? 30),
			forecastMonths: String(settings?.forecastMonths ?? 6),
		},
	})

	async function onSubmit(data: SettingsFormValues) {
		const manualBalance = data.manualBalance.trim()
		await save({
			manualBalanceCents: manualBalance ? Math.round(Number(manualBalance) * 100) : undefined,
			defaultPaymentDelayDays: Number(data.paymentDelayDays) || 30,
			forecastMonths: Number(data.forecastMonths) || 6,
		})
		onOpenChange(false)
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<form onSubmit={handleSubmit(onSubmit)}>
					<DialogHeader>
						<DialogTitle>Paramètres trésorerie</DialogTitle>
						<DialogDescription>
							Configurez le solde initial et les paramètres de projection.
						</DialogDescription>
					</DialogHeader>

					<BlockStack gap="400" className="py-4">
						<BlockStack gap="200">
							<Label htmlFor="manual-balance">Solde initial (€)</Label>
							<Input
								id="manual-balance"
								type="number"
								step="0.01"
								placeholder="ex: 25000 — laissez vide pour utiliser Qonto"
								{...register("manualBalance")}
							/>
							<p className="text-xs text-fg-muted">
								Point de départ du prévisionnel. Laissez vide si vous utilisez Qonto.
							</p>
						</BlockStack>

						<BlockStack gap="200">
							<Label htmlFor="payment-delay">Délai de paiement (jours)</Label>
							<Input
								id="payment-delay"
								type="number"
								min={0}
								max={120}
								placeholder="30"
								{...register("paymentDelayDays")}
							/>
							<p className="text-xs text-fg-muted">
								Délai moyen entre l'envoi d'une facture et le paiement.
							</p>
						</BlockStack>

						<BlockStack gap="200">
							<Label htmlFor="forecast-months">Horizon de projection (mois)</Label>
							<Input
								id="forecast-months"
								type="number"
								min={3}
								max={24}
								placeholder="6"
								{...register("forecastMonths")}
							/>
						</BlockStack>
					</BlockStack>

					<DialogFooter>
						<Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
							Annuler
						</Button>
						<Button type="submit" disabled={isSubmitting}>
							Sauvegarder
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
