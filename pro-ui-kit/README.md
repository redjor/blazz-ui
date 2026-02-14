# Pro UI Kit

> Le kit de composants React/Next.js pour les applications professionnelles data-heavy,
> conçu pour que l'IA génère des interfaces complexes correctement du premier coup.

## Le problème

Les starters et kits UI existants (shadcn/ui, Tailwind UI, etc.) sont conçus pour des SaaS grand public : landing pages, dashboards simples, formulaires basiques.

Quand vous construisez une **app métier** — gestion de dossiers, back-office, outil interne, ERP — l'IA génère du code médiocre :
- Tables sans pagination serveur
- Formulaires sans validation correcte
- Pas d'empty states, pas de loading states
- Aucune gestion des permissions
- Architecture spaghetti

Vous passez plus de temps à corriger qu'à construire.

## La solution

Pro UI Kit est un ensemble de composants et de **patterns documentés** pour que votre IA (Claude Code, Cursor, Copilot) comprenne exactement comment assembler des interfaces pro.

### Ce qui est inclus

**Composants (40+)**
- DataGrid — Table avancée : pagination serveur, tri, sélection, actions batch, export
- FilterBar — Filtres combinés persistés dans l'URL
- DetailPanel — Vue détail avec sections, FieldGrid, historique
- MultiStepForm — Formulaires multi-étapes avec sauvegarde brouillon
- StatusFlow — Workflows de statuts avec transitions et permissions
- SplitView — Master/detail avec panneau redimensionnable
- CommandPalette — Recherche globale Cmd+K
- ActivityTimeline — Audit log / historique d'événements
- ImportWizard — Import CSV/Excel avec mapping et validation
- + tous les primitives (Button, Input, Badge, Dialog, Toast, etc.)

**Patterns de pages complètes (8+)**
- Resource List — Liste paginée avec filtres, tri, actions batch, export
- Resource Detail — Vue détail avec onglets, historique, actions
- Resource Create/Edit — Formulaires avec validation zod client+serveur
- Dashboard opérationnel — KPIs, graphiques, activité récente
- Import de données — Upload, mapping, validation, import en masse
- Search avancée — Recherche multicritère avec résultats groupés
- Settings/Admin — Configuration avec sections et permissions
- Workflow validation — Circuit de validation multi-rôles

**Fichiers AI**
- SKILL.md — Instructions pour Claude Code / Cursor
- components.md — Catalogue des composants avec exemples d'usage
- rules.md — Conventions obligatoires (15 règles claires)
- patterns/*.md — Patterns complets avec code copier-coller

### Stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui (base)
- react-hook-form + zod
- TanStack Table (pour DataGrid)
- Recharts (pour les graphiques)
- Lucide Icons

## Quickstart

```bash
# 1. Cloner dans votre projet
npx degit proui/pro-ui-kit/src/components ./src/components
npx degit proui/pro-ui-kit/ai ./ai

# 2. Donner le skill à votre IA
# Dans Claude Code : /read ai/SKILL.md
# Dans Cursor : ajouter ai/ aux rules

# 3. Demander une page
# "Crée-moi une page de liste de clients avec filtres, tri et export"
# L'IA lit le pattern, utilise les bons composants, génère du code pro.
```

## Arborescence

```
ai/
  SKILL.md                     ← Point d'entrée IA
  components.md                ← Catalogue composants
  rules.md                     ← Conventions obligatoires
  patterns/
    resource-list.md           ← Pattern liste paginée
    resource-detail.md         ← Pattern vue détail
    resource-create-edit.md    ← Pattern formulaire CRUD
    dashboard.md               ← Pattern dashboard KPI
    resource-import.md         ← Pattern import données
    search-advanced.md
    settings-admin.md
    workflow-validation.md
src/
  components/
    ui/                        ← Primitives (shadcn/ui étendu)
    blocks/                    ← Composants métier
    layouts/                   ← Layouts de page
  hooks/
  lib/
    actions/                   ← Server Actions
    schemas/                   ← Schemas Zod
scripts/
  build-registry.ts            ← Génère ai/registry.json depuis les __meta
```

## Licence

Usage commercial autorisé. Voir LICENSE.
