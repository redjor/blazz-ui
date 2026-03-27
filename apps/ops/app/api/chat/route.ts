import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { openai } from "@ai-sdk/openai"
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server"
import { convertToModelMessages, streamText } from "ai"
import { ConvexHttpClient } from "convex/browser"
import { z } from "zod"
import { api } from "@/convex/_generated/api"
import { buildSystemPrompt, type ChatContext } from "@/lib/chat/system-prompt"
import { readTools, writeDangerousTools, writeSafeTools, tool } from "@/lib/chat/tools"

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

const COMPLEX_PATTERNS = /\b(et|puis|ensuite|après|aussi|également)\b/i

/**
 * Detect messages that benefit from a stronger model:
 * - multiple intentions (conjunctions)
 * - long messages (> 120 chars)
 */
function isComplex(lastUserMessage: string): boolean {
	if (lastUserMessage.length > 120) return true
	const conjunctions = lastUserMessage.match(COMPLEX_PATTERNS)
	if (conjunctions && conjunctions.length >= 1) {
		// Only complex if conjunction likely separates two actions
		// e.g. "ajoute X et log Y" vs "le projet X et Y" (just a name)
		const parts = lastUserMessage.split(COMPLEX_PATTERNS).filter(Boolean)
		const actionWords = /\b(ajoute|crée|log|démarre|supprime|modifie|mets|change|termine|facture)\b/i
		const actionCount = parts.filter((p) => actionWords.test(p)).length
		return actionCount >= 2
	}
	return false
}

function getMonday(d: Date): string {
	const date = new Date(d)
	const day = date.getDay() || 7
	date.setDate(date.getDate() - day + 1)
	return date.toISOString().slice(0, 10)
}

function todayISO(): string {
	return new Date().toISOString().slice(0, 10)
}

async function loadContext(token: string): Promise<ChatContext> {
	convex.setAuth(token)

	const [todos, clients, projects, timeEntries] = await Promise.all([
		convex.query(api.todos.list, {}),
		convex.query(api.clients.list, {}),
		convex.query(api.projects.listAll, {}),
		convex.query(api.timeEntries.list, {
			from: getMonday(new Date()),
			to: todayISO(),
		}),
	])

	const todosByStatus: Record<string, number> = {}
	for (const t of todos) {
		todosByStatus[t.status] = (todosByStatus[t.status] ?? 0) + 1
	}

	return {
		todoCount: todos.length,
		todosByStatus,
		clientCount: clients.length,
		projectCount: projects.length,
		timeThisWeekMinutes: timeEntries.reduce((s, e) => s + e.minutes, 0),
	}
}

function buildReadToolExecutors(token: string) {
	convex.setAuth(token)

	return {
		"list-todos": async ({ status }: { status?: string }) => {
			const todos = await convex.query(api.todos.list, status ? { status: status as any } : {})
			return todos.map((t) => ({
				id: t._id,
				text: t.text,
				status: t.status,
				priority: t.priority ?? "normal",
				dueDate: t.dueDate ?? null,
				tags: t.tags ?? [],
			}))
		},

		"get-todo": async ({ id }: { id: string }) => {
			const todo = await convex.query(api.todos.get, { id: id as any })
			if (!todo) return { error: "Todo introuvable" }
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
			}
		},

		"list-clients": async () => {
			const clients = await convex.query(api.clients.list, {})
			return clients.map((c) => ({
				id: c._id,
				name: c.name,
				email: c.email ?? null,
			}))
		},

		"get-client": async ({ id }: { id: string }) => {
			const client = await convex.query(api.clients.get, { id: id as any })
			if (!client) return { error: "Client introuvable" }
			const projects = await convex.query(api.projects.listByClient, {
				clientId: id as any,
			})
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
			}
		},

		"list-projects": async ({ clientId }: { clientId?: string }) => {
			if (clientId) {
				const projects = await convex.query(api.projects.listByClient, {
					clientId: clientId as any,
				})
				return projects.map((p) => ({
					id: p._id,
					name: p.name,
					status: p.status,
					tjm: p.tjm,
				}))
			}
			const projects = await convex.query(api.projects.listAll, {})
			return projects.map((p) => ({
				id: p._id,
				name: p.name,
				status: p.status,
				tjm: p.tjm,
				clientId: p.clientId,
			}))
		},

		"get-project": async ({ id }: { id: string }) => {
			const data = await convex.query(api.projects.getWithStats, {
				id: id as any,
			})
			if (!data) return { error: "Projet introuvable" }
			return {
				id: data.project._id,
				name: data.project.name,
				tjm: data.project.tjm,
				hoursPerDay: data.project.hoursPerDay,
				hourlyRate: Math.round((data.project.tjm / data.project.hoursPerDay) * 100) / 100,
				status: data.project.status,
				stats: data.stats,
			}
		},

		"list-time-entries": async ({
			projectId,
			from,
			to,
		}: {
			projectId?: string
			from?: string
			to?: string
		}) => {
			const entries = await convex.query(api.timeEntries.list, {
				projectId: projectId as any,
				from,
				to,
			})
			return entries.map((e) => ({
				id: e._id,
				date: e.date,
				minutes: e.minutes,
				hourlyRate: e.hourlyRate,
				description: e.description ?? null,
				billable: e.billable,
				projectId: e.projectId,
			}))
		},

		"list-categories": async () => {
			return convex.query(api.categories.list, {})
		},

		// Finance tools
		"qonto-balance": async () => {
			const s = await convex.query(api.treasury.getSettings, {})
			return { balanceEur: (s?.qontoBalanceCents ?? 0) / 100 }
		},
		"qonto-transactions": async () => {
			try { return await convex.action(api.qonto.listTransactions, {}) }
			catch { return { error: "Qonto indisponible" } }
		},
		"list-invoices": async ({ status }: { status?: string }) => {
			return convex.query(api.invoices.list, status ? { status: status as any } : {})
		},
		"list-recurring-expenses": async () => {
			return convex.query(api.treasury.expenseSummary, {})
		},
		"treasury-forecast": async ({ months }: { months?: number }) => {
			return convex.query(api.treasury.forecast, { months: months ?? 6 })
		},
		"check-time-anomalies": async ({ from, to }: { from: string; to: string }) => {
			const entries = await convex.query(api.timeEntries.list, { from, to })
			const byDate: Record<string, number> = {}
			for (const e of entries) byDate[e.date] = (byDate[e.date] ?? 0) + e.minutes
			const anomalies: string[] = []
			for (let d = new Date(from); d <= new Date(to); d.setDate(d.getDate() + 1)) {
				if (d.getDay() === 0 || d.getDay() === 6) continue
				const ds = d.toISOString().slice(0, 10)
				const m = byDate[ds] ?? 0
				if (m === 0) anomalies.push(`❌ ${ds}: aucune saisie`)
				else if (m > 600) anomalies.push(`⚠ ${ds}: ${Math.round(m / 60)}h`)
			}
			return { anomalies, anomalyCount: anomalies.length }
		},
	}
}

export async function POST(req: Request) {
	if (!process.env.OPENAI_API_KEY) {
		return new Response(JSON.stringify({ error: "OPENAI_API_KEY not configured" }), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		})
	}

	const token = await convexAuthNextjsToken()
	if (!token) {
		return new Response("Unauthorized", { status: 401 })
	}

	const body = await req.json()
	const { messages, agentSlug } = body

	// ── Agent mode: if agentSlug is set, use agent-specific logic ──
	if (agentSlug) {
		return handleAgentChat(token, agentSlug, messages)
	}

	// Pick model based on message complexity
	const lastUserMsg = [...messages].reverse().find((m: any) => m.role === "user")
	const useStrongerModel = lastUserMsg?.content && isComplex(typeof lastUserMsg.content === "string" ? lastUserMsg.content : "")
	const model = openai.chat(useStrongerModel ? "gpt-4.1-mini" : "gpt-4o-mini")

	const ctx = await loadContext(token)
	const systemPrompt = buildSystemPrompt(ctx)
	const executors = buildReadToolExecutors(token)

	// Build tools: read tools with execute, write tools without
	const tools: Record<string, any> = {}

	for (const [name, t] of Object.entries(readTools)) {
		tools[name] = {
			...t,
			execute: executors[name as keyof typeof executors],
		}
	}

	for (const [name, t] of Object.entries(writeSafeTools)) {
		tools[name] = t
	}
	for (const [name, t] of Object.entries(writeDangerousTools)) {
		tools[name] = t
	}

	// useChat sends UIMessage[] — streamText expects ModelMessage[]
	let modelMessages: Awaited<ReturnType<typeof convertToModelMessages>>
	try {
		modelMessages = await convertToModelMessages(messages, { tools })
	} catch (err) {
		console.error("[chat] convertToModelMessages failed:", err)
		return new Response(JSON.stringify({ error: "Failed to convert messages" }), {
			status: 400,
			headers: { "Content-Type": "application/json" },
		})
	}

	const result = streamText({
		model,
		system: systemPrompt,
		messages: modelMessages,
		tools,
		maxSteps: 5,
	})

	return result.toUIMessageStreamResponse()
}

// ── Agent-specific chat handler ──

async function loadSoulFile(slug: string, file: string): Promise<string> {
	try {
		return await readFile(join(process.cwd(), "agents", slug, file), "utf-8")
	} catch {
		return ""
	}
}

async function handleAgentChat(token: string, slug: string, messages: any[]) {
	convex.setAuth(token)

	// Fetch agent
	const agent = await convex.query(api.agents.getBySlug, { slug })
	if (!agent) {
		return new Response(JSON.stringify({ error: "Agent introuvable" }), {
			status: 404, headers: { "Content-Type": "application/json" },
		})
	}

	const agentUserId = String(agent.userId)

	// Load soul files
	const [soul, style, skill, context] = await Promise.all([
		loadSoulFile(slug, "SOUL.md"),
		loadSoulFile(slug, "STYLE.md"),
		loadSoulFile(slug, "SKILL.md"),
		loadSoulFile(slug, "CONTEXT.md"),
	])

	// Load memory
	const [privateMemories, sharedMemories] = await Promise.all([
		convex.query(api.agentMemory.list, { agentId: agent._id }),
		convex.query(api.agentMemory.listShared, {}),
	])
	const allMemories = [...privateMemories, ...sharedMemories]
	const sortedMemories = allMemories
		.sort((a, b) => {
			const order = ["rule", "preference", "pattern", "fact", "episode"]
			return order.indexOf(a.category ?? "fact") - order.indexOf(b.category ?? "fact")
		})
		.slice(0, 15)
	const memoryBlock = sortedMemories.length > 0
		? `\n## Mémoire\n${sortedMemories.map((m) => `- [${m.category}${m.scope === "shared" ? " partagé" : ""}] ${m.content}`).join("\n")}`
		: ""

	// Build system prompt
	const todayFormatted = new Date().toLocaleDateString("fr-FR", {
		weekday: "long", year: "numeric", month: "long", day: "numeric",
	})
	const todayISOStr = new Date().toISOString().slice(0, 10)

	const systemPrompt = [
		`INSTRUCTION CRITIQUE : Tu es ${agent.name}, ${agent.role}. Respecte STRICTEMENT ta personnalité ci-dessous.\n`,
		soul || `Tu es ${agent.name}, ${agent.role}.`,
		style ? `\n## Style\n${style}` : "",
		skill ? `\n## Compétences\n${skill}` : "",
		context ? `\n## Contexte Projet\n${context}` : "",
		memoryBlock,
		`\n## Contexte temporel\nAujourd'hui : ${todayFormatted} (${todayISOStr})`,
	].filter(Boolean).join("\n")

	// Build tools
	const tools: Record<string, any> = {}
	const executors = buildReadToolExecutors(token)

	for (const perm of agent.permissions.safe) {
		const toolName = permissionToToolName[perm]
		if (!toolName) continue
		const def = allToolDefs[toolName]
		const exec = executors[toolName as keyof typeof executors]
		if (def && exec) {
			tools[toolName] = { ...def, execute: exec }
		}
	}

	// Write tools
	if (agent.permissions.confirm.includes("create_todo")) {
		tools["create-todo"] = {
			...tool({
				description: "Créer un todo dans Blazz Ops. Mets TOUJOURS une description détaillée. NE PAS répéter la priorité, la date ou le projet dans la description — ils sont dans des champs séparés.",
				parameters: z.object({
					text: z.string().describe("Titre court du todo (1 ligne, pas de détails)"),
					description: z.string().optional().describe("Description détaillée en markdown : contexte, objectif, étapes numérotées, critères de validation. NE PAS inclure priorité/projet/date ici."),
					priority: z.enum(["urgent", "high", "normal", "low"]).optional(),
					dueDate: z.string().optional().describe("Date limite YYYY-MM-DD"),
					projectId: z.string().optional().describe("ID du projet associé"),
				}),
			}),
			execute: async ({ text, description, priority, dueDate, projectId }: any) => {
				return convex.mutation(api.worker.workerCreateTodo, {
					text, description, priority: priority ?? "normal", dueDate, userId: agentUserId, projectId,
				})
			},
		}
	}
	if (agent.permissions.confirm.includes("create_note")) {
		tools["create-note"] = {
			...tool({
				description: "Créer une note dans Blazz Ops.",
				parameters: z.object({
					title: z.string().describe("Titre"),
					content: z.string().describe("Contenu (markdown)"),
				}),
			}),
			execute: async ({ title, content }: any) => {
				return convex.mutation(api.worker.workerCreateNote, {
					title, content, userId: agentUserId,
				})
			},
		}
	}

	// Convert messages
	let modelMessages: any
	try {
		modelMessages = await convertToModelMessages(messages, { tools })
	} catch {
		return new Response(JSON.stringify({ error: "Failed to convert messages" }), {
			status: 400, headers: { "Content-Type": "application/json" },
		})
	}

	const model = openai.chat(agent.model)

	// Save user message
	const lastUserMsg = [...messages].reverse().find((m: any) => m.role === "user")
	if (lastUserMsg) {
		const text = typeof lastUserMsg.content === "string"
			? lastUserMsg.content
			: lastUserMsg.parts?.find((p: any) => p.type === "text")?.text ?? ""
		if (text) {
			try { await convex.mutation(api.chatMessages.append, { agentId: agent._id, role: "user", content: text }) } catch {}
		}
	}

	const result = streamText({
		model,
		system: systemPrompt,
		messages: modelMessages,
		tools,
		maxSteps: 5,
		onFinish: async ({ usage, text }) => {
			const inputCost = ((usage?.inputTokens ?? 0) / 1_000_000) * 0.40
			const outputCost = ((usage?.outputTokens ?? 0) / 1_000_000) * 1.60
			const costUsd = Math.round((inputCost + outputCost) * 1_000_000) / 1_000_000

			convex.setAuth(token)
			if (costUsd > 0) {
				try { await convex.mutation(api.agents.addUsage, { id: agent._id, costUsd }) } catch {}
			}
			if (text) {
				try { await convex.mutation(api.chatMessages.append, { agentId: agent._id, role: "assistant", content: text }) } catch {}
			}
		},
	})

	return result.toUIMessageStreamResponse()
}

// Tool name mapping & definitions for agent mode
const permissionToToolName: Record<string, string> = {
	list_time_entries: "list-time-entries",
	list_projects: "list-projects",
	list_clients: "list-clients",
	list_todos: "list-todos",
	list_categories: "list-categories",
	get_project: "get-project",
	get_client: "get-client",
	get_todo: "get-todo",
	qonto_balance: "qonto-balance",
	qonto_transactions: "qonto-transactions",
	list_invoices: "list-invoices",
	list_recurring_expenses: "list-recurring-expenses",
	treasury_forecast: "treasury-forecast",
	check_time_anomalies: "check-time-anomalies",
}

const allToolDefs: Record<string, any> = {
	...readTools,
	"qonto-balance": tool({ description: "Solde Qonto", parameters: z.object({}) }),
	"qonto-transactions": tool({ description: "Transactions Qonto récentes", parameters: z.object({}) }),
	"list-invoices": tool({ description: "Lister les factures", parameters: z.object({ status: z.enum(["draft", "sent", "paid"]).optional() }) }),
	"list-recurring-expenses": tool({ description: "Dépenses récurrentes", parameters: z.object({}) }),
	"treasury-forecast": tool({ description: "Prévision trésorerie", parameters: z.object({ months: z.number().optional() }) }),
	"check-time-anomalies": tool({ description: "Anomalies de temps", parameters: z.object({ from: z.string(), to: z.string() }) }),
}

