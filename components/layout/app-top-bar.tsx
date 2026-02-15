import { Menu, Search } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "./theme-toggle"
import { NotificationSheet } from "./notification-sheet"
import { UserMenu } from "./user-menu"

export interface AppTopBarProps {
	onOpenCommandPalette?: () => void
	onOpenMobileMenu?: () => void
	className?: string
	/** Highlight the active section in the top bar nav */
	activeSection?: "docs" | "crm"
	/** Hide notifications and user menu (used in docs mode) */
	minimal?: boolean
	user?: {
		name: string
		email: string
		avatar?: string
		role?: string
	}
}

const sections = [
	{ id: "docs" as const, label: "Docs", href: "/docs/components" },
	{ id: "crm" as const, label: "CRM", href: "/examples/crm/dashboard" },
]

/**
 * AppTopBar - Global header for the application
 *
 * Structure:
 * - Left: Logo + Section Nav (Showcase / CRM / Docs)
 * - Center: Search Bar (opens Command Palette)
 * - Right: Notifications + User Menu
 */
export function AppTopBar({ onOpenCommandPalette, onOpenMobileMenu, className, activeSection, minimal, user }: AppTopBarProps) {
	return (
		<header
			className={cn(
				"flex h-(--topbar-height) shrink-0 items-center justify-between px-4",
				className
			)}
		>
			{/* Left: Mobile - Hamburger | Desktop - Logo + Section Nav */}
			<div className="flex items-center gap-3">
				{/* Mobile: Hamburger Menu Button */}
				<button
					type="button"
					onClick={onOpenMobileMenu}
					className="flex h-8 w-8 items-center justify-center md:hidden"
					aria-label="Ouvrir le menu"
				>
					<Menu className="h-5 w-5 text-white" />
				</button>

				{/* Desktop: Logo + Section Nav */}
				<div className="hidden md:flex items-center gap-2">
					<div className="flex h-24 w-24 items-center justify-center">
						<Image src="/logo_blazz_white.svg" alt="Blazz Logo" width={87} height={24} />
					</div>
					<div className="ml-2 flex items-center gap-1 rounded-lg bg-white/10 p-0.5">
						{sections.map((section) => (
							<Link
								key={section.id}
								href={section.href}
								className={cn(
									"rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
									activeSection === section.id
										? "bg-white/20 text-white"
										: "text-gray-400 hover:text-white hover:bg-white/10"
								)}
							>
								{section.label}
							</Link>
						))}
					</div>
				</div>
			</div>

			{/* Center: Search Bar */}
			<div className="flex justify-center">
				<button
					type="button"
					onClick={onOpenCommandPalette}
					className="mx-4 flex min-w-lg max-w-md flex-1 items-center gap-2 rounded-lg border border-edge-subtle bg-surface px-3 py-1.5 transition-colors hover:border-edge hover:bg-raised"
				>
					<Search className="h-4 w-4 text-fg-subtle" />
					<span className="text-sm text-fg-muted">Search...</span>
					<kbd className="ml-auto hidden rounded border border-edge-subtle bg-raised px-1.5 py-0.5 text-xs text-fg-muted md:inline-flex">
						⌘K
					</kbd>
				</button>
			</div>

			{/* Right: Theme + optional Notifications + User Menu */}
			<div className="flex items-center gap-2 shrink-0 justify-end">
				<ThemeToggle />
				{!minimal && (
					<>
						<NotificationSheet />
						<UserMenu user={user} />
					</>
				)}
			</div>
		</header>
	)
}
