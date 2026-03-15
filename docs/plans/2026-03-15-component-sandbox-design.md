# Component Sandbox — Design Document

**Date:** 2026-03-15
**Status:** Approved

## Pitch

App standalone `apps/sandbox` pour explorer, tester et composer tous les composants @blazz/ui et @blazz/pro. Auto-génère les contrôles de props depuis les types TypeScript, offre un éditeur Monaco pour les slots/children, et persiste l'état entre navigations.

## Architecture

```
apps/sandbox/                    ← Nouvelle app Next.js (static export)
├── app/
│   ├── layout.tsx               ← Shell: sidebar + main area
│   ├── page.tsx                 ← Home / redirect vers premier composant
│   └── [category]/[component]/
│       └── page.tsx             ← Page playground d'un composant
├── src/
│   ├── components/
│   │   ├── sandbox-shell.tsx    ← Layout 2 colonnes (sidebar + main)
│   │   ├── props-panel.tsx      ← Panneau contrôles auto-générés (tab Controls)
│   │   ├── preview-panel.tsx    ← Preview live du composant (haut)
│   │   ├── code-editor.tsx      ← Monaco editor (tab Code)
│   │   ├── examples-panel.tsx   ← Presets / exemples prédéfinis (tab Examples)
│   │   ├── component-tree.tsx   ← Arbre de navigation avec recherche (sidebar)
│   │   ├── callback-toast.tsx   ← Toast overlay pour les logs de callbacks
│   │   └── variants-grid.tsx    ← Mode "All variants" side-by-side
│   ├── lib/
│   │   ├── registry.ts          ← Registry auto-généré des composants
│   │   ├── prop-controls.tsx    ← Mapping type TS → contrôle UI
│   │   ├── code-runner.tsx      ← Transpile (sucrase) + exécute le JSX
│   │   ├── persistence.ts       ← localStorage par composant
│   │   └── scope.ts             ← Scope injecté (tous les composants @blazz + React + icons)
│   └── config/
│       └── overrides/           ← .sandbox.tsx optionnels par composant
├── scripts/
│   └── generate-registry.ts     ← Parse les types TS → produit registry.ts
├── next.config.mjs
├── tsconfig.json
└── package.json
```

Port: `3130`

## Layout — 2 colonnes avec tabs

```
┌─────────────┬────────────────────────────────────────┐
│ 🔍 Search   │  ComponentName                         │
│             │  ┌────────────────────────────────┐    │
│ ● Récents   │  │ [Desktop|Tablet|Mobile]        │    │
│  Button     │  │ [Light|Dark] [Variants] [⛶] [📋]│    │
│  DataTable  │  │                                │    │
│             │  │         Live Preview            │    │
│ ▶ UI (72)   │  │                                │    │
│ ▶ Patterns  │  │                                │    │
│ ▶ Blocks    │  │         onClick({...}) ← toast │    │
│ ▶ AI        │  └────────────────────────────────┘    │
│             │  ┌────────────────────────────────┐    │
│             │  │[Controls] [Code] [Examples] [↺]│    │
│             │  │                                │    │
│             │  │  (panel resizable)             │    │
│             │  └────────────────────────────────┘    │
└─────────────┴────────────────────────────────────────┘
```

### Sidebar gauche
- Champ de recherche fuzzy (autofocus)
- Section "Récents" (max 5, depuis localStorage)
- Arbre collapsé par défaut : UI, Patterns, Blocks, AI
- Badge "modifié" sur les composants avec état persisté

### Preview (centre haut)
- Fond grille pointillée
- Toolbar: viewport toggle (desktop/tablet/mobile), thème (light/dark), mode "All variants", fullscreen, copy code
- Toast overlay semi-transparent pour les logs de callbacks (apparaît 3s)

### Panel bas (centre bas, resizable)
3 onglets :
- **Controls** — contrôles auto-générés par type de prop
- **Code** — Monaco editor TSX pour les children/slots
- **Examples** — presets prédéfinis, click = charge code + props

Bouton Reset (↺) pour revenir au defaultCode/defaultProps.

## Auto-génération des contrôles

### Script `generate-registry.ts`

Tourne au build-time ou en watch mode. Utilise le TypeScript Compiler API pour :
1. Parser les fichiers d'export de `@blazz/ui` et `@blazz/pro`
2. Extraire les interfaces de props
3. Produire `registry.ts`

### Format du registry

```ts
interface ComponentEntry {
  name: string
  category: "ui" | "patterns" | "blocks" | "ai"
  importPath: string
  props: PropDescriptor[]
  defaultCode: string
}

interface PropDescriptor {
  name: string
  type: "boolean" | "string" | "number" | "union" | "enum" | "slot" | "function" | "object" | "array"
  options?: string[]     // pour union/enum
  default?: unknown
  group?: string         // "main" | "style" | "slots" | "callbacks"
}
```

### Mapping type → contrôle UI

| Type TS | Contrôle |
|---------|----------|
| `boolean` | Toggle switch |
| `string` | Text input |
| `number` | Number input + slider |
| `union de string literals` | Select dropdown |
| `enum` | Select dropdown |
| `ReactNode` / `children` | Marqué "slot" → éditable dans Monaco |
| `function` (callbacks) | Read-only + log toast en preview |
| `object` / `array` | JSON editor inline |

### Overrides

Fichier optionnel `config/overrides/<component-name>.sandbox.tsx` :
- Masquer des props internes
- Définir des presets/examples
- Customiser le defaultCode
- Ajouter des groupes de props custom

## Monaco Editor

- Coloration TSX
- Code initial = `defaultCode` du registry ou de l'override
- Transpilation via `sucrase` (TSX → JS, ultra rapide, ~2KB)
- Exécution via `new Function()` avec scope injecté
- Erreurs affichées dans une barre rouge sous la preview (pas de crash)
- Debounce 300ms sur les changements

### Scope injecté

```ts
const scope = {
  React,
  useState, useEffect, useRef, useMemo, useCallback,
  // Tous les composants @blazz/ui
  Button, Input, Select, Dialog, Sheet, Popover, /* ... */
  // Tous les composants @blazz/pro
  DataTable, KanbanBoard, StatsGrid, /* ... */
  // Icons Lucide courantes
  Plus, Trash, Edit, Search, /* ... */
}
```

## Synchronisation props ↔ code

- Modifier un contrôle → met à jour la prop dans le code Monaco
- Modifier le code Monaco → les contrôles reflètent les nouvelles valeurs
- Debounce 300ms sur Monaco pour éviter le spam

## Persistance

- localStorage par composant : `sandbox:<category>/<component>` → `{ code, props }`
- Sauvegarde automatique à chaque changement
- Badge "modifié" dans la sidebar
- Bouton Reset pour revenir aux defaults

## Mode "All Variants"

Pour les props de type union, bouton dans la toolbar qui affiche une grille avec toutes les combinaisons de la prop sélectionnée, côté à côté.

Ex: Button avec `variant` → grille de 5 buttons (default, outline, ghost, link, destructive).

## Stack technique

- Next.js (static export)
- @blazz/ui + @blazz/pro (peer deps)
- Monaco Editor (`@monaco-editor/react`)
- Sucrase (transpilation JSX → JS)
- TypeScript Compiler API (pour generate-registry)
- localStorage (persistance)
- @blazz/ui components pour l'UI du sandbox lui-même
