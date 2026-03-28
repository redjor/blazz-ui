const HMAC_SECRET = "__BLAZZ_DEV__"

async function computeHmac(payload: string): Promise<string> {
	const enc = new TextEncoder()
	const key = await crypto.subtle.importKey("raw", enc.encode(HMAC_SECRET), { name: "HMAC", hash: "SHA-256" }, false, ["sign"])
	const sig = await crypto.subtle.sign("HMAC", key, enc.encode(payload))
	return Array.from(new Uint8Array(sig))
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("")
		.slice(0, 16)
}

export async function generateLicenseKey(plan: "PRO" | "TEAM" | "ENTERPRISE", orgId: string, expiresAt: string): Promise<string> {
	const expiry = expiresAt.replace(/-/g, "")
	const payload = `${plan}-${orgId}-${expiry}`
	const signature = await computeHmac(payload)
	return `BLAZZ-${plan}-${orgId}-${expiry}-${signature}`
}
