import { describe, expect, it } from "vitest"
import { toInboxNotification } from "./notifications"

describe("toInboxNotification", () => {
	const base = {
		_id: "notif_1",
		title: "PR #42 merged",
		description: "feat: add inbox component",
		source: "github",
		actionType: "comment",
		authorName: "jonathanruas",
		authorInitials: "JR",
		createdAt: Date.now() - 60 * 1000, // 1 min ago
	}

	it("maps basic fields", () => {
		const result = toInboxNotification(base)
		expect(result.id).toBe("notif_1")
		expect(result.title).toBe("PR #42 merged")
		expect(result.description).toBe("feat: add inbox component")
	})

	it("maps known actionTypes", () => {
		for (const type of ["comment", "reply", "reaction", "mention", "added"]) {
			const result = toInboxNotification({ ...base, actionType: type })
			expect(result.actionType).toBe(type)
		}
	})

	it("falls back to comment for unknown actionType", () => {
		const result = toInboxNotification({ ...base, actionType: "unknown" })
		expect(result.actionType).toBe("comment")
	})

	it("maps author correctly", () => {
		const result = toInboxNotification({
			...base,
			authorColor: "#8b5cf6",
			authorAvatar: "https://example.com/avatar.jpg",
		})
		expect(result.author.name).toBe("jonathanruas")
		expect(result.author.initials).toBe("JR")
		expect(result.author.color).toBe("#8b5cf6")
		expect(result.author.avatarUrl).toBe("https://example.com/avatar.jpg")
	})

	it("defaults read to false", () => {
		const result = toInboxNotification(base)
		expect(result.read).toBe(false)
	})

	it("uses read value when provided", () => {
		const result = toInboxNotification({ ...base, read: true })
		expect(result.read).toBe(true)
	})

	it("defaults status to default", () => {
		const result = toInboxNotification(base)
		expect(result.status).toBe("default")
	})

	it("defaults priority to none", () => {
		const result = toInboxNotification(base)
		expect(result.priority).toBe("none")
	})

	it("formats time as compact string", () => {
		const result = toInboxNotification(base)
		expect(result.time).toBeTruthy()
		expect(typeof result.time).toBe("string")
	})
})
