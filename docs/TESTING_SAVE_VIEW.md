# Guide de test - Sauvegarde de vues personnalisées

## ✅ Fonctionnalités implémentées

✅ **Sauvegarde de vues** - Les utilisateurs peuvent créer et sauvegarder des vues personnalisées
✅ **Dropdown menu** - Menu contextuel avec actions Dupliquer, Renommer, Effacer
✅ **Duplication** - Copier une vue existante avec un nom incrémenté
✅ **Renommage** - Modifier le nom d'une vue avec validation
✅ **Suppression** - Effacer une vue custom (vues système protégées)

## 📝 Changement d'architecture

La page `/products` utilisait `useDataTableUrlState` qui ne supporte pas la gestion complète des vues personnalisées. Elle a été mise à jour pour utiliser `useDataTableViews` avec localStorage.

## 🧪 Comment tester

### 1. Démarrer le serveur de développement

```bash
npm run dev
```

### 2. Ouvrir la page Produits

Naviguer vers `http://localhost:3000/products`

### 3. Tester la création d'une vue personnalisée

**Étape par étape :**

1. **Appliquer des filtres**
   - Cliquez sur l'icône de filtre dans la barre d'actions
   - Ajoutez une condition, par exemple : "Prix > 500"
   - Cliquez sur "Apply Filters"
   - Vous devriez voir un badge "1 filtre actif"

2. **Appliquer un tri (optionnel)**
   - Cliquez sur l'icône de tri
   - Sélectionnez "Prix" et "Décroissant"

3. **Ouvrir le dialog de sauvegarde**
   - Cliquez sur le bouton **"+"** dans la barre d'actions
   - Un dialog devrait s'ouvrir avec le titre "Save View" (ou "Enregistrer la vue" en français)

4. **Remplir le formulaire**
   - Vous devriez voir :
     - Badge "1 active filter" (ou "1 filtre actif")
     - Texte "Sort by price (descending)" si vous avez trié
   - Entrez un nom : **"Produits chers"**
   - (Optionnel) Cochez "Set as default view"

5. **Sauvegarder**
   - Cliquez sur "Save"
   - Le dialog se ferme
   - **VÉRIFICATION** : La nouvelle vue "Produits chers" devrait apparaître dans la barre d'actions
   - Elle devrait avoir un fond gris (active)

### 4. Tester la persistence

1. **Recharger la page** (F5 ou Cmd+R)
2. **VÉRIFICATION** : La vue "Produits chers" devrait toujours être visible
3. Les filtres et le tri devraient être toujours appliqués

### 5. Tester le changement de vue

1. Cliquez sur une autre vue (ex: "Tous")
2. Les filtres de "Produits chers" devraient disparaître
3. Cliquez à nouveau sur "Produits chers"
4. Les filtres devraient se réappliquer automatiquement

### 6. Tester la suppression

1. Survolez la vue "Produits chers"
2. Un bouton "X" devrait apparaître
3. Cliquez sur "X"
4. La vue devrait disparaître
5. Rechargez la page
6. **VÉRIFICATION** : La vue ne devrait plus être là

### 7. Tester la vue par défaut

1. Créez une nouvelle vue avec "Set as default view" coché
2. Rechargez la page
3. **VÉRIFICATION** : Cette vue devrait être automatiquement active

### 8. Tester la validation

**Nom vide :**
1. Ouvrez le dialog de sauvegarde
2. Laissez le champ nom vide
3. Le bouton "Save" devrait être désactivé
4. Message : "Name is required"

**Nom en doublon :**
1. Essayez d'entrer "Tous" (une vue système)
2. Message d'erreur : "This view name already exists"
3. Le bouton "Save" devrait être désactivé

**Nom trop long :**
1. Entrez plus de 50 caractères
2. Le champ devrait limiter à 50 caractères

## 🔍 Vérifications localStorage

Ouvrez la console du navigateur (F12) et allez dans l'onglet "Application" > "Local Storage" :

**Clé :** `products-table-views`

**Valeur attendue :** Un tableau JSON avec vos vues personnalisées
```json
[
  {
    "id": "tous",
    "name": "Tous",
    "isSystem": true,
    ...
  },
  {
    "id": "custom-produits-chers-1737667200000",
    "name": "Produits chers",
    "isSystem": false,
    "filters": {
      "id": "root",
      "operator": "AND",
      "conditions": [
        {
          "id": "condition-1737667200000",
          "column": "price",
          "operator": "greaterThan",
          "value": "500",
          "type": "number"
        }
      ]
    },
    "sorting": [
      {
        "id": "price",
        "desc": true
      }
    ],
    "createdAt": "2025-01-23T...",
    "updatedAt": "2025-01-23T..."
  }
]
```

**Clé :** `products-table-active`

**Valeur attendue :** L'ID de la vue active (ex: `"custom-produits-chers-1737667200000"`)

## ❌ Problèmes connus

Si la vue ne s'affiche pas après la sauvegarde :

1. **Vérifier que enableCustomViews={true}** dans le DataTable
2. **Vérifier que onViewSave={addView}** est bien passé
3. **Vérifier la console** pour des erreurs JavaScript
4. **Vider le localStorage** et réessayer :
   ```javascript
   localStorage.clear()
   location.reload()
   ```

## 📝 Notes

- Les vues **système** (comme "Tous", "Actifs", "Brouillons") ne peuvent pas être supprimées
- Les vues **personnalisées** peuvent être supprimées et sont identifiées par le préfixe "custom-" dans leur ID
- Une seule vue peut être "par défaut" à la fois
- Les vues sont stockées dans localStorage avec la clé basée sur `storageKey` du hook

## 🎯 Test complet réussi si :

- ✅ Le bouton "+" ouvre le dialog
- ✅ Le dialog affiche les filtres/tri actuels
- ✅ La validation fonctionne (nom unique, non vide, max 50 caractères)
- ✅ La vue apparaît dans la barre après sauvegarde
- ✅ La vue devient active automatiquement
- ✅ La vue survit au rechargement de la page
- ✅ Les filtres/tri se réappliquent quand on sélectionne la vue
- ✅ La vue peut être supprimée avec le bouton "X"
- ✅ La vue par défaut est automatiquement active au chargement
- ✅ localStorage contient les bonnes données

## 🚀 Prochaines étapes

Si tout fonctionne, vous pouvez :
1. Appliquer la même intégration sur d'autres pages avec DataTable
2. Ajouter des fonctionnalités avancées (dirty indicator, duplication, etc.)
3. Migrer vers une API pour synchroniser les vues entre appareils
