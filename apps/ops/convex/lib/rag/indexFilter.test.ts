import { describe, expect, it } from "vitest"
import { shouldIndex } from "./indexFilter"

describe("shouldIndex", () => {
	it("indexes a normal note", () => {
		expect(shouldIndex("This is a real note about pricing", "Pricing thoughts")).toEqual({ indexable: true })
	})

	it("skips empty or too-short content", () => {
		expect(shouldIndex("")).toEqual({ indexable: false, reason: "too_short" })
		expect(shouldIndex("hi")).toEqual({ indexable: false, reason: "too_short" })
		expect(shouldIndex("  short  ")).toEqual({ indexable: false, reason: "too_short" })
	})

	it("skips notes with agent markers in body", () => {
		const res = shouldIndex("Je crée la dépense.\n*Par Marc (Directeur Financier)*", "Dépense")
		expect(res).toEqual({ indexable: false, reason: "agent_generated" })
	})

	it("skips notes with noise titles", () => {
		expect(shouldIndex("some content about stuff", "Traitement en cours")).toEqual({
			indexable: false,
			reason: "noise_title",
		})
		expect(shouldIndex("blablabla that is long enough", "Rectification processus création")).toEqual({
			indexable: false,
			reason: "noise_title",
		})
	})

	it("indexes bookmarks (no title) with real content", () => {
		expect(shouldIndex("Great article about react patterns", undefined)).toEqual({ indexable: true })
	})
})
