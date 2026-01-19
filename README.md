# Blazz UI App

[![Next.js](https://img.shields.io/badge/Next.js-16.1-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> Le premier boilerplate React conçu spécifiquement pour le développement assisté par IA, avec une bibliothèque de 45+ composants enterprise-grade et une intégration LLM optimale.

## 🎯 Qu'est-ce que Blazz UI?

**Blazz UI App** est un boilerplate Next.js production-ready qui vous permet de démarrer instantanément vos projets web modernes avec:

- **45+ composants UI** prêts à l'emploi (boutons, formulaires, dialogs, tables de données, etc.)
- **12+ composants layout** (sidebar, navbar, frames, dashboards)
- **Architecture LLM-friendly** optimisée pour Claude Code et autres assistants IA
- **Design system moderne** avec OKLCh color space et dark mode
- **TypeScript strict** pour une type-safety maximale
- **Stack dernière génération** (Next.js 16, React 19, Tailwind CSS 4)

### Pourquoi Blazz UI?

**Pour les équipes qui développent avec l'IA:**
- Architecture facilement compréhensible par les LLMs
- Documentation exhaustive pour chaque composant
- Patterns cohérents et prévisibles
- Agents et skills préconfigurés pour génération de code intelligente

**Pour le développement rapide:**
- Démarrage projet en moins d'une journée
- Composants testés et accessibles (WCAG 2.1 AA)
- DataTable enterprise-grade avec filtering, sorting, pagination
- Command Palette (⌘K) intégré
- Storybook pour visualisation des composants

**Pour la qualité production:**
- TypeScript strict mode
- Biome pour linting/formatting
- React Hook Form + Zod validation
- Performance optimisée (Turbopack, lazy loading)
- Tests configurés (Vitest)

## 🚀 Quick Start

Démarrez un nouveau projet en moins de 5 minutes:

### 1. Cloner et Installer

```bash
# Cloner le repository
git clone https://github.com/votre-org/blazz-ui-app.git mon-projet
cd mon-projet

# Installer les dépendances
npm install
```

### 2. Configurer l'Environnement

```bash
# Copier le template des variables d'environnement
cp .env.example .env.local

# Éditer avec vos valeurs
nano .env.local
```

### 3. Lancer le Serveur de Développement

```bash
npm run dev
```

Ouvrez [http://localhost:3100](http://localhost:3100) dans votre navigateur.

### 4. (Optionnel) Lancer Storybook

```bash
npm run storybook
```

Visualisez tous les composants sur [http://localhost:6006](http://localhost:6006).

**C'est tout!** Vous pouvez maintenant commencer à développer votre application.

## 📚 Documentation

- **[Guide Architecture](docs/ARCHITECTURE.md)** - Comprendre la structure et les patterns du projet
- **[Guide LLM](docs/LLM_GUIDE.md)** - Utiliser Claude Code et les agents IA avec ce projet
- **[Guide Migration](docs/MIGRATION_GUIDE.md)** - Migrer depuis shadcn/ui, Material UI, ou Chakra UI
- **[Guide Contribution](docs/CONTRIBUTING.md)** - Comment contribuer au projet
- **[Composants](docs/COMPONENTS.md)** - Documentation de tous les composants UI

## 🎨 Stack Technique

### Framework & Bibliothèques

| Technologie | Version | Usage |
|-------------|---------|-------|
| **Next.js** | 16.1.1 | Framework React avec App Router |
| **React** | 19.2.3 | Bibliothèque UI |
| **TypeScript** | 5.x | Type safety |
| **Tailwind CSS** | 4.0 | Styling utility-first |
| **Base UI** | 1.0 | Composants headless primitifs |
| **TanStack Table** | 8.21 | DataTable avancé |

### Tooling

| Outil | Usage |
|-------|-------|
| **Turbopack** | Build ultra-rapide en développement |
| **Biome** | Linting & Formatting (remplace ESLint + Prettier) |
| **Vitest** | Tests unitaires |
| **Storybook** | Documentation visuelle composants |
| **CVA** | Gestion des variants de composants |

### Formulaires & Validation

| Bibliothèque | Usage |
|--------------|-------|
| **React Hook Form** | Gestion d'état des formulaires |
| **Zod** | Validation de schémas TypeScript-first |

### Design System

- **Color Space**: OKLCh (perceptuellement uniforme, meilleur que RGB/HSL)
- **Dark Mode**: Class-based avec support complet
- **CSS Variables**: Tokens personnalisables
- **Icons**: Lucide React (1000+ icônes)
- **Font**: Inter (Google Fonts)

## 📁 Structure du Projet

```
/blazz-ui-app
├── app/                          # Next.js App Router
│   ├── (frame)/                  # Route group avec layout
│   ├── auth/                     # Pages d'authentification
│   ├── globals.css               # Design tokens & CSS variables
│   ├── layout.tsx                # Layout racine
│   └── page.tsx                  # Page d'accueil
├── components/
│   ├── ui/                       # 45+ composants UI primitifs
│   │   ├── button/               # Exemple: Button component
│   │   ├── card/
│   │   ├── dialog/
│   │   └── ...                   # Et 42 autres composants
│   ├── features/                 # Composants métier
│   │   ├── data-table/           # DataTable enterprise-grade
│   │   ├── command-palette/      # Command (⌘K)
│   │   └── image-upload/         # Upload d'images
│   └── layout/                   # 12+ composants layout
│       ├── dashboard-layout/     # Layout principal dashboard
│       ├── navbar/
│       ├── sidebar/
│       └── ...
├── config/
│   ├── app.config.ts             # Configuration centralisée
│   └── navigation.ts             # Configuration navigation
├── docs/                         # Documentation projet
├── hooks/                        # Custom React hooks
├── lib/                          # Utilitaires & helpers
│   ├── utils.ts                  # cn() - class merger
│   └── utils/                    # Autres utilitaires
├── types/                        # Types TypeScript
├── templates/                    # Templates réutilisables
│   ├── pages/                    # Templates de pages
│   └── components/               # Patterns de composants
├── stories/                      # Storybook stories
└── public/                       # Assets statiques
```

## 🧩 Composants Disponibles

### Composants UI de Base (45+)

**Formulaires:**
- `Button`, `Input`, `Label`, `Field`, `Form`
- `Textarea`, `Checkbox`, `Switch`
- `Select`, `Combobox`, `Tags-Input`

**Conteneurs:**
- `Card`, `Alert`, `Box`, `Separator`
- `Dialog`, `Popover`, `Sheet`, `Tooltip`
- `Tabs`, `Collapsible`, `Scroll-Area`

**Navigation:**
- `Dropdown-Menu`, `Menu`, `Command`
- `Breadcrumb`, `Badge`, `Avatar`

**Affichage de Données:**
- `Table`, `DataTable` (enterprise-grade)
- `Skeleton` (loading placeholders)

**Tous les composants** supportent:
- ✅ Dark mode
- ✅ Accessibilité (ARIA)
- ✅ TypeScript strict
- ✅ Variants via CVA
- ✅ Customisation facile

### Composants Layout (12+)

- `DashboardLayout` - Layout principal avec sidebar
- `AppFrame`, `Frame` - Conteneurs applicatifs
- `Navbar`, `AppTopBar` - Navigation top
- `AppSidebar` - Sidebar avec navigation
- `Page` - Composant page Shopify-style
- `PageHeader` - En-tête de page
- Et plus...

### Composants Features

**DataTable** - Table de données avancée:
- Tri multi-colonnes
- Filtrage avancé (AND/OR logic)
- Pagination configurable
- Sélection de lignes & actions bulk
- Recherche globale
- Vues sauvegardées (localStorage)
- 3 variants visuels (default, lined, striped)
- 3 densités (compact, default, comfortable)

**Command Palette** - Interface de commandes ⌘K

**Image Upload** - Upload d'images avec dropzone

## 🎨 Personnalisation

### Changer les Couleurs

Éditez `/app/globals.css` pour personnaliser les couleurs:

```css
:root {
  --background: oklch(1 0 0);           /* Blanc */
  --foreground: oklch(0.145 0 0);       /* Noir */
  --primary: oklch(0.205 0 0);          /* Couleur primaire */
  --destructive: oklch(0.58 0.22 27);   /* Rouge */
  /* ... autres couleurs */
}

.dark {
  --background: oklch(0.145 0 0);       /* Noir */
  --foreground: oklch(0.985 0 0);       /* Blanc */
  /* ... couleurs dark mode */
}
```

Le système utilise l'espace colorimétrique **OKLCh** pour des couleurs perceptuellement uniformes.

### Configurer la Navigation

Éditez `/config/navigation.ts`:

```typescript
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
        // Ajouter vos items...
      ]
    }
  ]
}
```

### Ajouter un Nouveau Composant

1. Créer le fichier dans `/components/ui/[nom]/`
2. Utiliser les patterns du projet (forwardRef, CVA, data-slots)
3. Ajouter la documentation `README.md`
4. Créer une story Storybook
5. Exporter depuis `/components/ui/index.ts`

Voir le [Guide Architecture](docs/ARCHITECTURE.md) pour plus de détails.

## 📦 Commandes NPM

```bash
# Développement
npm run dev              # Démarrer dev server (port 3100)
npm run dev:turbo        # Dev avec Turbopack (plus rapide)

# Build & Production
npm run build            # Build production
npm run start            # Démarrer serveur production

# Qualité du Code
npm run lint             # Linter avec Biome
npm run lint:fix         # Fix automatique
npm run format           # Formater le code

# Tests
npm run test             # Lancer tests Vitest
npm run test:ui          # Tests avec UI
npm run test:coverage    # Rapport de couverture

# Storybook
npm run storybook        # Lancer Storybook (port 6006)
npm run build-storybook  # Build Storybook statique
```

## 🤖 Développement avec Claude Code

Blazz UI est optimisé pour le développement assisté par IA. Voir le [Guide LLM](docs/LLM_GUIDE.md) pour:

- **Agents spécialisés** configurés pour ce projet
- **Skills custom** pour générer pages et composants
- **Patterns de prompts** efficaces
- **Exemples de commandes** pour génération de code

### Skills Disponibles

```bash
/blazz-new-page          # Créer une nouvelle page
/blazz-new-component     # Générer un composant UI
/blazz-crud-page         # Générer page CRUD complète
```

## 🎯 Use Cases & Types de Projets

Blazz UI est parfait pour:

### ✅ Dashboards Admin
Interfaces d'administration avec tables de données complexes, formulaires, analytics, gestion utilisateurs.

### ✅ Applications SaaS
Produits B2B/B2C avec authentification, paramètres, tableaux de bord, facturation.

### ✅ Outils Internes
Back-office, CRM, systèmes de gestion, outils d'équipe, portails employés.

### ✅ MVP & Prototypes
Validation rapide d'idées avec un time-to-market court et une qualité professionnelle.

## 🔄 Comparaison avec Alternatives

| Caractéristique | Blazz UI | shadcn/ui | Material UI | Chakra UI |
|-----------------|----------|-----------|-------------|-----------|
| **Optimisé LLM** | ✅ | ❌ | ❌ | ❌ |
| **Next.js 16** | ✅ | ✅ | ❌ | ❌ |
| **React 19** | ✅ | ✅ | ❌ | ❌ |
| **TypeScript Strict** | ✅ | ✅ | ✅ | ✅ |
| **DataTable Avancé** | ✅ | ❌ | ✅ | ❌ |
| **OKLCh Colors** | ✅ | ❌ | ❌ | ❌ |
| **Agents IA** | ✅ | ❌ | ❌ | ❌ |
| **Layouts Prêts** | ✅ | ❌ | ❌ | ❌ |
| **Templates** | ✅ | ❌ | ❌ | ❌ |

**Différenciateur clé:** Blazz UI est le seul boilerplate conçu spécifiquement pour le développement assisté par IA, avec des agents spécialisés et une documentation structurée pour une génération de code intelligente.

## 🛠️ Configuration Avancée

### Variables d'Environnement

Copiez `.env.example` vers `.env.local` et configurez:

```bash
# Application
NEXT_PUBLIC_APP_NAME="Mon App"
NEXT_PUBLIC_APP_URL="http://localhost:3100"

# API
NEXT_PUBLIC_API_URL="https://api.example.com"
API_SECRET_KEY="votre-secret"

# Features
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_I18N=false
```

### Configuration Centralisée

Éditez `/config/app.config.ts` pour personnaliser:

```typescript
export const appConfig = {
  name: 'Mon Application',
  description: 'Description de mon app',
  version: '1.0.0',

  sidebar: {
    navigation: [...],
    footer: {...}
  },

  theme: {
    defaultMode: 'light', // 'light' | 'dark' | 'system'
  },

  features: {
    commandPalette: true,
    analytics: false,
    i18n: false
  }
}
```

## 🧪 Tests

```bash
# Lancer tous les tests
npm run test

# Mode watch
npm run test:watch

# Couverture
npm run test:coverage

# UI de test
npm run test:ui
```

Configuration Vitest dans `/vitest.config.ts` avec support:
- React Testing Library
- jsdom environment
- Path aliases (@/)
- Coverage reports

## 📖 Ressources

- **Documentation**: [docs/](docs/)
- **Storybook**: `npm run storybook` → http://localhost:6006
- **Next.js Docs**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Base UI**: https://base-ui.com
- **TanStack Table**: https://tanstack.com/table

## 🤝 Contribution

Les contributions sont les bienvenues! Voir [CONTRIBUTING.md](docs/CONTRIBUTING.md) pour les guidelines.

### Workflow de Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/ma-fonctionnalite`)
3. Commit vos changements (`git commit -m 'Ajout de ma fonctionnalité'`)
4. Push vers la branche (`git push origin feature/ma-fonctionnalite`)
5. Ouvrir une Pull Request

## 📄 License

Ce projet est sous licence MIT. Voir [LICENSE](LICENSE) pour plus d'informations.

## 🙏 Remerciements

- [Next.js](https://nextjs.org/) - Le framework React
- [Tailwind CSS](https://tailwindcss.com/) - Le framework CSS
- [Base UI](https://base-ui.com) - Composants headless primitifs
- [shadcn/ui](https://ui.shadcn.com/) - Inspiration pour les composants
- [TanStack](https://tanstack.com/) - React Table
- [Lucide](https://lucide.dev/) - Icônes

## 🗺️ Roadmap

### Version 1.1 (Q2 2026)
- [ ] Tests unitaires complets (coverage > 80%)
- [ ] Documentation vidéo/tutoriels
- [ ] Community showcase
- [ ] Performance optimizations

### Version 2.0 (Q3 2026)
- [ ] Système de thèmes multiples
- [ ] Theme builder UI
- [ ] Preset themes library
- [ ] Color palette generator

### Version 2.1 (Q4 2026)
- [ ] Internationalisation (i18n)
- [ ] Analytics provider abstraction
- [ ] Auth provider flexible
- [ ] RBAC/Permissions system

---

**Construit avec ❤️ pour les équipes qui développent avec l'IA**

⭐ N'oubliez pas de star ce projet si vous le trouvez utile!
