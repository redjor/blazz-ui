"use client"

import { ChevronDown, LogOut, Settings, User as UserIcon } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Badge } from "../ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"

export interface UserMenuUser {
	name: string
	email?: string
	avatar?: string
	role?: string
}

export interface UserMenuProps {
	user?: UserMenuUser
	badge?: string
	onProfile?: () => void
	onSettings?: () => void
	onLogout?: () => void | Promise<void>
	showEmail?: boolean
	className?: string
}

function getUserInitials(name: string): string {
	return name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase()
		.slice(0, 2)
}

export function UserMenu({ user, badge, onProfile, onSettings, onLogout, showEmail = false, className }: UserMenuProps) {
	const displayName = user?.name ?? "Jean Dupont"
	const displayRole = user?.role
	const initials = getUserInitials(displayName)

	const hasActions = onProfile || onSettings
	const hasDestructive = Boolean(onLogout)

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={
					<button
						type="button"
						className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 w-full"
					/>
				}
			>
				<Avatar className="size-6">
					<AvatarImage src={user?.avatar} alt={displayName} />
					<AvatarFallback className="text-[10px]">{initials}</AvatarFallback>
				</Avatar>
				<div className="flex flex-1 flex-col text-left">
					<div className="flex items-center gap-1.5">
						<span className="text-xs font-medium text-fg">{displayName}</span>
						{badge && (
							<Badge variant="default" size="xs">
								{badge}
							</Badge>
						)}
					</div>
					{displayRole && <span className="text-xs text-fg-muted">{displayRole}</span>}
				</div>
				<ChevronDown className="ml-auto size-3.5 shrink-0 text-fg-muted" />
			</DropdownMenuTrigger>

			<DropdownMenuContent className="w-56" align="end" sideOffset={8}>
				<div className="flex items-center gap-2 px-2 py-1.5">
					<Avatar className="size-6">
						<AvatarImage src={user?.avatar} alt={displayName} />
						<AvatarFallback className="bg-brand/20 text-[10px] font-semibold text-brand">{initials}</AvatarFallback>
					</Avatar>
					<div className="grid flex-1 text-left leading-tight">
						<span className="truncate text-sm font-semibold text-fg">{displayName}</span>
						{displayRole && <span className="truncate text-xs text-fg-muted font-medium">{displayRole}</span>}
						{showEmail && user?.email && <span className="truncate text-xs text-fg-muted">{user.email}</span>}
					</div>
				</div>

				{hasActions && (
					<>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							{onProfile && (
								<DropdownMenuItem onClick={onProfile}>
									<UserIcon className="mr-2 size-4" />
									Profil
								</DropdownMenuItem>
							)}
							{onSettings && (
								<DropdownMenuItem onClick={onSettings}>
									<Settings className="mr-2 size-4" />
									Paramètres
								</DropdownMenuItem>
							)}
						</DropdownMenuGroup>
					</>
				)}

				{hasDestructive && (
					<>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem onClick={onLogout} variant="destructive">
								<LogOut className="mr-2 size-4" />
								Se déconnecter
							</DropdownMenuItem>
						</DropdownMenuGroup>
					</>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
