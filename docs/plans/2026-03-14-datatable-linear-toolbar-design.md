# Data Table — Linear-style Toolbar Redesign

**Date:** 2026-03-14
**Scope:** Refonte toolbar Data Table + nouvelle page docs avec 2 tableaux lignes de commande

## Contexte

La toolbar actuelle du Data Table mélange tout sur une seule ligne (vues, search, filtres, sort, actions). On veut un layout **empilé par fonction**, inspiré de Linear, beaucoup plus lisible et élégant.

## Inspiration

**Linear (mars 2026)** — 3 patterns clés :
1. Vues en tabs/pills dans une rangée dédiée, icônes d'action à droite
2. Filtres actifs dans une rangée séparée en dessous, avec pills inline `[Column is Value ×]`
3. Création/édition de vue inline (pas de modal)

## Design — Toolbar Architecture

### 3 rangées conditionnelles

```
┌─────────────────────────────────────────────────────────────────────┐
│ ROW 1 — VIEWS BAR (toujours visible)                                │
│ [Toutes] [En stock] [Rupture] [TVA 5.5%] [+ New view]  🔍 ⫗ ↕ ⚙ ↓│
├─────────────────────────────────────────────────────────────────────┤
│ ROW 2 — FILTER BAR (conditionnelle)                                 │
│ ⫗ [Status is ● En stock ×] [TVA is 5.5% ×] [+]    Clear   Save   │
├─────────────────────────────────────────────────────────────────────┤
│ ROW 3 — SEARCH BAR (conditionnelle)                                 │
│ 🔍 [Rechercher dans les lignes...                          ] [×]   │
└─────────────────────────────────────────────────────────────────────┘
```

### Row 1 — Views Bar

**Gauche :** Vues en tabs/pills horizontales
- Scrollable avec overflow (Shopify-style algorithm existant)
- Vue active : pill avec fond `bg-raised`, texte `text-fg`
- Vue inactive : pill ghost, hover `bg-surface`
- Bouton `+ New view` à la fin (ghost, icône + texte)
- Click sur `+ New view` → édition inline sous les tabs (nom + description optionnelle + Cancel/Save)

**Droite :** 5 icônes d'action (toutes `size="icon-sm"`, variant ghost)
1. **Search** (Search icon) — toggle Row 3
2. **Filter** (ListFilter icon) — toggle Row 2 + badge count si filtres actifs
3. **Sort** (ArrowUpDown icon) — popover avec sélection colonne + direction
4. **Display** (SlidersHorizontal icon) — popover avec column visibility + density toggle
5. **Export** (Download icon) — export CSV/Excel

### Row 2 — Filter Bar (conditionnelle)

Visible quand : icône Filter cliquée OU filtres déjà actifs

**Gauche :**
- Icône filter (petit, muted)
- Pills de filtres actifs : `[Column] is [Value] ×`
  - Chaque pill cliquable pour modifier la condition
  - `×` pour supprimer le filtre
- Bouton `+` pour ajouter un filtre → dropdown de colonnes filtrables (style Linear)

**Droite :**
- `Clear` (text button) — supprime tous les filtres
- `Save` (text button) — sauvegarde comme vue custom

### Row 3 — Search Bar (conditionnelle)

Visible quand : icône Search cliquée

- Input full-width avec icône Search à gauche
- Auto-focus à l'ouverture
- `×` à droite pour fermer (clear + hide)
- Debounced search (300ms)
- Escape pour fermer

## Page Docs — 2 tableaux

### Dataset : Lignes de commande produits

Mock data : 15-20 produits alimentaires/boissons (Coca-Cola, Evian, Pain de mie, etc.)

Colonnes :
| Colonne | Type | Éditable T1 | Éditable T2 |
|---------|------|-------------|-------------|
| Article (nom + ref) | text + sub-text | ❌ | ❌ |
| SKU | text | ❌ | ❌ |
| EAN | text | ❌ | ❌ |
| Type | text/badge | ❌ | ❌ |
| Qté | number | ❌ | ✅ |
| PU HT | currency | ❌ | ✅ |
| TVA % | percentage | ❌ | ❌ |
| Total HT | currency (calc) | ❌ | ❌ |
| Total TTC | currency (calc) | ❌ | ❌ |
| Actions | menu `...` | ✅ | ✅ |

### Tableau 1 — Read-only

- Toolbar complète Linear-style (vues, filtres, sort, search, display, export)
- Vues prédéfinies : "Toutes", "En stock", "Rupture", "TVA 5.5%", "TVA 20%"
- Row actions : Voir détail, Dupliquer, Supprimer
- Pagination : 10 lignes par défaut, options 10/25/50
- Variant : `lined`
- Bulk selection + bulk actions (Supprimer sélection)

### Tableau 2 — Editable

- Mêmes données, colonnes Qté et PU HT éditables (click-to-edit)
- Total HT = Qté × PU HT (recalcul auto)
- Total TTC = Total HT × (1 + TVA/100) (recalcul auto)
- Navigation clavier : Tab entre cellules éditables, Enter valide, Escape annule
- Toolbar simplifiée (filter + sort + search, pas de vues)
- Undo/Redo (Ctrl+Z / Ctrl+Y)

## Changements techniques

### `packages/ui/` — Modifications DataTableActionsBar

La toolbar actuelle ne supporte pas le layout empilé en 3 rangées. Modifications nécessaires :

1. **Refactor `DataTableActionsBar`** : passer d'un layout single-row à un layout stacked
   - Row 1 : views + action icons
   - Row 2 : filter pills (conditionnel)
   - Row 3 : search input (conditionnel)
2. **Nouvelle prop `toolbarLayout`** : `"classic"` (défaut, backward compat) | `"stacked"` (nouveau Linear-style)
3. **Filter pills component** : nouveau sous-composant pour afficher les filtres actifs en pills inline
4. **Icônes regroupées** : search, filter, sort, display, export dans un group à droite

### `apps/docs/` — Nouvelle page

- Route : `apps/docs/src/routes/_docs/docs/blocks/data-table-v2.tsx` (ou remplacer l'existante)
- Deux sections avec titre + description
- Mock data partagé entre les deux tableaux
- Preset factory pour les colonnes lignes de commande

## Hors scope

- Pas de changement de pagination (déjà bien)
- Pas de bulk selection bar redesign
- Pas de changement des cell renderers existants
