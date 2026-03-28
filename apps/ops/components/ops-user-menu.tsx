"use client"

import { UserMenu } from "@blazz/ui/components/patterns/user-menu"
import { useAuthActions } from "@convex-dev/auth/react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"

export function OpsUserMenu() {
	const { signOut } = useAuthActions()
	const user = useQuery(api.users.getCurrentUser)

	return (
		<UserMenu
			user={{
				name: user?.name ?? "...",
				email: user?.email ?? undefined,
				avatar: (user?.image as string) ?? undefined,
			}}
			showEmail
			onLogout={() => void signOut()}
		/>
	)
}
