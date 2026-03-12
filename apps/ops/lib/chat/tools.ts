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

export const allTools = {
  ...readTools,
  ...writeSafeTools,
  ...writeDangerousTools,
};

export const writeSafeToolNames = new Set(Object.keys(writeSafeTools));
export const writeDangerousToolNames = new Set(Object.keys(writeDangerousTools));
