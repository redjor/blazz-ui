# Guide d'Architecture - Blazz UI App

Ce document explique l'architecture, les patterns et les conventions utilisés dans Blazz UI App. Il est essentiel pour comprendre comment le projet est structuré et comment développer de nouvelles fonctionnalités de manière cohérente.

## Table des Matières

1. [Principes de Conception](#principes-de-conception)
2. [Stack Technique](#stack-technique)
3. [Organisation des Dossiers](#organisation-des-dossiers)
4. [Patterns de Composants](#patterns-de-composants)
5. [Système de Design](#système-de-design)
6. [Conventions de Nommage](#conventions-de-nommage)
7. [Gestion d'État](#gestion-détat)
8. [Routing & Navigation](#routing--navigation)
9. [Styling](#styling)
10. [Tests](#tests)
11. [Comment Ajouter un Composant](#comment-ajouter-un-composant)
12. [Best Practices](#best-practices)

---

## Principes de Conception

Blazz UI est construit autour de plusieurs principes fondamentaux:

### 1. **Composition over Configuration**

Les composants sont conçus pour être composables plutôt que hautement configurables. Au lieu d'un composant monolithique avec 50 props, nous préférons plusieurs composants plus petits qui se combinent.

```tsx
// ✅ Bon: Composition
<Card>
  <CardHeader>
    <CardTitle>Titre</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Contenu</CardContent>
  <CardFooter>Pied de page</CardFooter>
</Card>

// ❌ Éviter: Configuration excessive
<Card
  title="Titre"
  description="Description"
  content="Contenu"
  footer="Pied de page"
  showHeader={true}
  showFooter={true}
/>
```

### 2. **Accessibilité First**

Tous les composants sont conçus avec l'accessibilité en tête (WCAG 2.1 AA):
- Attributs ARIA appropriés
- Support clavier complet
- Focus management
- Contraste de couleurs suffisant
- Labels et descriptions explicites

### 3. **Type Safety**

TypeScript strict mode est activé partout:
- Tous les composants sont typés
- Pas de `any` (sauf cas exceptionnels documentés)
- Props typées avec interfaces explicites
- Utilisation de génériques pour flexibilité

### 4. **LLM-Friendly Architecture**

Le projet est structuré pour être facilement compréhensible par les LLMs:
- Organisation logique des dossiers
- Patterns cohérents et prévisibles
- Documentation exhaustive
- Naming conventions claires
- Exemples d'utilisation abondants

### 5. **Performance**

Optimisations pour la performance:
- Lazy loading des composants lourds
- Code splitting automatique (Next.js App Router)
- Memoization où approprié
- Images optimisées
- CSS-in-JS évité (Tailwind uniquement)

---

## Stack Technique

### Core Framework

```typescript
// Framework principal
Next.js 16.1.1 (App Router)
React 19.2.3
TypeScript 5.x

// Styling
Tailwind CSS 4.0
OKLCh color space
CSS Variables

// UI Primitives
@base-ui/react 1.0 (headless components)
```

### Librairies Clés

| Bibliothèque | Version | Usage | Pourquoi? |
|--------------|---------|-------|-----------|
| **Base UI** | 1.0 | Composants headless | Accessibilité, flexibilité, pas de styling imposé |
| **TanStack Table** | 8.21 | DataTable | Solution la plus puissante pour tables complexes |
| **React Hook Form** | 7.71 | Formulaires | Performance, DX, validation intégrée |
| **Zod** | 4.3 | Validation | Type-safe, intégration TypeScript |
| **CVA** | 0.7 | Variants | Pattern propre pour variants de composants |
| **Lucide React** | 0.562 | Icons | Grande collection, tree-shakeable |
| **cmdk** | 1.1 | Command Palette | Best-in-class command interface |

### Tooling

| Outil | Usage | Pourquoi? |
|-------|-------|-----------|
| **Turbopack** | Dev build | 10x plus rapide que Webpack |
| **Biome** | Lint + Format | Outil unique, 100x plus rapide qu'ESLint |
| **Vitest** | Tests | Rapide, compatible Vite, DX moderne |
| **Storybook** | Component docs | Standard industrie |

---

## Organisation des Dossiers

```
/blazz-ui-app
├── app/                          # Next.js App Router
│   ├── (frame)/                  # Route group avec DashboardLayout
│   │   ├── layout.tsx            # Layout avec sidebar
│   │   ├── dashboard/            # Pages du dashboard
│   │   ├── products/
│   │   ├── orders/
│   │   └── ...
│   ├── auth/                     # Pages publiques (login, signup)
│   ├── api/                      # API routes (si besoin)
│   ├── globals.css               # 🎨 Design tokens CSS
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Page d'accueil
│
├── components/
│   ├── ui/                       # 🧩 Composants UI primitifs
│   │   ├── button/
│   │   │   ├── button.tsx        # Composant
│   │   │   ├── button.stories.tsx # Storybook
│   │   │   └── BUTTON.README.md  # Documentation
│   │   ├── card/
│   │   ├── dialog/
│   │   └── ... (45+ composants)
│   │
│   ├── features/                 # 🎯 Composants métier complexes
│   │   ├── data-table/           # DataTable avec 26 fichiers
│   │   ├── command-palette/      # Command Palette
│   │   └── image-upload/         # Upload d'images
│   │
│   └── layout/                   # 🏗️ Composants de mise en page
│       ├── dashboard-layout/     # Layout principal
│       ├── navbar/
│       ├── sidebar/
│       └── ...
│
├── config/                       # ⚙️ Configuration
│   ├── app.config.ts             # Config centralisée
│   └── navigation.ts             # Navigation sidebar
│
├── docs/                         # 📖 Documentation
│   ├── ARCHITECTURE.md           # Ce fichier
│   ├── LLM_GUIDE.md              # Guide LLM
│   ├── COMPONENTS.md             # Liste des composants
│   └── MIGRATION_GUIDE.md        # Guide migration
│
├── hooks/                        # 🎣 Custom React hooks
│   ├── use-data-table-views.ts  # Vues DataTable
│   ├── use-command-palette.ts   # Command Palette
│   ├── use-debounced.ts         # Debounce utility
│   └── ... (8+ hooks)
│
├── lib/                          # 🛠️ Utilitaires
│   ├── utils.ts                  # cn() - class merger
│   └── utils/                    # Autres helpers
│       ├── array.ts
│       ├── string.ts
│       ├── currency.ts
│       └── ...
│
├── types/                        # 📝 Types TypeScript
│   └── navigation.ts             # Types pour navigation
│
├── templates/                    # 📄 Templates réutilisables
│   ├── pages/                    # Templates de pages
│   └── components/               # Patterns de composants
│
├── stories/                      # 📚 Storybook stories
├── public/                       # 🖼️ Assets statiques
└── tests/                        # 🧪 Tests
```

### Règles d'Organisation

1. **app/** → Routing uniquement, pas de logique métier
2. **components/ui/** → Composants génériques réutilisables
3. **components/features/** → Composants spécifiques métier
4. **components/layout/** → Structure de mise en page
5. **hooks/** → Logique réutilisable sans UI
6. **lib/** → Utilitaires purs (pure functions)
7. **types/** → Types partagés
8. **config/** → Configuration statique

---

## Patterns de Composants

### 1. Composant de Base avec forwardRef

Tous les composants UI utilisent `React.forwardRef` pour permettre l'accès au DOM:

```tsx
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

// 1. Définir les variants avec CVA
const buttonVariants = cva(
  // Classes de base
  'inline-flex items-center justify-center rounded-md font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        outline: 'border border-input bg-background hover:bg-accent',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    }
  }
)

// 2. Interface des props avec VariantProps
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  // Props custom ici
}

// 3. Composant avec forwardRef
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        data-slot="button"
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'
```

### 2. Composant Composable

Pattern pour composants avec sous-composants:

```tsx
// card.tsx
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('rounded-lg border bg-card', className)}
      data-slot="card"
      {...props}
    />
  )
)

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5 p-6', className)}
      data-slot="card-header"
      {...props}
    />
  )
)

export const CardTitle = React.forwardRef<HTMLParagraphElement, CardTitleProps>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-2xl font-semibold', className)}
      data-slot="card-title"
      {...props}
    />
  )
)

// Usage
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

<Card>
  <CardHeader>
    <CardTitle>Mon Titre</CardTitle>
  </CardHeader>
  <CardContent>Contenu</CardContent>
</Card>
```

### 3. Composant Polymorphique

Composant qui peut rendre n'importe quel élément HTML:

```tsx
import * as React from 'react'

type AsProp<C extends React.ElementType> = {
  as?: C
}

type PropsToOmit<C extends React.ElementType, P> = keyof (AsProp<C> & P)

type PolymorphicComponentProp<
  C extends React.ElementType,
  Props = {}
> = React.PropsWithChildren<Props & AsProp<C>> &
  Omit<React.ComponentPropsWithoutRef<C>, PropsToOmit<C, Props>>

export type BoxProps<C extends React.ElementType = 'div'> =
  PolymorphicComponentProp<C, {
    variant?: 'default' | 'bordered'
  }>

export const Box = <C extends React.ElementType = 'div'>({
  as,
  variant = 'default',
  className,
  ...props
}: BoxProps<C>) => {
  const Component = as || 'div'
  return <Component className={cn(boxVariants({ variant }), className)} {...props} />
}

// Usage
<Box>Je suis un div</Box>
<Box as="section">Je suis une section</Box>
<Box as="article">Je suis un article</Box>
```

### 4. Composant avec Context

Pattern pour composants avec état partagé:

```tsx
// form.tsx
import { createContext, useContext } from 'react'
import { useFormContext } from 'react-hook-form'

type FormFieldContextValue = {
  name: string
}

const FormFieldContext = createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
)

export const FormField = ({ name, children }: FormFieldProps) => {
  return (
    <FormFieldContext.Provider value={{ name }}>
      {children}
    </FormFieldContext.Provider>
  )
}

export const useFormField = () => {
  const fieldContext = useContext(FormFieldContext)
  const { getFieldState, formState } = useFormContext()
  const fieldState = getFieldState(fieldContext.name, formState)

  return {
    name: fieldContext.name,
    ...fieldState
  }
}

// Usage
<FormField name="email">
  <FormLabel />
  <FormControl>
    <Input />
  </FormControl>
  <FormMessage />
</FormField>
```

---

## Système de Design

### CSS Variables (Design Tokens)

Tous les tokens de design sont définis dans `/app/globals.css`:

```css
:root {
  /* Couleurs */
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.145 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.145 0 0);
  --destructive: oklch(0.58 0.22 27);
  --destructive-foreground: oklch(0.985 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.47 0 0);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.145 0 0);

  /* Radius */
  --radius: 0.5rem;
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --radius-2xl: 1rem;

  /* Spacing */
  --topbar-height: 56px;

  /* Typography */
  --text-tiny: 0.75rem;
  --text-xs: 0.8125rem;
}

.dark {
  /* Dark mode colors */
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  /* ... */
}
```

### OKLCh Color Space

Nous utilisons OKLCh au lieu de RGB/HSL pour:
- **Uniformité perceptuelle**: Les changements de luminosité sont uniformes
- **Gamut plus large**: Plus de couleurs disponibles
- **Meilleure manipulation**: Plus facile de créer des palettes cohérentes

```css
/* oklch(L C H [/ A]) */
/* L = Luminosité (0-1) */
/* C = Chroma/Saturation (0-0.4) */
/* H = Hue/Teinte (0-360) */
/* A = Alpha (optionnel) */

--primary: oklch(0.58 0.22 27); /* Rouge-orange */
--primary-light: oklch(0.68 0.22 27); /* Plus clair */
--primary-dark: oklch(0.48 0.22 27); /* Plus foncé */
```

### Data Slots

Tous les composants utilisent `data-slot` pour permettre un ciblage CSS précis:

```tsx
<button data-slot="button" {...props}>
  <span data-slot="button-icon">{icon}</span>
  <span data-slot="button-text">{children}</span>
</button>
```

CSS ciblage:
```css
[data-slot="button"] {
  /* Styles du bouton */
}

[data-slot="button-icon"] {
  /* Styles de l'icône */
}
```

### Radius concentrique (nested border-radius)

Quand un élément arrondi contient un enfant arrondi, l'enfant doit avoir un radius **plus petit** pour que les courbes restent parallèles :

```
inner_radius = outer_radius - gap
```

`gap` = le padding (ou margin) entre le bord du parent et le bord de l'enfant.

**Exemple concret — Frame** :

```
Frame:      --frame-radius (ex. 8px)     padding: 3px
FramePanel: --frame-radius - 3px = 5px   ← courbes parallèles
  FrameFooter (bleed): panel_radius - 1px (border) = 4px
```

Si le gap est 0 (dense), inner = outer.

**Implémentation** : définir une CSS variable `--inner-radius` calculée sur le parent, que les enfants référencent. Si le gap change (dense, spacing), overrider la variable.

```css
.parent {
  --radius: var(--radius-lg);               /* 8px */
  --inner-radius: calc(var(--radius) - 3px); /* 5px */
  border-radius: var(--radius);
  padding: 3px;
}
.child {
  border-radius: var(--inner-radius);        /* courbes parallèles */
}
```

### Spacing & Padding dans les composants composés

Quand un composant parent contrôle le padding de ses enfants via `[&_[data-slot=...]]`, les sélecteurs descendants matchent à **tous les niveaux**. Si un slot est imbriqué dans un autre slot qui reçoit déjà du padding, le contenu se retrouve doublement paddé.

**Exemple de bug** : `Frame` donne `p-4` à `FramePanel` et `px-4` à `FrameFooter`. Mais `FrameFooter` est **à l'intérieur** de `FramePanel`. Résultat : le contenu du footer est à `16 + 16 = 32px` du bord au lieu de `16px`.

**Solution — Pattern bleed** : le sous-composant imbriqué utilise des marges négatives pour annuler le padding parent :

```
Footer (-mx-4 -mb-4 mt-4 px-4 py-3 border-t)
  → -mx-4 annule le p-4 du Panel sur les côtés
  → -mb-4 annule le p-4 du Panel en bas
  → px-4 réapplique son propre padding → contenu aligné
  → mt-4 espace au-dessus du border-t
```

**Règle** : toujours vérifier la chaîne de padding quand un slot est imbriqué dans un autre. Un seul niveau doit contrôler le padding horizontal à la fois.

---

## Conventions de Nommage

### Fichiers

```
kebab-case.tsx         # Composants
kebab-case.ts          # Utilitaires
kebab-case.stories.tsx # Stories Storybook
SCREAMING_SNAKE.md     # Documentation
```

### Composants

```tsx
PascalCase             # Composants React
camelCase              # Fonctions, variables
CONSTANT_CASE          # Constantes
```

### Types

```tsx
interface ButtonProps        # Props d'un composant
type ButtonVariant           # Type alias
enum ButtonSize              # Enum (rare, préférer unions)
```

### CSS/Tailwind

```
lowercase-with-dashes        # Classes CSS custom
camelCase                    # CSS variables (--primaryColor)
```

---

## Gestion d'État

### État Local

```tsx
// useState pour état simple
const [count, setCount] = useState(0)

// useReducer pour état complexe
const [state, dispatch] = useReducer(reducer, initialState)
```

### État de Formulaire

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

const form = useForm({
  resolver: zodResolver(schema),
  defaultValues: {
    email: '',
    password: ''
  }
})
```

### État Partagé

```tsx
// Context pour état partagé dans un sous-arbre
const ThemeContext = createContext<ThemeContextValue>(defaultValue)

// Custom hooks pour encapsuler la logique
export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}
```

### État Server (Next.js)

```tsx
// Server Components (par défaut dans app/)
async function ProductList() {
  const products = await fetchProducts() // Direct DB/API call
  return <div>{products.map(...)}</div>
}

// Client Components (avec 'use client')
'use client'
export function InteractiveForm() {
  const [value, setValue] = useState('')
  // ...
}
```

---

## Routing & Navigation

### App Router Structure

```
app/
├── layout.tsx                  # Root layout
├── page.tsx                    # / route
├── (frame)/                    # Route group avec layout
│   ├── layout.tsx              # DashboardLayout
│   ├── dashboard/
│   │   └── page.tsx            # /dashboard
│   ├── products/
│   │   ├── page.tsx            # /products
│   │   ├── [id]/
│   │   │   └── page.tsx        # /products/:id
│   │   └── new/
│   │       └── page.tsx        # /products/new
│   └── orders/
│       └── page.tsx            # /orders
└── auth/
    ├── login/
    │   └── page.tsx            # /auth/login
    └── signup/
        └── page.tsx            # /auth/signup
```

### Navigation Config

Configuration centralisée dans `/config/navigation.ts`:

```tsx
import { Package, ShoppingCart, BarChart } from 'lucide-react'

export const sidebarConfig: SidebarConfig = {
  navigation: [
    {
      id: 'products',
      title: 'Produits',
      items: [
        {
          title: 'Tous les produits',
          url: '/products',
          icon: Package
        },
        {
          title: 'Nouveau produit',
          url: '/products/new',
          icon: Plus
        }
      ]
    }
  ]
}
```

### Navigation Programmatique

```tsx
import { useRouter } from 'next/navigation'

function MyComponent() {
  const router = useRouter()

  const handleClick = () => {
    router.push('/dashboard')
    // router.back()
    // router.forward()
    // router.refresh()
  }
}
```

---

## Styling

### Tailwind CSS

Utility-first avec Tailwind CSS 4:

```tsx
<button className="rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90">
  Click me
</button>
```

### Class Variance Authority (CVA)

Pour gérer les variants de composants:

```tsx
import { cva } from 'class-variance-authority'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground',
        outline: 'border border-input bg-background'
      },
      size: {
        default: 'h-10 px-4',
        sm: 'h-9 px-3',
        lg: 'h-11 px-8'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)
```

### cn() Utility

Fonction helper pour merger les classes:

```tsx
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Usage
<div className={cn(
  'base-classes',
  isActive && 'active-classes',
  className // Permet override par parent
)} />
```

---

## Tests

### Configuration Vitest

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts']
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './')
    }
  }
})
```

### Test Pattern

```tsx
// button.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './button'

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)

    await userEvent.click(screen.getByText('Click me'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('supports variants', () => {
    const { container } = render(<Button variant="outline">Click</Button>)
    expect(container.firstChild).toHaveClass('border')
  })
})
```

---

## Comment Ajouter un Composant

### Étape 1: Créer la Structure

```bash
mkdir -p components/ui/my-component
cd components/ui/my-component
touch my-component.tsx
touch my-component.stories.tsx
touch MY_COMPONENT.README.md
```

### Étape 2: Implémenter le Composant

```tsx
// my-component.tsx
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const myComponentVariants = cva(
  'base-classes-here',
  {
    variants: {
      variant: {
        default: 'variant-classes',
      },
      size: {
        default: 'size-classes',
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    }
  }
)

export interface MyComponentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof myComponentVariants> {
  // Props custom
}

export const MyComponent = React.forwardRef<HTMLDivElement, MyComponentProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(myComponentVariants({ variant, size, className }))}
        data-slot="my-component"
        {...props}
      />
    )
  }
)

MyComponent.displayName = 'MyComponent'
```

### Étape 3: Créer la Story Storybook

```tsx
// my-component.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { MyComponent } from './my-component'

const meta: Meta<typeof MyComponent> = {
  title: 'UI/MyComponent',
  component: MyComponent,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default']
    },
    size: {
      control: 'select',
      options: ['default']
    }
  }
}

export default meta
type Story = StoryObj<typeof MyComponent>

export const Default: Story = {
  args: {
    children: 'My Component Content'
  }
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <MyComponent variant="default">Default</MyComponent>
      {/* Autres variants... */}
    </div>
  )
}
```

### Étape 4: Documenter

```markdown
# MyComponent

Description du composant...

## Usage

\`\`\`tsx
import { MyComponent } from '@/components/ui/my-component'

<MyComponent variant="default">
  Content here
</MyComponent>
\`\`\`

## API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | 'default' | 'default' | Visual variant |
| size | 'default' | 'default' | Size variant |

## Examples

### Basic Example
...

### With Custom Styling
...

## Accessibility

- Uses proper ARIA attributes
- Keyboard navigation support
- Focus management

## Styling

- Uses `data-slot="my-component"` for targeting
- Supports dark mode
- Customizable via className prop
```

### Étape 5: Exporter

```tsx
// components/ui/index.ts
export * from './my-component/my-component'
```

### Étape 6: Tester

```tsx
// my-component.test.tsx
import { render } from '@testing-library/react'
import { MyComponent } from './my-component'

describe('MyComponent', () => {
  it('renders correctly', () => {
    const { container } = render(<MyComponent>Test</MyComponent>)
    expect(container).toBeInTheDocument()
  })
})
```

---

## Best Practices

### Composants

1. **Toujours utiliser forwardRef** pour composants UI
2. **Typer toutes les props** avec interfaces explicites
3. **Utiliser CVA** pour variants au lieu de logique conditionnelle
4. **Ajouter data-slot** pour tous les éléments stylables
5. **Documenter** dans README.md avec exemples
6. **Créer story Storybook** avec tous les variants

### Performance

1. **Lazy load** les composants lourds
2. **Memoize** les calculs coûteux avec `useMemo`
3. **Éviter re-renders** inutiles avec `React.memo`
4. **Optimiser images** avec Next.js Image component
5. **Code splitting** automatique avec dynamic imports

### Accessibilité

1. **Attributs ARIA** appropriés sur tous les composants interactifs
2. **Labels explicites** pour tous les champs de formulaire
3. **Focus visible** avec styles `:focus-visible`
4. **Contraste suffisant** (ratio 4.5:1 minimum)
5. **Support clavier** complet (Tab, Enter, Escape, Arrow keys)

### TypeScript

1. **Pas de `any`** sauf cas exceptionnels documentés
2. **Interfaces** pour props publiques
3. **Types** pour usage interne
4. **Génériques** pour composants réutilisables
5. **Type guards** pour narrowing

### Git

1. **Commits atomiques** (une fonctionnalité = un commit)
2. **Messages explicites** en français
3. **Branches** pour features (`feature/nom-feature`)
4. **PR** avec description et screenshots

### Documentation

1. **README.md** pour chaque composant
2. **Exemples** multiples (minimal, complet, edge cases)
3. **API reference** avec tableau des props
4. **Accessibilité** section obligatoire
5. **Common errors** avec solutions

---

## Ressources

- [Next.js App Router](https://nextjs.org/docs/app)
- [React 19 Docs](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Base UI](https://base-ui.com/)
- [CVA Documentation](https://cva.style/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

**Dernière mise à jour**: 2026-01-19
