# Design — Navigation docs top-bar + sidebar contextuel

## Problème

Le sidebar de la doc contient 204 items dans 6 sections affichées d'un coup. C'est trop gros et nuit à la navigation.

## Solution

Passer à une **top-bar avec 4 onglets** + un **sidebar contextuel** qui ne montre que la section active.

## Structure top-bar

4 onglets à droite du logo :

```
[Logo Blazz]   Composants   Blocks   AI   Guide        [⌘K] [🌙] [Examples]
```

Chaque onglet est un lien cliquable (pas de dropdown). Cliquer navigue vers la première page de la section et active le sidebar contextuel correspondant.

## Mapping des sections

| Onglet top-bar | Contenu actuel fusionné | Items |
|---|---|---|
| **Composants** | UI (72) + Patterns (35) | ~107 |
| **Blocks** | Blocks (37) | ~37 |
| **AI** | AI (52) | ~52 |
| **Guide** | Getting Started, Concepts, Tokens, Utils, Outils | ~8-10 |

## Sidebar contextuel par section

### Composants (~107 items)

Catégories existantes conservées :

- Layout & Structure (13)
- Actions (3)
- Selection & Input (24)
- Feedback & Indicators (6)
- Overlays (5)
- Navigation (8)
- Data Display (9)
- App Shell (6)
- Navigation Patterns (4)
- Forms (3)
- Media (1)
- Utilities (5)

### Blocks (~37 items)

Catégories existantes : Charts (8), Data (3), Business (15), etc.

### AI (~52 items)

Catégories existantes : Chat (6), Reasoning (4), Tools (3), Data (9), Entities (5), Workflow (7), Planning (5), Commerce (5), Content (7).

### Guide (~8-10 items)

Nouvelle section :

- Getting Started
- Design Tokens (Colors, Typography, Text)
- Concepts (Inset, spacing, theming)
- MCP Server
- Sandbox
- Unsaved Changes Bar
- Quick Login

## Comportement

- L'onglet actif est highlight dans la top-bar (underline ou bg accent)
- Le sidebar ne montre que les catégories de la section active
- URL structure inchangée (`/docs/components/...`, `/docs/blocks/...`, etc.)
- Mobile : onglets top-bar scrollables horizontalement, sidebar en sheet
- Command Palette (`⌘K`) cherche toujours dans toutes les sections

## Ce qui ne change pas

- Le composant sidebar lui-même (collapsible categories, icons, active state)
- Les URLs des pages
- La Command Palette
- Le theme toggle et le lien Examples
