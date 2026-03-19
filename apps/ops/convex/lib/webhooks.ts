"use node"

import { createHmac, timingSafeEqual } from "node:crypto"

/**
 * Verify GitHub webhook signature (HMAC-SHA256).
 */
export function verifyGitHubSignature(
	payload: string,
	signature: string | null,
	secret: string
): boolean {
	if (!signature) return false
	const expected = `sha256=${createHmac("sha256", secret).update(payload).digest("hex")}`
	try {
		return timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
	} catch {
		return false
	}
}

/**
 * Verify Vercel webhook signature (HMAC-SHA1).
 */
export function verifyVercelSignature(
	payload: string,
	signature: string | null,
	secret: string
): boolean {
	if (!signature) return false
	const expected = createHmac("sha1", secret).update(payload).digest("hex")
	try {
		return timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
	} catch {
		return false
	}
}

/**
 * Generate 2-letter initials from a name or username.
 */
export function initialsFrom(name: string): string {
	const parts = name.replace(/\[bot\]$/, "").split(/[\s\-_]+/).filter(Boolean)
	if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
	return name.slice(0, 2).toUpperCase()
}
