# Qonto + OpenAI Treasury Sync — Design

## Résumé

Synchroniser les transactions Qonto avec la page Trésorerie en utilisant OpenAI
pour détecter automatiquement les dépenses récurrentes et les catégoriser.
Système hybride : suggestions IA + saisie manuelle.

## Décisions

| Choix | Décision |
|---|---|
| Historique Qonto | 3 mois |
| Runtime | Convex action (tout serveur) |
| Déclenchement | Bouton manuel "Sync Qonto" |
| Validation | Review & confirm (accept/reject par ligne) |
| Modèle OpenAI | gpt-4o-mini (structured output) |
| Approche | Single-shot analysis (fetch → OpenAI → suggestions) |

## Data Flow

```
[Bouton "Sync Qonto"]
       │
       ▼
 Convex action: qonto.analyzeRecurring
       │
       ├── 1. Fetch 3 mois de transactions Qonto (paginé, debit only)
       │
       ├── 2. Charger recurringExpenses existantes (pour exclure doublons)
       │
       ├── 3. Appel OpenAI gpt-4o-mini (response_format: json_schema)
       │      → Détecte récurrences + catégorise
       │      → Retourne Array<{ name, amountCents, frequency, category, confidence }>
       │
       ├── 4. Insert résultats dans table syncSuggestions (status: pending)
       │
       └── 5. Return { count, syncedAt }
              │
              ▼
      UI: Section suggestions dans page Treasury
      [✓ Accept] [✗ Reject] par ligne
      [Tout accepter] [Tout rejeter]
              │
              ▼
      Mutation: accept → crée recurringExpense + patch status "accepted"
```

## Schema — nouvelle table `syncSuggestions`

```ts
syncSuggestions: defineTable({
  userId: v.string(),
  source: v.literal("qonto"),
  syncedAt: v.number(),
  // Suggestion OpenAI
  name: v.string(),
  amountCents: v.number(),
  frequency: v.union(v.literal("monthly"), v.literal("quarterly"), v.literal("yearly")),
  category: v.string(),
  confidence: v.number(),            // 0-1
  // Traçabilité
  transactionIds: v.array(v.string()),
  transactionLabels: v.array(v.string()),
  // Review
  status: v.union(v.literal("pending"), v.literal("accepted"), v.literal("rejected")),
})
  .index("by_user_status", ["userId", "status"])
  .index("by_user_synced", ["userId", "syncedAt"])
```

## Convex Action — `qonto.analyzeRecurring`

```
args: { bankAccountSlug: v.string() }

1. Fetch transactions Qonto (3 mois)
   - GET /transactions?slug={slug}&settled_at_from={3moAgo}&settled_at_to={now}
     &sort_by=settled_at:desc&per_page=100
   - Paginer si > 100
   - Filtrer side === "debit"

2. Charger recurringExpenses existantes (exclure doublons)

3. Appel OpenAI gpt-4o-mini (response_format: json_schema)
   - System: "Analyse ces transactions bancaires, détecte les dépenses récurrentes,
     catégorise-les. Ignore les déjà enregistrées: [noms existants]."
   - User: JSON transactions (id, label, amount_cents, settled_at)
   - Output: Array<{ name, amountCents, frequency, category, confidence,
     matchedTransactionIds, matchedLabels }>

4. Insert dans syncSuggestions (status: "pending")
5. Return { count, syncedAt }
```

**Coût estimé :** ~100 transactions = ~2k tokens in + ~500 out → ~$0.005/sync

## Mutations de review

- `syncSuggestions.accept(id)` → crée recurringExpense + patch "accepted"
- `syncSuggestions.reject(id)` → patch "rejected"
- `syncSuggestions.acceptAll()` → bulk accept pending

## UI — Page Treasury

### Bouton Sync dans PageHeader

Ajout d'un `Button variant="outline"` "Sync Qonto" avec `loading` state.
Position : à gauche de "Paramètres" dans les actions du PageHeader.

### Section Suggestions (entre StatsGrid et liste dépenses)

Visible uniquement si suggestions `pending > 0`.

```
┌─ Card ──────────────────────────────────────────────────┐
│ CardHeader                                              │
│   "Suggestions Qonto"  (text-sm font-medium)            │
│   "5 dépenses détectées"  (text-xs text-fg-muted)       │
│                                                         │
│ CardContent (divide-y)                                  │
│ ┌─ row ───────────────────────────────────────────────┐ │
│ │ InlineStack align="space-between"                   │ │
│ │                                                     │ │
│ │  left: BlockStack gap="050"                         │ │
│ │    "OVH Cloud"        (text-sm font-medium text-fg) │ │
│ │    "SaaS · 3 transactions"  (text-xs text-fg-muted) │ │
│ │                                                     │ │
│ │  right: InlineStack gap="200"                       │ │
│ │    "19,99€/mois"      (text-sm tabular-nums)        │ │
│ │    "98%"              (text-xs text-fg-muted)        │ │
│ │    [✓ ghost]  [✗ ghost]                             │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ (trié par confidence ↓, confidence < 70% → opacity-60)  │
│                                                         │
│ footer: InlineStack (border-t)                          │
│   [Tout accepter] outline sm    [Tout rejeter] ghost sm │
└─────────────────────────────────────────────────────────┘
```

### Principes Blazz UI respectés

- Layout primitives uniquement (BlockStack, InlineStack, Card)
- 3 niveaux hiérarchie : nom (font-medium), montant (text-sm), meta (text-xs muted)
- 1 point focal par row (nom de la dépense)
- tabular-nums sur les montants
- Confidence < 70% atténuée (progressive disclosure)
- transactionLabels en tooltip hover (pas d'overload)
- Section disparaît quand tout traité (Zeigarnik)
- Toast après accept (Peak-End)

## Fichiers à créer/modifier

| Fichier | Action |
|---|---|
| `convex/schema.ts` | Ajouter table `syncSuggestions` |
| `convex/qonto.ts` | Ajouter action `analyzeRecurring` |
| `convex/syncSuggestions.ts` | Nouveau — queries + mutations (list, accept, reject, acceptAll) |
| `app/(main)/treasury/_client.tsx` | Ajouter bouton sync + section suggestions |
| `app/(main)/treasury/_suggestions-section.tsx` | Nouveau — composant suggestions |
| `.env.example` | Ajouter `OPENAI_API_KEY` si absent (déjà présent) |
