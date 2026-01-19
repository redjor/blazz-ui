---
name: blazz-new-page
description: Créer une nouvelle page Next.js avec composants Blazz UI
user-invocable: true
agent: blazz-ui-assistant
---

# Blazz New Page Skill

Crée une nouvelle page Next.js dans le projet Blazz UI App en utilisant les composants et layouts appropriés.

## Ce que fait ce skill

1. Crée un fichier `page.tsx` dans `app/(frame)/[path]/`
2. Utilise `DashboardLayout` ou autre layout approprié
3. Ajoute le composant `Page` avec `PageHeader`
4. Inclut les composants UI pertinents selon le besoin
5. Met à jour `config/navigation.ts` si nécessaire

## Input Attendu

Le user doit spécifier:
- **Path de la page** (ex: `/analytics`, `/products/categories`)
- **Titre de la page**
- **Description** (optionnel)
- **Actions dans le header** (optionnel: boutons, filtres, etc.)
- **Contenu principal** (cards, tables, forms, etc.)
- **Ajouter à la navigation?** (oui/non)

## Étapes d'Exécution

### Étape 1: Analyser la Demande

Identifier:
- Le path exact de la page
- Le type de contenu (dashboard, liste, formulaire, détail, etc.)
- Les composants nécessaires
- Le layout approprié

### Étape 2: Créer le Fichier Page

```tsx
// app/(frame)/[path]/page.tsx
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Page, PageHeader } from '@/components/layout/page'
import { Button } from '@/components/ui/button'
// Autres imports selon besoin

export default function [Name]Page() {
  return (
    <DashboardLayout>
      <Page>
        <PageHeader
          title="[Title]"
          description="[Description]"
          actions={
            // Boutons d'actions si spécifiés
          }
        />

        {/* Contenu principal */}
      </Page>
    </DashboardLayout>
  )
}
```

### Étape 3: Ajouter le Contenu

Selon le type de page, ajouter:
- **Dashboard**: Cards avec métriques, graphiques, listes
- **Liste**: DataTable ou Cards avec items
- **Formulaire**: Form avec react-hook-form + Zod
- **Détail**: Cards avec informations détaillées

### Étape 4: Mettre à Jour Navigation (si demandé)

Éditer `config/navigation.ts`:

```tsx
export const sidebarConfig: SidebarConfig = {
  navigation: [
    {
      id: 'section-id',
      title: 'Section Title',
      items: [
        // Ajouter nouvelle entrée
        {
          id: 'page-id',
          title: 'Page Title',
          url: '/path',
          icon: IconName,
        },
      ],
    },
  ],
}
```

### Étape 5: Vérifier

- Le fichier compile sans erreurs TypeScript
- Tous les imports sont corrects (path aliases @/)
- Les composants utilisés existent
- Le styling est cohérent
- L'accessibilité est respectée

## Templates par Type

### Dashboard Page

```tsx
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Page, PageHeader } from '@/components/layout/page'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <Page>
        <PageHeader title="Dashboard" description="Vue d'ensemble" />

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Metric 1</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">1,234</p>
            </CardContent>
          </Card>
          {/* Plus de cards... */}
        </div>
      </Page>
    </DashboardLayout>
  )
}
```

### List Page

```tsx
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Page, PageHeader } from '@/components/layout/page'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function ListPage() {
  return (
    <DashboardLayout>
      <Page>
        <PageHeader
          title="Liste"
          description="Gérez vos items"
          actions={
            <Button>
              <Plus className="mr-2" />
              Nouveau
            </Button>
          }
        />

        {/* DataTable ou Grid de cards */}
      </Page>
    </DashboardLayout>
  )
}
```

### Form Page

```tsx
'use client'

import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Page, PageHeader } from '@/components/layout/page'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
// Import form components

export default function FormPage() {
  return (
    <DashboardLayout>
      <Page>
        <PageHeader title="Formulaire" description="Créer ou éditer" />

        <Card>
          <CardContent className="pt-6">
            {/* Form avec react-hook-form */}
          </CardContent>
        </Card>
      </Page>
    </DashboardLayout>
  )
}
```

### Detail Page

```tsx
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Page, PageHeader } from '@/components/layout/page'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Edit, Trash2 } from 'lucide-react'

export default function DetailPage() {
  return (
    <DashboardLayout>
      <Page>
        <PageHeader
          title="Détail Item"
          actions={
            <div className="flex gap-2">
              <Button variant="outline">
                <Edit className="mr-2" />
                Éditer
              </Button>
              <Button variant="destructive">
                <Trash2 className="mr-2" />
                Supprimer
              </Button>
            </div>
          }
        />

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Informations</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Détails */}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Statut</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Status badges, etc. */}
            </CardContent>
          </Card>
        </div>
      </Page>
    </DashboardLayout>
  )
}
```

## Exemple d'Utilisation

### User Input:

```
/blazz-new-page

Créer une page "/analytics" avec:
- Titre: "Tableaux de Bord"
- Description: "Analysez vos données"
- 3 cards de métriques: Revenus (€45,230, +12%), Utilisateurs (1,234, +5%), Commandes (856, -3%)
- Un graphique placeholder
- Une table des dernières transactions (5 lignes)
- Ajouter à la navigation dans section "Analytics & Reports"
```

### Output:

1. Créé: `app/(frame)/analytics/page.tsx`
2. Mis à jour: `config/navigation.ts`
3. Résultat: Page complète fonctionnelle avec tous les éléments

## Best Practices

1. **Toujours utiliser DashboardLayout** pour pages dans (frame)
2. **Composant Page obligatoire** avec PageHeader
3. **Path aliases** pour tous les imports (@/)
4. **'use client'** seulement si interactivité (hooks, events)
5. **TypeScript strict** - tout typer
6. **Accessibilité** - aria-label, roles, etc.
7. **Responsive** - utiliser grid et classes responsive
8. **Dark mode** - utiliser CSS variables

## Common Errors à Éviter

❌ **Erreur**: Imports relatifs
```tsx
import { Button } from '../../../components/ui/button'
```

✅ **Correct**: Path aliases
```tsx
import { Button } from '@/components/ui/button'
```

❌ **Erreur**: Couleurs hardcodées
```tsx
<div className="bg-white text-black">
```

✅ **Correct**: CSS variables
```tsx
<div className="bg-background text-foreground">
```

❌ **Erreur**: Pas de layout
```tsx
export default function Page() {
  return <div>Content</div>
}
```

✅ **Correct**: Avec layout
```tsx
export default function Page() {
  return (
    <DashboardLayout>
      <Page>Content</Page>
    </DashboardLayout>
  )
}
```

## Validation Checklist

Avant de considérer la page complète:

- [ ] Fichier créé dans bon dossier (`app/(frame)/[path]/page.tsx`)
- [ ] Layout utilisé (DashboardLayout ou autre)
- [ ] Composant Page avec PageHeader
- [ ] Tous imports avec path aliases (@/)
- [ ] TypeScript compile sans erreurs
- [ ] Composants utilisés existent dans le projet
- [ ] Styling cohérent (CSS variables)
- [ ] Responsive design
- [ ] Accessibilité (ARIA si nécessaire)
- [ ] Navigation mise à jour (si demandé)
- [ ] Code testé mentalement (pas d'erreurs évidentes)

---

**Agent**: blazz-ui-assistant
**Version**: 1.0
**Last Updated**: 2026-01-19
