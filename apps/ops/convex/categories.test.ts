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

describe("categories auth", () => {
	it("list rejects unauthenticated", async () => {
		const { t } = setup()
		await expect(t.query(api.categories.list)).rejects.toThrow("Non authentifié")
	})

	it("create rejects unauthenticated", async () => {
		const { t } = setup()
		await expect(t.mutation(api.categories.create, { name: "Dev" })).rejects.toThrow("Non authentifié")
	})
})

describe("categories CRUD", () => {
	it("creates and lists", async () => {
		const { asUser } = setup()
		await asUser.mutation(api.categories.create, { name: "Dev" })
		await asUser.mutation(api.categories.create, { name: "Design" })
		const categories = await asUser.query(api.categories.list)
		expect(categories).toHaveLength(2)
	})

	it("updates a category", async () => {
		const { asUser } = setup()
		const id = await asUser.mutation(api.categories.create, { name: "Old" })
		await asUser.mutation(api.categories.update, { id, name: "New" })
		const categories = await asUser.query(api.categories.list)
		expect(categories.find((c) => c._id === id)!.name).toBe("New")
	})

	it("update rejects other user's category", async () => {
		const { t } = setup()
		const user1 = t.withIdentity({ subject: "user1", issuer: "https://auth.test" })
		const user2 = t.withIdentity({ subject: "user2", issuer: "https://auth.test" })
		const id = await user1.mutation(api.categories.create, { name: "Mine" })
		await expect(user2.mutation(api.categories.update, { id, name: "Hacked" })).rejects.toThrow("Introuvable")
	})

	it("removes and nullifies linked todos", async () => {
		const { asUser } = setup()
		const catId = await asUser.mutation(api.categories.create, { name: "Bug" })
		const todoId = await asUser.mutation(api.todos.create, {
			text: "Fix crash",
			categoryId: catId,
		})
		await asUser.mutation(api.categories.remove, { id: catId })

		const categories = await asUser.query(api.categories.list)
		expect(categories).toHaveLength(0)

		const todo = await asUser.query(api.todos.get, { id: todoId })
		expect(todo!.categoryId).toBeUndefined()
	})

	it("remove rejects other user's category", async () => {
		const { t } = setup()
		const user1 = t.withIdentity({ subject: "user1", issuer: "https://auth.test" })
		const user2 = t.withIdentity({ subject: "user2", issuer: "https://auth.test" })
		const id = await user1.mutation(api.categories.create, { name: "Mine" })
		await expect(user2.mutation(api.categories.remove, { id })).rejects.toThrow("Introuvable")
	})
})
