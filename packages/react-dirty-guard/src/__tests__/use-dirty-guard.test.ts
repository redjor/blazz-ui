import { act, renderHook } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import type { DirtyGuardOptions } from "../types"
import { useDirtyGuard } from "../use-dirty-guard"

describe("useDirtyGuard", () => {
  let addEventListenerSpy: ReturnType<typeof vi.spyOn>
  let removeEventListenerSpy: ReturnType<typeof vi.spyOn>
  let pushStateSpy: ReturnType<typeof vi.spyOn>
  let backSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    addEventListenerSpy = vi.spyOn(window, "addEventListener")
    removeEventListenerSpy = vi.spyOn(window, "removeEventListener")
    pushStateSpy = vi.spyOn(window.history, "pushState").mockImplementation(() => {})
    backSpy = vi.spyOn(window.history, "back").mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  const defaultProps: DirtyGuardOptions = {
    isDirty: false,
  }

  // --- isBlocking ---

  it("isBlocking is false when not dirty", () => {
    const { result } = renderHook(() => useDirtyGuard(defaultProps))
    expect(result.current.isBlocking).toBe(false)
  })

  it("isBlocking is true when dirty", () => {
    const { result } = renderHook(() => useDirtyGuard({ ...defaultProps, isDirty: true }))
    expect(result.current.isBlocking).toBe(true)
  })

  it("isBlocking is false when dirty but disabled", () => {
    const { result } = renderHook(() =>
      useDirtyGuard({ ...defaultProps, isDirty: true, disabled: true })
    )
    expect(result.current.isBlocking).toBe(false)
  })

  it("isBlocking is false when dirty but saving", () => {
    const { result } = renderHook(() =>
      useDirtyGuard({ ...defaultProps, isDirty: true, isSaving: true })
    )
    expect(result.current.isBlocking).toBe(false)
  })

  // --- beforeunload ---

  it("adds beforeunload listener when dirty", () => {
    renderHook(() => useDirtyGuard({ ...defaultProps, isDirty: true }))
    const calls = addEventListenerSpy.mock.calls.filter(([event]) => event === "beforeunload")
    expect(calls.length).toBe(1)
  })

  it("does not add beforeunload listener when not dirty", () => {
    renderHook(() => useDirtyGuard(defaultProps))
    const calls = addEventListenerSpy.mock.calls.filter(([event]) => event === "beforeunload")
    expect(calls.length).toBe(0)
  })

  it("does not add beforeunload listener when disabled", () => {
    renderHook(() => useDirtyGuard({ ...defaultProps, isDirty: true, disabled: true }))
    const calls = addEventListenerSpy.mock.calls.filter(([event]) => event === "beforeunload")
    expect(calls.length).toBe(0)
  })

  it("removes beforeunload listener on unmount", () => {
    const { unmount } = renderHook(() => useDirtyGuard({ ...defaultProps, isDirty: true }))
    unmount()
    const calls = removeEventListenerSpy.mock.calls.filter(([event]) => event === "beforeunload")
    expect(calls.length).toBe(1)
  })

  // --- popstate / blockRouteNavigation ---

  it("pushes phantom history entry when dirty and blockRouteNavigation is true", () => {
    renderHook(() => useDirtyGuard({ ...defaultProps, isDirty: true }))
    expect(pushStateSpy).toHaveBeenCalledWith(null, "", window.location.href)
  })

  it("does not push history entry when blockRouteNavigation is false", () => {
    renderHook(() =>
      useDirtyGuard({ ...defaultProps, isDirty: true, blockRouteNavigation: false })
    )
    expect(pushStateSpy).not.toHaveBeenCalled()
  })

  it("adds popstate listener when dirty and blockRouteNavigation is true", () => {
    renderHook(() => useDirtyGuard({ ...defaultProps, isDirty: true }))
    const calls = addEventListenerSpy.mock.calls.filter(([event]) => event === "popstate")
    expect(calls.length).toBe(1)
  })

  it("does not add popstate listener when blockRouteNavigation is false", () => {
    renderHook(() =>
      useDirtyGuard({ ...defaultProps, isDirty: true, blockRouteNavigation: false })
    )
    const calls = addEventListenerSpy.mock.calls.filter(([event]) => event === "popstate")
    expect(calls.length).toBe(0)
  })

  it("sets isShaking on popstate event", () => {
    const { result } = renderHook(() =>
      useDirtyGuard({ ...defaultProps, isDirty: true })
    )
    act(() => {
      window.dispatchEvent(new PopStateEvent("popstate"))
    })
    expect(result.current.isShaking).toBe(true)
  })

  it("clears isShaking after 500ms", () => {
    vi.useFakeTimers()
    const { result } = renderHook(() =>
      useDirtyGuard({ ...defaultProps, isDirty: true })
    )
    act(() => {
      window.dispatchEvent(new PopStateEvent("popstate"))
    })
    expect(result.current.isShaking).toBe(true)
    act(() => {
      vi.advanceTimersByTime(500)
    })
    expect(result.current.isShaking).toBe(false)
    vi.useRealTimers()
  })

  // --- save ---

  it("calls onSave when save() is called", async () => {
    const onSave = vi.fn()
    const { result } = renderHook(() =>
      useDirtyGuard({ ...defaultProps, isDirty: true, onSave })
    )
    await act(async () => { result.current.save() })
    expect(onSave).toHaveBeenCalledOnce()
  })

  it("manages isSaving for async onSave", async () => {
    let resolve: () => void
    const onSave = vi.fn(() => new Promise<void>((r) => { resolve = r }))
    const { result } = renderHook(() =>
      useDirtyGuard({ ...defaultProps, isDirty: true, onSave })
    )
    let savePromise: Promise<void>
    act(() => {
      savePromise = result.current.save() as unknown as Promise<void>
    })
    expect(result.current.isSaving).toBe(true)
    await act(async () => {
      resolve!()
      await savePromise
    })
    expect(result.current.isSaving).toBe(false)
  })

  it("resets isSaving on onSave rejection, guard stays active", async () => {
    const onSave = vi.fn(() => Promise.reject(new Error("fail")))
    const { result } = renderHook(() =>
      useDirtyGuard({ ...defaultProps, isDirty: true, onSave })
    )
    await act(async () => {
      try {
        await result.current.save()
      } catch {
        // expected
      }
    })
    expect(result.current.isSaving).toBe(false)
    expect(result.current.isBlocking).toBe(true)
  })

  // --- discard ---

  it("calls onDiscard and unblocks navigation", () => {
    const onDiscard = vi.fn()
    const { result } = renderHook(() =>
      useDirtyGuard({ ...defaultProps, isDirty: true, onDiscard })
    )
    act(() => result.current.discard())
    expect(onDiscard).toHaveBeenCalledOnce()
  })

  // --- disabled ---

  it("save and discard are no-ops when disabled", () => {
    const onSave = vi.fn()
    const onDiscard = vi.fn()
    const { result } = renderHook(() =>
      useDirtyGuard({ ...defaultProps, isDirty: true, disabled: true, onSave, onDiscard })
    )
    act(() => {
      result.current.save()
      result.current.discard()
    })
    expect(onSave).not.toHaveBeenCalled()
    expect(onDiscard).not.toHaveBeenCalled()
  })
})
