"use client"

import { Bell, ChevronDown, Menu, Search } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

export interface AppTopBarProps {
	onOpenCommandPalette?: () => void
	onOpenMobileMenu?: () => void
	className?: string
}

/**
 * AppTopBar - Global header for the application
 *
 * Structure:
 * - Left: Logo + App Name
 * - Center: Search Bar (opens Command Palette)
 * - Right: Notifications + User Menu
 *
 * @example
 * <AppTopBar onOpenCommandPalette={() => setCommandPaletteOpen(true)} />
 */
export function AppTopBar({ onOpenCommandPalette, onOpenMobileMenu, className }: AppTopBarProps) {
	return (
		<header
			className={cn(
				"flex h-[56px] shrink-0 items-center justify-between border-b border-gray-800 bg-black px-4",
				className
			)}
		>
			{/* Left: Mobile - Hamburger | Desktop - Logo + App Name */}
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

				{/* Desktop: Logo + App Name */}
				<div className="hidden md:flex items-center gap-3">
					<div className="flex h-8 w-8 items-center justify-center">
						<Image
							src="/logo_blazz_white.svg"
							alt="Blazz Logo"
							width={32}
							height={32}
							className="h-8 w-8"
						/>
					</div>
					<span className="text-base font-semibold text-white">Blazz</span>
				</div>
			</div>

			{/* Center: Search Bar */}
			<button
				type="button"
				onClick={onOpenCommandPalette}
				className="mx-4 flex max-w-md flex-1 items-center gap-2 rounded-lg border border-gray-700 bg-gray-800 px-3 py-1.5 transition-colors hover:border-gray-600 hover:bg-gray-700"
			>
				<Search className="h-4 w-4 text-gray-400" />
				<span className="text-sm text-gray-400">Search...</span>
				<kbd className="ml-auto hidden rounded border border-gray-700 bg-gray-700 px-1.5 py-0.5 text-xs text-gray-300 md:inline-flex">
					⌘K
				</kbd>
			</button>

			{/* Right: Notifications + User Menu */}
			<div className="flex items-center gap-2">
				<button
					type="button"
					className="rounded-lg p-2 transition-colors hover:bg-gray-800"
					aria-label="Notifications"
				>
					<Bell className="h-5 w-5 text-gray-300" />
				</button>
				<button
					type="button"
					className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-gray-800"
				>
					<div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-xs font-semibold text-white">
						U
					</div>
					<span className="hidden text-sm font-medium text-white md:inline-block">User</span>
					<ChevronDown className="h-4 w-4 text-gray-400" />
				</button>
			</div>
		</header>
	)
}
