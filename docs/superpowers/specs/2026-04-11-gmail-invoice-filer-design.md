# Gmail Invoice Filer — Design

**Date:** 2026-04-11
**Status:** Approved (brainstorming)
**Owner:** apps/ops
**Related:** account-manager agent, expenseSuggestions, connections

## Goal

Mettre en place un système qui récupère automatiquement les factures fournisseurs reçues par mail (Gmail) et les classe dans Google Drive avec un nommage structuré. Génère également des suggestions de dépenses dans Convex pour validation manuelle ultérieure.

**Cible utilisateur :** freelance qui reçoit ~10–20 factures fournisseurs/mois (OVH, Notion, SNCF, Anthropic, restaurants pro, etc.) et veut éliminer le filing manuel sans perdre le contrôle final sur la saisie comptable.

**Out of scope :**
- Factures émises (clients) — uniquement les factures **reçues**
- Création directe d'`expenses` sans validation manuelle
- Mails sans pièce jointe PDF (lien dans le corps, etc.)
- Fournisseurs non identifiables avec confidence < 0.7 (deviennent un todo manuel)

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  Gmail (label: "facture")                                       │
└────────────────────┬────────────────────────────────────────────┘
                     │ OAuth2 (scopes: gmail.modify, drive.file)
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│  Convex actions (apps/ops/convex/google.ts)                     │
│   • gmail.listInvoiceEmails                                     │
│   • gmail.fetchAttachment             (interne, jamais exposé)  │
│   • gmail.applyProcessedLabel                                   │
│   • drive.uploadInvoice                                         │
│   • llm.extractInvoiceMetadata        (Haiku 4.5 vision)        │
│   • invoiceSuggestions.create         (→ expenseSuggestions)    │
└────────────────────┬────────────────────────────────────────────┘
                     │ exposées comme 5 tools
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│  Worker tools (apps/ops/worker/src/tools/invoices.ts)           │
│   gmail_list_invoices, process_invoice_pdf, drive_upload_invoice│
│   create_invoice_suggestion, gmail_mark_processed               │
└────────────────────┬────────────────────────────────────────────┘
                     │ OpenAI function calling
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│  account-manager agent — mode "invoice-filing"                  │
│  Loop: pour chaque mail labelé, extraction → upload → suggest   │
│         → relabel.                                              │
└─────────────────────────────────────────────────────────────────┘
```

### Principes

- **Auth réutilisée** — table `connections` existante (provider `"google"`, OAuth2 + refresh token). Une seule connection couvre Gmail + Drive avec scopes minimaux.
- **Pas de tokens dans le worker** — les actions Convex chargent et rafraîchissent les tokens en interne. Le worker ne voit jamais les credentials.
- **Pas de base64 dans le LLM context** — le PDF voyage de Gmail vers Anthropic vision API côté serveur Convex uniquement. L'agent ne reçoit que des métadonnées extraites.
- **Idempotence multi-source** — le label Gmail (`facture/traitée`), un index sur `expenseSuggestions.gmailMessageId`, et un check sur `expenses.gmailMessageId` se complètent pour empêcher tout doublon.

## Tools exposés à l'agent

5 tools, tous Convex actions wrappées par un module worker `apps/ops/worker/src/tools/invoices.ts`.

### 1. `gmail_list_invoices`

```ts
gmail_list_invoices(): {
  emails: Array<{
    messageId: string
    from: string
    subject: string
    receivedAt: string  // ISO
    attachments: Array<{
      id: string
      filename: string
      mimeType: string
      sizeBytes: number
    }>
  }>
}
```

- Filtre Gmail : `label:facture -label:facture/traitée`
- Filtre supplémentaire : ne retourne que les mails avec au moins une pièce jointe `application/pdf`
- Ne retourne **pas** le contenu des PDFs (juste les métadonnées)

### 2. `process_invoice_pdf`

```ts
process_invoice_pdf({
  messageId: string,
  attachmentId: string
}): {
  vendor: string         // ex: "OVH", "Notion Labs Inc"
  invoiceDate: string    // YYYY-MM-DD (date facture, pas date mail)
  amountCents: number    // TTC
  invoiceNumber?: string
  currency: string       // "EUR", "USD"...
  confidence: number     // 0..1
} | { error: string }
```

- En interne : fetch le PDF depuis Gmail (binaire) → envoie à l'API Anthropic Haiku 4.5 vision avec un prompt structuré → parse la réponse JSON
- Le base64 ne quitte jamais Convex
- Si confidence < 0.7 ou date hors range plausible (< 2020 ou > today + 30 jours) → retourne `{ error: "low_confidence" | "invalid_date" }`

### 3. `drive_upload_invoice`

```ts
drive_upload_invoice({
  messageId: string,
  attachmentId: string,
  vendor: string,
  invoiceDate: string,    // YYYY-MM-DD
  amountCents: number
}): {
  fileId: string
  fileName: string        // "2026-04-11_OVH_23.99.pdf"
  webViewLink: string
  folderPath: string      // "Compta/Factures/2026/04"
} | { error: string }
```

- Re-fetch le PDF depuis Gmail côté serveur (pas de base64 dans les arguments)
- Format de nom : `YYYY-MM-DD_Vendor_Amount.pdf` (ex : `2026-04-11_OVH_23.99.pdf`)
- Vendor : sluggifié pour file system safety (espaces → `-`, ASCII only)
- Auto-crée le sous-dossier `YYYY/MM` dans le dossier parent configuré si absent
- Si un fichier de même nom existe : suffixe `_2`, `_3`...

### 4. `create_invoice_suggestion`

```ts
create_invoice_suggestion({
  messageId: string,
  vendor: string,
  invoiceDate: string,
  amountCents: number,
  invoiceNumber?: string,
  currency: string,
  driveFileId: string,
  driveWebViewLink: string,
  confidence: number
}): { suggestionId: string }
```

- Écrit dans `expenseSuggestions` avec `source: "gmail"`, `status: "pending"`
- Avant insertion : check via index `by_user_message` qu'aucune suggestion n'existe déjà pour ce `gmailMessageId`
- Si une existe : pas d'erreur, retourne l'`_id` existant (idempotence)

### 5. `gmail_mark_processed`

```ts
gmail_mark_processed({ messageId: string }): { ok: true }
```

- Retire le label `facture`, ajoute le label `facture/traitée`
- Crée le label `facture/traitée` au premier appel s'il n'existe pas

## Schema changes (Convex)

### `expenseSuggestions` — étendre pour Gmail

```ts
expenseSuggestions: defineTable({
  userId: v.string(),
  source: v.union(v.literal("qonto"), v.literal("gmail")),  // ← ajout "gmail"
  status: v.union(v.literal("pending"), v.literal("accepted"), v.literal("rejected")),

  // Champs communs
  label: v.string(),                    // = vendor pour gmail, = description pour qonto
  amountCents: v.number(),
  date: v.string(),
  confidence: v.number(),
  syncedAt: v.number(),

  // Source = qonto
  qontoTransactionId: v.optional(v.string()),  // ← devient optional

  // Source = gmail
  gmailMessageId: v.optional(v.string()),
  driveFileId: v.optional(v.string()),
  driveWebViewLink: v.optional(v.string()),
  invoiceNumber: v.optional(v.string()),
  currency: v.optional(v.string()),
})
  .index("by_user_status", ["userId", "status"])
  .index("by_user_txn", ["userId", "qontoTransactionId"])
  .index("by_user_message", ["userId", "gmailMessageId"])  // ← nouveau
```

⚠️ **Migration** : `source` devient une union, et `qontoTransactionId` devient optional. Les rows existants restent valides (déjà tous source `"qonto"` avec `qontoTransactionId` set). Aucun backfill nécessaire.

⚠️ **Code à mettre à jour** : `convex/expenseSuggestions.ts` `accept()` actuellement insert dans `expenses` avec `qontoTransactionId`. Faut adapter pour propager `driveFileId`/`driveWebViewLink`/`gmailMessageId` quand source = gmail.

### `expenses` — ajouter le lien vers Drive + étendre `type`

```ts
expenses: defineTable({
  userId: v.string(),
  type: v.union(
    v.literal("restaurant"),
    v.literal("mileage"),
    v.literal("invoice"),  // ← nouveau : facture fournisseur classique
  ),
  // ... (champs existants)
  driveFileId: v.optional(v.string()),       // ← nouveau
  driveWebViewLink: v.optional(v.string()),  // ← nouveau
  gmailMessageId: v.optional(v.string()),    // ← nouveau (traçabilité)
  vendor: v.optional(v.string()),            // ← nouveau (utilisé seulement pour type "invoice")
  invoiceNumber: v.optional(v.string()),     // ← nouveau
})
```

⚠️ **Pourquoi étendre `type`** : actuellement `expenses.type` ne supporte que `"restaurant"` et `"mileage"`. Sans extension, `accept()` d'une suggestion gmail crasherait au moment de l'insertion dans `expenses`. On ajoute `"invoice"` pour couvrir les factures fournisseurs (OVH, Notion, SaaS, etc.). Migration : aucun row existant n'est cassé (les anciens restent `"restaurant"` ou `"mileage"`).

⚠️ **Code à mettre à jour** : `convex/expenses.ts` doit accepter le nouveau type dans ses validateurs et ne pas exiger les champs `restaurant`-spécifiques (`guests`, `purpose`) ou `mileage`-spécifiques (`distanceKm`, etc.) pour ce type. L'UI expense list/detail ajoutera un rendu spécifique au type `"invoice"` (vendor, invoice number, bouton "Voir le PDF" qui ouvre `driveWebViewLink`).

### `settings` — ID du dossier Drive parent

```ts
settings: defineTable({
  // ... (champs existants)
  googleDriveInvoiceFolderId: v.optional(v.string()),  // ← nouveau
})
```

Configuré une fois via la page Settings de Ops.

### `providerConfigs` — pas de changement

Réutilisation de la table existante. Une row `provider: "google"` sera créée à la configuration initiale.

### Pas de table `processedEmails`

L'idempotence vient de 3 sources combinées :
1. Le label Gmail (`facture/traitée`) — premier filtre, le plus naturel
2. L'index `by_user_message` sur `expenseSuggestions` — fallback si le relabel a foiré
3. Check de `expenses.gmailMessageId` lors de l'acceptation — empêche les doubles expenses

## Auth Google — flow OAuth

### Setup une fois (manuel)

1. Créer un projet Google Cloud + OAuth client (type "Web app")
2. Configurer redirect URI : `https://<convex-deployment>.convex.site/oauth/google/callback`
3. Copier clientId + clientSecret

### Configuration via UI Ops (page Settings → Connections)

1. Section "Google" avec deux champs : Client ID, Client Secret → bouton "Sauvegarder" (écrit dans `providerConfigs` provider=`"google"`)
2. Bouton "Connecter Google" → redirige vers consent screen Google avec scopes :
   - `https://www.googleapis.com/auth/gmail.modify` (lire mails + modifier labels, pas de suppression)
   - `https://www.googleapis.com/auth/drive.file` (créer/écrire seulement les fichiers créés par l'app)
3. Callback Convex HTTP action `oauth/google/callback` :
   - Échange `code` contre `{ accessToken, refreshToken, expiresIn }`
   - Écrit dans `connections` provider=`"google"` avec `authType: "oauth2"`, `status: "active"`
4. Champ texte "Folder ID Drive parent factures" : tu colles l'ID de ton dossier `Compta/Factures` existant → sauvegarde dans `settings.googleDriveInvoiceFolderId`
5. **Étape critique côté Drive UI** : tu ouvres le dossier parent dans Google Drive et tu fais "Partager" → ajoute l'email associé au consent OAuth (= ton compte). Le scope `drive.file` ne donne accès qu'aux fichiers créés par l'app, donc l'app doit avoir explicitement reçu un share sur le dossier parent pour pouvoir y créer des sous-dossiers.

### Refresh token flow

Helper interne `apps/ops/convex/lib/google-auth.ts` :

```ts
async function getValidAccessToken(ctx, userId): Promise<string> {
  const conn = await ctx.db
    .query("connections")
    .withIndex("by_user_provider", q =>
      q.eq("userId", userId).eq("provider", "google"))
    .first()

  if (!conn) throw new Error("Google not connected")

  // Refresh si expiré ou expire dans < 60s
  if (conn.tokenExpiresAt && conn.tokenExpiresAt < Date.now() + 60_000) {
    const config = await getProviderConfig(ctx, userId, "google")
    const refreshed = await refreshGoogleToken(conn.refreshToken, config)
    await ctx.db.patch(conn._id, {
      accessToken: refreshed.accessToken,
      tokenExpiresAt: refreshed.expiresAt,
    })
    return refreshed.accessToken
  }

  return conn.accessToken
}
```

### Sécurité — scopes minimaux

- ❌ Pas `gmail.readonly` (peut tout lire) ni `https://mail.google.com/` (full access)
- ✅ `gmail.modify` — lire et modifier labels uniquement, pas de suppression
- ✅ `drive.file` — l'app ne voit que les fichiers qu'elle a créés. Zéro accès au reste de ton Drive existant.

## Account-manager — nouveau mode `invoice-filing`

### Ajout dans `apps/ops/agents/account-manager/SKILL.md`

```markdown
## invoice-filing
> Classer les factures fournisseurs reçues par mail.
Tools: gmail_list_invoices, process_invoice_pdf, drive_upload_invoice,
       create_invoice_suggestion, gmail_mark_processed, create_todo, ask_agent
Prompt: "Récupère tous les mails labelés 'facture' non encore traités via
gmail_list_invoices. Pour chaque mail :
1. Appelle process_invoice_pdf pour extraire vendor/date/montant.
2. Si l'extraction renvoie une erreur (low_confidence, invalid_date, etc.),
   crée un todo 'Vérifier facture <subject>' et SKIP ce mail (ne PAS relabeler).
3. Sinon : drive_upload_invoice → create_invoice_suggestion → gmail_mark_processed.
4. À la fin, résume : N factures classées, M ignorées (avec raisons), total TTC."
```

### Triggers

Deux triggers complémentaires :
- **Bouton manuel** dans Mission Control UI : "Lancer le filing factures" → crée une mission `account-manager` mode `invoice-filing`
- **Cron Convex quotidien** : 9h00 chaque jour ouvré → crée la mission automatiquement (ajouter à `apps/ops/convex/crons.ts`)

### `maxIterations`

Par mail : ~5 tool calls (list inclus). Pour 15 factures par run : ~76 tool calls. On prend `maxIterations: 120` pour avoir une marge confortable (quelques retries, plusieurs appels parallèles). Configuration spécifique au mode `invoice-filing`.

### Coût estimé

Pour ~15 factures/mois et un cron quotidien :
- LLM extraction (Haiku 4.5 vision côté serveur) : ~1ct/facture × 15 = 15ct/mois
- LLM agent les jours avec contenu (~5–10 jours/mois) : 5–10ct par mission = 25–100ct/mois
- LLM agent les jours vides (~20–25 jours/mois) : ~0.5ct par mission (1 tool call qui retourne `[]`, terminate) = ~10ct/mois

**Total attendu : ~50ct–1€/mois**

⚠️ **Optimisation critique** : `gmail_list_invoices` retourne `{ emails: [] }` si rien à traiter. Le prompt du mode doit explicitement instructer : *"Si la liste est vide, retourne 'Rien à traiter aujourd'hui' immédiatement sans appeler d'autres tools."* Sans ça, certains modèles bouclent inutilement.

## Erreurs et edge cases

| Cas | Comportement |
|---|---|
| Mail sans pièce jointe PDF | `gmail_list_invoices` filtre. Le mail reste avec son label `facture`, l'agent ne le traite pas. Visible dans le label Gmail. |
| Plusieurs PDFs dans un mail | L'agent traite chacun comme une facture séparée. Risque de doublon accepté. |
| Extraction LLM faible confidence (< 0.7) | Tool retourne `error: "low_confidence"`. Agent crée un todo + skip + ne relabel pas. |
| Date impossible (futur > 30j, ou < 2020) | Tool retourne `error: "invalid_date"`. Même comportement → todo + skip. |
| Upload Drive échoue (réseau, quota, dossier supprimé) | Tool retourne `error`. Skip ce mail, log dans `agentLogs`, continue les autres. |
| Refresh token Google révoqué | `getValidAccessToken` lève. Mission échoue avec message clair. `connections.status` passe en `"error"`. UI affiche "Reconnecter Google". |
| Doublon (mail relabel mais pipeline crashed entre upload et suggestion) | Au prochain run : index `by_user_message` détecte qu'une suggestion existe déjà → `create_invoice_suggestion` retourne l'ID existant, pas d'erreur. |
| Fichier de même nom dans Drive | Suffixe auto `_2`, `_3`. Pas d'overwrite. |
| Conflit de fournisseur (LLM dit "OVH" mais le mail vient de "ovhcloud.com") | On garde la version LLM (qui lit le PDF, plus fiable). |
| Suggestion orpheline (PDF uploadé mais création de suggestion crash) | Acceptable. Le fichier est dans Drive, tu peux le voir. Pas de cleanup automatique pour rester simple. |

### Diagramme du flow par mail

```
┌─────────────┐
│ list emails │ (filtrés label + PDF présent)
└──────┬──────┘
       │
       ▼ pour chaque mail (boucle LLM)
┌─────────────────┐
│ extract metadata│ ──fail──► todo + skip (mail reste labelé)
└──────┬──────────┘
       │ ok
       ▼
┌─────────────────┐
│ upload Drive    │ ──fail──► log error + skip
└──────┬──────────┘
       │ ok
       ▼
┌─────────────────┐
│ create suggest. │ ──fail──► log error + skip (orphan PDF acceptable)
└──────┬──────────┘
       │ ok
       ▼
┌─────────────────┐
│ relabel Gmail   │ ──fail──► log warning, suggestion existe déjà,
└─────────────────┘             prochain run skip via index
```

## Tests

### Unitaires Convex (`apps/ops/convex/google.test.ts`)

- `extractInvoiceMetadata` avec un PDF de référence (mock du client Anthropic) → assert vendor/date/montant attendus
- `drive.uploadInvoice` avec mock de googleapis → assert path et nom de fichier corrects
- `gmail.applyProcessedLabel` → assert ops add/remove labels correctes
- Nommage de fichier :
  - `2026-04-11_OVH_23.99.pdf` cas standard
  - Vendor avec espace : `2026-04-11_Notion-Labs_15.00.pdf`
  - Suffixe collision : `2026-04-11_OVH_23.99_2.pdf`
  - Caractères non-ASCII supprimés
- `getValidAccessToken` :
  - Token valide → retourne tel quel
  - Token expiré → refresh + write back
  - Pas de connection → throw clair

### Schema/integration (`apps/ops/convex/expenseSuggestions.test.ts` à étendre)

- Création d'une suggestion `source: "gmail"` avec tous les nouveaux champs
- `accept()` d'une suggestion gmail crée un `expense` avec `driveFileId`, `driveWebViewLink`, `gmailMessageId` propagés
- `accept()` d'une suggestion qonto continue de fonctionner (regression)
- Idempotence : créer 2x la même suggestion (même `gmailMessageId`) → retourne le même `_id`

### Pas de E2E pour le bouclage agent

Trop coûteux à mettre en place pour ce volume. La validation se fait en lançant l'agent en vrai sur un label de test (`facture-test`) avant de basculer sur `facture` en production.

### Fixtures

Dossier `apps/ops/convex/test-fixtures/invoices/` avec ~5 PDFs anonymisés (OVH, Notion, SNCF, Anthropic, restaurant) + un JSON `expected.json` listant les valeurs attendues d'extraction. Permet de valider l'extraction sans hit l'API LLM (mock du client Anthropic dans les tests, on retourne ce que `expected.json` dit).

## Out of scope (explicitement)

- Factures émises (clients) — traité par un autre flux
- Détection de factures sans label `facture` (heuristique sur sender/subject) — manuel uniquement
- OCR sur des PDFs scannés de très mauvaise qualité (Haiku vision gère le standard, on ne pousse pas plus loin)
- Cleanup automatique des PDFs orphelins dans Drive
- UI de "réessayer une suggestion ratée" dans Ops — passe par le todo manuel
- Multi-utilisateurs (l'app est mono-user freelance)
- Support d'autres providers mail (Outlook, iCloud) — Gmail uniquement

## Open questions / risques connus

1. **Accès au dossier parent Drive** — le scope `drive.file` impose un share manuel. Si tu oublies cette étape, l'app ne pourra pas créer le sous-dossier `YYYY/MM` et échouera. À documenter clairement dans l'UI Settings (avec une étape "Test de connexion" qui crée un fichier dummy puis le supprime).
2. **Qualité d'extraction Haiku vision** — non testée à ce jour sur tes vrais PDFs. Phase de validation à prévoir : utiliser un label `facture-test` pendant 1–2 semaines avant de basculer sur `facture` en production.
3. **Coût du cron quotidien** — l'optimisation "list vide → terminer immédiatement" est critique. À monitorer pendant le premier mois ; si dérive > 2€/mois, basculer le cron en hebdomadaire ou ne déclencher que via webhook Gmail push.
4. **Pas de webhook Gmail push** — Gmail propose un Pub/Sub push pour notifier les nouveaux mails. On utilise du polling cron au lieu de ça pour rester simple (Pub/Sub demande un endpoint HTTPS public + topic GCP). Si le coût du cron devient un problème, c'est l'optimisation logique suivante.
