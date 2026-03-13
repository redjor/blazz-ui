/**
 * Generate a Blazz license key.
 *
 * Usage:
 *   BLAZZ_LICENSE_SECRET=your-secret npx tsx packages/ui/scripts/generate-license.ts PRO acme42 20270311
 *
 * Output:
 *   BLAZZ-PRO-acme42-20270311-a1b2c3d4e5f6g7h8
 */

const [plan, orgId, expiry] = process.argv.slice(2)

if (!plan || !orgId || !expiry) {
	console.error("Usage: npx tsx generate-license.ts <plan> <orgId> <expiry>")
	console.error("  plan:   PRO | TEAM | ENTERPRISE")
	console.error("  orgId:  client identifier (e.g. acme42)")
	console.error("  expiry: YYYYMMDD (e.g. 20270311)")
	process.exit(1)
}

if (!["PRO", "TEAM", "ENTERPRISE"].includes(plan)) {
	console.error(`Invalid plan: ${plan}. Must be PRO, TEAM, or ENTERPRISE.`)
	process.exit(1)
}

if (!/^\d{8}$/.test(expiry)) {
	console.error(`Invalid expiry: ${expiry}. Must be YYYYMMDD format.`)
	process.exit(1)
}

const secret = process.env.BLAZZ_LICENSE_SECRET
if (!secret) {
	console.error("Missing BLAZZ_LICENSE_SECRET environment variable.")
	process.exit(1)
}

function bytesToHex(bytes: Uint8Array): string {
	return Array.from(bytes)
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("")
}

async function main() {
	const payload = `${plan}-${orgId}-${expiry}`
	const enc = new TextEncoder()
	const key = await crypto.subtle.importKey(
		"raw",
		enc.encode(secret),
		{ name: "HMAC", hash: "SHA-256" },
		false,
		["sign"]
	)
	const sig = await crypto.subtle.sign("HMAC", key, enc.encode(payload))
	const signature = bytesToHex(new Uint8Array(sig)).slice(0, 16)

	console.log(`BLAZZ-${plan}-${orgId}-${expiry}-${signature}`)
}

main()
