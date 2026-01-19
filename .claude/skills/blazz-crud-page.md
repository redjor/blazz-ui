---
name: blazz-crud-page
description: Générer une page CRUD complète avec DataTable, formulaires et actions
user-invocable: true
agent: blazz-ui-assistant
---

# Blazz CRUD Page Skill

Génère une page CRUD (Create, Read, Update, Delete) complète avec DataTable enterprise-grade, formulaires de création/édition, et toutes les actions nécessaires.

## Ce que fait ce skill

1. Crée page avec **DataTable** configuré
2. Définit **colonnes** avec types TypeScript
3. Ajoute **Dialog Create/Edit** avec formulaire
4. Implémente **Delete confirmation**
5. Génère **formulaire** react-hook-form + Zod validation
6. Configure **filtres** (search, selects, date ranges)
7. Ajoute **bulk actions** (activer, désactiver, supprimer multiple)
8. Crée **types TypeScript** pour l'entité
9. Configure **row actions** (edit, duplicate, delete)

## Input Attendu

Le user doit spécifier:

### Entité
- **Nom de l'entité** (ex: "Product", "User", "Order")
- **Path** (ex: "/products", "/users")

### Champs
Pour chaque champ:
- Nom
- Type (string, number, boolean, Date, enum)
- Validation (required, min, max, email, etc.)
- Display dans table (oui/non)

### Filtres
- Champs filtrables
- Type de filtre (text search, select, boolean, date range, number range)

### Actions
- Row actions (edit, duplicate, delete, custom)
- Bulk actions (delete multiple, change status, export, custom)

## Étapes d'Exécution

### Étape 1: Définir Types TypeScript

```tsx
// types/[entity].ts
export interface [Entity] {
  id: string
  // Champs selon spécification
  createdAt: Date
  updatedAt?: Date
}

export type Create[Entity]Input = Omit<[Entity], 'id' | 'createdAt' | 'updatedAt'>
export type Update[Entity]Input = Partial<Create[Entity]Input>
```

### Étape 2: Créer Schéma Zod

```tsx
import * as z from 'zod'

export const [entity]Schema = z.object({
  // Champs avec validation
  name: z.string().min(3, 'Minimum 3 caractères').max(100),
  email: z.string().email('Email invalide'),
  age: z.number().min(18, 'Minimum 18 ans').max(120),
  status: z.enum(['active', 'inactive']),
  // etc.
})

export type [Entity]FormValues = z.infer<typeof [entity]Schema>
```

### Étape 3: Créer Page avec DataTable

```tsx
// app/(frame)/[path]/page.tsx
'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Page, PageHeader } from '@/components/layout/page'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/features/data-table'
import { Plus } from 'lucide-react'
import { columns } from './columns'
import { [Entity]Dialog } from './[entity]-dialog'
import type { [Entity] } from '@/types/[entity]'

// Mock data (remplacer par API call)
const mockData: [Entity][] = []

export default function [Entity]Page() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<[Entity] | null>(null)

  const handleCreate = () => {
    setSelectedItem(null)
    setDialogOpen(true)
  }

  const handleEdit = (item: [Entity]) => {
    setSelectedItem(item)
    setDialogOpen(true)
  }

  const handleDelete = (item: [Entity]) => {
    // Implement delete logic
    console.log('Delete', item)
  }

  return (
    <DashboardLayout>
      <Page>
        <PageHeader
          title="[Entities]"
          description="Gérez vos [entities]"
          actions={
            <Button onClick={handleCreate}>
              <Plus className="mr-2" />
              Nouveau [entity]
            </Button>
          }
        />

        <DataTable
          data={mockData}
          columns={columns({ onEdit: handleEdit, onDelete: handleDelete })}
          searchPlaceholder="Rechercher..."
          // Filtres selon spécification
        />

        <[Entity]Dialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          item={selectedItem}
        />
      </Page>
    </DashboardLayout>
  )
}
```

### Étape 4: Définir Colonnes DataTable

```tsx
// app/(frame)/[path]/columns.tsx
'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Edit, Trash2, Copy } from 'lucide-react'
import type { [Entity] } from '@/types/[entity]'

interface ColumnActions {
  onEdit: (item: [Entity]) => void
  onDelete: (item: [Entity]) => void
}

export const columns = ({ onEdit, onDelete }: ColumnActions): ColumnDef<[Entity]>[] => [
  {
    accessorKey: 'name',
    header: 'Nom',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'status',
    header: 'Statut',
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      return (
        <Badge variant={status === 'active' ? 'default' : 'secondary'}>
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Date création',
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt'))
      return date.toLocaleDateString('fr-FR')
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const item = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(item)}>
              <Edit className="mr-2" />
              Éditer
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => {/* duplicate */}}>
              <Copy className="mr-2" />
              Dupliquer
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(item)}
              className="text-destructive"
            >
              <Trash2 className="mr-2" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
```

### Étape 5: Créer Dialog avec Formulaire

```tsx
// app/(frame)/[path]/[entity]-dialog.tsx
'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { [entity]Schema, type [Entity]FormValues } from './schema'
import type { [Entity] } from '@/types/[entity]'

interface [Entity]DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: [Entity] | null
}

export function [Entity]Dialog({ open, onOpenChange, item }: [Entity]DialogProps) {
  const isEditing = !!item

  const form = useForm<[Entity]FormValues>({
    resolver: zodResolver([entity]Schema),
    defaultValues: {
      // Default values selon schéma
    },
  })

  // Reset form quand dialog ouvre/ferme ou item change
  useEffect(() => {
    if (item) {
      form.reset({
        // Populate avec values de item
      })
    } else {
      form.reset({
        // Reset to default values
      })
    }
  }, [item, form])

  function onSubmit(values: [Entity]FormValues) {
    console.log(isEditing ? 'Update' : 'Create', values)
    // Implement API call
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Éditer [entity]' : 'Nouveau [entity]'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Form fields selon schéma */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Plus de fields... */}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Annuler
              </Button>
              <Button type="submit">
                {isEditing ? 'Sauvegarder' : 'Créer'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
```

### Étape 6: Ajouter Bulk Actions

Dans la page, ajouter configuration des bulk actions:

```tsx
const bulkActions = [
  {
    label: 'Activer',
    onClick: (selectedRows: [Entity][]) => {
      console.log('Activate', selectedRows)
    },
  },
  {
    label: 'Désactiver',
    onClick: (selectedRows: [Entity][]) => {
      console.log('Deactivate', selectedRows)
    },
  },
  {
    label: 'Supprimer',
    variant: 'destructive' as const,
    onClick: (selectedRows: [Entity][]) => {
      console.log('Delete', selectedRows)
    },
  },
]

<DataTable
  // ...
  bulkActions={bulkActions}
/>
```

### Étape 7: Configurer Filtres

```tsx
const filters = [
  {
    column: 'status',
    title: 'Statut',
    options: [
      { label: 'Actif', value: 'active' },
      { label: 'Inactif', value: 'inactive' },
    ],
  },
  // Plus de filtres...
]

<DataTable
  // ...
  filters={filters}
/>
```

## Structure Fichiers Générée

```
app/(frame)/[path]/
  page.tsx                  # Page principale
  columns.tsx               # Définition colonnes DataTable
  [entity]-dialog.tsx       # Dialog Create/Edit
  schema.ts                 # Zod validation schema
types/
  [entity].ts              # Types TypeScript
```

## Exemple Complet: Products CRUD

### User Input:
```
/blazz-crud-page

Entité: Product

Champs:
- name: string (required, min 3, max 100)
- description: string (optional, max 500)
- price: number (required, positive, min 0.01)
- category: enum (electronics, clothing, food, other)
- stock: number (required, integer, min 0)
- active: boolean (default true)

Filtres:
- category (select multi)
- active (boolean)
- price (range slider)
- stock (boolean: in stock / out of stock)

Bulk Actions:
- Activer
- Désactiver
- Supprimer

Row Actions:
- Éditer
- Dupliquer
- Supprimer
```

### Types Générés:

```tsx
// types/product.ts
export interface Product {
  id: string
  name: string
  description?: string
  price: number
  category: 'electronics' | 'clothing' | 'food' | 'other'
  stock: number
  active: boolean
  createdAt: Date
  updatedAt?: Date
}
```

### Schéma Zod:

```tsx
// app/(frame)/products/schema.ts
import * as z from 'zod'

export const productSchema = z.object({
  name: z.string().min(3, 'Minimum 3 caractères').max(100, 'Maximum 100 caractères'),
  description: z.string().max(500, 'Maximum 500 caractères').optional(),
  price: z.number().positive('Prix doit être positif').min(0.01, 'Minimum 0.01'),
  category: z.enum(['electronics', 'clothing', 'food', 'other']),
  stock: z.number().int('Stock doit être un entier').min(0, 'Stock ne peut pas être négatif'),
  active: z.boolean().default(true),
})

export type ProductFormValues = z.infer<typeof productSchema>
```

## Checklist Complétude

Avant de considérer le CRUD terminé:

### Structure
- [ ] Page principale créée
- [ ] Types TypeScript définis
- [ ] Schéma Zod créé
- [ ] Colonnes DataTable configurées
- [ ] Dialog Create/Edit implémenté

### DataTable
- [ ] Colonnes affichent les bonnes données
- [ ] Tri fonctionne sur colonnes
- [ ] Recherche globale configurée
- [ ] Filtres configurés selon spec
- [ ] Pagination active

### Formulaire
- [ ] Tous les champs présents
- [ ] Validation Zod correcte
- [ ] Messages d'erreur en français
- [ ] Form se remplit en mode Edit
- [ ] Form se reset après submit

### Actions
- [ ] Row actions (Edit, Delete) fonctionnels
- [ ] Bulk actions configurés
- [ ] Delete confirmation (si demandé)
- [ ] Loading states (optionnel)

### Code Quality
- [ ] TypeScript strict (pas d'erreurs)
- [ ] Imports avec path aliases
- [ ] Components utilisent cn()
- [ ] CSS variables pour couleurs
- [ ] Accessibilité (ARIA labels)

### UX
- [ ] Feedback après actions (toast?)
- [ ] Loading states visibles
- [ ] Error handling
- [ ] Confirmation pour actions destructives

## Best Practices

1. **Types first** - Définir types avant le code
2. **Validation stricte** - Zod pour tout
3. **Error handling** - Messages clairs en français
4. **Feedback utilisateur** - Toasts, loading states
5. **Confirmation** - Toujours pour delete
6. **Optimistic updates** - UI réactive
7. **Pagination** - Pour grandes listes
8. **Search & Filters** - Toujours accessible

## Common Patterns

### Enum Display

```tsx
// Pour afficher enum de manière lisible
const categoryLabels = {
  electronics: 'Électronique',
  clothing: 'Vêtements',
  food: 'Alimentation',
  other: 'Autre',
}

<Badge>{categoryLabels[row.original.category]}</Badge>
```

### Currency Formatting

```tsx
cell: ({ row }) => {
  const price = row.getValue('price') as number
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(price)
}
```

### Date Formatting

```tsx
cell: ({ row }) => {
  const date = new Date(row.getValue('createdAt'))
  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}
```

### Boolean Display

```tsx
cell: ({ row }) => {
  const active = row.getValue('active') as boolean
  return (
    <Badge variant={active ? 'default' : 'secondary'}>
      {active ? 'Actif' : 'Inactif'}
    </Badge>
  )
}
```

---

**Agent**: blazz-ui-assistant
**Version**: 1.0
**Last Updated**: 2026-01-19
