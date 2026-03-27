# Agent Memory Consolidation — Design

**Date**: 2026-03-27
**Approche**: LLM pure (pas d'embeddings), hybride hot + cold path

## Problème

Les mémoires des agents s'accumulent sans jamais fusionner les doublons ni monter en abstraction. 5 "fact" sur le même client restent 5 entrées séparées au lieu d'1 résumé.

## Solution

Deux niveaux de consolidation :

### 1. Post-mission (hot path)

Après `extractAndSaveMemories()`, on appelle `consolidatePostMission()` :

- Charge les mémoires existantes de l'agent (max 50, triées par `lastConfirmedAt` desc)
- Passe existing[] + new[] à GPT-4o-mini
- Prompt : "fusionne les doublons, invalide les faits obsolètes, retourne la liste finale"
- Output JSON : `{ keep: string[], update: [{id, content}], delete: string[], insert: [{content, category, scope}] }`
- Applique les mutations
- Skip si l'extraction n'a rien produit

Coût : ~$0.002/mission

### 2. Cron hebdomadaire (cold path)

Chaque dimanche à 3h, `consolidateAgent()` pour chaque agent :

- Charge TOUTES les mémoires (pas cap à 15)
- Prompt plus ambitieux :
  - Fusionne les faits redondants
  - Promeut les épisodes récurrents en patterns
  - Supprime les mémoires à confidence < 0.3 jamais confirmées depuis 30j+
  - Cap : max 30 mémoires par agent
- Même format de sortie, applique les mutations

Coût : ~$0.01/semaine pour 5 agents

## Fichiers

| Fichier | Changement |
|---|---|
| `worker/src/memory.ts` | Ajouter `consolidatePostMission()` |
| `worker/src/consolidation.ts` | **Nouveau** — `consolidateAgent()` |
| `worker/src/index.ts` | Ajouter node-cron hebdo dimanche 3h |
| `worker/src/runner.ts` | Appeler `consolidatePostMission()` après extraction |
| `convex/agentMemory.ts` | Ajouter `internalUpdate`, `internalRemove`, `internalListAll` |

## Pas de changement

- `convex/schema.ts` — déjà complet
- `convex/crons.ts` — le cron vit dans le worker Node
- UI — consolidation silencieuse

## Prompt de consolidation (post-mission)

```
Tu es un archiviste mémoire. On te donne les mémoires existantes d'un agent et les nouvelles mémoires extraites d'une mission.

Règles :
- Si une nouvelle mémoire dit la même chose qu'une existante → garde la plus récente/précise (update)
- Si une nouvelle mémoire contredit une existante → remplace l'existante (update)
- Si deux mémoires peuvent se fusionner en une seule plus complète → fusionne (delete + insert)
- Ne jamais supprimer une mémoire de catégorie "rule"
- Ne jamais inventer d'information non présente dans les inputs

Réponds en JSON strict :
{
  "keep": ["id1", "id2"],           // IDs à garder tels quels
  "update": [{"id": "id3", "content": "nouveau contenu", "confidence": 0.8}],
  "delete": ["id4", "id5"],         // IDs à supprimer (fusionnés ou obsolètes)
  "insert": [{"content": "...", "category": "fact", "scope": "private"}]
}
```

## Prompt de consolidation profonde (cron hebdo)

```
Tu es un archiviste mémoire. Voici TOUTES les mémoires de l'agent "{name}" ({role}).

Consolide-les :
1. Fusionne les doublons et faits redondants
2. Si 3+ épisodes montrent le même comportement → crée 1 pattern et supprime les épisodes
3. Supprime les mémoires vagues, inutiles ou à très faible confidence (< 0.3)
4. Garde max 30 mémoires au total
5. Ne jamais supprimer une mémoire de catégorie "rule"
6. Ne jamais inventer d'information non présente

Même format JSON : { keep, update, delete, insert }
```
