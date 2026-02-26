"use client"

import { useSearchParams } from "next/navigation"
import { useEffect } from "react"

export function ThumbnailShell({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams()
  const requestedTheme = searchParams.get("theme")

  useEffect(() => {
    if (requestedTheme === "light") {
      document.documentElement.classList.remove("dark")
    } else {
      document.documentElement.classList.add("dark")
    }
  }, [requestedTheme])

  return (
    <div
      className="flex items-center justify-center bg-surface"
      style={{
        width: 800,
        height: 600,
        backgroundImage:
          "radial-gradient(circle, var(--border-default) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    >
      <div className="max-w-[720px] max-h-[540px] overflow-hidden">
        {children}
      </div>
    </div>
  )
}
