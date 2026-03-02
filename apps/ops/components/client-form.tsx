"use client"

import { useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { toast } from "sonner"
import { Button } from "@blazz/ui/components/ui/button"
import { Input } from "@blazz/ui/components/ui/input"
import { Label } from "@blazz/ui/components/ui/label"
import { Textarea } from "@blazz/ui/components/ui/textarea"
import { DialogFooter } from "@blazz/ui/components/ui/dialog"
import { Loader2, Upload } from "lucide-react"

const schema = z.object({
  name: z.string().min(1, "Nom requis"),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

interface Props {
  defaultValues?: Partial<FormValues> & { id?: Id<"clients">; logoUrl?: string | null; logoStorageId?: Id<"_storage"> }
  onSuccess?: () => void
  onCancel?: () => void
}

export function ClientForm({ defaultValues, onSuccess, onCancel }: Props) {
  const create = useMutation(api.clients.create)
  const update = useMutation(api.clients.update)
  const generateUploadUrl = useMutation(api.clients.generateUploadUrl)

  const [logoStorageId, setLogoStorageId] = useState<Id<"_storage"> | undefined>(
    defaultValues?.logoStorageId
  )
  const [logoPreview, setLogoPreview] = useState<string | null>(defaultValues?.logoUrl ?? null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const uploadUrl = await generateUploadUrl()
      const res = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      })
      if (!res.ok) throw new Error("Upload failed")
      const { storageId } = await res.json() as { storageId: Id<"_storage"> }
      setLogoStorageId(storageId)
      setLogoPreview(URL.createObjectURL(file))
    } catch {
      toast.error("Erreur lors de l'upload du logo")
    } finally {
      setUploading(false)
    }
  }

  const onSubmit = async (values: FormValues) => {
    try {
      if (defaultValues?.id) {
        await update({ id: defaultValues.id, ...values, logoStorageId })
        toast.success("Client mis à jour")
      } else {
        await create({ ...values, logoStorageId })
        toast.success("Client créé")
      }
      onSuccess?.()
    } catch {
      toast.error("Une erreur est survenue")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Logo upload */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="relative size-16 rounded-lg border-2 border-dashed border-edge bg-surface hover:bg-raised transition-colors flex items-center justify-center overflow-hidden shrink-0 cursor-pointer"
        >
          {uploading ? (
            <Loader2 className="size-5 text-fg-muted animate-spin" />
          ) : logoPreview ? (
            <img src={logoPreview} alt="Logo" className="size-full object-contain" />
          ) : (
            <Upload className="size-5 text-fg-muted" />
          )}
        </button>
        <div>
          <p className="text-sm font-medium text-fg">Logo</p>
          <p className="text-xs text-fg-muted">
            {logoPreview ? "Cliquer pour remplacer" : "Cliquer pour ajouter"}
          </p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="name">Nom *</Label>
        <Input id="name" {...register("name")} />
        {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...register("email")} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="phone">Téléphone</Label>
        <Input id="phone" {...register("phone")} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="address">Adresse</Label>
        <Textarea id="address" rows={2} {...register("address")} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" rows={3} {...register("notes")} />
      </div>
      <DialogFooter>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting || uploading}>
            Annuler
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting || uploading}>
          {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : defaultValues?.id ? "Mettre à jour" : "Créer le client"}
        </Button>
      </DialogFooter>
    </form>
  )
}
