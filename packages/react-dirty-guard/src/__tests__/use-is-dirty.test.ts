import { act, renderHook } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { useIsDirty } from "../use-is-dirty"

describe("useIsDirty", () => {
  it("starts clean", () => {
    const { result } = renderHook(() => useIsDirty())
    expect(result.current.isDirty).toBe(false)
  })

  it("marks dirty", () => {
    const { result } = renderHook(() => useIsDirty())
    act(() => result.current.markDirty())
    expect(result.current.isDirty).toBe(true)
  })

  it("marks clean", () => {
    const { result } = renderHook(() => useIsDirty())
    act(() => result.current.markDirty())
    act(() => result.current.markClean())
    expect(result.current.isDirty).toBe(false)
  })
})
