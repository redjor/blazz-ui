/**
 * Decide whether a doc should be embedded.
 * Returns { indexable: false, reason } when the doc should be skipped (agent noise, empty).
 */

const AGENT_MARKERS = [/\*Par (Marc|Léo|Leo|Sarah)\b/i, /\bDirecteur Financier\b/i, /\bTimekeeper\b/i, /\bProduct Lead\b/i]

const NOISE_TITLE_PATTERNS = [/^(traitement en cours|erreur dans la validation|correction\b|rectification|procédure correcte|rappel sur saisie|enregistrement dépense)/i]

export type IndexFilterResult = { indexable: true } | { indexable: false; reason: string }

export function shouldIndex(text: string, title?: string): IndexFilterResult {
	const trimmed = text.trim()
	if (trimmed.length < 10) return { indexable: false, reason: "too_short" }

	if (title) {
		for (const pat of NOISE_TITLE_PATTERNS) {
			if (pat.test(title.trim())) return { indexable: false, reason: "noise_title" }
		}
	}

	for (const pat of AGENT_MARKERS) {
		if (pat.test(text)) return { indexable: false, reason: "agent_generated" }
	}

	return { indexable: true }
}
