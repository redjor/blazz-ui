# RAG Knowledge Search — Design

**Date** : 2026-04-24
**Statut** : design validé, prêt pour plan d'implémentation
**Contexte** : Blazz Ops accumule des notes (`contentText` et `contentJson`) et des bookmarks (URLs + titres + notes libres capturées via iOS Shortcut). Aujourd'hui ces données sont write-only : pas de moyen de chercher sémantiquement "qu'ai-je sauvé sur le pricing" ou "ai-je une note sur les agents AI". On ajoute un serveur RAG minimal qui embedde notes + bookmarks et expose une recherche sémantique via un nouveau tool MCP `search_knowledge`.

## Objectif
Permettre à Hermes (Telegram) et aux agents in-app (Marc, Léo, Sarah) de **retrouver n'importe quel contenu écrit ou sauvegardé** dans Blazz Ops via une recherche en langage naturel, sans que l'utilisateur ait à se rappeler où il a mis le truc.

## Décisions

| Décision | Choix |
|---|---|
| Scope MVP | `notes` + `bookmarks` uniquement (feed / time / todos / expenses en v2) |
| Indexation | Async via Convex scheduled cron (60 sec) + queue table |
| Détection des changements | Hook dans les mutations source + hash de contenu (double garantie) |
| Provider embedding | OpenAI `text-embedding-3-small`, 1536 dims |
| Storage | Table dédiée `embeddings` + table `embeddingJobs` (queue) |
| Chunking | Aucun (un embedding par doc) — v2 si besoin |
| Interface recherche | Tool MCP `search_knowledge` — pas d'UI web en MVP |
| Threshold de qualité | Résultats avec `score < 0.35` filtrés côté tool |
| Garbage collection | Passe light dans le cron (100 rows random par tick) |

## Architecture

```
notes / bookmarks ──(hook create/update/remove)──▶ embeddingJobs queue
                                                           │
                                                           ▼
                                      cron 60s: batch embed + upsert + GC
                                                           │
                                                           ▼
                                                    embeddings table
                                                 [contentHash, vectorIndex]
                                                           │
                                                           ▼
                                          MCP tool `search_knowledge`
                                          → Hermes / Marc / Léo / Sarah
```

Le hook de mutation source **n'appelle jamais OpenAI directement** — il enqueue un job dans `embeddingJobs`. Le cron seul parle à OpenAI, permettant batch, retry, et contrôle du coût.

## Schema Convex

### Nouvelles tables

```ts
// File queue : un row par doc à (ré)indexer, supprimé après traitement réussi
embeddingJobs: defineTable({
    sourceTable: v.union(v.literal("notes"), v.literal("bookmarks")),
    sourceId: v.union(v.id("notes"), v.id("bookmarks")),
    attempts: v.number(),           // incrémenté à chaque échec, abandon à 5
    lastError: v.optional(v.string()),
    createdAt: v.number(),
}).index("by_created", ["createdAt"]),

// Index vectoriel : un row par doc indexé
embeddings: defineTable({
    userId: v.string(),
    sourceTable: v.union(v.literal("notes"), v.literal("bookmarks")),
    sourceId: v.union(v.id("notes"), v.id("bookmarks")),
    contentHash: v.string(),        // sha1 du texte — skip re-embed si identique
    text: v.string(),               // texte qu'on a embedded (utile pour debug + preview dans les hits)
    vector: v.array(v.number()),    // 1536 floats
    updatedAt: v.number(),
})
    .index("by_source", ["sourceTable", "sourceId"])
    .vectorIndex("by_vector", {
        vectorField: "vector",
        dimensions: 1536,
        filterFields: ["userId", "sourceTable"],
    }),
```

### Modifications aux tables existantes

**Aucune**. Pas de champ ajouté sur `notes` ou `bookmarks`. Tout passe par la queue + le hash.

## Data flow

### Écriture source → enqueue

Hook dans les mutations `notes.create`, `notes.update`, `bookmarks.create`, `bookmarks.update`, `bookmarks.internalCreateFromUrl` → insert ou dedup dans `embeddingJobs` avec `{sourceTable, sourceId, attempts: 0, createdAt: Date.now()}`.

Dedup : si un job existe déjà pour la même `sourceId`, on le laisse (pas de double enqueue — le cron le traitera avec l'état le plus récent du doc).

Hook dans les mutations `notes.remove`, `bookmarks.remove` → delete les entrées correspondantes dans `embeddings` et `embeddingJobs`.

### Cron d'indexation (toutes les 60 sec)

1. Prendre **50 jobs** les plus anciens depuis `embeddingJobs` (index `by_created`)
2. Pour chaque job :
   - Lire le doc source (note ou bookmark)
   - Si le doc n'existe plus → delete le job + l'embedding associé (GC)
   - Construire le texte indexable (voir `buildIndexableText` ci-dessous)
   - Calculer `contentHash = sha1(text)`
   - Lookup embedding existant via `by_source` index
   - Si embedding existe avec même hash → skip OpenAI, delete le job (contenu identique)
   - Sinon : ajouter à la batch à embedder
3. **Appel OpenAI batch** : un seul POST avec `inputs: [text1, text2, ...]` (jusqu'à 50)
4. Upsert dans `embeddings` (insert ou patch) avec le nouveau vector + hash + updatedAt + le `userId` **copié depuis le doc source** (pas depuis env) pour la cohérence filter
5. Delete les jobs traités avec succès
6. Incrémenter `attempts` + set `lastError` sur les jobs échoués. Abandon (delete) si `attempts >= 5` — log Convex pour investigation
7. **GC passe** : scan 100 embeddings random, vérifier que `sourceId` existe toujours dans la source table, delete les orphelins

### Construction du texte à embedder

Fonction pure `buildIndexableText(doc, kind)` :

```ts
// Note
`${title}\n\n${contentText ?? ""}`

// Bookmark
`${title ?? ""}\n${notes ?? ""}\n${description ?? ""}\nsource: ${url}`
```

Testable sans Convex runtime.

### Gestion erreur OpenAI

- **429 Too Many Requests** : retry avec exponential backoff (250ms → 500ms → 1s → stop), remet en queue si échec final
- **401 Unauthorized** : log + stop le batch — probablement clé invalide, inutile de retry
- **5xx** : requeue le job (incrémente attempts)
- **Timeout réseau** : idem 5xx

## MCP tool `search_knowledge`

### Schema (ajouté dans `shared/tool-schemas.ts`)

```ts
{
    name: "search_knowledge",
    category: "read",
    description: "Recherche sémantique dans les notes et bookmarks de l'utilisateur. Retourne les N entrées les plus pertinentes avec un score de similarité.",
    parameters: {
        type: "object",
        properties: {
            query: {
                type: "string",
                description: "La requête en langage naturel (ex: 'pricing agent AI', 'reunion coca-cola de mars').",
            },
            limit: {
                type: "number",
                description: "Max résultats (default 10, max 30).",
            },
            sourceTable: {
                type: "string",
                enum: ["notes", "bookmarks"],
                description: "Filtrer par type de source (optionnel).",
            },
        },
        required: ["query"],
    },
}
```

### Handler (côté `convex/http.ts` switch MCP)

```ts
case "search_knowledge": {
    const query = String(args.query)
    const limit = Math.min((args.limit as number) ?? 10, 30)
    const sourceTable = args.sourceTable as "notes" | "bookmarks" | undefined
    return ctx.runAction(api.rag.searchKnowledge, { query, limit, sourceTable })
}
```

### Convex action `rag.searchKnowledge`

```ts
export const searchKnowledge = action({
    args: {
        query: v.string(),
        limit: v.number(),
        sourceTable: v.optional(v.union(v.literal("notes"), v.literal("bookmarks"))),
    },
    handler: async (ctx, { query, limit, sourceTable }): Promise<Hit[]> => {
        const userId = process.env.OPS_USER_ID!
        const queryVector = await embedSingle(query)  // un appel OpenAI
        
        const results = await ctx.vectorSearch("embeddings", "by_vector", {
            vector: queryVector,
            limit: Math.min(limit * 2, 60),  // prend plus pour filtrer par score ensuite
            filter: sourceTable
                ? (q) => q.eq("userId", userId).eq("sourceTable", sourceTable)
                : (q) => q.eq("userId", userId),
        })
        
        // Filtrer par score + limiter
        return results
            .filter((r) => r._score >= 0.35)
            .slice(0, limit)
            .map((r) => ({
                sourceTable: r.sourceTable,
                sourceId: r.sourceId,
                text: r.text.slice(0, 300),  // preview 300 chars
                score: r._score,
            }))
    },
})
```

Retour tool MCP = JSON array de `{sourceTable, sourceId, text, score}`. L'agent peut ensuite appeler `notes.get` / `bookmarks.get` pour avoir le contenu complet si besoin.

## Tests

### Unit (vitest pur)
- `lib/buildIndexableText.test.ts` : couvre les 4 combinaisons (note avec/sans body, bookmark avec/sans notes)
- `lib/contentHash.test.ts` : fonction pure sha1 helper — test simple

### Integration (convex-test)
- `rag.test.ts` :
  - Insérer 3 notes, appeler le cron, vérifier que 3 embeddings apparaissent (avec mock de l'API OpenAI)
  - Update une note, re-appeler le cron, vérifier que l'embedding est remplacé (pas doublé)
  - Update une note SANS changer le contenu, vérifier que `contentHash` évite un appel OpenAI inutile
  - Delete une note, appeler le cron, vérifier que l'embedding disparaît (GC)
  - Simuler une erreur OpenAI 429, vérifier que attempts s'incrémente

## Backfill initial

Mutation admin one-shot : `rag.backfillAll` qui parcourt toutes les `notes` + `bookmarks` existantes et les enqueue dans `embeddingJobs`. À appeler une fois après déploiement : `npx convex run rag:backfillAll`.

## Observabilité

Pas de dashboard en MVP. Monitoring via :
- Table `embeddingJobs` (combien de jobs bloqués, combien d'échecs)
- Logs Convex pour les erreurs OpenAI
- `npx convex data embeddings` pour voir combien de docs indexés

Un petit helper `rag.stats()` query qui retourne `{totalEmbeddings, byTable, pendingJobs, failedJobs}` pour debug rapide.

## Env vars à ajouter

| Nom | Où | Usage |
|---|---|---|
| `OPENAI_API_KEY` | Convex env | Embeddings API |

À setter via `npx convex env set OPENAI_API_KEY sk-...`. À documenter dans `apps/ops/docs/prod-migration.md` pour la migration prod.

## Ce qui n'est PAS dans le scope

- Indexer les autres tables (feedItems, timeEntries, expenses, todos) — v2 direct par ajout dans le switch cron
- UI web `/search` — v2 après validation du RAG côté agents
- Chunking des longs docs — v2 si la qualité se dégrade
- Hybrid search (BM25 + vector) — v2 si vector seul rate trop de requêtes exactes ("titre: Pricing v3")
- Multi-tenant / multi-user — single-user pour toujours à ce stade
- Reranking (cross-encoder) — overkill à 1000 docs
- Streaming des résultats — all-at-once suffit

## Risques & points d'attention

- **Coût OpenAI** : `text-embedding-3-small` = $0.02/M tokens. Une note moyenne = 200 tokens. 1000 notes = 200K tokens = $0.004. Négligeable même avec 10 réindexations complètes. Mais si un bug cause une boucle infinie d'enqueue → alerte via le compteur `attempts` > 5.
- **Privacy** : les contenus des notes sont envoyés à OpenAI pour embedding. Acceptable pour ton usage perso, à documenter si un jour tu ouvres Blazz à d'autres users.
- **Consistance eventuelle** : 60 sec entre création d'une note et sa présence dans le RAG. Si tu poses une question juste après avoir créé la note, Hermes ne la trouvera pas. Acceptable pour le MVP.
- **Rate limit OpenAI** : tier-1 par défaut = 3000 req/min, largement au-dessus de nos besoins.
- **Convex vectorSearch limits** : max 256 results par query, 1 vector index par table. Respecté.
- **Changement de modèle** : si on passe à `text-embedding-3-large` (3072 dims) plus tard, il faut nuke la table `embeddings` et re-backfill. Dimensions hardcodées = inconvénient connu, pas un souci tant qu'on reste sur small.

## Critères de succès

1. Création d'une nouvelle note → dans 60 sec elle est searchable via `search_knowledge`.
2. `search_knowledge("pricing")` depuis Telegram retourne les notes + bookmarks pertinents, ordonnés par score.
3. Update d'une note existante → nouvel embedding remplace l'ancien (pas de doublon).
4. Suppression d'une note → embedding disparaît (via hook ou GC dans les 60 sec).
5. Un contenu identique ré-enqueued ne déclenche aucun appel OpenAI (hash identique).
6. Une panne OpenAI simulée n'abîme pas la queue (retry + backoff).
7. `rag.stats()` retourne des chiffres cohérents.

## Prochaine étape

Plan d'implémentation détaillé (skill `writing-plans`).
