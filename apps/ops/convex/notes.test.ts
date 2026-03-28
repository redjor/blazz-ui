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

describe("notes auth", () => {
	it("listRecent rejects unauthenticated", async () => {
		const { t } = setup()
		await expect(t.query(api.notes.listRecent)).rejects.toThrow("Non authentifié")
	})

	it("create rejects unauthenticated", async () => {
		const { t } = setup()
		await expect(t.mutation(api.notes.create, { entityType: "general" })).rejects.toThrow("Non authentifié")
	})
})

describe("notes CRUD", () => {
	it("creates and lists notes", async () => {
		const { asUser } = setup()
		await asUser.mutation(api.notes.create, {
			entityType: "general",
			title: "Meeting notes",
		})
		const notes = await asUser.query(api.notes.listRecent)
		expect(notes).toHaveLength(1)
		expect(notes[0].title).toBe("Meeting notes")
	})

	it("defaults title to 'Nouvelle note' when empty", async () => {
		const { asUser } = setup()
		await asUser.mutation(api.notes.create, { entityType: "general" })
		const notes = await asUser.query(api.notes.listRecent)
		expect(notes[0].title).toBe("Nouvelle note")
	})

	it("updates a note", async () => {
		const { asUser } = setup()
		const id = await asUser.mutation(api.notes.create, {
			entityType: "general",
			title: "Draft",
		})
		await asUser.mutation(api.notes.update, { id, title: "Final" })
		const notes = await asUser.query(api.notes.listRecent)
		expect(notes[0].title).toBe("Final")
	})

	it("update rejects other user's note", async () => {
		const { t } = setup()
		const user1 = t.withIdentity({ subject: "user1", issuer: "https://auth.test" })
		const user2 = t.withIdentity({ subject: "user2", issuer: "https://auth.test" })
		const id = await user1.mutation(api.notes.create, {
			entityType: "general",
			title: "Private",
		})
		await expect(user2.mutation(api.notes.update, { id, title: "Hacked" })).rejects.toThrow("Introuvable")
	})

	it("removes a note", async () => {
		const { asUser } = setup()
		const id = await asUser.mutation(api.notes.create, {
			entityType: "general",
			title: "Delete me",
		})
		await asUser.mutation(api.notes.remove, { id })
		const notes = await asUser.query(api.notes.listRecent)
		expect(notes).toHaveLength(0)
	})

	it("remove rejects other user's note", async () => {
		const { t } = setup()
		const user1 = t.withIdentity({ subject: "user1", issuer: "https://auth.test" })
		const user2 = t.withIdentity({ subject: "user2", issuer: "https://auth.test" })
		const id = await user1.mutation(api.notes.create, {
			entityType: "general",
			title: "Mine",
		})
		await expect(user2.mutation(api.notes.remove, { id })).rejects.toThrow("Introuvable")
	})
})

describe("notes by entity", () => {
	it("lists notes filtered by entity", async () => {
		const { asUser } = setup()
		await asUser.mutation(api.notes.create, {
			entityType: "client",
			entityId: "client_1",
			title: "Client note",
		})
		await asUser.mutation(api.notes.create, {
			entityType: "general",
			title: "General note",
		})
		const clientNotes = await asUser.query(api.notes.listByEntity, {
			entityType: "client",
			entityId: "client_1",
		})
		expect(clientNotes).toHaveLength(1)
		expect(clientNotes[0].title).toBe("Client note")
	})
})

describe("notes pinning", () => {
	it("pinned notes appear first", async () => {
		const { asUser } = setup()
		await asUser.mutation(api.notes.create, {
			entityType: "general",
			title: "Unpinned",
		})
		const _pinnedId = await asUser.mutation(api.notes.create, {
			entityType: "general",
			title: "Pinned",
			pinned: true,
		})
		const notes = await asUser.query(api.notes.listRecent)
		expect(notes[0].title).toBe("Pinned")
	})
})
