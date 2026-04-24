import { describe, expect, it } from "vitest"
import { buildIndexableText } from "./buildIndexableText"

describe("buildIndexableText", () => {
	it("formats a note with title + content", () => {
		const text = buildIndexableText({
			kind: "notes",
			title: "Réunion Coca-Cola",
			contentText: "On a parlé pricing et timeline.",
		})
		expect(text).toBe("Réunion Coca-Cola\n\nOn a parlé pricing et timeline.")
	})

	it("formats a note with empty contentText (trims trailing newlines)", () => {
		const text = buildIndexableText({
			kind: "notes",
			title: "Note vide",
			contentText: undefined,
		})
		expect(text).toBe("Note vide")
	})

	it("formats a bookmark with all fields", () => {
		const text = buildIndexableText({
			kind: "bookmarks",
			title: "Hermes Agent",
			notes: "Intéressant pour Blazz",
			description: "Self-improving AI agent",
			url: "https://github.com/NousResearch/hermes-agent",
		})
		expect(text).toBe("Hermes Agent\nIntéressant pour Blazz\nSelf-improving AI agent\nsource: https://github.com/NousResearch/hermes-agent")
	})

	it("formats a bookmark with only url (optional fields become empty lines)", () => {
		const text = buildIndexableText({
			kind: "bookmarks",
			title: undefined,
			notes: undefined,
			description: undefined,
			url: "https://example.com",
		})
		expect(text).toBe("\n\n\nsource: https://example.com")
	})

	it("trims whitespace from individual note fields", () => {
		const text = buildIndexableText({
			kind: "notes",
			title: "  Titre  ",
			contentText: "  Contenu  ",
		})
		expect(text).toBe("Titre\n\nContenu")
	})
})
