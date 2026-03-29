import { providerMap } from "./providers"

type Connection = {
	_id: string
	provider: string
	accessToken?: string
	refreshToken?: string
	tokenExpiresAt?: number
	status: string
}

/**
 * Returns a fresh access token for the given connection.
 * Refreshes automatically if expired or about to expire (1 min margin).
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

	const clientId = process.env[`${connection.provider.toUpperCase()}_CLIENT_ID`]
	const clientSecret = process.env[`${connection.provider.toUpperCase()}_CLIENT_SECRET`]

	const res = await fetch(provider.tokenUrl, {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: new URLSearchParams({
			grant_type: "refresh_token",
			refresh_token: connection.refreshToken,
			client_id: clientId!,
			client_secret: clientSecret!,
		}),
	})

	if (!res.ok) {
		throw new Error(`Token refresh failed for ${connection.provider}: ${res.status}`)
	}

	const tokens = await res.json()

	// Return fresh token — caller is responsible for persisting via Convex mutation
	return tokens.access_token
}
