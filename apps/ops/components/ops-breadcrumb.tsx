import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { cn } from "@blazz/ui/lib/utils"

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface OpsBreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export function OpsBreadcrumb({ items, className }: OpsBreadcrumbProps) {
  return (
    <div
      className={cn(
        "flex h-10 items-center gap-1.5 border-b border-edge-subtle bg-raised px-6 rounded-tr-(--main-radius)",
        className,
      )}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1
        return (
          <div key={index} className="flex items-center gap-1.5">
            {index > 0 && (
              <ChevronRight className="h-3.5 w-3.5 text-fg-muted shrink-0" />
            )}
            {isLast || !item.href ? (
              <span
                className={cn(
                  "text-sm",
                  isLast
                    ? "font-medium text-fg"
                    : "text-fg-subtle",
                )}
              >
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="text-sm text-fg-subtle transition-colors hover:text-fg hover:underline"
              >
                {item.label}
              </Link>
            )}
          </div>
        )
      })}
    </div>
  )
}
