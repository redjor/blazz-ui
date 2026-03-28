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

describe("todos auth", () => {
	it("list rejects unauthenticated", async () => {
		const { t } = setup()
		await expect(t.query(api.todos.list, {})).rejects.toThrow("Non authentifié")
	})

	it("create rejects unauthenticated", async () => {
		const { t } = setup()
		await expect(t.mutation(api.todos.create, { text: "Test" })).rejects.toThrow("Non authentifié")
	})
})

describe("todos CRUD", () => {
	it("creates and lists todos", async () => {
		const { asUser } = setup()
		await asUser.mutation(api.todos.create, { text: "Buy milk" })
		await asUser.mutation(api.todos.create, { text: "Write tests" })
		const todos = await asUser.query(api.todos.list, {})
		expect(todos).toHaveLength(2)
	})

	it("defaults to triage status", async () => {
		const { asUser } = setup()
		await asUser.mutation(api.todos.create, { text: "New" })
		const todos = await asUser.query(api.todos.list, {})
		expect(todos[0].status).toBe("triage")
	})

	it("creates with explicit status", async () => {
		const { asUser } = setup()
		await asUser.mutation(api.todos.create, { text: "Urgent", status: "todo" })
		const todos = await asUser.query(api.todos.list, { status: "todo" })
		expect(todos).toHaveLength(1)
		expect(todos[0].text).toBe("Urgent")
	})

	it("gets a todo by id", async () => {
		const { asUser } = setup()
		const id = await asUser.mutation(api.todos.create, { text: "Find me" })
		const todo = await asUser.query(api.todos.get, { id })
		expect(todo!.text).toBe("Find me")
	})

	it("get returns null for other user's todo", async () => {
		const { t } = setup()
		const user1 = t.withIdentity({ subject: "user1", issuer: "https://auth.test" })
		const user2 = t.withIdentity({ subject: "user2", issuer: "https://auth.test" })
		const id = await user1.mutation(api.todos.create, { text: "Private" })
		const result = await user2.query(api.todos.get, { id })
		expect(result).toBeNull()
	})

	it("updates todo text", async () => {
		const { asUser } = setup()
		const id = await asUser.mutation(api.todos.create, { text: "Old" })
		await asUser.mutation(api.todos.update, { id, text: "New" })
		const todo = await asUser.query(api.todos.get, { id })
		expect(todo!.text).toBe("New")
	})

	it("update rejects other user's todo", async () => {
		const { t } = setup()
		const user1 = t.withIdentity({ subject: "user1", issuer: "https://auth.test" })
		const user2 = t.withIdentity({ subject: "user2", issuer: "https://auth.test" })
		const id = await user1.mutation(api.todos.create, { text: "Mine" })
		await expect(user2.mutation(api.todos.update, { id, text: "Hacked" })).rejects.toThrow("Introuvable")
	})

	it("updates status", async () => {
		const { asUser } = setup()
		const id = await asUser.mutation(api.todos.create, { text: "Do it" })
		await asUser.mutation(api.todos.updateStatus, { id, status: "done" })
		const todo = await asUser.query(api.todos.get, { id })
		expect(todo!.status).toBe("done")
	})

	it("removes a todo", async () => {
		const { asUser } = setup()
		const id = await asUser.mutation(api.todos.create, { text: "Trash" })
		await asUser.mutation(api.todos.remove, { id })
		const todos = await asUser.query(api.todos.list, {})
		expect(todos).toHaveLength(0)
	})

	it("remove rejects other user's todo", async () => {
		const { t } = setup()
		const user1 = t.withIdentity({ subject: "user1", issuer: "https://auth.test" })
		const user2 = t.withIdentity({ subject: "user2", issuer: "https://auth.test" })
		const id = await user1.mutation(api.todos.create, { text: "Mine" })
		await expect(user2.mutation(api.todos.remove, { id })).rejects.toThrow("Introuvable")
	})
})

describe("todos filtering", () => {
	it("filters by status", async () => {
		const { asUser } = setup()
		await asUser.mutation(api.todos.create, { text: "A", status: "todo" })
		await asUser.mutation(api.todos.create, { text: "B", status: "done" })
		await asUser.mutation(api.todos.create, { text: "C", status: "todo" })
		const todoOnly = await asUser.query(api.todos.list, { status: "todo" })
		expect(todoOnly).toHaveLength(2)
	})
})

describe("todos isolation", () => {
	it("users only see their own todos", async () => {
		const { t } = setup()
		const user1 = t.withIdentity({ subject: "user1", issuer: "https://auth.test" })
		const user2 = t.withIdentity({ subject: "user2", issuer: "https://auth.test" })
		await user1.mutation(api.todos.create, { text: "User1 todo" })
		await user2.mutation(api.todos.create, { text: "User2 todo" })
		const list1 = await user1.query(api.todos.list, {})
		const list2 = await user2.query(api.todos.list, {})
		expect(list1).toHaveLength(1)
		expect(list1[0].text).toBe("User1 todo")
		expect(list2).toHaveLength(1)
		expect(list2[0].text).toBe("User2 todo")
	})
})

describe("todos tags", () => {
	it("creates with tags and lists all tags", async () => {
		const { asUser } = setup()
		await asUser.mutation(api.todos.create, { text: "A", tags: ["bug", "urgent"] })
		await asUser.mutation(api.todos.create, { text: "B", tags: ["bug", "feature"] })
		const tags = await asUser.query(api.todos.listAllTags)
		expect(tags).toEqual(["bug", "feature", "urgent"])
	})
})
