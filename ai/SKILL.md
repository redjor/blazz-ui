# PRO UI KIT — AI Skill Guide

> Kit de composants pour applications professionnelles data-heavy.
> Ce fichier est ton point d'entrée. Lis-le EN ENTIER avant de générer quoi que ce soit.

## Philosophie

Ce kit est conçu pour des **apps métier complexes** : back-offices, outils de gestion, ERP, CRM internes. Pas des landing pages SaaS.

Les apps ciblées ont ces caractéristiques :
- Des dizaines de milliers d'enregistrements
- Des tableaux avec 10-20 colonnes
- Des formulaires avec 20-40 champs
- Des workflows avec statuts et validations
- Des rôles et permissions
- De l'export de données

## Avant de générer une page

1. **Lis `components.md`** pour connaître les composants disponibles
2. **Lis `rules.md`** pour les conventions obligatoires
3. **Cherche un pattern dans `patterns/`** qui correspond à ce qu'on te demande
4. **Suis le pattern**. Ne réinvente pas la roue.

## Architecture des fichiers

```
src/
  app/
    (dashboard)/           ← Routes protégées, DashboardLayout
      [resource]/
        page.tsx           ← Server Component, liste paginée
        [id]/page.tsx      ← Server Component, vue détail
        [id]/edit/page.tsx ← Client Component, formulaire édition
        new/page.tsx       ← Client Component, formulaire création
    (auth)/                ← Routes publiques, AuthLayout
  components/
    ui/                    ← Primitives (Button, Input, Badge, etc.)
    blocks/                ← Composants métier composés
    layouts/               ← Layouts de page
  hooks/                   ← Custom hooks (data fetching, state)
  lib/                     ← Utilitaires, config, types
```

## Conventions critiques

### Data Fetching
- **Pages liste** : Server Component. Fetch côté serveur avec searchParams pour filtres/pagination.
- **Pages détail** : Server Component. Fetch par ID côté serveur.
- **Formulaires** : Client Component. Submit via Server Action ou API route.
- **Données temps réel** : Client Component avec polling ou WebSocket.

### State Management
- URL comme source de vérité pour les filtres, tri, pagination (searchParams)
- react-hook-form + zod pour TOUS les formulaires sans exception
- Pas de state global (Redux, Zustand) sauf cas très spécifique justifié

### Patterns obligatoires
Chaque composant data-driven DOIT gérer ces 4 états :
1. **Loading** — Skeleton, jamais un spinner seul
2. **Empty** — Message + action ("Aucun résultat. Créer le premier ?")
3. **Error** — Message clair + action retry
4. **Success** — Les données

### Formulaires
- Toujours `react-hook-form` + `zod` schema
- Validation côté client ET côté serveur (même schema zod partagé)
- Bouton submit désactivé pendant la soumission
- Toast de confirmation après succès
- Gestion explicite des erreurs serveur dans le formulaire

### Tables / DataGrid
- Pagination côté serveur (jamais charger 10K rows côté client)
- Filtres persistés dans l'URL (searchParams)
- Tri côté serveur
- Sélection multiple + actions batch
- Export CSV/Excel
- Colonnes configurables par l'utilisateur (optionnel)

## Comment composer une page

Quand on te demande de créer une page, suis ce process :

1. **Identifie le pattern** : est-ce une liste ? un détail ? un formulaire ? un dashboard ?
2. **Lis le pattern correspondant** dans `patterns/`
3. **Choisis le layout** (voir route → layout mapping dans rules.md)
4. **Assemble les blocks** dans l'ordre du pattern
5. **Vérifie** : loading states ? empty states ? error states ? permissions ?
6. **Génère le code** en suivant les conventions ci-dessus

## Erreurs fréquentes — NE FAIS PAS ÇA

- ❌ Charger toutes les données côté client et filtrer en JS
- ❌ Utiliser `useState` pour les filtres au lieu des searchParams
- ❌ Oublier les empty states
- ❌ Formulaire sans validation zod
- ❌ Table sans pagination
- ❌ Actions destructives sans confirmation
- ❌ Oublier le loading state sur les boutons de submit
- ❌ Mettre de la logique métier dans les composants UI
