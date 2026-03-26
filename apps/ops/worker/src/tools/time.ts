import type { ConvexHttpClient } from "convex/browser"
import { api } from "../convex"
import type { Tool } from "./index"

export function timeTools(convex: ConvexHttpClient): Tool[] {
  return [
    {
      name: "list_time_entries",
      category: "read",
      definition: {
        type: "function",
        function: {
          name: "list_time_entries",
          description: "List time entries. Can filter by project and date range.",
          parameters: {
            type: "object",
            properties: {
              projectId: { type: "string", description: "Filter by project ID" },
              from: { type: "string", description: "Start date YYYY-MM-DD" },
              to: { type: "string", description: "End date YYYY-MM-DD" },
            },
            required: [],
          },
        },
      },
      execute: async (args) => {
        return convex.query(api.timeEntries.list, args as any)
      },
    },
    {
      name: "list_projects",
      category: "read",
      definition: {
        type: "function",
        function: {
          name: "list_projects",
          description: "List all projects with their status, client, and budget info.",
          parameters: { type: "object", properties: {}, required: [] },
        },
      },
      execute: async () => {
        return convex.query(api.projects.listAll, {})
      },
    },
    {
      name: "check_time_anomalies",
      category: "read",
      definition: {
        type: "function",
        function: {
          name: "check_time_anomalies",
          description: "Check for time tracking anomalies: empty days, excessive hours (>10h), gaps. Specify a date range.",
          parameters: {
            type: "object",
            properties: {
              from: { type: "string", description: "Start date YYYY-MM-DD" },
              to: { type: "string", description: "End date YYYY-MM-DD" },
            },
            required: ["from", "to"],
          },
        },
      },
      execute: async (args) => {
        const entries = await convex.query(api.timeEntries.list, {
          from: args.from as string,
          to: args.to as string,
        })

        // Analyze anomalies
        const byDate: Record<string, number> = {}
        for (const e of entries as any[]) {
          byDate[e.date] = (byDate[e.date] ?? 0) + e.minutes
        }

        const anomalies: string[] = []
        const start = new Date(args.from as string)
        const end = new Date(args.to as string)

        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          const day = d.getDay()
          if (day === 0 || day === 6) continue // skip weekends
          const dateStr = d.toISOString().slice(0, 10)
          const minutes = byDate[dateStr] ?? 0

          if (minutes === 0) anomalies.push(`❌ ${dateStr}: aucune saisie`)
          else if (minutes > 600) anomalies.push(`⚠ ${dateStr}: ${Math.round(minutes / 60)}h (>10h)`)
          else if (minutes < 120) anomalies.push(`⚠ ${dateStr}: seulement ${Math.round(minutes / 60)}h (<2h)`)
        }

        return {
          totalDays: Object.keys(byDate).length,
          totalMinutes: Object.values(byDate).reduce((a, b) => a + b, 0),
          anomalies,
          anomalyCount: anomalies.length,
        }
      },
    },
  ]
}
