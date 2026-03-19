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

describe("bookmarkCollections auth", () => {
	it("list rejects unauthenticated", async () => {
		const { t } = setup()
		await expect(t.query(api.bookmarkCollections.list)).rejects.toThrow("Non authentifié")
	})

	it("create rejects unauthenticated", async () => {
		const { t } = setup()
		await expect(
			t.mutation(api.bookmarkCollections.create, { name: "Test" })
		).rejects.toThrow("Non authentifié")
	})
})

describe("bookmarkCollections CRUD", () => {
	it("creates and lists", async () => {
		const { asUser } = setup()
		await asUser.mutation(api.bookmarkCollections.create, { name: "Favorites" })
		await asUser.mutation(api.bookmarkCollections.create, { name: "Archive" })
		const collections = await asUser.query(api.bookmarkCollections.list)
		expect(collections).toHaveLength(2)
	})

	it("rejects empty name", async () => {
		const { asUser } = setup()
		await expect(
			asUser.mutation(api.bookmarkCollections.create, { name: "   " })
		).rejects.toThrow("Le nom est requis")
	})

	it("auto-increments order", async () => {
		const { asUser } = setup()
		await asUser.mutation(api.bookmarkCollections.create, { name: "A" })
		await asUser.mutation(api.bookmarkCollections.create, { name: "B" })
		const collections = await asUser.query(api.bookmarkCollections.list)
		const orders = collections.map((c) => c.order).sort()
		expect(orders).toEqual([0, 1])
	})

	it("updates a collection", async () => {
		const { asUser } = setup()
		const id = await asUser.mutation(api.bookmarkCollections.create, { name: "Old" })
		await asUser.mutation(api.bookmarkCollections.update, { id, name: "New" })
		const collections = await asUser.query(api.bookmarkCollections.list)
		expect(collections.find((c) => c._id === id)!.name).toBe("New")
	})

	it("update rejects other user's collection", async () => {
		const { t } = setup()
		const user1 = t.withIdentity({ subject: "user1", issuer: "https://auth.test" })
		const user2 = t.withIdentity({ subject: "user2", issuer: "https://auth.test" })
		const id = await user1.mutation(api.bookmarkCollections.create, { name: "Mine" })
		await expect(
			user2.mutation(api.bookmarkCollections.update, { id, name: "Hacked" })
		).rejects.toThrow("Introuvable")
	})
})

describe("bookmarkCollections nesting", () => {
	it("creates child collection", async () => {
		const { asUser } = setup()
		const parentId = await asUser.mutation(api.bookmarkCollections.create, { name: "Parent" })
		await asUser.mutation(api.bookmarkCollections.create, {
			name: "Child",
			parentId,
		})
		const collections = await asUser.query(api.bookmarkCollections.list)
		const child = collections.find((c) => c.name === "Child")
		expect(child!.parentId).toBe(parentId)
	})

	it("rejects 3rd level nesting", async () => {
		const { asUser } = setup()
		const l1 = await asUser.mutation(api.bookmarkCollections.create, { name: "L1" })
		const l2 = await asUser.mutation(api.bookmarkCollections.create, {
			name: "L2",
			parentId: l1,
		})
		await expect(
			asUser.mutation(api.bookmarkCollections.create, {
				name: "L3",
				parentId: l2,
			})
		).rejects.toThrow("Maximum 2 niveaux")
	})
})

describe("bookmarkCollections remove", () => {
	it("removes and detaches bookmarks", async () => {
		const { asUser } = setup()
		const colId = await asUser.mutation(api.bookmarkCollections.create, { name: "ToDelete" })
		const bmId = await asUser.mutation(api.bookmarks.create, {
			url: "https://example.com",
			type: "link",
			collectionId: colId,
		})
		await asUser.mutation(api.bookmarkCollections.remove, { id: colId })

		const collections = await asUser.query(api.bookmarkCollections.list)
		expect(collections).toHaveLength(0)

		// Bookmark should still exist but without collection
		const bookmark = await asUser.query(api.bookmarks.get, { id: bmId })
		expect(bookmark.collectionId).toBeUndefined()
	})

	it("removes child collections when parent is deleted", async () => {
		const { asUser } = setup()
		const parentId = await asUser.mutation(api.bookmarkCollections.create, { name: "Parent" })
		await asUser.mutation(api.bookmarkCollections.create, {
			name: "Child",
			parentId,
		})
		await asUser.mutation(api.bookmarkCollections.remove, { id: parentId })
		const collections = await asUser.query(api.bookmarkCollections.list)
		expect(collections).toHaveLength(0)
	})

	it("remove rejects other user's collection", async () => {
		const { t } = setup()
		const user1 = t.withIdentity({ subject: "user1", issuer: "https://auth.test" })
		const user2 = t.withIdentity({ subject: "user2", issuer: "https://auth.test" })
		const id = await user1.mutation(api.bookmarkCollections.create, { name: "Mine" })
		await expect(
			user2.mutation(api.bookmarkCollections.remove, { id })
		).rejects.toThrow("Introuvable")
	})
})
