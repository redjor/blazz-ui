import { ConvexHttpClient } from "convex/browser"
import { internal } from "@/convex/_generated/api"
import { providerMap } from "./providers"

type Connection = {
	_id: string
	provider: string
	userId?: string
	accessToken?: string
	refreshToken?: string
	tokenExpiresAt?: number
	status: string
}

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

/**
 * Returns a fresh access token for the given connection.
 * Refreshes automatically if expired or about to expire (1 min margin).
 * Fetches OAuth credentials from providerConfigs in Convex.
 * Throws if refresh fails — caller should mark connection as expired.
 */
export async function ensureFreshToken(connection: Connection): Promise<string> {
	if (!connection.accessToken) {
		throw new Error(`Connection ${connection._id} has no access token`)
	}

	// If no expiry or not expired yet, return current token
	if (!connection.tokenExpiresAt || connection.tokenExpiresAt > Date.now() + 60_000) {
		return connection.accessToken
	}

	// Need refresh
	if (!connection.refreshToken) {
		throw new Error(`Connection ${connection._id} token expired and no refresh token`)
	}

	const provider = providerMap[connection.provider]
	if (!provider?.tokenUrl) {
		throw new Error(`Provider ${connection.provider} has no tokenUrl`)
	}

	// Fetch OAuth credentials from Convex
	const userId = connection.userId
	if (!userId) {
		throw new Error(`Connection ${connection._id} has no userId for credential lookup`)
	}

	const config = await convex.query(internal.providerConfigs.internalGetByProvider, {
		userId,
		provider: connection.provider,
	})

	if (!config?.clientId || !config?.clientSecret) {
		throw new Error(`No credentials configured for provider ${connection.provider}`)
	}

	const res = await fetch(provider.tokenUrl, {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: new URLSearchParams({
			grant_type: "refresh_token",
			refresh_token: connection.refreshToken,
			client_id: config.clientId,
			client_secret: config.clientSecret,
		}),
	})

	if (!res.ok) {
		throw new Error(`Token refresh failed for ${connection.provider}: ${res.status}`)
	}

	const tokens = await res.json()

	// Return fresh token — caller is responsible for persisting via Convex mutation
	return tokens.access_token
}
