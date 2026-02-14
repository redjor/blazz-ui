# Custom Views - Fonctionnalités complètes

## 🎯 Vue d'ensemble

Le système de vues personnalisées pour le DataTable permet aux utilisateurs de sauvegarder, gérer et réutiliser leurs configurations de filtres, tri et visibilité de colonnes. Les vues sont persistées dans localStorage et offrent une expérience utilisateur complète avec duplication, renommage et suppression.

## ✨ Fonctionnalités implémentées

### 1. Sauvegarde de vues personnalisées
- ✅ Dialog de création avec validation en temps réel
- ✅ Capture automatique des filtres, tri et colonnes visibles
- ✅ Option "Définir comme vue par défaut"
- ✅ Génération automatique d'ID unique
- ✅ Support i18n (français/anglais)

### 2. Menu contextuel (Dropdown)
- ✅ Menu à trois options pour les vues custom
- ✅ **Duplicate** - Copier une vue avec nom incrémenté
- ✅ **Rename** - Modifier le nom avec validation
- ✅ **Delete** - Supprimer la vue (style destructif)
- ✅ Séparateur entre actions de modification et suppression

### 3. ButtonGroup pour vues actives
- ✅ Vue active affichée en split-button
- ✅ Bouton de vue + dropdown groupés visuellement
- ✅ Dropdown toujours visible pour vues actives
- ✅ Hover-only dropdown pour vues inactives

### 4. Validation et sécurité
- ✅ Noms uniques (case-insensitive)
- ✅ Longueur max 50 caractères
- ✅ Vues système protégées (pas de modification/suppression)
- ✅ Messages d'erreur en temps réel

### 5. Persistence
- ✅ Sauvegarde automatique dans localStorage
- ✅ Clé basée sur `storageKey` (ex: "products-table-views")
- ✅ Survie au rechargement de page
- ✅ Vue par défaut restaurée automatiquement

## 🎨 Interface utilisateur

### Vues système (non modifiables)
```
[Tous] [Actifs] [Brouillons]
```
- Pas de dropdown
- Fond gris si active
- Cliquable pour changer de vue

### Vues custom inactives
```
[Ma vue] ... (icône ⋮ au hover)
```
- Dropdown visible au hover/focus
- Fond transparent
- Cliquable pour changer de vue

### Vues custom actives
```
[Ma vue personnalisée][⋮]
```
- ButtonGroup (split-button)
- Dropdown toujours visible
- Fond gris (variant="outline")
- Partie gauche : sélection de vue
- Partie droite : menu d'actions

### Bouton création
```
[+]
```
- À droite de toutes les vues
- Ouvre le dialog de sauvegarde

## 📋 Structure des données

### DataTableView
```typescript
interface DataTableView {
  id: string                    // "custom-ma-vue-1737667200000"
  name: string                  // "Ma vue personnalisée"
  description?: string
  icon?: LucideIcon
  isSystem: boolean             // false pour vues custom
  isDefault?: boolean           // true si vue par défaut
  filters: FilterGroup          // Configuration filtres
  sorting?: SortingState        // Configuration tri
  columnVisibility?: VisibilityState
  createdAt?: Date
  updatedAt?: Date
  createdBy?: string
}
```

### localStorage
**Clé :** `{storageKey}-views`
```json
[
  {
    "id": "tous",
    "name": "Tous",
    "isSystem": true,
    "filters": { "id": "root", "operator": "AND", "conditions": [] }
  },
  {
    "id": "custom-produits-chers-1737667200000",
    "name": "Produits chers",
    "isSystem": false,
    "isDefault": true,
    "filters": {
      "id": "root",
      "operator": "AND",
      "conditions": [
        { "id": "1", "column": "price", "operator": "greaterThan", "value": "500" }
      ]
    },
    "sorting": [{ "id": "price", "desc": true }],
    "createdAt": "2025-01-23T10:00:00.000Z",
    "updatedAt": "2025-01-23T10:00:00.000Z"
  }
]
```

## 🔧 Intégration dans une page

### Exemple complet
```typescript
"use client"

import { DataTable, createProductsPreset } from "@/components/features/data-table"
import { useDataTableViews } from "@/hooks/use-data-table-views"

export default function ProductsPage() {
  const preset = createProductsPreset()

  // Hook pour gérer les vues
  const { views, activeView, setActiveView, addView, updateView, deleteView } = useDataTableViews({
    storageKey: "products-table",
    defaultViews: preset.views,
  })

  return (
    <DataTable
      data={products}
      columns={preset.columns}

      // Vues personnalisées
      views={views}
      activeView={activeView}
      onViewChange={(view) => setActiveView(view.id)}
      onViewSave={addView}
      onViewUpdate={updateView}
      onViewDelete={deleteView}
      enableCustomViews={true}

      // Autres features
      enableAdvancedFilters
      enableSorting
      enablePagination
      rowActions={preset.rowActions}
      bulkActions={preset.bulkActions}
    />
  )
}
```

### Props requises
| Prop | Type | Description |
|------|------|-------------|
| `views` | `DataTableView[]` | Liste des vues (système + custom) |
| `activeView` | `DataTableView \| null` | Vue actuellement active |
| `onViewChange` | `(view: DataTableView) => void` | Callback changement de vue |
| `onViewSave` | `(view: DataTableView) => void` | Callback création de vue |
| `onViewUpdate` | `(id: string, updates: Partial<DataTableView>) => void` | Callback mise à jour |
| `onViewDelete` | `(viewId: string) => void` | Callback suppression |
| `enableCustomViews` | `boolean` | Active le bouton "+" et les dropdowns |

## 🎬 Workflows utilisateur

### Créer une nouvelle vue
1. Appliquer des filtres/tri
2. Cliquer sur "+"
3. Entrer un nom (validation automatique)
4. Optionnel : Cocher "Définir par défaut"
5. Cliquer "Save"
6. Vue créée et activée automatiquement

### Dupliquer une vue
1. Hover sur une vue custom (ou clic sur split-button si active)
2. Cliquer sur l'icône "⋮"
3. Sélectionner "Duplicate"
4. Copie créée avec nom "(2)", "(3)", etc.
5. Vue dupliquée devient active

### Renommer une vue
1. Hover sur une vue custom (ou clic sur split-button si active)
2. Cliquer sur "⋮" → "Rename"
3. Dialog s'ouvre avec nom actuel
4. Modifier le nom (validation en temps réel)
5. Appuyer sur "Enter" ou cliquer "Rename"
6. Vue renommée, reste active si elle l'était

### Supprimer une vue
1. Hover sur une vue custom
2. Cliquer sur "⋮" → "Delete" (rouge)
3. Vue supprimée immédiatement
4. Si vue active, sélection redevient null

### Définir vue par défaut
1. Créer ou modifier une vue
2. Cocher "Définir comme vue par défaut"
3. Au prochain chargement, cette vue est auto-sélectionnée

## 🎨 Composants créés

### `data-table-save-view-dialog.tsx`
Dialog de création de vue avec :
- Input nom (validation)
- Checkbox vue par défaut
- Aperçu filtres/tri
- Support i18n

### `data-table-rename-view-dialog.tsx`
Dialog de renommage avec :
- Input nom pré-rempli
- Validation identique à création
- Enter pour sauvegarder
- Support i18n

### `button-group.tsx`
Composant UI pour grouper boutons :
- Arrondi uniquement aux extrémités
- Espacement négatif entre boutons
- Data slot pour styling

## 🔍 Tests recommandés

### Création
- [ ] Bouton "+" ouvre le dialog
- [ ] Focus automatique sur input
- [ ] Validation nom vide
- [ ] Validation nom doublon
- [ ] Validation nom trop long
- [ ] Vue apparaît après sauvegarde
- [ ] Vue devient active
- [ ] Filtres/tri préservés

### Duplication
- [ ] Nom incrémenté correctement
- [ ] Copie exacte des filtres/tri
- [ ] isDefault = false
- [ ] Vue dupliquée devient active

### Renommage
- [ ] Dialog s'ouvre avec nom actuel
- [ ] Validation identique à création
- [ ] Enter pour sauvegarder
- [ ] Vue reste active après renommage

### Suppression
- [ ] Confirmation visuelle (style rouge)
- [ ] Vue disparaît
- [ ] localStorage mis à jour
- [ ] Si active, désélection

### Persistence
- [ ] Survie au F5
- [ ] Vue par défaut restaurée
- [ ] Plusieurs vues possibles
- [ ] Pas de conflit avec vues système

### UI
- [ ] ButtonGroup pour vue active
- [ ] Dropdown hover pour vue inactive
- [ ] Vues système sans dropdown
- [ ] Icônes correctes (Copy, Edit2, Trash2)
- [ ] Séparateur visible

## 🚀 Améliorations futures

### Version 2
- [ ] Dirty indicator (badge orange si vue modifiée)
- [ ] Confirmation avant suppression
- [ ] Undo/redo
- [ ] Raccourcis clavier (Ctrl+S pour sauvegarder)

### Version 3 (API)
- [ ] Migration localStorage → API
- [ ] Synchronisation multi-device
- [ ] Partage de vues entre utilisateurs
- [ ] Vues publiques/privées
- [ ] Historique de modifications

## 📝 Notes techniques

### Génération d'ID
```typescript
const generateViewId = (name: string): string => {
  const slug = name
    .toLowerCase()
    .normalize("NFD")                    // Décompose accents
    .replace(/[\u0300-\u036f]/g, "")    // Supprime accents
    .replace(/[^a-z0-9]+/g, "-")        // Remplace espaces/spéciaux par -
    .replace(/^-+|-+$/g, "")            // Supprime - début/fin
  return `custom-${slug}-${Date.now()}`  // Préfixe + timestamp
}

// Exemples :
// "Ma Vue" → "custom-ma-vue-1737667200000"
// "Éléments actifs" → "custom-elements-actifs-1737667200000"
```

### Duplication intelligente
```typescript
const duplicateNumber = views?.filter(v =>
  v.name.startsWith(viewToDuplicate.name)
).length || 1

// "Ma vue" → "Ma vue (2)"
// "Ma vue (2)" existe → "Ma vue (3)"
```

### Protection vues système
```typescript
const isCustomView = !view.isSystem

// Vues système : pas de dropdown
// Vues custom : dropdown avec actions
```

## 🐛 Problèmes connus et solutions

### Dropdown ne s'affiche pas
**Cause :** Props manquantes
**Solution :** Vérifier que `onViewDuplicate`, `onViewRename`, `onViewDelete` sont passées

### Vue ne persiste pas
**Cause :** `useDataTableUrlState` utilisé au lieu de `useDataTableViews`
**Solution :** Utiliser `useDataTableViews` avec `storageKey`

### ButtonGroup mal stylé
**Cause :** Composant Button sans support data-slot
**Solution :** Vérifier que Button a le bon CSS pour `in-data-[slot=button-group]`

### Duplication incrémente mal
**Cause :** Filtre sur nom incomplet
**Solution :** Utiliser `.startsWith()` au lieu de `.includes()`

## 📚 Ressources

- [Plan d'implémentation original](SAVE_VIEW_IMPLEMENTATION.md)
- [Guide de test](TESTING_SAVE_VIEW.md)
- [Documentation DataTable](components/features/data-table/DATA_TABLE_README.md)
- [Code source - Dialog sauvegarde](components/features/data-table/data-table-save-view-dialog.tsx)
- [Code source - Dialog renommage](components/features/data-table/data-table-rename-view-dialog.tsx)
- [Code source - Actions bar](components/features/data-table/data-table-actions-bar.tsx)
