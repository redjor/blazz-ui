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

describe("clients auth", () => {
	it("list rejects unauthenticated", async () => {
		const { t } = setup()
		await expect(t.query(api.clients.list)).rejects.toThrow("Non authentifié")
	})

	it("create rejects unauthenticated", async () => {
		const { t } = setup()
		await expect(t.mutation(api.clients.create, { name: "Test" })).rejects.toThrow("Non authentifié")
	})
})

describe("clients CRUD", () => {
	it("creates and lists a client", async () => {
		const { asUser } = setup()
		await asUser.mutation(api.clients.create, { name: "Acme Corp" })
		const clients = await asUser.query(api.clients.list)
		expect(clients).toHaveLength(1)
		expect(clients[0].name).toBe("Acme Corp")
	})

	it("gets a client by id", async () => {
		const { asUser } = setup()
		const id = await asUser.mutation(api.clients.create, { name: "Acme" })
		const client = await asUser.query(api.clients.get, { id })
		expect(client).not.toBeNull()
		expect(client!.name).toBe("Acme")
	})

	it("get returns null for other user's client", async () => {
		const { t } = setup()
		const user1 = t.withIdentity({ subject: "user1", issuer: "https://auth.test" })
		const user2 = t.withIdentity({ subject: "user2", issuer: "https://auth.test" })
		const id = await user1.mutation(api.clients.create, { name: "Private" })
		const result = await user2.query(api.clients.get, { id })
		expect(result).toBeNull()
	})

	it("updates a client", async () => {
		const { asUser } = setup()
		const id = await asUser.mutation(api.clients.create, { name: "Old Name" })
		await asUser.mutation(api.clients.update, { id, name: "New Name" })
		const client = await asUser.query(api.clients.get, { id })
		expect(client!.name).toBe("New Name")
	})

	it("update rejects other user's client", async () => {
		const { t } = setup()
		const user1 = t.withIdentity({ subject: "user1", issuer: "https://auth.test" })
		const user2 = t.withIdentity({ subject: "user2", issuer: "https://auth.test" })
		const id = await user1.mutation(api.clients.create, { name: "Private" })
		await expect(user2.mutation(api.clients.update, { id, name: "Hacked" })).rejects.toThrow("Introuvable")
	})

	it("removes a client", async () => {
		const { asUser } = setup()
		const id = await asUser.mutation(api.clients.create, { name: "ToDelete" })
		await asUser.mutation(api.clients.remove, { id })
		const clients = await asUser.query(api.clients.list)
		expect(clients).toHaveLength(0)
	})

	it("remove rejects other user's client", async () => {
		const { t } = setup()
		const user1 = t.withIdentity({ subject: "user1", issuer: "https://auth.test" })
		const user2 = t.withIdentity({ subject: "user2", issuer: "https://auth.test" })
		const id = await user1.mutation(api.clients.create, { name: "Private" })
		await expect(user2.mutation(api.clients.remove, { id })).rejects.toThrow("Introuvable")
	})
})

describe("clients isolation", () => {
	it("users only see their own clients", async () => {
		const { t } = setup()
		const user1 = t.withIdentity({ subject: "user1", issuer: "https://auth.test" })
		const user2 = t.withIdentity({ subject: "user2", issuer: "https://auth.test" })
		await user1.mutation(api.clients.create, { name: "User1 Client" })
		await user2.mutation(api.clients.create, { name: "User2 Client" })
		const list1 = await user1.query(api.clients.list)
		const list2 = await user2.query(api.clients.list)
		expect(list1).toHaveLength(1)
		expect(list1[0].name).toBe("User1 Client")
		expect(list2).toHaveLength(1)
		expect(list2[0].name).toBe("User2 Client")
	})
})
