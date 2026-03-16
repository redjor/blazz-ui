"use client"

import { Button } from "@blazz/ui/components/ui/button"
import { DateRangeSelector, DateSelector } from "@blazz/ui/components/ui/date-selector"
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
import { Switch } from "@blazz/ui/components/ui/switch"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "convex/react"
import { format, parseISO } from "date-fns"
import { FileText, Plus, X } from "lucide-react"
import { useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"

const schema = z
	.object({
		type: z.enum(["tma", "forfait", "regie"]),
		daysPerMonth: z.preprocess(
			(v) => (v === "" || v === undefined ? undefined : Number(v)),
			z.number().positive("Requis pour TMA").optional()
		),
		carryOver: z.boolean(),
		prestationStartDate: z.string().optional(),
		startDate: z.string().min(1, "Date de début requise"),
		endDate: z.string().min(1, "Date de fin requise"),
		status: z.enum(["active", "completed", "cancelled"]),
		notes: z.string().optional(),
	})
	.refine((d) => d.type !== "tma" || (d.daysPerMonth && d.daysPerMonth > 0), {
		message: "Jours/mois requis pour un contrat TMA",
		path: ["daysPerMonth"],
	})
	.refine((d) => !d.startDate || !d.endDate || d.endDate > d.startDate, {
		message: "La date de fin doit être après la date de début",
		path: ["endDate"],
	})
	.refine(
		(d) => !d.prestationStartDate || !d.startDate || d.prestationStartDate < d.startDate,
		{
			message: "Le début de prestation doit être avant la date de début du contrat",
			path: ["prestationStartDate"],
		}
	)

type FormValues = z.infer<typeof schema>

interface Props {
	projectId: Id<"projects">
	defaultValues?: Partial<FormValues> & { id?: Id<"contracts"> }
	onSuccess?: () => void
	onCancel?: () => void
}

export function ContractForm({ projectId, defaultValues, onSuccess, onCancel }: Props) {
	const create = useMutation(api.contracts.create)
	const update = useMutation(api.contracts.update)
	const generateUploadUrl = useMutation(api.contractFiles.generateUploadUrl)
	const createFile = useMutation(api.contractFiles.create)

	const fileInputRef = useRef<HTMLInputElement>(null)
	const [pendingFiles, setPendingFiles] = useState<File[]>([])

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors, isSubmitting },
	} = useForm<FormValues>({
		resolver: zodResolver(schema),
		defaultValues: {
			type: "tma",
			carryOver: false,
			status: "active",
			...defaultValues,
		},
	})

	const contractType = watch("type")

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files ?? [])
		const pdfFiles = files.filter((f) => f.type === "application/pdf")
		if (pdfFiles.length < files.length) {
			toast.error("Seuls les fichiers PDF sont acceptés")
		}
		setPendingFiles((prev) => [...prev, ...pdfFiles])
		if (fileInputRef.current) fileInputRef.current.value = ""
	}

	const removePendingFile = (index: number) => {
		setPendingFiles((prev) => prev.filter((_, i) => i !== index))
	}

	const uploadFiles = async (contractId: Id<"contracts">) => {
		for (const file of pendingFiles) {
			const uploadUrl = await generateUploadUrl()
			const res = await fetch(uploadUrl, {
				method: "POST",
				headers: { "Content-Type": file.type },
				body: file,
			})
			const { storageId } = (await res.json()) as { storageId: Id<"_storage"> }
			await createFile({
				contractId,
				storageId,
				fileName: file.name,
				fileSize: file.size,
			})
		}
	}

	const onSubmit = async (values: FormValues) => {
		try {
			if (defaultValues?.id) {
				await update({
					id: defaultValues.id,
					type: values.type,
					daysPerMonth: values.type === "tma" ? values.daysPerMonth : undefined,
					carryOver: values.carryOver,
					prestationStartDate: values.type === "tma" ? values.prestationStartDate : undefined,
					startDate: values.startDate,
					endDate: values.endDate,
					status: values.status,
					notes: values.notes,
				})
				if (pendingFiles.length > 0) {
					await uploadFiles(defaultValues.id)
				}
				toast.success("Contrat mis à jour")
			} else {
				const contractId = await create({ projectId, ...values })
				if (pendingFiles.length > 0) {
					await uploadFiles(contractId)
				}
				toast.success("Contrat créé")
			}
			onSuccess?.()
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Une erreur est survenue")
		}
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
			{/* Type */}
			<div className="space-y-1.5">
				<Label>Type *</Label>
				<Select
					value={watch("type")}
					onValueChange={(v) => setValue("type", v as "tma" | "forfait" | "regie")}
					items={[
						{ value: "tma", label: "TMA (jours/mois)" },
						{ value: "regie", label: "Régie" },
						{ value: "forfait", label: "Forfait" },
					]}
				>
					<SelectTrigger className="w-full">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="tma" label="TMA (jours/mois)">
							TMA (jours/mois)
						</SelectItem>
						<SelectItem value="regie" label="Régie">
							Régie
						</SelectItem>
						<SelectItem value="forfait" label="Forfait">
							Forfait
						</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{/* Days per month — only for TMA */}
			{contractType === "tma" && (
				<div className="space-y-1.5">
					<Label htmlFor="daysPerMonth">Jours / mois *</Label>
					<Input
						id="daysPerMonth"
						type="number"
						step="0.5"
						placeholder="Ex: 5"
						{...register("daysPerMonth")}
					/>
					{errors.daysPerMonth && (
						<p className="text-xs text-red-500">{errors.daysPerMonth.message}</p>
					)}
				</div>
			)}

			{/* Carry-over switch */}
			{contractType === "tma" && (
				<div className="flex items-center justify-between">
					<Label htmlFor="carryOver">Report des jours non consommés</Label>
					<Switch
						id="carryOver"
						checked={watch("carryOver")}
						onCheckedChange={(v) => setValue("carryOver", v)}
					/>
				</div>
			)}

			{/* Prestation start date — TMA only */}
			{contractType === "tma" && (
				<div className="space-y-1.5">
					<Label>Début de prestation</Label>
					<p className="text-xs text-fg-muted">
						Si la prestation commence avant le contrat, les jours seront comptés sur le premier mois.
					</p>
					<DateSelector
						value={
							watch("prestationStartDate")
								? parseISO(watch("prestationStartDate")!)
								: undefined
						}
						onValueChange={(date) =>
							setValue(
								"prestationStartDate",
								date ? format(date, "yyyy-MM-dd") : undefined
							)
						}
						placeholder="Optionnel…"
						className="w-full"
					/>
					{errors.prestationStartDate && (
						<p className="text-xs text-red-500">
							{errors.prestationStartDate.message}
						</p>
					)}
				</div>
			)}

			{/* Period */}
			<div className="space-y-1.5">
				<Label>Période *</Label>
				<DateRangeSelector
					from={watch("startDate") ? parseISO(watch("startDate")) : undefined}
					to={watch("endDate") ? parseISO(watch("endDate")) : undefined}
					onRangeChange={({ from, to }) => {
						setValue("startDate", from ? format(from, "yyyy-MM-dd") : "")
						setValue("endDate", to ? format(to, "yyyy-MM-dd") : "")
					}}
					fromPlaceholder="Début…"
					toPlaceholder="Fin…"
					className="w-full"
				/>
				{errors.startDate && <p className="text-xs text-red-500">{errors.startDate.message}</p>}
				{errors.endDate && <p className="text-xs text-red-500">{errors.endDate.message}</p>}
			</div>

			{/* Status */}
			<div className="space-y-1.5">
				<Label>Statut</Label>
				<Select
					value={watch("status")}
					onValueChange={(v) => setValue("status", v as "active" | "completed" | "cancelled")}
					items={[
						{ value: "active", label: "Actif" },
						{ value: "completed", label: "Terminé" },
						{ value: "cancelled", label: "Annulé" },
					]}
				>
					<SelectTrigger className="w-full">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="active" label="Actif">
							Actif
						</SelectItem>
						<SelectItem value="completed" label="Terminé">
							Terminé
						</SelectItem>
						<SelectItem value="cancelled" label="Annulé">
							Annulé
						</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{/* Notes */}
			<div className="space-y-1.5">
				<Label htmlFor="notes">Notes</Label>
				<Input id="notes" placeholder="Optionnel…" {...register("notes")} />
			</div>

			{/* Fichiers PDF */}
			<div className="space-y-1.5">
				<Label>Pièces jointes</Label>
				{pendingFiles.length > 0 && (
					<ul className="space-y-1">
						{pendingFiles.map((file, i) => (
							<li
								key={`${file.name}-${i}`}
								className="flex items-center gap-2 rounded-md border border-edge bg-surface px-2.5 py-1.5 text-sm"
							>
								<FileText className="size-4 shrink-0 text-fg-muted" />
								<span className="min-w-0 flex-1 truncate">{file.name}</span>
								<span className="shrink-0 text-xs text-fg-muted">
									{(file.size / 1024).toFixed(0)} Ko
								</span>
								<button
									type="button"
									onClick={() => removePendingFile(i)}
									className="shrink-0 rounded p-0.5 text-fg-muted hover:text-fg"
								>
									<X className="size-3.5" />
								</button>
							</li>
						))}
					</ul>
				)}
				<input
					ref={fileInputRef}
					type="file"
					accept=".pdf,application/pdf"
					multiple
					className="hidden"
					onChange={handleFileSelect}
				/>
				<Button
					type="button"
					variant="outline"
					size="sm"
					onClick={() => fileInputRef.current?.click()}
				>
					<Plus className="mr-1.5 size-3.5" />
					Ajouter un PDF
				</Button>
			</div>

			<DialogFooter>
				{onCancel && (
					<Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
						Annuler
					</Button>
				)}
				<Button type="submit" disabled={isSubmitting}>
					{defaultValues?.id ? "Mettre à jour" : "Créer le contrat"}
				</Button>
			</DialogFooter>
		</form>
	)
}
