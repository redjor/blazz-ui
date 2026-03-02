"use client"

import { useEffect } from "react"
import { useForm, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { toast } from "sonner"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Button } from "@blazz/ui/components/ui/button"
import { Input } from "@blazz/ui/components/ui/input"
import { Label } from "@blazz/ui/components/ui/label"
import { Checkbox } from "@blazz/ui/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@blazz/ui/components/ui/dialog"

const schema = z.object({
  hours: z.coerce.number().min(0.25, "Minimum 15min").max(24),
  description: z.string().optional(),
  billable: z.boolean(),
})

type FormValues = z.infer<typeof schema>

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId: Id<"projects"> | null
  projectName: string | null
  hourlyRate: number | null
  date: string | null
  onSuccess?: () => void
}

export function QuickTimeEntryModal({
  open,
  onOpenChange,
  projectId,
  projectName,
  hourlyRate,
  date,
  onSuccess,
}: Props) {
  const create = useMutation(api.timeEntries.create)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: { hours: 1, billable: true, description: "" },
  })

  useEffect(() => {
    if (open) reset({ hours: 1, billable: true, description: "" })
  }, [open, reset])

  const onSubmit = async (values: FormValues): Promise<void> => {
    if (!projectId || !date || !hourlyRate) {
      toast.error("Projet ou date manquant")
      return
    }
    try {
      await create({
        projectId,
        date,
        minutes: Math.round(values.hours * 60),
        hourlyRate,
        description: values.description || undefined,
        billable: values.billable,
      })
      toast.success("Entrée ajoutée")
      reset({ hours: 1, billable: true, description: "" })
      onSuccess?.()
      onOpenChange(false)
    } catch {
      toast.error("Une erreur est survenue")
    }
  }

  const dateLabel = date
    ? format(new Date(date + "T00:00:00"), "EEEE d MMMM", { locale: fr })
    : ""

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Saisie rapide</DialogTitle>
        </DialogHeader>

        <div className="rounded-lg bg-raised border border-edge px-4 py-3 space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-fg-muted">Projet</span>
            <span className="font-medium text-fg">{projectName ?? "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-fg-muted">Date</span>
            <span className="font-medium text-fg capitalize">{dateLabel}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="quick-hours">Durée (heures) *</Label>
            <Input
              id="quick-hours"
              type="number"
              step="0.25"
              min="0.25"
              max="24"
              autoFocus
              {...register("hours")}
            />
            {errors.hours && (
              <p className="text-xs text-red-500">{errors.hours.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="quick-description">Description</Label>
            <Input
              id="quick-description"
              placeholder="Ce qui a été fait…"
              {...register("description")}
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="quick-billable"
              checked={watch("billable")}
              onCheckedChange={(v) => setValue("billable", !!v)}
            />
            <Label htmlFor="quick-billable" className="font-normal cursor-pointer">
              Facturable
            </Label>
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset({ hours: 1, billable: true, description: "" })
                onOpenChange(false)
              }}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              Ajouter
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
