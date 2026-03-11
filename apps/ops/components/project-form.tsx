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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@blazz/ui/components/ui/select"
import { format, parseISO } from "date-fns"

const schema = z.object({
  name: z.string().min(1, "Nom requis"),
  description: z.string().optional(),
  tjm: z.coerce.number().min(1, "TJM requis"),
  hoursPerDay: z.coerce.number().min(1).max(24),
  budgetAmount: z.preprocess(
    (v) => (v === "" || v === undefined ? undefined : Number(v)),
    z.number().positive().optional()
  ),
  currency: z.string().min(1),
  status: z.enum(["active", "paused", "closed"]),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

interface Props {
  clientId: Id<"clients">
  defaultValues?: Partial<FormValues> & { id?: Id<"projects"> }
  onSuccess?: () => void
  onCancel?: () => void
}

export function ProjectForm({ clientId, defaultValues, onSuccess, onCancel }: Props) {
  const create = useMutation(api.projects.create)
  const update = useMutation(api.projects.update)

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      tjm: 600,
      hoursPerDay: 8,
      currency: "EUR",
      status: "active",
      ...defaultValues,
    },
  })

  const tjmValue = watch("tjm") ?? 0
  const budgetValue = watch("budgetAmount")

  const onSubmit = async (values: FormValues) => {
    try {
      if (defaultValues?.id) {
        await update({ id: defaultValues.id, ...values })
        toast.success("Projet mis à jour")
      } else {
        await create({ clientId, ...values })
        toast.success("Projet créé")
      }
      onSuccess?.()
    } catch {
      toast.error("Une erreur est survenue")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="proj-name">Nom *</Label>
        <Input id="proj-name" {...register("name")} />
        {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="tjm">TJM (€)</Label>
          <Input id="tjm" type="number" {...register("tjm")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="hoursPerDay">H/jour</Label>
          <Input id="hoursPerDay" type="number" {...register("hoursPerDay")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="currency">Devise</Label>
          <Input id="currency" {...register("currency")} />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="budgetAmount">Budget (€)</Label>
        <Input
          id="budgetAmount"
          type="number"
          placeholder="Ex: 15000"
          {...register("budgetAmount")}
        />
        {typeof budgetValue === "number" && budgetValue > 0 && tjmValue > 0 && (
          <p className="text-xs text-fg-muted">
            ≈ {Math.round((budgetValue / tjmValue) * 10) / 10} jours à {tjmValue}€/j
          </p>
        )}
      </div>
      <div className="space-y-1.5">
        <Label>Statut</Label>
        <Select
          value={watch("status")}
          onValueChange={(v) => setValue("status", v as "active" | "paused" | "closed")}
          items={[
            { value: "active", label: "Actif" },
            { value: "paused", label: "En pause" },
            { value: "closed", label: "Clôturé" },
          ]}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active" label="Actif">Actif</SelectItem>
            <SelectItem value="paused" label="En pause">En pause</SelectItem>
            <SelectItem value="closed" label="Clôturé">Clôturé</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label>Période</Label>
        <DateRangeSelector
          from={watch("startDate") ? parseISO(watch("startDate")!) : undefined}
          to={watch("endDate") ? parseISO(watch("endDate")!) : undefined}
          onRangeChange={({ from, to }) => {
            setValue("startDate", from ? format(from, "yyyy-MM-dd") : "")
            setValue("endDate", to ? format(to, "yyyy-MM-dd") : "")
          }}
          fromPlaceholder="Début…"
          toPlaceholder="Fin…"
          className="w-full"
        />
      </div>
      <DialogFooter>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Annuler
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {defaultValues?.id ? "Mettre à jour" : "Créer le projet"}
        </Button>
      </DialogFooter>
    </form>
  )
}
