---
name: blazz-new-component
description: Générer un nouveau composant UI suivant les conventions Blazz UI
user-invocable: true
agent: blazz-ui-assistant
---

# Blazz New Component Skill

Crée un nouveau composant UI dans Blazz UI App en suivant toutes les conventions et patterns du projet.

## Ce que fait ce skill

1. Crée dossier `components/ui/[name]/` (si composant ne sera pas dans un fichier unique)
2. Crée fichier `[name].tsx` avec:
   - React.forwardRef pour ref forwarding
   - CVA (Class Variance Authority) pour variants
   - data-slot attribute
   - TypeScript strict typing
   - Proper ARIA attributes
3. Crée `[name].stories.tsx` pour Storybook
4. Crée `[NAME].README.md` avec documentation
5. Exporte depuis `components/ui/index.ts`

## Input Attendu

Le user doit spécifier:
- **Nom du composant**
- **Description** du rôle/usage
- **Variants** (optionnel: default, outline, etc.)
- **Sizes** (optionnel: xs, sm, default, lg)
- **Props custom** (optionnel)
- **Fonctionnalités** (icônes, loading state, etc.)

## Étapes d'Exécution

### Étape 1: Analyser le Besoin

Déterminer:
- Si composant simple (1 fichier) ou complexe (dossier)
- Quels variants sont nécessaires
- Quelles props accepter
- Quel élément HTML de base (`div`, `button`, `input`, etc.)
- Si Base UI primitive existe pour ce type

### Étape 2: Créer la Structure

**Option A**: Composant Simple
```
components/ui/[name].tsx
```

**Option B**: Composant Composable
```
components/ui/[name]/
  [name].tsx
  [name].stories.tsx
  [NAME].README.md
```

### Étape 3: Implémenter le Composant

Template de base:

```tsx
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const componentVariants = cva(
  // Classes de base communes à tous les variants
  'base classes here transition-colors outline-none',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        outline: 'border border-input bg-background hover:bg-muted',
        // Autres variants...
      },
      size: {
        default: 'h-8 px-3 text-sm',
        sm: 'h-7 px-2 text-xs',
        lg: 'h-9 px-4',
        // Autres sizes...
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ComponentNameProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof componentVariants> {
  // Props custom ici
  disabled?: boolean
}

export const ComponentName = React.forwardRef<HTMLDivElement, ComponentNameProps>(
  ({ className, variant, size, disabled, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(componentVariants({ variant, size, className }))}
        data-slot="component-name"
        aria-disabled={disabled}
        {...props}
      />
    )
  }
)

ComponentName.displayName = 'ComponentName'
```

### Étape 4: Créer Storybook Story

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { ComponentName } from './component-name'

const meta: Meta<typeof ComponentName> = {
  title: 'UI/ComponentName',
  component: ComponentName,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outline']
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg']
    },
  }
}

export default meta
type Story = StoryObj<typeof ComponentName>

export const Default: Story = {
  args: {
    children: 'Default Component',
  }
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <ComponentName variant="default">Default</ComponentName>
      <ComponentName variant="outline">Outline</ComponentName>
    </div>
  )
}

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <ComponentName size="sm">Small</ComponentName>
      <ComponentName size="default">Default</ComponentName>
      <ComponentName size="lg">Large</ComponentName>
    </div>
  )
}
```

### Étape 5: Créer Documentation

```markdown
# ComponentName

Description du composant et son usage.

## Import

\`\`\`tsx
import { ComponentName } from '@/components/ui/component-name'
\`\`\`

## Usage Basique

\`\`\`tsx
<ComponentName>Content</ComponentName>
\`\`\`

## API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | 'default' \| 'outline' | 'default' | Visual variant |
| size | 'sm' \| 'default' \| 'lg' | 'default' | Size variant |

## Exemples

### Exemple 1: Minimal
... [3-5 exemples pratiques]

## Accessibilité

- ARIA attributes utilisés
- Support clavier
- Focus management

## Styling

- Data slot: `data-slot="component-name"`
- Dark mode: Automatique
- Customization: Via className

---

**Fichier source**: `/components/ui/component-name.tsx`
```

### Étape 6: Exporter

Ajouter dans `components/ui/index.ts`:

```tsx
export * from './component-name/component-name'
// ou
export { ComponentName } from './component-name'
```

## Patterns Spécifiques

### Composant avec Icône

```tsx
import { type LucideIcon } from 'lucide-react'

interface Props {
  icon?: LucideIcon
  children?: React.ReactNode
}

export const Component = ({ icon: Icon, children }: Props) => {
  return (
    <div>
      {Icon && <Icon className="mr-2" />}
      {children}
    </div>
  )
}
```

### Composant Composable

```tsx
// Parent component
export const Card = () => {}
export const CardHeader = () => {}
export const CardTitle = () => {}
export const CardContent = () => {}
export const CardFooter = () => {}

// Usage
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
  <CardFooter>Footer</CardFooter>
</Card>
```

### Composant Polymorphique

```tsx
type AsProp<C extends React.ElementType> = {
  as?: C
}

type PolymorphicProps<C extends React.ElementType, Props = {}> =
  React.PropsWithChildren<Props & AsProp<C>> &
  Omit<React.ComponentPropsWithoutRef<C>, keyof (AsProp<C> & Props)>

export const Box = <C extends React.ElementType = 'div'>({
  as,
  ...props
}: PolymorphicProps<C>) => {
  const Component = as || 'div'
  return <Component {...props} />
}

// Usage
<Box>div par défaut</Box>
<Box as="section">section</Box>
<Box as="article">article</Box>
```

### Composant Controlled/Uncontrolled

```tsx
interface Props {
  value?: string  // Controlled
  defaultValue?: string  // Uncontrolled
  onChange?: (value: string) => void
}

export const Component = ({
  value: controlledValue,
  defaultValue,
  onChange,
}: Props) => {
  const [internalValue, setInternalValue] = useState(defaultValue ?? '')

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
- [ ] forwardRef utilisé
- [ ] CVA pour variants (si applicable)
- [ ] data-slot ajouté
- [ ] TypeScript strict (pas de any)
- [ ] Props interface documentée
- [ ] displayName défini
- [ ] Compile sans erreurs

### Accessibilité
- [ ] ARIA attributes appropriés
- [ ] Support clavier
- [ ] Focus visible
- [ ] aria-label pour éléments sans texte
- [ ] Disabled state géré

### Styling
- [ ] CSS variables (pas de couleurs hardcodées)
- [ ] Dark mode support
- [ ] Responsive si nécessaire
- [ ] Transitions/animations smooth

### Documentation
- [ ] README.md créé
- [ ] 3-5 exemples pratiques
- [ ] API reference complète
- [ ] Section accessibilité
- [ ] Section styling

### Storybook
- [ ] Story créée
- [ ] Tous les variants montrés
- [ ] Tous les sizes montrés
- [ ] Interactive controls
- [ ] Dark mode preview

### Export
- [ ] Exporté depuis index.ts
- [ ] Import path alias testé

## Exemple Complet: StatusBadge

### User Input:
```
/blazz-new-component

Créer composant "StatusBadge" avec:
- Variants: success (vert), warning (jaune), error (rouge), info (bleu)
- Sizes: sm, default, lg
- Optional icon à gauche
- Optional dot indicator
- Rounded corners
```

### Implémentation:

```tsx
// components/ui/status-badge.tsx
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

const statusBadgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full font-medium transition-colors',
  {
    variants: {
      variant: {
        success: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        warning: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
        error: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
        info: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        default: 'px-2.5 py-1 text-sm',
        lg: 'px-3 py-1.5 text-base',
      },
    },
    defaultVariants: {
      variant: 'info',
      size: 'default',
    },
  }
)

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusBadgeVariants> {
  icon?: LucideIcon
  showDot?: boolean
}

export const StatusBadge = React.forwardRef<HTMLSpanElement, StatusBadgeProps>(
  ({ className, variant, size, icon: Icon, showDot, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(statusBadgeVariants({ variant, size }), className)}
        data-slot="status-badge"
        {...props}
      >
        {showDot && (
          <span
            className="size-1.5 rounded-full bg-current"
            aria-hidden="true"
          />
        )}
        {Icon && <Icon className="size-3.5" />}
        {children}
      </span>
    )
  }
)

StatusBadge.displayName = 'StatusBadge'
```

## Best Practices

1. **Toujours forwardRef** pour composants UI
2. **CVA pour variants** - pattern propre et maintenable
3. **data-slot** - facilite styling custom
4. **CSS variables** - support dark mode automatique
5. **TypeScript strict** - pas de any
6. **ARIA** - accessibilité dès le début
7. **Documentation** - 3-5 exemples minimum
8. **Storybook** - tous les variants visibles

## Common Errors

❌ **Pas de forwardRef**
```tsx
export const Component = (props) => <div {...props} />
```

✅ **Avec forwardRef**
```tsx
export const Component = React.forwardRef((props, ref) =>
  <div ref={ref} {...props} />
)
```

❌ **Couleurs hardcodées**
```tsx
className="bg-blue-500 text-white"
```

✅ **CSS variables**
```tsx
className="bg-primary text-primary-foreground"
```

---

**Agent**: blazz-ui-assistant
**Version**: 1.0
**Last Updated**: 2026-01-19
