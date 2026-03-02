"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, Clock, FileText } from "lucide-react"
import { cn } from "@blazz/ui/lib/utils"

const links = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/time", label: "Temps", icon: Clock },
  { href: "/recap", label: "Récap", icon: FileText },
]

export function OpsNav() {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-1 p-3">
      {links.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
            "text-fg-muted hover:text-fg hover:bg-raised",
            (href === "/" ? pathname === "/" : pathname.startsWith(href)) && "text-fg bg-raised"
          )}
        >
          <Icon className="size-4" />
          {label}
        </Link>
      ))}
    </nav>
  )
}
