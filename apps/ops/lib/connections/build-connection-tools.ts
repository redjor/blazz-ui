import { buildGoogleDriveTools } from "./adapters/google-drive"

// import { buildGoogleMailTools } from "./adapters/google-mail"
// import { buildNotionTools } from "./adapters/notion"
// import { buildAirtableTools } from "./adapters/airtable"

type Connection = {
	_id: string
	provider: string
	accessToken?: string
	refreshToken?: string
	tokenExpiresAt?: number
	status: string
	apiKey?: string
}

const adapterMap: Record<string, (conn: Connection) => Record<string, unknown>> = {
	google_drive: buildGoogleDriveTools,
	// google_mail: buildGoogleMailTools,
	// notion: buildNotionTools,
	// airtable: buildAirtableTools,
}

/**
 * Build tools from all active connections linked to an agent.
 * Returns a Record<toolName, toolDef> ready to merge into the agent's tools.
 */
export function buildConnectionTools(connections: Connection[]): Record<string, unknown> {
	const tools: Record<string, unknown> = {}

	for (const conn of connections) {
		if (conn.status !== "active") continue
		const builder = adapterMap[conn.provider]
		if (!builder) continue

		const providerTools = builder(conn)
		Object.assign(tools, providerTools)
	}

	return tools
}
