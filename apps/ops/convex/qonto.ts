import { v } from "convex/values"
import OpenAI from "openai"
import { api, internal } from "./_generated/api"
import { action } from "./_generated/server"
import { requireAuth } from "./lib/auth"

const QONTO_BASE = "https://thirdparty.qonto.com/v2"

async function qontoFetch(path: string, options: RequestInit = {}) {
	const apiKey = process.env.QONTO_API_KEY
	if (!apiKey) throw new Error("QONTO_API_KEY not configured")

	const res = await fetch(`${QONTO_BASE}${path}`, {
		...options,
		headers: {
			Authorization: `${process.env.QONTO_ORG_SLUG}:${apiKey}`,
			"Content-Type": "application/json",
			...options.headers,
		},
	})

	if (!res.ok) {
		const body = await res.text()
		throw new Error(`Qonto API error ${res.status}: ${body}`)
	}

	return res.json()
}

/** Fetch organization & bank account details from Qonto */
export const getOrganization = action({
	args: {},
	handler: async () => {
		const apiKey = process.env.QONTO_API_KEY
		if (!apiKey) throw new Error("QONTO_API_KEY not configured")

		// The API key format is "org_slug:secret" — extract slug
		const slug = process.env.QONTO_ORG_SLUG
		if (!slug) throw new Error("QONTO_ORG_SLUG not configured")

		const data = await qontoFetch(`/organizations/${slug}`)
		const org = data.organization

		return {
			slug: org.slug as string,
			bankAccounts: (org.bank_accounts ?? []).map((a: Record<string, unknown>) => ({
				slug: a.slug as string,
				iban: a.iban as string,
				bic: a.bic as string,
				currency: a.currency as string,
				balance: a.balance as number,
				balanceCents: a.balance_cents as number,
				authorizedBalance: a.authorized_balance as number,
				authorizedBalanceCents: a.authorized_balance_cents as number,
			})),
		}
	},
})

/** List clients from Qonto for mapping dropdown */
export const listClients = action({
	args: {},
	handler: async () => {
		const data = await qontoFetch("/clients?per_page=100")
		return (data.clients ?? []).map((c: Record<string, unknown>) => ({
			id: c.id as string,
			name: c.name as string,
			email: (c.email as string) ?? "",
		}))
	},
})

/** Fetch the 10 most recent transactions from the main bank account */
export const listTransactions = action({
	args: { bankAccountSlug: v.string() },
	handler: async (_ctx, { bankAccountSlug }) => {
		const data = await qontoFetch(`/transactions?slug=${bankAccountSlug}&sort_by=settled_at:desc&per_page=10`)
		return (data.transactions ?? []).map((t: Record<string, unknown>) => ({
			id: t.id as string,
			amount: t.amount as number,
			amountCents: t.amount_cents as number,
			currency: t.currency as string,
			side: t.side as string,
			label: t.label as string,
			settledAt: t.settled_at as string,
			status: t.status as string,
		}))
	},
})

/** Create an invoice on Qonto, then update local state */
export const createInvoice = action({
	args: {
		invoiceId: v.id("invoices"),
		qontoClientId: v.string(),
		label: v.string(),
		lines: v.array(
			v.object({
				label: v.string(),
				quantity: v.number(),
				unitPrice: v.number(), // cents
				discountPercent: v.optional(v.number()),
			})
		),
		vatRate: v.number(),
	},
	handler: async (ctx, args) => {
		try {
			// Demo mode: simulate Qonto when API key is not set
			if (!process.env.QONTO_API_KEY) {
				const demoNumber = `F${String(Date.now()).slice(-4)}`
				await ctx.runMutation(api.invoices.markSent, {
					id: args.invoiceId,
					qontoInvoiceId: `demo_${Date.now()}`,
					qontoNumber: demoNumber,
				})
				return { success: true, qontoNumber: demoNumber }
			}

			const items = args.lines.map((line) => {
				const unitPriceEur = (line.unitPrice / 100).toFixed(2)
				return {
					title: line.label.slice(0, 40),
					description: line.label,
					quantity: String(line.quantity),
					unit_price: { value: unitPriceEur, currency: "EUR" },
					vat_rate: String(args.vatRate),
					...(line.discountPercent ? { discount: { type: "percentage", value: String(line.discountPercent) } } : {}),
				}
			})

			const data = await qontoFetch("/client_invoices", {
				method: "POST",
				body: JSON.stringify({
					client_id: args.qontoClientId,
					currency: "EUR",
					items,
				}),
			})

			const invoice = data.client_invoice ?? data
			const qontoInvoiceId = invoice.id
			const qontoNumber = invoice.number ?? invoice.invoice_number ?? ""

			await ctx.runMutation(api.invoices.markSent, {
				id: args.invoiceId,
				qontoInvoiceId,
				qontoNumber,
			})

			return { success: true, qontoNumber }
		} catch (e) {
			await ctx.runMutation(api.invoices.deleteDraft, { id: args.invoiceId })
			throw e
		}
	},
})

/** Analyze 3 months of Qonto debit transactions to detect recurring expenses via OpenAI */
export const analyzeRecurring = action({
	args: { bankAccountSlug: v.string() },
	handler: async (ctx, { bankAccountSlug }) => {
		const { userId } = await requireAuth(ctx)

		// 0. Fetch current balance and save it
		const slug = process.env.QONTO_ORG_SLUG
		if (slug) {
			const orgData = await qontoFetch(`/organizations/${slug}`)
			const accounts = orgData.organization?.bank_accounts ?? []
			const account = accounts.find((a: Record<string, unknown>) => a.slug === bankAccountSlug)
			if (account) {
				await ctx.runMutation(api.treasury.updateQontoBalance, {
					balanceCents: account.balance_cents as number,
				})
			}
		}

		// 1. Fetch 3 months of debit transactions (paginated)
		const threeMonthsAgo = new Date()
		threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)
		const settledAtFrom = threeMonthsAgo.toISOString().slice(0, 10)

		const allTransactions: Array<{
			id: string
			amount: number
			amountCents: number
			side: string
			label: string
			settledAt: string
		}> = []

		let currentPage = 1
		let hasMore = true

		while (hasMore) {
			const data = await qontoFetch(`/transactions?slug=${bankAccountSlug}&settled_at_from=${settledAtFrom}&side=debit&sort_by=settled_at:desc&per_page=100&current_page=${currentPage}`)

			const transactions = (data.transactions ?? []).map((t: Record<string, unknown>) => ({
				id: t.id as string,
				amount: t.amount as number,
				amountCents: t.amount_cents as number,
				side: t.side as string,
				label: t.label as string,
				settledAt: t.settled_at as string,
			}))

			allTransactions.push(...transactions.filter((t: { side: string }) => t.side === "debit"))

			if (data.meta?.next_page) {
				currentPage = data.meta.next_page
			} else {
				hasMore = false
			}
		}

		if (allTransactions.length === 0) {
			return { count: 0, syncedAt: Date.now() }
		}

		// 2. Load existing recurring expenses to exclude duplicates
		const existingExpenses: Array<{ name: string }> = await ctx.runQuery(api.recurringExpenses.list)
		const existingNames = existingExpenses.map((e) => e.name)

		// 3. Call OpenAI to detect recurring expenses
		const openai = new OpenAI()

		const transactionSummary = allTransactions.map((t) => ({
			id: t.id,
			label: t.label,
			amountCents: t.amountCents,
			settledAt: t.settledAt,
		}))

		const completion = await openai.chat.completions.create({
			model: "gpt-4o-mini",
			response_format: { type: "json_object" },
			messages: [
				{
					role: "system",
					content: `Tu es un assistant qui analyse des transactions bancaires pour détecter les dépenses récurrentes d'un freelance/indépendant.

Analyse les transactions et identifie les dépenses récurrentes (même montant ou label similaire qui revient régulièrement).

Règles :
- Exclure les noms déjà existants : ${JSON.stringify(existingNames)}
- Catégoriser chaque dépense parmi : SaaS, Assurance, Charges sociales, Loyer, Comptabilité, Télécom, Hébergement, Abonnement, Banque, Autre
- frequency : "monthly", "quarterly" ou "yearly"
- confidence : entre 0 et 1 (1 = très sûr)
- amountCents : montant moyen en centimes (positif)
- matchedTransactionIds : les IDs des transactions qui correspondent
- matchedLabels : les labels des transactions qui correspondent

Réponds en JSON avec cette structure exacte :
{
  "suggestions": [
    {
      "name": "Nom lisible de la dépense",
      "amountCents": 1500,
      "frequency": "monthly",
      "category": "SaaS",
      "confidence": 0.95,
      "matchedTransactionIds": ["tx_123", "tx_456"],
      "matchedLabels": ["GITHUB", "GITHUB"]
    }
  ]
}

Si aucune dépense récurrente n'est détectée, retourne { "suggestions": [] }.`,
				},
				{
					role: "user",
					content: `Voici ${allTransactions.length} transactions débit des 3 derniers mois :\n\n${JSON.stringify(transactionSummary)}`,
				},
			],
		})

		const content = completion.choices[0]?.message?.content ?? "{}"

		let parsed: {
			suggestions: Array<{
				name: string
				amountCents: number
				frequency: "monthly" | "quarterly" | "yearly"
				category: string
				confidence: number
				matchedTransactionIds: string[]
				matchedLabels: string[]
			}>
		}
		try {
			parsed = JSON.parse(content)
		} catch {
			throw new Error(`OpenAI returned invalid JSON for recurring expense analysis: ${content.slice(0, 200)}`)
		}

		const suggestions = parsed.suggestions ?? []

		if (suggestions.length === 0) {
			return { count: 0, syncedAt: Date.now() }
		}

		// 4. Deduplicate: filter out suggestions that already exist (pending, accepted, or rejected)
		const pendingSuggestions: Array<{ name: string }> = await ctx.runQuery(api.syncSuggestions.listPending)
		const processedNames: string[] = await ctx.runQuery(internal.syncSuggestions.listProcessedNames)
		const existingNamesLower = new Set([...existingNames.map((n) => n.toLowerCase()), ...pendingSuggestions.map((s) => s.name.toLowerCase()), ...processedNames.map((n) => n.toLowerCase())])
		const newSuggestions = suggestions.filter((s) => !existingNamesLower.has(s.name.toLowerCase()))

		if (newSuggestions.length === 0) {
			return { count: 0, syncedAt: Date.now() }
		}

		// 5. Insert suggestions via internal mutation
		const syncedAt = Date.now()

		await ctx.runMutation(internal.syncSuggestions.insertFromAction, {
			userId,
			source: "qonto",
			syncedAt,
			suggestions: newSuggestions.map((s) => ({
				name: s.name,
				amountCents: s.amountCents,
				frequency: s.frequency,
				category: s.category,
				confidence: s.confidence,
				transactionIds: s.matchedTransactionIds,
				transactionLabels: s.matchedLabels,
			})),
		})

		return { count: newSuggestions.length, syncedAt }
	},
})

/** Scan Qonto transactions since 2025-01-01 to detect restaurant expenses via OpenAI */
export const scanRestaurantExpenses = action({
	args: { bankAccountSlug: v.string() },
	handler: async (ctx, { bankAccountSlug }) => {
		const { userId } = await requireAuth(ctx)

		// 1. Fetch all debit transactions since 2025-01-01 (paginated)
		const settledAtFrom = "2025-01-01"
		const allTransactions: Array<{
			id: string
			amount: number
			amountCents: number
			side: string
			label: string
			settledAt: string
		}> = []

		let currentPage = 1
		let hasMore = true

		while (hasMore) {
			const data = await qontoFetch(`/transactions?slug=${bankAccountSlug}&settled_at_from=${settledAtFrom}&side=debit&sort_by=settled_at:desc&per_page=100&current_page=${currentPage}`)

			const transactions = (data.transactions ?? []).map((t: Record<string, unknown>) => ({
				id: t.id as string,
				amount: t.amount as number,
				amountCents: t.amount_cents as number,
				side: t.side as string,
				label: t.label as string,
				settledAt: t.settled_at as string,
			}))

			allTransactions.push(...transactions.filter((t: { side: string }) => t.side === "debit"))

			if (data.meta?.next_page) {
				currentPage = data.meta.next_page
			} else {
				hasMore = false
			}
		}

		if (allTransactions.length === 0) {
			return { count: 0, syncedAt: Date.now() }
		}

		// 2. Get already-known transaction IDs (from expenseSuggestions + expenses)
		const knownSuggestionIds: string[] = await ctx.runQuery(internal.expenseSuggestions.listProcessedTransactionIds)
		const existingExpenses = await ctx.runQuery(api.expenses.list, {})
		const knownExpenseIds = existingExpenses.filter((e: any) => e.qontoTransactionId).map((e: any) => e.qontoTransactionId as string)

		const knownIds = new Set([...knownSuggestionIds, ...knownExpenseIds])

		// Filter out already-known transactions
		const newTransactions = allTransactions.filter((t) => !knownIds.has(t.id))

		if (newTransactions.length === 0) {
			return { count: 0, syncedAt: Date.now() }
		}

		// 3. Call OpenAI to identify restaurant transactions
		const openai = new OpenAI()

		const transactionSummary = newTransactions.map((t) => ({
			id: t.id,
			label: t.label,
			amountCents: t.amountCents,
			settledAt: t.settledAt,
		}))

		const completion = await openai.chat.completions.create({
			model: "gpt-4o-mini",
			response_format: { type: "json_object" },
			messages: [
				{
					role: "system",
					content: `Tu es un assistant qui analyse des transactions bancaires pour identifier les dépenses de restaurant/repas d'un freelance.

Analyse les transactions et identifie celles qui POURRAIENT être des repas au restaurant, brasserie, café, fast-food, livraison repas, traiteur, etc.

Règles :
- EN CAS DE DOUTE, INCLURE la transaction avec une confidence basse (0.3-0.5). L'utilisateur préfère trier des faux positifs que rater des vrais restos.
- confidence : entre 0 et 1 (1 = très sûr que c'est un restaurant)
  - 0.9+ : label contient explicitement "restaurant", "brasserie", etc.
  - 0.6-0.9 : nom propre qui ressemble à un établissement de restauration
  - 0.3-0.6 : doute mais montant et label compatibles avec un repas (5-150€, nom propre inconnu)
- Ne PAS inclure : supermarchés, épiceries, stations-service, abonnements SaaS, charges sociales, loyers
- INCLURE même si tu n'es pas sûr : noms propres inconnus avec un montant typique de repas (10-80€), bars, pubs, boulangeries, traiteurs, Uber Eats, Deliveroo, Just Eat, etc.

Réponds en JSON :
{
  "restaurants": [
    {
      "transactionId": "tx_123",
      "label": "Label original",
      "amountCents": 2500,
      "date": "2025-03-15",
      "confidence": 0.95
    }
  ]
}

Si aucune transaction restaurant n'est trouvée, retourne { "restaurants": [] }.`,
				},
				{
					role: "user",
					content: `Voici ${newTransactions.length} transactions débit à analyser :\n\n${JSON.stringify(transactionSummary)}`,
				},
			],
		})

		const content = completion.choices[0]?.message?.content ?? "{}"
		let parsed: {
			restaurants: Array<{
				transactionId: string
				label: string
				amountCents: number
				date: string
				confidence: number
			}>
		}
		try {
			parsed = JSON.parse(content)
		} catch {
			throw new Error(`OpenAI returned invalid JSON: ${content.slice(0, 200)}`)
		}

		const restaurants = parsed.restaurants ?? []

		if (restaurants.length === 0) {
			return { count: 0, syncedAt: Date.now() }
		}

		// 4. Insert suggestions
		const syncedAt = Date.now()
		await ctx.runMutation(internal.expenseSuggestions.insertFromAction, {
			userId,
			source: "qonto",
			syncedAt,
			suggestions: restaurants.map((r) => ({
				qontoTransactionId: r.transactionId,
				label: r.label,
				amountCents: Math.abs(r.amountCents),
				date: r.date.slice(0, 10),
				confidence: r.confidence,
			})),
		})

		return { count: restaurants.length, syncedAt }
	},
})
