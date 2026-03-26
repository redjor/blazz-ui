# Blazz UI — Contexte Projet

## Pitch
Kit de composants React/Next.js AI-native pour apps pro data-heavy.
Cible : Lead Techs qui veulent vibe coder des apps internes au lieu de payer Salesforce/SAP.

## Architecture
Turborepo monorepo avec 2 packages npm :
- **@blazz/ui** (open-source) — 70+ primitives + 35+ patterns
- **@blazz/pro** (payant) — 30+ blocks métier + 50+ composants AI + système de licence

Apps : docs (documentation + landing), ops (app freelance interne)

## Stack
Next.js 16, React 19, TypeScript strict, Tailwind v4, Base UI (PAS Radix),
react-hook-form + zod, TanStack Table, @dnd-kit, Recharts,
Biome (lint/format), Turborepo, pnpm, tsup (ESM), Changesets

## Composants clés
- Primitives : Button, Input, Select, Dialog, Sheet, Tabs, Badge, Skeleton, Toast, EmptyState, ErrorState
- Layout : BlockStack, InlineStack, Grid, InlineGrid, Box, Bleed, Divider (OBLIGATOIRES, jamais de div nus)
- Patterns : AppFrame, AppSidebar, PageHeaderShell, FormField, FormSection, FieldGrid, CommandPalette, NavigationTabs
- Blocks (pro) : DataTable, KanbanBoard, StatsGrid, Page, PageHeader, ActivityTimeline, SplitView, ChartCard
- AI (pro) : Chat, Conversation, Message, PromptInput, Shimmer, Reasoning, ToolCall, Confirmation

## Design System
- 25 design tokens oklch dans tokens.css
- 3 thèmes (light, dark, système)
- Accent indigo/violet
- Densité enterprise : font 13px tables, row-height 40px, input 32px
- Références : Linear, Vercel Dashboard, Airtable

## État actuel (mars 2026)
- 200+ composants au total (76 primitives, 35 patterns, 37 blocks, 52 AI)
- 176 pages de documentation
- Phase 3 : stabiliser monorepo, publier sur npm
- MCP Server pas commencé
- Landing pas déployée

## Priorités immédiates
1. Publier @blazz/ui + @blazz/pro sur npm (bloque tout le reste)
2. MCP Server (4 tools MVP)
3. Naming définitif (Blazz vs autre)
4. Finaliser landing + domaine
5. Vidéo démo + Twitter launch

## Concurrence
- shadcn/ui — gratuit, community-driven, pas de blocks métier
- Tremor — dashboards, pas de composants génériques
- NextUI — joli mais pas enterprise-grade
- Ant Design / Material UI — lourd, pas moderne
- Notre différenciation : AI-native + enterprise density + composants métier prêts à l'emploi

## Conventions code
- Server Components par défaut, Client uniquement pour interactivité
- Formulaires = react-hook-form + zod TOUJOURS
- 4 états obligatoires : loading (Skeleton), empty, error, success
- Base UI (pas Radix) → `render` prop pour composition, JAMAIS `asChild`
- Import paths : `@blazz/ui/components/ui/button`, `@blazz/pro/components/blocks/data-table`
