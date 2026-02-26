import { createServerFn } from "@tanstack/react-start"

export type Theme = "light" | "dark"

/**
 * Parse the theme from a raw cookie header string.
 * Used in __root.tsx loader where we read the request headers directly.
 * Defaults to "dark" if no cookie is set.
 */
export function getThemeFromCookie(cookieHeader: string | undefined): Theme {
	const match = cookieHeader?.match(/theme=(\w+)/)
	return match?.[1] === "light" ? "light" : "dark"
}

/**
 * Server function to persist the theme choice as a cookie.
 * Called from ThemeToggle after toggling the .dark class on the client.
 */
export const setThemeCookie = createServerFn({ method: "POST" })
	.inputValidator((d: Theme) => d)
	.handler(async ({ data }) => {
		const { setCookie } = await import("@tanstack/react-start/server")
		setCookie("theme", data, {
			path: "/",
			maxAge: 60 * 60 * 24 * 365, // 1 year
			sameSite: "lax",
		})
	})
