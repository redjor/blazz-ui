"use client"

import { BlockStack } from "@blazz/ui/components/ui/block-stack"
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@blazz/ui/components/ui/select"
import { Textarea } from "@blazz/ui/components/ui/textarea"
import { useMutation } from "convex/react"
import { useForm, Controller } from "react-hook-form"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"

interface ExpenseFormValues {
	name: string
	amountCents: string
	amountType: "fixed" | "variable"
	frequency: "monthly" | "quarterly" | "yearly"
	dayOfMonth: string
	startDate: string
	endDate: string
	notes: string
}

interface ExpenseDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	expense?: {
		_id: Id<"recurringExpenses">
		name: string
		amountCents: number
		amountType: "fixed" | "variable"
		frequency: "monthly" | "quarterly" | "yearly"
		dayOfMonth?: number
		startDate: string
		endDate?: string
		notes?: string
	} | null
}

export function ExpenseDialog({ open, onOpenChange, expense }: ExpenseDialogProps) {
	const create = useMutation(api.recurringExpenses.create)
	const update = useMutation(api.recurringExpenses.update)

	const {
		register,
		handleSubmit,
		control,
		reset,
		formState: { isSubmitting },
	} = useForm<ExpenseFormValues>({
		defaultValues: {
			name: expense?.name ?? "",
			amountCents: expense ? String(expense.amountCents / 100) : "",
			amountType: expense?.amountType ?? "fixed",
			frequency: expense?.frequency ?? "monthly",
			dayOfMonth: expense?.dayOfMonth ? String(expense.dayOfMonth) : "",
			startDate: expense?.startDate ?? new Date().toISOString().slice(0, 10),
			endDate: expense?.endDate ?? "",
			notes: expense?.notes ?? "",
		},
	})

	async function onSubmit(data: ExpenseFormValues) {
		const amountCents = Math.round(Number(data.amountCents) * 100)
		const args = {
			name: data.name,
			amountCents,
			amountType: data.amountType as "fixed" | "variable",
			frequency: data.frequency as "monthly" | "quarterly" | "yearly",
			dayOfMonth: data.dayOfMonth ? Number(data.dayOfMonth) : undefined,
			startDate: data.startDate,
			endDate: data.endDate || undefined,
			notes: data.notes || undefined,
		}

		if (expense) {
			await update({ id: expense._id, ...args })
		} else {
			await create(args)
		}

		reset()
		onOpenChange(false)
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-lg">
				<form onSubmit={handleSubmit(onSubmit)}>
					<DialogHeader>
						<DialogTitle>{expense ? "Modifier la dépense" : "Nouvelle dépense récurrente"}</DialogTitle>
					</DialogHeader>

					<BlockStack gap="400" className="py-4">
						<BlockStack gap="200">
							<Label htmlFor="expense-name">Nom</Label>
							<Input
								id="expense-name"
								placeholder="ex: Mutuelle Alan, URSSAF, Notion..."
								{...register("name", { required: true })}
							/>
						</BlockStack>

						<div className="grid grid-cols-2 gap-4">
							<BlockStack gap="200">
								<Label htmlFor="expense-amount">Montant (€)</Label>
								<Input
									id="expense-amount"
									type="number"
									step="0.01"
									placeholder="ex: 350"
									{...register("amountCents", { required: true })}
								/>
							</BlockStack>

							<BlockStack gap="200">
								<Label>Type de montant</Label>
								<Controller
									control={control}
									name="amountType"
									render={({ field }) => (
										<Select value={field.value} onValueChange={field.onChange}>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="fixed">Fixe</SelectItem>
												<SelectItem value="variable">Variable (estimé)</SelectItem>
											</SelectContent>
										</Select>
									)}
								/>
							</BlockStack>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<BlockStack gap="200">
								<Label>Fréquence</Label>
								<Controller
									control={control}
									name="frequency"
									render={({ field }) => (
										<Select value={field.value} onValueChange={field.onChange}>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="monthly">Mensuel</SelectItem>
												<SelectItem value="quarterly">Trimestriel</SelectItem>
												<SelectItem value="yearly">Annuel</SelectItem>
											</SelectContent>
										</Select>
									)}
								/>
							</BlockStack>

							<BlockStack gap="200">
								<Label htmlFor="expense-day">Jour du mois</Label>
								<Input
									id="expense-day"
									type="number"
									min={1}
									max={31}
									placeholder="ex: 15"
									{...register("dayOfMonth")}
								/>
							</BlockStack>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<BlockStack gap="200">
								<Label htmlFor="expense-start">Date de début</Label>
								<Input
									id="expense-start"
									type="date"
									{...register("startDate", { required: true })}
								/>
							</BlockStack>

							<BlockStack gap="200">
								<Label htmlFor="expense-end">Date de fin (optionnel)</Label>
								<Input id="expense-end" type="date" {...register("endDate")} />
							</BlockStack>
						</div>

						<BlockStack gap="200">
							<Label htmlFor="expense-notes">Notes</Label>
							<Textarea
								id="expense-notes"
								placeholder="Détails, numéro de contrat..."
								rows={2}
								{...register("notes")}
							/>
						</BlockStack>
					</BlockStack>

					<DialogFooter>
						<Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
							Annuler
						</Button>
						<Button type="submit" disabled={isSubmitting}>
							{expense ? "Enregistrer" : "Ajouter"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
