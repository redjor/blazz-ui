import { existsSync } from "node:fs"
import { homedir } from "node:os"
import { resolve } from "node:path"
import { config } from "dotenv"

export interface CliConfig {
	convexUrl: string
	deployKey: string
	userId: string
}

export function loadConfig(): CliConfig {
	// 1. Try apps/ops/.env.local (next to the CLI)
	const localEnv = resolve(new URL(".", import.meta.url).pathname, "..", "..", ".env.local")
	if (existsSync(localEnv)) {
		config({ path: localEnv })
	}

	// 2. Try ~/.blazz-ops/.env (override)
	const homeEnv = resolve(homedir(), ".blazz-ops", ".env")
	if (existsSync(homeEnv)) {
		config({ path: homeEnv })
	}

	const convexUrl = process.env.CONVEX_URL || process.env.NEXT_PUBLIC_CONVEX_URL
	const deployKey = process.env.CONVEX_DEPLOY_KEY
	const userId = process.env.OPS_USER_ID

	if (!convexUrl) throw new Error("Missing CONVEX_URL or NEXT_PUBLIC_CONVEX_URL")
	if (!deployKey) throw new Error("Missing CONVEX_DEPLOY_KEY")
	if (!userId) throw new Error("Missing OPS_USER_ID")

	return { convexUrl, deployKey, userId }
}
