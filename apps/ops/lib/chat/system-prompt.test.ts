import { describe, expect, it } from "vitest"
import { buildSystemPrompt } from "./system-prompt"

describe("buildSystemPrompt", () => {
	const ctx = {
		todoCount: 12,
		todosByStatus: { todo: 5, in_progress: 3, done: 4 },
		clientCount: 3,
		projectCount: 7,
		timeThisWeekMinutes: 1950, // 32.5h
	}

	it("includes today's date", () => {
		const prompt = buildSystemPrompt(ctx)
		const todayISO = new Date().toISOString().slice(0, 10)
		expect(prompt).toContain(todayISO)
	})

	it("includes todo count", () => {
		const prompt = buildSystemPrompt(ctx)
		expect(prompt).toContain("12 todos")
	})

	it("includes status breakdown", () => {
		const prompt = buildSystemPrompt(ctx)
		expect(prompt).toContain("5 todo")
		expect(prompt).toContain("3 in_progress")
		expect(prompt).toContain("4 done")
	})

	it("includes client and project count", () => {
		const prompt = buildSystemPrompt(ctx)
		expect(prompt).toContain("3 clients")
		expect(prompt).toContain("7 projets")
	})

	it("includes hours this week", () => {
		const prompt = buildSystemPrompt(ctx)
		expect(prompt).toContain("32.5h")
	})

	it("shows aucun when no todos by status", () => {
		const prompt = buildSystemPrompt({ ...ctx, todosByStatus: {} })
		expect(prompt).toContain("aucun")
	})

	it("includes rules section", () => {
		const prompt = buildSystemPrompt(ctx)
		expect(prompt).toContain("Règles")
		expect(prompt).toContain("YYYY-MM-DD")
	})
})
