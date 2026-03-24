import { ConvexHttpClient } from "convex/browser"
import type { CliConfig } from "./config"

let client: ConvexHttpClient | null = null

export function getClient(config: CliConfig): ConvexHttpClient {
	if (!client) {
		client = new ConvexHttpClient(config.convexUrl)
		client.setAdminAuth(config.deployKey)
	}
	return client
}
