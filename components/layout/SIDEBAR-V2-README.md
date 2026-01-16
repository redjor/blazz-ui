# AppSidebar V2 - Documentation Complète

Composant de sidebar ultra-complet inspiré de ShadCN UI avec toutes les fonctionnalités modernes.

## 🎯 Fonctionnalités

### ✅ Fonctionnalités Principales
- **Recherche intégrée** - Filtrage en temps réel des items de navigation
- **Navigation multi-niveaux** - Support récursif pour sous-menus infinis
- **Sections collapsibles** - Groupes de navigation pliables
- **Variants de badges** - 4 variants : default, destructive, outline, secondary
- **Menu profil utilisateur** - Dropdown avec avatar dans le footer
- **Support des logos** - Header personnalisable
- **État actif** - Highlight automatique basé sur le pathname
- **Support d'icônes** - Icônes Lucide React
- **Responsive** - Mobile-first avec mode collapsed
- **Raccourcis clavier** - Cmd/Ctrl + B pour toggle

### 🎨 Design
- Inspiré de Shopify Polaris
- Utilise les primitives shadcn/ui
- Supporte les thèmes (light/dark)
- Animations fluides avec Tailwind

## 📦 Installation

Les fichiers suivants ont été créés :

```
components/
├── layout/
│   ├── app-sidebar-v2.tsx          # Composant principal
│   ├── sidebar-search.tsx          # Composant de recherche
│   ├── sidebar-user.tsx            # Menu utilisateur
│   ├── sidebar-exports.tsx         # Exports centralisés
│   └── app-sidebar-v2.stories.tsx  # Stories Storybook
├── ui/
│   └── sidebar.tsx                 # Primitives shadcn (existant)
types/
└── navigation.ts                    # Types TypeScript
config/
└── navigation.ts                    # Configuration enrichie
```

## 🚀 Utilisation Basique

### 1. Importer le composant

```tsx
import { AppSidebarV2 } from '@/components/layout/app-sidebar-v2'
import { sidebarConfig } from '@/config/navigation'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
```

### 2. Utiliser dans votre layout

```tsx
export default function Layout({ children }) {
  return (
    <SidebarProvider>
      <AppSidebarV2 config={sidebarConfig} />
      <SidebarInset>
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
```

## ⚙️ Configuration

### Structure de Configuration

```typescript
import type { SidebarConfig } from '@/types/navigation'

const config: SidebarConfig = {
  // Recherche
  searchEnabled: true,
  searchPlaceholder: 'Search menu...',

  // Logo (optionnel)
  logo: {
    src: '/logo.svg',
    alt: 'Company Logo',
    href: '/',
  },

  // Utilisateur (optionnel)
  user: {
    name: 'John Doe',
    email: 'john@example.com',
    avatar: '/avatars/01.png',
    role: 'Admin',
  },

  // Navigation
  navigation: [
    // ... sections
  ],
}
```

### Items de Navigation

#### Item Simple

```typescript
{
  id: 'dashboard',
  title: 'Dashboard',
  url: '/dashboard',
  icon: Home,
}
```

#### Item avec Badge

```typescript
{
  id: 'inbox',
  title: 'Inbox',
  url: '/inbox',
  icon: Inbox,
  badge: 12,
  badgeVariant: 'destructive', // default | destructive | outline | secondary
}
```

#### Item avec Sous-menus

```typescript
{
  id: 'products',
  title: 'Products',
  url: '/products',
  icon: Package,
  badge: 142,
  items: [
    { title: 'All Products', url: '/products', icon: Package },
    { title: 'Categories', url: '/products/categories', icon: Tag },
    {
      title: 'Inventory',
      url: '/products/inventory',
      icon: Archive,
      badge: 5,
      badgeVariant: 'destructive'
    },
  ],
}
```

### Sections

#### Section Standard

```typescript
{
  id: 'main',
  title: 'Main Navigation',
  items: [
    // ... items
  ],
}
```

#### Section Collapsible

```typescript
{
  id: 'analytics',
  title: 'Analytics & Reports',
  collapsible: true,        // Active la collapse
  defaultOpen: true,        // Ouverte par défaut
  items: [
    // ... items
  ],
}
```

## 🎨 Variants de Badges

Le composant supporte 4 variants de badges :

### Default (bleu clair)
```typescript
badge: 12
// ou explicitement
badgeVariant: 'default'
```

### Destructive (rouge)
```typescript
badge: 5,
badgeVariant: 'destructive'
```

### Secondary (gris)
```typescript
badge: 8,
badgeVariant: 'secondary'
```

### Outline (bordure)
```typescript
badge: 3,
badgeVariant: 'outline'
```

## 🔍 Recherche

La recherche filtre automatiquement les items de navigation :
- Recherche dans les titres
- Préserve la hiérarchie (parents visibles si enfants match)
- Temps réel

Pour désactiver :
```typescript
const config: SidebarConfig = {
  searchEnabled: false,
  // ...
}
```

## 👤 Menu Utilisateur

Menu dropdown dans le footer avec :
- Avatar avec fallback (initiales)
- Nom et email
- Actions : Profile, Settings, Logout

Pour désactiver :
```typescript
const config: SidebarConfig = {
  user: undefined,
  // ...
}
```

## 📱 Responsive

Le composant est entièrement responsive :
- **Desktop** : Sidebar fixe avec collapse icon mode
- **Tablet** : Mode collapsed par défaut
- **Mobile** : Offcanvas overlay

## ⌨️ Raccourcis Clavier

- `Cmd/Ctrl + B` : Toggle sidebar

## 🎭 États

### État Actif
L'état actif est calculé automatiquement basé sur `usePathname()` :
- Match exact pour la home (`/`)
- Match par préfixe pour les autres routes
- Highlight des parents si enfant actif

### État Disabled
```typescript
{
  title: 'Coming Soon',
  url: '/coming-soon',
  disabled: true,
}
```

## 🧩 Composition

Le composant utilise les primitives shadcn/ui :
- `Sidebar` - Container principal
- `SidebarHeader` - Zone header
- `SidebarContent` - Zone contenu scrollable
- `SidebarFooter` - Zone footer
- `SidebarMenu` - Liste de navigation
- `SidebarMenuItem` - Item de menu
- `SidebarMenuButton` - Bouton d'item

## 📚 Exemples

### Configuration Minimale

```typescript
const minimalConfig: SidebarConfig = {
  navigation: [
    {
      items: [
        { title: 'Dashboard', url: '/' },
        { title: 'Settings', url: '/settings' },
      ],
    },
  ],
}
```

### Configuration Complète

Voir `/config/navigation.ts` pour un exemple complet avec :
- 4 sections
- Navigation multi-niveaux
- Tous les variants de badges
- Recherche activée
- Profil utilisateur
- Logo

## 🔄 Migration depuis AppSidebar V1

### Différences principales

| V1 | V2 |
|----|-----|
| `navigation: NavigationSection[]` | `config: SidebarConfig` |
| Pas de recherche | Recherche intégrée |
| Un seul variant de badge | 4 variants |
| Pas de profil utilisateur | Menu utilisateur complet |
| Sections non-collapsibles | Sections collapsibles |

### Guide de migration

1. **Installer les nouveaux fichiers** (déjà fait)

2. **Mettre à jour vos imports** :
```tsx
// Avant
import { AppSidebar } from '@/components/layout/app-sidebar'

// Après
import { AppSidebarV2 } from '@/components/layout/app-sidebar-v2'
```

3. **Adapter votre config** :
```tsx
// Avant
<AppSidebar navigation={navigationConfig} />

// Après
<AppSidebarV2 config={sidebarConfig} />
```

4. **Backward compatibility** :
L'export `navigationConfig` est toujours disponible dans `/config/navigation.ts`

## 🐛 Troubleshooting

### La recherche ne fonctionne pas
- Vérifiez que `searchEnabled: true` dans votre config
- Le filtre est case-insensitive et match les titres

### Les badges n'apparaissent pas
- Assurez-vous que `badge` est défini (string ou number)
- Les badges avec valeur 0 s'affichent

### Le menu utilisateur ne s'affiche pas
- Vérifiez que `user` est défini dans votre config
- Avatar optionnel (fallback sur initiales)

### L'état actif ne fonctionne pas
- Vérifiez que vous êtes dans un Client Component
- Le composant utilise `usePathname()` de Next.js

## 🎯 Best Practices

1. **Grouper logiquement** - Utilisez des sections pour regrouper les items liés
2. **Badges informatifs** - Utilisez les variants pour signaler l'importance
3. **Icônes cohérentes** - Utilisez Lucide React pour la cohérence
4. **Hiérarchie claire** - Maximum 2 niveaux de profondeur recommandé
5. **Performance** - La config est client-side, évitez les calculs lourds

## 📄 License

MIT

## 🤝 Contribution

Pour contribuer, modifiez les fichiers dans `/components/layout/` et testez avec Storybook.
