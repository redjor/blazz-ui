export interface DirtyGuardOptions {
  /** Is the form currently dirty? */
  isDirty: boolean
  /** Is a save in progress? */
  isSaving?: boolean
  /**
   * Called when user clicks Save.
   * If it returns a Promise that rejects, isSaving resets to false
   * and the guard stays active. The error propagates to the caller.
   */
  onSave?: () => void | Promise<void>
  /** Called when user clicks Discard */
  onDiscard?: () => void
  /**
   * Block in-page navigation via popstate interception.
   * Uses a phantom history entry — see README "Known limitations".
   * @default true
   */
  blockRouteNavigation?: boolean
  /** Disable all blocking. Useful for conditional opt-out. @default false */
  disabled?: boolean
}

export interface DirtyGuardState {
  /** Should the guard UI be visible? (isDirty && !isSaving && !disabled) */
  isBlocking: boolean
  /** True briefly (~500ms) when user tries to navigate away */
  isShaking: boolean
  /** Is save in progress? */
  isSaving: boolean
  /** Trigger save */
  save: () => void | Promise<void>
  /** Trigger discard + unlock navigation */
  discard: () => void
  /** One-shot bypass for next navigation event (call after save before redirect) */
  allowNextNavigation: () => void
}
