import OpenAI from "openai"
import type { ConvexHttpClient } from "convex/browser"
import { api } from "../convex"
import type { Tool } from "./index"

let _openai: OpenAI
function getOpenAI() {
	if (!_openai) _openai = new OpenAI()
	return _openai
}

export function agentTools(convex: ConvexHttpClient): Tool[] {
  return [
    {
      name: "delegate_to_agent",
      category: "write",
      definition: {
        type: "function",
        function: {
          name: "delegate_to_agent",
          description: "Create a mission for another agent. Use when a task is outside your expertise or requires another agent's tools. The mission will be executed autonomously.",
          parameters: {
            type: "object",
            properties: {
              agentSlug: {
                type: "string",
                enum: ["cfo", "timekeeper", "product-lead", "assistant", "account-manager"],
                description: "The agent to delegate to",
              },
              title: { type: "string", description: "Mission title" },
              prompt: { type: "string", description: "Detailed instructions for the agent" },
              priority: {
                type: "string",
                enum: ["low", "medium", "high", "urgent"],
                description: "Mission priority (default: medium)",
              },
            },
            required: ["agentSlug", "title", "prompt"],
          },
        },
      },
      execute: async (args) => {
        const targetAgent = await convex.query(api.worker.workerGetAgentBySlug, {
          slug: args.agentSlug as string,
        })
        if (!targetAgent) return { error: `Agent "${args.agentSlug}" not found` }

        const missionId = await convex.mutation(api.worker.workerCreateMission, {
          userId: targetAgent.userId,
          agentId: targetAgent._id,
          title: args.title as string,
          prompt: args.prompt as string,
          priority: (args.priority as "low" | "medium" | "high" | "urgent") ?? "medium",
        })

        return {
          success: true,
          missionId,
          message: `Mission "${args.title}" créée pour ${targetAgent.name}. Elle sera exécutée automatiquement.`,
        }
      },
    },
    {
      name: "ask_agent",
      category: "read",
      definition: {
        type: "function",
        function: {
          name: "ask_agent",
          description: "Ask another agent a quick question. Use for queries that don't need a full mission. The other agent responds immediately using their knowledge and tools.",
          parameters: {
            type: "object",
            properties: {
              agentSlug: {
                type: "string",
                enum: ["cfo", "timekeeper", "product-lead", "assistant", "account-manager"],
                description: "The agent to ask",
              },
              question: { type: "string", description: "The question to ask" },
            },
            required: ["agentSlug", "question"],
          },
        },
      },
      execute: async (args) => {
        const targetAgent = await convex.query(api.worker.workerGetAgentBySlug, {
          slug: args.agentSlug as string,
        })
        if (!targetAgent) return { error: `Agent "${args.agentSlug}" not found` }

        // Load the target agent's soul for context
        let soulContext = ""
        try {
          const { readFile } = await import("node:fs/promises")
          const { join } = await import("node:path")
          const agentsDir = join(import.meta.dirname, "../../../agents")
          const soul = await readFile(join(agentsDir, args.agentSlug as string, "SOUL.md"), "utf-8")
          soulContext = soul
        } catch { /* no soul file */ }

        // Build tools for the target agent (read-only, from the registry)
        const { financeTools } = await import("./finance")
        const { timeTools } = await import("./time")
        const { sharedTools } = await import("./shared")
        const allTools = [...financeTools(convex), ...timeTools(convex), ...sharedTools(convex)]
        const agentTools = allTools.filter((t) =>
          t.category === "read" && targetAgent.permissions.safe.includes(t.name)
        )

        const toolDefs = agentTools.length > 0
          ? agentTools.map((t) => t.definition)
          : undefined

        // Multi-step call — agent can use tools to answer
        const messages: OpenAI.ChatCompletionMessageParam[] = [
          {
            role: "system",
            content: `Tu es ${targetAgent.name}, ${targetAgent.role}. Un collègue agent te pose une question. Réponds de manière concise et factuelle. Utilise tes outils pour accéder aux données si nécessaire.\n\n${soulContext}`,
          },
          { role: "user", content: args.question as string },
        ]

        let answer = ""
        for (let step = 0; step < 3; step++) {
          const response = await getOpenAI().chat.completions.create({
            model: targetAgent.model,
            messages,
            tools: toolDefs,
            max_tokens: 800,
          })

          const choice = response.choices[0]

          if (choice.message.content) {
            answer = choice.message.content
          }

          if (choice.finish_reason === "stop" || !choice.message.tool_calls?.length) break

          // Execute tool calls
          messages.push(choice.message)
          for (const call of choice.message.tool_calls) {
            const tool = agentTools.find((t) => t.name === call.function.name)
            if (!tool) {
              messages.push({ role: "tool", tool_call_id: call.id, content: JSON.stringify({ error: "Tool not available" }) })
              continue
            }
            try {
              const result = await tool.execute(JSON.parse(call.function.arguments), convex)
              messages.push({ role: "tool", tool_call_id: call.id, content: JSON.stringify(result) })
            } catch (err) {
              messages.push({ role: "tool", tool_call_id: call.id, content: JSON.stringify({ error: String(err) }) })
            }
          }
        }

        return {
          agent: targetAgent.name,
          role: targetAgent.role,
          answer,
        }
      },
    },
    {
      name: "save_memory",
      category: "write",
      definition: {
        type: "function",
        function: {
          name: "save_memory",
          description: "Save an important piece of information to memory for future reference. Use for facts, user preferences, patterns you've noticed, or rules to follow.",
          parameters: {
            type: "object",
            properties: {
              content: { type: "string", description: "The memory content" },
              category: {
                type: "string",
                enum: ["fact", "preference", "pattern", "rule"],
                description: "fact=data point, preference=user choice, pattern=recurring behavior, rule=always/never do",
              },
              scope: {
                type: "string",
                enum: ["private", "shared"],
                description: "private=only for you, shared=all agents can see this",
              },
            },
            required: ["content", "category"],
          },
        },
      },
      execute: async (args, convex) => {
        // We need a userId — get it from any agent
        const agents = await convex.query(api.worker.workerListByStatus, { status: "todo" })
        // Fallback: get all agents to find userId
        const allAgents = await convex.query(api.worker.workerGetAgentBySlug, { slug: "cfo" })
        const userId = allAgents?.userId

        if (!userId) return { error: "Cannot determine userId" }

        const category = args.category as string
        const expiresAt = category === "fact" || category === "episode"
          ? Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days
          : undefined

        await convex.mutation(api.worker.workerAddMemory, {
          userId,
          scope: (args.scope as "private" | "shared") ?? "private",
          category: category as any,
          content: args.content as string,
          confidence: 0.7,
          source: "mission",
          expiresAt,
        })

        return { saved: true, category, scope: args.scope ?? "private" }
      },
    },
  ]
}
