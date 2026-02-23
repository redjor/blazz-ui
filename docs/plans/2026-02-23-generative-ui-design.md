# Generative UI Blocks — Design Document

**Date:** 2026-02-23
**Status:** Approved

## Objectif

Créer 6 composants "Generative UI" pour afficher des données structurées inline dans les conversations IA. Composants chat-first mais réutilisables standalone.

## Emplacement

`components/ai-elements/gen-*.tsx` — même dossier que les composants chat existants, préfixe `gen-` pour distinguer.

## Composants

### 1. Metric Card (`gen-metric-card.tsx`)

KPI unique avec label, valeur formatée, trend optionnel.

**Props:**
- `label: string` — nom du KPI
- `value: string` — valeur formatée ("$142k", "67%", "24")
- `trend?: number` — pourcentage de changement (+12.3, -5.2)
- `trendLabel?: string` — contexte ("vs last quarter")
- `icon?: ReactNode` — icône optionnelle

### 2. Stats Row (`gen-stats-row.tsx`)

2-4 KPIs en ligne horizontale avec dividers.

**Props:**
- `items: { label: string, value: string, trend?: number }[]`

### 3. Mini Chart (`gen-mini-chart.tsx`)

Sparkline compacte via Recharts (déjà installé).

**Props:**
- `label: string`
- `data: number[]`
- `value?: string` — valeur courante affichée
- `color?: string` — couleur de la ligne (défaut: brand)

### 4. Comparison Table (`gen-comparison-table.tsx`)

Mini tableau compact pour comparaisons.

**Props:**
- `title?: string`
- `columns: string[]`
- `rows: (string | number)[][]`

### 5. Progress Card (`gen-progress-card.tsx`)

Barre de progression avec label et description.

**Props:**
- `label: string`
- `value: number` — 0 à 100
- `description?: string` — texte sous la barre
- `color?: string`

### 6. Data List (`gen-data-list.tsx`)

Liste key-value verticale.

**Props:**
- `title?: string`
- `items: { label: string, value: string, badge?: { text: string, variant?: string } }[]`

## Conventions

- Client Components ("use client")
- Props-driven, pas de fetching interne
- Design tokens Blazz : `bg-surface`, `border-edge`, `text-fg`, `text-fg-muted`, `bg-raised`
- Style : `rounded-lg border border-edge p-4` par défaut
- Compact : optimisé pour ~600px de large (largeur message chat)
- Export depuis `components/ai-elements/index.ts`
- Pages showcase dans `app/(docs)/docs/components/ai/`
- Showcase intégré : démo inline dans un Message pour montrer le rendu en contexte

## Hors scope

- People & Entities (User Card, Contact Card) — Phase 2
- Actions & Forms (Inline Form, Approval Card) — Phase 3
- Connexion à des données réelles
