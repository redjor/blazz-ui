"use client"

import { Button } from "@blazz/ui/components/ui/button"
import { Checkbox } from "@blazz/ui/components/ui/checkbox"
import { DateSelector } from "@blazz/ui/components/ui/date-selector"
import { DialogFooter } from "@blazz/ui/components/ui/dialog"
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
import { TagInput } from "@/components/tag-input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery } from "convex/react"
import { format, parseISO } from "date-fns"
import { type Resolver, useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"

const schema = z.object({
	projectId: z.string().min(1, "Projet requis"),
	date: z.string().min(1, "Date requise"),
	hours: z.coerce.number().min(0.25, "Minimum 15min").max(24),
	description: z.string().optional(),
	billable: z.boolean(),
	status: z.enum(["draft", "ready_to_invoice"]).optional(),
	tags: z.array(z.string()).optional().default([]),
})

type FormValues = z.infer<typeof schema>

interface EditDefaults {
	id: Id<"timeEntries">
	projectId: string
	date: string
	minutes: number
	description?: string
	billable: boolean
	status?: "draft" | "ready_to_invoice" | "invoiced" | "paid" | null
	tags?: string[]
}

interface Props {
	defaultValues?: EditDefaults
	/** Pre-fill date for new entries (yyyy-MM-dd) */
	defaultDate?: string
	onSuccess?: () => void
	onCancel?: () => void
}

export function TimeEntryForm({ defaultValues, defaultDate, onSuccess, onCancel }: Props) {
	const isEdit = !!defaultValues
	const activeProjects = useQuery(api.projects.listActive)
	const allProjects = useQuery(isEdit ? api.projects.listAll : api.projects.listActive)
	const allTags = useQuery(api.timeEntries.distinctTags)
	const projects = isEdit ? allProjects : activeProjects
	const create = useMutation(api.timeEntries.create)
	const update = useMutation(api.timeEntries.update)

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<FormValues>({
		resolver: zodResolver(schema) as Resolver<FormValues>,
		defaultValues: isEdit
			? {
					projectId: defaultValues.projectId,
					date: defaultValues.date,
					hours: defaultValues.minutes / 60,
					description: defaultValues.description ?? "",
					billable: defaultValues.billable,
					// Clamp to form-allowed values (invoiced/paid → show as "draft" in form)
					status: defaultValues.status === "ready_to_invoice" ? "ready_to_invoice" : "draft",
					tags: defaultValues.tags ?? [],
				}
			: {
					date: defaultDate ?? format(new Date(), "yyyy-MM-dd"),
					hours: 1,
					billable: true,
					status: "draft",
					tags: [],
				},
	})

	const onSubmit = async (values: FormValues): Promise<void> => {
		try {
			const project = projects?.find((p: { _id: string }) => p._id === values.projectId)
			if (!project) {
				toast.error("Projet introuvable")
				return
			}
			const hourlyRate =
				(project as { tjm: number; hoursPerDay: number }).tjm /
				(project as { tjm: number; hoursPerDay: number }).hoursPerDay

			if (isEdit) {
				await update({
					id: defaultValues.id,
					projectId: values.projectId as Id<"projects">,
					date: values.date,
					minutes: Math.round(values.hours * 60),
					hourlyRate,
					description: values.description,
					billable: values.billable,
					status: values.billable ? (values.status ?? "draft") : undefined,
					tags: values.tags?.length ? values.tags : undefined,
				})
				toast.success("Entrée mise à jour")
			} else {
				await create({
					projectId: values.projectId as Id<"projects">,
					date: values.date,
					minutes: Math.round(values.hours * 60),
					hourlyRate,
					description: values.description,
					billable: values.billable,
					status: values.billable ? (values.status ?? "draft") : undefined,
					tags: values.tags?.length ? values.tags : undefined,
				})
				toast.success("Entrée ajoutée")
				reset({
					date: values.date,
					hours: 1,
					projectId: values.projectId,
					billable: true,
					status: "draft",
					tags: [],
				})
			}
			onSuccess?.()
		} catch {
			toast.error("Une erreur est survenue")
		}
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
			<div className="space-y-1.5">
				<Label>Projet *</Label>
				<Select
					value={watch("projectId") ?? ""}
					onValueChange={(v) => setValue("projectId", v ?? "")}
					items={
						projects?.map((p: { _id: string; name: string }) => ({
							value: p._id,
							label: p.name,
						})) ?? []
					}
				>
					<SelectTrigger className="w-full">
						<SelectValue placeholder="Choisir un projet…" />
					</SelectTrigger>
					<SelectContent>
						{projects?.map((p: { _id: string; name: string }) => (
							<SelectItem key={p._id} value={p._id} label={p.name}>
								{p.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				{errors.projectId && <p className="text-xs text-red-500">{errors.projectId.message}</p>}
			</div>

			<div className="grid grid-cols-2 gap-4">
				<div className="space-y-1.5">
					<Label>Date *</Label>
					<DateSelector
						value={watch("date") ? parseISO(watch("date")) : undefined}
						onValueChange={(d) => setValue("date", d ? format(d, "yyyy-MM-dd") : "")}
						placeholder="Choisir une date…"
						formatStr="dd/MM/yyyy"
						className="w-full"
					/>
				</div>
				<div className="space-y-1.5">
					<Label>Durée *</Label>
					{(() => {
						const selectedProject = projects?.find(
							(p: { _id: string }) => p._id === watch("projectId")
						)
						const hpd = (selectedProject as { hoursPerDay?: number } | undefined)?.hoursPerDay
						if (!hpd || hpd <= 0) return null
						return (
							<div className="flex gap-2">
								<Button
									type="button"
									variant="outline"
									size="sm"
									className="flex-1 h-8 text-xs"
									onClick={() => setValue("hours", hpd / 2)}
								>
									½ j ({hpd / 2}h)
								</Button>
								<Button
									type="button"
									variant="outline"
									size="sm"
									className="flex-1 h-8 text-xs"
									onClick={() => setValue("hours", hpd)}
								>
									1 j ({hpd}h)
								</Button>
							</div>
						)
					})()}
					<Input type="number" step="0.25" min="0.25" max="24" {...register("hours")} />
					{errors.hours && <p className="text-xs text-red-500">{errors.hours.message}</p>}
				</div>
			</div>

			<div className="space-y-1.5">
				<Label>Description</Label>
				<Textarea placeholder="Ce qui a été fait…" rows={3} {...register("description")} />
			</div>

			<div className="space-y-1.5">
				<Label>Tags</Label>
				<TagInput
					value={watch("tags") ?? []}
					onChange={(tags) => setValue("tags", tags)}
					suggestions={allTags ?? []}
				/>
			</div>

			<div className="flex items-center gap-2">
				<Checkbox
					id="billable"
					checked={watch("billable")}
					onCheckedChange={(v) => setValue("billable", !!v)}
				/>
				<Label htmlFor="billable" className="font-normal cursor-pointer">
					Facturable
				</Label>
			</div>

			{watch("billable") && (
				<div className="space-y-1.5">
					<Label>Statut</Label>
					<Select
						value={watch("status") ?? "draft"}
						onValueChange={(v) => setValue("status", v as "draft" | "ready_to_invoice")}
						items={[
							{ value: "draft", label: "À valider" },
							{ value: "ready_to_invoice", label: "Prêt à facturer" },
						]}
					>
						<SelectTrigger className="w-full">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="draft" label="À valider">
								À valider
							</SelectItem>
							<SelectItem value="ready_to_invoice" label="Prêt à facturer">
								Prêt à facturer
							</SelectItem>
						</SelectContent>
					</Select>
				</div>
			)}

			<DialogFooter>
				{onCancel && (
					<Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
						Annuler
					</Button>
				)}
				<Button type="submit" disabled={isSubmitting}>
					{isEdit ? "Enregistrer" : "Ajouter"}
				</Button>
			</DialogFooter>
		</form>
	)
}
