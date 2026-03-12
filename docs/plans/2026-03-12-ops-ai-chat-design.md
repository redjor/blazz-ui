# Blazz Ops — AI Chat Design

**Date**: 2026-03-12
**Status**: Validated

## Overview

Page `/chat` dans Blazz Ops permettant d'interagir avec un LLM (GPT-4o) pour gérer todos, clients, projets et temps via langage naturel. Le chat a accès au scope complet de l'app via tool calling.

## Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Emplacement | Page `/chat` dédiée | Simple, pas d'interférence avec les pages existantes |
| LLM Provider | OpenAI GPT-4o via Vercel AI SDK | Meilleur rapport qualité/prix pour tool calling |
| Endpoint | Next.js API route (`/api/chat`) | Runtime Node.js garanti, AI SDK battle-tested |
| Static export | Retiré | Nécessaire pour API routes. Trade-off acceptable (Convex = déjà un serveur) |
| Autonomie | Semi-autonome | Read + create = auto. Update/delete = confirmation utilisateur |
| Contexte LLM | System prompt dynamique + tools de lecture | Le LLM peut se donner du contexte en listant les données |
| Clé API | `.env.local` (OPENAI_API_KEY) | Simple, dev-only pour le moment |
| Persistance conversations | Non (MVP) | Refresh = reset. Acceptable pour un assistant utilitaire |

## Architecture

```
Browser (useChat)  →  POST /api/chat  →  OpenAI GPT-4o
                                      ←  SSE stream
                   ←  messages + tool calls

Read tools   → exécutés côté serveur via Convex client dans le route handler
Write safe   → params retournés au client → exécution auto via useMutation()
Write danger → params retournés au client → confirmation UI → useMutation()
```

### Flow lecture (list-todos, get-client...)

1. LLM appelle le tool
2. Route handler exécute via Convex client (`ctx.runQuery`)
3. Résultat renvoyé au LLM → continue sa réponse

### Flow écriture safe (create-todo, create-client...)

1. LLM appelle le tool
2. Route handler retourne les params au client (pas d'exécution serveur)
3. Client exécute `useMutation()` automatiquement
4. Toast de confirmation

### Flow écriture dangereuse (update-todo, delete-client...)

1. LLM appelle le tool
2. Route handler retourne les params au client
3. Client affiche `Confirmation` component (@blazz/ui)
4. Utilisateur approuve/refuse
5. Si approuvé → `useMutation()` + toast

## Tools

### Lecture (serveur)

| Tool | Params |
|------|--------|
| `list-todos` | `status?`, `projectId?` |
| `get-todo` | `id` |
| `list-clients` | — |
| `get-client` | `id` |
| `list-projects` | `clientId?` |
| `get-project` | `id` |
| `list-time-entries` | `projectId?`, `date?`, `from?`, `to?` |
| `get-recap` | `from`, `to` |

### Écriture safe (client, auto)

| Tool | Params |
|------|--------|
| `create-todo` | `text`, `priority?`, `dueDate?`, `projectId?`, `categoryId?`, `tags?` |
| `create-client` | `name`, `email?` |
| `create-project` | `name`, `clientId`, `hourlyRate?` |
| `log-time` | `projectId`, `minutes`, `description?`, `date?` |

### Écriture dangereuse (client, confirmation)

| Tool | Params |
|------|--------|
| `update-todo` | `id`, `text?`, `status?`, `priority?`, `dueDate?`, `tags?`... |
| `delete-todo` | `id` |
| `update-client` | `id`, `name?`, `email?` |
| `delete-client` | `id` |
| `update-project` | `id`, `name?`, `hourlyRate?` |
| `delete-project` | `id` |
| `delete-time-entry` | `id` |

## System Prompt

Template dynamique enrichi à chaque requête avec :
- Nom utilisateur
- Date du jour
- Compteurs : todos (par statut), clients, projets, heures semaine
- Règles : priorité par défaut, format dates ISO, durées en minutes, langue française

## UI

### Page `/chat`

- `PageHeader` avec bouton clear
- `Conversation` + `ConversationContent` + `ConversationEmptyState`
- `Suggestions` initiales (todos du jour, résumé semaine, créer un todo)
- `Message` + `MessageResponse` (markdown) + `MessageActions`
- `Confirmation` pour les write tools dangereux
- `TaskCard` / `ChecklistCard` pour afficher les résultats
- `PromptInput` + `PromptInputTextarea` + `PromptInputSubmit`
- `ConversationScrollButton`

### Hors MVP

- Pas d'attachments fichiers
- Pas de model selector
- Pas de message branching
- Pas de persistance conversations
- Pas de streaming du reasoning/thinking

## Stack & Fichiers

### Dépendances

```
ai                  → Vercel AI SDK core
@ai-sdk/openai      → OpenAI provider
```

### Fichiers

```
apps/ops/
├── app/api/chat/route.ts              ← route handler
├── app/(main)/chat/page.tsx           ← page
├── components/chat/
│   ├── chat-messages.tsx              ← rendu messages + tool results
│   ├── chat-input.tsx                 ← wrapper PromptInput
│   ├── chat-suggestions.tsx           ← suggestions initiales
│   └── chat-tool-confirmation.tsx     ← confirmation UI
├── lib/chat/
│   ├── tools.ts                       ← définitions tools (zod schemas)
│   ├── system-prompt.ts               ← template system prompt
│   └── tool-handlers.ts              ← exécution read tools
├── .env.local                         ← OPENAI_API_KEY
└── next.config.mjs                    ← retirer output: "export"
```

### Breaking change

Retrait de `output: "export"` dans `next.config.mjs`. L'app nécessite un serveur Node.js. Le stub Tauri devra être adapté si besoin.
