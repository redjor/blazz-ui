import { useCallback, useEffect, useRef, useState } from "react"
import type { DirtyGuardOptions, DirtyGuardState } from "./types"

const SHAKE_DURATION = 500

const INERT_STATE: DirtyGuardState = {
  isBlocking: false,
  isShaking: false,
  isSaving: false,
  save: () => {},
  discard: () => {},
  allowNextNavigation: () => {},
}

export function useDirtyGuard(options: DirtyGuardOptions): DirtyGuardState {
  const {
    isDirty,
    isSaving: isSavingExternal = false,
    onSave,
    onDiscard,
    blockRouteNavigation = true,
    disabled = false,
  } = options

  const [isSavingInternal, setIsSavingInternal] = useState(false)
  const [isShaking, setIsShaking] = useState(false)
  const navigationBypassRef = useRef(false)
  const guardActiveRef = useRef(false)

  // Use refs for callbacks to avoid re-triggering effects
  const onSaveRef = useRef(onSave)
  const onDiscardRef = useRef(onDiscard)
  useEffect(() => {
    onSaveRef.current = onSave
    onDiscardRef.current = onDiscard
  })

  const isSaving = isSavingExternal || isSavingInternal
  const isBlocking = isDirty && !isSaving && !disabled

  // --- beforeunload ---
  useEffect(() => {
    if (!isDirty || disabled) return

    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault()
    }

    window.addEventListener("beforeunload", handler)
    return () => window.removeEventListener("beforeunload", handler)
  }, [isDirty, disabled])

  // --- popstate interception ---
  useEffect(() => {
    if (!isDirty || disabled || !blockRouteNavigation) {
      // Clean up phantom history entry when guard deactivates
      if (guardActiveRef.current) {
        guardActiveRef.current = false
        if (!navigationBypassRef.current) {
          window.history.back()
        }
      }
      return
    }

    // Reset bypass when guard (re-)activates
    navigationBypassRef.current = false

    const handler = () => {
      if (navigationBypassRef.current) {
        window.removeEventListener("popstate", handler)
        guardActiveRef.current = false
        window.history.back()
        return
      }
      // Block: re-push and shake
      window.history.pushState(null, "", window.location.href)
      setIsShaking(true)
    }

    // Push phantom entry
    window.history.pushState(null, "", window.location.href)
    guardActiveRef.current = true
    window.addEventListener("popstate", handler)

    return () => {
      window.removeEventListener("popstate", handler)
    }
  }, [isDirty, disabled, blockRouteNavigation])

  // --- shake timer ---
  useEffect(() => {
    if (!isShaking) return
    const timer = setTimeout(() => setIsShaking(false), SHAKE_DURATION)
    return () => clearTimeout(timer)
  }, [isShaking])

  // --- actions ---
  const save = useCallback(() => {
    if (disabled || !onSaveRef.current) return
    const result = onSaveRef.current()
    if (result instanceof Promise) {
      setIsSavingInternal(true)
      return result.finally(() => setIsSavingInternal(false))
    }
  }, [disabled])

  const discard = useCallback(() => {
    if (disabled) return
    navigationBypassRef.current = true
    onDiscardRef.current?.()
  }, [disabled])

  const allowNextNavigation = useCallback(() => {
    navigationBypassRef.current = true
  }, [])

  if (disabled) return INERT_STATE

  return {
    isBlocking,
    isShaking,
    isSaving,
    save,
    discard,
    allowNextNavigation,
  }
}
