"use client"

import { ChevronDown, LogOut, Settings, User as UserIcon } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Badge } from "../ui/badge"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu"

export interface UserMenuUser {
	name: string
	email?: string
	avatar?: string
	role?: string
}

export interface UserMenuProps {
	user?: UserMenuUser
	onProfile?: () => void
	onSettings?: () => void
	onLogout?: () => void
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

export function UserMenu({ user, onProfile, onSettings, onLogout, className }: UserMenuProps) {
	const displayName = user?.name ?? "Jean Dupont"
	const displayRole = user?.role ?? "Administrateur"
	const initials = getUserInitials(displayName)

	const hasActions = onProfile || onSettings
	const hasDestructive = Boolean(onLogout)

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-raised focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
			>
				<Avatar>
					<AvatarImage src={user?.avatar} alt={displayName} />
					<AvatarFallback>{initials}</AvatarFallback>
				</Avatar>
				<div className="flex flex-col text-left">
					<div className="flex items-center gap-1.5">
						<span className="text-sm font-semibold text-fg">{displayName}</span>
						<Badge variant="default" size="xs">Pro</Badge>
					</div>
					<span className="text-xs text-fg-muted">{displayRole}</span>
				</div>
				<ChevronDown className="size-3.5 shrink-0 text-fg-muted" />
			</DropdownMenuTrigger>

			<DropdownMenuContent className="w-56" align="end" sideOffset={8}>
				<div className="flex items-center gap-2 px-2 py-1.5">
					<Avatar className="size-8">
						<AvatarImage src={user?.avatar} alt={displayName} />
						<AvatarFallback className="bg-brand/20 text-xs font-semibold text-brand">
							{initials}
						</AvatarFallback>
					</Avatar>
					<div className="grid flex-1 text-left leading-tight">
						<span className="truncate text-sm font-semibold text-fg">{displayName}</span>
						{displayRole && (
							<span className="truncate text-xs text-fg-muted font-medium">{displayRole}</span>
						)}
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
							<DropdownMenuItem
								onClick={onLogout}
								className="text-negative focus:text-negative"
							>
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
