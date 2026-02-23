# AI Elements — Design Document

**Date:** 2026-02-23
**Status:** Approved

## Objectif

Ajouter une collection de 13 composants d'interface IA au kit Blazz UI, inspirés d'[AI SDK Elements](https://elements.ai-sdk.dev/). Ces composants permettent aux utilisateurs du kit de construire des interfaces conversationnelles (chatbot, copilot, assistant).

## Approche : Install & Adapt

1. Installer les composants AI SDK Elements via leur CLI (`npx ai-elements@latest add <component>`)
2. Les composants sont copiés dans `components/ai-elements/` (code source, pas de dépendance npm)
3. Adapter le styling aux design tokens Blazz (oklch, `bg-surface`, `text-fg`, `border-edge`...)
4. Créer les pages showcase dans `app/(frame)/components/ai/`

## Composants — Phase 1 (Chatbot)

### Core Chat (3)

| Composant | Rôle | Sous-composants |
|-----------|------|-----------------|
| **Message** | Bulle de message (user/assistant) | MessageContent, MessageAvatar, MessageActions, MessageBranch |
| **PromptInput** | Zone de saisie avec attachments | PromptInputTextarea, PromptInputSubmit, PromptInputActions |
| **Conversation** | Container scroll avec auto-scroll | — |

### Interactions (4)

| Composant | Rôle |
|-----------|------|
| **Suggestion** | Boutons de suggestions cliquables |
| **Confirmation** | Approbation/rejet d'une action outil |
| **ModelSelector** | Combobox searchable pour choisir un modèle |
| **Attachments** | Preview de fichiers (grid/inline/list) |

### Reasoning (2)

| Composant | Rôle |
|-----------|------|
| **Reasoning** | Bloc collapsible "thinking" (streaming) |
| **ChainOfThought** | Steps de raisonnement avec indicateurs |

### Citations (3)

| Composant | Rôle |
|-----------|------|
| **Sources** | Liste de sources collapsible |
| **InlineCitation** | Pill de citation inline avec hover card |
| **Context** | Affichage token usage / coûts |

### Feedback (1)

| Composant | Rôle |
|-----------|------|
| **Shimmer** | Animation loading sur texte |

## Dépendances attendues

Les composants AI Elements peuvent nécessiter :
- `streamdown` — rendu markdown dans les messages
- `@ai-sdk/react` — hooks `useChat` (state management des conversations)
- `ai` — core AI SDK
- Autres dépendances spécifiques à certains composants

Ces dépendances seront installées au besoin lors de l'installation CLI.

## Structure fichiers

```
components/ai-elements/     # Installé par la CLI
├── message.tsx
├── prompt-input.tsx
├── conversation.tsx
├── suggestion.tsx
├── reasoning.tsx
├── chain-of-thought.tsx
├── sources.tsx
├── inline-citation.tsx
├── confirmation.tsx
├── attachments.tsx
├── model-selector.tsx
├── context.tsx
├── shimmer.tsx
└── ...                      # Fichiers utilitaires ajoutés par la CLI

app/(frame)/components/ai/   # Pages showcase
├── page.tsx                  # Index avec preview de chaque composant
├── message/page.tsx
├── prompt-input/page.tsx
├── conversation/page.tsx
└── ...
```

## Adaptation styling

Pour chaque composant installé :
1. Remplacer les couleurs CSS variables shadcn par les tokens Blazz
2. Vérifier le rendu light/dark avec `next-themes`
3. Aligner les border-radius, spacing, et typographie avec le design system
4. S'assurer que les primitives shadcn existantes (`Button`, `Avatar`, `Collapsible`, `ScrollArea`) sont réutilisées

## Pages showcase

Chaque composant aura une page dédiée dans le showcase avec :
- Preview interactive avec données mockées
- Variantes (user/assistant, loading, error, etc.)
- Pas de connexion à un vrai LLM — données statiques/simulées

## Hors scope

- Connexion à un vrai provider LLM (OpenAI, Anthropic, etc.)
- Composants Code/Dev (Code Block, Terminal, File Tree) — Phase 2
- Composants Workflow (Canvas, Node, Edge) — Phase 3
- Composants Voice (Audio, Speech, Transcription) — Phase 4
- Base de données messages/conversations (pas de modèle Prisma)
