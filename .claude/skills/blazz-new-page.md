---
name: blazz-new-page
description: Créer une nouvelle page avec composants Blazz UI (Turborepo monorepo — apps/docs ou apps/examples)
user-invocable: true
---

# Blazz New Page Skill

## Ce que fait ce skill

1. Explore l'app cible pour comprendre sa structure réelle avant de générer quoi que ce soit
2. Crée un fichier de page dans le bon dossier selon l'app cible (apps/docs ou apps/examples)
3. Utilise le layout approprié découvert à l'étape d'exploration
4. Ajoute le contenu UI avec les composants Blazz UI et les design tokens oklch
5. Met à jour la navigation si demandé
6. Vérifie automatiquement la conformité aux conventions du projet

## Input Attendu

Le user doit spécifier:
- **App cible** (apps/docs ou apps/examples — demander si non précisé)
- **Path de la page** (ex: `/analytics`, `/products/categories`)
- **Titre de la page**
- **Description** (optionnel)
- **Actions dans le header** (optionnel: boutons, filtres, etc.)
- **Contenu principal** (cards, tables, forms, etc.)
- **Ajouter à la navigation?** (oui/non)

## Étapes d'Exécution

### Phase 0 — Explore (OBLIGATOIRE, bloquante)

Cette phase doit être complétée avant toute génération de code. Ne pas sauter cette étape.

1. **Lire `ai/rules.md`** — conventions du projet, règles de code, patterns à suivre

2. **Identifier l'app cible** — si le user n'a pas précisé, demander:
   - `apps/docs/` — app de documentation (TanStack Start / TanStack Router)
   - `apps/examples/` — app de démos CRM/StockBase/TalentFlow (Next.js)

3. **Explorer la structure de l'app cible** — lire le dossier de routes pour comprendre les conventions:
   - Pour apps/docs: `apps/docs/src/routes/`
   - Pour apps/examples: `apps/examples/app/`

4. **Trouver et lire une page existante similaire** dans l'app cible pour comprendre:
   - Le système de layout utilisé (layout parent, wrapper local, aucun wrapper ?)
   - Les imports réels qui fonctionnent dans cette app
   - La convention de nommage des fichiers (page.tsx, _layout.tsx, route.tsx, etc.)

5. **Lire `apps/docs/src/styles/globals.css`** — identifier les design tokens disponibles (bg-surface, text-fg, border-container, etc.)

6. **Lire les composants de layout réels de l'app cible** — ne jamais importer un chemin sans avoir vérifié son existence. Explorer par exemple:
   - `apps/examples/components/layout/` ou `apps/examples/components/`
   - `apps/docs/src/components/` pour les composants docs-spécifiques

### Phase 1 — Identifier le type de page

À partir de la demande du user, identifier:
- Le path exact de la page
- Le type de contenu (dashboard, liste, formulaire, détail)
- Les composants UI nécessaires (DataTable, Card, Form, etc.)
- Le layout approprié (découvert en Phase 0, pas supposé)

### Phase 2 — Créer le fichier

**IMPORTANT** : Avant d'écrire les imports, vérifier que les chemins existent réellement dans l'app cible (découvert en Phase 0). Ne jamais importer en aveugle.

```tsx
// IMPORTANT: Avant d'importer le layout, explorer l'app cible pour trouver
// le bon composant de layout. Le chemin varie selon l'app :
//
// Pour apps/examples/ : vérifier l'existence de quelque chose comme
//   import { DashboardLayout } from "@/components/layout/dashboard-layout"
//
// Pour apps/docs/ : le layout est souvent géré par le fichier de route parent
//   (_layout.tsx ou _docs.tsx) — dans ce cas pas de wrapper local nécessaire
//
// Toujours confirmer le bon chemin en lisant une page existante similaire.

// Primitives UI — imports depuis @blazz/ui
import { Button } from "@blazz/ui/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@blazz/ui/components/ui/card"
// Composants app-spécifiques — imports depuis @/ (chemin vérifié en Phase 0)
// import { ... } from "@/components/..."

export default function [Name]Page() {
  return (
    // Layout découvert en Phase 0
    <div className="flex flex-col gap-6 p-6">
      {/* Contenu principal */}
    </div>
  )
}
```

Convention selon l'app cible:
- **apps/examples/** (Next.js): fichier `page.tsx` dans `app/(groupe)/[path]/`
- **apps/docs/** (TanStack Router): fichier `route.tsx` ou `index.tsx` dans `src/routes/`

### Phase 3 — Ajouter le contenu

Selon le type de page, ajouter:
- **Dashboard**: Cards avec métriques, graphiques (Recharts), activité récente
- **Liste**: DataTable depuis `@blazz/ui/components/blocks/data-table` ou Cards avec items
- **Formulaire**: Form avec react-hook-form + Zod, toujours (`use client` justifié ici)
- **Détail**: Cards avec informations détaillées, badges de statut, actions

Toujours implémenter les 4 états si la page fetch des données:
- **Skeleton** (loading)
- **Empty** (pas de données)
- **Error** (erreur réseau/serveur)
- **Success** (données chargées)

### Phase 4 — Mettre à jour la navigation (si demandé)

Le fichier de navigation diffère selon l'app cible (découvert en Phase 0):
- **apps/docs/**: la config de navigation est dans `apps/docs/src/` — explorer pour trouver le bon fichier
- **apps/examples/**: la config peut être dans `apps/examples/config/` ou `apps/examples/lib/` — explorer avant d'éditer

Structure générale d'une entrée de navigation:

```tsx
{
  id: 'page-id',
  title: 'Page Title',
  url: '/path',
  icon: IconName,
}
```

### Phase finale — Auto-verify

Avant de reporter comme terminé, vérifier chaque point:

```
✅/❌ App cible identifiée (apps/docs ou apps/examples)
✅/❌ Layout exploré avant import (pas d'import aveugle d'un chemin inexistant)
✅/❌ Server Component par défaut ('use client' justifié si présent)
✅/❌ Imports depuis @blazz/ui/components/... pour les primitives UI
✅/❌ Imports locaux depuis @/ pour les composants app-spécifiques
✅/❌ Aucune couleur Tailwind hardcodée (bg-white, bg-blue-500...)
✅/❌ Design tokens oklch utilisés (bg-surface, text-fg, border-container...)
✅/❌ 4 états si fetch de données : Skeleton / Empty / Error / Success
```

## Templates par Type

Ces templates montrent la structure attendue. **Les imports de layout sont indicatifs** — toujours vérifier les chemins réels dans l'app cible avant de les utiliser (Phase 0).

### Dashboard Page

```tsx
// IMPORTANT: Avant d'importer le layout, explorer l'app cible (Phase 0) pour trouver
// le bon composant de layout. Exemple pour apps/examples/ :
// import { DashboardLayout } from "@/components/layout/dashboard-layout"
// Exemple pour apps/docs/ : le layout est souvent dans le fichier de route parent (_layout.tsx)
// → Remplacer MyLayout ci-dessous par le layout réel découvert.

import { Card, CardContent, CardHeader, CardTitle } from "@blazz/ui/components/ui/card"

export default function DashboardPage() {
  return (
    // Remplacer MyLayout par le layout réel découvert en Phase 0
    <MyLayout>
      <div className="flex flex-col gap-6 p-6">
        <div>
          <h1 className="text-2xl font-bold text-fg">Dashboard</h1>
          <p className="text-fg-muted">Vue d'ensemble</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-raised border-container">
            <CardHeader>
              <CardTitle className="text-fg">Metric 1</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-fg">1,234</p>
              <p className="text-sm text-fg-muted">+12% ce mois</p>
            </CardContent>
          </Card>
          {/* Plus de cards... */}
        </div>
      </div>
    </MyLayout>
  )
}
```

### List Page

```tsx
// IMPORTANT: Explorer l'app cible (Phase 0) pour trouver le bon layout.
// Remplacer <MyLayout> par le layout réel découvert.

import { Button } from "@blazz/ui/components/ui/button"
import { Plus } from "lucide-react"

export default function ListPage() {
  return (
    <MyLayout>
      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-fg">Liste</h1>
            <p className="text-fg-muted">Gérez vos items</p>
          </div>
          <Button variant="default">
            <Plus className="mr-2 h-4 w-4" />
            Nouveau
          </Button>
        </div>

        {/* DataTable depuis @blazz/ui/components/blocks/data-table ou Cards */}
      </div>
    </MyLayout>
  )
}
```

### Form Page

```tsx
'use client'
// 'use client' justifié : formulaire interactif avec react-hook-form

// IMPORTANT: Explorer l'app cible (Phase 0) pour trouver le bon layout.
// Remplacer <MyLayout> par le layout réel découvert.

import { Card, CardContent } from "@blazz/ui/components/ui/card"
import { Button } from "@blazz/ui/components/ui/button"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

const formSchema = z.object({
  // Définir le schema Zod
})

export default function FormPage() {
  const form = useForm({
    resolver: zodResolver(formSchema),
  })

  return (
    <MyLayout>
      <div className="flex flex-col gap-6 p-6">
        <div>
          <h1 className="text-2xl font-bold text-fg">Formulaire</h1>
          <p className="text-fg-muted">Créer ou éditer</p>
        </div>

        <Card className="bg-raised border-container">
          <CardContent className="pt-6">
            {/* Form avec react-hook-form */}
          </CardContent>
        </Card>
      </div>
    </MyLayout>
  )
}
```

### Detail Page

```tsx
// IMPORTANT: Explorer l'app cible (Phase 0) pour trouver le bon layout.
// Remplacer <MyLayout> par le layout réel découvert.

import { Button } from "@blazz/ui/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@blazz/ui/components/ui/card"
import { Badge } from "@blazz/ui/components/ui/badge"
import { Edit, Trash2 } from "lucide-react"

export default function DetailPage() {
  return (
    <MyLayout>
      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-fg">Détail Item</h1>
          <div className="flex gap-2">
            <Button variant="outline" className="border-container">
              <Edit className="mr-2 h-4 w-4" />
              Éditer
            </Button>
            <Button variant="destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="bg-raised border-container">
            <CardHeader>
              <CardTitle className="text-fg">Informations</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Détails */}
            </CardContent>
          </Card>

          <Card className="bg-raised border-container">
            <CardHeader>
              <CardTitle className="text-fg">Statut</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Status badges */}
              <Badge>Actif</Badge>
            </CardContent>
          </Card>
        </div>
      </div>
    </MyLayout>
  )
}
```

## Best Practices

1. **Explorer avant d'importer** — ne jamais supposer un chemin de layout, toujours vérifier qu'il existe dans l'app cible
2. **Monorepo awareness** — apps/docs (TanStack Router) et apps/examples (Next.js) ont des conventions différentes
3. **Primitives UI depuis @blazz/ui** — `@blazz/ui/components/ui/button`, `@blazz/ui/components/blocks/data-table`, etc.
4. **Composants app-spécifiques depuis @/** — layout wrappers, composants locaux
5. **Server Components par défaut** — `'use client'` seulement si hooks React ou event handlers
6. **Formulaires = react-hook-form + Zod** — toujours, sans exception
7. **Design tokens oklch** — utiliser `bg-surface`, `bg-raised`, `text-fg`, `text-fg-muted`, `border-container`, `bg-brand`
8. **Jamais de couleurs hardcodées** — pas de `bg-white`, `text-black`, `bg-blue-500`
9. **TypeScript strict** — tout typer explicitement
10. **Responsive** — utiliser grid et classes responsive Tailwind
11. **Accessibilité** — aria-label, roles, navigation au clavier

## Common Errors à Éviter

❌ **Erreur**: Importer un chemin de layout sans vérifier son existence
```tsx
import { DashboardLayout } from '@/components/layout/dashboard-layout'
// Ce chemin peut ne pas exister dans l'app cible !
```

✅ **Correct**: Explorer l'app cible en Phase 0, lire une page existante, puis importer le chemin confirmé
```tsx
// Exemple après avoir lu apps/examples/app/(crm)/contacts/page.tsx
// et confirmé que ce chemin existe :
import { AppLayout } from '@/components/layout/app-layout'
```

---

❌ **Erreur**: Imports relatifs
```tsx
import { Button } from '../../../components/ui/button'
```

✅ **Correct**: Path aliases et imports @blazz/ui
```tsx
import { Button } from '@blazz/ui/components/ui/button'
```

---

❌ **Erreur**: Couleurs hardcodées
```tsx
<div className="bg-white text-black border border-gray-200">
```

✅ **Correct**: Design tokens oklch
```tsx
<div className="bg-surface text-fg border border-container">
```

---

❌ **Erreur**: `'use client'` sans justification
```tsx
'use client'
export default function StaticPage() {
  return <div>Contenu statique</div>
}
```

✅ **Correct**: Server Component par défaut
```tsx
// Pas de 'use client' — Server Component par défaut
export default function StaticPage() {
  return <div className="text-fg">Contenu statique</div>
}
```

## Validation Checklist

Avant de considérer la page complète:

- [ ] App cible identifiée (apps/docs ou apps/examples)
- [ ] `ai/rules.md` lu en Phase 0
- [ ] Page existante similaire lue pour comprendre les conventions réelles
- [ ] Layout exploré et chemin vérifié avant import (pas d'import aveugle)
- [ ] Fichier créé dans le bon dossier selon l'app cible
- [ ] Tous les imports de primitives UI depuis `@blazz/ui/components/...`
- [ ] Tous les imports app-spécifiques avec path alias `@/`
- [ ] TypeScript compile sans erreurs
- [ ] Design tokens oklch utilisés (bg-surface, text-fg, etc.) — aucune couleur hardcodée
- [ ] `'use client'` seulement si justifié (hooks, event handlers)
- [ ] 4 états implémentés si fetch de données (Skeleton, Empty, Error, Success)
- [ ] Responsive design
- [ ] Accessibilité (ARIA si nécessaire)
- [ ] Navigation mise à jour (si demandé) dans le bon fichier config de l'app cible

---

**Version**: 2.0
**Last Updated**: 2026-02-28
