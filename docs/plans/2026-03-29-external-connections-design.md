# External Connections — Design Document

> Système de connexions d'apps externes (Google Drive, Gmail, Notion, Airtable...)
> dans Blazz Ops, configurable depuis les settings et accessible par les agents.

Date: 2026-03-29

---

## Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Auth model | Hybrid — OAuth2 for Google/Notion, API key for Airtable etc. | Google requires OAuth, simpler services work fine with API keys |
| Credential storage | Convex `connections` table, tokens in clear | Single-user freelance app, acceptable trade-off |
| Access granularity | Per agent — join table `agentConnections` | Clean relational model, no orphan cleanup needed |
| Config UI | Centralized `/settings/connections` + tab per agent | Global view for managing connections, per-agent dispatch |
| Agent tools | Typed per provider (adapter pattern) | Reliable, no hallucinated endpoints, fits existing tool registry |
| MVP scope | Read-only tools | Write tools (send mail, create Notion page) deferred to V2 |

---

## 1. Data Model

### Table `connections`

```typescript
connections: defineTable({
  userId: v.id("users"),
  provider: v.string(),           // "google_drive" | "google_mail" | "notion" | "airtable"
  label: v.string(),              // User-facing name, e.g. "Google Drive perso"
  authType: v.union(v.literal("oauth2"), v.literal("api_key")),
  status: v.union(
    v.literal("active"),
    v.literal("expired"),
    v.literal("error"),
    v.literal("disconnected"),
  ),

  // OAuth2 fields
  accessToken: v.optional(v.string()),
  refreshToken: v.optional(v.string()),
  tokenExpiresAt: v.optional(v.number()),   // timestamp ms
  scopes: v.optional(v.array(v.string())),

  // API key field
  apiKey: v.optional(v.string()),

  // Account info (fetched post-auth)
  accountInfo: v.optional(v.object({
    email: v.optional(v.string()),
    name: v.optional(v.string()),
    avatar: v.optional(v.string()),
  })),

  // Tracking
  lastUsedAt: v.optional(v.number()),
  apiCallsToday: v.optional(v.number()),    // V2: rate limiting
  errorMessage: v.optional(v.string()),
})
  .index("by_user", ["userId"])
  .index("by_user_provider", ["userId", "provider"]),
```

### Table `agentConnections` (join table)

```typescript
agentConnections: defineTable({
  userId: v.id("users"),
  agentId: v.id("agents"),
  connectionId: v.id("connections"),
  addedAt: v.number(),
})
  .index("by_agent", ["agentId"])
  .index("by_connection", ["connectionId"]),
```

Replaces the `connectionIds` array on `agents` — no orphan cleanup needed.
If a connection is deleted, queries on `agentConnections` naturally return nothing.

### Provider Registry (`lib/connections/providers.ts`)

```typescript
type ProviderDef = {
  id: string                     // "google_drive"
  name: string                   // "Google Drive"
  icon: string                   // lucide icon name
  authType: "oauth2" | "api_key"
  description: string
  capabilities: string[]         // ["Recherche", "Lecture"] — shown in UI
  // OAuth2
  authUrl?: string
  tokenUrl?: string
  scopes?: string[]
  // Tools exposed
  tools: string[]                // ["google_drive_search", "google_drive_read", "google_drive_list"]
}
```

---

## 2. Auth Flows

### OAuth2 (Google Drive, Gmail, Notion)

```
[Settings UI] → Click "Connecter"
    ↓
[GET /api/connections/[provider]/authorize]
    → Generate signed state (JWT: provider + userId + exp 5min)
    → Store state in httpOnly cookie
    → Redirect to provider authUrl with scopes + redirect_uri
    ↓
[Provider consent screen]
    → User accepts
    → Redirect to /api/connections/[provider]/callback?code=...&state=...
    ↓
[GET /api/connections/[provider]/callback]
    → Verify state JWT (signature + expiry)
    → Exchange code → access_token + refresh_token
    → Health check: call a simple endpoint to verify token works
      (e.g. GET /drive/v3/about for Google Drive)
    → Fetch account info (email, name, avatar)
    → Mutation: connections.create({ provider, tokens, accountInfo, status: "active" })
    → Redirect to /settings/connections with success toast
```

**Per-provider callback** (`/api/connections/[provider]/callback`) instead of a
single shared callback — simpler routing, no state-encoded provider to decode.

### API Key (Airtable, simple services)

```
[Settings UI] → Click "Connecter"
    → Dialog with input field for API key
    → On submit: test the key with a simple API call
    → If valid: mutation connections.create({ provider, apiKey, status: "active" })
    → If invalid: inline error "Clé invalide — vérifiez et réessayez"
```

### Token Refresh

- Before each tool execution, `ensureFreshToken(connectionId)` checks `tokenExpiresAt`
- If `tokenExpiresAt < Date.now() + 60_000` (1 min margin) → refresh via `refreshToken` + `tokenUrl`
- If refresh fails → `status = "expired"` + `errorMessage` set on the connection
- **Auto-notification**: create a notification in the `notifications` table
  ("Connexion Google Drive expirée — reconnectez-la dans Paramètres > Connexions")
- Agent receives a clear error: "La connexion Google Drive a expiré. Jonathan a été notifié."

---

## 3. Provider Adapters & Tools

### File structure

```
lib/connections/
├── providers.ts              ← Provider registry (metadata, scopes, icons, capabilities)
├── ensure-fresh-token.ts     ← OAuth2 refresh helper
└── adapters/
    ├── google-drive.ts       ← Tools: search, read, list
    ├── google-mail.ts        ← Tools: search, read, list_labels
    ├── notion.ts             ← Tools: search, read_page, query_database
    └── airtable.ts           ← Tools: list_records, get_record, search
```

### Adapter anatomy

```typescript
// lib/connections/adapters/google-drive.ts
export const googleDriveTools = {
  google_drive_search: {
    description: "Search files in Google Drive by name or content",
    parameters: z.object({ query: z.string() }),
    execute: async (args, connection) => {
      const token = await ensureFreshToken(connection)
      const res = await fetch(
        `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(args.query)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      return res.json()
    }
  },
  google_drive_read: { /* ... */ },
  google_drive_list: { /* ... */ },
}
```

### Integration in agent chat

In `/api/agents/[slug]/chat/route.ts`, after loading agent permissions:

```
1. Load agent permissions (existing)
2. Query agentConnections for this agent
3. For each active connection → import tools from the matching adapter
4. Filter tools through permissions (safe/confirm/blocked) — connection tools
   use the same system. New tools default to "safe" when a connection is enabled.
5. Inject into AI model
```

Connection tools are indistinguishable from built-in tools in the permission model.
E.g. Marc (CFO) could have `google_drive_search` in `safe` and `google_mail_read` in `confirm`.

---

## 4. UI

### Page `/settings/connections`

Uses `SettingsPage` + `SettingsHeader` (same pattern as agents settings page).
Provider cards in an `InlineGrid columns={3}`.

```tsx
<SettingsPage>
  <SettingsHeader
    title="Connexions"
    description="Connectez vos applications externes pour les rendre accessibles à vos agents."
  />
  <InlineGrid columns={3} gap="300">
    {providers.map((provider) => (
      <ConnectionCard key={provider.id} provider={provider} connection={...} />
    ))}
  </InlineGrid>
</SettingsPage>
```

### ConnectionCard

```tsx
<Box padding="4" background="surface" border="default" borderRadius="lg">
  <BlockStack gap="300">
    {/* Header: icon + name + status badge */}
    <InlineStack gap="200" blockAlign="center" align="space-between">
      <InlineStack gap="200" blockAlign="center">
        <ProviderIcon />
        <span className="text-sm font-medium text-fg">{provider.name}</span>
      </InlineStack>
      {connection && (
        <Badge variant={connection.status === "active" ? "success" : "warning"}>
          {statusLabel}
        </Badge>
      )}
    </InlineStack>

    {/* Capabilities — always visible */}
    <InlineStack gap="100" wrap>
      {provider.capabilities.map((cap) => (
        <Badge key={cap} variant="outline" className="text-xs">{cap}</Badge>
      ))}
    </InlineStack>

    {/* Account info if connected */}
    {connection?.accountInfo && (
      <InlineStack gap="200" blockAlign="center">
        <Avatar src={accountInfo.avatar} size="xs" />
        <span className="text-xs text-fg-muted">{accountInfo.email}</span>
      </InlineStack>
    )}

    {/* Action button */}
    <Button
      variant={connection ? "outline" : "secondary"}
      size="sm"
      className="w-full"
    >
      {connection ? "Déconnecter" : "Connecter"}
    </Button>
  </BlockStack>
</Box>
```

### Agent settings — Connections tab

New tab in `/settings/agents/[slug]`. Shows only active connections with checkboxes.
When checked, lists the concrete tools the connection unlocks.

```tsx
<BlockStack gap="300">
  {userConnections.filter(c => c.status === "active").map((conn) => (
    <Box key={conn._id} padding="4" background="surface" border="default" borderRadius="md">
      <BlockStack gap="200">
        <InlineStack gap="200" blockAlign="center" align="space-between">
          <InlineStack gap="200" blockAlign="center">
            <ProviderIcon provider={conn.provider} />
            <BlockStack gap="050">
              <span className="text-sm font-medium">{conn.label}</span>
              <span className="text-xs text-fg-muted">{providerDef.description}</span>
            </BlockStack>
          </InlineStack>
          <Checkbox
            checked={isLinked}
            onCheckedChange={...}
          />
        </InlineStack>

        {/* Show unlocked tools when checked */}
        {isLinked && (
          <InlineStack gap="100" wrap>
            {providerDef.tools.map((tool) => (
              <Badge key={tool} variant="outline" className="text-xs">{tool}</Badge>
            ))}
          </InlineStack>
        )}
      </BlockStack>
    </Box>
  ))}
</BlockStack>
```

### Navigation

Add "Connexions" to `settingsNav` in the layout, group "Général", with the `Plug` Lucide icon.

### 4 required states

| State | Implementation |
|-------|---------------|
| Loading | 3 `Skeleton` cards (h-40 rounded-lg) in the InlineGrid |
| Empty | Cannot happen — provider catalog is static |
| Error | `ErrorState` with retry on user connections fetch |
| Success | Provider cards grid |

---

## 5. Security & Token Lifecycle

- Tokens stored in clear in Convex (acceptable for single-user freelance app)
- Future hardening: AES-256 encryption server-side with key in Convex env vars
- Minimal scopes per provider (e.g. `drive.readonly` for Google Drive MVP)
- Scopes displayed to user before connection in the OAuth consent screen
- Disconnection: delete tokens, revoke at provider endpoint if available, set `status = "disconnected"`
- Token refresh: automatic via `ensureFreshToken()`, with 1 min margin before expiry
- On refresh failure: `status = "expired"` + notification created in `notifications` table
- Post-OAuth health check: simple API call to verify token and scopes work

---

## 6. Out of Scope (V2)

- Write tools (send mail, create Notion page, update Airtable record)
- Token encryption (AES-256)
- Per-mission connection access
- MCP-style dynamic tool discovery
- Multiple accounts per provider
- Rate limiting / API call tracking per connection
- Per-provider callback deduplication
