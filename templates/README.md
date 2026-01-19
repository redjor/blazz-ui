# Templates & Patterns - Blazz UI

Templates et patterns réutilisables pour accélérer le développement.

## 📋 Table des Matières

- [Pages Templates](#pages-templates)
- [Component Patterns](#component-patterns)
- [Utilisation](#utilisation)
- [Avec l'Agent LLM](#avec-lagent-llm)

---

## 📄 Pages Templates

### 1. simple-list.tsx
**Liste simple avec cards**

**Features:**
- Grid responsive de cards
- Barre de recherche
- Actions par card (edit, delete)
- Bouton création
- État vide

**Utilisation:**
```bash
cp templates/pages/simple-list.tsx app/(frame)/[votre-path]/page.tsx
```

**À remplacer:**
- `Item` interface avec votre type
- `mockItems` avec vos données (API call)
- Handlers `handleCreate`, `handleEdit`, `handleDelete`
- Adapter les champs affichés dans les cards

---

### 2. data-table-page.tsx
**Page CRUD complète avec DataTable enterprise**

**Features:**
- DataTable avec sorting, filtering, pagination
- Dialog Create/Edit avec formulaire
- Delete confirmation
- Row selection & bulk actions
- Filtres avancés
- Recherche globale
- Validation Zod

**Utilisation:**
```bash
cp templates/pages/data-table-page.tsx app/(frame)/[votre-path]/page.tsx
```

**À remplacer:**
- `Entity` interface et schéma Zod
- `mockData` avec API calls
- Colonnes DataTable selon vos besoins
- Filtres et bulk actions
- Logique CRUD (create, update, delete)

**Recommandé pour:** Admin panels, CRM, gestion de données tabulaires

---

### 3. form-page.tsx
**Formulaire multi-étapes avec navigation**

**Features:**
- Navigation entre étapes
- Progress indicator visuel
- Validation par étape (Zod)
- Sauvegarde temporaire (localStorage)
- Summary/review step
- react-hook-form

**Utilisation:**
```bash
cp templates/pages/form-page.tsx app/(frame)/[votre-path]/page.tsx
```

**À remplacer:**
- `steps` configuration avec vos étapes
- Schémas Zod pour chaque étape
- Champs de formulaire par étape
- Logique de soumission

**Recommandé pour:** Onboarding, checkout, wizards, profils complexes

---

### 4. dashboard-page.tsx
**Dashboard avec métriques et graphiques**

**Features:**
- Cards de statistiques avec tendances
- Graphiques (placeholder - ajouter lib)
- Liste activité récente
- Actions rapides
- Top items/produits
- Layout responsive
- Period filters

**Utilisation:**
```bash
cp templates/pages/dashboard-page.tsx app/(frame)/dashboard/page.tsx
```

**À remplacer:**
- `stats` avec vos métriques (API)
- `recentActivities` avec vos activités
- `topProducts` avec vos top items
- Ajouter bibliothèque de charts (Recharts, Chart.js)
- Quick actions selon vos besoins

**Recommandé pour:** Dashboards admin, analytics, monitoring KPI

---

### 5. settings-page.tsx
**Page paramètres avec navigation par tabs**

**Features:**
- Navigation par tabs (Profile, Preferences, Security, Appearance)
- Formulaires de configuration
- Sections multiples
- Sauvegarde par section
- Validation Zod
- Avatar upload
- Switches et selects

**Utilisation:**
```bash
cp templates/pages/settings-page.tsx app/(frame)/settings/page.tsx
```

**À remplacer:**
- Schémas Zod selon vos paramètres
- Default values avec données utilisateur
- Handlers de soumission (API calls)
- Ajouter/supprimer tabs selon besoins

**Recommandé pour:** User settings, app configuration, preferences

---

### 6. auth-login.tsx
**Page de connexion utilisateur**

**Features:**
- Formulaire login avec validation
- Remember me checkbox
- Forgot password link
- Social login options (GitHub, Google)
- Error handling
- Loading states
- Centered layout

**Utilisation:**
```bash
cp templates/pages/auth-login.tsx app/auth/login/page.tsx
```

**À remplacer:**
- `onSubmit` avec votre logique d'authentification
- `handleSocialLogin` avec OAuth flow
- Brand/logo personnalisé
- Links vers register, forgot-password
- Error messages selon votre API

**Note:** Cette page N'utilise PAS DashboardLayout (layout auth minimal)

**Recommandé pour:** Authentication, login flow

---

## 🧩 Component Patterns

### 1. crud-dialog.tsx
**Dialog réutilisable pour Create/Edit**

**Features:**
- Mode Create/Edit automatique
- Formulaire avec validation
- Generic TypeScript (réutilisable)
- Save/Cancel actions
- Loading states
- Reset automatique
- Intégration react-hook-form

**Utilisation:**
```tsx
import { CRUDDialog } from '@/templates/components/crud-dialog'

<CRUDDialog
  open={dialogOpen}
  onOpenChange={setDialogOpen}
  item={selectedItem} // null pour création
  schema={userSchema}
  defaultValues={{ name: '', email: '', status: 'active' }}
  onSubmit={async (values, isEditing) => {
    if (isEditing) {
      await updateUser(selectedItem.id, values)
    } else {
      await createUser(values)
    }
  }}
  renderFields={(form) => (
    <>
      <FormField name="name" control={form.control} ... />
      <FormField name="email" control={form.control} ... />
    </>
  )}
/>
```

**Avantages:**
- Réutilisable pour n'importe quelle entité
- Type-safe avec TypeScript generics
- Gère automatiquement Create vs Edit
- Reset automatique du formulaire

---

### 2. stats-card.tsx
**Card réutilisable pour afficher des métriques**

**Features:**
- Affichage métrique avec valeur
- Indicateur de tendance (up/down/neutral)
- Icônes personnalisables (Lucide)
- Description/sous-titre
- Skeleton loading state
- Variants de style (default, bordered, elevated)
- Action optionnelle (voir détails)
- Formatters (currency, compact number, percent)

**Utilisation:**
```tsx
import { StatsCard } from '@/templates/components/stats-card'
import { DollarSign } from 'lucide-react'

<StatsCard
  title="Revenus Totaux"
  value="€45,231"
  change="+20.1%"
  trend="up"
  description="vs mois dernier"
  icon={DollarSign}
  variant="elevated"
/>
```

**Variants:**
- `StatsCard` - Version standard
- `StatsCardCompact` - Version compacte (layouts serrés)
- `StatsCardWithBadge` - Avec badge "Nouveau", "Trending", etc.

**Formatters inclus:**
- `currencyFormatter(value, 'EUR')` - Format monnaie
- `compactNumberFormatter(value)` - 1K, 1.5M, 2B
- `percentFormatter(value)` - 3.24%

---

### 3. bulk-actions-bar.tsx
**Barre d'actions pour opérations multiples**

**Features:**
- Affiche compteur d'items sélectionnés
- Actions multiples configurables
- Animation d'apparition/disparition
- Position sticky, fixed ou relative
- Confirmation actions destructives
- Generic TypeScript
- Hook `useBulkSelection` pour React Table

**Utilisation:**
```tsx
import { BulkActionsBar } from '@/templates/components/bulk-actions-bar'
import { Check, Trash2, Mail } from 'lucide-react'

<BulkActionsBar
  selectedCount={selectedRows.length}
  selectedItems={selectedRows}
  onClearSelection={() => table.resetRowSelection()}
  actions={[
    {
      label: 'Activer',
      icon: Check,
      variant: 'default',
      onClick: (items) => activateItems(items),
    },
    {
      label: 'Supprimer',
      icon: Trash2,
      variant: 'destructive',
      requireConfirmation: true,
      confirmationMessage: 'Supprimer définitivement ?',
      onClick: (items) => deleteItems(items),
    },
  ]}
/>
```

**Variants:**
- `BulkActionsBar` - Version standard (top sticky)
- `BulkActionsBarCompact` - Version mobile (bottom fixed)

**Hook inclus:**
```tsx
const { selectedCount, selectedItems, clearSelection } = useBulkSelection(table)
```

---

### 4. filters-panel.tsx
**Panel de filtres réutilisable**

**Features:**
- Multiples types de filtres:
  - `select` - Select simple
  - `multiselect` - Checkboxes multiples
  - `checkbox` - Boolean
  - `text` - Input texte
  - `number` - Input nombre
  - `numberrange` - Min/Max
  - `date` - Date picker
  - `daterange` - De/À
- Filtres actifs avec badges
- Reset filters
- Collapsible sections
- Responsive (drawer mobile)
- State management

**Utilisation:**
```tsx
import { FiltersPanel, type FilterDefinition } from '@/templates/components/filters-panel'

const filters: FilterDefinition[] = [
  {
    id: 'status',
    label: 'Statut',
    type: 'select',
    options: [
      { value: 'active', label: 'Actif' },
      { value: 'inactive', label: 'Inactif' },
    ],
    section: 'Général',
  },
  {
    id: 'priceRange',
    label: 'Prix',
    type: 'numberrange',
    section: 'Prix',
  },
]

<FiltersPanel
  filters={filters}
  values={filterValues}
  onChange={(id, value) => setFilterValues({ ...filterValues, [id]: value })}
  onReset={() => setFilterValues({})}
  mode="sidebar" // ou "drawer" pour mobile
/>
```

**Modes:**
- `sidebar` - Panel latéral (desktop)
- `drawer` - Sheet drawer (mobile)

---

## 🚀 Utilisation

### Méthode 1: Copier/Coller

```bash
# Copier un template de page
cp templates/pages/simple-list.tsx app/(frame)/products/page.tsx

# Copier un pattern de composant
cp templates/components/stats-card.tsx components/ui/stats-card.tsx
```

### Méthode 2: Référencer directement

```tsx
// Importer depuis templates
import { StatsCard } from '@/templates/components/stats-card'
import { CRUDDialog } from '@/templates/components/crud-dialog'

// Utiliser dans votre page
export default function MyPage() {
  return (
    <>
      <StatsCard title="Metric" value="123" />
      <CRUDDialog ... />
    </>
  )
}
```

### Méthode 3: Adapter à vos besoins

1. Copier le template
2. Remplacer les types et données (voir TODOs dans le code)
3. Adapter le styling si nécessaire
4. Ajouter vos API calls
5. Tester et itérer

---

## 🤖 Avec l'Agent LLM

Vous pouvez utiliser les skills Blazz UI avec Claude Code:

### Générer une page basée sur un template

```bash
/blazz-new-page
"Créer une page de gestion des produits en me basant sur le template data-table-page"
```

L'agent:
1. Lit le template data-table-page.tsx
2. Comprend la structure
3. L'adapte à votre entité "Product"
4. Crée les types TypeScript appropriés
5. Configure les colonnes DataTable
6. Ajoute les filtres pertinents
7. Génère le code prêt à l'emploi

### Générer un CRUD complet

```bash
/blazz-crud-page
"Créer un CRUD pour l'entité User avec les champs: name, email, role, status"
```

L'agent:
1. Utilise le template data-table-page.tsx
2. Crée les types TypeScript
3. Génère le schéma Zod
4. Configure les colonnes
5. Ajoute le dialog CRUD
6. Configure les filtres et bulk actions

### Utiliser un pattern

```bash
"Ajoute un StatsCard pour afficher les revenus avec tendance"
```

L'agent:
1. Lit le pattern stats-card.tsx
2. Comprend l'API
3. Intègre dans votre page
4. Adapte aux métriques demandées

---

## 📚 Best Practices

### Pages

1. **Toujours utiliser un layout** (DashboardLayout, Frame, etc.)
2. **Validation Zod** pour tous les formulaires
3. **Loading states** pour les actions asynchrones
4. **Error handling** avec messages clairs
5. **Confirmation** pour actions destructives
6. **Responsive** (mobile-first)
7. **Accessibility** (ARIA, keyboard navigation)

### Components

1. **Type-safe** avec TypeScript
2. **Réutilisable** via generics si possible
3. **Composable** (petits composants assemblables)
4. **Props interface** bien documentée
5. **Variants** via CVA
6. **Data attributes** pour styling hooks
7. **Forwarded refs** pour composants UI

### Styling

1. **Tailwind CSS** classes
2. **CSS variables** pour couleurs
3. **cn()** utility pour className merging
4. **Dark mode** support automatique
5. **Responsive** breakpoints
6. **Animations** subtiles (animate-in, etc.)

### Performance

1. **Lazy loading** pour composants lourds
2. **useMemo** pour calculs coûteux
3. **useCallback** pour handlers
4. **React.memo** si nécessaire
5. **Pagination** pour grandes listes
6. **Debounce** pour recherches

---

## 🔧 Personnalisation

### Modifier un template

1. Copier le template
2. Rechercher tous les `TODO` comments
3. Remplacer par vos données/types
4. Adapter le styling au besoin
5. Tester

### Créer votre propre template

1. Partir d'un template existant similaire
2. Garder la structure (imports, layout, etc.)
3. Ajouter vos TODOs pour les parties à adapter
4. Documenter les features en commentaire
5. Ajouter dans ce README

### Contribuer

Si vous créez un nouveau template utile:

1. Ajouter dans `/templates/pages/` ou `/templates/components/`
2. Documenter dans ce README
3. Ajouter des TODOs dans le code
4. Inclure un exemple d'utilisation

---

## 📖 Ressources

- [Guide Architecture](../docs/ARCHITECTURE.md) - Structure et patterns du projet
- [Guide LLM](../docs/LLM_GUIDE.md) - Utiliser avec Claude Code
- [Guide Composants](../docs/COMPONENTS.md) - Index de tous les composants UI
- [Skills Blazz UI](../.claude/skills/) - Skills disponibles pour l'agent

---

**Version**: 1.0
**Dernière mise à jour**: 2026-01-19
**Phase**: Phase 4 - Templates & Patterns ✅ COMPLÉTÉE
