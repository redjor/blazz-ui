import type { UseFormReturn } from "react-hook-form"
import type { DirtyGuardState } from "../types"
import { useDirtyGuard } from "../use-dirty-guard"

export interface DirtyGuardRHFOptions {
  form: UseFormReturn<any>
  onSave: () => void | Promise<void>
  /** @default form.reset() */
  onDiscard?: () => void
  /** @default true */
  blockRouteNavigation?: boolean
  /** @default false */
  disabled?: boolean
}

export function useDirtyGuardRHF(options: DirtyGuardRHFOptions): DirtyGuardState {
  const { form, onSave, onDiscard, blockRouteNavigation, disabled } = options

  return useDirtyGuard({
    isDirty: form.formState.isDirty,
    isSaving: form.formState.isSubmitting,
    onSave,
    onDiscard: onDiscard ?? (() => form.reset()),
    blockRouteNavigation,
    disabled,
  })
}
