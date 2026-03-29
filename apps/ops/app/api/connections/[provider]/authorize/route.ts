import { SignJWT } from "jose"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { providerMap } from "@/lib/connections/providers"

const JWT_SECRET = new TextEncoder().encode(process.env.CONNECTIONS_JWT_SECRET ?? "dev-secret-change-me")

export async function GET(_req: Request, { params }: { params: Promise<{ provider: string }> }) {
	const { provider: providerId } = await params
	const provider = providerMap[providerId]

	if (!provider || provider.authType !== "oauth2") {
		return NextResponse.json({ error: "Invalid provider" }, { status: 400 })
	}

	const clientId = process.env[`${providerId.toUpperCase()}_CLIENT_ID`]
	const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/connections/${providerId}/callback`

	if (!clientId) {
		return NextResponse.json({ error: "Provider not configured" }, { status: 500 })
	}

	// Generate signed state JWT (5 min expiry)
	const state = await new SignJWT({ provider: providerId }).setProtectedHeader({ alg: "HS256" }).setExpirationTime("5m").sign(JWT_SECRET)

	// Store state in httpOnly cookie
	const cookieStore = await cookies()
	cookieStore.set("oauth_state", state, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		maxAge: 300,
		path: "/",
	})

	// Build OAuth URL
	const url = new URL(provider.authUrl!)
	url.searchParams.set("client_id", clientId)
	url.searchParams.set("redirect_uri", redirectUri)
	url.searchParams.set("response_type", "code")
	url.searchParams.set("state", state)
	url.searchParams.set("access_type", "offline")
	url.searchParams.set("prompt", "consent")
	if (provider.scopes?.length) {
		url.searchParams.set("scope", provider.scopes.join(" "))
	}

	return NextResponse.redirect(url.toString())
}
