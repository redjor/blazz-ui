"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { toast } from "sonner"
import { Button } from "@blazz/ui/components/ui/button"
import { DateRangeSelector } from "@blazz/ui/components/ui/date-selector"
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
import { format, parseISO } from "date-fns"

const schema = z
  .object({
    type: z.enum(["tma", "forfait"]),
    daysPerMonth: z.preprocess(
      (v) => (v === "" || v === undefined ? undefined : Number(v)),
      z.number().positive("Requis pour TMA").optional()
    ),
    carryOver: z.boolean(),
    startDate: z.string().min(1, "Date de début requise"),
    endDate: z.string().min(1, "Date de fin requise"),
    status: z.enum(["active", "completed", "cancelled"]),
    notes: z.string().optional(),
  })
  .refine(
    (d) => d.type !== "tma" || (d.daysPerMonth && d.daysPerMonth > 0),
    { message: "Jours/mois requis pour un contrat TMA", path: ["daysPerMonth"] }
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

  const onSubmit = async (values: FormValues) => {
    try {
      if (defaultValues?.id) {
        await update({
          id: defaultValues.id,
          endDate: values.endDate,
          notes: values.notes,
        })
        toast.success("Contrat mis à jour")
      } else {
        await create({ projectId, ...values })
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
          onValueChange={(v) => setValue("type", v as "tma" | "forfait")}
          items={[
            { value: "tma", label: "TMA (jours/mois)" },
            { value: "forfait", label: "Forfait" },
          ]}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tma" label="TMA (jours/mois)">TMA (jours/mois)</SelectItem>
            <SelectItem value="forfait" label="Forfait">Forfait</SelectItem>
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
        {errors.startDate && (
          <p className="text-xs text-red-500">{errors.startDate.message}</p>
        )}
      </div>

      {/* Status */}
      <div className="space-y-1.5">
        <Label>Statut</Label>
        <Select
          value={watch("status")}
          onValueChange={(v) =>
            setValue("status", v as "active" | "completed" | "cancelled")
          }
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
            <SelectItem value="active" label="Actif">Actif</SelectItem>
            <SelectItem value="completed" label="Terminé">Terminé</SelectItem>
            <SelectItem value="cancelled" label="Annulé">Annulé</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Notes */}
      <div className="space-y-1.5">
        <Label htmlFor="notes">Notes</Label>
        <Input id="notes" placeholder="Optionnel…" {...register("notes")} />
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
