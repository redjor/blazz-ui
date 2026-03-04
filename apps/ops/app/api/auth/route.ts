import { proxyAuthActionToConvex } from "@convex-dev/auth/nextjs/server"
import { type NextRequest } from "next/server"

export async function POST(request: NextRequest) {
	return proxyAuthActionToConvex(request, {
		convexUrl: process.env.NEXT_PUBLIC_CONVEX_URL,
	})
}
