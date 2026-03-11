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
