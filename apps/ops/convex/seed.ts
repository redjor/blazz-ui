import { mutation } from "./_generated/server"
import type { Id } from "./_generated/dataModel"

/**
 * Seed mutation — dev only.
 * Run via: npx convex run seed:run
 */
export const run = mutation({
  args: {},
  handler: async (ctx) => {
    // Wipe existing data
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

    // ── Time Entries ──────────────────────────────────────────────────────────
    // Helper : crée une entrée
    type EntryArgs = {
      projectId: Id<"projects">
      date: string
      minutes: number
      hourlyRate: number
      description?: string
      billable: boolean
      invoicedAt?: number
    }

    const insert = (e: EntryArgs) =>
      ctx.db.insert("timeEntries", { ...e, createdAt: now })

    // Acme — Dashboard Analytics (janvier + février, facturé en partie)
    const invoicedTs = now - 15 * 86400_000
    const acmeDashEntries: EntryArgs[] = [
      { projectId: acmeDashboardId, date: "2026-01-06", minutes: 420, hourlyRate: 100, description: "Setup projet, architecture Next.js", billable: true, invoicedAt: invoicedTs },
      { projectId: acmeDashboardId, date: "2026-01-07", minutes: 420, hourlyRate: 100, description: "Composants DataGrid + filtres", billable: true, invoicedAt: invoicedTs },
      { projectId: acmeDashboardId, date: "2026-01-08", minutes: 210, hourlyRate: 100, description: "Intégration Recharts", billable: true, invoicedAt: invoicedTs },
      { projectId: acmeDashboardId, date: "2026-01-09", minutes: 420, hourlyRate: 100, description: "Auth + middleware", billable: true, invoicedAt: invoicedTs },
      { projectId: acmeDashboardId, date: "2026-01-13", minutes: 420, hourlyRate: 100, description: "Dark mode + tokens CSS", billable: true, invoicedAt: invoicedTs },
      { projectId: acmeDashboardId, date: "2026-01-14", minutes: 420, hourlyRate: 100, description: "Page KPIs + exports CSV", billable: true, invoicedAt: invoicedTs },
      { projectId: acmeDashboardId, date: "2026-01-15", minutes: 300, hourlyRate: 100, description: "Tests unitaires composants", billable: true, invoicedAt: invoicedTs },
      { projectId: acmeDashboardId, date: "2026-01-16", minutes: 60, hourlyRate: 100, description: "Réunion weekly client", billable: false },
      { projectId: acmeDashboardId, date: "2026-01-20", minutes: 420, hourlyRate: 100, description: "Dashboard admin + RBAC", billable: true },
      { projectId: acmeDashboardId, date: "2026-01-21", minutes: 420, hourlyRate: 100, description: "Notifications temps réel", billable: true },
      { projectId: acmeDashboardId, date: "2026-01-22", minutes: 420, hourlyRate: 100, description: "Optimisations perf + bundle", billable: true },
      { projectId: acmeDashboardId, date: "2026-02-03", minutes: 420, hourlyRate: 100, description: "Revue de code + refacto", billable: true },
      { projectId: acmeDashboardId, date: "2026-02-04", minutes: 420, hourlyRate: 100, description: "Page reporting avancé", billable: true },
      { projectId: acmeDashboardId, date: "2026-02-05", minutes: 300, hourlyRate: 100, description: "Corrections retours client", billable: true },
      { projectId: acmeDashboardId, date: "2026-02-10", minutes: 420, hourlyRate: 100, description: "Intégration API REST externe", billable: true },
      { projectId: acmeDashboardId, date: "2026-02-11", minutes: 420, hourlyRate: 100, description: "Tests E2E Playwright", billable: true },
      { projectId: acmeDashboardId, date: "2026-02-17", minutes: 420, hourlyRate: 100, description: "Prépa démo + documentation", billable: true },
      { projectId: acmeDashboardId, date: "2026-02-18", minutes: 120, hourlyRate: 100, description: "Démo client", billable: false },
      { projectId: acmeDashboardId, date: "2026-02-24", minutes: 420, hourlyRate: 100, description: "Bug fixes post-démo", billable: true },
      { projectId: acmeDashboardId, date: "2026-02-25", minutes: 420, hourlyRate: 100, description: "Feature drilldown par région", billable: true },
    ]

    // Veridian — API Gateway
    const veridianEntries: EntryArgs[] = [
      { projectId: veridianApiId, date: "2026-01-20", minutes: 420, hourlyRate: 107, description: "Audit code existant + plan migration", billable: true },
      { projectId: veridianApiId, date: "2026-01-21", minutes: 420, hourlyRate: 107, description: "Setup tRPC router + Zod schemas", billable: true },
      { projectId: veridianApiId, date: "2026-01-22", minutes: 420, hourlyRate: 107, description: "Migration endpoints auth", billable: true },
      { projectId: veridianApiId, date: "2026-01-27", minutes: 420, hourlyRate: 107, description: "Middleware rate limiting", billable: true },
      { projectId: veridianApiId, date: "2026-01-28", minutes: 300, hourlyRate: 107, description: "Tests + CI pipeline", billable: true },
      { projectId: veridianApiId, date: "2026-02-03", minutes: 420, hourlyRate: 107, description: "Migration endpoints users/billing", billable: true },
      { projectId: veridianApiId, date: "2026-02-04", minutes: 420, hourlyRate: 107, description: "WebSockets + subscriptions tRPC", billable: true },
      { projectId: veridianApiId, date: "2026-02-10", minutes: 420, hourlyRate: 107, description: "Couverture tests 80% atteinte", billable: true },
      { projectId: veridianApiId, date: "2026-02-11", minutes: 210, hourlyRate: 107, description: "Doc Swagger auto-générée", billable: true },
      { projectId: veridianApiId, date: "2026-02-17", minutes: 420, hourlyRate: 107, description: "Déploiement staging + smoke tests", billable: true },
      { projectId: veridianApiId, date: "2026-02-24", minutes: 420, hourlyRate: 107, description: "Hotfixes + monitoring Sentry", billable: true },
    ]

    // Atlas — Site vitrine
    const atlasEntries: EntryArgs[] = [
      { projectId: atlasId2, date: "2026-02-10", minutes: 420, hourlyRate: 86, description: "Kickoff + setup projet Stripe", billable: true },
      { projectId: atlasId2, date: "2026-02-11", minutes: 420, hourlyRate: 86, description: "Maquettes → composants Next.js", billable: true },
      { projectId: atlasId2, date: "2026-02-12", minutes: 300, hourlyRate: 86, description: "Catalogue produits + filtres", billable: true },
      { projectId: atlasId2, date: "2026-02-17", minutes: 420, hourlyRate: 86, description: "Panier + tunnel Stripe", billable: true },
      { projectId: atlasId2, date: "2026-02-18", minutes: 420, hourlyRate: 86, description: "Emails transactionnels Resend", billable: true },
      { projectId: atlasId2, date: "2026-02-24", minutes: 420, hourlyRate: 86, description: "SEO + sitemap + OG tags", billable: true },
      { projectId: atlasId2, date: "2026-02-25", minutes: 210, hourlyRate: 86, description: "Corrections maquettes mobiles", billable: true },
    ]

    // Acme — Mobile RH (quelques entrées old, fermées)
    const acmeMobileEntries: EntryArgs[] = [
      { projectId: acmeMobileId, date: "2025-11-03", minutes: 420, hourlyRate: 93, description: "Setup Expo + navigation", billable: true, invoicedAt: now - 60 * 86400_000 },
      { projectId: acmeMobileId, date: "2025-11-04", minutes: 420, hourlyRate: 93, description: "Écrans congés + formulaires", billable: true, invoicedAt: now - 60 * 86400_000 },
      { projectId: acmeMobileId, date: "2025-11-10", minutes: 420, hourlyRate: 93, description: "Intégration API RH", billable: true, invoicedAt: now - 60 * 86400_000 },
      { projectId: acmeMobileId, date: "2025-11-17", minutes: 420, hourlyRate: 93, description: "Push notifications", billable: true, invoicedAt: now - 60 * 86400_000 },
      { projectId: acmeMobileId, date: "2025-12-01", minutes: 420, hourlyRate: 93, description: "Tests devices + corrections", billable: true, invoicedAt: now - 60 * 86400_000 },
      { projectId: acmeMobileId, date: "2025-12-15", minutes: 300, hourlyRate: 93, description: "Livraison prototype", billable: true, invoicedAt: now - 60 * 86400_000 },
    ]

    const allEntries = [
      ...acmeDashEntries,
      ...veridianEntries,
      ...atlasEntries,
      ...acmeMobileEntries,
    ]

    for (const entry of allEntries) {
      await insert(entry)
    }

    return {
      clients: 3,
      projects: 5,
      timeEntries: allEntries.length,
    }
  },
})
