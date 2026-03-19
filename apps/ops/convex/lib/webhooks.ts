const encoder = new TextEncoder()

function toHex(buffer: ArrayBuffer): string {
	return Array.from(new Uint8Array(buffer))
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("")
}

async function hmacSign(
	algorithm: "SHA-256" | "SHA-1",
	secret: string,
	payload: string
): Promise<string> {
	const key = await crypto.subtle.importKey(
		"raw",
		encoder.encode(secret),
		{ name: "HMAC", hash: algorithm },
		false,
		["sign"]
	)
	const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(payload))
	return toHex(sig)
}

/**
 * Verify GitHub webhook signature (HMAC-SHA256).
 */
export async function verifyGitHubSignature(
	payload: string,
	signature: string | null,
	secret: string
): Promise<boolean> {
	if (!signature) return false
	const expected = `sha256=${await hmacSign("SHA-256", secret, payload)}`
	return signature === expected
}

/**
 * Verify Vercel webhook signature (HMAC-SHA1).
 */
export async function verifyVercelSignature(
	payload: string,
	signature: string | null,
	secret: string
): Promise<boolean> {
	if (!signature) return false
	const expected = await hmacSign("SHA-1", secret, payload)
	return signature === expected
}

/**
 * Generate 2-letter initials from a name or username.
 */
export function initialsFrom(name: string): string {
	const parts = name
		.replace(/\[bot\]$/, "")
		.split(/[\s\-_]+/)
		.filter(Boolean)
	if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
	return name.slice(0, 2).toUpperCase()
}
