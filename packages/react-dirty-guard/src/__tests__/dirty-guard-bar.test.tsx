import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { DirtyGuardBar } from "../dirty-guard-bar"
import type { DirtyGuardState } from "../types"

const baseState: DirtyGuardState = {
  isBlocking: false,
  isShaking: false,
  isSaving: false,
  save: vi.fn(),
  discard: vi.fn(),
  allowNextNavigation: vi.fn(),
}

describe("DirtyGuardBar", () => {
  it("renders nothing when not blocking", () => {
    const { container } = render(<DirtyGuardBar {...baseState} />)
    expect(container.innerHTML).toBe("")
  })

  it("renders bar when blocking", () => {
    render(<DirtyGuardBar {...baseState} isBlocking />)
    expect(screen.getByText("You have unsaved changes")).toBeInTheDocument()
  })

  it("shows custom message", () => {
    render(<DirtyGuardBar {...baseState} isBlocking message="Draft not saved" />)
    expect(screen.getByText("Draft not saved")).toBeInTheDocument()
  })

  it("calls save on save button click", async () => {
    const save = vi.fn()
    render(<DirtyGuardBar {...baseState} isBlocking save={save} />)
    await userEvent.click(screen.getByRole("button", { name: "Save changes" }))
    expect(save).toHaveBeenCalledOnce()
  })

  it("calls discard on discard button click", async () => {
    const discard = vi.fn()
    render(<DirtyGuardBar {...baseState} isBlocking discard={discard} />)
    await userEvent.click(screen.getByRole("button", { name: "Discard" }))
    expect(discard).toHaveBeenCalledOnce()
  })

  it("shows custom button labels", () => {
    render(
      <DirtyGuardBar
        {...baseState}
        isBlocking
        saveLabel="Sauvegarder"
        discardLabel="Annuler"
      />
    )
    expect(screen.getByRole("button", { name: "Sauvegarder" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Annuler" })).toBeInTheDocument()
  })

  it("disables buttons when saving", () => {
    render(<DirtyGuardBar {...baseState} isBlocking isSaving />)
    expect(screen.getByRole("button", { name: /Save/ })).toBeDisabled()
    expect(screen.getByRole("button", { name: "Discard" })).toBeDisabled()
  })

  it("applies shake attribute when shaking", () => {
    const { container } = render(<DirtyGuardBar {...baseState} isBlocking isShaking />)
    expect(container.querySelector("[data-shaking]")).not.toBeNull()
  })

  it("renders at bottom when position is bottom", () => {
    const { container } = render(<DirtyGuardBar {...baseState} isBlocking position="bottom" />)
    expect(container.querySelector("[data-position='bottom']")).not.toBeNull()
  })
})
