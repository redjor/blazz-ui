import { renderHook } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { useTabTitle } from "./use-tab-title"

const mockUpdateTabTitle = vi.fn()
const mockActiveTabId = "tab-1"

vi.mock("@/components/layout/tabs-context", () => ({
	useTabs: () => ({
		activeTabId: mockActiveTabId,
		updateTabTitle: mockUpdateTabTitle,
	}),
}))

describe("useTabTitle", () => {
	it("calls updateTabTitle with activeTabId and title", () => {
		renderHook(() => useTabTitle("Marie Dupont"))
		expect(mockUpdateTabTitle).toHaveBeenCalledWith("tab-1", "Marie Dupont")
	})
})
