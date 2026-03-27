import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { openai } from "@ai-sdk/openai"
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server"
import { convertToModelMessages, streamText } from "ai"
import { ConvexHttpClient } from "convex/browser"
import { z } from "zod"
import { api } from "@/convex/_generated/api"
import { readTools } from "@/lib/chat/tools"

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

// ─── Soul file loader ───

async function loadSoulFile(slug: string, file: string): Promise<string> {
	try {
		const path = join(process.cwd(), "agents", slug, file)
		return await readFile(path, "utf-8")
	} catch {
		return ""
	}
}

// ─── Tool helper (same pattern as @/lib/chat/tools) ───

function tool(opts: { description: string; parameters: z.ZodType }) {
	return { description: opts.description, inputSchema: opts.parameters }
}

// ─── Read tool executors (reused from main chat) ───

function buildReadToolExecutors(token: string) {
	convex.setAuth(token)

	return {
		"list-clients": async () => {
			const clients = await convex.query(api.clients.list, {})
			return clients.map((c) => ({
				id: c._id,
				name: c.name,
				email: c.email ?? null,
			}))
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
			}
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

		"list-categories": async () => {
			return convex.query(api.categories.list, {})
		},

		// ── Finance tools (for CFO agent) ──

		"qonto-balance": async () => {
			const settings = await convex.query(api.treasury.getSettings, {})
			return {
				balanceCents: settings?.qontoBalanceCents ?? 0,
				balanceEur: (settings?.qontoBalanceCents ?? 0) / 100,
			}
		},

		"qonto-transactions": async () => {
			try {
				return await convex.action(api.qonto.listTransactions, {})
			} catch {
				return { error: "Qonto API non configurée ou indisponible" }
			}
		},

		"list-invoices": async ({ status }: { status?: string }) => {
			const invoices = await convex.query(api.invoices.list, status ? { status: status as any } : {})
			return invoices.map((inv: any) => ({
				id: inv._id,
				clientId: inv.clientId,
				amount: inv.totalCents ? inv.totalCents / 100 : null,
				status: inv.status,
				date: inv.date ?? inv._creationTime,
			}))
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
			for (const e of entries) {
				byDate[e.date] = (byDate[e.date] ?? 0) + e.minutes
			}
			const anomalies: string[] = []
			const start = new Date(from)
			const end = new Date(to)
			for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
				if (d.getDay() === 0 || d.getDay() === 6) continue
				const dateStr = d.toISOString().slice(0, 10)
				const minutes = byDate[dateStr] ?? 0
				if (minutes === 0) anomalies.push(`❌ ${dateStr}: aucune saisie`)
				else if (minutes > 600) anomalies.push(`⚠ ${dateStr}: ${Math.round(minutes / 60)}h (>10h)`)
				else if (minutes < 120) anomalies.push(`⚠ ${dateStr}: seulement ${Math.round(minutes / 60)}h (<2h)`)
			}
			return { totalDays: Object.keys(byDate).length, totalMinutes: Object.values(byDate).reduce((a, b) => a + b, 0), anomalies, anomalyCount: anomalies.length }
		},
	}
}

// ─── Map agent permission names to readTools keys ───

const permissionToToolName: Record<string, string> = {
	list_time_entries: "list-time-entries",
	list_projects: "list-projects",
	list_clients: "list-clients",
	list_todos: "list-todos",
	list_categories: "list-categories",
	get_project: "get-project",
	get_client: "get-client",
	get_todo: "get-todo",
	// Finance tools
	qonto_balance: "qonto-balance",
	qonto_transactions: "qonto-transactions",
	list_invoices: "list-invoices",
	list_recurring_expenses: "list-recurring-expenses",
	treasury_forecast: "treasury-forecast",
	// Time tools
	check_time_anomalies: "check-time-anomalies",
}

// Finance tool definitions (not in @/lib/chat/tools)
const financeToolDefs: Record<string, any> = {
	"qonto-balance": tool({
		description: "Obtenir le solde actuel du compte Qonto",
		parameters: z.object({}),
	}),
	"qonto-transactions": tool({
		description: "Lister les 10 dernières transactions bancaires Qonto",
		parameters: z.object({}),
	}),
	"list-invoices": tool({
		description: "Lister les factures. Peut filtrer par statut.",
		parameters: z.object({
			status: z.enum(["draft", "sent", "paid"]).optional().describe("Filtrer par statut"),
		}),
	}),
	"list-recurring-expenses": tool({
		description: "Lister les dépenses récurrentes actives (abonnements, charges, etc.)",
		parameters: z.object({}),
	}),
	"treasury-forecast": tool({
		description: "Obtenir la prévision de trésorerie sur N mois",
		parameters: z.object({
			months: z.number().optional().describe("Nombre de mois (défaut 6)"),
		}),
	}),
	"check-time-anomalies": tool({
		description: "Vérifier les anomalies de saisie de temps : jours vides, heures excessives",
		parameters: z.object({
			from: z.string().describe("Date de début YYYY-MM-DD"),
			to: z.string().describe("Date de fin YYYY-MM-DD"),
		}),
	}),
}

export async function POST(
	req: Request,
	{ params }: { params: Promise<{ slug: string }> }
) {
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

	const { slug } = await params
	convex.setAuth(token)

	// Fetch agent
	const agent = await convex.query(api.agents.getBySlug, { slug })
	if (!agent) {
		return new Response(JSON.stringify({ error: "Agent introuvable" }), {
			status: 404,
			headers: { "Content-Type": "application/json" },
		})
	}

	// Budget check
	const today = new Date().toISOString().slice(0, 10)
	const todayUsd = agent.usage.lastResetDay === today ? agent.usage.todayUsd : 0
	if (todayUsd >= agent.budget.maxPerDay) {
		return new Response(
			JSON.stringify({ error: `Budget journalier atteint ($${agent.budget.maxPerDay})` }),
			{ status: 429, headers: { "Content-Type": "application/json" } }
		)
	}

	// Load soul files (CONTEXT.md is optional)
	const [soul, style, skill, context] = await Promise.all([
		loadSoulFile(slug, "SOUL.md"),
		loadSoulFile(slug, "STYLE.md"),
		loadSoulFile(slug, "SKILL.md"),
		loadSoulFile(slug, "CONTEXT.md"),
	])

	// Load agent memory (private + shared)
	const [privateMemories, sharedMemories] = await Promise.all([
		convex.query(api.agentMemory.list, { agentId: agent._id }),
		convex.query(api.agentMemory.listShared, {}),
	])
	const allMemories = [...privateMemories, ...sharedMemories]
	const categoryOrder = ["rule", "preference", "pattern", "fact", "episode"]
	const sortedMemories = allMemories
		.sort((a, b) => categoryOrder.indexOf(a.category ?? "fact") - categoryOrder.indexOf(b.category ?? "fact"))
		.slice(0, 15)
	const memoryBlock = sortedMemories.length > 0
		? `\n## Mémoire\n${sortedMemories.map((m) => `- [${m.category}${m.scope === "shared" ? " partagé" : ""}] ${m.content}`).join("\n")}`
		: ""

	// Build system prompt
	const todayFormatted = new Date().toLocaleDateString("fr-FR", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	})
	const todayISO = new Date().toISOString().slice(0, 10)

	const systemPrompt = [
		`INSTRUCTION CRITIQUE : Tu es ${agent.name}. Tu dois STRICTEMENT respecter la personnalité, le rôle et le contexte définis ci-dessous. Ne t'en écarte JAMAIS. Tu n'es PAS un assistant générique — tu es ${agent.name}, ${agent.role}. Réponds TOUJOURS en accord avec ton identité ci-dessous.\n`,
		soul || `Tu es ${agent.name}, ${agent.role}.`,
		style ? `\n## Style\n${style}` : "",
		skill ? `\n## Compétences\n${skill}` : "",
		context ? `\n## Contexte Projet\n${context}` : "",
		memoryBlock,
		`\n## Contexte temporel\nAujourd'hui : ${todayFormatted} (${todayISO})`,
		`\n## Règles\n- Réponds TOUJOURS en français\n- Reste dans ton rôle de ${agent.role}\n- Formate les dates en ISO: YYYY-MM-DD\n- "aujourd'hui" = ${todayISO}\n- N'invente jamais un ID Convex`,
	]
		.filter(Boolean)
		.join("\n")

	console.log(`[agent-chat] ${slug} prompt: ${systemPrompt.length} chars, soul: ${soul.length}, style: ${style.length}, skill: ${skill.length}, context: ${context.length}`)

	// Build tools from agent permissions
	const tools: Record<string, any> = {}
	const executors = buildReadToolExecutors(token)

	// Add read tools based on agent.permissions.safe
	for (const perm of agent.permissions.safe) {
		const toolName = permissionToToolName[perm]
		if (!toolName) continue

		// Check standard read tools first, then finance tools
		if (toolName in readTools) {
			tools[toolName] = {
				...readTools[toolName as keyof typeof readTools],
				execute: executors[toolName as keyof typeof executors],
			}
		} else if (toolName in financeToolDefs) {
			tools[toolName] = {
				...financeToolDefs[toolName],
				execute: executors[toolName as keyof typeof executors],
			}
		}
	}

	console.log(`[agent-chat] ${slug} tools registered:`, Object.keys(tools))
	console.log(`[agent-chat] ${slug} permissions.safe:`, agent.permissions.safe)

	// Add create_mission tool for all agents
	tools["create-mission"] = {
		...tool({
			description: "Crée une mission pour un agent. Utilise cette commande quand l'utilisateur demande une tâche qui nécessite une exécution asynchrone.",
			parameters: z.object({
				title: z.string().describe("Titre de la mission"),
				prompt: z.string().describe("Prompt détaillé de la mission"),
				priority: z.enum(["low", "medium", "high", "urgent"]).optional().describe("Priorité (default: medium)"),
			}),
		}),
		execute: async ({ title, prompt, priority }: { title: string; prompt: string; priority?: string }) => {
			convex.setAuth(token)
			const id = await convex.mutation(api.missions.create, {
				agentId: agent._id,
				title,
				prompt,
				status: "todo",
				priority: (priority ?? "medium") as "low" | "medium" | "high" | "urgent",
			})
			return { id, status: "created", title }
		},
	}

	const { messages } = await req.json()

	// Convert UI messages to model messages
	let modelMessages: Awaited<ReturnType<typeof convertToModelMessages>>
	try {
		modelMessages = await convertToModelMessages(messages, { tools })
	} catch (err) {
		console.error("[agent-chat] convertToModelMessages failed:", err)
		return new Response(JSON.stringify({ error: "Failed to convert messages" }), {
			status: 400,
			headers: { "Content-Type": "application/json" },
		})
	}

	const model = openai.chat(agent.model)

	// Prepend system prompt as first message (more reliable than system param for some models)
	const messagesWithSystem = [
		{ role: "system" as const, content: systemPrompt },
		...modelMessages,
	]

	const result = streamText({
		model,
		messages: messagesWithSystem,
		tools,
		maxSteps: 5,
		onFinish: async ({ usage }) => {
			// Estimate cost (rough: $0.15/1M input tokens, $0.60/1M output tokens for gpt-4.1-mini)
			const inputCost = ((usage?.inputTokens ?? 0) / 1_000_000) * 0.15
			const outputCost = ((usage?.outputTokens ?? 0) / 1_000_000) * 0.60
			const costUsd = Math.round((inputCost + outputCost) * 1_000_000) / 1_000_000

			if (costUsd > 0) {
				try {
					convex.setAuth(token)
					await convex.mutation(api.agents.addUsage, {
						id: agent._id,
						costUsd,
					})
				} catch (err) {
					console.error("[agent-chat] addUsage failed:", err)
				}
			}
		},
	})

	return result.toUIMessageStreamResponse()
}
