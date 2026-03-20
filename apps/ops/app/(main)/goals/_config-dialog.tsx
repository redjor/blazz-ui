"use client"

import { useMemo } from "react"
import { useForm } from "react-hook-form"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { resolveMonthlyTargets } from "@/lib/goals"

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@blazz/ui/components/ui/dialog"
import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { InlineGrid } from "@blazz/ui/components/ui/inline-grid"
import { Input } from "@blazz/ui/components/ui/input"
import { Label } from "@blazz/ui/components/ui/label"
import { Button } from "@blazz/ui/components/ui/button"
import { Divider } from "@blazz/ui/components/ui/divider"

const MONTH_LABELS = [
	"Jan",
	"Fév",
	"Mar",
	"Avr",
	"Mai",
	"Jun",
	"Jul",
	"Aoû",
	"Sep",
	"Oct",
	"Nov",
	"Déc",
] as const

interface GoalsConfigDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	year: number
	plan: {
		revenue: { annual: number; overrides: Record<string, number> }
		days: { annual: number; overrides: Record<string, number> }
		tjm: { target: number }
	} | null
}

interface FormValues {
	revenueAnnual: string
	revenueOverrides: string[]
	daysAnnual: string
	daysOverrides: string[]
	tjmTarget: string
}

function overridesToStrings(overrides: Record<string, number>): string[] {
	return Array.from({ length: 12 }, (_, i) => {
		const key = String(i + 1)
		return key in overrides ? String(overrides[key]) : ""
	})
}

function stringsToOverrides(values: string[]): Record<string, number> {
	const result: Record<string, number> = {}
	for (let i = 0; i < 12; i++) {
		const v = values[i]?.trim()
		if (v !== "" && v !== undefined) {
			const num = Number(v)
			if (!Number.isNaN(num)) {
				result[String(i + 1)] = num
			}
		}
	}
	return result
}

export function GoalsConfigDialog({
	open,
	onOpenChange,
	year,
	plan,
}: GoalsConfigDialogProps) {
	const save = useMutation(api.goals.save)

	const {
		register,
		handleSubmit,
		watch,
		formState: { isSubmitting },
	} = useForm<FormValues>({
		defaultValues: {
			revenueAnnual: plan?.revenue.annual ? String(plan.revenue.annual) : "",
			revenueOverrides: plan
				? overridesToStrings(plan.revenue.overrides)
				: Array(12).fill(""),
			daysAnnual: plan?.days.annual ? String(plan.days.annual) : "",
			daysOverrides: plan
				? overridesToStrings(plan.days.overrides)
				: Array(12).fill(""),
			tjmTarget: plan?.tjm.target ? String(plan.tjm.target) : "",
		},
	})

	const watchedRevenueAnnual = watch("revenueAnnual")
	const watchedRevenueOverrides = watch("revenueOverrides")
	const watchedDaysAnnual = watch("daysAnnual")
	const watchedDaysOverrides = watch("daysOverrides")

	const resolvedRevenue = useMemo(() => {
		const annual = Number(watchedRevenueAnnual) || 0
		const overrides = stringsToOverrides(watchedRevenueOverrides)
		return resolveMonthlyTargets(annual, overrides)
	}, [watchedRevenueAnnual, watchedRevenueOverrides])

	const resolvedDays = useMemo(() => {
		const annual = Number(watchedDaysAnnual) || 0
		const overrides = stringsToOverrides(watchedDaysOverrides)
		return resolveMonthlyTargets(annual, overrides)
	}, [watchedDaysAnnual, watchedDaysOverrides])

	async function onSubmit(data: FormValues) {
		const revenueAnnual = Number(data.revenueAnnual) || 0
		const daysAnnual = Number(data.daysAnnual) || 0
		const tjmTarget = Number(data.tjmTarget) || 0

		await save({
			year,
			revenue: {
				annual: revenueAnnual,
				overrides: stringsToOverrides(data.revenueOverrides),
			},
			days: {
				annual: daysAnnual,
				overrides: stringsToOverrides(data.daysOverrides),
			},
			tjm: { target: tjmTarget },
		})

		onOpenChange(false)
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-2xl">
				<form onSubmit={handleSubmit(onSubmit)}>
					<DialogHeader>
						<DialogTitle>Objectifs {year}</DialogTitle>
						<DialogDescription>
							Définissez vos cibles annuelles. Les mois vides sont
							auto-calculés.
						</DialogDescription>
					</DialogHeader>

					<BlockStack
						gap="600"
						className="max-h-[60vh] overflow-y-auto py-4"
					>
						{/* ── Revenu ── */}
						<BlockStack gap="400">
							<BlockStack gap="200">
								<Label htmlFor="revenueAnnual">Objectif annuel (€)</Label>
								<Input
									id="revenueAnnual"
									type="number"
									placeholder="ex: 120000"
									{...register("revenueAnnual")}
								/>
							</BlockStack>

							<BlockStack gap="200">
								<Label>Overrides mensuels</Label>
								<InlineGrid columns={4} gap="200">
									{MONTH_LABELS.map((label, i) => (
										<BlockStack key={label} gap="100">
											<Label className="text-xs text-fg-muted">
												{label}
											</Label>
											<Input
												type="number"
												placeholder={String(resolvedRevenue[i])}
												{...register(`revenueOverrides.${i}`)}
											/>
										</BlockStack>
									))}
								</InlineGrid>
							</BlockStack>
						</BlockStack>

						<Divider />

						{/* ── Jours facturables ── */}
						<BlockStack gap="400">
							<BlockStack gap="200">
								<Label htmlFor="daysAnnual">
									Jours facturables — objectif annuel
								</Label>
								<Input
									id="daysAnnual"
									type="number"
									placeholder="ex: 218"
									{...register("daysAnnual")}
								/>
							</BlockStack>

							<BlockStack gap="200">
								<Label>Overrides mensuels</Label>
								<InlineGrid columns={4} gap="200">
									{MONTH_LABELS.map((label, i) => (
										<BlockStack key={label} gap="100">
											<Label className="text-xs text-fg-muted">
												{label}
											</Label>
											<Input
												type="number"
												placeholder={String(resolvedDays[i])}
												{...register(`daysOverrides.${i}`)}
											/>
										</BlockStack>
									))}
								</InlineGrid>
							</BlockStack>
						</BlockStack>

						<Divider />

						{/* ── TJM cible ── */}
						<BlockStack gap="200">
							<Label htmlFor="tjmTarget">TJM cible (€/jour)</Label>
							<Input
								id="tjmTarget"
								type="number"
								placeholder="ex: 550"
								{...register("tjmTarget")}
							/>
						</BlockStack>
					</BlockStack>

					<DialogFooter className="pt-4">
						<Button
							variant="outline"
							type="button"
							onClick={() => onOpenChange(false)}
						>
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
