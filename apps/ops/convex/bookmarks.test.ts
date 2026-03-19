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

describe("bookmarks auth", () => {
	it("list rejects unauthenticated", async () => {
		const { t } = setup()
		await expect(t.query(api.bookmarks.list, {})).rejects.toThrow("Non authentifié")
	})

	it("create rejects unauthenticated", async () => {
		const { t } = setup()
		await expect(
			t.mutation(api.bookmarks.create, { url: "https://example.com", type: "link" })
		).rejects.toThrow("Non authentifié")
	})
})

describe("bookmarks CRUD", () => {
	it("creates and lists", async () => {
		const { asUser } = setup()
		await asUser.mutation(api.bookmarks.create, {
			url: "https://example.com",
			type: "link",
			title: "Example",
		})
		const bookmarks = await asUser.query(api.bookmarks.list, {})
		expect(bookmarks).toHaveLength(1)
		expect(bookmarks[0].title).toBe("Example")
	})

	it("rejects empty URL", async () => {
		const { asUser } = setup()
		await expect(
			asUser.mutation(api.bookmarks.create, { url: "  ", type: "link" })
		).rejects.toThrow("L'URL est requise")
	})

	it("gets by id", async () => {
		const { asUser } = setup()
		const id = await asUser.mutation(api.bookmarks.create, {
			url: "https://example.com",
			type: "link",
		})
		const bookmark = await asUser.query(api.bookmarks.get, { id })
		expect(bookmark.url).toBe("https://example.com")
	})

	it("get rejects other user's bookmark", async () => {
		const { t } = setup()
		const user1 = t.withIdentity({ subject: "user1", issuer: "https://auth.test" })
		const user2 = t.withIdentity({ subject: "user2", issuer: "https://auth.test" })
		const id = await user1.mutation(api.bookmarks.create, {
			url: "https://secret.com",
			type: "link",
		})
		await expect(user2.query(api.bookmarks.get, { id })).rejects.toThrow("Introuvable")
	})

	it("updates a bookmark", async () => {
		const { asUser } = setup()
		const id = await asUser.mutation(api.bookmarks.create, {
			url: "https://example.com",
			type: "link",
			title: "Old",
		})
		await asUser.mutation(api.bookmarks.update, { id, title: "New" })
		const bookmark = await asUser.query(api.bookmarks.get, { id })
		expect(bookmark.title).toBe("New")
	})

	it("removes a bookmark", async () => {
		const { asUser } = setup()
		const id = await asUser.mutation(api.bookmarks.create, {
			url: "https://example.com",
			type: "link",
		})
		await asUser.mutation(api.bookmarks.remove, { id })
		const bookmarks = await asUser.query(api.bookmarks.list, {})
		expect(bookmarks).toHaveLength(0)
	})
})

describe("bookmarks archive", () => {
	it("archives and unarchives", async () => {
		const { asUser } = setup()
		const id = await asUser.mutation(api.bookmarks.create, {
			url: "https://example.com",
			type: "link",
		})
		await asUser.mutation(api.bookmarks.archive, { id })

		// Archived: not in default list
		const active = await asUser.query(api.bookmarks.list, {})
		expect(active).toHaveLength(0)

		// Archived: visible in archived list
		const archived = await asUser.query(api.bookmarks.list, { archived: true })
		expect(archived).toHaveLength(1)

		// Unarchive
		await asUser.mutation(api.bookmarks.unarchive, { id })
		const restored = await asUser.query(api.bookmarks.list, {})
		expect(restored).toHaveLength(1)
	})
})

describe("bookmarks pinning", () => {
	it("pinned bookmarks appear first", async () => {
		const { asUser } = setup()
		const id1 = await asUser.mutation(api.bookmarks.create, {
			url: "https://unpinned.com",
			type: "link",
			title: "Unpinned",
		})
		const id2 = await asUser.mutation(api.bookmarks.create, {
			url: "https://pinned.com",
			type: "link",
			title: "Pinned",
		})
		await asUser.mutation(api.bookmarks.update, { id: id2, pinned: true })
		const bookmarks = await asUser.query(api.bookmarks.list, {})
		expect(bookmarks[0].title).toBe("Pinned")
	})
})

describe("bookmarks batch", () => {
	it("removeBatch deletes multiple bookmarks", async () => {
		const { asUser } = setup()
		const id1 = await asUser.mutation(api.bookmarks.create, {
			url: "https://a.com",
			type: "link",
		})
		const id2 = await asUser.mutation(api.bookmarks.create, {
			url: "https://b.com",
			type: "link",
		})
		await asUser.mutation(api.bookmarks.create, {
			url: "https://c.com",
			type: "link",
		})
		await asUser.mutation(api.bookmarks.removeBatch, { ids: [id1, id2] })
		const bookmarks = await asUser.query(api.bookmarks.list, {})
		expect(bookmarks).toHaveLength(1)
	})
})

describe("bookmarks move", () => {
	it("moves bookmarks to a collection", async () => {
		const { asUser } = setup()
		const colId = await asUser.mutation(api.bookmarkCollections.create, { name: "Favorites" })
		const bmId = await asUser.mutation(api.bookmarks.create, {
			url: "https://example.com",
			type: "link",
		})
		await asUser.mutation(api.bookmarks.move, { ids: [bmId], collectionId: colId })
		const inCol = await asUser.query(api.bookmarks.list, { collectionId: colId })
		expect(inCol).toHaveLength(1)
	})
})
