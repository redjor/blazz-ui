import { convexAuthNextjsMiddleware } from "@convex-dev/auth/nextjs/server"

// Token refresh only — auth redirects handled in (main)/layout.tsx
export default convexAuthNextjsMiddleware()

export const config = {
	matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}
