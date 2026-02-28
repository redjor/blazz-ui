# Design — Blazz Skills Redesign + Audit

**Date** : 2026-02-28
**Scope** : Approche A — mise à jour des skills de génération + nouveau skill `/blazz-audit`

---

## Contexte

Les skills existants (`.claude/skills/blazz-new-component.md`, `blazz-new-page.md`) datent de
janvier 2026 et sont désynchronisés sur deux points critiques :

1. **Patterns de code obsolètes** : ils prescrivent `React.forwardRef`, alors que le kit utilise
   `React.ComponentProps<"div">` pour les composants simples et les primitives Base UI
   (`@base-ui/react/...`) + `useRender` pour les composants interactifs.

2. **Chemins incorrects** : la réorganisation de février 2026 a déplacé les composants vers
   `packages/ui/src/components/ui/`, `patterns/`, `blocks/` — les skills pointaient sur des
   dossiers supprimés.

Il n'existe aucun mécanisme pour vérifier la qualité du code généré.

---

## Objectif

1. Enrichir les skills de génération pour qu'ils **lisent le codebase réel** avant de générer.
2. Créer un skill `/blazz-audit` pour **évaluer la conformité** d'un fichier généré.

---

## Patterns réels du kit (source de vérité)

Extraits des fichiers sources lus pendant le brainstorming :

### Composant simple (Card, CardHeader, etc.)
```tsx
function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn("bg-surface text-fg border border-container rounded-lg", className)}
      {...props}
    />
  )
}
```

### Composant interactif avec variants (Button)
```tsx
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

const buttonVariants = cva([...], { variants: { variant: {...}, size: {...} } })

function Button({ className, variant, size, ...props }: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return <ButtonPrimitive data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />
}
```

### Composant avec render prop (Badge)
```tsx
import { useRender } from "@base-ui/react/use-render"
import { mergeProps } from "@base-ui/react/merge-props"

function Badge({ render, ...props }: useRender.ComponentProps<"span"> & VariantProps<...>) {
  return useRender({ defaultTagName: "span", props: mergeProps({ className: cn(...) }, props), render, state: { slot: "badge" } })
}
```

### Design tokens à utiliser
- Backgrounds : `bg-surface`, `bg-raised`, `bg-panel`, `bg-brand`
- Textes : `text-fg`, `text-fg-muted`, `text-brand-fg`
- Bordures : `border-container`, `border-separator`
- États : `bg-positive`, `bg-negative`, `bg-caution`, `bg-inform`

---

## Partie 1 — Mise à jour des skills de génération

### Fichiers concernés
- `.claude/skills/blazz-new-component.md`
- `.claude/skills/blazz-new-page.md`

### Ajout : Phase 0 — Explore (avant toute génération)

Le skill doit lire dans cet ordre, **avant d'écrire une seule ligne** :

1. `ai/rules.md` — conventions obligatoires
2. Le composant réel le plus proche dans `packages/ui/src/components/ui/` — pour extraire
   le bon pattern (ComponentProps vs Base UI vs useRender)
3. `apps/docs/src/styles/globals.css` — design tokens oklch disponibles

Cette phase est **bloquante** : si les fichiers de référence ne sont pas trouvés, le skill
le signale avant de continuer.

### Ajout : Phase finale — Auto-verify

Après génération, afficher inline une checklist :

```
### Auto-verify
✅/❌ React.ComponentProps<"..."> utilisé (pas forwardRef)
✅/❌ Si interactif : Base UI primitive (@base-ui/react/...)
✅/❌ Pas de couleurs Tailwind hardcodées (bg-blue-500, text-white...)
✅/❌ Design tokens utilisés (bg-surface, text-fg, border-container...)
✅/❌ data-slot présent
✅/❌ TypeScript strict (pas de any)
```

---

## Partie 2 — Nouveau skill `/blazz-audit`

### Fichier à créer
`.claude/skills/blazz-audit.md`

### Invocation
```
/blazz-audit

[chemin du fichier ou code collé]
```

### Cible
Composants primitifs (`ui/`, `patterns/`) ET pages (`apps/docs/`, `apps/examples/`).

### Processus interne du skill

1. Lire le fichier cible
2. Lire `ai/rules.md`
3. Identifier un composant de référence similaire dans `packages/ui/src/components/` et le lire
4. Produire le rapport

### Format du rapport

```
## Audit Blazz UI — [nom du fichier]

### Code
✅ React.ComponentProps<"div"> utilisé
✅ data-slot présent
❌ Couleur hardcodée : `bg-blue-500` → utiliser `bg-brand`
❌ Import relatif trop profond : `../../../lib` → `../../lib/utils`

### Design tokens
✅ bg-surface, text-fg utilisés
❌ `text-white` ligne 34 → `text-brand-fg` (ou `text-white` si intentionnel sur fond négatif)

### Architecture (pages uniquement)
✅ Server Component (pas de 'use client' inutile)
❌ useEffect + fetch détecté → fetch serveur avec searchParams

### Suggestions
1. Ligne 34 : `text-white` → `text-brand-fg`
2. Ligne 12 : `bg-blue-500` → `bg-brand`
```

### Règles auditées

| Catégorie | Règle |
|---|---|
| Code | `React.ComponentProps` ou Base UI (pas forwardRef) |
| Code | `data-slot` présent |
| Code | TypeScript strict (pas de `any`) |
| Code | Imports corrects (pas de chemins relatifs trop profonds) |
| Tokens | Pas de couleurs Tailwind hardcodées |
| Tokens | Design tokens oklch du système utilisés |
| Architecture | Server Component par défaut, `'use client'` justifié |
| Architecture | Formulaires : react-hook-form + zod |
| Architecture | États obligatoires : loading/empty/error/success |

---

## Ce qu'on ne change pas

- `blazz-crud-page.md` — hors scope
- Pas de corrections automatiques dans `/blazz-audit` — rapport inline uniquement
- Aucune modification aux composants sources ni à `ai/rules.md`

---

## Fichiers à créer/modifier

| Action | Fichier |
|---|---|
| Modifier | `.claude/skills/blazz-new-component.md` |
| Modifier | `.claude/skills/blazz-new-page.md` |
| Créer | `.claude/skills/blazz-audit.md` |
