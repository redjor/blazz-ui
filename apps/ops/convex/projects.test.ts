import { convexTest } from "convex-test"
import { describe, expect, it } from "vitest"
import { api } from "./_generated/api"
import schema from "./test.schema"

const modules = import.meta.glob("./**/*.*s")

function setup() {
	const t = convexTest(schema, modules)
	const asUser = t.withIdentity({ subject: "user1", issuer: "https://auth.test" })
	return { t, asUser }
}

async function createClient(asUser: ReturnType<typeof setup>["asUser"]) {
	return asUser.mutation(api.clients.create, { name: "Test Client" })
}

describe("projects auth", () => {
	it("listAll rejects unauthenticated", async () => {
		const { t } = setup()
		await expect(t.query(api.projects.listAll)).rejects.toThrow("Non authentifié")
	})

	it("create rejects unauthenticated", async () => {
		const { t, asUser } = setup()
		const clientId = await createClient(asUser)
		await expect(
			t.mutation(api.projects.create, {
				clientId,
				name: "P",
				tjm: 800,
				hoursPerDay: 8,
				currency: "EUR",
				status: "active",
			})
		).rejects.toThrow("Non authentifié")
	})
})

describe("projects CRUD", () => {
	it("creates and lists a project", async () => {
		const { asUser } = setup()
		const clientId = await createClient(asUser)
		await asUser.mutation(api.projects.create, {
			clientId,
			name: "Website",
			tjm: 800,
			hoursPerDay: 8,
			currency: "EUR",
			status: "active",
		})
		const projects = await asUser.query(api.projects.listAll)
		expect(projects).toHaveLength(1)
		expect(projects[0].name).toBe("Website")
	})

	it("gets a project by id", async () => {
		const { asUser } = setup()
		const clientId = await createClient(asUser)
		const id = await asUser.mutation(api.projects.create, {
			clientId,
			name: "API",
			tjm: 700,
			hoursPerDay: 7,
			currency: "EUR",
			status: "active",
		})
		const project = await asUser.query(api.projects.get, { id })
		expect(project!.name).toBe("API")
		expect(project!.tjm).toBe(700)
	})

	it("get returns null for other user's project", async () => {
		const { t } = setup()
		const user1 = t.withIdentity({ subject: "user1", issuer: "https://auth.test" })
		const user2 = t.withIdentity({ subject: "user2", issuer: "https://auth.test" })
		const clientId = await createClient(user1)
		const id = await user1.mutation(api.projects.create, {
			clientId,
			name: "Secret",
			tjm: 800,
			hoursPerDay: 8,
			currency: "EUR",
			status: "active",
		})
		const result = await user2.query(api.projects.get, { id })
		expect(result).toBeNull()
	})

	it("updates a project", async () => {
		const { asUser } = setup()
		const clientId = await createClient(asUser)
		const id = await asUser.mutation(api.projects.create, {
			clientId,
			name: "Old",
			tjm: 800,
			hoursPerDay: 8,
			currency: "EUR",
			status: "active",
		})
		await asUser.mutation(api.projects.update, {
			id,
			name: "New",
			tjm: 900,
			hoursPerDay: 7,
			currency: "EUR",
			status: "paused",
		})
		const project = await asUser.query(api.projects.get, { id })
		expect(project!.name).toBe("New")
		expect(project!.tjm).toBe(900)
		expect(project!.status).toBe("paused")
	})

	it("update rejects other user's project", async () => {
		const { t } = setup()
		const user1 = t.withIdentity({ subject: "user1", issuer: "https://auth.test" })
		const user2 = t.withIdentity({ subject: "user2", issuer: "https://auth.test" })
		const clientId = await createClient(user1)
		const id = await user1.mutation(api.projects.create, {
			clientId,
			name: "Mine",
			tjm: 800,
			hoursPerDay: 8,
			currency: "EUR",
			status: "active",
		})
		await expect(
			user2.mutation(api.projects.update, {
				id,
				name: "Hacked",
				tjm: 1,
				hoursPerDay: 1,
				currency: "EUR",
				status: "active",
			})
		).rejects.toThrow("Introuvable")
	})

	it("create rejects if client belongs to another user", async () => {
		const { t } = setup()
		const user1 = t.withIdentity({ subject: "user1", issuer: "https://auth.test" })
		const user2 = t.withIdentity({ subject: "user2", issuer: "https://auth.test" })
		const clientId = await createClient(user1)
		await expect(
			user2.mutation(api.projects.create, {
				clientId,
				name: "Sneaky",
				tjm: 800,
				hoursPerDay: 8,
				currency: "EUR",
				status: "active",
			})
		).rejects.toThrow("Introuvable")
	})
})

describe("projects listByClient", () => {
	it("returns projects for a specific client", async () => {
		const { asUser } = setup()
		const c1 = await asUser.mutation(api.clients.create, { name: "Client A" })
		const c2 = await asUser.mutation(api.clients.create, { name: "Client B" })
		await asUser.mutation(api.projects.create, {
			clientId: c1,
			name: "P1",
			tjm: 800,
			hoursPerDay: 8,
			currency: "EUR",
			status: "active",
		})
		await asUser.mutation(api.projects.create, {
			clientId: c2,
			name: "P2",
			tjm: 800,
			hoursPerDay: 8,
			currency: "EUR",
			status: "active",
		})
		const projects = await asUser.query(api.projects.listByClient, { clientId: c1 })
		expect(projects).toHaveLength(1)
		expect(projects[0].name).toBe("P1")
	})
})

describe("projects listActive", () => {
	it("only returns active projects", async () => {
		const { asUser } = setup()
		const clientId = await createClient(asUser)
		await asUser.mutation(api.projects.create, {
			clientId,
			name: "Active",
			tjm: 800,
			hoursPerDay: 8,
			currency: "EUR",
			status: "active",
		})
		await asUser.mutation(api.projects.create, {
			clientId,
			name: "Paused",
			tjm: 800,
			hoursPerDay: 8,
			currency: "EUR",
			status: "paused",
		})
		const active = await asUser.query(api.projects.listActive)
		expect(active).toHaveLength(1)
		expect(active[0].name).toBe("Active")
	})
})
