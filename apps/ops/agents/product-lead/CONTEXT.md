# Blazz UI — Contexte Produit

## Vision

**Enterprise UI, Ready to Ship.**

Blazz UI est un kit de composants React/Next.js conçu pour les applications enterprise et data-heavy.
Pas du SaaS marketing avec des gros boutons et du vide — de l'interface pro, dense, productive.

Le problème qu'on résout : les Lead Techs et équipes produit qui construisent des apps internes
(CRM, ERP, dashboards, outils de gestion) n'ont pas de bon kit UI. Soit c'est Ant Design (lourd,
moche, pas moderne), soit c'est shadcn (joli mais zéro composants métier), soit ils paient
Salesforce/SAP. Blazz UI c'est l'alternative : des composants enterprise-grade, beaux, denses,
prêts à l'emploi.

## Ce qui nous différencie

**1. Densité enterprise** — Pas du SaaS aéré. Des interfaces pour des gens qui passent 8h/jour
dans l'app. Font 13px dans les tables, row-height 40px, inputs 32px. Beaucoup d'infos visibles
sans scroller. Références : Linear, Vercel Dashboard, Airtable, Bloomberg Terminal.

**2. Composants métier prêts à l'emploi** — Pas juste des Button/Input. Des DataTable avancées,
KanbanBoard, StatsGrid, Page layouts, ActivityTimeline, SplitView, Charts. Le dev pose le composant,
ça marche.

**3. AI-native** — 50+ composants AI intégrés : Chat, Conversation, Reasoning, ToolCall,
Confirmation, Generative UI. Pas besoin de tout coder from scratch.

**4. Polished visual** — Ça fait sérieux. Design system oklch, 25 tokens, 3 thèmes.
Transitions 150ms, hiérarchie visuelle forte, data-ink ratio maximal (Tufte).
Pas de shadow festival, pas de border overkill.

## Business Model

```
@blazz/ui (gratuit, open-source)
├── 76 primitives (Button, Input, Select, Dialog, Tabs, etc.)
├── 35 patterns (AppFrame, FormField, CommandPalette, etc.)
├── Layout primitives (BlockStack, InlineStack, Grid, Box, etc.)
└── 25 design tokens oklch

@blazz/pro (payant, licence)
├── 37 blocks métier (DataTable, KanbanBoard, StatsGrid, Page, PageHeader, etc.)
├── 52 composants AI (Chat, Conversation, Reasoning, ToolCall, etc.)
├── Hooks avancés (use-data-table-url-state, use-data-table-views, etc.)
└── Système de licence (BlazzProvider, withProGuard)

@blazz/mcp (payant, à venir)
├── Serveur MCP pour Claude Code / Cursor
├── 6 tools : list_components, get_component, get_pattern, get_rules, get_design_principles, get_tokens
└── Permet aux devs de "vibe coder" avec leurs composants Blazz
```

**Stratégie** : le gratuit (@blazz/ui) attire les devs. Quand ils ont besoin de DataTable,
KanbanBoard, Charts, ou composants AI → ils passent à Pro. Le MCP Server vend l'intégration
avec les outils AI (Claude Code, Cursor).

## Architecture technique

Turborepo monorepo :
- `packages/ui/` → @blazz/ui (open-source, npm)
- `packages/pro/` → @blazz/pro (payant, npm)
- `apps/docs/` → Documentation + playground + landing
- `apps/ops/` → App freelance interne (pas le produit)

Stack : Next.js 16, React 19, TypeScript strict, Tailwind v4, Base UI (PAS Radix),
react-hook-form + zod, TanStack Table, @dnd-kit, Recharts, Biome, tsup (ESM), Changesets.

**Règle critique** : Base UI partout (pas Radix) → `render` prop pour composition, JAMAIS `asChild`.

## Catalogue actuel (mars 2026)

**200+ composants au total :**
- Primitives (76) : Button, Input, Select, Dialog, Sheet, Tabs, Badge, Skeleton, Toast, EmptyState, ErrorState, Checkbox, Switch, Popover, Tooltip, Avatar, etc.
- Layout (7) : BlockStack, InlineStack, Grid, InlineGrid, Box, Bleed, Divider — OBLIGATOIRES pour tout layout
- Patterns (35) : AppFrame, AppSidebar, PageHeaderShell, FormField, FormSection, FieldGrid, ImageUpload, CommandPalette, NavigationTabs, ThemeToggle, etc.
- Blocks pro (37) : DataTable, DataGrid, KanbanBoard, StatsGrid, Page, PageHeader, ActivityTimeline, SplitView, ChartCard, FilterBar, BulkActionBar, MultiStepForm, StatusFlow, etc.
- AI pro (52) : Chat, Conversation, Message, PromptInput, Shimmer, Reasoning, ToolCall, Confirmation, GenerativeUI, etc.

**176 pages de documentation.**

## Concurrence

| Concurrent | Forces | Faiblesses vs nous |
|-----------|--------|-------------------|
| shadcn/ui | Gratuit, community énorme, copy-paste | Zéro composants métier, pas de DataTable avancée, pas d'AI |
| Tremor | Bons dashboards, charts | Que des dashboards, pas de composants génériques |
| NextUI | Joli, moderne | Pas enterprise-grade, densité trop faible |
| Ant Design | Complet, enterprise | Lourd, design daté, DX pénible |
| Material UI | Standard Google | Lourd, opinions fortes, pas moderne |
| Radix | Bonnes primitives | Que des primitives, zéro blocks métier |

**Notre créneau** : entre shadcn (trop basique) et Ant Design (trop lourd). Moderne + enterprise + AI.

## État actuel & Priorités

**Phase 3 — Stabiliser et publier :**
1. ⚡ Publier @blazz/ui + @blazz/pro sur npm (BLOQUE TOUT)
2. 🔌 MCP Server 4 tools MVP
3. 📛 Naming définitif (Blazz vs autre nom)
4. 🌐 Finaliser landing + domaine
5. 📹 Vidéo démo + Twitter launch

**Ce qui est prêt** : 200+ composants, 176 pages docs, design system complet, 3 thèmes.
**Ce qui bloque** : npm publishing, landing page, vidéo de démo.

## Documentation technique détaillée

IMPORTANT : Quand tu as besoin de détails sur un composant, un pattern, ou les règles de design,
utilise `read_file` pour lire ces fichiers. Ne devine pas — va chercher l'info.

| Fichier | Contenu | Quand le lire |
|---------|---------|---------------|
| `ai/components.md` | Catalogue complet de chaque composant avec props, exemples, gotchas | Quand on parle d'un composant spécifique |
| `ai/compose.md` | Comment composer les composants, layouts, construire des pages | Quand on design une nouvelle page ou feature |
| `ai/design.md` | Principes design : Tufte, Gestalt, densité, typographie, couleurs | Quand on prend une décision design |
| `ai/rules.md` | Les 12 règles non-négociables du kit | Toujours relire avant de proposer une spec |
| `ai/patterns/dashboard.md` | Pattern page dashboard avec KPIs et charts | Si on parle de dashboards |
| `ai/patterns/resource-list.md` | Pattern liste de ressources (DataGrid + filtres) | Si on parle de listes/tables |
| `ai/patterns/resource-detail.md` | Pattern page détail d'une ressource | Si on parle de fiches détail |
| `ai/patterns/resource-create-edit.md` | Pattern formulaire création/édition | Si on parle de formulaires |
| `ai/patterns/pipeline-kanban.md` | Pattern kanban avec colonnes de statuts | Si on parle de kanban/pipeline |
| `ai/patterns/reporting.md` | Pattern page reporting avec graphiques | Si on parle de rapports |
| `ai/patterns/resource-import.md` | Pattern import de données | Si on parle d'import |
| `packages/ui/styles/tokens.css` | Les 25 design tokens oklch | Si on parle de couleurs/thèmes |

## Projet dans Blazz Ops

Blazz UI Kit est un projet interne dans l'app Ops :
- **Client** : Blazz
- **Projet** : "Blazz UI Kit" (ID: j57ekwmce4499ccgrzgvmskhpn83p3dg)
- **TJM** : 0 (interne, pas facturé)

**IMPORTANT** : Quand tu crées des notes ou des todos liés à Blazz UI, associe-les TOUJOURS
au projet "Blazz UI Kit". Utilise le projectId `j57ekwmce4499ccgrzgvmskhpn83p3dg` quand tu
appelles create_note ou create_todo.

## Idées de features futures
- Templates d'apps complètes (CRM, Dashboard, Admin panel)
- Thème builder visuel
- Figma kit synchronisé
- CLI d'initialisation (`npx create-blazz-app`)
- Marketplace de blocks communautaires
