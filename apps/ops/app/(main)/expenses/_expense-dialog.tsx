"use client"

import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { Button } from "@blazz/ui/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@blazz/ui/components/ui/dialog"
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import { Input } from "@blazz/ui/components/ui/input"
import { Label } from "@blazz/ui/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@blazz/ui/components/ui/select"
import { Textarea } from "@blazz/ui/components/ui/textarea"
import { useMutation, useQuery } from "convex/react"
import { useEffect, useMemo } from "react"
import { Controller, useForm } from "react-hook-form"
import { ProjectIcon } from "@/components/project-icon"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { computeMileageReimbursement } from "@/convex/lib/urssaf"

// ── Types ─────────────────────────────────────────────────────────────

type ExpenseType = "restaurant" | "mileage"

interface ExpenseDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	type: ExpenseType
	expense?: {
		_id: Id<"expenses">
		type: ExpenseType
		date: string
		amountCents?: number
		clientId?: Id<"clients">
		projectId?: Id<"projects">
		notes?: string
		guests?: string
		purpose?: string
		departure?: string
		destination?: string
		distanceKm?: number
		reimbursementCents?: number
	} | null
}

interface ExpenseFormValues {
	date: string
	amountCents: string
	clientId: string
	projectId: string
	notes: string
	guests: string
	purpose: string
	departure: string
	destination: string
	distanceKm: string
}

// ── Helpers ───────────────────────────────────────────────────────────

function today() {
	return new Date().toISOString().slice(0, 10)
}

function centsToEuros(cents: number | undefined): string {
	if (!cents) return ""
	return (cents / 100).toFixed(2)
}

function formatCurrency(cents: number): string {
	return new Intl.NumberFormat("fr-FR", {
		style: "currency",
		currency: "EUR",
	}).format(cents / 100)
}

// ── Component ─────────────────────────────────────────────────────────

export function ExpenseDialog({ open, onOpenChange, type, expense }: ExpenseDialogProps) {
	const isEdit = !!expense

	const clients = useQuery(api.clients.list)
	const createExpense = useMutation(api.expenses.create)
	const updateExpense = useMutation(api.expenses.update)

	const { control, handleSubmit, reset, watch } = useForm<ExpenseFormValues>({
		defaultValues: {
			date: expense?.date ?? today(),
			amountCents: centsToEuros(expense?.amountCents),
			clientId: (expense?.clientId as string) ?? "",
			projectId: (expense?.projectId as string) ?? "",
			notes: expense?.notes ?? "",
			guests: expense?.guests ?? "",
			purpose: expense?.purpose ?? "",
			departure: expense?.departure ?? "",
			destination: expense?.destination ?? "",
			distanceKm: expense?.distanceKm?.toString() ?? "",
		},
	})

	// Reset form when expense or type changes
	useEffect(() => {
		reset({
			date: expense?.date ?? today(),
			amountCents: centsToEuros(expense?.amountCents),
			clientId: (expense?.clientId as string) ?? "",
			projectId: (expense?.projectId as string) ?? "",
			notes: expense?.notes ?? "",
			guests: expense?.guests ?? "",
			purpose: expense?.purpose ?? "",
			departure: expense?.departure ?? "",
			destination: expense?.destination ?? "",
			distanceKm: expense?.distanceKm?.toString() ?? "",
		})
	}, [expense, type, reset])

	// Watch fields for dynamic behavior
	const selectedClientId = watch("clientId")
	const distanceKmStr = watch("distanceKm")

	// Load projects filtered by selected client
	const projects = useQuery(api.projects.listByClient, selectedClientId ? { clientId: selectedClientId as Id<"clients"> } : "skip")

	// Select items
	const clientItems = useMemo(() => [{ value: "", label: "Aucun" }, ...(clients?.map((c) => ({ value: c._id, label: c.name })) ?? [])], [clients])

	const projectItems = useMemo(() => [{ value: "", label: "Aucun" }, ...(projects?.map((p) => ({ value: p._id, label: p.name })) ?? [])], [projects])

	// Mileage reimbursement preview (approximation with 0 annual km)
	const mileagePreview = useMemo(() => {
		const km = Number.parseFloat(distanceKmStr)
		if (!km || km <= 0) return null
		// Use 5 CV as default approximation since we don't have vehicle settings client-side
		const cents = computeMileageReimbursement(km, 0, 5)
		return cents
	}, [distanceKmStr])

	// Submit handler
	async function onSubmit(values: ExpenseFormValues) {
		const common = {
			date: values.date,
			clientId: values.clientId ? (values.clientId as Id<"clients">) : undefined,
			projectId: values.projectId ? (values.projectId as Id<"projects">) : undefined,
			notes: values.notes || undefined,
		}

		if (isEdit) {
			if (type === "restaurant") {
				await updateExpense({
					id: expense._id,
					...common,
					amountCents: values.amountCents ? Math.round(Number.parseFloat(values.amountCents) * 100) : undefined,
					guests: values.guests || undefined,
					purpose: values.purpose || undefined,
				})
			} else {
				await updateExpense({
					id: expense._id,
					...common,
					departure: values.departure || undefined,
					destination: values.destination || undefined,
					distanceKm: values.distanceKm ? Number.parseFloat(values.distanceKm) : undefined,
				})
			}
		} else {
			if (type === "restaurant") {
				await createExpense({
					type: "restaurant",
					...common,
					amountCents: values.amountCents ? Math.round(Number.parseFloat(values.amountCents) * 100) : undefined,
					guests: values.guests || undefined,
					purpose: values.purpose || undefined,
				})
			} else {
				await createExpense({
					type: "mileage",
					...common,
					departure: values.departure || undefined,
					destination: values.destination || undefined,
					distanceKm: values.distanceKm ? Number.parseFloat(values.distanceKm) : undefined,
				})
			}
		}

		onOpenChange(false)
	}

	const title = isEdit ? (type === "restaurant" ? "Modifier le repas" : "Modifier le trajet") : type === "restaurant" ? "Ajouter un repas" : "Ajouter un trajet"

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit(onSubmit)}>
					<BlockStack gap="4">
						{/* Date */}
						<div className="space-y-2">
							<Label htmlFor="date">Date</Label>
							<Controller control={control} name="date" rules={{ required: true }} render={({ field }) => <Input id="date" type="date" {...field} />} />
						</div>

						{type === "restaurant" && (
							<>
								{/* Montant TTC */}
								<div className="space-y-2">
									<Label htmlFor="amountCents">Montant TTC (€)</Label>
									<Controller
										control={control}
										name="amountCents"
										rules={{ required: true }}
										render={({ field }) => <Input id="amountCents" type="number" step="0.01" min="0" placeholder="0.00" {...field} />}
									/>
								</div>

								{/* Convives */}
								<div className="space-y-2">
									<Label htmlFor="guests">Convive(s)</Label>
									<Controller control={control} name="guests" render={({ field }) => <Input id="guests" placeholder="Noms des convives" {...field} />} />
								</div>

								{/* Motif */}
								<div className="space-y-2">
									<Label htmlFor="purpose">Motif</Label>
									<Controller control={control} name="purpose" render={({ field }) => <Input id="purpose" placeholder="Motif du repas" {...field} />} />
								</div>
							</>
						)}

						{type === "mileage" && (
							<BlockStack gap="4">
								{/* Départ + Destination */}
								<div className="grid grid-cols-2 gap-3">
									<div className="space-y-2">
										<Label htmlFor="departure">Départ</Label>
										<Controller control={control} name="departure" rules={{ required: true }} render={({ field }) => <Input id="departure" placeholder="Ville de départ" {...field} />} />
									</div>
									<div className="space-y-2">
										<Label htmlFor="destination">Destination</Label>
										<Controller control={control} name="destination" rules={{ required: true }} render={({ field }) => <Input id="destination" placeholder="Ville d'arrivée" {...field} />} />
									</div>
								</div>

								{/* Distance + Indemnité estimée */}
								<div className="grid grid-cols-2 gap-3">
									<div className="space-y-2">
										<Label htmlFor="distanceKm">Distance (km)</Label>
										<Controller
											control={control}
											name="distanceKm"
											rules={{ required: true }}
											render={({ field }) => <Input id="distanceKm" type="number" step="1" min="0" placeholder="0" {...field} />}
										/>
									</div>
									<div className="space-y-2">
										<Label>Indemnité estimée</Label>
										<div className="flex h-9 items-center rounded-md border border-edge bg-muted px-3 text-sm text-fg-muted">{mileagePreview !== null ? formatCurrency(mileagePreview) : "—"}</div>
									</div>
								</div>
							</BlockStack>
						)}

						{/* Client */}
						<div className="space-y-2">
							<Label>Client</Label>
							<Controller
								control={control}
								name="clientId"
								render={({ field }) => (
									<Select
										value={field.value}
										onValueChange={(val) => {
											field.onChange(val)
											// Reset project when client changes
										}}
										items={clientItems}
									>
										<SelectTrigger>
											<SelectValue placeholder="Aucun" />
										</SelectTrigger>
										<SelectContent>
											{clientItems.map((item) => (
												<SelectItem key={item.value} value={item.value}>
													{item.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								)}
							/>
						</div>

						{/* Projet (shown only if client selected) */}
						{selectedClientId && (
							<div className="space-y-2">
								<Label>Projet</Label>
								<Controller
									control={control}
									name="projectId"
									render={({ field }) => {
										const selectedProject = projects?.find((p) => p._id === field.value)
										return (
											<Select value={field.value} onValueChange={field.onChange} items={projectItems}>
												<SelectTrigger>
													{selectedProject ? (
														<InlineStack gap="200" blockAlign="center">
															<ProjectIcon icon={selectedProject.icon} color={selectedProject.color} size="xs" />
															<span className="truncate">{selectedProject.name}</span>
														</InlineStack>
													) : (
														<SelectValue placeholder="Aucun" />
													)}
												</SelectTrigger>
												<SelectContent>
													{projects?.map((p) => (
														<SelectItem key={p._id} value={p._id} label={p.name}>
															<InlineStack gap="200" blockAlign="center">
																<ProjectIcon icon={p.icon} color={p.color} size="xs" />
																<span>{p.name}</span>
															</InlineStack>
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										)
									}}
								/>
							</div>
						)}

						{/* Notes */}
						<div className="space-y-2">
							<Label htmlFor="notes">Notes</Label>
							<Controller control={control} name="notes" render={({ field }) => <Textarea id="notes" placeholder="Notes complémentaires..." rows={2} {...field} />} />
						</div>
					</BlockStack>

					<DialogFooter className="mt-6">
						<Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
							Annuler
						</Button>
						<Button type="submit">{isEdit ? "Enregistrer" : "Ajouter"}</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
