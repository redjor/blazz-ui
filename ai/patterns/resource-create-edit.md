# Pattern : Resource Create / Edit

> Formulaire de création ou d'édition d'une ressource.
> Même structure pour les deux, seul le mode change (création = vide, édition = prérempli).

## Structure

```
Page
  top                        — Breadcrumb (Dashboard > Clients > Nouveau)
  header                     — PageHeader (titre dynamique)
  children
    └─ PageWrapper size="md"
         FormSection "Info"       — Section collapsible avec FieldGrid
         FormSection "Contact"    — Section collapsible avec FieldGrid
         FormSection "Adresse"    — Section collapsible avec FieldGrid
         FormFooter               — Boutons Annuler / Enregistrer (sticky bottom)
```

Pour les ressources complexes (20+ champs) → utiliser `MultiStepForm` à la place.

## Fichiers

```
app/(dashboard)/[resources]/new/
  page.tsx                      ← Wrapper Server Component
  _components/
    client-form.tsx             ← Client Component avec le formulaire
lib/schemas/[resource].ts       ← Schema zod (partagé client/serveur)
lib/actions/[resources].ts      ← Server actions create/update
```

## Code complet

### Schema (`lib/schemas/client.ts`) — ajout du schema de mutation

```tsx
import { z } from "zod"

// Schema de lecture (existant)
export const clientSchema = z.object({ /* ... */ })

// Schema de création/édition — pas d'id, pas de timestamps
export const clientMutationSchema = z.object({
  firstName: z.string().min(1, "Prénom requis").max(100),
  lastName: z.string().min(1, "Nom requis").max(100),
  email: z.string().email("Email invalide"),
  phone: z.string().optional(),
  company: z.string().optional(),
  status: z.enum(["active", "inactive", "prospect"]).default("prospect"),
  address: z.string().optional(),
  zipCode: z.string().regex(/^\d{5}$/, "Code postal invalide").optional(),
  city: z.string().optional(),
  notes: z.string().max(2000).optional(),
})

export type ClientMutation = z.infer<typeof clientMutationSchema>
```

### Server Actions (`lib/actions/clients.ts`) — ajout create/update

```tsx
"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { clientMutationSchema } from "@/lib/schemas/client"

export async function createClient(data: unknown) {
  // Toujours revalider côté serveur même si le client a validé
  const parsed = clientMutationSchema.safeParse(data)
  
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  // Vérifier permissions
  // await requirePermission("clients.create")

  const client = await db.client.create({ data: parsed.data })

  revalidatePath("/clients")
  redirect(`/clients/${client.id}`)
}

export async function updateClient(id: string, data: unknown) {
  const parsed = clientMutationSchema.safeParse(data)
  
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  // await requirePermission("clients.edit")

  await db.client.update({ where: { id }, data: parsed.data })

  revalidatePath("/clients")
  revalidatePath(`/clients/${id}`)
  redirect(`/clients/${id}`)
}
```

### Formulaire (`_components/client-form.tsx`)

```tsx
"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FormField } from "@/components/ui/form-field"
import { FormSection } from "@/components/blocks/form-section"
import { FieldGrid } from "@/components/blocks/field-grid"
import { useToast } from "@/hooks/use-toast"
import { createClient, updateClient } from "@/lib/actions/clients"
import {
  clientMutationSchema,
  type ClientMutation,
} from "@/lib/schemas/client"

interface ClientFormProps {
  mode: "create" | "edit"
  defaultValues?: ClientMutation
  clientId?: string
}

export function ClientForm({ mode, defaultValues, clientId }: ClientFormProps) {
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<ClientMutation>({
    resolver: zodResolver(clientMutationSchema),
    defaultValues: defaultValues ?? {
      status: "prospect",
    },
  })

  const onSubmit = async (data: ClientMutation) => {
    try {
      const result =
        mode === "create"
          ? await createClient(data)
          : await updateClient(clientId!, data)

      // Si le serveur renvoie des erreurs de validation
      if (result?.error) {
        Object.entries(result.error).forEach(([field, messages]) => {
          form.setError(field as keyof ClientMutation, {
            message: (messages as string[])[0],
          })
        })
        return
      }

      toast({
        variant: "success",
        title: mode === "create" ? "Client créé" : "Client modifié",
      })
      // redirect happens in server action
    } catch {
      toast({
        variant: "error",
        title: "Une erreur est survenue",
        description: "Veuillez réessayer.",
      })
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <FormSection title="Informations générales" defaultOpen>
        <FieldGrid columns={2}>
          <FormField
            name="lastName"
            label="Nom"
            control={form.control}
            required
          />
          <FormField
            name="firstName"
            label="Prénom"
            control={form.control}
            required
          />
          <FormField
            name="email"
            label="Email"
            type="email"
            control={form.control}
            required
          />
          <FormField
            name="phone"
            label="Téléphone"
            type="tel"
            control={form.control}
          />
          <FormField
            name="company"
            label="Entreprise"
            control={form.control}
          />
          <FormField
            name="status"
            label="Statut"
            type="select"
            control={form.control}
            options={[
              { value: "prospect", label: "Prospect" },
              { value: "active", label: "Actif" },
              { value: "inactive", label: "Inactif" },
            ]}
          />
        </FieldGrid>
      </FormSection>

      <FormSection title="Adresse">
        <FieldGrid columns={2}>
          <FormField
            name="address"
            label="Adresse"
            control={form.control}
            span={2}
          />
          <FormField
            name="zipCode"
            label="Code postal"
            control={form.control}
          />
          <FormField
            name="city"
            label="Ville"
            control={form.control}
          />
        </FieldGrid>
      </FormSection>

      <FormSection title="Notes">
        <FormField
          name="notes"
          label="Notes"
          type="textarea"
          control={form.control}
          rows={4}
          description="Informations complémentaires (2000 caractères max)"
        />
      </FormSection>

      {/* Footer sticky en bas */}
      <div className="sticky bottom-0 flex items-center justify-end gap-3 border-t bg-background py-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          icon={X}
        >
          Annuler
        </Button>
        <Button
          type="submit"
          loading={form.formState.isSubmitting}
          icon={Save}
        >
          {form.formState.isSubmitting
            ? "Enregistrement..."
            : mode === "create"
              ? "Créer le client"
              : "Enregistrer"
          }
        </Button>
      </div>
    </form>
  )
}
```

### Page création (`app/(dashboard)/clients/new/page.tsx`)

```tsx
import { Page, PageWrapper } from "@blazz/pro/components/blocks/page"
import { PageHeader } from "@blazz/pro/components/blocks/page-header"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@blazz/ui/components/ui/breadcrumb"
import { ClientForm } from "./_components/client-form"

export default function NewClientPage() {
  return (
    <Page
      top={
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/clients">Clients</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Nouveau</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      }
      header={<PageHeader title="Nouveau client" />}
    >
      <PageWrapper size="md">
        <ClientForm mode="create" />
      </PageWrapper>
    </Page>
  )
}
```

### Page édition (`app/(dashboard)/clients/[id]/edit/page.tsx`)

```tsx
import { notFound } from "next/navigation"
import { Page, PageWrapper } from "@blazz/pro/components/blocks/page"
import { PageHeader } from "@blazz/pro/components/blocks/page-header"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@blazz/ui/components/ui/breadcrumb"
import { getClient } from "@/lib/actions/clients"
import { ClientForm } from "../../new/_components/client-form"

export default async function EditClientPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const client = await getClient(id)

  if (!client) notFound()

  return (
    <Page
      top={
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/clients">Clients</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/clients/${id}`}>
                {client.firstName} {client.lastName}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Modifier</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      }
      header={
        <PageHeader title={`Modifier ${client.firstName} ${client.lastName}`} />
      }
    >
      <PageWrapper size="md">
        <ClientForm
          mode="edit"
          clientId={id}
          defaultValues={{
            firstName: client.firstName,
            lastName: client.lastName,
            email: client.email,
            phone: client.phone,
            company: client.company,
            status: client.status,
            address: client.address,
            zipCode: client.zipCode,
            city: client.city,
            notes: client.notes,
          }}
        />
      </PageWrapper>
    </Page>
  )
}
```

## Checklist avant de livrer

- [ ] Schema zod partagé client/serveur ✓
- [ ] Validation serveur même si le client a validé ✓
- [ ] `setError` pour les erreurs serveur dans le formulaire ✓
- [ ] Bouton submit disabled + loading pendant la soumission ✓
- [ ] Toast de confirmation succès/erreur ✓
- [ ] Redirect après succès ✓
- [ ] `revalidatePath` sur la liste ET le détail ✓
- [ ] FormSections collapsibles pour les longs formulaires ✓
- [ ] Footer sticky avec Annuler / Enregistrer ✓
- [ ] Page.top avec Breadcrumb primitives ✓
- [ ] PageHeader titre dynamique (create vs edit) ✓
- [ ] PageWrapper size="md" pour centrer le formulaire ✓
- [ ] Même composant formulaire pour create et edit ✓
