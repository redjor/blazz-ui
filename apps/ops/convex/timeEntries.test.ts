import { describe, expect, it } from "vitest"
import { convexTest } from "convex-test"
import schema from "./test.schema"
import { api } from "./_generated/api"

const modules = import.meta.glob("./**/*.*s")

function setup() {
	const t = convexTest(schema, modules)
	const asUser = t.withIdentity({ subject: "user1", issuer: "https://auth.test" })
	return { t, asUser }
}

async function createTestProject(asUser: ReturnType<typeof setup>["asUser"]) {
	const clientId = await asUser.mutation(api.clients.create, { name: "Test Client" })
	const projectId = await asUser.mutation(api.projects.create, {
		clientId,
		name: "Test Project",
		tjm: 800,
		hoursPerDay: 8,
		currency: "EUR",
		status: "active",
	})
	return { clientId, projectId }
}

describe("timeEntries auth", () => {
	it("create rejects unauthenticated", async () => {
		const { t, asUser } = setup()
		const { projectId } = await createTestProject(asUser)
		await expect(
			t.mutation(api.timeEntries.create, {
				projectId,
				date: "2026-03-11",
				minutes: 60,
				hourlyRate: 100,
				billable: true,
			})
		).rejects.toThrow("Non authentifié")
	})

	it("remove rejects unauthenticated", async () => {
		const { t, asUser } = setup()
		const { projectId } = await createTestProject(asUser)
		const entryId = await asUser.mutation(api.timeEntries.create, {
			projectId,
			date: "2026-03-11",
			minutes: 60,
			hourlyRate: 100,
			billable: true,
		})
		await expect(
			t.mutation(api.timeEntries.remove, { id: entryId })
		).rejects.toThrow("Non authentifié")
	})

	it("update rejects unauthenticated", async () => {
		const { t, asUser } = setup()
		const { projectId } = await createTestProject(asUser)
		const entryId = await asUser.mutation(api.timeEntries.create, {
			projectId,
			date: "2026-03-11",
			minutes: 60,
			hourlyRate: 100,
			billable: true,
		})
		await expect(
			t.mutation(api.timeEntries.update, {
				id: entryId,
				projectId,
				date: "2026-03-11",
				minutes: 90,
				hourlyRate: 100,
				billable: true,
			})
		).rejects.toThrow("Non authentifié")
	})

	it("setStatus rejects unauthenticated", async () => {
		const { t } = setup()
		await expect(
			t.mutation(api.timeEntries.setStatus, {
				ids: [],
				status: "invoiced",
			})
		).rejects.toThrow("Non authentifié")
	})
})

describe("timeEntries delete guards", () => {
	it("cannot delete an invoiced entry", async () => {
		const { t, asUser } = setup()
		const { projectId } = await createTestProject(asUser)
		const entryId = await asUser.mutation(api.timeEntries.create, {
			projectId,
			date: "2026-03-01",
			minutes: 60,
			hourlyRate: 100,
			billable: true,
			status: "invoiced",
		})
		await expect(
			asUser.mutation(api.timeEntries.remove, { id: entryId })
		).rejects.toThrow("facturée")
	})

	it("cannot delete a paid entry", async () => {
		const { t, asUser } = setup()
		const { projectId } = await createTestProject(asUser)
		const entryId = await asUser.mutation(api.timeEntries.create, {
			projectId,
			date: "2026-03-01",
			minutes: 60,
			hourlyRate: 100,
			billable: true,
			status: "paid",
		})
		await expect(
			asUser.mutation(api.timeEntries.remove, { id: entryId })
		).rejects.toThrow("payée")
	})

	it("can delete a ready_to_invoice entry", async () => {
		const { t, asUser } = setup()
		const { projectId } = await createTestProject(asUser)
		const entryId = await asUser.mutation(api.timeEntries.create, {
			projectId,
			date: "2026-03-01",
			minutes: 60,
			hourlyRate: 100,
			billable: true,
			status: "ready_to_invoice",
		})
		await asUser.mutation(api.timeEntries.remove, { id: entryId })
		await t.run(async (ctx) => {
			const entry = await ctx.db.get(entryId)
			expect(entry).toBeNull()
		})
	})

	it("can delete a draft entry", async () => {
		const { t, asUser } = setup()
		const { projectId } = await createTestProject(asUser)
		const entryId = await asUser.mutation(api.timeEntries.create, {
			projectId,
			date: "2026-03-01",
			minutes: 60,
			hourlyRate: 100,
			billable: true,
			status: "draft",
		})
		await asUser.mutation(api.timeEntries.remove, { id: entryId })
		await t.run(async (ctx) => {
			const entry = await ctx.db.get(entryId)
			expect(entry).toBeNull()
		})
	})
})

describe("timeEntries update guards", () => {
	it("cannot update an invoiced entry", async () => {
		const { t, asUser } = setup()
		const { projectId } = await createTestProject(asUser)
		const entryId = await asUser.mutation(api.timeEntries.create, {
			projectId,
			date: "2026-03-01",
			minutes: 60,
			hourlyRate: 100,
			billable: true,
			status: "invoiced",
		})
		await expect(
			asUser.mutation(api.timeEntries.update, {
				id: entryId,
				projectId,
				date: "2026-03-01",
				minutes: 90,
				hourlyRate: 100,
				billable: true,
			})
		).rejects.toThrow("facturée")
	})

	it("cannot update a paid entry", async () => {
		const { t, asUser } = setup()
		const { projectId } = await createTestProject(asUser)
		const entryId = await asUser.mutation(api.timeEntries.create, {
			projectId,
			date: "2026-03-01",
			minutes: 60,
			hourlyRate: 100,
			billable: true,
			status: "paid",
		})
		await expect(
			asUser.mutation(api.timeEntries.update, {
				id: entryId,
				projectId,
				date: "2026-03-01",
				minutes: 90,
				hourlyRate: 100,
				billable: true,
			})
		).rejects.toThrow("payée")
	})

	it("can update a draft entry", async () => {
		const { t, asUser } = setup()
		const { projectId } = await createTestProject(asUser)
		const entryId = await asUser.mutation(api.timeEntries.create, {
			projectId,
			date: "2026-03-01",
			minutes: 60,
			hourlyRate: 100,
			billable: true,
			status: "draft",
		})
		await asUser.mutation(api.timeEntries.update, {
			id: entryId,
			projectId,
			date: "2026-03-01",
			minutes: 90,
			hourlyRate: 100,
			billable: true,
		})
		await t.run(async (ctx) => {
			const entry = await ctx.db.get(entryId)
			expect(entry?.minutes).toBe(90)
		})
	})
})

describe("timeEntries status transitions", () => {
	it("draft → ready_to_invoice is valid", async () => {
		const { t, asUser } = setup()
		const { projectId } = await createTestProject(asUser)
		const entryId = await asUser.mutation(api.timeEntries.create, {
			projectId,
			date: "2026-03-01",
			minutes: 60,
			hourlyRate: 100,
			billable: true,
			status: "draft",
		})
		await asUser.mutation(api.timeEntries.setStatus, {
			ids: [entryId],
			status: "ready_to_invoice",
		})
		await t.run(async (ctx) => {
			const entry = await ctx.db.get(entryId)
			expect(entry?.status).toBe("ready_to_invoice")
		})
	})

	it("draft → paid is invalid", async () => {
		const { t, asUser } = setup()
		const { projectId } = await createTestProject(asUser)
		const entryId = await asUser.mutation(api.timeEntries.create, {
			projectId,
			date: "2026-03-01",
			minutes: 60,
			hourlyRate: 100,
			billable: true,
			status: "draft",
		})
		await expect(
			asUser.mutation(api.timeEntries.setStatus, {
				ids: [entryId],
				status: "paid",
			})
		).rejects.toThrow("Transition invalide")
	})

	it("draft → invoiced is invalid", async () => {
		const { t, asUser } = setup()
		const { projectId } = await createTestProject(asUser)
		const entryId = await asUser.mutation(api.timeEntries.create, {
			projectId,
			date: "2026-03-01",
			minutes: 60,
			hourlyRate: 100,
			billable: true,
			status: "draft",
		})
		await expect(
			asUser.mutation(api.timeEntries.setStatus, {
				ids: [entryId],
				status: "invoiced",
			})
		).rejects.toThrow("Transition invalide")
	})

	it("paid → any status is invalid (terminal)", async () => {
		const { t, asUser } = setup()
		const { projectId } = await createTestProject(asUser)
		const entryId = await asUser.mutation(api.timeEntries.create, {
			projectId,
			date: "2026-03-01",
			minutes: 60,
			hourlyRate: 100,
			billable: true,
			status: "paid",
		})
		await expect(
			asUser.mutation(api.timeEntries.setStatus, {
				ids: [entryId],
				status: "draft",
			})
		).rejects.toThrow("Transition invalide")
		await expect(
			asUser.mutation(api.timeEntries.setStatus, {
				ids: [entryId],
				status: "ready_to_invoice",
			})
		).rejects.toThrow("Transition invalide")
		await expect(
			asUser.mutation(api.timeEntries.setStatus, {
				ids: [entryId],
				status: "invoiced",
			})
		).rejects.toThrow("Transition invalide")
	})

	it("invoiced → ready_to_invoice is valid (revert)", async () => {
		const { t, asUser } = setup()
		const { projectId } = await createTestProject(asUser)
		const entryId = await asUser.mutation(api.timeEntries.create, {
			projectId,
			date: "2026-03-01",
			minutes: 60,
			hourlyRate: 100,
			billable: true,
			status: "invoiced",
		})
		await asUser.mutation(api.timeEntries.setStatus, {
			ids: [entryId],
			status: "ready_to_invoice",
		})
		await t.run(async (ctx) => {
			const entry = await ctx.db.get(entryId)
			expect(entry?.status).toBe("ready_to_invoice")
			expect(entry?.invoicedAt).toBeUndefined()
		})
	})

	it("invoiced → paid is valid", async () => {
		const { t, asUser } = setup()
		const { projectId } = await createTestProject(asUser)
		const entryId = await asUser.mutation(api.timeEntries.create, {
			projectId,
			date: "2026-03-01",
			minutes: 60,
			hourlyRate: 100,
			billable: true,
			status: "invoiced",
		})
		await asUser.mutation(api.timeEntries.setStatus, {
			ids: [entryId],
			status: "paid",
		})
		await t.run(async (ctx) => {
			const entry = await ctx.db.get(entryId)
			expect(entry?.status).toBe("paid")
		})
	})
})

describe("timeEntries CRUD", () => {
	it("creates an entry with correct fields", async () => {
		const { t, asUser } = setup()
		const { projectId } = await createTestProject(asUser)
		const entryId = await asUser.mutation(api.timeEntries.create, {
			projectId,
			date: "2026-03-11",
			minutes: 90,
			hourlyRate: 100,
			description: "Feature work",
			billable: true,
			status: "draft",
		})
		await t.run(async (ctx) => {
			const entry = await ctx.db.get(entryId)
			expect(entry).not.toBeNull()
			expect(entry?.minutes).toBe(90)
			expect(entry?.hourlyRate).toBe(100)
			expect(entry?.description).toBe("Feature work")
			expect(entry?.billable).toBe(true)
			expect(entry?.status).toBe("draft")
			expect(entry?.createdAt).toBeGreaterThan(0)
		})
	})

	it("defaults status to undefined when not provided", async () => {
		const { t, asUser } = setup()
		const { projectId } = await createTestProject(asUser)
		const entryId = await asUser.mutation(api.timeEntries.create, {
			projectId,
			date: "2026-03-11",
			minutes: 60,
			hourlyRate: 100,
			billable: true,
		})
		await t.run(async (ctx) => {
			const entry = await ctx.db.get(entryId)
			expect(entry?.status).toBeUndefined()
		})
	})

	it("lists entries filtered by project", async () => {
		const { t, asUser } = setup()
		const { projectId } = await createTestProject(asUser)
		await asUser.mutation(api.timeEntries.create, {
			projectId,
			date: "2026-03-11",
			minutes: 60,
			hourlyRate: 100,
			billable: true,
		})
		const entries = await asUser.query(api.timeEntries.list, { projectId })
		expect(entries).toHaveLength(1)
		expect(entries[0].projectId).toBe(projectId)
	})
})
