# Today View — Design

**Date:** 2026-03-03
**App:** `apps/ops`
**Status:** Approved

## Objectif

Ajouter une page dédiée `/today` dans Blazz Ops : un daily planner qui regroupe les entrées de temps du jour, les projets actifs avec quick-log, et les todos actifs. Le Dashboard mensuel existant (`/`) est conservé tel quel.

## Route & navigation

- Nouvelle page : `apps/ops/app/today/page.tsx`
- Ajout dans la sidebar (`ops-frame.tsx`) : Dashboard → **Aujourd'hui** → Clients → Suivi → Todos
- Icône : `Sun` (lucide-react)
- Breadcrumb : `useOpsTopBar([{ label: "Aujourd'hui" }])`

## Contenu (colonne unique)

### 1. Header
`PageHeader` avec la date du jour formatée (ex. "Lundi 3 mars 2026") et description "Votre journée en un coup d'œil". Action : "Nouvelle entrée" → ouvre dialog `TimeEntryForm` pré-rempli avec `date = today`.

### 2. Résumé du jour
`StatsGrid columns={2}` :
- Heures loggées aujourd'hui (somme des `minutes` des entrées billable de today)
- Montant facturable du jour (somme `(minutes/60) * hourlyRate` des entrées billable)

### 3. Projets actifs avec quick-log
Liste des projets actifs. Chaque ligne :
- Nom du projet + taux (ex. `650€/j · 7h/j`)
- Bouton `[+ log]` → ouvre `QuickTimeEntryModal` pré-rempli avec `date = today` et `projectId`

Empty state si aucun projet actif.

### 4. Entrées d'aujourd'hui
Liste simple des entrées de temps pour today (même style que "Entrées récentes" du Dashboard). Colonnes : heure/projet, description, durée. Cliquable → ouvre dialog d'édition (`TimeEntryForm`). Empty state si rien.

### 5. Todos actifs
Todos avec `status !== "done"` (triage + todo + in_progress). Affichage compact : titre + badge priorité + badge projet si présent. Clique → ouvre `EditTodoDialog`. Empty state si rien.

## Queries Convex

Aucune nouvelle query. Réutilisation des queries existantes :
- `api.timeEntries.list({ from: today, to: today })`
- `api.projects.listActive`
- `api.todos.list({})` + filtre client-side `status !== "done"`
- `api.projects.listActive` (pour résoudre les noms de projet dans les todos)

## Composants réutilisés

- `QuickTimeEntryModal` (existant dans `@/components/`)
- `TimeEntryForm` dans un `Dialog`
- `EditTodoDialog` (interne à `todos/page.tsx` — à extraire ou dupliquer)
- `StatsGrid`, `PageHeader` de `@blazz/ui`
- `useOpsTopBar` hook (depuis `ops-frame.tsx`)

## Ce qui ne change pas

- `app/page.tsx` (Dashboard mensuel) : inchangé
- `ops-frame.tsx` sidebar : ajout d'un item seulement
- Aucune modification de `packages/ui/`
