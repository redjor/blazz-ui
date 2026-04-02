import type { LucideIcon } from "lucide-react"
import { HardDrive, Mail } from "lucide-react"

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
	// Shared credentials key — providers sharing the same OAuth app use the same key
	credentialsKey?: string
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
		credentialsKey: "google",
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
		credentialsKey: "google",
		tools: ["google_mail_search", "google_mail_read", "google_mail_list_labels"],
	},
]

export const providerMap: Record<string, ProviderDef> = Object.fromEntries(providers.map((p) => [p.id, p]))

/** Get all tool names for a given provider */
export function getProviderTools(providerId: string): string[] {
	return providerMap[providerId]?.tools ?? []
}
