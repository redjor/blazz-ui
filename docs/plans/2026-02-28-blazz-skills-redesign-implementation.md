# Blazz Skills Redesign — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Mettre à jour les skills de génération de composants/pages pour qu'ils lisent le codebase réel avant de générer, et créer un nouveau skill `/blazz-audit` pour évaluer la conformité du code généré.

**Architecture:** Approche A — enrichissement ciblé des skills existants + création d'un skill d'audit indépendant. Chaque skill est un fichier Markdown dans `.claude/skills/`. Les skills sont des instructions pour Claude, pas du code exécutable.

**Tech Stack:** Markdown (skill files), Claude Code skills system, Base UI (`@base-ui/react`), CVA, Tailwind v4, design tokens oklch

---

## Contexte critique avant de commencer

Les vrais patterns du kit (extraits des sources) :

**Composant simple** → `React.ComponentProps<"div">`, pas `forwardRef` :
```tsx
function Card({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card" className={cn("bg-surface ...", className)} {...props} />
}
```

**Composant interactif** → Base UI primitive :
```tsx
import { Button as ButtonPrimitive } from "@base-ui/react/button"
function Button({ className, variant, size, ...props }: ButtonPrimitive.Props & VariantProps<...>) {
  return <ButtonPrimitive data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />
}
```

**Composant avec render prop** → `useRender` + `mergeProps` :
```tsx
import { useRender } from "@base-ui/react/use-render"
import { mergeProps } from "@base-ui/react/merge-props"
function Badge({ render, ...props }: useRender.ComponentProps<"span"> & VariantProps<...>) {
  return useRender({ defaultTagName: "span", props: mergeProps({ className: cn(...) }, props), render, state: { slot: "badge" } })
}
```

**Design tokens à utiliser** (jamais de couleurs Tailwind hardcodées) :
- `bg-surface`, `bg-raised`, `bg-panel`, `bg-brand`, `bg-brand-hover`
- `text-fg`, `text-fg-muted`, `text-brand-fg`
- `border-container`, `border-separator`
- `bg-positive`, `bg-negative`, `bg-caution`, `bg-inform`

---

## Task 1 : Mettre à jour `blazz-new-component.md`

**Files:**
- Modify: `.claude/skills/blazz-new-component.md`

### Step 1 : Lire le fichier existant entièrement

```bash
cat .claude/skills/blazz-new-component.md
```

### Step 2 : Réécrire la section "Étapes d'Exécution"

Remplacer le contenu existant par le nouveau qui commence par **Phase 0 — Explore**.

La nouvelle section "Étapes d'Exécution" doit être :

```markdown
## Étapes d'Exécution

### Phase 0 — Explore (OBLIGATOIRE avant toute génération)

**Cette phase est bloquante.** Le skill doit lire ces fichiers avant d'écrire une seule ligne de code :

1. Lire `ai/rules.md` pour charger toutes les conventions obligatoires.

2. Identifier le composant existant le plus similaire dans `packages/ui/src/components/ui/`
   (ex: si on crée un Badge-like → lire `badge.tsx`, si Button-like → lire `button.tsx`,
   si conteneur → lire `card.tsx`). Lire ce fichier pour extraire :
   - Le pattern utilisé (`React.ComponentProps` / Base UI primitive / `useRender`)
   - Les imports exacts
   - La structure CVA si applicable
   - Les design tokens utilisés

3. Lire `apps/docs/src/styles/globals.css` pour voir tous les tokens oklch disponibles.

Si un fichier de référence est introuvable, signaler et demander confirmation avant de continuer.

### Phase 1 — Analyser le besoin

À partir de ce que l'utilisateur a fourni, déterminer :
- Composant simple (conteneur, texte) → pattern `React.ComponentProps<"div">`
- Composant interactif (bouton, input) → Base UI primitive
- Composant avec customisation avancée du rendu → `useRender` + `mergeProps`
- CVA nécessaire seulement si 2+ variants visuellement distincts

### Phase 2 — Choisir la structure

**Option A** : Composant simple (1 fichier)
```
packages/ui/src/components/ui/[name].tsx
```

**Option B** : Composant composable (dossier)
```
packages/ui/src/components/ui/[name]/
  [name].tsx
```

### Phase 3 — Implémenter

**Pattern A — Composant simple (pas d'interactivité, pas de variants) :**
```tsx
import type * as React from "react"
import { cn } from "../../lib/utils"

function ComponentName({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="component-name"
      className={cn("bg-surface text-fg", className)}
      {...props}
    />
  )
}

export { ComponentName }
```

**Pattern B — Composant avec variants (CVA) :**
```tsx
import type * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const componentVariants = cva(
  "inline-flex items-center transition-colors",
  {
    variants: {
      variant: {
        default: "bg-brand text-brand-fg",
        secondary: "bg-raised text-fg",
      },
      size: {
        sm: "h-7 px-2.5 text-xs",
        default: "h-8 px-3 text-sm",
        lg: "h-9 px-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface ComponentNameProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof componentVariants> {}

function ComponentName({ className, variant, size, ...props }: ComponentNameProps) {
  return (
    <div
      data-slot="component-name"
      className={cn(componentVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { ComponentName, componentVariants }
```

**Pattern C — Composant interactif (Base UI) :**
```tsx
import { SomePrimitive } from "@base-ui/react/some-primitive"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const componentVariants = cva([...], { variants: {...} })

function ComponentName({
  className,
  variant,
  size,
  ...props
}: SomePrimitive.Props & VariantProps<typeof componentVariants>) {
  return (
    <SomePrimitive
      data-slot="component-name"
      className={cn(componentVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { ComponentName }
```

**Pattern D — Composant avec render prop (useRender) :**
```tsx
import { useRender } from "@base-ui/react/use-render"
import { mergeProps } from "@base-ui/react/merge-props"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const componentVariants = cva([...], { variants: {...} })

interface ComponentNameProps
  extends useRender.ComponentProps<"span">,
    VariantProps<typeof componentVariants> {}

function ComponentName({ className, variant, render, ...props }: ComponentNameProps) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps(
      { className: cn(componentVariants({ variant, className })) },
      props
    ),
    render,
    state: { slot: "component-name", variant },
  })
}

export { ComponentName }
```

### Phase 4 — Exporter

Ajouter l'export dans `packages/ui/src/index.ts` :
```tsx
export { ComponentName } from "./components/ui/component-name"
```

### Phase 5 — Auto-verify

Après génération, afficher cette checklist dans le chat :

```
### Auto-verify
✅/❌ React.ComponentProps<"..."> ou Base UI primitive utilisé (pas forwardRef)
✅/❌ useRender si render prop nécessaire
✅/❌ Aucune couleur Tailwind hardcodée (bg-blue-500, text-white seul...)
✅/❌ Design tokens utilisés (bg-surface, text-fg, border-container...)
✅/❌ data-slot présent
✅/❌ TypeScript strict (pas de any)
✅/❌ Export ajouté dans packages/ui/src/index.ts
```
```

### Step 3 : Remplacer la section "Checklist Qualité"

Remplacer par :

```markdown
## Checklist Qualité

### Code
- [ ] Pattern correct (ComponentProps / Base UI / useRender) selon type de composant
- [ ] Pas de forwardRef (obsolète dans ce kit)
- [ ] CVA utilisé uniquement si 2+ variants visuels
- [ ] data-slot présent
- [ ] TypeScript strict (pas de `any`)

### Design
- [ ] Design tokens utilisés (bg-surface, text-fg, etc.)
- [ ] Aucune couleur Tailwind hardcodée
- [ ] Dark mode automatique via tokens

### Export
- [ ] Export ajouté dans packages/ui/src/index.ts
```

### Step 4 : Supprimer les sections périmées

Supprimer :
- La section "### Étape 4: Créer Storybook Story" (pas de Storybook dans le monorepo actuel)
- La section "### Étape 5: Créer Documentation" README.md (optionnel, non obligatoire)
- La section "Common Errors" avec l'exemple `forwardRef` (patterns incorrects)
- Le template CVA avec `bg-primary text-primary-foreground` (tokens shadcn obsolètes)

### Step 5 : Mettre à jour le frontmatter

```yaml
---
name: blazz-new-component
description: Générer un nouveau composant UI suivant les conventions Blazz UI (patterns Base UI, design tokens oklch)
user-invocable: true
---
```

(Supprimer `agent: blazz-ui-assistant` — ce champ n'est pas utilisé par Claude Code)

### Step 6 : Commit

```bash
git add .claude/skills/blazz-new-component.md
git commit -m "feat(skills): update blazz-new-component with explore phase and real patterns"
```

---

## Task 2 : Mettre à jour `blazz-new-page.md`

**Files:**
- Modify: `.claude/skills/blazz-new-page.md`

### Step 1 : Lire le fichier existant entièrement

```bash
cat .claude/skills/blazz-new-page.md
```

### Step 2 : Ajouter Phase 0 — Explore au début des étapes

Insérer avant "Étape 1: Analyser la Demande" :

```markdown
### Phase 0 — Explore (OBLIGATOIRE avant toute génération)

Lire dans cet ordre avant d'écrire quoi que ce soit :

1. `ai/rules.md` — conventions obligatoires (Server Components, routing, formulaires)

2. Une page similaire existante dans `apps/docs/src/routes/` ou `apps/examples/` pour
   comprendre le vrai pattern de layout utilisé (TanStack Router vs Next.js selon l'app).

3. `apps/docs/src/styles/globals.css` pour les design tokens disponibles.

**Important — monorepo :** Le projet est un Turborepo avec deux apps :
- `apps/docs/` — documentation (TanStack Start / TanStack Router)
- `apps/examples/` — CRM/StockBase/TalentFlow demos (Next.js)

Demander à l'utilisateur dans quelle app créer la page si ce n'est pas précisé.
```

### Step 3 : Mettre à jour les imports dans les templates

Remplacer tous les imports périmés :

```tsx
// AVANT (incorrect — chemins de l'ancienne architecture)
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Page, PageHeader } from '@/components/layout/page'

// APRÈS (monorepo — import depuis le package ui)
import { Card, CardHeader, CardTitle, CardContent } from "@blazz/ui/components/ui/card"
import { Button } from "@blazz/ui/components/ui/button"
// Les layouts sont dans chaque app, explorer avant d'importer
```

### Step 4 : Ajouter Phase finale — Auto-verify

À la fin des étapes, ajouter :

```markdown
### Phase finale — Auto-verify

```
### Auto-verify
✅/❌ App cible identifiée (docs ou examples)
✅/❌ Layout correct pour cette app
✅/❌ Server Component (pas de 'use client' sans raison)
✅/❌ Imports depuis @blazz/ui/components/... ou @/ (jamais chemins relatifs profonds)
✅/❌ Aucune couleur Tailwind hardcodée
✅/❌ Design tokens utilisés
✅/❌ 4 états si données : loading (Skeleton), empty, error, success
```
```

### Step 5 : Mettre à jour le frontmatter

```yaml
---
name: blazz-new-page
description: Créer une nouvelle page avec composants Blazz UI (Turborepo monorepo — apps/docs ou apps/examples)
user-invocable: true
---
```

### Step 6 : Commit

```bash
git add .claude/skills/blazz-new-page.md
git commit -m "feat(skills): update blazz-new-page with explore phase and monorepo-aware templates"
```

---

## Task 3 : Créer `.claude/skills/blazz-audit.md`

**Files:**
- Create: `.claude/skills/blazz-audit.md`

### Step 1 : Créer le fichier avec ce contenu exact

```markdown
---
name: blazz-audit
description: Auditer un fichier généré pour vérifier sa conformité aux conventions Blazz UI — rapport inline ✅/❌
user-invocable: true
---

# Blazz Audit Skill

Évalue la conformité d'un composant ou d'une page aux conventions Blazz UI.
Produit un rapport inline avec ✅/❌ par règle et des suggestions de correction.

## Invocation

```
/blazz-audit

[chemin du fichier à auditer]
```

ou coller le code directement après la commande.

## Ce que fait ce skill

1. Lit le fichier cible (ou le code fourni)
2. Lit `ai/rules.md` pour charger les règles
3. Identifie et lit un composant de référence similaire dans `packages/ui/src/components/ui/`
4. Produit le rapport inline

## Processus interne

### Phase 1 — Lecture

- Lire le fichier cible
- Lire `ai/rules.md`
- Identifier le composant de référence le plus proche dans `packages/ui/src/components/ui/`
  (ex: si c'est un composant de type badge → lire `badge.tsx`) et le lire

### Phase 2 — Analyse

Vérifier chaque règle des catégories suivantes.

### Phase 3 — Rapport

Afficher le rapport dans ce format exact :

```
## Audit Blazz UI — [nom du fichier ou "code fourni"]

### Code
✅/❌ Pattern correct : React.ComponentProps<"..."> ou Base UI primitive (pas forwardRef)
✅/❌ useRender + mergeProps si render prop nécessaire
✅/❌ data-slot présent
✅/❌ TypeScript strict (pas de `any`)
✅/❌ Imports corrects (pas de chemins relatifs trop profonds, pas de @/components/layout/...)

### Design tokens
✅/❌ Aucune couleur Tailwind hardcodée (bg-blue-500, text-white seul, bg-white...)
✅/❌ Design tokens oklch utilisés (bg-surface, text-fg, border-container, bg-brand...)

### Architecture (pages uniquement — ignorer pour composants purs)
✅/❌ Server Component par défaut ('use client' justifié si présent)
✅/❌ Formulaires : react-hook-form + zod (pas de useState pour les forms)
✅/❌ 4 états si fetch de données : Skeleton / Empty / Error / Success

### Suggestions
[Liste numérotée des corrections à apporter, avec numéro de ligne si possible]
[Si aucune correction : "Aucune non-conformité détectée."]
```

## Règles de référence

| Catégorie | Règle | Source |
|---|---|---|
| Code | `React.ComponentProps` ou Base UI (jamais `forwardRef`) | patterns kit réels |
| Code | `data-slot` présent sur l'élément racine | patterns kit réels |
| Code | Pas de `any` TypeScript | ai/rules.md |
| Code | Imports propres (pas `../../../`) | ai/rules.md §10 |
| Tokens | Pas de `bg-blue-500`, `bg-white`, `text-black` seuls | globals.css tokens |
| Tokens | `bg-surface`, `text-fg`, `border-container` pour les surfaces neutres | globals.css tokens |
| Tokens | `bg-brand`, `text-brand-fg` pour les éléments de marque | globals.css tokens |
| Tokens | `bg-negative`, `bg-positive`, `bg-caution`, `bg-inform` pour les états | globals.css tokens |
| Architecture | Server Component sauf si hooks/events/état local | ai/rules.md §1 |
| Architecture | `react-hook-form` + `zod` pour formulaires | ai/rules.md §4 |
| Architecture | Skeleton + Empty + Error + Success pour composants avec données | ai/rules.md §6 |

## Exemples d'erreurs courantes

### Couleur hardcodée
```tsx
// ❌
className="bg-blue-500 text-white"
// ✅
className="bg-brand text-brand-fg"
```

### forwardRef inutile
```tsx
// ❌ (pattern shadcn obsolète dans ce kit)
export const Card = React.forwardRef<HTMLDivElement, CardProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("...", className)} {...props} />
))

// ✅ (pattern réel du kit)
function Card({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card" className={cn("...", className)} {...props} />
}
```

### Import périmé
```tsx
// ❌
import { Button } from '@/components/ui/button'  // chemin app local
import { DashboardLayout } from '@/components/layout/dashboard-layout'  // dossier supprimé

// ✅
import { Button } from "@blazz/ui/components/ui/button"  // package monorepo
```

### useEffect + fetch
```tsx
// ❌
const [data, setData] = useState([])
useEffect(() => { fetch('/api/data').then(r => r.json()).then(setData) }, [])

// ✅ (page Server Component)
export default async function Page({ searchParams }) {
  const data = await getData(searchParams)
  return <DataTable data={data} />
}
```

## Limites de l'audit

- L'audit est **statique** — il ne compile pas le code
- Il ne vérifie pas les erreurs TypeScript complexes
- Il ne détecte pas les bugs de logique métier
- Pour les imports, il vérifie les patterns évidents mais pas l'arborescence complète
```

### Step 2 : Vérifier que le fichier est bien formé

```bash
head -5 .claude/skills/blazz-audit.md
```

Expected output:
```
---
name: blazz-audit
description: Auditer un fichier généré...
user-invocable: true
---
```

### Step 3 : Commit

```bash
git add .claude/skills/blazz-audit.md
git commit -m "feat(skills): add blazz-audit skill for conformity checking"
```

---

## Task 4 : Vérification manuelle — tester les skills

**Files:** aucun fichier à modifier

### Step 1 : Tester `/blazz-new-component`

Dans Claude Code, invoquer :
```
/blazz-new-component

Créer un composant "StatusIndicator" simple — un petit point coloré (dot) avec
variants: online (vert), offline (gris), busy (orange)
Pas interactif, pas de CVA nécessaire si simple.
```

Vérifier que Claude :
- Lit un composant similaire avant de générer (badge.tsx ou similar)
- Génère avec `React.ComponentProps` (pas `forwardRef`)
- Utilise `bg-positive`, `bg-fg-muted`, `bg-caution` (pas des couleurs Tailwind hardcodées)
- Affiche l'auto-verify à la fin

### Step 2 : Tester `/blazz-audit`

Auditer un fichier existant pour valider le skill :
```
/blazz-audit

packages/ui/src/components/ui/badge.tsx
```

Vérifier que le rapport contient :
- `✅ useRender + mergeProps` (pattern correct du badge)
- `✅ Design tokens utilisés`
- `✅ data-slot présent`
- Aucune fausse alerte

### Step 3 : Tester l'audit sur un fichier avec erreurs intentionnelles

Créer temporairement un fichier de test :
```tsx
// /tmp/test-bad-component.tsx
import React from "react"

export const BadComponent = React.forwardRef<HTMLDivElement, { className?: string }>(
  ({ className }, ref) => (
    <div ref={ref} className={`bg-blue-500 text-white p-4 ${className}`} />
  )
)
```

Invoquer `/blazz-audit` sur ce code.

Vérifier que le rapport contient :
- `❌ forwardRef utilisé`
- `❌ bg-blue-500 hardcodé`
- `❌ text-white hardcodé`
- Suggestions de correction

Supprimer le fichier de test ensuite.

### Step 4 : Commit final si tout est OK

```bash
git add -A
git commit -m "chore(skills): verify blazz-new-component, blazz-new-page, blazz-audit skills"
```

---

## Récapitulatif des fichiers

| Action | Fichier |
|---|---|
| Modifier | `.claude/skills/blazz-new-component.md` |
| Modifier | `.claude/skills/blazz-new-page.md` |
| Créer | `.claude/skills/blazz-audit.md` |
| Ne pas toucher | `.claude/skills/blazz-crud-page.md` |
