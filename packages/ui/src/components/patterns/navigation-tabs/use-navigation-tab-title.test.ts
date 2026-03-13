import { renderHook } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { useNavigationTabTitle } from "./use-navigation-tab-title"

const mockUpdateTabTitle = vi.fn()
const mockActiveTabId = "tab-1"

vi.mock("./use-navigation-tabs", () => ({
	useNavigationTabs: () => ({
		activeTabId: mockActiveTabId,
		updateTabTitle: mockUpdateTabTitle,
	}),
}))

describe("useNavigationTabTitle", () => {
	it("calls updateTabTitle with activeTabId and title", () => {
		renderHook(() => useNavigationTabTitle("Marie Dupont"))
		expect(mockUpdateTabTitle).toHaveBeenCalledWith("tab-1", "Marie Dupont")
	})
})
