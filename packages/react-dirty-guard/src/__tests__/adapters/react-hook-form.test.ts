import { act, renderHook } from "@testing-library/react"
import { useForm } from "react-hook-form"
import { describe, expect, it, vi } from "vitest"
import { useDirtyGuardRHF } from "../../adapters/react-hook-form"

describe("useDirtyGuardRHF", () => {
  it("maps form.formState.isDirty to isBlocking", () => {
    const { result } = renderHook(() => {
      const form = useForm({ defaultValues: { name: "" } })
      return {
        form,
        guard: useDirtyGuardRHF({ form, onSave: vi.fn() }),
      }
    })

    expect(result.current.guard.isBlocking).toBe(false)
  })

  it("uses form.reset as default onDiscard", () => {
    const { result } = renderHook(() => {
      const form = useForm({ defaultValues: { name: "" } })
      return {
        form,
        guard: useDirtyGuardRHF({ form, onSave: vi.fn() }),
      }
    })

    const resetSpy = vi.spyOn(result.current.form, "reset")
    act(() => result.current.guard.discard())
    expect(resetSpy).toHaveBeenCalled()
  })

  it("passes through disabled option", () => {
    const { result } = renderHook(() => {
      const form = useForm({ defaultValues: { name: "" } })
      return useDirtyGuardRHF({
        form,
        onSave: vi.fn(),
        disabled: true,
      })
    })

    expect(result.current.isBlocking).toBe(false)
  })
})
