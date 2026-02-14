# Pro UI Kit — Contexte projet

## Pitch
Kit de composants React/Next.js AI-native pour apps pro data-heavy.
Cible : Lead Techs qui veulent vibe coder des apps internes au lieu
de payer Salesforce/SAP.

## Demo app : Forge CRM
Replica d'un CRM complet (15 écrans) pour showcase le kit.

## Architecture
- ai/ → Fichiers SKILL.md, components.md, rules.md, patterns/
- components/blocks/ → Composants métier du kit (CRM blocks)
- components/ui/ → Primitives shadcn étendu
- components/features/ → Composants avancés existants (data-table, command-palette, image-upload)
- components/layout/ → Layouts et navigation (frame, sidebar, top-bar, page-header)
- app/(dashboard)/ → Routes Forge CRM (companies, contacts, deals, quotes, products, reports, settings)
- app/(frame)/ → Routes showcase UI kit + documentation composants
- lib/actions/ → Server Actions (CRUD + fetch)
- lib/schemas/ → Schemas Zod partagés client/serveur
- lib/db.ts → Prisma client singleton
- prisma/schema.prisma → CRM data model (User, Company, Contact, Deal, Quote, Product, Activity)
- config/crm-navigation.ts → Navigation sidebar CRM
- docs/ → Documentation architecture

## Stack
Next.js 16, React 19, TypeScript strict, Tailwind v4, shadcn/ui,
react-hook-form + zod, TanStack Table, @dnd-kit, Recharts,
Prisma + PostgreSQL, Biome (lint/format), Storybook

## Conventions
- Pas de prefix `src/` — fichiers à la racine
- Route group `(dashboard)` pour le CRM, `(frame)` pour le showcase
- Lire ai/rules.md avant de coder
- Server Components par défaut, Client uniquement pour interactivité
- Formulaires = react-hook-form + zod TOUJOURS
- 4 états obligatoires : loading (Skeleton), empty, error, success

## Priorité actuelle
Phase 2 : Implémenter les 15 composants blocks dans components/blocks/
