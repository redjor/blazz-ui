"use client"

import { ChevronsUpDown, LogOut, Settings, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarMenuButton } from "@/components/ui/sidebar"
import type { SidebarUser } from "@/types/navigation"

interface SidebarUserProps {
	user: SidebarUser
}

export function SidebarUserMenu({ user }: SidebarUserProps) {
	const router = useRouter()

	const initials = user.name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase()

	const handleLogout = async () => {
		try {
			const response = await fetch("/api/auth/logout", {
				method: "POST",
				credentials: "include",
			})

			if (response.ok) {
				router.push("/auth/login")
			} else {
				console.error("Erreur lors de la déconnexion")
			}
		} catch (error) {
			console.error("Erreur lors de la déconnexion:", error)
		}
	}

	const handleProfile = () => {
		router.push("/examples/crm/settings")
	}

	const handleSettings = () => {
		router.push("/examples/crm/settings")
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={
					<SidebarMenuButton
						size="lg"
						className="data-[state=open]:bg-raised data-[state=open]:text-fg"
					>
						<Avatar className="h-8 w-8 rounded-lg">
							<AvatarImage src={user.avatar} alt={user.name} />
							<AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
						</Avatar>
						<div className="grid flex-1 text-left text-sm leading-tight">
							<span className="truncate font-semibold">{user.name}</span>
							{user.role && (
								<span className="truncate text-xs text-fg-muted">{user.role}</span>
							)}
						</div>
						<ChevronsUpDown className="ml-auto size-4" />
					</SidebarMenuButton>
				}
			/>
			<DropdownMenuContent
				className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
				side="bottom"
				align="end"
				sideOffset={4}
			>
				<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
					<Avatar className="h-8 w-8 rounded-lg">
						<AvatarImage src={user.avatar} alt={user.name} />
						<AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
					</Avatar>
					<div className="grid flex-1 text-left text-sm leading-tight">
						<span className="truncate font-semibold">{user.name}</span>
						{user.role && (
							<span className="truncate text-xs text-fg-muted font-medium">
								{user.role}
							</span>
						)}
					</div>
				</div>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem onClick={handleProfile}>
						<User className="mr-2 h-4 w-4" />
						Profil
					</DropdownMenuItem>
					<DropdownMenuItem onClick={handleSettings}>
						<Settings className="mr-2 h-4 w-4" />
						Paramètres
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
						<LogOut className="mr-2 h-4 w-4" />
						Se déconnecter
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
