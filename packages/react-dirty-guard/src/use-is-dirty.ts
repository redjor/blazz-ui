import { useCallback, useState } from "react"

export interface IsDirtyState {
  isDirty: boolean
  markDirty: () => void
  markClean: () => void
}

export function useIsDirty(): IsDirtyState {
  const [isDirty, setIsDirty] = useState(false)

  const markDirty = useCallback(() => setIsDirty(true), [])
  const markClean = useCallback(() => setIsDirty(false), [])

  return { isDirty, markDirty, markClean }
}
