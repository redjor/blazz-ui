# iOS Todo CRUD — Design

**Date:** 2026-03-14
**Scope:** CRUD complet des todos depuis l'app iOS BlazzOSIOS

## Contexte

L'app iOS affiche les todos en lecture seule (TodayView, AllTodosView, TodoDetailView).
Le backend Convex expose déjà toutes les mutations nécessaires :
- `todos:create`, `todos:update`, `todos:updateStatus`, `todos:remove`

Le ConvexService Swift n'a aucune méthode de mutation pour les todos.

## Approche : Detail éditable + Sheet création

Style Linear — le détail existant devient éditable, une sheet pour la création.

## Changements

### 1. ConvexService — mutations todos

4 nouvelles méthodes async :
- `createTodo(text, description?, status?, priority?, dueDate?, tags?)`
- `updateTodo(id, text?, description?, priority?, dueDate?, tags?)`
- `updateTodoStatus(id, status)`
- `deleteTodo(id)`

### 2. TodoDetailView — éditable

Transformer la vue read-only en vue éditable :
- **Text** — tap pour éditer inline (TextField)
- **Description** — tap pour éditer (TextEditor)
- **Status** — Menu picker (5 options)
- **Priority** — Menu picker (4 options)
- **Due date** — DatePicker
- **Tags** — affichage + ajout/suppression

Toolbar avec bouton Save quand des modifications sont détectées.

### 3. TodoCreateSheet — formulaire création

Sheet modale avec :
- Text (requis)
- Description (optionnel)
- Priority picker
- Status picker (défaut: triage)
- Due date picker
- Tags input

Déclenchée par bouton "+" dans la toolbar de TodayView et AllTodosView.

### 4. Swipe actions sur TodoRowView

- Swipe gauche → suppression (avec confirmation)
- Swipe droite → cycle au status suivant (triage→todo→in_progress→done)

## Fichiers impactés

- `Shared/ConvexService.swift` — mutations
- `BlazzOSIOS/TodoDetailView.swift` — réécriture en éditable
- `BlazzOSIOS/TodoCreateSheet.swift` — nouveau fichier
- `BlazzOSIOS/TodoRowView.swift` — swipe actions
- `BlazzOSIOS/TodayView.swift` — bouton "+"
- `BlazzOSIOS/AllTodosView.swift` — bouton "+"
