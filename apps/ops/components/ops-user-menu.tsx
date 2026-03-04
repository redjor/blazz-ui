"use client"

import { useAuthActions } from "@convex-dev/auth/react"
import { useQuery } from "convex/react"
import { ChevronsUpDown, LogOut } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@blazz/ui/components/ui/avatar"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@blazz/ui/components/ui/dropdown-menu"
import { SidebarMenuButton } from "@blazz/ui/components/ui/sidebar"
import { api } from "@/convex/_generated/api"

export function OpsUserMenu() {
	const { signOut } = useAuthActions()
	const user = useQuery(api.users.getCurrentUser)

	const name = user?.name ?? "..."
	const email = user?.email ?? ""
	const image = user?.image as string | undefined

	const initials = name
		.split(" ")
		.map((n: string) => n[0])
		.join("")
		.toUpperCase()
		.slice(0, 2)

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={
					<SidebarMenuButton
						size="lg"
						className="data-[state=open]:bg-raised data-[state=open]:text-fg"
					>
						<Avatar className="h-8 w-8 rounded-lg">
							<AvatarImage src={image} alt={name} />
							<AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
						</Avatar>
						<div className="grid flex-1 text-left text-sm leading-tight">
							<span className="truncate font-semibold">{name}</span>
							{email && <span className="truncate text-xs text-fg-muted">{email}</span>}
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
						<AvatarImage src={image} alt={name} />
						<AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
					</Avatar>
					<div className="grid flex-1 text-left text-sm leading-tight">
						<span className="truncate font-semibold">{name}</span>
						{email && <span className="truncate text-xs text-fg-muted">{email}</span>}
					</div>
				</div>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					onClick={() => void signOut()}
					className="text-red-600 focus:text-red-600"
				>
					<LogOut className="mr-2 h-4 w-4" />
					Se déconnecter
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
