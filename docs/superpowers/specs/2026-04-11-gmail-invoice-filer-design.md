# Gmail Invoice Filer — Design

**Date:** 2026-04-11 (rev. 2026-04-12)
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
│   • attachmentClaims.claim            (lock par attachment)     │
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
│  Loop: pour chaque mail → pour chaque attachment PDF →          │
│         claim → extraction → upload → suggest.                  │
│         Relabel le mail quand TOUS ses attachments sont traités. │
└─────────────────────────────────────────────────────────────────┘
```

### Principes

- **Unité de travail = attachment** — un mail peut contenir plusieurs PDFs (facture + avoir, etc.). Chaque attachment est traité, claimé, et tracé individuellement via la clé composite `(gmailMessageId, gmailAttachmentId)`. Le relabel du mail (message-level) ne se fait que quand tous ses attachments sont en état terminal.
- **Claim atomique avant tout travail coûteux** — avant d'extraire ou d'uploader quoi que ce soit, `process_invoice_pdf` tente un claim transactionnel dans la table `attachmentClaims`. Si le claim échoue (attachement déjà traité ou en cours par une mission concurrente), le tool retourne `{ skipped: "already_claimed" }` sans LLM call ni upload. Ceci empêche deux missions (cron + bouton manuel) de dupliquer le travail ou les fichiers Drive.
- **Auth réutilisée** — table `connections` existante (provider `"google"`, OAuth2 + refresh token). Une seule connection couvre Gmail + Drive.
- **Pas de tokens dans le worker** — les actions Convex chargent et rafraîchissent les tokens en interne. Le worker ne voit jamais les credentials.
- **Pas de base64 dans le LLM context** — le PDF voyage de Gmail vers Anthropic vision API côté serveur Convex uniquement. L'agent ne reçoit que des métadonnées extraites.

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
      attachmentId: string
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
} | { skipped: "already_claimed" | "already_terminal" }
  | { error: "low_confidence" | "invalid_date" | "extraction_failed" }
```

Séquence interne :

1. **Claim** — appelle la mutation `attachmentClaims.claim(messageId, attachmentId, missionId)`. La mutation est transactionnelle (Convex serializable) :
   - Si aucun row n'existe → insert `status: "claimed"`, retourne `{ claimed: true }`
   - Si un row existe en état terminal (`uploaded`, `suggested`, `failed`) → retourne `{ claimed: false, terminal: true }`
   - Si un row existe en état `claimed` ET `claimedAt < now - 10min` (stale) → patch pour re-claim, retourne `{ claimed: true }`
   - Si un row existe en état `claimed` ET `claimedAt >= now - 10min` → retourne `{ claimed: false, locked: true }`
2. Si claim échoue → retourne `{ skipped: "already_claimed" | "already_terminal" }`. **Aucune extraction ni API call.**
3. Si claim OK → fetch le PDF depuis Gmail (binaire) → envoie à l'API Anthropic Haiku 4.5 vision avec un prompt structuré → parse la réponse JSON
4. Le base64 ne quitte jamais Convex
5. Si confidence < 0.7 ou date hors range plausible (< 2020 ou > today + 30j) → patch claim `status: "failed"`, retourne `{ error: "..." }`
6. Si extraction OK → patch claim `status: "extracted"` (étape intermédiaire), retourne les métadonnées

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
- Auto-crée le sous-dossier `YYYY/MM` dans le dossier parent (obtenu via Picker à l'onboarding) si absent
- Si un fichier de même nom existe : suffixe `_2`, `_3`...
- En cas de succès → patch claim `status: "uploaded"`, stocke `driveFileId` sur le claim

### 4. `create_invoice_suggestion`

```ts
create_invoice_suggestion({
  messageId: string,
  attachmentId: string,
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
- Avant insertion : check via index `by_user_attachment` qu'aucune suggestion n'existe déjà pour ce `(gmailMessageId, gmailAttachmentId)`
- Si une existe : pas d'erreur, retourne l'`_id` existant (idempotence)
- En cas de succès → patch claim `status: "suggested"`, stocke `suggestionId`

### 5. `gmail_mark_processed`

```ts
gmail_mark_processed({ messageId: string }): {
  ok: true
  relabeled: boolean  // false si certains attachments ne sont pas terminaux
}
```

- Avant de relabeler : requête `attachmentClaims` pour ce `messageId`. Vérifie que **tous** les attachments ont un status terminal (`suggested`, `failed`).
  - Si tous terminaux → retire le label `facture`, ajoute `facture/traitée`, retourne `{ ok: true, relabeled: true }`
  - Si certains encore en cours (`claimed`, `extracted`, `uploaded`) → ne relabel PAS, retourne `{ ok: true, relabeled: false }`. L'agent est informé et peut retenter ou créer un todo.
- Crée le label `facture/traitée` au premier appel s'il n'existe pas
- Patch les claims terminaux à `status: "relabeled"`

## Schema changes (Convex)

### `attachmentClaims` — NOUVEAU : lock et état par attachment

```ts
attachmentClaims: defineTable({
  userId: v.string(),
  gmailMessageId: v.string(),
  gmailAttachmentId: v.string(),
  missionId: v.optional(v.string()),  // ID de la mission qui a claimé
  status: v.union(
    v.literal("claimed"),     // lock acquis, extraction en cours
    v.literal("extracted"),   // métadonnées extraites, pas encore uploadé
    v.literal("uploaded"),    // fichier dans Drive, suggestion pas encore créée
    v.literal("suggested"),   // suggestion créée dans expenseSuggestions
    v.literal("relabeled"),   // mail relabelé dans Gmail, terminé
    v.literal("failed"),      // échec non-récupérable (low confidence, etc.)
  ),
  driveFileId: v.optional(v.string()),
  suggestionId: v.optional(v.id("expenseSuggestions")),
  errorMessage: v.optional(v.string()),
  claimedAt: v.number(),
  updatedAt: v.number(),
})
  .index("by_user_message_attachment", ["userId", "gmailMessageId", "gmailAttachmentId"])
  .index("by_user_message", ["userId", "gmailMessageId"])  // pour gmail_mark_processed
  .index("by_user_status", ["userId", "status"])
```

**Rôles de cette table :**
1. **Claim/lock** — empêche deux missions concurrentes de traiter le même PDF
2. **État du pipeline** — sait exactement où en est chaque attachment (utile pour debug, retry)
3. **Stale recovery** — claim de plus de 10min sans progression → éligible au re-claim
4. **Condition de relabel** — `gmail_mark_processed` vérifie que tous les claims d'un message sont terminaux

**Concurrency model :** Les mutations Convex sont sérialisables. `claimAttachment()` fait un read-then-insert/patch atomique dans une seule mutation. Deux appels concurrents (cron + bouton) sont sérialisés par Convex OCC. Le premier commit gagne, le second voit le row existant et retourne `{ claimed: false }`. Aucun risque de double-upload ni double-suggestion.

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
  gmailAttachmentId: v.optional(v.string()),   // ← attachment-level
  driveFileId: v.optional(v.string()),
  driveWebViewLink: v.optional(v.string()),
  invoiceNumber: v.optional(v.string()),
  currency: v.optional(v.string()),
})
  .index("by_user_status", ["userId", "status"])
  .index("by_user_txn", ["userId", "qontoTransactionId"])
  .index("by_user_attachment", ["userId", "gmailMessageId", "gmailAttachmentId"])  // ← composite
```

⚠️ **Migration** : `source` devient une union, et `qontoTransactionId` devient optional. Les rows existants restent valides (déjà tous source `"qonto"` avec `qontoTransactionId` set). Aucun backfill nécessaire.

⚠️ **Code à mettre à jour** : `convex/expenseSuggestions.ts` `accept()` actuellement insert dans `expenses` avec `qontoTransactionId`. Faut adapter pour propager `driveFileId`/`driveWebViewLink`/`gmailMessageId`/`gmailAttachmentId` quand source = gmail.

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
  driveFileId: v.optional(v.string()),           // ← nouveau
  driveWebViewLink: v.optional(v.string()),      // ← nouveau
  gmailMessageId: v.optional(v.string()),        // ← nouveau (traçabilité)
  gmailAttachmentId: v.optional(v.string()),     // ← nouveau (attachment-level)
  vendor: v.optional(v.string()),                // ← nouveau (utilisé seulement pour type "invoice")
  invoiceNumber: v.optional(v.string()),         // ← nouveau
})
```

⚠️ **Pourquoi étendre `type`** : actuellement `expenses.type` ne supporte que `"restaurant"` et `"mileage"`. Sans extension, `accept()` d'une suggestion gmail crasherait au moment de l'insertion dans `expenses`. On ajoute `"invoice"` pour couvrir les factures fournisseurs (OVH, Notion, SaaS, etc.). Migration : aucun row existant n'est cassé (les anciens restent `"restaurant"` ou `"mileage"`).

⚠️ **Code à mettre à jour** : `convex/expenses.ts` doit accepter le nouveau type dans ses validateurs et ne pas exiger les champs `restaurant`-spécifiques (`guests`, `purpose`) ou `mileage`-spécifiques (`distanceKm`, etc.) pour ce type. L'UI expense list/detail ajoutera un rendu spécifique au type `"invoice"` (vendor, invoice number, bouton "Voir le PDF" qui ouvre `driveWebViewLink`).

### `settings` — aucun changement de schema

La table `settings` est un K/V `(userId, key, value)` avec helpers `get(key)`, `set(key, value)`. L'ID du dossier Drive parent sera stocké sous la clé `googleDriveInvoiceFolderId` via `settings.set("googleDriveInvoiceFolderId", folderId)`. Pas de modification du schema.

### `providerConfigs` — pas de changement

Réutilisation de la table existante. Une row `provider: "google"` sera créée à la configuration initiale.

## Auth Google — flow OAuth + Picker

### Setup une fois (manuel)

1. Créer un projet Google Cloud + OAuth client (type "Web app")
2. Activer les APIs : Gmail API, Google Drive API, Google Picker API
3. Configurer redirect URI : `https://<convex-deployment>.convex.site/oauth/google/callback`
4. Copier clientId + clientSecret + API key (Picker requiert une API key distincte)

### Configuration via UI Ops (page Settings → Connections)

1. **Credentials** — Section "Google" avec trois champs : Client ID, Client Secret, API Key → bouton "Sauvegarder" (écrit dans `providerConfigs` provider=`"google"`)

2. **OAuth consent** — Bouton "Connecter Google" → redirige vers consent screen Google avec scopes :
   - `https://www.googleapis.com/auth/gmail.modify` (lire mails + modifier labels, pas de suppression)
   - `https://www.googleapis.com/auth/drive.file` (créer/écrire seulement les fichiers que l'app crée OU que l'utilisateur ouvre/sélectionne via Picker)

3. **Callback** — Convex HTTP action `oauth/google/callback` :
   - Échange `code` contre `{ accessToken, refreshToken, expiresIn }`
   - Écrit dans `connections` provider=`"google"` avec `authType: "oauth2"`, `status: "active"`

4. **Sélection du dossier Drive via Picker** — Après connexion réussie, un bouton "Choisir le dossier factures" ouvre le Google Picker en mode dossier. L'utilisateur navigue jusqu'à son dossier `Compta/Factures` et le sélectionne.

   Le Picker SDK retourne le folder ID. Le scope `drive.file` accorde alors à l'app le droit de créer des fichiers et sous-dossiers dans ce dossier spécifique (le Picker agit comme un grant explicite de l'utilisateur). Le folder ID est stocké via `settings.set("googleDriveInvoiceFolderId", folderId)`.

   **Pourquoi Picker et pas un ID collé** : le scope `drive.file` ne donne accès qu'aux fichiers que l'app a créés ou que l'utilisateur a explicitement ouverts/sélectionnés avec l'app. Coller un folder ID dans un champ texte ne constitue pas un "explicit user selection" au sens de Google — l'API refuserait l'accès au dossier. Le Picker est le mécanisme officiel pour obtenir cet accès.

5. **Test de connexion** — Après sélection, le système crée un fichier test `_blazz_test.txt` dans le dossier, vérifie qu'il est lisible, puis le supprime. Si succès → affiche "Connexion Drive OK". Si échec → message d'erreur clair.

### Intégration Picker côté frontend

Le Google Picker est un SDK JavaScript qui s'exécute dans le navigateur. Intégration :

```ts
// Chargement du SDK (page Settings)
await gapi.load("picker")

// Ouverture du Picker en mode dossier
const picker = new google.picker.PickerBuilder()
  .addView(
    new google.picker.DocsView(google.picker.ViewId.FOLDERS)
      .setSelectFolderEnabled(true)
  )
  .setOAuthToken(accessToken)  // token de la connection active
  .setDeveloperKey(apiKey)     // API key du projet GCP
  .setCallback(handlePickerResult)
  .build()
picker.setVisible(true)
```

Le callback `handlePickerResult` récupère `response.docs[0].id` (folder ID) et appelle `settings.set("googleDriveInvoiceFolderId", folderId)`.

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
- ❌ Pas `drive` (full access à tout le Drive)
- ✅ `gmail.modify` — lire et modifier labels uniquement, pas de suppression
- ✅ `drive.file` — l'app ne voit que les fichiers qu'elle a créés + le dossier sélectionné via Picker. Zéro accès au reste du Drive.

## Account-manager — nouveau mode `invoice-filing`

### Ajout dans `apps/ops/agents/account-manager/SKILL.md`

```markdown
## invoice-filing
> Classer les factures fournisseurs reçues par mail.
Tools: gmail_list_invoices, process_invoice_pdf, drive_upload_invoice,
       create_invoice_suggestion, gmail_mark_processed, create_todo, ask_agent
Prompt: "Récupère tous les mails labelés 'facture' non encore traités via
gmail_list_invoices. Si la liste est vide, retourne 'Rien à traiter
aujourd'hui' immédiatement sans appeler d'autres tools.

Pour chaque mail, pour chaque attachment PDF :
1. Appelle process_invoice_pdf(messageId, attachmentId) pour claim + extraire.
   - Si retourne { skipped }, passe à l'attachment suivant (déjà traité).
   - Si retourne { error }, crée un todo 'Vérifier facture <subject> / <filename>'
     et passe au suivant.
2. drive_upload_invoice(messageId, attachmentId, vendor, date, amount)
3. create_invoice_suggestion(messageId, attachmentId, ...)

Quand TOUS les attachments d'un mail sont traités, appelle
gmail_mark_processed(messageId).
- Si relabeled: false, certains attachments sont encore en cours (mission
  concurrente ?) — laisse le mail, il sera relabelé au prochain run.

À la fin, résume : N factures classées, M ignorées (avec raisons), total TTC."
```

### Triggers

Deux triggers complémentaires :
- **Bouton manuel** dans Mission Control UI : "Lancer le filing factures" → crée une mission `account-manager` mode `invoice-filing`
- **Cron Convex quotidien** : 9h00 chaque jour ouvré → crée la mission automatiquement (ajouter à `apps/ops/convex/crons.ts`)

**Pas de mission-level lock** : la concurrency est gérée au niveau attachment (claim atomique). Deux missions concurrentes (cron + bouton) se répartissent le travail sans duplication. Si le bouton est cliqué pendant que le cron tourne, le pire qui arrive : certains claims retournent `{ skipped }` → zéro impact.

### `maxIterations`

Par attachment : ~4 tool calls (process + upload + suggest, plus list et mark_processed amortis). Pour un mail typique (1 PDF) : 5 calls. Pire cas 15 factures / 20 attachments : ~85 calls. On prend `maxIterations: 120` pour marge confortable (skips, retries, mark_processed calls). Configuration spécifique au mode `invoice-filing`.

### Coût estimé

Pour ~15 factures/mois et un cron quotidien :
- LLM extraction (Haiku 4.5 vision côté serveur) : ~1ct/facture × 15 = 15ct/mois
- LLM agent les jours avec contenu (~5–10 jours/mois) : 5–10ct par mission = 25–100ct/mois
- LLM agent les jours vides (~20–25 jours/mois) : ~0.5ct par mission (1 tool call qui retourne `[]`, terminate) = ~10ct/mois

**Total attendu : ~50ct–1€/mois**

## Erreurs et edge cases

| Cas | Comportement |
|---|---|
| Mail sans pièce jointe PDF | `gmail_list_invoices` filtre. Le mail reste avec son label `facture`, l'agent ne le traite pas. Visible dans le label Gmail. |
| Plusieurs PDFs dans un mail | L'agent traite chaque attachment individuellement. Chacun a son propre claim, sa propre suggestion, son propre fichier Drive. Le mail n'est relabelé que quand tous les attachments sont en état terminal. |
| Extraction LLM faible confidence (< 0.7) | Tool retourne `{ error: "low_confidence" }`. Agent crée un todo + skip. Claim passe en `status: "failed"`. Le mail n'est PAS relabelé (cet attachment bloquant n'est pas terminal au sens du relabel — il est terminal au sens du claim, le prochain run ne le re-traitera pas). |
| Date impossible (futur > 30j, ou < 2020) | Tool retourne `{ error: "invalid_date" }`. Même comportement → todo + skip + claim `failed`. |
| Upload Drive échoue (réseau, quota, dossier supprimé) | Tool retourne `{ error }`. Skip ce attachment, claim reste en `extracted`. Sera re-traité au prochain run (re-claimable car stale après 10min). |
| Refresh token Google révoqué | `getValidAccessToken` lève. Mission échoue avec message clair. `connections.status` passe en `"error"`. UI affiche "Reconnecter Google". |
| Missions concurrentes (cron + bouton simultanés) | La mutation `claimAttachment` est sérialisable (Convex OCC). Le premier claim gagne, le second voit `{ claimed: false }` → skip. Aucune extraction ni upload dupliqué. Les fichiers Drive ne sont jamais créés en double. |
| Claim stale (mission crash après claim, avant upload) | Claim de plus de 10 min sans progression (status `claimed` ou `extracted`) → éligible au re-claim par la prochaine mission. TTL = 10 min. |
| Fichier de même nom dans Drive | Suffixe auto `_2`, `_3`. Pas d'overwrite. |
| Conflit de fournisseur (LLM dit "OVH" mais le mail vient de "ovhcloud.com") | On garde la version LLM (qui lit le PDF, plus fiable). |
| Suggestion orpheline (PDF uploadé mais création de suggestion crash) | Le claim reste en `uploaded`. Prochain run : re-claimable (stale). La re-exécution verra le `driveFileId` déjà sur le claim et sautera directement à `create_invoice_suggestion`. **Pas de doublon Drive.** |
| Picker non complété (dossier pas sélectionné) | Les tools Drive échouent avec `error: "no_folder_configured"`. L'agent reçoit l'erreur, log, et termine. Résolu en allant dans Settings et en sélectionnant un dossier. |

### Diagramme du flow par mail

```
┌──────────────┐
│ list emails  │ (filtrés label + PDF présent)
└──────┬───────┘
       │
       ▼ pour chaque mail
       │
       ├──▶ pour chaque attachment PDF
       │    │
       │    ▼
       │    ┌──────────────┐
       │    │ claim + extract│ ──skipped──► next attachment
       │    └──────┬────────┘
       │           │ ok                    ──error──► todo + claim "failed"
       │           ▼
       │    ┌──────────────┐
       │    │ upload Drive  │ ──fail──► log, claim stays "extracted" (retry later)
       │    └──────┬────────┘
       │           │ ok
       │           ▼
       │    ┌──────────────────┐
       │    │ create suggestion │ ──fail──► log, claim stays "uploaded" (retry later)
       │    └──────┬───────────┘
       │           │ ok
       │           ▼ claim "suggested"
       │    ◄──────┘
       │
       ▼ tous attachments traités
┌───────────────────┐
│ gmail_mark_processed│ → relabel si TOUS terminaux
└────────────────────┘   sinon no-op (prochain run rattrapera)
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

### Claims (`apps/ops/convex/attachmentClaims.test.ts`)

- Claim sur attachment inexistant → insert + `{ claimed: true }`
- Claim sur attachment déjà claimé (< 10 min) → `{ claimed: false, locked: true }`
- Claim sur attachment stale (> 10 min, status `claimed`) → re-claim OK
- Claim sur attachment terminal (`suggested`, `relabeled`, `failed`) → `{ claimed: false, terminal: true }`
- Deux claims concurrents (simulés via 2 mutations séquentielles rapides) → un seul gagne
- `gmail_mark_processed` avec 3 attachments : 2 `suggested` + 1 `failed` → relabel OK (tous terminaux)
- `gmail_mark_processed` avec 2 attachments : 1 `suggested` + 1 `claimed` → pas de relabel

### Schema/integration (`apps/ops/convex/expenseSuggestions.test.ts` à étendre)

- Création d'une suggestion `source: "gmail"` avec tous les nouveaux champs (dont `gmailAttachmentId`)
- `accept()` d'une suggestion gmail crée un `expense` avec `driveFileId`, `driveWebViewLink`, `gmailMessageId`, `gmailAttachmentId` propagés
- `accept()` d'une suggestion qonto continue de fonctionner (regression)
- Idempotence : créer 2x la même suggestion (même `gmailMessageId + gmailAttachmentId`) → retourne le même `_id`

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
- Mission-level lock — le claim atomique par attachment suffit, pas de mutex global sur les missions

## Open questions / risques connus

1. **Qualité d'extraction Haiku vision** — non testée à ce jour sur tes vrais PDFs. Phase de validation à prévoir : utiliser un label `facture-test` pendant 1–2 semaines avant de basculer sur `facture` en production.
2. **Coût du cron quotidien** — l'optimisation "list vide → terminer immédiatement" est critique. À monitorer pendant le premier mois ; si dérive > 2€/mois, basculer le cron en hebdomadaire ou ne déclencher que via webhook Gmail push.
3. **Pas de webhook Gmail push** — Gmail propose un Pub/Sub push pour notifier les nouveaux mails. On utilise du polling cron au lieu de ça pour rester simple (Pub/Sub demande un endpoint HTTPS public + topic GCP). Si le coût du cron devient un problème, c'est l'optimisation logique suivante.
4. **Sous-dossiers via Picker** — le scope `drive.file` + sélection Picker accorde l'accès au dossier sélectionné. La documentation Google indique que ceci permet de créer des fichiers dans ce dossier, mais la capacité à **créer des sous-dossiers** (`YYYY/MM`) doit être validée empiriquement lors de l'implémentation. Si ça ne fonctionne pas, fallback : créer la structure YYYY/MM à plat en préfixant les noms (`2026-04_OVH_23.99.pdf`) ou demander à l'utilisateur de sélectionner chaque sous-dossier mensuel.
5. **Claim TTL de 10 min** — choisi comme heuristique. Si les missions prennent plus de 10 min pour traiter un seul attachment (réseau lent, LLM queue), un claim pourrait être re-pris prématurément. À ajuster si observé en prod.
