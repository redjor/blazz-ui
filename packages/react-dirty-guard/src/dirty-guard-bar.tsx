import type { DirtyGuardState } from "./types"

export interface DirtyGuardBarProps extends DirtyGuardState {
  /** @default "top" */
  position?: "top" | "bottom"
  /** @default "Save changes" */
  saveLabel?: string
  /** @default "Discard" */
  discardLabel?: string
  /** @default "You have unsaved changes" */
  message?: string
  /** Additional Tailwind classes on the outer container */
  className?: string
}

const shakeKeyframes = `
@keyframes dirty-guard-shake {
  0%, 100% { transform: translateX(0); }
  10% { transform: translateX(-8px); }
  20% { transform: translateX(8px); }
  30% { transform: translateX(-6px); }
  40% { transform: translateX(6px); }
  50% { transform: translateX(-3px); }
  60% { transform: translateX(3px); }
}
`

export function DirtyGuardBar({
  isBlocking,
  isShaking,
  isSaving,
  save,
  discard,
  position = "top",
  saveLabel = "Save changes",
  discardLabel = "Discard",
  message = "You have unsaved changes",
  className = "",
}: DirtyGuardBarProps) {
  if (!isBlocking) return null

  const positionClasses =
    position === "top" ? "top-0 left-0 right-0" : "bottom-0 left-0 right-0"

  return (
    <>
      <style>{shakeKeyframes}</style>
      <div
        data-position={position}
        data-shaking={isShaking || undefined}
        className={`fixed z-50 flex items-center gap-3 border-b border-zinc-200 bg-white/80 px-4 py-2 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80 ${positionClasses} ${className}`}
        style={
          isShaking
            ? { animation: "dirty-guard-shake 0.45s ease-out" }
            : undefined
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="size-4 shrink-0 text-amber-500"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 9a1 1 0 100-2 1 1 0 000 2z"
            clipRule="evenodd"
          />
        </svg>
        <span className="flex-1 truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
          {message}
        </span>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={discard}
            disabled={isSaving}
            className="rounded-md px-3 py-1.5 text-sm font-medium text-zinc-600 hover:bg-zinc-100 disabled:opacity-50 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            {discardLabel}
          </button>
          <button
            type="button"
            onClick={save}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {isSaving && (
              <svg
                className="size-3.5 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  className="opacity-25"
                />
                <path
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  className="opacity-75"
                />
              </svg>
            )}
            {saveLabel}
          </button>
        </div>
      </div>
    </>
  )
}
