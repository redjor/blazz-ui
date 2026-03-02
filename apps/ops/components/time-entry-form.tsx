"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { toast } from "sonner"
import { Button } from "@blazz/ui/components/ui/button"
import { Input } from "@blazz/ui/components/ui/input"
import { Label } from "@blazz/ui/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@blazz/ui/components/ui/select"
import { format } from "date-fns"

const schema = z.object({
  projectId: z.string().min(1, "Projet requis"),
  date: z.string().min(1, "Date requise"),
  hours: z.coerce.number().min(0.25, "Minimum 15min").max(24),
  description: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

interface Props {
  onSuccess?: () => void
}

export function TimeEntryForm({ onSuccess }: Props) {
  const activeProjects = useQuery(api.projects.listActive)
  const create = useMutation(api.timeEntries.create)

  const { register, handleSubmit, setValue, watch, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      date: format(new Date(), "yyyy-MM-dd"),
      hours: 1,
    },
  })

  const onSubmit = async (values: FormValues) => {
    const project = activeProjects?.find((p) => p._id === values.projectId)
    if (!project) return toast.error("Projet introuvable")

    const hourlyRate = project.tjm / project.hoursPerDay

    try {
      await create({
        projectId: values.projectId as Id<"projects">,
        date: values.date,
        minutes: Math.round(values.hours * 60),
        hourlyRate,
        description: values.description,
        billable: true,
      })
      toast.success("Entrée ajoutée")
      reset({ date: values.date, hours: 1, projectId: values.projectId })
      onSuccess?.()
    } catch {
      toast.error("Une erreur est survenue")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label>Projet *</Label>
        <Select value={watch("projectId")} onValueChange={(v) => setValue("projectId", v)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choisir un projet…" />
          </SelectTrigger>
          <SelectContent>
            {activeProjects?.map((p) => (
              <SelectItem key={p._id} value={p._id}>{p.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.projectId && <p className="text-xs text-red-500">{errors.projectId.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Date *</Label>
          <Input type="date" {...register("date")} />
        </div>
        <div className="space-y-1.5">
          <Label>Durée (heures) *</Label>
          <Input type="number" step="0.25" min="0.25" max="24" {...register("hours")} />
          {errors.hours && <p className="text-xs text-red-500">{errors.hours.message}</p>}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Description</Label>
        <Input placeholder="Ce qui a été fait…" {...register("description")} />
      </div>

      <Button type="submit" disabled={isSubmitting}>Ajouter</Button>
    </form>
  )
}
