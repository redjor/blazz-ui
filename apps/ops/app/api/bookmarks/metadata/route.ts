import { NextResponse } from "next/server"
import { extractMetadata } from "@/convex/lib/bookmarkMetadata"

export async function POST(request: Request) {
	try {
		const { url } = await request.json()
		if (!url || typeof url !== "string") {
			return NextResponse.json({ error: "URL is required" }, { status: 400 })
		}
		const metadata = await extractMetadata(url)
		return NextResponse.json(metadata)
	} catch {
		return NextResponse.json({ error: "Failed to extract metadata" }, { status: 500 })
	}
}
