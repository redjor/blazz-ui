# Hermes ↔ Blazz Ops — MCP Server — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Exposer 10 tools Blazz Ops (9 read + 1 write) en serveur MCP hébergé dans Convex, joignable par Hermes (sur Railway) via HTTP POST + JSON-RPC 2.0.

**Architecture:** Un fichier `apps/ops/shared/tool-schemas.ts` comme source unique de vérité des JSON schemas (importé par le worker + le handler MCP). `apps/ops/convex/mcp.ts` contient un dispatcher JSON-RPC pur (testable) + les handlers qui délèguent aux queries/mutations `api.worker.*` existantes. `convex/http.ts` expose `POST /mcp` (protégé par Bearer) et `GET /mcp` (health check public).

**Tech Stack:** Convex, TypeScript, vitest + convex-test, Node.js (worker), Hermes CLI (Railway).

**Spec source:** `apps/ops/docs/plans/2026-04-20-hermes-mcp-ops-design.md`

---

## File Structure

**Files créés :**
- `apps/ops/shared/tool-schemas.ts` — 10 JSON schemas partagés (data pure, aucun import runtime)
- `apps/ops/shared/tool-schemas.test.ts` — tests de parité + shape
- `apps/ops/convex/mcp.ts` — dispatcher JSON-RPC + handlers MCP
- `apps/ops/convex/mcp.test.ts` — tests unitaires du dispatcher (avec convex-test)

**Files modifiés :**
- `apps/ops/convex/schema.ts` — ajout table `mcpAuditLog`
- `apps/ops/convex/http.ts` — ajout routes `POST /mcp` + `GET /mcp`
- `apps/ops/convex/worker.ts` — ajout mutation `workerAppendMcpAudit`
- `apps/ops/worker/src/tools/finance.ts` — import depuis shared
- `apps/ops/worker/src/tools/time.ts` — import depuis shared
- `apps/ops/worker/src/tools/knowledge.ts` — import depuis shared + ajout `list_clients`

---

## Phase 1 — Schémas partagés (préreq)

### Task 1 : Créer le fichier de schémas partagés

**Files:**
- Create: `apps/ops/shared/tool-schemas.ts`
- Create: `apps/ops/shared/tool-schemas.test.ts`

- [ ] **Step 1.1 — Écrire le test d'abord**

Create `apps/ops/shared/tool-schemas.test.ts`:

```typescript
import { describe, expect, it } from "vitest"
import { MCP_TOOL_NAMES, TOOL_SCHEMAS, type ToolSchema } from "./tool-schemas"

describe("tool-schemas", () => {
	it("exports exactly 10 tools", () => {
		expect(TOOL_SCHEMAS).toHaveLength(10)
	})

	it("all tools have name, description, parameters", () => {
		for (const t of TOOL_SCHEMAS) {
			expect(t.name).toBeTruthy()
			expect(t.description).toBeTruthy()
			expect(t.parameters).toMatchObject({ type: "object" })
		}
	})

	it("all tool names are unique", () => {
		const names = TOOL_SCHEMAS.map((t) => t.name)
		expect(new Set(names).size).toBe(names.length)
	})

	it("MCP_TOOL_NAMES matches TOOL_SCHEMAS", () => {
		expect(MCP_TOOL_NAMES.sort()).toEqual(TOOL_SCHEMAS.map((t) => t.name).sort())
	})

	it("write tools are marked as such", () => {
		const writeTools = TOOL_SCHEMAS.filter((t) => t.category === "write")
		expect(writeTools.map((t) => t.name)).toEqual(["create_expense"])
	})

	it("all date params mention Europe/Paris timezone", () => {
		for (const t of TOOL_SCHEMAS) {
			const props = t.parameters.properties ?? {}
			for (const [key, schema] of Object.entries(props)) {
				if (key === "date" || key === "from" || key === "to") {
					const desc = (schema as { description?: string }).description ?? ""
					expect(desc).toMatch(/Europe\/Paris/)
				}
			}
		}
	})
})
```

- [ ] **Step 1.2 — Lancer le test (doit échouer : fichier inexistant)**

```bash
cd apps/ops && pnpm vitest run shared/tool-schemas.test.ts
```
Expected: FAIL with `Cannot find module './tool-schemas'`.

- [ ] **Step 1.3 — Créer le fichier de schémas**

Create `apps/ops/shared/tool-schemas.ts`:

```typescript
/**
 * Tool schemas partagés entre le worker (OpenAI function-calling) et le handler MCP.
 * Data pure : aucun import runtime (pas de Convex, pas d'OpenAI). Importable depuis
 * n'importe quel runtime TypeScript (Node worker, Convex httpAction, tests vitest).
 *
 * Toute date est YYYY-MM-DD en Europe/Paris. Les consumers sont responsables
 * de convertir les dates relatives ("hier", "today") dans cette TZ avant l'appel.
 */

export type ToolCategory = "read" | "write"

export type ToolSchema = {
	name: string
	category: ToolCategory
	description: string
	parameters: {
		type: "object"
		properties: Record<string, unknown>
		required?: readonly string[]
	}
}

export const TOOL_SCHEMAS: readonly ToolSchema[] = [
	{
		name: "qonto_balance",
		category: "read",
		description: "Get current Qonto bank account balance",
		parameters: { type: "object", properties: {}, required: [] },
	},
	{
		name: "qonto_transactions",
		category: "read",
		description: "List recent Qonto bank transactions. Returns the 10 most recent.",
		parameters: { type: "object", properties: {}, required: [] },
	},
	{
		name: "treasury_forecast",
		category: "read",
		description: "Get cashflow forecast: returns current settings + expenses summary for the agent to compute projections.",
		parameters: {
			type: "object",
			properties: {
				months: { type: "number", description: "Number of months to forecast (default 6)" },
			},
			required: [],
		},
	},
	{
		name: "list_invoices",
		category: "read",
		description: "List all invoices. Returns id, client, amount, status, dates.",
		parameters: {
			type: "object",
			properties: {
				status: { type: "string", enum: ["draft", "sent", "paid"], description: "Filter by status" },
			},
			required: [],
		},
	},
	{
		name: "list_expenses",
		category: "read",
		description: "List professional expenses (frais pro) — restaurants and mileage. Distinct from recurring expenses (subscriptions).",
		parameters: {
			type: "object",
			properties: {
				type: { type: "string", enum: ["restaurant", "mileage"], description: "Filter by type" },
				from: { type: "string", description: "Start date YYYY-MM-DD in Europe/Paris" },
				to: { type: "string", description: "End date YYYY-MM-DD in Europe/Paris" },
				limit: { type: "number", description: "Max entries (default 30, max 100)" },
			},
			required: [],
		},
	},
	{
		name: "list_time_entries",
		category: "read",
		description: "List time entries. Can filter by project and date range.",
		parameters: {
			type: "object",
			properties: {
				projectId: { type: "string", description: "Filter by project ID (Convex ID, use list_projects to discover)" },
				from: { type: "string", description: "Start date YYYY-MM-DD in Europe/Paris" },
				to: { type: "string", description: "End date YYYY-MM-DD in Europe/Paris" },
			},
			required: [],
		},
	},
	{
		name: "list_todos",
		category: "read",
		description: "List the user's todos. Useful to check what's on the user's plate or cross-reference work against time entries.",
		parameters: {
			type: "object",
			properties: {
				status: {
					type: "string",
					enum: ["triage", "todo", "blocked", "in_progress", "done"],
					description: "Filter by status.",
				},
				limit: { type: "number", description: "Max todos (default 50, max 100)" },
			},
			required: [],
		},
	},
	{
		name: "list_clients",
		category: "read",
		description: "List all clients with their Convex IDs. Use before create_expense when the user mentions a client by name.",
		parameters: { type: "object", properties: {}, required: [] },
	},
	{
		name: "list_projects",
		category: "read",
		description: "List all projects with their status, client, budget info, and Convex IDs.",
		parameters: { type: "object", properties: {}, required: [] },
	},
	{
		name: "create_expense",
		category: "write",
		description:
			"Create a professional expense (frais pro). Type 'restaurant' needs amountCents + guests + purpose. Type 'mileage' needs departure + destination + distanceKm (reimbursement is auto-computed via URSSAF scale if vehicle settings exist).",
		parameters: {
			type: "object",
			properties: {
				type: { type: "string", enum: ["restaurant", "mileage"], description: "Type of expense" },
				date: { type: "string", description: "Date YYYY-MM-DD in Europe/Paris" },
				amountCents: { type: "number", description: "Amount in cents (restaurant only)" },
				clientId: { type: "string", description: "Optional Convex client ID (discover via list_clients)" },
				projectId: { type: "string", description: "Optional Convex project ID (discover via list_projects)" },
				notes: { type: "string", description: "Free-form notes" },
				guests: { type: "string", description: "Restaurant: who was invited (e.g. 'Client X, 3 pers.')" },
				purpose: { type: "string", description: "Restaurant: business purpose" },
				departure: { type: "string", description: "Mileage: starting address/city" },
				destination: { type: "string", description: "Mileage: destination address/city" },
				distanceKm: { type: "number", description: "Mileage: distance in km" },
			},
			required: ["type", "date"],
		},
	},
] as const

export const MCP_TOOL_NAMES: readonly string[] = TOOL_SCHEMAS.map((t) => t.name)

export function getToolSchema(name: string): ToolSchema | undefined {
	return TOOL_SCHEMAS.find((t) => t.name === name)
}
```

- [ ] **Step 1.4 — Relancer le test**

```bash
cd apps/ops && pnpm vitest run shared/tool-schemas.test.ts
```
Expected: PASS, 6 tests all green.

- [ ] **Step 1.5 — Commit**

```bash
git add apps/ops/shared/tool-schemas.ts apps/ops/shared/tool-schemas.test.ts
git commit -m "feat(ops): add shared tool-schemas for MCP/worker parity"
```

---

### Task 2 : Migrer `finance.ts` pour importer depuis shared

**Files:**
- Modify: `apps/ops/worker/src/tools/finance.ts`

- [ ] **Step 2.1 — Remplacer les definitions inline par des imports**

Replace the entire content of `apps/ops/worker/src/tools/finance.ts` with:

```typescript
import type { ConvexHttpClient } from "convex/browser"
import { getToolSchema } from "../../../shared/tool-schemas"
import { api } from "../convex"
import type { Tool } from "./index"

function toOpenAIDef(name: string) {
	const schema = getToolSchema(name)
	if (!schema) throw new Error(`Unknown tool schema: ${name}`)
	return {
		type: "function" as const,
		function: {
			name: schema.name,
			description: schema.description,
			parameters: schema.parameters,
		},
	}
}

export function financeTools(convex: ConvexHttpClient): Tool[] {
	return [
		{
			name: "qonto_balance",
			category: "read",
			definition: toOpenAIDef("qonto_balance"),
			execute: async () => {
				const settings = await convex.query(api.worker.workerGetTreasurySettings, {})
				return {
					balanceCents: settings?.qontoBalanceCents ?? 0,
					balanceEur: (settings?.qontoBalanceCents ?? 0) / 100,
					lastUpdated: settings?._creationTime,
				}
			},
		},
		{
			name: "qonto_transactions",
			category: "read",
			definition: toOpenAIDef("qonto_transactions"),
			execute: async () => {
				try {
					return await convex.action(api.qonto.listTransactions, {})
				} catch {
					return { error: "Qonto API not configured or unavailable" }
				}
			},
		},
		{
			name: "treasury_forecast",
			category: "read",
			definition: toOpenAIDef("treasury_forecast"),
			execute: async () => {
				const [settings, expenses] = await Promise.all([
					convex.query(api.worker.workerGetTreasurySettings, {}),
					convex.query(api.worker.workerExpenseSummary, {}),
				])
				return { settings, expenses }
			},
		},
		{
			name: "list_invoices",
			category: "read",
			definition: toOpenAIDef("list_invoices"),
			execute: async (args) => {
				return convex.query(api.worker.workerListInvoices, args as any)
			},
		},
		{
			name: "list_expenses",
			category: "read",
			definition: toOpenAIDef("list_expenses"),
			execute: async (args) => {
				return convex.query(api.worker.workerListExpenses, {
					type: args.type as "restaurant" | "mileage" | undefined,
					from: args.from as string | undefined,
					to: args.to as string | undefined,
					limit: Math.min((args.limit as number) ?? 30, 100),
				})
			},
		},
		{
			name: "create_expense",
			category: "write",
			definition: toOpenAIDef("create_expense"),
			execute: async (args) => {
				return convex.mutation(api.worker.workerCreateExpense, args as any)
			},
		},
	]
}
```

**Note** : on a retiré `list_recurring_expenses` (hors scope MVP — voir spec). Le worker perd ce tool mais reste fonctionnel pour les autres.

- [ ] **Step 2.2 — Vérifier la compilation TypeScript**

```bash
cd apps/ops && pnpm tsc --noEmit -p worker/tsconfig.json 2>&1 | head -20
```
Expected: aucune erreur sur `finance.ts`. Si `list_recurring_expenses` est référencé ailleurs, corriger.

- [ ] **Step 2.3 — Commit**

```bash
git add apps/ops/worker/src/tools/finance.ts
git commit -m "refactor(ops): worker finance tools import schemas from shared"
```

---

### Task 3 : Migrer `time.ts` + ajouter `list_clients`

**Files:**
- Modify: `apps/ops/worker/src/tools/time.ts`
- Modify: `apps/ops/worker/src/tools/knowledge.ts`

- [ ] **Step 3.1 — Migrer `time.ts`**

Replace `apps/ops/worker/src/tools/time.ts`:

```typescript
import type { ConvexHttpClient } from "convex/browser"
import { getToolSchema } from "../../../shared/tool-schemas"
import { api } from "../convex"
import type { Tool } from "./index"

function toOpenAIDef(name: string) {
	const schema = getToolSchema(name)
	if (!schema) throw new Error(`Unknown tool schema: ${name}`)
	return {
		type: "function" as const,
		function: {
			name: schema.name,
			description: schema.description,
			parameters: schema.parameters,
		},
	}
}

export function timeTools(convex: ConvexHttpClient): Tool[] {
	return [
		{
			name: "list_time_entries",
			category: "read",
			definition: toOpenAIDef("list_time_entries"),
			execute: async (args) => {
				return convex.query(api.worker.workerListTimeEntries, args as any)
			},
		},
		{
			name: "list_projects",
			category: "read",
			definition: toOpenAIDef("list_projects"),
			execute: async () => {
				return convex.query(api.worker.workerListProjects, {})
			},
		},
	]
}
```

**Note** : on a retiré `check_time_anomalies` (hors scope MVP).

- [ ] **Step 3.2 — Modifier `knowledge.ts` : garder `list_todos`, ajouter `list_clients`, virer le reste**

Open `apps/ops/worker/src/tools/knowledge.ts`. Remplacer le contenu entier par :

```typescript
import type { ConvexHttpClient } from "convex/browser"
import { getToolSchema } from "../../../shared/tool-schemas"
import { api } from "../convex"
import type { Tool } from "./index"

function toOpenAIDef(name: string) {
	const schema = getToolSchema(name)
	if (!schema) throw new Error(`Unknown tool schema: ${name}`)
	return {
		type: "function" as const,
		function: {
			name: schema.name,
			description: schema.description,
			parameters: schema.parameters,
		},
	}
}

export function knowledgeTools(convex: ConvexHttpClient): Tool[] {
	return [
		{
			name: "list_todos",
			category: "read",
			definition: toOpenAIDef("list_todos"),
			execute: async (args) => {
				return convex.query(api.worker.workerListTodos, {
					status: args.status as string | undefined,
					limit: Math.min((args.limit as number) ?? 50, 100),
				})
			},
		},
		{
			name: "list_clients",
			category: "read",
			definition: toOpenAIDef("list_clients"),
			execute: async () => {
				return convex.query(api.worker.workerListClients, {})
			},
		},
	]
}
```

- [ ] **Step 3.3 — Vérifier que `worker/src/tools/index.ts` exporte bien les 3 fonctions**

```bash
grep -E "financeTools|timeTools|knowledgeTools" apps/ops/worker/src/tools/index.ts
```

Si un tool supprimé (`list_notes`, `list_bookmarks`, etc.) est encore référencé, l'enlever du registry.

- [ ] **Step 3.4 — Vérifier compilation**

```bash
cd apps/ops && pnpm tsc --noEmit -p worker/tsconfig.json 2>&1 | head -20
```
Expected: OK.

- [ ] **Step 3.5 — Commit**

```bash
git add apps/ops/worker/src/tools/time.ts apps/ops/worker/src/tools/knowledge.ts apps/ops/worker/src/tools/index.ts
git commit -m "refactor(ops): narrow worker tools to MVP scope + import from shared"
```

---

## Phase 2 — MCP handler dans Convex

### Task 4 : Ajouter la table `mcpAuditLog` au schema Convex

**Files:**
- Modify: `apps/ops/convex/schema.ts`

- [ ] **Step 4.1 — Ajouter la table dans schema.ts**

Ouvrir `apps/ops/convex/schema.ts` et ajouter cette table à la définition existante (juste avant la fermeture `})` du `defineSchema`) :

```typescript
	mcpAuditLog: defineTable({
		ts: v.number(), // Date.now()
		method: v.string(), // "tools/call" | "tools/list" | "initialize"
		tool: v.optional(v.string()), // tool name si tools/call
		success: v.boolean(),
		errorMessage: v.optional(v.string()),
		argsPreview: v.optional(v.string()), // JSON stringifié + tronqué à 500 chars, secrets retirés
	}).index("by_ts", ["ts"]),
```

- [ ] **Step 4.2 — Pousser le schema**

```bash
cd apps/ops && npx convex dev --once
```
Expected: `✓ Schema validated` puis `Convex functions ready!`.

- [ ] **Step 4.3 — Commit**

```bash
git add apps/ops/convex/schema.ts
git commit -m "feat(ops): add mcpAuditLog table"
```

---

### Task 5 : Ajouter la mutation audit log + query helper

**Files:**
- Modify: `apps/ops/convex/worker.ts`

- [ ] **Step 5.1 — Ajouter la mutation à la fin de `worker.ts`**

Append à la fin de `apps/ops/convex/worker.ts` :

```typescript
// ── MCP Audit Log ──

export const workerAppendMcpAudit = mutation({
	args: {
		method: v.string(),
		tool: v.optional(v.string()),
		success: v.boolean(),
		errorMessage: v.optional(v.string()),
		argsPreview: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		await ctx.db.insert("mcpAuditLog", {
			ts: Date.now(),
			method: args.method,
			tool: args.tool,
			success: args.success,
			errorMessage: args.errorMessage,
			argsPreview: args.argsPreview,
		})
	},
})
```

- [ ] **Step 5.2 — Push Convex**

```bash
cd apps/ops && npx convex dev --once
```

- [ ] **Step 5.3 — Commit**

```bash
git add apps/ops/convex/worker.ts
git commit -m "feat(ops): add workerAppendMcpAudit mutation"
```

---

### Task 6 : Écrire le dispatcher MCP (TDD)

**Files:**
- Create: `apps/ops/convex/mcp.ts`
- Create: `apps/ops/convex/mcp.test.ts`

- [ ] **Step 6.1 — Écrire les tests unitaires du dispatcher**

Create `apps/ops/convex/mcp.test.ts` :

```typescript
import { describe, expect, it } from "vitest"
import { TOOL_SCHEMAS } from "../shared/tool-schemas"
import { buildJsonRpcError, dispatchMcpRequest } from "./mcp"

describe("MCP JSON-RPC dispatcher", () => {
	it("returns error for non-JSON-RPC body", async () => {
		const res = await dispatchMcpRequest({ foo: "bar" } as any, {
			executeTool: async () => ({}),
			appendAudit: async () => {},
		})
		expect(res).toMatchObject({
			jsonrpc: "2.0",
			error: { code: -32600 },
		})
	})

	it("responds to initialize with capabilities", async () => {
		const res = await dispatchMcpRequest(
			{ jsonrpc: "2.0", id: 1, method: "initialize", params: {} },
			{ executeTool: async () => ({}), appendAudit: async () => {} }
		)
		expect(res).toMatchObject({
			jsonrpc: "2.0",
			id: 1,
			result: {
				protocolVersion: "2024-11-05",
				capabilities: { tools: {} },
				serverInfo: { name: "blazz-ops-mcp", version: expect.any(String) },
			},
		})
	})

	it("returns 10 tools on tools/list", async () => {
		const res = await dispatchMcpRequest(
			{ jsonrpc: "2.0", id: 2, method: "tools/list" },
			{ executeTool: async () => ({}), appendAudit: async () => {} }
		)
		expect(res.result.tools).toHaveLength(10)
		expect(res.result.tools[0]).toMatchObject({
			name: expect.any(String),
			description: expect.any(String),
			inputSchema: expect.objectContaining({ type: "object" }),
		})
	})

	it("dispatches tools/call to executeTool", async () => {
		let calledWith: { name: string; args: unknown } | null = null
		const res = await dispatchMcpRequest(
			{
				jsonrpc: "2.0",
				id: 3,
				method: "tools/call",
				params: { name: "qonto_balance", arguments: {} },
			},
			{
				executeTool: async (name, args) => {
					calledWith = { name, args }
					return { balanceEur: 1234 }
				},
				appendAudit: async () => {},
			}
		)
		expect(calledWith).toEqual({ name: "qonto_balance", args: {} })
		expect(res.result).toMatchObject({
			content: [{ type: "text", text: expect.stringContaining("1234") }],
			isError: false,
		})
	})

	it("returns isError:true when tool throws", async () => {
		const res = await dispatchMcpRequest(
			{
				jsonrpc: "2.0",
				id: 4,
				method: "tools/call",
				params: { name: "create_expense", arguments: {} },
			},
			{
				executeTool: async () => {
					throw new Error("Invalid clientId")
				},
				appendAudit: async () => {},
			}
		)
		expect(res.result).toMatchObject({
			content: [{ type: "text", text: expect.stringContaining("Invalid clientId") }],
			isError: true,
		})
	})

	it("rejects unknown tool name", async () => {
		const res = await dispatchMcpRequest(
			{
				jsonrpc: "2.0",
				id: 5,
				method: "tools/call",
				params: { name: "nuke_db", arguments: {} },
			},
			{ executeTool: async () => ({}), appendAudit: async () => {} }
		)
		expect(res.result).toMatchObject({
			isError: true,
			content: [{ type: "text", text: expect.stringContaining("Unknown tool") }],
		})
	})

	it("rejects unknown method", async () => {
		const res = await dispatchMcpRequest(
			{ jsonrpc: "2.0", id: 6, method: "resources/list" },
			{ executeTool: async () => ({}), appendAudit: async () => {} }
		)
		expect(res).toMatchObject({ error: { code: -32601 } })
	})

	it("audit log called on every tools/call", async () => {
		let audited: any = null
		await dispatchMcpRequest(
			{
				jsonrpc: "2.0",
				id: 7,
				method: "tools/call",
				params: { name: "qonto_balance", arguments: {} },
			},
			{
				executeTool: async () => ({ ok: true }),
				appendAudit: async (entry) => {
					audited = entry
				},
			}
		)
		expect(audited).toMatchObject({ method: "tools/call", tool: "qonto_balance", success: true })
	})

	it("buildJsonRpcError shape", () => {
		expect(buildJsonRpcError(42, -32601, "Method not found")).toEqual({
			jsonrpc: "2.0",
			id: 42,
			error: { code: -32601, message: "Method not found" },
		})
	})

	// Sanity check : le nombre de tools exposés matche bien 10
	it("shared TOOL_SCHEMAS has 10 entries", () => {
		expect(TOOL_SCHEMAS).toHaveLength(10)
	})
})
```

- [ ] **Step 6.2 — Lancer le test (doit échouer : fichier mcp.ts n'existe pas)**

```bash
cd apps/ops && pnpm vitest run convex/mcp.test.ts
```
Expected: FAIL with `Cannot find module './mcp'`.

- [ ] **Step 6.3 — Créer le dispatcher**

Create `apps/ops/convex/mcp.ts` :

```typescript
/**
 * MCP dispatcher — JSON-RPC 2.0 pur, testable sans runtime Convex.
 * Exporté comme fonction standalone ; la httpAction dans http.ts appelle
 * dispatchMcpRequest en lui passant un `executeTool` qui fait les ctx.runQuery.
 */
import { TOOL_SCHEMAS, getToolSchema } from "../shared/tool-schemas"

const SERVER_NAME = "blazz-ops-mcp"
const SERVER_VERSION = "0.1.0"
const PROTOCOL_VERSION = "2024-11-05"

export type JsonRpcRequest = {
	jsonrpc: "2.0"
	id?: number | string
	method: string
	params?: Record<string, unknown>
}

export type JsonRpcResponse = {
	jsonrpc: "2.0"
	id?: number | string
	result?: any
	error?: { code: number; message: string; data?: unknown }
}

export type McpAuditEntry = {
	method: string
	tool?: string
	success: boolean
	errorMessage?: string
	argsPreview?: string
}

export type McpDeps = {
	executeTool: (name: string, args: Record<string, unknown>) => Promise<unknown>
	appendAudit: (entry: McpAuditEntry) => Promise<void>
}

export function buildJsonRpcError(id: number | string | undefined, code: number, message: string): JsonRpcResponse {
	return { jsonrpc: "2.0", id, error: { code, message } }
}

function isJsonRpcRequest(body: unknown): body is JsonRpcRequest {
	if (typeof body !== "object" || body === null) return false
	const b = body as Record<string, unknown>
	return b.jsonrpc === "2.0" && typeof b.method === "string"
}

function argsPreview(args: Record<string, unknown>): string {
	const redacted = { ...args }
	// Aucun champ sensible dans notre scope, mais on tronque la taille
	try {
		const str = JSON.stringify(redacted)
		return str.length > 500 ? `${str.slice(0, 500)}...` : str
	} catch {
		return "[unserializable]"
	}
}

export async function dispatchMcpRequest(body: unknown, deps: McpDeps): Promise<JsonRpcResponse> {
	if (!isJsonRpcRequest(body)) {
		return buildJsonRpcError(undefined, -32600, "Invalid Request")
	}
	const { id, method, params } = body

	if (method === "initialize") {
		return {
			jsonrpc: "2.0",
			id,
			result: {
				protocolVersion: PROTOCOL_VERSION,
				capabilities: { tools: {} },
				serverInfo: { name: SERVER_NAME, version: SERVER_VERSION },
			},
		}
	}

	if (method === "tools/list") {
		return {
			jsonrpc: "2.0",
			id,
			result: {
				tools: TOOL_SCHEMAS.map((t) => ({
					name: t.name,
					description: t.description,
					inputSchema: t.parameters,
				})),
			},
		}
	}

	if (method === "tools/call") {
		const p = (params ?? {}) as { name?: string; arguments?: Record<string, unknown> }
		const toolName = p.name
		const toolArgs = p.arguments ?? {}

		if (!toolName || !getToolSchema(toolName)) {
			await deps.appendAudit({
				method,
				tool: toolName,
				success: false,
				errorMessage: "Unknown tool",
			})
			return {
				jsonrpc: "2.0",
				id,
				result: {
					content: [{ type: "text", text: `Unknown tool: ${toolName}` }],
					isError: true,
				},
			}
		}

		try {
			const result = await deps.executeTool(toolName, toolArgs)
			await deps.appendAudit({
				method,
				tool: toolName,
				success: true,
				argsPreview: argsPreview(toolArgs),
			})
			return {
				jsonrpc: "2.0",
				id,
				result: {
					content: [{ type: "text", text: JSON.stringify(result) }],
					isError: false,
				},
			}
		} catch (err) {
			const message = err instanceof Error ? err.message : String(err)
			await deps.appendAudit({
				method,
				tool: toolName,
				success: false,
				errorMessage: message,
				argsPreview: argsPreview(toolArgs),
			})
			return {
				jsonrpc: "2.0",
				id,
				result: {
					content: [{ type: "text", text: message }],
					isError: true,
				},
			}
		}
	}

	return buildJsonRpcError(id, -32601, `Method not found: ${method}`)
}
```

- [ ] **Step 6.4 — Relancer les tests**

```bash
cd apps/ops && pnpm vitest run convex/mcp.test.ts
```
Expected: PASS, 10 tests.

- [ ] **Step 6.5 — Commit**

```bash
git add apps/ops/convex/mcp.ts apps/ops/convex/mcp.test.ts
git commit -m "feat(ops): add MCP JSON-RPC dispatcher (pure, tested)"
```

---

### Task 7 : Ajouter la route HTTP `/mcp` + health check

**Files:**
- Modify: `apps/ops/convex/http.ts`

- [ ] **Step 7.1a — Ajouter les imports en haut du fichier**

Dans `apps/ops/convex/http.ts`, modifier la ligne 2 `import { internal } from "./_generated/api"` pour ajouter `api` :

```typescript
import { api, internal } from "./_generated/api"
```

Et ajouter juste après (ligne ~3) :

```typescript
import { dispatchMcpRequest } from "./mcp"
```

- [ ] **Step 7.1b — Ajouter les routes juste avant `export default http`**

Localiser la ligne `export default http` dans `apps/ops/convex/http.ts` et ajouter **juste avant** :

```typescript
// ── MCP Server (JSON-RPC 2.0 over HTTP POST) ──

// Health check — public, no auth. Ping pour vérifier que le serveur MCP tourne.
http.route({
	path: "/mcp",
	method: "GET",
	handler: httpAction(async () => {
		return new Response(JSON.stringify({ ok: true, server: "blazz-ops-mcp", version: "0.1.0" }), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		})
	}),
})

// Main MCP endpoint — Bearer-protected.
http.route({
	path: "/mcp",
	method: "POST",
	handler: httpAction(async (ctx, request) => {
		const expected = process.env.MCP_SECRET
		if (!expected) {
			return new Response("MCP_SECRET not configured", { status: 500 })
		}

		const auth = request.headers.get("Authorization") ?? ""
		const bearer = auth.startsWith("Bearer ") ? auth.slice(7) : ""
		if (bearer !== expected) {
			return new Response("Unauthorized", { status: 401 })
		}

		let body: unknown
		try {
			body = await request.json()
		} catch {
			return new Response(
				JSON.stringify({ jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error" } }),
				{ status: 400, headers: { "Content-Type": "application/json" } }
			)
		}

		const response = await dispatchMcpRequest(body, {
			executeTool: async (name, args) => {
				switch (name) {
					case "qonto_balance": {
						const settings = await ctx.runQuery(api.worker.workerGetTreasurySettings, {})
						return {
							balanceCents: settings?.qontoBalanceCents ?? 0,
							balanceEur: (settings?.qontoBalanceCents ?? 0) / 100,
							lastUpdated: settings?._creationTime,
						}
					}
					case "qonto_transactions": {
						try {
							return await ctx.runAction(api.qonto.listTransactions, {})
						} catch {
							return { error: "Qonto API not configured or unavailable" }
						}
					}
					case "treasury_forecast": {
						const [settings, expenses] = await Promise.all([
							ctx.runQuery(api.worker.workerGetTreasurySettings, {}),
							ctx.runQuery(api.worker.workerExpenseSummary, {}),
						])
						return { settings, expenses }
					}
					case "list_invoices":
						return ctx.runQuery(api.worker.workerListInvoices, args as any)
					case "list_expenses":
						return ctx.runQuery(api.worker.workerListExpenses, {
							type: args.type as "restaurant" | "mileage" | undefined,
							from: args.from as string | undefined,
							to: args.to as string | undefined,
							limit: Math.min((args.limit as number) ?? 30, 100),
						})
					case "list_time_entries":
						return ctx.runQuery(api.worker.workerListTimeEntries, args as any)
					case "list_todos":
						return ctx.runQuery(api.worker.workerListTodos, {
							status: args.status as string | undefined,
							limit: Math.min((args.limit as number) ?? 50, 100),
						})
					case "list_clients":
						return ctx.runQuery(api.worker.workerListClients, {})
					case "list_projects":
						return ctx.runQuery(api.worker.workerListProjects, {})
					case "create_expense":
						return ctx.runMutation(api.worker.workerCreateExpense, args as any)
					default:
						throw new Error(`Unhandled tool in switch: ${name}`)
				}
			},
			appendAudit: async (entry) => {
				await ctx.runMutation(api.worker.workerAppendMcpAudit, {
					method: entry.method,
					tool: entry.tool,
					success: entry.success,
					errorMessage: entry.errorMessage,
					argsPreview: entry.argsPreview,
				})
			},
		})

		return new Response(JSON.stringify(response), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		})
	}),
})
```

- [ ] **Step 7.2 — Pousser le déploiement Convex**

```bash
cd apps/ops && npx convex dev --once
```
Expected: `Convex functions ready!` et pas d'erreur TypeScript.

- [ ] **Step 7.3 — Vérifier que le health check répond**

```bash
curl https://rightful-guineapig-376.eu-west-1.convex.site/mcp
```
Expected:
```json
{"ok":true,"server":"blazz-ops-mcp","version":"0.1.0"}
```

- [ ] **Step 7.4 — Commit**

```bash
git add apps/ops/convex/http.ts
git commit -m "feat(ops): expose MCP server at /mcp (POST) + health check (GET)"
```

---

## Phase 3 — Déploiement & validation

### Task 8 : Setter le secret MCP dans Convex

**Files:** aucun (env Convex)

- [ ] **Step 8.1 — Générer le secret**

```bash
openssl rand -hex 32
```
Copier la valeur (64 chars hex).

- [ ] **Step 8.2 — Set dans Convex env**

```bash
cd apps/ops && npx convex env set MCP_SECRET <paste_value>
```

- [ ] **Step 8.3 — Vérifier**

```bash
cd apps/ops && npx convex env list 2>&1 | grep MCP_SECRET
```
Expected: ligne `MCP_SECRET` présente (valeur masquée).

- [ ] **Step 8.4 — Stocker temporairement la valeur pour les tests curl (à virer ensuite)**

Dans ton terminal local :
```bash
export MCP_SECRET=<paste_value>
```
**Ne pas committer**.

---

### Task 9 : Smoke tests curl

**Files:** aucun

- [ ] **Step 9.1 — Test auth invalide**

```bash
curl -X POST https://rightful-guineapig-376.eu-west-1.convex.site/mcp \
  -H "Authorization: Bearer wrong-token" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' \
  -w "\nHTTP %{http_code}\n"
```
Expected: `HTTP 401`, body `Unauthorized`.

- [ ] **Step 9.2 — Test `tools/list`**

```bash
curl -sX POST https://rightful-guineapig-376.eu-west-1.convex.site/mcp \
  -H "Authorization: Bearer $MCP_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | python3 -m json.tool
```
Expected: `result.tools` contient 10 entrées.

- [ ] **Step 9.3 — Test `initialize`**

```bash
curl -sX POST https://rightful-guineapig-376.eu-west-1.convex.site/mcp \
  -H "Authorization: Bearer $MCP_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":2,"method":"initialize","params":{}}' | python3 -m json.tool
```
Expected: `result.serverInfo.name === "blazz-ops-mcp"`.

- [ ] **Step 9.4 — Test `tools/call qonto_balance`**

```bash
curl -sX POST https://rightful-guineapig-376.eu-west-1.convex.site/mcp \
  -H "Authorization: Bearer $MCP_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"qonto_balance","arguments":{}}}' | python3 -m json.tool
```
Expected: `result.isError === false`, `result.content[0].text` contient un JSON avec `balanceEur`.

- [ ] **Step 9.5 — Test `tools/call` avec outil inconnu**

```bash
curl -sX POST https://rightful-guineapig-376.eu-west-1.convex.site/mcp \
  -H "Authorization: Bearer $MCP_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":4,"method":"tools/call","params":{"name":"nuke_db","arguments":{}}}' | python3 -m json.tool
```
Expected: `result.isError === true`, `result.content[0].text === "Unknown tool: nuke_db"`.

- [ ] **Step 9.6 — Vérifier les audit logs**

Ouvrir le dashboard Convex → table `mcpAuditLog` → vérifier que 3 entrées viennent d'être créées (qonto_balance success, nuke_db error, etc.).

---

### Task 10 : Installer le MCP sur Hermes

**Files:** aucun (config Hermes sur Railway)

- [ ] **Step 10.1 — SSH dans le container Hermes**

```bash
cd /tmp/hermes-railway && railway ssh 'hermes mcp list 2>&1'
```
Expected: liste vide ou par défaut.

- [ ] **Step 10.2 — Ajouter le MCP ops**

```bash
cd /tmp/hermes-railway && railway ssh "hermes mcp add ops --transport http --url https://rightful-guineapig-376.eu-west-1.convex.site/mcp --header 'Authorization: Bearer $MCP_SECRET'"
```

**Attention** : la variable `$MCP_SECRET` doit être expansée **côté local** avant l'envoi SSH. Si ça foire, copier la valeur en clair dans la commande.

- [ ] **Step 10.3 — Vérifier l'ajout**

```bash
cd /tmp/hermes-railway && railway ssh 'hermes mcp list'
```
Expected: ligne `ops` avec l'URL.

- [ ] **Step 10.4 — Restart gateway**

```bash
curl -sX POST -u "admin:$HERMES_ADMIN_PWD" https://hermes-agent-production-f1be.up.railway.app/api/gateway/restart
```
(Ou clique "Restart Gateway" dans le dashboard.)

---

### Task 11 : Test e2e Telegram

**Files:** aucun

- [ ] **Step 11.1 — Test read simple**

Sur Telegram, envoie à ton bot : **"combien en banque ?"**

Expected : Hermes appelle `qonto_balance`, répond avec le solde.

- [ ] **Step 11.2 — Test enchaînement read → write**

Sur Telegram : **"log un resto de 38€ avec <nom_d'un_client_réel> hier, déjeuner projet"**

Expected :
1. Hermes appelle `list_clients` pour trouver l'ID
2. Hermes appelle `create_expense` avec `type=restaurant`, `date=YYYY-MM-DD` (hier en Europe/Paris), `amountCents=3800`, `clientId=<id>`, `guests`, `purpose`
3. Hermes confirme la création

- [ ] **Step 11.3 — Vérifier en DB**

Dashboard Convex → table `expenses` → nouvelle entrée présente. Table `mcpAuditLog` → entrée correspondante.

- [ ] **Step 11.4 — Supprimer les données de test**

Dashboard Convex → table `expenses` → delete la fausse dépense.

- [ ] **Step 11.5 — Purger la variable du shell local**

```bash
unset MCP_SECRET
```

---

## Critères de succès (récap)

- [ ] 6 tests `tool-schemas.test.ts` passent
- [ ] 10 tests `mcp.test.ts` passent
- [ ] `curl GET /mcp` retourne `{"ok":true,...}` (200, sans auth)
- [ ] `curl POST /mcp` sans Bearer valide retourne 401
- [ ] `curl POST /mcp` avec `tools/list` retourne 10 tools
- [ ] Sur Telegram, "combien en banque ?" répond le solde correct
- [ ] "Log un resto X€ avec <client> hier" crée une dépense en DB avec le bon `clientId` + la bonne `date`
- [ ] Le dashboard Hermes liste `ops` comme MCP server
- [ ] La table `mcpAuditLog` reçoit une entrée par appel `tools/call`

---

## Notes pour l'exécution

- **Branch** : travailler sur la branch actuelle (`feat/ops-mission-control`) ou créer `feat/hermes-mcp` si tu préfères isoler.
- **Convex dev vs prod** : ce plan cible le deployment **dev** (`rightful-guineapig-376.eu-west-1.convex.site`). Pour prod, refaire `npx convex env set MCP_SECRET ...` + `hermes mcp add` avec la bonne URL prod.
- **Timezone Hermes** : vérifier que `TZ=Europe/Paris` est set sur Railway (ou `hermes config set timezone Europe/Paris`). Sans ça, les dates relatives ("hier") seront off.
- **Rollback** : chaque task finit par un commit. Si un problème, `git revert <sha>` de la task concernée.
