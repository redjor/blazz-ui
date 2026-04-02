import { ConvexHttpClient } from "convex/browser"
import { SignJWT } from "jose"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { internal } from "@/convex/_generated/api"
import { providerMap } from "@/lib/connections/providers"

const JWT_SECRET = new TextEncoder().encode(process.env.CONNECTIONS_JWT_SECRET ?? "dev-secret-change-me")

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export async function GET(_req: Request, { params }: { params: Promise<{ provider: string }> }) {
	const { provider: providerId } = await params
	const provider = providerMap[providerId]

	if (!provider || provider.authType !== "oauth2") {
		return NextResponse.json({ error: "Invalid provider" }, { status: 400 })
	}

	// Extract userId from auth cookie
	const cookieStore = await cookies()
	const authToken = cookieStore.get("__convexAuthToken")?.value
	if (!authToken) {
		return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
	}

	let userId: string
	try {
		const [, payloadB64] = authToken.split(".")
		const payload = JSON.parse(atob(payloadB64))
		userId = payload.sub
		if (!userId) throw new Error("No sub")
	} catch {
		return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
	}

	// Fetch provider credentials from Convex (use credentialsKey for shared OAuth apps)
	const credKey = provider.credentialsKey ?? providerId
	const config = await convex.query(internal.providerConfigs.internalGetByProvider, {
		userId,
		provider: credKey,
	})

	if (!config?.clientId || !config?.clientSecret) {
		return NextResponse.json({ error: "Provider not configured. Add credentials in Settings > Connections." }, { status: 400 })
	}

	const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/connections/${providerId}/callback`

	// Generate signed state JWT (5 min expiry)
	const state = await new SignJWT({ provider: providerId, userId }).setProtectedHeader({ alg: "HS256" }).setExpirationTime("5m").sign(JWT_SECRET)

	// Store state in httpOnly cookie
	cookieStore.set("oauth_state", state, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		maxAge: 300,
		path: "/",
	})

	// Build OAuth URL
	const url = new URL(provider.authUrl!)
	url.searchParams.set("client_id", config.clientId)
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
