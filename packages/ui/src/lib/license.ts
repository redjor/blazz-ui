export type LicensePlan = "PRO" | "TEAM" | "ENTERPRISE"

export interface LicenseInfo {
	plan: LicensePlan
	orgId: string
	expiry: Date
	valid: boolean
}

const VALID_PLANS: Set<string> = new Set(["PRO", "TEAM", "ENTERPRISE"])

const HMAC_SECRET = process.env.BLAZZ_LICENSE_SECRET || "__BLAZZ_DEV__"

function bytesToHex(bytes: Uint8Array): string {
	return Array.from(bytes)
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("")
}

async function computeHmac(payload: string): Promise<string> {
	const enc = new TextEncoder()
	const key = await crypto.subtle.importKey(
		"raw",
		enc.encode(HMAC_SECRET),
		{ name: "HMAC", hash: "SHA-256" },
		false,
		["sign"]
	)
	const sig = await crypto.subtle.sign("HMAC", key, enc.encode(payload))
	return bytesToHex(new Uint8Array(sig)).slice(0, 16)
}

export function parseLicenseKey(key: string): {
	plan: string
	orgId: string
	expiry: string
	signature: string
} | null {
	const parts = key.trim().split("-")
	if (parts.length !== 5 || parts[0] !== "BLAZZ") return null
	const [, plan, orgId, expiry, signature] = parts
	if (!VALID_PLANS.has(plan)) return null
	if (!/^\d{8}$/.test(expiry)) return null
	return { plan, orgId, expiry, signature }
}

function parseExpiry(expiry: string): Date {
	const y = Number.parseInt(expiry.slice(0, 4), 10)
	const m = Number.parseInt(expiry.slice(4, 6), 10) - 1
	const d = Number.parseInt(expiry.slice(6, 8), 10)
	return new Date(y, m, d)
}

export async function validateLicense(key: string): Promise<LicenseInfo | null> {
	const parsed = parseLicenseKey(key)
	if (!parsed) return null

	// Try crypto.subtle HMAC validation
	try {
		if (typeof crypto !== "undefined" && crypto.subtle) {
			const payload = `${parsed.plan}-${parsed.orgId}-${parsed.expiry}`
			const expected = await computeHmac(payload)
			if (parsed.signature !== expected) return null
		}
	} catch {
		// crypto.subtle unavailable (SSR, worker, etc.) — skip HMAC check.
		// The key format + expiry check still provides basic validation.
	}

	const expiry = parseExpiry(parsed.expiry)

	return {
		plan: parsed.plan as LicensePlan,
		orgId: parsed.orgId,
		expiry,
		valid: expiry > new Date(),
	}
}
