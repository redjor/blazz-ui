# Pattern : Resource List

> Page de liste paginée avec filtres, tri, actions. C'est la page la plus fréquente dans une app pro.
> Exemples : liste de clients, d'interventions, de commandes, de dossiers.

## Structure

```
PageHeader           — titre, breadcrumbs, bouton "Nouveau"
FilterBar            — filtres combinés, searchbar, reset, vues sauvegardées
DataTable             — tableau paginé, triable, sélectionnable
  └─ BulkActionBar   — actions sur sélection (apparaît quand lignes sélectionnées)
```

## Fichiers à créer

```
app/(dashboard)/[resources]/
  page.tsx                    ← Server Component — la page elle-même
  _components/
    columns.tsx               ← Définition des colonnes du DataTable
    filters.tsx               ← Configuration des filtres
    row-actions.tsx            ← Actions par ligne (menu déroulant)
    bulk-actions.tsx           ← Actions sur sélection multiple
lib/actions/[resources].ts    ← Server actions (CRUD + fetch)
lib/schemas/[resource].ts     ← Schemas zod
```

## Code complet

### Schema (`lib/schemas/client.ts`)

```tsx
import { z } from "zod"

export const clientSchema = z.object({
  id: z.string().uuid(),
  firstName: z.string().min(1, "Prénom requis"),
  lastName: z.string().min(1, "Nom requis"),
  email: z.string().email("Email invalide"),
  company: z.string().optional(),
  status: z.enum(["active", "inactive", "prospect"]),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Client = z.infer<typeof clientSchema>

export const clientFilterSchema = z.object({
  search: z.string().optional(),
  status: z.enum(["active", "inactive", "prospect"]).optional(),
  page: z.coerce.number().default(1),
  pageSize: z.coerce.number().default(25),
  sortField: z.string().optional(),
  sortDirection: z.enum(["asc", "desc"]).optional(),
})
```

### Server Actions (`lib/actions/clients.ts`)

```tsx
"use server"

import { db } from "@/lib/db"
import { clientFilterSchema, type Client } from "@/lib/schemas/client"

export async function getClients(params: Record<string, string>) {
  const filters = clientFilterSchema.parse(params)
  
  const where = {
    ...(filters.search && {
      OR: [
        { firstName: { contains: filters.search, mode: "insensitive" } },
        { lastName: { contains: filters.search, mode: "insensitive" } },
        { email: { contains: filters.search, mode: "insensitive" } },
      ],
    }),
    ...(filters.status && { status: filters.status }),
  }

  const [data, totalCount] = await Promise.all([
    db.client.findMany({
      where,
      orderBy: filters.sortField
        ? { [filters.sortField]: filters.sortDirection ?? "asc" }
        : { createdAt: "desc" },
      skip: (filters.page - 1) * filters.pageSize,
      take: filters.pageSize,
    }),
    db.client.count({ where }),
  ])

  return { data, totalCount }
}

export async function deleteClients(ids: string[]) {
  // Vérifier permissions ici
  await db.client.deleteMany({ where: { id: { in: ids } } })
  revalidatePath("/clients")
}

export async function exportClients(params: Record<string, string>) {
  const filters = clientFilterSchema.parse(params)
  // Fetch ALL matching (sans pagination) pour export
  const data = await db.client.findMany({ where: buildWhere(filters) })
  return generateCSV(data)
}
```

### Colonnes (`_components/columns.tsx`)

```tsx
"use client"

import { type ColumnDef } from "@/components/blocks/data-table"
import { Badge } from "@/components/ui/badge"
import { type Client } from "@/lib/schemas/client"
import { formatDate } from "@/lib/utils"

const statusMap = {
  active: { label: "Actif", variant: "success" },
  inactive: { label: "Inactif", variant: "default" },
  prospect: { label: "Prospect", variant: "info" },
} as const

export const clientColumns: ColumnDef<Client>[] = [
  {
    id: "lastName",
    header: "Nom",
    sortable: true,
    cell: (row) => (
      <a href={`/clients/${row.id}`} className="font-medium hover:underline">
        {row.lastName} {row.firstName}
      </a>
    ),
  },
  {
    id: "email",
    header: "Email",
    sortable: true,
    cell: (row) => row.email,
  },
  {
    id: "company",
    header: "Entreprise",
    sortable: true,
    cell: (row) => row.company ?? "—",
  },
  {
    id: "status",
    header: "Statut",
    sortable: true,
    cell: (row) => {
      const s = statusMap[row.status]
      return <Badge variant={s.variant}>{s.label}</Badge>
    },
  },
  {
    id: "createdAt",
    header: "Créé le",
    sortable: true,
    cell: (row) => formatDate(row.createdAt),
  },
]
```

### Filtres (`_components/filters.tsx`)

```tsx
import { type FilterConfig } from "@/components/blocks/filter-bar"

export const clientFilters: FilterConfig[] = [
  {
    id: "search",
    type: "search",
    placeholder: "Rechercher par nom, email...",
  },
  {
    id: "status",
    type: "select",
    label: "Statut",
    options: [
      { value: "active", label: "Actif" },
      { value: "inactive", label: "Inactif" },
      { value: "prospect", label: "Prospect" },
    ],
  },
]
```

### Page (`app/(dashboard)/clients/page.tsx`)

```tsx
import { Plus, Download } from "lucide-react"
import { PageHeader } from "@/components/blocks/page-header"
import { FilterBar } from "@/components/blocks/filter-bar"
import { DataTable } from "@/components/blocks/data-table"
import { getClients, exportClients, deleteClients } from "@/lib/actions/clients"
import { clientColumns } from "./_components/columns"
import { clientFilters } from "./_components/filters"
import { EmptyState } from "@/components/ui/empty-state"

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>
}) {
  const params = await searchParams
  const { data, totalCount } = await getClients(params)

  return (
    <>
      <PageHeader
        title="Clients"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Clients" },
        ]}
        actions={[
          { label: "Exporter", onClick: () => exportClients(params), icon: Download, variant: "outline" },
          { label: "Nouveau client", href: "/clients/new", icon: Plus },
        ]}
      />

      <FilterBar
        filters={clientFilters}
        values={params}
      />

      <DataTable
        columns={clientColumns}
        data={data}
        totalCount={totalCount}
        currentPage={Number(params.page) || 1}
        pageSize={Number(params.pageSize) || 25}
        sortField={params.sortField}
        sortDirection={params.sortDirection as "asc" | "desc"}
        selectable
        bulkActions={[
          { label: "Supprimer", action: deleteClients, icon: "Trash", variant: "destructive", confirm: true },
        ]}
        emptyState={
          Object.keys(params).length > 0 ? (
            <EmptyState
              title="Aucun résultat"
              description="Essayez de modifier vos filtres"
              action={{ label: "Réinitialiser les filtres", href: "/clients" }}
            />
          ) : (
            <EmptyState
              title="Aucun client"
              description="Commencez par ajouter votre premier client"
              action={{ label: "Nouveau client", href: "/clients/new", icon: Plus }}
            />
          )
        }
      />
    </>
  )
}
```

## Checklist avant de livrer

- [ ] Pagination côté serveur ✓
- [ ] Tri côté serveur ✓
- [ ] Filtres dans l'URL ✓
- [ ] Empty state avec action ✓
- [ ] Empty state différent si filtres actifs vs liste vide ✓
- [ ] Export CSV ✓
- [ ] Actions batch avec confirmation ✓
- [ ] Lien vers la page détail sur le nom ✓
- [ ] Breadcrumbs ✓
- [ ] Bouton "Nouveau" en haut à droite ✓
