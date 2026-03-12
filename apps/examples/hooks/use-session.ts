"use client"

import { useQuery } from "@tanstack/react-query"

export type User = {
	id: string
	email: string
	name: string
	firstName: string | null
	lastName: string | null
	role: string
	branch?: string | null // Okta branch attribute for BBUS user header
}

type SessionResponse = {
	user: User
}

async function fetchSession(): Promise<User> {
	const response = await fetch("/api/auth/session", {
		credentials: "include", // Ensure cookies are sent
	})

	if (!response.ok) {
		throw new Error("Failed to fetch session")
	}

	const data: SessionResponse = await response.json()

	return data.user
}

export function useSession() {
	return useQuery({
		queryKey: ["session"],
		queryFn: fetchSession,
		retry: false,
		staleTime: 30 * 1000, // 30 seconds
		refetchOnWindowFocus: true,
	})
}
