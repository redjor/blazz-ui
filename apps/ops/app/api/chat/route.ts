import { openai } from "@ai-sdk/openai";
import { convertToModelMessages, streamText, type ToolSet } from "ai";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { buildSystemPrompt, type ChatContext } from "@/lib/chat/system-prompt";
import { readTools, writeSafeTools, writeDangerousTools } from "@/lib/chat/tools";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

function getMonday(d: Date): string {
  const date = new Date(d);
  const day = date.getDay() || 7;
  date.setDate(date.getDate() - day + 1);
  return date.toISOString().slice(0, 10);
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

async function loadContext(token: string): Promise<ChatContext> {
  convex.setAuth(token);

  const [todos, clients, projects, timeEntries] = await Promise.all([
    convex.query(api.todos.list, {}),
    convex.query(api.clients.list, {}),
    convex.query(api.projects.listAll, {}),
    convex.query(api.timeEntries.list, {
      from: getMonday(new Date()),
      to: todayISO(),
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

function buildReadToolExecutors(token: string) {
  convex.setAuth(token);

  return {
    "list-todos": async ({ status }: { status?: string }) => {
      const todos = await convex.query(
        api.todos.list,
        status ? { status: status as any } : {}
      );
      return todos.map((t) => ({
        id: t._id,
        text: t.text,
        status: t.status,
        priority: t.priority ?? "normal",
        dueDate: t.dueDate ?? null,
        tags: t.tags ?? [],
      }));
    },

    "get-todo": async ({ id }: { id: string }) => {
      const todo = await convex.query(api.todos.get, { id: id as any });
      if (!todo) return { error: "Todo introuvable" };
      return {
        id: todo._id,
        text: todo.text,
        description: todo.description ?? null,
        status: todo.status,
        priority: todo.priority ?? "normal",
        dueDate: todo.dueDate ?? null,
        tags: todo.tags ?? [],
        projectId: todo.projectId ?? null,
        categoryId: todo.categoryId ?? null,
      };
    },

    "list-clients": async () => {
      const clients = await convex.query(api.clients.list, {});
      return clients.map((c) => ({
        id: c._id,
        name: c.name,
        email: c.email ?? null,
      }));
    },

    "get-client": async ({ id }: { id: string }) => {
      const client = await convex.query(api.clients.get, { id: id as any });
      if (!client) return { error: "Client introuvable" };
      const projects = await convex.query(api.projects.listByClient, {
        clientId: id as any,
      });
      return {
        id: client._id,
        name: client.name,
        email: client.email ?? null,
        phone: client.phone ?? null,
        projects: projects.map((p) => ({
          id: p._id,
          name: p.name,
          status: p.status,
          tjm: p.tjm,
        })),
      };
    },

    "list-projects": async ({ clientId }: { clientId?: string }) => {
      if (clientId) {
        const projects = await convex.query(api.projects.listByClient, {
          clientId: clientId as any,
        });
        return projects.map((p) => ({
          id: p._id,
          name: p.name,
          status: p.status,
          tjm: p.tjm,
        }));
      }
      const projects = await convex.query(api.projects.listAll, {});
      return projects.map((p) => ({
        id: p._id,
        name: p.name,
        status: p.status,
        tjm: p.tjm,
        clientId: p.clientId,
      }));
    },

    "get-project": async ({ id }: { id: string }) => {
      const data = await convex.query(api.projects.getWithStats, {
        id: id as any,
      });
      if (!data) return { error: "Projet introuvable" };
      return {
        id: data.project._id,
        name: data.project.name,
        tjm: data.project.tjm,
        hoursPerDay: data.project.hoursPerDay,
        hourlyRate: Math.round((data.project.tjm / data.project.hoursPerDay) * 100) / 100,
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
  if (!process.env.OPENAI_API_KEY) {
    return new Response(
      JSON.stringify({ error: "OPENAI_API_KEY not configured" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const token = await convexAuthNextjsToken();
  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { messages } = await req.json();
  const ctx = await loadContext(token);
  const systemPrompt = buildSystemPrompt(ctx);
  const executors = buildReadToolExecutors(token);

  // Build tools: read tools with execute, write tools without
  const tools: Record<string, any> = {};

  for (const [name, t] of Object.entries(readTools)) {
    tools[name] = {
      ...t,
      execute: executors[name as keyof typeof executors],
    };
  }

  for (const [name, t] of Object.entries(writeSafeTools)) {
    tools[name] = t;
  }
  for (const [name, t] of Object.entries(writeDangerousTools)) {
    tools[name] = t;
  }

  // useChat sends UIMessage[] — streamText expects ModelMessage[]
  let modelMessages;
  try {
    modelMessages = await convertToModelMessages(messages, { tools });
  } catch (err) {
    console.error("[chat] convertToModelMessages failed:", err);
    return new Response(
      JSON.stringify({ error: "Failed to convert messages" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const result = streamText({
    model: openai.chat("gpt-4o-mini"),
    system: systemPrompt,
    messages: modelMessages,
    tools,
    maxSteps: 5,
  });

  return result.toUIMessageStreamResponse();
}
