import { describe, expect, it } from "vitest"
import { type FeatureFlag, features, isEnabled, routeToFlag } from "./features"

describe("isEnabled", () => {
	it("returns true for enabled flags", () => {
		for (const key of Object.keys(features) as FeatureFlag[]) {
			expect(isEnabled(key)).toBe(true)
		}
	})
})

describe("routeToFlag", () => {
	it("maps top-level routes to flags", () => {
		expect(routeToFlag("/chat")).toBe("chat")
		expect(routeToFlag("/todos")).toBe("todos")
		expect(routeToFlag("/packages")).toBe("packages")
	})

	it("maps nested routes to parent flag", () => {
		expect(routeToFlag("/clients/123")).toBe("clients")
		expect(routeToFlag("/clients/123/projects/456")).toBe("clients")
		expect(routeToFlag("/todos/abc")).toBe("todos")
	})

	it("returns null for unknown routes", () => {
		expect(routeToFlag("/unknown")).toBeNull()
		expect(routeToFlag("/settings")).toBeNull()
	})

	it("returns dashboard for root", () => {
		expect(routeToFlag("/")).toBe("dashboard")
	})

	it("maps /recap to recap flag", () => {
		expect(routeToFlag("/recap")).toBe("recap")
	})

	it("maps /time to time flag", () => {
		expect(routeToFlag("/time")).toBe("time")
	})
})
