import { ConvexHttpClient } from "convex/browser"
import { jwtVerify } from "jose"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { internal } from "@/convex/_generated/api"
import { providerMap } from "@/lib/connections/providers"

const JWT_SECRET = new TextEncoder().encode(process.env.CONNECTIONS_JWT_SECRET ?? "dev-secret-change-me")

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

const appUrl = () => process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3120"

export async function GET(req: Request, { params }: { params: Promise<{ provider: string }> }) {
	const { provider: providerId } = await params
	const provider = providerMap[providerId]
	const url = new URL(req.url)
	const code = url.searchParams.get("code")
	const state = url.searchParams.get("state")

	if (!provider || !code || !state) {
		return NextResponse.redirect(`${appUrl()}/settings/connections?error=invalid_request`)
	}

	// Verify state JWT
	const cookieStore = await cookies()
	const savedState = cookieStore.get("oauth_state")?.value
	if (state !== savedState) {
		return NextResponse.redirect(`${appUrl()}/settings/connections?error=state_mismatch`)
	}

	try {
		const { payload } = await jwtVerify(state, JWT_SECRET)
		if (payload.provider !== providerId) {
			throw new Error("Provider mismatch")
		}
	} catch {
		return NextResponse.redirect(`${appUrl()}/settings/connections?error=state_expired`)
	}

	// Exchange code for tokens
	const clientId = process.env[`${providerId.toUpperCase()}_CLIENT_ID`]
	const clientSecret = process.env[`${providerId.toUpperCase()}_CLIENT_SECRET`]
	const redirectUri = `${appUrl()}/api/connections/${providerId}/callback`

	const tokenRes = await fetch(provider.tokenUrl!, {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: new URLSearchParams({
			grant_type: "authorization_code",
			code,
			redirect_uri: redirectUri,
			client_id: clientId!,
			client_secret: clientSecret!,
		}),
	})

	if (!tokenRes.ok) {
		return NextResponse.redirect(`${appUrl()}/settings/connections?error=token_exchange_failed`)
	}

	const tokens = await tokenRes.json()

	// Health check — verify the token works
	const healthOk = await healthCheck(providerId, tokens.access_token)
	if (!healthOk) {
		return NextResponse.redirect(`${appUrl()}/settings/connections?error=health_check_failed`)
	}

	// Fetch account info
	const accountInfo = await fetchAccountInfo(providerId, tokens.access_token)

	// Extract userId from Convex auth cookie
	const authToken = cookieStore.get("__convexAuthToken")?.value
	if (!authToken) {
		return NextResponse.redirect(`${appUrl()}/settings/connections?error=not_authenticated`)
	}

	// Decode JWT to get userId (Convex auth tokens contain sub claim)
	let userId: string
	try {
		const [, payloadB64] = authToken.split(".")
		const payload = JSON.parse(atob(payloadB64))
		userId = payload.sub
		if (!userId) throw new Error("No sub in token")
	} catch {
		return NextResponse.redirect(`${appUrl()}/settings/connections?error=not_authenticated`)
	}

	// Save to Convex
	await convex.mutation(internal.connections.internalCreate, {
		userId,
		provider: providerId,
		label: `${provider.name}${accountInfo?.email ? ` (${accountInfo.email})` : ""}`,
		authType: "oauth2",
		accessToken: tokens.access_token,
		refreshToken: tokens.refresh_token,
		tokenExpiresAt: tokens.expires_in ? Date.now() + tokens.expires_in * 1000 : undefined,
		scopes: provider.scopes,
		accountInfo,
	})

	// Clean up state cookie
	cookieStore.delete("oauth_state")

	return NextResponse.redirect(`${appUrl()}/settings/connections?success=true`)
}

// ── Helpers ──

async function healthCheck(provider: string, accessToken: string): Promise<boolean> {
	try {
		switch (provider) {
			case "google_drive": {
				const res = await fetch("https://www.googleapis.com/drive/v3/about?fields=user", { headers: { Authorization: `Bearer ${accessToken}` } })
				return res.ok
			}
			case "google_mail": {
				const res = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/profile", { headers: { Authorization: `Bearer ${accessToken}` } })
				return res.ok
			}
			case "notion": {
				const res = await fetch("https://api.notion.com/v1/users/me", {
					headers: {
						Authorization: `Bearer ${accessToken}`,
						"Notion-Version": "2022-06-28",
					},
				})
				return res.ok
			}
			default:
				return true
		}
	} catch {
		return false
	}
}

async function fetchAccountInfo(provider: string, accessToken: string): Promise<{ email?: string; name?: string; avatar?: string } | undefined> {
	try {
		switch (provider) {
			case "google_drive":
			case "google_mail": {
				const res = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", { headers: { Authorization: `Bearer ${accessToken}` } })
				if (!res.ok) return undefined
				const data = await res.json()
				return { email: data.email, name: data.name, avatar: data.picture }
			}
			case "notion": {
				const res = await fetch("https://api.notion.com/v1/users/me", {
					headers: {
						Authorization: `Bearer ${accessToken}`,
						"Notion-Version": "2022-06-28",
					},
				})
				if (!res.ok) return undefined
				const data = await res.json()
				return { name: data.name, avatar: data.avatar_url }
			}
			default:
				return undefined
		}
	} catch {
		return undefined
	}
}
