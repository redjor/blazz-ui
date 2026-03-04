import type { Id } from "./_generated/dataModel"
import { mutation } from "./_generated/server"

/**
 * Seed mutation — dev only.
 * Run via: npx convex run seed:run
 */
export const run = mutation({
	args: {},
	handler: async (ctx) => {
		// Wipe existing data
		const existingTodos = await ctx.db.query("todos").collect()
		for (const t of existingTodos) await ctx.db.delete(t._id)

		const existingClients = await ctx.db.query("clients").collect()
		for (const c of existingClients) {
			const projects = await ctx.db
				.query("projects")
				.withIndex("by_client", (q) => q.eq("clientId", c._id))
				.collect()
			for (const p of projects) {
				const entries = await ctx.db
					.query("timeEntries")
					.withIndex("by_project", (q) => q.eq("projectId", p._id))
					.collect()
				for (const e of entries) await ctx.db.delete(e._id)
				await ctx.db.delete(p._id)
			}
			await ctx.db.delete(c._id)
		}

		const now = Date.now()

		// ── Clients ──────────────────────────────────────────────────────────────
		const acmeId = await ctx.db.insert("clients", {
			name: "Acme Corp",
			email: "contact@acme.fr",
			phone: "+33 1 42 00 00 01",
			address: "12 rue de Rivoli, 75001 Paris",
			notes: "Client historique, paiement à 30j.",
			createdAt: now - 90 * 86400_000,
		})

		const veridianId = await ctx.db.insert("clients", {
			name: "Veridian Solutions",
			email: "tech@veridian.io",
			phone: "+33 6 12 34 56 78",
			address: "45 avenue des Champs-Élysées, 75008 Paris",
			notes: "Startup SaaS B2B. Contact: Léa Moreau.",
			createdAt: now - 60 * 86400_000,
		})

		const atlasId = await ctx.db.insert("clients", {
			name: "Atlas Média",
			email: "projets@atlas-media.fr",
			notes: "Agence digitale. Missions ponctuelles.",
			createdAt: now - 30 * 86400_000,
		})

		// ── Projects ─────────────────────────────────────────────────────────────
		const acmeDashboardId = await ctx.db.insert("projects", {
			clientId: acmeId,
			name: "Dashboard Analytics",
			description: "Refonte complète du dashboard interne avec Next.js + Recharts.",
			tjm: 700,
			hoursPerDay: 7,
			currency: "EUR",
			status: "active",
			startDate: "2026-01-06",
			createdAt: now - 55 * 86400_000,
		})

		const acmeMobileId = await ctx.db.insert("projects", {
			clientId: acmeId,
			name: "App Mobile RH",
			description: "Prototype React Native pour la gestion des congés.",
			tjm: 650,
			hoursPerDay: 7,
			currency: "EUR",
			status: "paused",
			startDate: "2025-11-01",
			endDate: "2025-12-20",
			createdAt: now - 120 * 86400_000,
		})

		const veridianApiId = await ctx.db.insert("projects", {
			clientId: veridianId,
			name: "API Gateway v2",
			description: "Migration vers tRPC + Zod. Couverture de tests >80%.",
			tjm: 750,
			hoursPerDay: 7,
			currency: "EUR",
			status: "active",
			startDate: "2026-01-20",
			createdAt: now - 40 * 86400_000,
		})

		const veridianDesignId = await ctx.db.insert("projects", {
			clientId: veridianId,
			name: "Design System",
			description: "Audit + implémentation Figma tokens → composants React.",
			tjm: 700,
			hoursPerDay: 4,
			currency: "EUR",
			status: "closed",
			startDate: "2025-10-01",
			endDate: "2025-12-31",
			createdAt: now - 150 * 86400_000,
		})

		const atlasId2 = await ctx.db.insert("projects", {
			clientId: atlasId,
			name: "Site Vitrine E-commerce",
			description: "Next.js + Stripe. Livraison prévue fin mars.",
			tjm: 600,
			hoursPerDay: 7,
			currency: "EUR",
			status: "active",
			startDate: "2026-02-10",
			createdAt: now - 20 * 86400_000,
		})

		const atlasRedesignId = await ctx.db.insert("projects", {
			clientId: atlasId,
			name: "Refonte Brand Identity",
			description: "Audit + refonte charte graphique web.",
			tjm: 550,
			hoursPerDay: 4,
			currency: "EUR",
			status: "closed",
			startDate: "2025-09-01",
			endDate: "2025-10-31",
			createdAt: now - 180 * 86400_000,
		})

		// ── Client 4 : Nexus Labs ─────────────────────────────────────────────────
		const nexusId = await ctx.db.insert("clients", {
			name: "Nexus Labs",
			email: "eng@nexuslabs.dev",
			phone: "+33 7 55 44 33 22",
			address: "10 rue du Faubourg Saint-Antoine, 75011 Paris",
			notes: "Scale-up ML/AI. CTO = Thomas Reyes. Paiement à 15j.",
			createdAt: now - 45 * 86400_000,
		})

		const nexusPlatformId = await ctx.db.insert("projects", {
			clientId: nexusId,
			name: "ML Platform",
			description: "Dashboard monitoring modèles ML + alerting pipeline.",
			tjm: 800,
			hoursPerDay: 7,
			currency: "EUR",
			status: "active",
			startDate: "2026-01-13",
			createdAt: now - 45 * 86400_000,
		})

		const nexusOnboardingId = await ctx.db.insert("projects", {
			clientId: nexusId,
			name: "Onboarding Flow",
			description: "Refonte parcours utilisateur signup → activation.",
			tjm: 750,
			hoursPerDay: 7,
			currency: "EUR",
			status: "paused",
			startDate: "2025-12-01",
			endDate: "2026-01-10",
			createdAt: now - 80 * 86400_000,
		})

		// ── Client 5 : Orbital Finance ────────────────────────────────────────────
		const orbitalId = await ctx.db.insert("clients", {
			name: "Orbital Finance",
			email: "tech@orbital.finance",
			phone: "+33 1 88 77 66 55",
			address: "25 boulevard Haussmann, 75009 Paris",
			notes: "Fintech. NDA signé. Contact: Sophie Mercier.",
			createdAt: now - 200 * 86400_000,
		})

		const orbitalRiskId = await ctx.db.insert("projects", {
			clientId: orbitalId,
			name: "Risk Dashboard",
			description: "Tableau de bord risque temps réel. Projet terminé.",
			tjm: 850,
			hoursPerDay: 7,
			currency: "EUR",
			status: "closed",
			startDate: "2025-08-01",
			endDate: "2025-11-30",
			createdAt: now - 200 * 86400_000,
		})

		const orbitalMobileId = await ctx.db.insert("projects", {
			clientId: orbitalId,
			name: "App Mobile Trader",
			description: "React Native — suivi portefeuille + alertes.",
			tjm: 800,
			hoursPerDay: 7,
			currency: "EUR",
			status: "active",
			startDate: "2026-02-03",
			createdAt: now - 27 * 86400_000,
		})

		// ── Time Entries ──────────────────────────────────────────────────────────
		// Helper : crée une entrée
		type EntryStatus = "draft" | "ready_to_invoice" | "invoiced" | "paid"
		type EntryArgs = {
			projectId: Id<"projects">
			date: string
			minutes: number
			hourlyRate: number
			description?: string
			billable: boolean
			invoicedAt?: number
			status?: EntryStatus
		}

		const insert = (e: EntryArgs) => ctx.db.insert("timeEntries", { ...e, createdAt: now })

		const invoicedTs = now - 15 * 86400_000
		const paidTs = now - 60 * 86400_000

		// Acme — Dashboard Analytics
		// janv 06-15 : payés (status paid + invoicedAt) — facture janvier encaissée
		// janv 20-22 : prêts à facturer (status ready_to_invoice)
		// fév 03-17 : prêts à facturer (status ready_to_invoice)
		// fév 24-25 : brouillons récents (status draft)
		const acmeDashEntries: EntryArgs[] = [
			{
				projectId: acmeDashboardId,
				date: "2026-01-06",
				minutes: 420,
				hourlyRate: 100,
				description: "Setup projet, architecture Next.js",
				billable: true,
				invoicedAt: paidTs,
				status: "paid",
			},
			{
				projectId: acmeDashboardId,
				date: "2026-01-07",
				minutes: 420,
				hourlyRate: 100,
				description: "Composants DataGrid + filtres",
				billable: true,
				invoicedAt: paidTs,
				status: "paid",
			},
			{
				projectId: acmeDashboardId,
				date: "2026-01-08",
				minutes: 210,
				hourlyRate: 100,
				description: "Intégration Recharts",
				billable: true,
				invoicedAt: paidTs,
				status: "paid",
			},
			{
				projectId: acmeDashboardId,
				date: "2026-01-09",
				minutes: 420,
				hourlyRate: 100,
				description: "Auth + middleware",
				billable: true,
				invoicedAt: paidTs,
				status: "paid",
			},
			{
				projectId: acmeDashboardId,
				date: "2026-01-13",
				minutes: 420,
				hourlyRate: 100,
				description: "Dark mode + tokens CSS",
				billable: true,
				invoicedAt: paidTs,
				status: "paid",
			},
			{
				projectId: acmeDashboardId,
				date: "2026-01-14",
				minutes: 420,
				hourlyRate: 100,
				description: "Page KPIs + exports CSV",
				billable: true,
				invoicedAt: paidTs,
				status: "paid",
			},
			{
				projectId: acmeDashboardId,
				date: "2026-01-15",
				minutes: 300,
				hourlyRate: 100,
				description: "Tests unitaires composants",
				billable: true,
				invoicedAt: paidTs,
				status: "paid",
			},
			{
				projectId: acmeDashboardId,
				date: "2026-01-16",
				minutes: 60,
				hourlyRate: 100,
				description: "Réunion weekly client",
				billable: false,
			},
			{
				projectId: acmeDashboardId,
				date: "2026-01-20",
				minutes: 420,
				hourlyRate: 100,
				description: "Dashboard admin + RBAC",
				billable: true,
				status: "ready_to_invoice",
			},
			{
				projectId: acmeDashboardId,
				date: "2026-01-21",
				minutes: 420,
				hourlyRate: 100,
				description: "Notifications temps réel",
				billable: true,
				status: "ready_to_invoice",
			},
			{
				projectId: acmeDashboardId,
				date: "2026-01-22",
				minutes: 420,
				hourlyRate: 100,
				description: "Optimisations perf + bundle",
				billable: true,
				status: "ready_to_invoice",
			},
			{
				projectId: acmeDashboardId,
				date: "2026-02-03",
				minutes: 420,
				hourlyRate: 100,
				description: "Revue de code + refacto",
				billable: true,
				status: "ready_to_invoice",
			},
			{
				projectId: acmeDashboardId,
				date: "2026-02-04",
				minutes: 420,
				hourlyRate: 100,
				description: "Page reporting avancé",
				billable: true,
				status: "ready_to_invoice",
			},
			{
				projectId: acmeDashboardId,
				date: "2026-02-05",
				minutes: 300,
				hourlyRate: 100,
				description: "Corrections retours client",
				billable: true,
				status: "ready_to_invoice",
			},
			{
				projectId: acmeDashboardId,
				date: "2026-02-10",
				minutes: 420,
				hourlyRate: 100,
				description: "Intégration API REST externe",
				billable: true,
				status: "ready_to_invoice",
			},
			{
				projectId: acmeDashboardId,
				date: "2026-02-11",
				minutes: 420,
				hourlyRate: 100,
				description: "Tests E2E Playwright",
				billable: true,
				status: "ready_to_invoice",
			},
			{
				projectId: acmeDashboardId,
				date: "2026-02-17",
				minutes: 420,
				hourlyRate: 100,
				description: "Prépa démo + documentation",
				billable: true,
				status: "ready_to_invoice",
			},
			{
				projectId: acmeDashboardId,
				date: "2026-02-18",
				minutes: 120,
				hourlyRate: 100,
				description: "Démo client",
				billable: false,
			},
			{
				projectId: acmeDashboardId,
				date: "2026-02-24",
				minutes: 420,
				hourlyRate: 100,
				description: "Bug fixes post-démo",
				billable: true,
				status: "draft",
			},
			{
				projectId: acmeDashboardId,
				date: "2026-02-25",
				minutes: 420,
				hourlyRate: 100,
				description: "Feature drilldown par région",
				billable: true,
				status: "draft",
			},
		]

		// Veridian — API Gateway
		// janv : prêts à facturer
		// fév 03-11 : prêts à facturer
		// fév 17-24 : brouillons
		// mars 01-02 : draft (mois en cours)
		const veridianEntries: EntryArgs[] = [
			{
				projectId: veridianApiId,
				date: "2026-01-20",
				minutes: 420,
				hourlyRate: 107,
				description: "Audit code existant + plan migration",
				billable: true,
				status: "ready_to_invoice",
			},
			{
				projectId: veridianApiId,
				date: "2026-01-21",
				minutes: 420,
				hourlyRate: 107,
				description: "Setup tRPC router + Zod schemas",
				billable: true,
				status: "ready_to_invoice",
			},
			{
				projectId: veridianApiId,
				date: "2026-01-22",
				minutes: 420,
				hourlyRate: 107,
				description: "Migration endpoints auth",
				billable: true,
				status: "ready_to_invoice",
			},
			{
				projectId: veridianApiId,
				date: "2026-01-27",
				minutes: 420,
				hourlyRate: 107,
				description: "Middleware rate limiting",
				billable: true,
				status: "ready_to_invoice",
			},
			{
				projectId: veridianApiId,
				date: "2026-01-28",
				minutes: 300,
				hourlyRate: 107,
				description: "Tests + CI pipeline",
				billable: true,
				status: "ready_to_invoice",
			},
			{
				projectId: veridianApiId,
				date: "2026-02-03",
				minutes: 420,
				hourlyRate: 107,
				description: "Migration endpoints users/billing",
				billable: true,
				status: "ready_to_invoice",
			},
			{
				projectId: veridianApiId,
				date: "2026-02-04",
				minutes: 420,
				hourlyRate: 107,
				description: "WebSockets + subscriptions tRPC",
				billable: true,
				status: "ready_to_invoice",
			},
			{
				projectId: veridianApiId,
				date: "2026-02-10",
				minutes: 420,
				hourlyRate: 107,
				description: "Couverture tests 80% atteinte",
				billable: true,
				status: "ready_to_invoice",
			},
			{
				projectId: veridianApiId,
				date: "2026-02-11",
				minutes: 210,
				hourlyRate: 107,
				description: "Doc Swagger auto-générée",
				billable: true,
				status: "ready_to_invoice",
			},
			{
				projectId: veridianApiId,
				date: "2026-02-17",
				minutes: 420,
				hourlyRate: 107,
				description: "Déploiement staging + smoke tests",
				billable: true,
				status: "ready_to_invoice",
			},
			{
				projectId: veridianApiId,
				date: "2026-02-24",
				minutes: 420,
				hourlyRate: 107,
				description: "Hotfixes + monitoring Sentry",
				billable: true,
				status: "ready_to_invoice",
			},
			{
				projectId: veridianApiId,
				date: "2026-02-25",
				minutes: 120,
				hourlyRate: 107,
				description: "Réunion démo + retours équipe",
				billable: false,
			},
			{
				projectId: veridianApiId,
				date: "2026-03-02",
				minutes: 420,
				hourlyRate: 107,
				description: "Performance tuning requêtes DB",
				billable: true,
				status: "draft",
			},
		]

		// Atlas — Site vitrine + refonte brand
		const atlasEntries: EntryArgs[] = [
			// Site vitrine — fév
			{
				projectId: atlasId2,
				date: "2026-02-10",
				minutes: 420,
				hourlyRate: 86,
				description: "Kickoff + setup projet Stripe",
				billable: true,
				status: "ready_to_invoice",
			},
			{
				projectId: atlasId2,
				date: "2026-02-11",
				minutes: 420,
				hourlyRate: 86,
				description: "Maquettes → composants Next.js",
				billable: true,
				status: "ready_to_invoice",
			},
			{
				projectId: atlasId2,
				date: "2026-02-12",
				minutes: 300,
				hourlyRate: 86,
				description: "Catalogue produits + filtres",
				billable: true,
				status: "ready_to_invoice",
			},
			{
				projectId: atlasId2,
				date: "2026-02-17",
				minutes: 420,
				hourlyRate: 86,
				description: "Panier + tunnel Stripe",
				billable: true,
				status: "ready_to_invoice",
			},
			{
				projectId: atlasId2,
				date: "2026-02-18",
				minutes: 420,
				hourlyRate: 86,
				description: "Emails transactionnels Resend",
				billable: true,
				status: "ready_to_invoice",
			},
			{
				projectId: atlasId2,
				date: "2026-02-24",
				minutes: 420,
				hourlyRate: 86,
				description: "SEO + sitemap + OG tags",
				billable: true,
				status: "draft",
			},
			{
				projectId: atlasId2,
				date: "2026-02-25",
				minutes: 210,
				hourlyRate: 86,
				description: "Corrections maquettes mobiles",
				billable: true,
				status: "draft",
			},
			// Site vitrine — mars
			{
				projectId: atlasId2,
				date: "2026-03-01",
				minutes: 300,
				hourlyRate: 86,
				description: "Page produit détail + galerie",
				billable: true,
				status: "draft",
			},
			{
				projectId: atlasId2,
				date: "2026-03-02",
				minutes: 420,
				hourlyRate: 86,
				description: "Animations scroll + micro-interactions",
				billable: true,
				status: "draft",
			},
			// Refonte brand (projet fermé, payé)
			{
				projectId: atlasRedesignId,
				date: "2025-09-08",
				minutes: 420,
				hourlyRate: 138,
				description: "Audit identité visuelle actuelle",
				billable: true,
				invoicedAt: paidTs,
				status: "paid",
			},
			{
				projectId: atlasRedesignId,
				date: "2025-09-09",
				minutes: 420,
				hourlyRate: 138,
				description: "Moodboard + directions créatives",
				billable: true,
				invoicedAt: paidTs,
				status: "paid",
			},
			{
				projectId: atlasRedesignId,
				date: "2025-09-15",
				minutes: 420,
				hourlyRate: 138,
				description: "Palette couleurs + typographie",
				billable: true,
				invoicedAt: paidTs,
				status: "paid",
			},
			{
				projectId: atlasRedesignId,
				date: "2025-10-06",
				minutes: 420,
				hourlyRate: 138,
				description: "Composants Figma tokens",
				billable: true,
				invoicedAt: paidTs,
				status: "paid",
			},
			{
				projectId: atlasRedesignId,
				date: "2025-10-20",
				minutes: 300,
				hourlyRate: 138,
				description: "Livraison brand book + exports",
				billable: true,
				invoicedAt: paidTs,
				status: "paid",
			},
		]

		// Acme — Mobile RH (projet fermé, payé)
		const acmeMobileEntries: EntryArgs[] = [
			{
				projectId: acmeMobileId,
				date: "2025-11-03",
				minutes: 420,
				hourlyRate: 93,
				description: "Setup Expo + navigation",
				billable: true,
				invoicedAt: paidTs,
				status: "paid",
			},
			{
				projectId: acmeMobileId,
				date: "2025-11-04",
				minutes: 420,
				hourlyRate: 93,
				description: "Écrans congés + formulaires",
				billable: true,
				invoicedAt: paidTs,
				status: "paid",
			},
			{
				projectId: acmeMobileId,
				date: "2025-11-10",
				minutes: 420,
				hourlyRate: 93,
				description: "Intégration API RH",
				billable: true,
				invoicedAt: paidTs,
				status: "paid",
			},
			{
				projectId: acmeMobileId,
				date: "2025-11-17",
				minutes: 420,
				hourlyRate: 93,
				description: "Push notifications",
				billable: true,
				invoicedAt: paidTs,
				status: "paid",
			},
			{
				projectId: acmeMobileId,
				date: "2025-12-01",
				minutes: 420,
				hourlyRate: 93,
				description: "Tests devices + corrections",
				billable: true,
				invoicedAt: paidTs,
				status: "paid",
			},
			{
				projectId: acmeMobileId,
				date: "2025-12-15",
				minutes: 300,
				hourlyRate: 93,
				description: "Livraison prototype",
				billable: true,
				invoicedAt: paidTs,
				status: "paid",
			},
		]

		// Acme — Dashboard : mars 2026
		const acmeMarsEntries: EntryArgs[] = [
			{
				projectId: acmeDashboardId,
				date: "2026-03-02",
				minutes: 420,
				hourlyRate: 100,
				description: "Feature export PDF rapports",
				billable: true,
				status: "draft",
			},
		]

		// Nexus Labs — ML Platform
		// janv-fév : ready_to_invoice
		// mars : draft
		const nexusEntries: EntryArgs[] = [
			{
				projectId: nexusPlatformId,
				date: "2026-01-13",
				minutes: 420,
				hourlyRate: 114,
				description: "Architecture monitoring + choix stack",
				billable: true,
				status: "ready_to_invoice",
			},
			{
				projectId: nexusPlatformId,
				date: "2026-01-14",
				minutes: 420,
				hourlyRate: 114,
				description: "Ingestion métriques modèles",
				billable: true,
				status: "ready_to_invoice",
			},
			{
				projectId: nexusPlatformId,
				date: "2026-01-20",
				minutes: 420,
				hourlyRate: 114,
				description: "Dashboard temps réel WebSockets",
				billable: true,
				status: "ready_to_invoice",
			},
			{
				projectId: nexusPlatformId,
				date: "2026-01-21",
				minutes: 420,
				hourlyRate: 114,
				description: "Alerting seuils + notifications",
				billable: true,
				status: "ready_to_invoice",
			},
			{
				projectId: nexusPlatformId,
				date: "2026-01-27",
				minutes: 300,
				hourlyRate: 114,
				description: "Auth RBAC + gestion équipes",
				billable: true,
				status: "ready_to_invoice",
			},
			{
				projectId: nexusPlatformId,
				date: "2026-02-03",
				minutes: 420,
				hourlyRate: 114,
				description: "Graphes drift / accuracy historique",
				billable: true,
				status: "ready_to_invoice",
			},
			{
				projectId: nexusPlatformId,
				date: "2026-02-04",
				minutes: 420,
				hourlyRate: 114,
				description: "Comparaison versions de modèles",
				billable: true,
				status: "ready_to_invoice",
			},
			{
				projectId: nexusPlatformId,
				date: "2026-02-10",
				minutes: 420,
				hourlyRate: 114,
				description: "Exports rapports PDF/CSV",
				billable: true,
				status: "ready_to_invoice",
			},
			{
				projectId: nexusPlatformId,
				date: "2026-02-17",
				minutes: 420,
				hourlyRate: 114,
				description: "Intégration MLflow + logging",
				billable: true,
				status: "draft",
			},
			{
				projectId: nexusPlatformId,
				date: "2026-02-18",
				minutes: 120,
				hourlyRate: 114,
				description: "Démo intermédiaire Thomas",
				billable: false,
			},
			{
				projectId: nexusPlatformId,
				date: "2026-02-24",
				minutes: 420,
				hourlyRate: 114,
				description: "Pipeline batch retraining hooks",
				billable: true,
				status: "draft",
			},
			{
				projectId: nexusPlatformId,
				date: "2026-03-02",
				minutes: 420,
				hourlyRate: 114,
				description: "UI annotations + feedback labellers",
				billable: true,
				status: "draft",
			},
			// Onboarding Flow (projet pausé, payé)
			{
				projectId: nexusOnboardingId,
				date: "2025-12-01",
				minutes: 420,
				hourlyRate: 107,
				description: "Audit funnel onboarding existant",
				billable: true,
				invoicedAt: paidTs,
				status: "paid",
			},
			{
				projectId: nexusOnboardingId,
				date: "2025-12-08",
				minutes: 420,
				hourlyRate: 107,
				description: "Wireframes nouveau parcours",
				billable: true,
				invoicedAt: paidTs,
				status: "paid",
			},
			{
				projectId: nexusOnboardingId,
				date: "2025-12-15",
				minutes: 420,
				hourlyRate: 107,
				description: "Implémentation étapes 1-3",
				billable: true,
				invoicedAt: paidTs,
				status: "paid",
			},
			{
				projectId: nexusOnboardingId,
				date: "2026-01-05",
				minutes: 420,
				hourlyRate: 107,
				description: "Tests A/B + analytics",
				billable: true,
				invoicedAt: paidTs,
				status: "paid",
			},
			{
				projectId: nexusOnboardingId,
				date: "2026-01-06",
				minutes: 300,
				hourlyRate: 107,
				description: "Mise en prod + monitoring",
				billable: true,
				invoicedAt: paidTs,
				status: "paid",
			},
		]

		// Orbital Finance — Risk Dashboard (fermé, payé)
		const orbitalRiskEntries: EntryArgs[] = [
			{
				projectId: orbitalRiskId,
				date: "2025-08-04",
				minutes: 420,
				hourlyRate: 121,
				description: "Analyse besoins + architecture",
				billable: true,
				invoicedAt: paidTs,
				status: "paid",
			},
			{
				projectId: orbitalRiskId,
				date: "2025-08-11",
				minutes: 420,
				hourlyRate: 121,
				description: "Setup infra + WebSockets",
				billable: true,
				invoicedAt: paidTs,
				status: "paid",
			},
			{
				projectId: orbitalRiskId,
				date: "2025-08-18",
				minutes: 420,
				hourlyRate: 121,
				description: "Dashboard positions temps réel",
				billable: true,
				invoicedAt: paidTs,
				status: "paid",
			},
			{
				projectId: orbitalRiskId,
				date: "2025-09-01",
				minutes: 420,
				hourlyRate: 121,
				description: "Module VaR + stress tests",
				billable: true,
				invoicedAt: paidTs,
				status: "paid",
			},
			{
				projectId: orbitalRiskId,
				date: "2025-09-08",
				minutes: 420,
				hourlyRate: 121,
				description: "Alertes seuils réglementaires",
				billable: true,
				invoicedAt: paidTs,
				status: "paid",
			},
			{
				projectId: orbitalRiskId,
				date: "2025-09-15",
				minutes: 420,
				hourlyRate: 121,
				description: "Rapports PDF + export régulateur",
				billable: true,
				invoicedAt: paidTs,
				status: "paid",
			},
			{
				projectId: orbitalRiskId,
				date: "2025-10-06",
				minutes: 420,
				hourlyRate: 121,
				description: "Auth SSO + audit logs",
				billable: true,
				invoicedAt: paidTs,
				status: "paid",
			},
			{
				projectId: orbitalRiskId,
				date: "2025-10-20",
				minutes: 420,
				hourlyRate: 121,
				description: "Tests de charge + UAT",
				billable: true,
				invoicedAt: paidTs,
				status: "paid",
			},
			{
				projectId: orbitalRiskId,
				date: "2025-11-03",
				minutes: 420,
				hourlyRate: 121,
				description: "Corrections retours UAT",
				billable: true,
				invoicedAt: paidTs,
				status: "paid",
			},
			{
				projectId: orbitalRiskId,
				date: "2025-11-24",
				minutes: 300,
				hourlyRate: 121,
				description: "Livraison prod + documentation",
				billable: true,
				invoicedAt: paidTs,
				status: "paid",
			},
		]

		// Orbital Finance — App Mobile Trader
		// fév : ready_to_invoice
		// mars : draft
		const orbitalMobileEntries: EntryArgs[] = [
			{
				projectId: orbitalMobileId,
				date: "2026-02-03",
				minutes: 420,
				hourlyRate: 114,
				description: "Setup React Native + navigation",
				billable: true,
				status: "ready_to_invoice",
			},
			{
				projectId: orbitalMobileId,
				date: "2026-02-04",
				minutes: 420,
				hourlyRate: 114,
				description: "Écran portefeuille + sparklines",
				billable: true,
				status: "ready_to_invoice",
			},
			{
				projectId: orbitalMobileId,
				date: "2026-02-10",
				minutes: 420,
				hourlyRate: 114,
				description: "Flux données temps réel",
				billable: true,
				status: "ready_to_invoice",
			},
			{
				projectId: orbitalMobileId,
				date: "2026-02-11",
				minutes: 420,
				hourlyRate: 114,
				description: "Push alerts cours + volumes",
				billable: true,
				status: "ready_to_invoice",
			},
			{
				projectId: orbitalMobileId,
				date: "2026-02-17",
				minutes: 420,
				hourlyRate: 114,
				description: "Historique ordres + filtres",
				billable: true,
				status: "ready_to_invoice",
			},
			{
				projectId: orbitalMobileId,
				date: "2026-02-24",
				minutes: 420,
				hourlyRate: 114,
				description: "Biometric auth + sécurité",
				billable: true,
				status: "draft",
			},
			{
				projectId: orbitalMobileId,
				date: "2026-02-25",
				minutes: 120,
				hourlyRate: 114,
				description: "Revue code Sophie + ajustements",
				billable: false,
			},
			{
				projectId: orbitalMobileId,
				date: "2026-03-02",
				minutes: 420,
				hourlyRate: 114,
				description: "Dark mode + thème trading",
				billable: true,
				status: "draft",
			},
		]

		const allEntries = [
			...acmeDashEntries,
			...acmeMarsEntries,
			...acmeMobileEntries,
			...veridianEntries,
			...atlasEntries,
			...nexusEntries,
			...orbitalRiskEntries,
			...orbitalMobileEntries,
		]

		for (const entry of allEntries) {
			await insert(entry)
		}

		// ── Todos ─────────────────────────────────────────────────────────────────
		const todos = [
			// Triage — captures récentes, pas encore traitées
			{
				text: "Répondre à Thomas (Nexus) sur le planning mars",
				status: "triage" as const,
				source: "telegram" as const,
				projectId: nexusPlatformId,
			},
			{
				text: "Regarder la PR de Léa sur le repo Veridian API",
				status: "triage" as const,
				source: "telegram" as const,
				projectId: veridianApiId,
			},
			{
				text: "Préparer facture Veridian Q1",
				status: "triage" as const,
				source: "telegram" as const,
			},
			{
				text: "Acheter adaptateur USB-C pour réunion client vendredi",
				status: "triage" as const,
				source: "app" as const,
			},

			// Todo — triés, à faire
			{
				text: "Setup CI/CD pipeline pour Orbital Mobile (GitHub Actions)",
				status: "todo" as const,
				source: "app" as const,
				projectId: orbitalMobileId,
			},
			{
				text: "Lire doc tRPC v11 — nouvelles features",
				status: "todo" as const,
				source: "app" as const,
			},
			{
				text: "Mettre à jour portfolio avec les projets Nexus + Orbital",
				status: "todo" as const,
				source: "app" as const,
			},
			{
				text: "Renouveler abonnement Figma (expire fin mars)",
				status: "todo" as const,
				source: "app" as const,
			},

			// In Progress — en cours
			{
				text: "Implémenter dark mode — Orbital Trader app",
				status: "in_progress" as const,
				source: "app" as const,
				projectId: orbitalMobileId,
			},
			{
				text: "Rédiger compte-rendu réunion Nexus Labs du 28 fév",
				status: "in_progress" as const,
				source: "app" as const,
				projectId: nexusPlatformId,
			},

			// Done — terminés
			{
				text: "Livrer prototype phase 1 Atlas E-commerce",
				status: "done" as const,
				source: "app" as const,
				projectId: atlasId2,
			},
			{
				text: "Envoyer facture Acme janvier",
				status: "done" as const,
				source: "app" as const,
			},
			{
				text: "Call onboarding Sophie Mercier (Orbital Finance)",
				status: "done" as const,
				source: "telegram" as const,
				projectId: orbitalMobileId,
			},
		]

		for (const todo of todos) {
			await ctx.db.insert("todos", { ...todo, createdAt: now })
		}

		return {
			clients: 5,
			projects: 9,
			timeEntries: allEntries.length,
			todos: todos.length,
		}
	},
})
