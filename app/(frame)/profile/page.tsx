"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { mockUsers } from "@/lib/mock-data/users"

/**
 * Profile page that redirects to the current user's detail page
 * In a real application, this would use the actual session user ID
 */
export default function ProfilePage() {
	const router = useRouter()

	useEffect(() => {
		// For development, we use the first user (Jean Dupont / John Doe)
		// In production, this would use the actual authenticated user's ID from the session
		const currentUser = mockUsers[0] // usr_1 - John Doe / Jean Dupont

		if (currentUser) {
			router.replace(`/users/${currentUser.id}`)
		} else {
			// Fallback to users list if no user found
			router.replace("/users")
		}
	}, [router])

	return (
		<div className="flex items-center justify-center min-h-screen">
			<p className="text-muted-foreground">Redirecting to your profile...</p>
		</div>
	)
}
