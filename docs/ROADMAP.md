# Pro UI Kit — Roadmap & Suivi des Phases

> Derniere mise a jour : 16 fevrier 2026

---

## Vue d'ensemble

```
Phase 1  ████████████████████  DONE      Setup + Primitives
Phase 2  ████████████████░░░░  ~80%      Blocks + CRM + Docs
Phase 3  ░░░░░░░░░░░░░░░░░░░░  TODO      Polish + Themes
Phase 4  ░░░░░░░░░░░░░░░░░░░░  TODO      Landing + Marketing
Phase 5  ░░░░░░░░░░░░░░░░░░░░  TODO      Launch
```

---

## Phase 1 — Setup + Primitives UI ✅ DONE

Objectif : Poser les fondations techniques et les composants de base.

| Tache | Statut |
|-------|--------|
| Next.js 16 + React 19 + TypeScript strict | ✅ |
| Tailwind v4 + design tokens (25 variables oklch) | ✅ |
| Base UI v1 comme couche headless | ✅ |
| 48 primitives UI (Button, Input, Select, Dialog, Tabs, etc.) | ✅ |
| Theme light/dark avec next-themes | ✅ |
| Densite enterprise (40px rows, 32px inputs) | ✅ |
| Biome (lint + format) | ✅ |
| Storybook setup | ✅ |

---

## Phase 2 — Blocks metier + Forge CRM + Documentation 🔄 EN COURS (~80%)

Objectif : Construire les composants metier, la demo CRM complete, et la documentation.

### 2A. Blocks metier ✅ DONE (23/23)

| Block | Statut |
|-------|--------|
| PageHeader, EmptyState, ErrorState | ✅ |
| StatsGrid, ChartCard, FunnelChart, ForecastChart | ✅ |
| DataGrid (TanStack Table) + 8 presets CRM | ✅ |
| FilterBar, BulkActionBar | ✅ |
| DetailPanel, FieldGrid, ActivityTimeline | ✅ |
| FormSection, FormField, MultiStepForm | ✅ |
| StatusFlow, InlineEdit | ✅ |
| KanbanBoard (@dnd-kit) | ✅ |
| SplitView, DealLinesEditor | ✅ |
| QuotePreview, QuickLogActivity | ✅ |

### 2B. Forge CRM (demo app) ✅ DONE (15/15 ecrans)

| Page | Route | Statut |
|------|-------|--------|
| Dashboard | /examples/crm/dashboard | ✅ |
| Companies (liste) | /examples/crm/companies | ✅ |
| Company detail | /examples/crm/companies/[id] | ✅ |
| Company edit | /examples/crm/companies/[id]/edit | ✅ |
| Company new | /examples/crm/companies/new | ✅ |
| Contacts (liste) | /examples/crm/contacts | ✅ |
| Contact detail | /examples/crm/contacts/[id] | ✅ |
| Contact import | /examples/crm/contacts/import | ✅ |
| Deals (liste) | /examples/crm/deals | ✅ |
| Deal detail | /examples/crm/deals/[id] | ✅ |
| Deal edit/new | /examples/crm/deals/[id]/edit, /new | ✅ |
| Products | /examples/crm/products | ✅ |
| Inventory (spreadsheet) | /examples/crm/inventory | ✅ |
| Quotes (liste + detail + view) | /examples/crm/quotes/... | ✅ |
| Reports | /examples/crm/reports | ✅ |
| Settings | /examples/crm/settings | ✅ |

### 2C. Design tokens migration 🔄 EN COURS

Migration de tous les composants vers les 25 tokens (plus de Polaris `--p-*` ni shadcn `:root`).

| Cible | Statut |
|-------|--------|
| Primitives UI (48 composants) | ✅ Migre |
| Blocks (23 composants) | ✅ Migre |
| Features (data-table, nav-tabs, docs) | ✅ Migre |
| Layout (top-bar, sidebar, frame) | ✅ Migre |
| Pages CRM (app) | ✅ Migre |
| Pages docs (app) | ✅ Migre |
| **Nettoyage variables legacy** | ✅ DONE — Supprime ~760 lignes de Polaris `--p-*` + shadcn `:root` legacy |
| **Audit complet** | ✅ DONE — Zero reference legacy confirmee par grep |

### 2D. Documentation composants 🔄 EN COURS

39 pages de doc pour les composants UI, a redesigner avec les nouveaux composants doc.

| Tache | Statut |
|-------|--------|
| Composants doc existants (DocPage, DocSection, DocHero, etc.) | ✅ Crees |
| Shiki syntax highlighting (server-side) | ⬜ TODO |
| Redesign des 39 pages doc (plan dans `docs/plans/2026-02-15-doc-pages-redesign.md`) | ⬜ TODO |
| TOC avec scroll spy (IntersectionObserver) | ⬜ TODO |
| Code collapsible + copy button | ⬜ TODO |
| Props table avec badges required | ⬜ TODO |
| Do/Don't patterns | ⬜ TODO |
| Token swatches | ⬜ TODO |

---

## Phase 3 — Polish + Themes ⬜ TODO

Objectif : Polir le produit, ajouter les themes pre-packages, et preparer le contenu visual.

### 3A. Themes pre-packages

| Theme | Description | Statut |
|-------|------------|--------|
| **Slate** (dark) | Defaut flagship — Linear/Vercel vibe | ✅ Actif (theme actuel) |
| **Corporate** (light) | Blanc casse, accent bleu navy — Notion/Stripe vibe | ⬜ TODO |
| **Warm** (light) | Creme, tons chauds — Intercom/HelpScout vibe | ⬜ TODO |

### 3B. Apps secondaires (marketing)

4 mini-apps (2 pages chacune : dashboard + liste) pour montrer l'adaptabilite.

| App | Domaine | Theme | Statut |
|-----|---------|-------|--------|
| PulseOps | Interventions terrain | Corporate | ⬜ TODO |
| TalentFlow | Recrutement ATS | Warm | ⬜ TODO |
| StockBase | Gestion inventaire | Slate | ⬜ TODO |
| TeamDesk | Helpdesk support | Corporate | ⬜ TODO |

### 3C. QA & Polish

| Tache | Statut |
|-------|--------|
| Audit accessibilite WCAG 2.1 AA | ⬜ TODO |
| Tests responsive (desktop-first mais pas casse) | ⬜ TODO |
| Performance audit (Core Web Vitals) | ⬜ TODO |
| Empty/Error/Loading states sur toutes les pages | ⬜ TODO |
| Screenshots haute qualite pour marketing | ⬜ TODO |

---

## Phase 4 — Landing Page + Marketing ⬜ TODO

Objectif : Construire la vitrine et commencer le marketing.

### 4A. Landing page

| Section | Statut |
|---------|--------|
| Hero ("Arretez de payer Salesforce") + video autoplay | ⬜ TODO |
| Switcher multi-apps (5 previews) | ⬜ TODO |
| Calculateur ROI interactif | ⬜ TODO |
| Grille composants avec hover preview | ⬜ TODO |
| Video complete embed | ⬜ TODO |
| Pricing (3 tiers) | ⬜ TODO |
| FAQ | ⬜ TODO |
| Waitlist email capture | ⬜ TODO |

### 4B. Contenu marketing

| Tache | Statut |
|-------|--------|
| Video flagship "CRM en 30 minutes" (5-8 min) | ⬜ TODO |
| Clips 60s pour Twitter/LinkedIn | ⬜ TODO |
| GIFs pour README/landing | ⬜ TODO |
| Thread Twitter template (vibe coding angle) | ⬜ TODO |
| Comparaison Salesforce vs Pro UI Kit | ⬜ TODO |

### 4C. Infra business

| Tache | Statut |
|-------|--------|
| Domaine (prouikit.com ou .dev) | ⬜ TODO |
| Compte Twitter @ProUIKit ou @blazz_dev | ⬜ TODO |
| Payment provider (Stripe ou Lemon Squeezy) | ⬜ TODO |
| Email marketing (waitlist + drip) | ⬜ TODO |
| Analytics (Plausible ou PostHog) | ⬜ TODO |

---

## Phase 5 — Launch ⬜ TODO

### 5A. Drip launch

| Etape | Timing | Statut |
|-------|--------|--------|
| **Teasing** — Videos de build, pas de prix, waitlist | 2-3 sem avant | ⬜ TODO |
| **Early Access** — 50-100 personnes a 149€ | 1 semaine | ⬜ TODO |
| **Launch public** — Twitter, LinkedIn, Product Hunt, Reddit | Jour J | ⬜ TODO |

### 5B. Post-launch

| Tache | Statut |
|-------|--------|
| Temoignages early adopters | ⬜ TODO |
| Threads Twitter 1/semaine pendant 6 mois | ⬜ TODO |
| Bug fixes / feedback | ⬜ TODO |
| Add-ons (Packs verticaux a 149-199€) | ⬜ TODO |

---

## Prochaines actions immediates

> Ce qu'il faut faire MAINTENANT pour debloquer la suite.

1. **Finir Phase 2D** — Redesign des pages doc (Shiki + nouveaux composants)
2. **Nettoyage legacy** — Audit + suppression variables `--p-*` et `:root` inutilisees
3. **Theme Corporate** — Premier theme alternatif (light) pour montrer la flexibilite
4. **1 app secondaire** — StockBase ou TeamDesk (2 pages, prouve l'adaptabilite)

---

## Metriques cles

| Metrique | Actuel | Cible launch |
|----------|--------|-------------|
| Primitives UI | 48 | 48+ |
| Blocks metier | 23 | 23+ |
| Pages CRM | 16 | 15+ |
| Pages doc | 39 | 39+ (redesignees) |
| Themes | 1 (Slate) | 3 |
| Apps demo | 1 (Forge CRM) | 5 |
| Variables legacy | ~quelques | 0 |
