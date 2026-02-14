import { act, renderHook } from "@testing-library/react"
import { beforeEach, describe, expect, it } from "vitest"
import { TabsProvider, useTabs } from "./tabs-context"

function wrapper({ children }: { children: React.ReactNode }) {
	return <TabsProvider>{children}</TabsProvider>
}

describe("useTabs", () => {
	beforeEach(() => {
		localStorage.clear()
	})

	it("starts with no tabs", () => {
		const { result } = renderHook(() => useTabs(), { wrapper })
		expect(result.current.tabs).toEqual([])
		expect(result.current.activeTabId).toBeNull()
	})

	it("adds a tab", () => {
		const { result } = renderHook(() => useTabs(), { wrapper })
		act(() => {
			result.current.addTab({ url: "/contacts/1", title: "Marie Dupont" })
		})
		expect(result.current.tabs).toHaveLength(1)
		expect(result.current.tabs[0].url).toBe("/contacts/1")
		expect(result.current.tabs[0].title).toBe("Marie Dupont")
	})

	it("does not duplicate an existing URL — activates instead", () => {
		const { result } = renderHook(() => useTabs(), { wrapper })
		act(() => {
			result.current.addTab({ url: "/contacts/1", title: "Marie" })
			result.current.addTab({ url: "/deals/1", title: "Deal A" })
		})
		expect(result.current.tabs).toHaveLength(2)
		act(() => {
			result.current.addTab({ url: "/contacts/1", title: "Marie" })
		})
		expect(result.current.tabs).toHaveLength(2)
		expect(result.current.activeTabId).toBe(result.current.tabs[0].id)
	})

	it("closes a tab and activates the previous one", () => {
		const { result } = renderHook(() => useTabs(), { wrapper })
		act(() => {
			result.current.addTab({ url: "/contacts/1", title: "Tab 1" })
			result.current.addTab({ url: "/contacts/2", title: "Tab 2" })
			result.current.addTab({ url: "/contacts/3", title: "Tab 3" })
		})
		const tabToClose = result.current.tabs[2] // Tab 3 is active
		act(() => {
			result.current.closeTab(tabToClose.id)
		})
		expect(result.current.tabs).toHaveLength(2)
		expect(result.current.activeTabId).toBe(result.current.tabs[1].id) // Tab 2
	})

	it("closes the first tab and activates the next one", () => {
		const { result } = renderHook(() => useTabs(), { wrapper })
		act(() => {
			result.current.addTab({ url: "/contacts/1", title: "Tab 1" })
			result.current.addTab({ url: "/contacts/2", title: "Tab 2" })
		})
		// Activate Tab 1
		act(() => {
			result.current.activateTab(result.current.tabs[0].id)
		})
		act(() => {
			result.current.closeTab(result.current.tabs[0].id)
		})
		expect(result.current.tabs).toHaveLength(1)
		expect(result.current.activeTabId).toBe(result.current.tabs[0].id) // Tab 2
	})

	it("switches active tab", () => {
		const { result } = renderHook(() => useTabs(), { wrapper })
		act(() => {
			result.current.addTab({ url: "/contacts/1", title: "Tab 1" })
			result.current.addTab({ url: "/contacts/2", title: "Tab 2" })
		})
		act(() => {
			result.current.activateTab(result.current.tabs[0].id)
		})
		expect(result.current.activeTabId).toBe(result.current.tabs[0].id)
	})

	it("updates the active tab URL on navigation", () => {
		const { result } = renderHook(() => useTabs(), { wrapper })
		act(() => {
			result.current.addTab({ url: "/contacts", title: "Contacts" })
		})
		act(() => {
			result.current.updateActiveTabUrl("/contacts/1")
		})
		expect(result.current.tabs[0].url).toBe("/contacts/1")
	})

	it("updates a tab title", () => {
		const { result } = renderHook(() => useTabs(), { wrapper })
		act(() => {
			result.current.addTab({ url: "/contacts/1", title: "Loading..." })
		})
		act(() => {
			result.current.updateTabTitle(result.current.tabs[0].id, "Marie Dupont")
		})
		expect(result.current.tabs[0].title).toBe("Marie Dupont")
	})

	it("showTabBar is false with 0-1 tabs", () => {
		const { result } = renderHook(() => useTabs(), { wrapper })
		expect(result.current.showTabBar).toBe(false)
		act(() => {
			result.current.addTab({ url: "/contacts/1", title: "Tab 1" })
		})
		expect(result.current.showTabBar).toBe(false)
	})

	it("showTabBar is true with 2+ tabs", () => {
		const { result } = renderHook(() => useTabs(), { wrapper })
		act(() => {
			result.current.addTab({ url: "/contacts/1", title: "Tab 1" })
			result.current.addTab({ url: "/contacts/2", title: "Tab 2" })
		})
		expect(result.current.showTabBar).toBe(true)
	})
})
