# Client Logo Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Allow adding a logo to each client in Blazz Ops, uploaded from disk, stored in Convex File Storage, and displayed in the client list and detail page.

**Architecture:** Convex File Storage native flow — `generateUploadUrl` mutation → client `fetch POST` → save `storageId` on client record. Queries resolve `storageId` → `logoUrl` inline to avoid client-side round-trips.

**Tech Stack:** Convex (File Storage, mutations, queries), React 19, react-hook-form, @blazz/ui

---

### Task 1: Add logoStorageId to schema

**Files:**
- Modify: `apps/ops/convex/schema.ts`

**Step 1: Add the field**

In `apps/ops/convex/schema.ts`, add `logoStorageId: v.optional(v.id("_storage"))` to the `clients` table definition:

```ts
clients: defineTable({
  name: v.string(),
  email: v.optional(v.string()),
  phone: v.optional(v.string()),
  address: v.optional(v.string()),
  notes: v.optional(v.string()),
  logoStorageId: v.optional(v.id("_storage")),
  createdAt: v.number(),
}),
```

**Step 2: Verify type-check passes**

```bash
cd apps/ops && pnpm type-check
```

Expected: no errors (Convex regenerates types when `convex dev` is running)

**Step 3: Commit**

```bash
git add apps/ops/convex/schema.ts
git commit -m "feat(ops): add logoStorageId to clients schema"
```

---

### Task 2: Update Convex backend

**Files:**
- Modify: `apps/ops/convex/clients.ts`

**Step 1: Replace the full file with this updated version**

```ts
import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

export const list = query({
  args: {},
  handler: async (ctx) => {
    const clients = await ctx.db.query("clients").order("desc").collect()
    return Promise.all(
      clients.map(async (c) => ({
        ...c,
        logoUrl: c.logoStorageId ? await ctx.storage.getUrl(c.logoStorageId) : null,
      }))
    )
  },
})

export const get = query({
  args: { id: v.id("clients") },
  handler: async (ctx, { id }) => {
    const c = await ctx.db.get(id)
    if (!c) return null
    return {
      ...c,
      logoUrl: c.logoStorageId ? await ctx.storage.getUrl(c.logoStorageId) : null,
    }
  },
})

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => ctx.storage.generateUploadUrl(),
})

export const create = mutation({
  args: {
    name: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    notes: v.optional(v.string()),
    logoStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    return ctx.db.insert("clients", { ...args, createdAt: Date.now() })
  },
})

export const update = mutation({
  args: {
    id: v.id("clients"),
    name: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    notes: v.optional(v.string()),
    logoStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, { id, ...fields }) => {
    // If logo is being replaced, delete old file from storage
    const existing = await ctx.db.get(id)
    if (
      existing?.logoStorageId &&
      fields.logoStorageId !== undefined &&
      fields.logoStorageId !== existing.logoStorageId
    ) {
      await ctx.storage.delete(existing.logoStorageId)
    }
    return ctx.db.patch(id, fields)
  },
})

export const remove = mutation({
  args: { id: v.id("clients") },
  handler: async (ctx, { id }) => {
    const existing = await ctx.db.get(id)
    if (existing?.logoStorageId) {
      await ctx.storage.delete(existing.logoStorageId)
    }
    return ctx.db.delete(id)
  },
})
```

**Step 2: Verify type-check**

```bash
cd apps/ops && pnpm type-check
```

Expected: no errors

**Step 3: Commit**

```bash
git add apps/ops/convex/clients.ts
git commit -m "feat(ops): add generateUploadUrl, logoStorageId to clients mutations"
```

---

### Task 3: Add logo upload to ClientForm

**Files:**
- Modify: `apps/ops/components/client-form.tsx`

**Step 1: Replace the full file with this updated version**

```tsx
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
}

export function ClientForm({ defaultValues, onSuccess }: Props) {
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
      <Button type="submit" disabled={isSubmitting || uploading}>
        {defaultValues?.id ? "Mettre à jour" : "Créer le client"}
      </Button>
    </form>
  )
}
```

**Step 2: Verify type-check**

```bash
cd apps/ops && pnpm type-check
```

Expected: no errors

**Step 3: Commit**

```bash
git add apps/ops/components/client-form.tsx
git commit -m "feat(ops): add logo upload to ClientForm via Convex File Storage"
```

---

### Task 4: Display logo in client list

**Files:**
- Modify: `apps/ops/app/clients/page.tsx`

**Step 1: Add `ClientAvatar` inline component and use it in the list**

Replace the full file:

```tsx
"use client"

import { useState } from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { OpsFrame } from "@/components/ops-frame"
import { ClientForm } from "@/components/client-form"
import { Button } from "@blazz/ui/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@blazz/ui/components/ui/dialog"
import { Plus, ChevronRight } from "lucide-react"
import Link from "next/link"

function ClientAvatar({ name, logoUrl }: { name: string; logoUrl?: string | null }) {
  const initials = name.slice(0, 2).toUpperCase()
  return (
    <div className="size-9 rounded-md border border-edge bg-surface flex items-center justify-center overflow-hidden shrink-0">
      {logoUrl ? (
        <img src={logoUrl} alt={name} className="size-full object-contain" />
      ) : (
        <span className="text-xs font-semibold text-fg-muted">{initials}</span>
      )}
    </div>
  )
}

export default function ClientsPage() {
  const clients = useQuery(api.clients.list)
  const [open, setOpen] = useState(false)

  return (
    <OpsFrame>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-fg">Clients</h1>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button size="sm" />}>
              <Plus className="size-4 mr-1.5" />Nouveau client
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Nouveau client</DialogTitle></DialogHeader>
              <ClientForm onSuccess={() => setOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        {clients === undefined && <p className="text-fg-muted text-sm">Chargement…</p>}
        {clients?.length === 0 && <p className="text-fg-muted text-sm">Aucun client. Créez-en un !</p>}

        <div className="space-y-2">
          {clients?.map((client) => (
            <Link
              key={client._id}
              href={`/clients/${client._id}`}
              className="flex items-center justify-between p-4 rounded-lg border border-edge bg-raised hover:bg-panel transition-colors"
            >
              <div className="flex items-center gap-3">
                <ClientAvatar name={client.name} logoUrl={client.logoUrl} />
                <div>
                  <p className="font-medium text-fg">{client.name}</p>
                  {client.email && <p className="text-sm text-fg-muted">{client.email}</p>}
                </div>
              </div>
              <ChevronRight className="size-4 text-fg-muted" />
            </Link>
          ))}
        </div>
      </div>
    </OpsFrame>
  )
}
```

**Step 2: Verify type-check**

```bash
cd apps/ops && pnpm type-check
```

Expected: no errors

**Step 3: Commit**

```bash
git add apps/ops/app/clients/page.tsx
git commit -m "feat(ops): show logo avatar in client list"
```

---

### Task 5: Display logo in client detail page

**Files:**
- Modify: `apps/ops/app/clients/[id]/page.tsx`

**Step 1: Add the avatar in the header section**

The `client` object from the query now includes `logoUrl`. Update the header section to show a larger avatar (56px) alongside the name.

Replace the client header block (lines 50–69) with:

```tsx
{/* Client header */}
<div className="flex items-start justify-between">
  <div className="flex items-start gap-4">
    <div className="size-14 rounded-lg border border-edge bg-surface flex items-center justify-center overflow-hidden shrink-0 mt-0.5">
      {client.logoUrl ? (
        <img src={client.logoUrl} alt={client.name} className="size-full object-contain" />
      ) : (
        <span className="text-lg font-semibold text-fg-muted">
          {client.name.slice(0, 2).toUpperCase()}
        </span>
      )}
    </div>
    <div>
      <h1 className="text-xl font-semibold text-fg">{client.name}</h1>
      {client.email && <p className="text-sm text-fg-muted">{client.email}</p>}
      {client.phone && <p className="text-sm text-fg-muted">{client.phone}</p>}
      {client.address && <p className="text-sm text-fg-muted mt-1">{client.address}</p>}
    </div>
  </div>
  <Dialog open={editOpen} onOpenChange={setEditOpen}>
    <DialogTrigger render={<Button variant="outline" size="sm" />}>
      Modifier
    </DialogTrigger>
    <DialogContent>
      <DialogHeader><DialogTitle>Modifier le client</DialogTitle></DialogHeader>
      <ClientForm
        defaultValues={{ ...client, id: client._id }}
        onSuccess={() => setEditOpen(false)}
      />
    </DialogContent>
  </Dialog>
</div>
```

Note: `defaultValues` passed to `ClientForm` now automatically includes `logoUrl` and `logoStorageId` from the client object — no additional changes needed.

**Step 2: Verify type-check**

```bash
cd apps/ops && pnpm type-check
```

Expected: no errors

**Step 3: Commit**

```bash
git add apps/ops/app/clients/[id]/page.tsx
git commit -m "feat(ops): show logo avatar in client detail header"
```

---

## Manual verification

After all tasks, start the dev server and verify:

```bash
pnpm dev:ops
```

1. Go to `/clients` → create a new client with a logo → logo appears in the list
2. Click the client → logo appears in the detail header (larger)
3. Edit the client → replace the logo → old logo is gone, new one appears
4. Create a client without a logo → initials shown as fallback in both views
