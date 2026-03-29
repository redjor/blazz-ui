import type { LucideIcon } from "lucide-react"
import { FileText, HardDrive, Mail, Table2 } from "lucide-react"

export type ProviderDef = {
	id: string
	name: string
	icon: LucideIcon
	authType: "oauth2" | "api_key"
	description: string
	capabilities: string[]
	// OAuth2
	authUrl?: string
	tokenUrl?: string
	scopes?: string[]
	// Tools exposed by this provider
	tools: string[]
}

export const providers: ProviderDef[] = [
	{
		id: "google_drive",
		name: "Google Drive",
		icon: HardDrive,
		authType: "oauth2",
		description: "Rechercher et lire des fichiers Google Drive.",
		capabilities: ["Recherche", "Lecture"],
		authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
		tokenUrl: "https://oauth2.googleapis.com/token",
		scopes: ["https://www.googleapis.com/auth/drive.readonly"],
		tools: ["google_drive_search", "google_drive_read", "google_drive_list"],
	},
	{
		id: "google_mail",
		name: "Google Mail",
		icon: Mail,
		authType: "oauth2",
		description: "Rechercher et lire des emails Gmail.",
		capabilities: ["Recherche", "Lecture"],
		authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
		tokenUrl: "https://oauth2.googleapis.com/token",
		scopes: ["https://www.googleapis.com/auth/gmail.readonly"],
		tools: ["google_mail_search", "google_mail_read", "google_mail_list_labels"],
	},
	{
		id: "notion",
		name: "Notion",
		icon: FileText,
		authType: "oauth2",
		description: "Rechercher et lire des pages et bases Notion.",
		capabilities: ["Recherche", "Lecture"],
		authUrl: "https://api.notion.com/v1/oauth/authorize",
		tokenUrl: "https://api.notion.com/v1/oauth/token",
		scopes: [],
		tools: ["notion_search", "notion_read_page", "notion_query_database"],
	},
	{
		id: "airtable",
		name: "Airtable",
		icon: Table2,
		authType: "api_key",
		description: "Lire des enregistrements Airtable.",
		capabilities: ["Recherche", "Lecture"],
		tools: ["airtable_list_records", "airtable_get_record", "airtable_search"],
	},
]

export const providerMap: Record<string, ProviderDef> = Object.fromEntries(providers.map((p) => [p.id, p]))

/** Get all tool names for a given provider */
export function getProviderTools(providerId: string): string[] {
	return providerMap[providerId]?.tools ?? []
}
