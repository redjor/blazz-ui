/**
 * Extrait les initiales d'un label de compte de test
 * Supporte les emojis et les formats "Scope - Role"
 *
 * @example
 * getInitials("🌍 Global - Directeur") // "GD"
 * getInitials("👑 Superadmin") // "SU"
 */
export function getInitials(label: string): string {
	// Enlever emojis avec regex Unicode
	const cleaned = label.replace(/[\u{1F300}-\u{1F9FF}]/gu, "").trim()

	// Split par espaces ou tirets
	const words = cleaned.split(/[\s-]+/).filter(Boolean)

	if (words.length >= 2) {
		return (words[0][0] + words[1][0]).toUpperCase()
	}

	return cleaned.slice(0, 2).toUpperCase()
}
