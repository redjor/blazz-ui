import { getInitials } from "./initials"

export interface ParsedAccountMetadata {
	scope: string
	role: string
	initials: string
}

/**
 * Parse un label de compte pour extraire scope, rôle et initiales
 *
 * @example
 * parseAccountMetadata("🌍 Global - Directeur")
 * // { scope: "Global", role: "Directeur", initials: "GD" }
 */
export function parseAccountMetadata(label: string): ParsedAccountMetadata {
	const cleaned = label.replace(/[\u{1F300}-\u{1F9FF}]/gu, "").trim()
	const parts = cleaned.split(" - ")

	return {
		scope: parts[0]?.trim() || "",
		role: parts[1]?.trim() || "",
		initials: getInitials(label),
	}
}
