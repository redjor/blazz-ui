/**
 * Maps CRM route segments to their French section labels.
 */
const sectionLabels: Record<string, string> = {
	dashboard: "Tableau de bord",
	companies: "Entreprises",
	contacts: "Contacts",
	deals: "Pipeline",
	quotes: "Devis",
	products: "Produits",
	reports: "Rapports",
	settings: "Paramètres",
}

/**
 * Derives a smart tab title from a CRM pathname.
 *
 * - List pages (/products) → "Produits"
 * - Detail pages (/products/123) → "123" (pages override via useTabTitle)
 * - New pages (/products/new) → "Nouveau"
 * - Dashboard (/dashboard) → "Tableau de bord"
 */
export function titleFromPathname(pathname: string): string {
	const segments = pathname.split("/").filter(Boolean)
	const section = segments[0] || "dashboard"
	const label = sectionLabels[section] || section.charAt(0).toUpperCase() + section.slice(1)

	if (segments.length <= 1) {
		return label
	}

	if (segments[1] === "new") {
		return "Nouveau"
	}

	return segments[1]
}
