# Tiptap AI Slash Menu — Design

## Objectif

Ajouter des capacités AI dans l'editeur Tiptap existant de `apps/ops` (notes + todos) via le slash menu `/`.

## Slash menu — Groupe "AI"

En haut du menu `/` existant, un groupe **AI** avec :

| Action | Trigger | Comportement |
|--------|---------|-------------|
| Ask AI | `/` → Ask AI | Input inline pour prompt libre |
| Continue Writing | `/` → Continue Writing | Complete le texte existant (pas de prompt) |
| Summarize | `/` → Summarize | Resume le contenu/selection |
| Fix grammar | `/` → Fix grammar | Corrige grammaire/orthographe |
| Translate | `/` → Translate | Traduit FR↔EN (detection auto) |
| Change tone | `/` → Change tone → sous-menu | Professional, Casual, Friendly, Concise |

## Flow UX

1. User tape `/` → selectionne une action AI
2. Pour "Ask AI" : input inline apparait sous le curseur ("Ask AI what you want...")
3. Contenu genere en streaming dans un **bloc preview** (fond distinct)
4. Sous le preview : barre d'actions
   - Input "Tell AI what else needs to be changed..."
   - **Try again** — regenere avec le meme prompt
   - **Discard** — supprime le preview
   - **Apply** — insere le contenu dans l'editeur
5. Apply → le preview est remplace par le contenu final dans l'editeur

## Backend

- **Route API** : `apps/ops/app/api/ai/route.ts`
- **Method** : POST avec `streamText` du AI SDK
- **Provider** : `@ai-sdk/openai` (GPT-4o-mini)
- **System prompt** contextuel par action (continue, summarize, fix, translate, tone)
- **Streaming** via AI SDK

## Composants

| Fichier | Role |
|---------|------|
| `components/tiptap-editor.tsx` | Modifier : ajouter items AI dans slash menu |
| `components/ai-preview-block.tsx` | Nouveau : bloc preview avec actions (Try again, Discard, Apply, input suivi) |
| `app/api/ai/route.ts` | Nouveau : route API streaming |

## Hors scope

- Pas de gestion de tokens/quotas
- Pas de settings utilisateur pour le modele
- Pas d'historique des generations
