"use client"

import { ChevronDown, LogOut, Settings, User as UserIcon } from "lucide-react"
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

interface UserMenuProps {
	user?: {
		name: string
		email: string
		avatar?: string
		role?: string
	}
	className?: string
}

export function UserMenu({ user, className }: UserMenuProps) {
	const router = useRouter()

	// Valeurs par défaut si pas d'utilisateur
	const displayName = user?.name || "Jean Dupont"
	const displayRole = user?.role || "Administrateur"

	const initials = displayName
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase()
		.slice(0, 2)

	const handleLogout = async () => {
		try {
			// Appel à l'API de déconnexion
			const response = await fetch("/api/auth/logout", {
				method: "POST",
				credentials: "include",
			})

			if (response.ok) {
				// Redirection vers la page de login
				router.push("/auth/login")
			} else {
				console.error("Erreur lors de la déconnexion")
			}
		} catch (error) {
			console.error("Erreur lors de la déconnexion:", error)
		}
	}

	const handleProfile = () => {
		router.push("/profile")
	}

	const handleSettings = () => {
		router.push("/settings")
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2">
				<Avatar className="h-6 w-6">
					<AvatarImage src={user?.avatar} alt={displayName} />
					<AvatarFallback className="bg-blue-500 text-xs font-semibold text-white">
						{initials}
					</AvatarFallback>
				</Avatar>
				<span className="hidden text-sm font-medium text-white md:inline-block">
					{displayName}
				</span>
				<ChevronDown className="h-4 w-4 text-gray-400" />
			</DropdownMenuTrigger>
			<DropdownMenuContent
				className="w-56"
				align="end"
				sideOffset={8}
			>
				<div className="flex items-center gap-2 px-2 py-1.5 text-sm">
					<Avatar className="h-8 w-8">
						<AvatarImage src={user?.avatar} alt={displayName} />
						<AvatarFallback className="bg-blue-500 text-xs font-semibold text-white">
							{initials}
						</AvatarFallback>
					</Avatar>
					<div className="grid flex-1 text-left leading-tight">
						<span className="truncate font-semibold">{displayName}</span>
						{displayRole && (
							<span className="truncate text-xs text-muted-foreground font-medium">
								{displayRole}
							</span>
						)}
					</div>
				</div>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem onClick={handleProfile}>
						<UserIcon className="mr-2 h-4 w-4" />
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
