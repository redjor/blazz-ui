# Système de Sauvegarde de Vues Personnalisées - Documentation

## Résumé de l'implémentation

Le système de sauvegarde de vues personnalisées a été implémenté avec succès pour le composant DataTable. Les utilisateurs peuvent désormais créer et sauvegarder des vues personnalisées basées sur l'état actuel de leurs filtres, tri et visibilité des colonnes.

## Fichiers créés

### 1. `components/features/data-table/data-table-save-view-dialog.tsx`

Nouveau composant de dialog pour créer et sauvegarder des vues personnalisées.

**Fonctionnalités :**
- Input pour le nom de la vue (requis, max 50 caractères)
- Validation automatique (nom unique, non vide)
- Checkbox "Définir comme vue par défaut"
- Aperçu des filtres et tri actuels
- Support i18n (français et anglais)
- Génération automatique d'ID unique basé sur le nom

## Fichiers modifiés

### 2. `hooks/use-data-table-views.ts`

**Modifications :**
- Ajout de la fonction `setDefaultView(viewId: string)`
- Modification du type de retour `activeView` : `string | null` → `DataTableView | null`
- Conversion automatique de l'ID vers l'objet complet dans le return

**Nouvelle interface :**
```typescript
interface UseDataTableViewsReturn {
  views: DataTableView[]
  activeView: DataTableView | null  // ✅ Objet complet maintenant
  setActiveView: (viewId: string | null) => void
  addView: (view: DataTableView) => void
  updateView: (viewId: string, updates: Partial<DataTableView>) => void
  deleteView: (viewId: string) => void
  setDefaultView: (viewId: string) => void  // ✅ Nouvelle fonction
}
```

### 3. `components/features/data-table/data-table.types.ts`

**Modifications :**
- Ajout de la prop `onViewUpdate?: (viewId: string, updates: Partial<DataTableView>) => void`

### 4. `components/features/data-table/data-table.tsx`

**Modifications :**
- Import du composant `DataTableSaveViewDialog`
- Ajout de l'état `showSaveViewDialog`
- Ajout du handler `handleCreateView()`
- Ajout du handler `handleSaveView()`
- Ajout de la fonction `generateViewId()`
- Intégration du dialog dans le JSX
- Passage du handler `handleCreateView` à `ActionsBar`

### 5. `components/features/data-table/index.ts`

**Modifications :**
- Export du composant `DataTableSaveViewDialog`

## Utilisation

### Exemple d'intégration complète

```typescript
"use client"

import { DataTable, createEcommerceProductPreset } from "@/components/features/data-table"
import { useDataTableViews } from "@/hooks/use-data-table-views"

export default function ProductsPage() {
  const preset = createEcommerceProductPreset()

  // Hook pour gérer les vues avec localStorage
  const { views, activeView, setActiveView, addView, updateView, deleteView } = useDataTableViews({
    storageKey: "products-table",
    defaultViews: preset.views,
  })

  return (
    <DataTable
      data={products}
      columns={preset.columns}
      views={views}
      activeView={activeView}
      onViewChange={(view) => setActiveView(view.id)}
      onViewSave={addView}
      onViewUpdate={updateView}
      onViewDelete={deleteView}
      enableCustomViews={true}  // ✅ Active le bouton "+" et le dialog
      enableAdvancedFilters
      enableSorting
      enablePagination
      rowActions={preset.rowActions}
      bulkActions={preset.bulkActions}
    />
  )
}
```

### Props requises pour la fonctionnalité de sauvegarde

```typescript
// Minimum requis pour activer la sauvegarde de vues
<DataTable
  views={views}                    // Liste des vues disponibles
  activeView={activeView}          // Vue actuellement active (objet complet)
  onViewChange={handleViewChange}  // Callback quand l'utilisateur sélectionne une vue
  onViewSave={addView}            // Callback pour sauvegarder une nouvelle vue
  onViewUpdate={updateView}        // Callback pour mettre à jour une vue
  onViewDelete={deleteView}        // Callback pour supprimer une vue
  enableCustomViews={true}         // Active le bouton "+" et le dialog
  enableAdvancedFilters            // Requis pour les filtres avancés
/>
```

## Flux utilisateur

### Créer une nouvelle vue

1. L'utilisateur applique des filtres et/ou un tri sur le tableau
2. L'utilisateur clique sur le bouton "+" dans la barre d'actions
3. Le dialog s'ouvre avec :
   - Aperçu des filtres actifs (ex: "3 filtres actifs")
   - Aperçu du tri (ex: "Tri par Prix (décroissant)")
   - Input pour le nom de la vue
   - Checkbox "Définir comme vue par défaut"
4. L'utilisateur entre un nom (validation en temps réel)
5. L'utilisateur clique sur "Enregistrer"
6. La vue est créée et devient automatiquement active
7. La vue est sauvegardée dans localStorage

### Définir une vue par défaut

1. Lors de la création d'une vue, cocher "Définir comme vue par défaut"
2. Au prochain chargement de la page, cette vue sera automatiquement active
3. Une seule vue peut être par défaut à la fois

## Validation

Le dialog implémente les validations suivantes :

- **Nom requis** : Le nom ne peut pas être vide
- **Longueur max** : 50 caractères maximum
- **Nom unique** : Le nom ne peut pas être identique à une vue existante (case-insensitive)

## Génération d'ID

Les IDs de vues personnalisées sont générés automatiquement :

```typescript
// Exemple de génération
const name = "Produits actifs premium"
const id = "custom-produits-actifs-premium-1737667200000"

// Format : custom-{slug}-{timestamp}
```

Cette approche garantit :
- Unicité grâce au timestamp
- Lisibilité grâce au slug du nom
- Identification des vues custom grâce au préfixe "custom-"

## Internationalisation

Le dialog supporte français et anglais via la prop `locale` :

```typescript
<DataTable
  locale="fr"  // ou "en"
  // ... autres props
/>
```

**Textes traduits :**
- Titre du dialog
- Labels des champs
- Messages d'erreur
- Textes informatifs

## Persistence

Les vues personnalisées sont automatiquement sauvegardées dans `localStorage` :

**Clé de stockage :** `{storageKey}-views`

**Format :**
```json
[
  {
    "id": "custom-ma-vue-1737667200000",
    "name": "Ma vue personnalisée",
    "isSystem": false,
    "isDefault": true,
    "filters": { "id": "root", "operator": "AND", "conditions": [...] },
    "sorting": [{ "id": "price", "desc": true }],
    "columnVisibility": {},
    "createdAt": "2025-01-23T10:00:00.000Z",
    "updatedAt": "2025-01-23T10:00:00.000Z"
  }
]
```

## Migration localStorage → API (Future)

L'architecture actuelle facilite la migration future vers une API :

1. Les vues ont déjà des champs `createdAt`, `updatedAt`, `createdBy`
2. Le hook `useDataTableViews` peut être remplacé par un hook qui fait des appels API
3. Les composants n'ont pas besoin d'être modifiés car ils utilisent les mêmes props

**Préparation pour API :**
```typescript
// Future implementation
export function useDataTableViews({ storageKey, defaultViews }) {
  const [views, setViews] = useState([])

  // Fetch views from API instead of localStorage
  useEffect(() => {
    fetch(`/api/table-views?key=${storageKey}`)
      .then(res => res.json())
      .then(setViews)
  }, [storageKey])

  const addView = async (view) => {
    await fetch('/api/table-views', {
      method: 'POST',
      body: JSON.stringify(view)
    })
    // Update local state
  }

  // ... autres fonctions
}
```

## Compatibilité

- ✅ Compatible avec tous les types de filtres (text, number, select, date, boolean)
- ✅ Compatible avec le tri simple et multi-colonnes
- ✅ Compatible avec la visibilité des colonnes
- ✅ Compatible avec `useDataTableUrlState` (synchronisation URL)
- ✅ Compatible avec les vues système (non supprimables)
- ✅ Compatible avec le mode serveur (SSR)

## Prochaines étapes (non implémentées)

Les fonctionnalités suivantes peuvent être ajoutées dans le futur :

1. **Dirty indicator** : Badge orange quand une vue est modifiée
2. **Menu contextuel** : Clic droit sur une vue pour actions rapides
3. **Duplication de vues** : Créer une copie d'une vue existante
4. **Renommage** : Modifier le nom d'une vue existante
5. **Description et icône** : Personnalisation visuelle des vues
6. **Partage de vues** : Partager une vue avec d'autres utilisateurs (via API)

## Tests manuels effectués

- ✅ Le bouton "+" ouvre le dialog
- ✅ L'input a le focus automatiquement
- ✅ La validation du nom fonctionne
- ✅ La vue créée apparaît dans la barre
- ✅ La vue devient active automatiquement
- ✅ Les vues survivent au rechargement
- ✅ La checkbox "Définir par défaut" fonctionne
- ✅ Les traductions français/anglais fonctionnent

## Support

Pour toute question ou problème, consulter :
- Code source : `components/features/data-table/data-table-save-view-dialog.tsx`
- Documentation DataTable : `/components/features/data-table/DATA_TABLE_README.md`
- Plan d'implémentation : Documentation fournie initialement
