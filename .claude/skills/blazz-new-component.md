---
name: blazz-new-component
description: Générer un nouveau composant UI suivant les conventions Blazz UI (patterns Base UI, design tokens oklch)
user-invocable: true
---

# Blazz New Component Skill

Crée un nouveau composant UI dans le package `@blazz/ui` en suivant les conventions réelles du projet : pas de `forwardRef`, design tokens oklch, patterns Base UI.

## Ce que fait ce skill

1. Explore les composants existants similaires avant de générer quoi que ce soit
2. Crée `packages/ui/src/components/ui/[name].tsx` (ou dossier si composable)
3. Applique le bon pattern selon le type de composant (4 patterns disponibles)
4. Exporte depuis `packages/ui/src/index.ts`
5. Vérifie automatiquement la conformité en fin d'exécution

## Input Attendu

Le user doit spécifier:
- **Nom du composant**
- **Description** du rôle/usage
- **Variants** (optionnel: default, outline, etc.)
- **Sizes** (optionnel: xs, sm, default, lg)
- **Props custom** (optionnel)
- **Fonctionnalités** (icônes, loading state, etc.)

## Étapes d'Exécution

### Phase 0 — Explore (OBLIGATOIRE avant toute génération)

**Cette phase est bloquante. Ne pas générer de code avant de l'avoir complétée.**

1. Lire `ai/rules.md` pour les conventions courantes du projet
2. Chercher un composant similaire existant dans `packages/ui/src/components/ui/` pour observer le pattern réellement utilisé
3. Lire `apps/docs/src/styles/globals.css` pour confirmer les tokens disponibles
4. Identifier si Base UI expose une primitive pour ce type de composant (`@base-ui-components/react`)

```bash
# Exemple d'exploration
ls packages/ui/src/components/ui/
# Lire un composant proche du besoin, ex: card.tsx, button.tsx, badge.tsx
```

### Phase 1 — Analyser le besoin

Après l'exploration, décider:

| Question | Réponse → Pattern |
|---|---|
| Élément HTML simple, pas d'interaction ? | Pattern A — `ComponentProps` |
| Variants visuels multiples, toujours un élément natif ? | Pattern B — `CVA + ComponentProps` |
| Gestion d'état, accessibilité complexe (popover, dialog, select) ? | Pattern C — Base UI primitive |
| Besoin de render prop pour polymorphisme ? | Pattern D — `useRender` |

Déterminer aussi:
- Composant single-file ou dossier composable (plusieurs sous-composants)
- Props nécessaires
- Élément HTML de base (`div`, `button`, `input`, `span`, etc.)

### Phase 2 — Choisir la structure

**Option A — Fichier unique** (composant simple ou avec sous-composants dans le même fichier):
```
packages/ui/src/components/ui/[name].tsx
```

**Option B — Dossier** (composant avec fichiers séparés, ex: data-table):
```
packages/ui/src/components/ui/[name]/
  index.tsx
  [name].tsx
  [name]-context.tsx   ← si context nécessaire
```

### Phase 3 — Implémenter

#### Pattern A — ComponentProps (composant simple, pas d'interaction)

Exemple réel: `Card`, `CardHeader`, `CardContent`

```tsx
import { cn } from "@blazz/ui/lib/utils"

function ComponentName({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="component-name"
      className={cn(
        "bg-surface text-fg border border-container rounded-lg",
        className
      )}
      {...props}
    />
  )
}

export { ComponentName }
```

#### Pattern B — CVA + ComponentProps (variants visuels)

Exemple réel: `Button` sans Base UI, `Badge` simple

```tsx
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@blazz/ui/lib/utils"

const componentVariants = cva(
  "inline-flex items-center justify-center gap-2 transition-colors outline-none",
  {
    variants: {
      variant: {
        default: "bg-brand text-brand-fg hover:bg-brand-hover",
        outline: "border border-container bg-surface text-fg hover:bg-raised",
        ghost: "text-fg hover:bg-raised",
        destructive: "bg-negative text-fg",
      },
      size: {
        sm: "h-7 px-2.5 text-xs",
        default: "h-8 px-3 text-sm",
        lg: "h-9 px-4 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function ComponentName({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof componentVariants>) {
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

#### Pattern C — Base UI primitive (interaction/accessibilité complexe)

Exemple réel: `Button` (interactive), `Dialog`, `Popover`

```tsx
import { ComponentPrimitive } from "@base-ui-components/react/component-primitive"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@blazz/ui/lib/utils"

const componentVariants = cva(
  "inline-flex items-center justify-center gap-2 transition-colors outline-none",
  {
    variants: {
      variant: {
        default: "bg-brand text-brand-fg hover:bg-brand-hover",
        outline: "border border-container bg-surface text-fg hover:bg-raised",
        ghost: "text-fg hover:bg-raised",
      },
      size: {
        sm: "h-7 px-2.5 text-xs",
        default: "h-8 px-3 text-sm",
        lg: "h-9 px-4 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function ComponentName({
  className,
  variant,
  size,
  ...props
}: ComponentPrimitive.Props & VariantProps<typeof componentVariants>) {
  return (
    <ComponentPrimitive
      data-slot="component-name"
      className={cn(componentVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { ComponentName, componentVariants }
```

#### Pattern D — useRender (render prop / polymorphisme)

Exemple réel: `Badge` avec render prop

```tsx
import { useRender } from "@base-ui-components/react/use-render"
import { mergeProps } from "@base-ui-components/react/merge-props"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@blazz/ui/lib/utils"

const componentVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full font-medium",
  {
    variants: {
      variant: {
        default: "bg-raised text-fg border border-container",
        positive: "bg-positive text-fg",
        negative: "bg-negative text-fg",
        caution: "bg-caution text-fg",
        inform: "bg-inform text-fg",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        default: "px-2.5 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function ComponentName({
  render,
  className,
  variant,
  size,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof componentVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps(
      {
        "data-slot": "component-name",
        className: cn(componentVariants({ variant, size, className })),
      },
      props
    ),
    render,
    state: { slot: "component-name", variant },
  })
}

export { ComponentName, componentVariants }
```

### Phase 4 — Exporter

Ajouter l'export dans `packages/ui/src/index.ts`:

```tsx
// Ajouter dans la section appropriée (ui primitives)
export { ComponentName, componentVariants } from "./components/ui/component-name"
```

### Phase 5 — Auto-verify

Après avoir écrit et exporté le composant, vérifier chaque point:

```
✅ / ❌  forwardRef absent du fichier
✅ / ❌  Aucun token shadcn (bg-primary, text-primary-foreground, bg-muted, etc.)
✅ / ❌  Uniquement des tokens Blazz (bg-surface, bg-raised, bg-brand, text-fg, border-container, etc.)
✅ / ❌  data-slot présent
✅ / ❌  Pattern choisi correspond au type de composant (A/B/C/D)
✅ / ❌  TypeScript strict — aucun `any` implicite
✅ / ❌  Export ajouté dans packages/ui/src/index.ts
✅ / ❌  Import cn depuis "@blazz/ui/lib/utils" (pas "@/lib/utils")
✅ / ❌  Aucun fichier Storybook ou README créé
```

Si un point est ❌, corriger avant de reporter.

## Patterns Spécifiques

### Composant avec icône

```tsx
import type { LucideIcon } from "lucide-react"

interface Props extends React.ComponentProps<"div"> {
  icon?: LucideIcon
}

function ComponentName({ icon: Icon, children, className, ...props }: Props) {
  return (
    <div
      data-slot="component-name"
      className={cn("flex items-center gap-2", className)}
      {...props}
    >
      {Icon && <Icon className="size-4 shrink-0" aria-hidden="true" />}
      {children}
    </div>
  )
}
```

### Composant composable

```tsx
// Chaque sous-composant est une fonction indépendante, pas de forwardRef
function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="card" className={cn("bg-surface border border-container rounded-lg", className)} {...props} />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="card-header" className={cn("flex flex-col gap-1.5 p-6", className)} {...props} />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3 data-slot="card-title" className={cn("text-base font-semibold text-fg", className)} {...props} />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="card-content" className={cn("p-6 pt-0", className)} {...props} />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="card-footer" className={cn("flex items-center p-6 pt-0", className)} {...props} />
  )
}

export { Card, CardHeader, CardTitle, CardContent, CardFooter }
```

### Composant Controlled/Uncontrolled

```tsx
interface Props {
  value?: string        // Controlled
  defaultValue?: string // Uncontrolled
  onChange?: (value: string) => void
}

function ComponentName({ value: controlledValue, defaultValue, onChange }: Props) {
  const [internalValue, setInternalValue] = useState(defaultValue ?? "")
  const value = controlledValue ?? internalValue

  const handleChange = (newValue: string) => {
    if (controlledValue === undefined) {
      setInternalValue(newValue)
    }
    onChange?.(newValue)
  }

  // ...
}
```

## Checklist Qualité

Avant de finaliser le composant:

### Code
- [ ] Aucun `forwardRef` (pattern moderne React 19 + Base UI)
- [ ] CVA pour variants (si variants multiples)
- [ ] `data-slot` ajouté sur l'élément racine
- [ ] TypeScript strict — aucun `any`
- [ ] `"use client"` ajouté uniquement si interactivité réelle (useState, useEffect, event handlers)
- [ ] Compile sans erreurs TypeScript

### Design Tokens
- [ ] Uniquement tokens Blazz: `bg-surface`, `bg-raised`, `bg-panel`, `bg-brand`, `bg-brand-hover`
- [ ] Couleurs sémantiques: `text-fg`, `text-fg-muted`, `text-brand-fg`
- [ ] Bordures: `border-container`, `border-separator`
- [ ] États: `bg-positive`, `bg-negative`, `bg-caution`, `bg-inform`
- [ ] Zéro couleur Tailwind hardcodée (pas de `bg-blue-500`, `text-gray-700`, etc.)
- [ ] Zéro token shadcn (pas de `bg-primary`, `bg-muted`, `text-foreground`, etc.)

### Accessibilité
- [ ] ARIA attributes appropriés
- [ ] Support clavier si interactif
- [ ] Focus visible
- [ ] `aria-label` pour éléments sans texte visible
- [ ] Disabled state géré si applicable

### Export
- [ ] Exporté depuis `packages/ui/src/index.ts`
- [ ] Aucun fichier Storybook créé
- [ ] Aucun fichier README créé

---

**Version**: 2.0
**Last Updated**: 2026-02-28
