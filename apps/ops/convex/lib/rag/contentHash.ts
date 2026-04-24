/**
 * Pure sha1 via Web Crypto. Available in Convex V8 runtime + Node 16+ + browser.
 */
export async function contentHash(input: string): Promise<string> {
	const data = new TextEncoder().encode(input)
	const buffer = await crypto.subtle.digest("SHA-1", data)
	return Array.from(new Uint8Array(buffer))
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("")
}
