# Ops AI Chat Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a `/chat` page to Blazz Ops that lets the user manage todos, clients, projects and time entries via natural language with GPT-4o tool calling.

**Architecture:** Next.js API route (`/api/chat`) uses Vercel AI SDK `streamText()` to call GPT-4o with tools. Read tools execute server-side via Convex client. Write tools return proposed actions to the client, which executes them via `useMutation()` after optional confirmation. UI built with `@blazz/ui/components/ai/*`.

**Tech Stack:** Vercel AI SDK (`ai`, `@ai-sdk/openai`), Convex (existing), @blazz/ui AI components, Next.js 16 API routes.

---

### Task 1: Install dependencies & drop static export

**Files:**
- Modify: `apps/ops/package.json`
- Modify: `apps/ops/next.config.mjs`

**Step 1: Install AI SDK packages**

Run from monorepo root:
```bash
cd apps/ops && pnpm add ai @ai-sdk/openai
```

**Step 2: Remove static export from next.config.mjs**

Current `apps/ops/next.config.mjs` has no `output: "export"` (it was already removed or never there). Verify no static export config exists. If it does, remove it.

**Step 3: Add OPENAI_API_KEY to .env.local**

```bash
# apps/ops/.env.local — add this line (user provides their own key)
OPENAI_API_KEY=sk-...
```

**Step 4: Verify dev server starts**

```bash
pnpm dev:ops
```

Expected: no errors, app loads on port 3120.

**Step 5: Commit**

```bash
git add apps/ops/package.json apps/ops/pnpm-lock.yaml
git commit -m "feat(ops): add Vercel AI SDK dependencies"
```

---

### Task 2: Add Chat nav item to sidebar

**Files:**
- Modify: `apps/ops/components/ops-frame.tsx`

**Step 1: Add MessageSquare icon import**

In `apps/ops/components/ops-frame.tsx`, add `MessageSquare` to the lucide-react import:

```tsx
import { CheckSquare, Clock, FolderOpen, LayoutDashboard, MessageSquare, Package, Sun, Users } from "lucide-react";
```

**Step 2: Add Chat nav item**

Add to the `navItems` array, after the Todos entry:

```tsx
  { title: "Todos", url: "/todos", icon: CheckSquare },
  { title: "Chat", url: "/chat", icon: MessageSquare },
  { title: "Packages", url: "/packages", icon: Package },
```

**Step 3: Verify**

Navigate to any page — "Chat" should appear in the sidebar. Clicking it goes to `/chat` (404 for now, expected).

**Step 4: Commit**

```bash
git add apps/ops/components/ops-frame.tsx
git commit -m "feat(ops): add Chat nav item to sidebar"
```

---

### Task 3: Create system prompt builder

**Files:**
- Create: `apps/ops/lib/chat/system-prompt.ts`

**Step 1: Create the system prompt template**

```ts
// apps/ops/lib/chat/system-prompt.ts

import { format } from "date-fns";
import { fr } from "date-fns/locale";

export interface ChatContext {
  todoCount: number;
  todosByStatus: Record<string, number>;
  clientCount: number;
  projectCount: number;
  timeThisWeekMinutes: number;
}

export function buildSystemPrompt(ctx: ChatContext): string {
  const today = format(new Date(), "EEEE d MMMM yyyy", { locale: fr });
  const todayISO = format(new Date(), "yyyy-MM-dd");

  const statusSummary = Object.entries(ctx.todosByStatus)
    .filter(([, count]) => count > 0)
    .map(([status, count]) => `${count} ${status}`)
    .join(", ");

  const hoursThisWeek = Math.round((ctx.timeThisWeekMinutes / 60) * 10) / 10;

  return `Tu es l'assistant IA de Blazz Ops, une app de gestion freelance.
Tu aides à gérer les todos, clients, projets et suivi de temps.

Aujourd'hui : ${today} (${todayISO})

## Contexte actuel
- ${ctx.todoCount} todos (${statusSummary || "aucun"})
- ${ctx.clientCount} clients
- ${ctx.projectCount} projets
- ${hoursThisWeek}h loggées cette semaine

## Règles
- Crée les todos avec priorité "normal" et statut "todo" par défaut
- Formate les dates en ISO (YYYY-MM-DD)
- Pour les durées, convertis en minutes (1h30 = 90)
- "aujourd'hui" = ${todayISO}
- Sois concis et direct
- Réponds en français
- Quand tu crées/modifies quelque chose, confirme brièvement ce qui a été fait
- Pour les time entries, le hourlyRate vient du projet (utilise get-project pour le trouver)
- Les IDs Convex ressemblent à des strings longs — ne les invente jamais, utilise les tools de lecture pour les trouver`;
}
```

**Step 2: Commit**

```bash
git add apps/ops/lib/chat/system-prompt.ts
git commit -m "feat(ops): add AI chat system prompt builder"
```

---

### Task 4: Create tool definitions with Zod schemas

**Files:**
- Create: `apps/ops/lib/chat/tools.ts`

**Step 1: Create tool schemas**

This file defines all tools as Vercel AI SDK `tool()` calls with Zod schemas. Read tools include an `execute` function; write tools do NOT (they'll be handled client-side).

```ts
// apps/ops/lib/chat/tools.ts

import { tool } from "ai";
import { z } from "zod";

// ─── Read tools (executed server-side) ───

export const readTools = {
  "list-todos": tool({
    description: "List all todos, optionally filtered by status",
    parameters: z.object({
      status: z
        .enum(["triage", "todo", "blocked", "in_progress", "done"])
        .optional()
        .describe("Filter by status"),
    }),
  }),

  "get-todo": tool({
    description: "Get a single todo by ID",
    parameters: z.object({
      id: z.string().describe("Todo ID"),
    }),
  }),

  "list-clients": tool({
    description: "List all clients",
    parameters: z.object({}),
  }),

  "get-client": tool({
    description: "Get a client by ID with their projects",
    parameters: z.object({
      id: z.string().describe("Client ID"),
    }),
  }),

  "list-projects": tool({
    description: "List all projects, optionally filtered by client",
    parameters: z.object({
      clientId: z.string().optional().describe("Filter by client ID"),
    }),
  }),

  "get-project": tool({
    description: "Get a project by ID with stats (revenue, hours, budget)",
    parameters: z.object({
      id: z.string().describe("Project ID"),
    }),
  }),

  "list-time-entries": tool({
    description: "List time entries with optional filters",
    parameters: z.object({
      projectId: z.string().optional().describe("Filter by project ID"),
      from: z.string().optional().describe("Start date (YYYY-MM-DD)"),
      to: z.string().optional().describe("End date (YYYY-MM-DD)"),
    }),
  }),

  "list-categories": tool({
    description: "List all todo categories",
    parameters: z.object({}),
  }),
};

// ─── Write tools (safe — auto-executed client-side) ───

export const writeSafeTools = {
  "create-todo": tool({
    description: "Create a new todo",
    parameters: z.object({
      text: z.string().describe("Todo title"),
      description: z.string().optional().describe("Detailed description"),
      status: z
        .enum(["triage", "todo", "blocked", "in_progress", "done"])
        .optional()
        .describe("Status (default: todo)"),
      priority: z
        .enum(["urgent", "high", "normal", "low"])
        .optional()
        .describe("Priority (default: normal)"),
      dueDate: z.string().optional().describe("Due date (YYYY-MM-DD)"),
      projectId: z.string().optional().describe("Project ID to link"),
      categoryId: z.string().optional().describe("Category ID"),
      tags: z.array(z.string()).optional().describe("Tags"),
    }),
  }),

  "create-client": tool({
    description: "Create a new client",
    parameters: z.object({
      name: z.string().describe("Client name"),
      email: z.string().optional().describe("Contact email"),
      phone: z.string().optional().describe("Phone number"),
    }),
  }),

  "create-project": tool({
    description: "Create a new project for a client",
    parameters: z.object({
      clientId: z.string().describe("Client ID"),
      name: z.string().describe("Project name"),
      tjm: z.number().describe("Daily rate (TJM) in EUR"),
      hoursPerDay: z.number().default(7).describe("Hours per day (default: 7)"),
      currency: z.literal("EUR").default("EUR"),
      status: z.enum(["active", "paused", "closed"]).default("active"),
    }),
  }),

  "log-time": tool({
    description: "Log a time entry for a project",
    parameters: z.object({
      projectId: z.string().describe("Project ID"),
      date: z.string().describe("Date (YYYY-MM-DD)"),
      minutes: z.number().describe("Duration in minutes"),
      hourlyRate: z.number().describe("Hourly rate in EUR (get from project TJM)"),
      description: z.string().optional().describe("What was done"),
      billable: z.boolean().default(true).describe("Is this billable?"),
    }),
  }),
};

// ─── Write tools (dangerous — confirmation required) ───

export const writeDangerousTools = {
  "update-todo": tool({
    description: "Update an existing todo",
    parameters: z.object({
      id: z.string().describe("Todo ID"),
      text: z.string().optional().describe("New title"),
      description: z.string().optional().describe("New description"),
      status: z
        .enum(["triage", "todo", "blocked", "in_progress", "done"])
        .optional(),
      priority: z.enum(["urgent", "high", "normal", "low"]).optional(),
      dueDate: z.string().optional().describe("New due date (YYYY-MM-DD)"),
      projectId: z.string().optional(),
      categoryId: z.string().optional(),
      tags: z.array(z.string()).optional(),
    }),
  }),

  "delete-todo": tool({
    description: "Delete a todo",
    parameters: z.object({
      id: z.string().describe("Todo ID"),
    }),
  }),

  "update-client": tool({
    description: "Update a client",
    parameters: z.object({
      id: z.string().describe("Client ID"),
      name: z.string().describe("Client name"),
      email: z.string().optional(),
      phone: z.string().optional(),
    }),
  }),

  "delete-client": tool({
    description: "Delete a client (and all related data)",
    parameters: z.object({
      id: z.string().describe("Client ID"),
    }),
  }),

  "update-project": tool({
    description: "Update a project",
    parameters: z.object({
      id: z.string().describe("Project ID"),
      name: z.string().describe("Project name"),
      tjm: z.number().describe("Daily rate"),
      hoursPerDay: z.number().describe("Hours per day"),
      status: z.enum(["active", "paused", "closed"]),
      currency: z.literal("EUR").default("EUR"),
    }),
  }),

  "delete-time-entry": tool({
    description: "Delete a time entry",
    parameters: z.object({
      id: z.string().describe("Time entry ID"),
    }),
  }),
};

// Merged for the route handler
export const allTools = {
  ...readTools,
  ...writeSafeTools,
  ...writeDangerousTools,
};

// Sets for client-side classification
export const writeSafeToolNames = new Set(Object.keys(writeSafeTools));
export const writeDangerousToolNames = new Set(Object.keys(writeDangerousTools));
```

**Step 2: Commit**

```bash
git add apps/ops/lib/chat/tools.ts
git commit -m "feat(ops): add AI chat tool definitions"
```

---

### Task 5: Create the API route handler

**Files:**
- Create: `apps/ops/app/api/chat/route.ts`

**Step 1: Create route handler**

This is the core endpoint. It loads context from Convex, builds the system prompt, calls `streamText()` with tools, and executes read tools server-side. Write tools are passed through to the client without execution.

```ts
// apps/ops/app/api/chat/route.ts

import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { buildSystemPrompt, type ChatContext } from "@/lib/chat/system-prompt";
import {
  readTools,
  writeSafeTools,
  writeDangerousTools,
} from "@/lib/chat/tools";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

async function loadContext(token: string): Promise<ChatContext> {
  convex.setAuth(token);

  const [todos, clients, projects, timeEntries] = await Promise.all([
    convex.query(api.todos.list, {}),
    convex.query(api.clients.list, {}),
    convex.query(api.projects.listAll, {}),
    convex.query(api.timeEntries.list, {
      from: getMonday(new Date()),
      to: format(new Date(), "yyyy-MM-dd"),
    }),
  ]);

  const todosByStatus: Record<string, number> = {};
  for (const t of todos) {
    todosByStatus[t.status] = (todosByStatus[t.status] ?? 0) + 1;
  }

  return {
    todoCount: todos.length,
    todosByStatus,
    clientCount: clients.length,
    projectCount: projects.length,
    timeThisWeekMinutes: timeEntries.reduce((s, e) => s + e.minutes, 0),
  };
}

function getMonday(d: Date): string {
  const date = new Date(d);
  const day = date.getDay() || 7;
  date.setDate(date.getDate() - day + 1);
  return date.toISOString().slice(0, 10);
}

function format(d: Date, _fmt: string): string {
  return d.toISOString().slice(0, 10);
}

// Execute read tools server-side
function makeReadToolExecutors(token: string) {
  convex.setAuth(token);

  return {
    "list-todos": async ({ status }: { status?: string }) => {
      const todos = await convex.query(api.todos.list, status ? { status: status as any } : {});
      return todos.map((t) => ({
        id: t._id,
        text: t.text,
        status: t.status,
        priority: t.priority ?? "normal",
        dueDate: t.dueDate ?? null,
        tags: t.tags ?? [],
        projectId: t.projectId ?? null,
        categoryId: t.categoryId ?? null,
      }));
    },

    "get-todo": async ({ id }: { id: string }) => {
      const todo = await convex.query(api.todos.get, { id: id as any });
      if (!todo) return { error: "Todo not found" };
      return todo;
    },

    "list-clients": async () => {
      const clients = await convex.query(api.clients.list, {});
      return clients.map((c) => ({
        id: c._id,
        name: c.name,
        email: c.email ?? null,
        phone: c.phone ?? null,
      }));
    },

    "get-client": async ({ id }: { id: string }) => {
      const client = await convex.query(api.clients.get, { id: id as any });
      if (!client) return { error: "Client not found" };
      const projects = await convex.query(api.projects.listByClient, { clientId: id as any });
      return { ...client, projects };
    },

    "list-projects": async ({ clientId }: { clientId?: string }) => {
      if (clientId) {
        return convex.query(api.projects.listByClient, { clientId: clientId as any });
      }
      const projects = await convex.query(api.projects.listAll, {});
      return projects.map((p) => ({
        id: p._id,
        name: p.name,
        status: p.status,
        tjm: p.tjm,
        hoursPerDay: p.hoursPerDay,
        clientId: p.clientId,
      }));
    },

    "get-project": async ({ id }: { id: string }) => {
      const data = await convex.query(api.projects.getWithStats, { id: id as any });
      if (!data) return { error: "Project not found" };
      return {
        id: data.project._id,
        name: data.project.name,
        tjm: data.project.tjm,
        hoursPerDay: data.project.hoursPerDay,
        hourlyRate: data.project.tjm / data.project.hoursPerDay,
        status: data.project.status,
        stats: data.stats,
      };
    },

    "list-time-entries": async ({
      projectId,
      from,
      to,
    }: {
      projectId?: string;
      from?: string;
      to?: string;
    }) => {
      const entries = await convex.query(api.timeEntries.list, {
        projectId: projectId as any,
        from,
        to,
      });
      return entries.map((e) => ({
        id: e._id,
        date: e.date,
        minutes: e.minutes,
        hourlyRate: e.hourlyRate,
        description: e.description ?? null,
        billable: e.billable,
        projectId: e.projectId,
      }));
    },

    "list-categories": async () => {
      return convex.query(api.categories.list, {});
    },
  };
}

export async function POST(req: Request) {
  const { messages } = await req.json();

  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }

  const ctx = await loadContext(token);
  const systemPrompt = buildSystemPrompt(ctx);
  const executors = makeReadToolExecutors(token);

  // Build tools with execute functions for read tools only
  const toolsWithExecute: Record<string, any> = {};

  for (const [name, t] of Object.entries(readTools)) {
    toolsWithExecute[name] = {
      ...t,
      execute: executors[name as keyof typeof executors],
    };
  }

  // Write tools — NO execute function → returned to client as tool calls
  for (const [name, t] of Object.entries(writeSafeTools)) {
    toolsWithExecute[name] = t;
  }
  for (const [name, t] of Object.entries(writeDangerousTools)) {
    toolsWithExecute[name] = t;
  }

  const result = streamText({
    model: openai("gpt-4o"),
    system: systemPrompt,
    messages,
    tools: toolsWithExecute,
    maxSteps: 5,
  });

  return result.toDataStreamResponse();
}
```

**Step 2: Verify the route compiles**

```bash
pnpm dev:ops
```

Then `curl -X POST http://localhost:3120/api/chat -H "Content-Type: application/json" -d '{"messages":[{"role":"user","content":"hello"}]}'` — should return 401 (no auth token). That confirms the route is loaded.

**Step 3: Commit**

```bash
git add apps/ops/app/api/chat/route.ts
git commit -m "feat(ops): add /api/chat route handler with tool calling"
```

---

### Task 6: Create chat UI — suggestions component

**Files:**
- Create: `apps/ops/components/chat/chat-suggestions.tsx`

**Step 1: Create suggestions**

```tsx
// apps/ops/components/chat/chat-suggestions.tsx

"use client";

import { Suggestion, Suggestions } from "@blazz/ui/components/ai/chat/suggestion";

const suggestions = [
  "Mes todos du jour",
  "Crée un todo pour demain",
  "Résumé de la semaine",
  "Combien d'heures cette semaine ?",
  "Liste mes projets actifs",
];

interface ChatSuggestionsProps {
  onSelect: (text: string) => void;
}

export function ChatSuggestions({ onSelect }: ChatSuggestionsProps) {
  return (
    <Suggestions>
      {suggestions.map((text) => (
        <Suggestion key={text} onClick={() => onSelect(text)}>
          {text}
        </Suggestion>
      ))}
    </Suggestions>
  );
}
```

**Step 2: Commit**

```bash
git add apps/ops/components/chat/chat-suggestions.tsx
git commit -m "feat(ops): add chat suggestions component"
```

---

### Task 7: Create chat UI — tool confirmation component

**Files:**
- Create: `apps/ops/components/chat/chat-tool-handler.tsx`

**Step 1: Create the tool handler component**

This component handles both auto-execution (safe writes) and confirmation (dangerous writes) of tool calls received from the LLM stream.

```tsx
// apps/ops/components/chat/chat-tool-handler.tsx

"use client";

import { Button } from "@blazz/ui/components/ui/button";
import { useMutation } from "convex/react";
import { Check, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import { writeDangerousToolNames, writeSafeToolNames } from "@/lib/chat/tools";

type ToolStatus = "pending" | "executing" | "done" | "error" | "rejected";

interface ChatToolHandlerProps {
  toolName: string;
  args: Record<string, unknown>;
  toolCallId: string;
  addToolResult: (params: { toolCallId: string; result: unknown }) => void;
}

const mutationMap = {
  "create-todo": "todos.create",
  "create-client": "clients.create",
  "create-project": "projects.create",
  "log-time": "timeEntries.create",
  "update-todo": "todos.update",
  "delete-todo": "todos.remove",
  "update-client": "clients.update",
  "delete-client": "clients.remove",
  "update-project": "projects.update",
  "delete-time-entry": "timeEntries.remove",
} as const;

const toolLabels: Record<string, string> = {
  "create-todo": "Créer un todo",
  "create-client": "Créer un client",
  "create-project": "Créer un projet",
  "log-time": "Logger du temps",
  "update-todo": "Modifier un todo",
  "delete-todo": "Supprimer un todo",
  "update-client": "Modifier un client",
  "delete-client": "Supprimer un client",
  "update-project": "Modifier un projet",
  "delete-time-entry": "Supprimer une entrée",
};

export function ChatToolHandler({
  toolName,
  args,
  toolCallId,
  addToolResult,
}: ChatToolHandlerProps) {
  const [status, setStatus] = useState<ToolStatus>("pending");
  const executed = useRef(false);

  const mutationName = mutationMap[toolName as keyof typeof mutationMap];

  // We need to dynamically pick the mutation — use the appropriate one
  const createTodo = useMutation(api.todos.create);
  const updateTodo = useMutation(api.todos.update);
  const updateTodoStatus = useMutation(api.todos.updateStatus);
  const removeTodo = useMutation(api.todos.remove);
  const createClient = useMutation(api.clients.create);
  const updateClient = useMutation(api.clients.update);
  const removeClient = useMutation(api.clients.remove);
  const createProject = useMutation(api.projects.create);
  const updateProject = useMutation(api.projects.update);
  const createTimeEntry = useMutation(api.timeEntries.create);
  const removeTimeEntry = useMutation(api.timeEntries.remove);

  const getMutation = useCallback(() => {
    const map: Record<string, (args: any) => Promise<any>> = {
      "create-todo": createTodo,
      "create-client": createClient,
      "create-project": createProject,
      "log-time": createTimeEntry,
      "update-todo": (a: any) => {
        // If only status is being changed, use updateStatus
        if (a.status && Object.keys(a).filter((k) => k !== "id" && k !== "status").length === 0) {
          return updateTodoStatus({ id: a.id, status: a.status });
        }
        return updateTodo(a);
      },
      "delete-todo": removeTodo,
      "update-client": updateClient,
      "delete-client": removeClient,
      "update-project": updateProject,
      "delete-time-entry": removeTimeEntry,
    };
    return map[toolName];
  }, [
    toolName, createTodo, updateTodo, updateTodoStatus, removeTodo,
    createClient, updateClient, removeClient,
    createProject, updateProject, createTimeEntry, removeTimeEntry,
  ]);

  const execute = useCallback(async () => {
    if (executed.current) return;
    executed.current = true;
    setStatus("executing");
    try {
      const fn = getMutation();
      if (!fn) throw new Error(`Unknown mutation: ${toolName}`);
      const result = await fn(args as any);
      setStatus("done");
      toast.success(toolLabels[toolName] ?? toolName);
      addToolResult({ toolCallId, result: { success: true, id: result } });
    } catch (err) {
      setStatus("error");
      const message = err instanceof Error ? err.message : "Erreur inconnue";
      toast.error(message);
      addToolResult({ toolCallId, result: { success: false, error: message } });
    }
  }, [getMutation, toolName, args, toolCallId, addToolResult]);

  const reject = useCallback(() => {
    setStatus("rejected");
    addToolResult({ toolCallId, result: { success: false, error: "Refusé par l'utilisateur" } });
  }, [toolCallId, addToolResult]);

  // Auto-execute safe tools
  useEffect(() => {
    if (writeSafeToolNames.has(toolName) && status === "pending") {
      execute();
    }
  }, [toolName, status, execute]);

  // Safe tools — show minimal UI
  if (writeSafeToolNames.has(toolName)) {
    return (
      <div className="flex items-center gap-2 text-sm text-fg-subtle py-1">
        {status === "executing" && <span className="animate-pulse">Exécution...</span>}
        {status === "done" && <span className="text-fg-success">✓ {toolLabels[toolName]}</span>}
        {status === "error" && <span className="text-fg-critical">✗ Erreur</span>}
      </div>
    );
  }

  // Dangerous tools — show confirmation
  if (writeDangerousToolNames.has(toolName)) {
    return (
      <div className="rounded-lg border border-edge bg-raised p-3 my-2">
        <p className="text-sm font-medium mb-1">{toolLabels[toolName]}</p>
        <pre className="text-xs text-fg-subtle bg-surface rounded p-2 mb-2 overflow-auto">
          {JSON.stringify(args, null, 2)}
        </pre>
        {status === "pending" && (
          <div className="flex gap-2">
            <Button size="sm" onClick={execute}>
              <Check className="size-3.5" />
              Confirmer
            </Button>
            <Button size="sm" variant="outline" onClick={reject}>
              <X className="size-3.5" />
              Annuler
            </Button>
          </div>
        )}
        {status === "executing" && <span className="text-sm animate-pulse">Exécution...</span>}
        {status === "done" && <span className="text-sm text-fg-success">✓ Fait</span>}
        {status === "error" && <span className="text-sm text-fg-critical">✗ Erreur</span>}
        {status === "rejected" && <span className="text-sm text-fg-subtle">Annulé</span>}
      </div>
    );
  }

  return null;
}
```

**Step 2: Commit**

```bash
git add apps/ops/components/chat/chat-tool-handler.tsx
git commit -m "feat(ops): add chat tool handler with auto-execute and confirmation"
```

---

### Task 8: Create the /chat page

**Files:**
- Create: `apps/ops/app/(main)/chat/page.tsx`

**Step 1: Create the chat page**

This is the main page that wires `useChat()` to the @blazz/ui AI components.

```tsx
// apps/ops/app/(main)/chat/page.tsx

"use client";

import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@blazz/ui/components/ai/chat/conversation";
import { Message, MessageContent, MessageResponse } from "@blazz/ui/components/ai/chat/message";
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@blazz/ui/components/ai/chat/prompt-input";
import { PageHeader } from "@blazz/ui/components/blocks/page-header";
import { Button } from "@blazz/ui/components/ui/button";
import { useChat } from "ai/react";
import { useAuthToken } from "@convex-dev/auth/react";
import { RotateCcw } from "lucide-react";
import { useCallback } from "react";
import { ChatSuggestions } from "@/components/chat/chat-suggestions";
import { ChatToolHandler } from "@/components/chat/chat-tool-handler";

export default function ChatPage() {
  const token = useAuthToken();

  const {
    messages,
    input,
    setInput,
    handleSubmit,
    status,
    stop,
    setMessages,
    addToolResult,
  } = useChat({
    api: "/api/chat",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    maxSteps: 5,
  });

  const handleSuggestion = useCallback(
    (text: string) => {
      setInput(text);
    },
    [setInput]
  );

  const handleClear = useCallback(() => {
    setMessages([]);
  }, [setMessages]);

  const isStreaming = status === "streaming";

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Chat">
        {messages.length > 0 && (
          <Button variant="outline" size="sm" onClick={handleClear}>
            <RotateCcw className="size-3.5" />
            Effacer
          </Button>
        )}
      </PageHeader>

      <Conversation className="flex-1 min-h-0">
        <ConversationContent className="max-w-3xl mx-auto px-4">
          {messages.length === 0 && (
            <ConversationEmptyState>
              <div className="text-center space-y-4">
                <h2 className="text-lg font-semibold text-fg">
                  Comment puis-je t'aider ?
                </h2>
                <p className="text-sm text-fg-subtle">
                  Je peux gérer tes todos, clients, projets et temps.
                </p>
                <ChatSuggestions onSelect={handleSuggestion} />
              </div>
            </ConversationEmptyState>
          )}

          {messages.map((message) => (
            <Message key={message.id} from={message.role as "user" | "assistant"}>
              <MessageContent>
                {message.parts?.map((part, i) => {
                  if (part.type === "text" && part.text) {
                    return (
                      <MessageResponse key={i}>{part.text}</MessageResponse>
                    );
                  }
                  if (part.type === "tool-invocation") {
                    return (
                      <ChatToolHandler
                        key={part.toolInvocation.toolCallId}
                        toolName={part.toolInvocation.toolName}
                        args={part.toolInvocation.args}
                        toolCallId={part.toolInvocation.toolCallId}
                        addToolResult={addToolResult}
                      />
                    );
                  }
                  return null;
                })}
                {/* Fallback for messages without parts */}
                {!message.parts?.length && message.content && (
                  <MessageResponse>{message.content}</MessageResponse>
                )}
              </MessageContent>
            </Message>
          ))}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="border-t border-edge bg-surface px-4 py-3">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit}>
            <PromptInput>
              <PromptInputBody>
                <PromptInputTextarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Demande-moi quelque chose..."
                />
                <PromptInputFooter>
                  <PromptInputSubmit
                    status={isStreaming ? "streaming" : "ready"}
                    onStop={stop}
                  />
                </PromptInputFooter>
              </PromptInputBody>
            </PromptInput>
          </form>
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Verify the page renders**

Navigate to `/chat`. Should show:
- PageHeader with "Chat" title
- Empty state with suggestions
- Prompt input at the bottom

**Step 3: Commit**

```bash
git add apps/ops/app/(main)/chat/page.tsx
git commit -m "feat(ops): add /chat page with AI components"
```

---

### Task 9: Wire auth token to useChat & test end-to-end

**Files:**
- Possibly modify: `apps/ops/app/(main)/chat/page.tsx`

**Step 1: Check if `useAuthToken` exists**

The `@convex-dev/auth/react` package should export `useAuthToken()`. If it doesn't, we need an alternative approach to get the Convex JWT token. Check the Convex auth docs.

If `useAuthToken` is not available, create a helper that extracts the token from the Convex client:

```tsx
// Alternative: use convex's internal auth state
import { useConvexAuth } from "convex/react";
```

The exact approach depends on what `@convex-dev/auth` exports. Investigate and adjust.

**Step 2: Test end-to-end**

1. Make sure `OPENAI_API_KEY` is set in `apps/ops/.env.local`
2. Start `pnpm dev:ops`
3. Log in to the app
4. Navigate to `/chat`
5. Type "Liste mes todos" → should call `list-todos` tool and return results
6. Type "Crée un todo 'Test AI chat' pour demain" → should auto-create and confirm
7. Type "Supprime le todo 'Test AI chat'" → should show confirmation dialog

**Step 3: Fix any issues found during testing**

Iterate on:
- Auth token passing (most likely issue)
- Tool call/result format compatibility with useChat
- @blazz/ui component API mismatches
- PromptInput form submission wiring

**Step 4: Commit**

```bash
git add -A apps/ops/
git commit -m "feat(ops): wire AI chat end-to-end with auth and tool calling"
```

---

### Task 10: Polish & edge cases

**Files:**
- Modify: `apps/ops/app/(main)/chat/page.tsx`
- Modify: `apps/ops/components/chat/chat-tool-handler.tsx`

**Step 1: Add loading state while auth token loads**

If `token` is null initially, show a skeleton or disabled input.

**Step 2: Add error handling for API failures**

Handle network errors, rate limits, invalid API key in `useChat`'s `onError` callback:

```tsx
const { ... } = useChat({
  // ...
  onError: (error) => {
    toast.error("Erreur chat : " + error.message);
  },
});
```

**Step 3: Handle empty/missing API key gracefully**

In the route handler, return a clear error if `OPENAI_API_KEY` is missing:

```ts
if (!process.env.OPENAI_API_KEY) {
  return new Response(
    JSON.stringify({ error: "OPENAI_API_KEY not configured" }),
    { status: 500, headers: { "Content-Type": "application/json" } }
  );
}
```

**Step 4: Test edge cases**

- Send message while not authenticated → should get 401
- Send message with no API key → should get clear error
- Reject a dangerous tool call → LLM should acknowledge
- Rapid successive messages → should handle gracefully

**Step 5: Final commit**

```bash
git add -A apps/ops/
git commit -m "feat(ops): polish AI chat error handling and edge cases"
```
