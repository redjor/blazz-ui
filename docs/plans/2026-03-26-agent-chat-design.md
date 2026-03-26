# Agent Chat — Design

> Chat conversationnel par agent dans la sidebar, complémentaire au système de missions.

Date : 2026-03-26

---

## Principe

Chaque agent a sa propre page chat (`/agents/[slug]`). Le chat est éphémère (pas de persistance d'historique), mais l'agent a accès à sa mémoire cross-missions via `agentMemory`. L'agent peut créer des missions depuis le chat.

## Sidebar

```
──── Agents ────
🟡 Marc
🟢 Léo
🔵 Sarah
📋 Mission Control
──── Outils ────
💬 Chat          ← assistant généraliste existant, inchangé
...
```

Les 3 agents sont listés individuellement dans une section "Agents".

## Route

`/agents/[slug]` — route dynamique. Le slug (`cfo`, `timekeeper`, `product-lead`) charge l'agent depuis Convex.

## API Route

`/api/agents/[slug]/chat` — POST, streaming via `@ai-sdk/openai` streamText.

### System Prompt

Construit à partir de :
1. SOUL.md + STYLE.md + SKILL.md de l'agent (chargés depuis le filesystem)
2. Mémoire agent (10 dernières entrées `agentMemory`)
3. Contexte live (même pattern que le chat existant : counts, stats)

### Modèle

Utilise le modèle configuré sur l'agent (`gpt-4.1-mini` pour Marc/Léo, `gpt-4.1` pour Sarah).

### Tools

Mêmes tools que le worker, filtrés par permissions de l'agent. Plus un tool additionnel :

- `create_mission` — Crée une mission pour n'importe quel agent. Params : agentSlug, title, prompt, priority. L'agent peut se créer une mission à lui-même ("je vais analyser ça en profondeur, je crée une mission") ou déléguer à un autre agent.

### Budget

Chaque appel API consomme du budget agent (via `agents.addUsage`). Si le budget jour/mois est atteint, le chat retourne une erreur.

### Classification des tools

Même système que le worker :
- **safe** (read tools) : exécutés côté serveur automatiquement
- **confirm** (write tools) : exécutés mais affichés avec un indicateur dans le chat
- **blocked** : non disponibles

## UI

### Page `/agents/[slug]`

Réutilise le même pattern que `/chat` existant :
- `useChat` de `@ai-sdk/react` pointant vers `/api/agents/[slug]/chat`
- Header avec avatar + nom + rôle de l'agent
- Messages streaming
- Suggestions contextuelles basées sur les modes SKILL.md
- Empty state : présentation de l'agent + suggestions

### Composants réutilisés du chat existant

- Pattern `useChat` + streaming
- Rendu des messages (markdown)
- Rendu des tool calls (cards)
- Input avec envoi

### Pas de persistance

Le chat repart de zéro à chaque visite. La mémoire agent donne du contexte, mais pas l'historique conversationnel.

## Fichiers

```
apps/ops/app/(main)/agents/[slug]/page.tsx        ← Server component
apps/ops/app/(main)/agents/[slug]/_client.tsx      ← Chat UI client
apps/ops/app/api/agents/[slug]/chat/route.ts       ← API streaming
```

+ Modifier sidebar (`components/ops-frame.tsx`) pour ajouter section Agents.
