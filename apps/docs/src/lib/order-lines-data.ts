export interface OrderLine {
	id: string
	articleName: string
	articleRef: string
	articleVariant?: string
	sku: string
	ean: string
	type: "UNIT" | "PACK" | "PALLET" | "VRAC"
	quantity: number
	unitPriceHT: number
	vatRate: number
	totalHT: number
	totalTTC: number
	inStock: boolean
}

function round2(n: number): number {
	return Math.round(n * 100) / 100
}

function line(
	id: string,
	articleName: string,
	articleRef: string,
	sku: string,
	ean: string,
	type: OrderLine["type"],
	quantity: number,
	unitPriceHT: number,
	vatRate: number,
	inStock: boolean,
	articleVariant?: string
): OrderLine {
	const totalHT = round2(quantity * unitPriceHT)
	const totalTTC = round2(totalHT * (1 + vatRate / 100))
	return {
		id,
		articleName,
		articleRef,
		articleVariant,
		sku,
		ean,
		type,
		quantity,
		unitPriceHT,
		vatRate,
		totalHT,
		totalTTC,
		inStock,
	}
}

export const orderLines: OrderLine[] = [
	line("ol-001", "Coca-Cola 33cl", "ART-1001", "SKU-CC33", "5449000000996", "PACK", 48, 0.45, 5.5, true, "Pack 24"),
	line("ol-002", "Evian 1.5L", "ART-1002", "SKU-EV15", "3068320011127", "PACK", 60, 0.38, 5.5, true, "Pack 6"),
	line("ol-003", "Pain de mie Harry's", "ART-1003", "SKU-PM01", "3228021170039", "UNIT", 30, 1.85, 5.5, true),
	line("ol-004", "Nutella 750g", "ART-1004", "SKU-NT75", "3017620422003", "UNIT", 24, 4.25, 5.5, true),
	line("ol-005", "Papier A4 Clairefontaine", "ART-2001", "SKU-PA4C", "3329680932508", "PACK", 10, 6.9, 20, true, "Ramette 500 feuilles"),
	line("ol-006", "Stylo Bic Cristal bleu", "ART-2002", "SKU-SBC1", "3086123100015", "PACK", 20, 3.5, 20, true, "Lot de 10"),
	line("ol-007", "Eau de Javel Lacroix 2L", "ART-2003", "SKU-JVL2", "3014880080136", "UNIT", 36, 1.65, 20, false),
	line("ol-008", "Beurre Président 250g", "ART-1005", "SKU-BP25", "3228020480015", "UNIT", 40, 2.1, 5.5, true),
	line("ol-009", "Riz Basmati Taureau Ailé 1kg", "ART-1006", "SKU-RB1K", "3252920026760", "UNIT", 18, 2.35, 5.5, false),
	line("ol-010", "Sac poubelle 100L", "ART-2004", "SKU-SP10", "3178041320078", "PACK", 15, 8.9, 20, true, "Rouleau 20"),
	line("ol-011", "Orangina 1.5L", "ART-1007", "SKU-OR15", "3249390002016", "PACK", 36, 0.95, 5.5, true, "Pack 6"),
	line("ol-012", "Café Carte Noire 250g", "ART-1008", "SKU-CN25", "7622210148100", "UNIT", 50, 3.75, 5.5, false),
	line("ol-013", "Essuie-tout Okay", "ART-2005", "SKU-ET02", "3133200000000", "PACK", 24, 4.2, 20, true, "Lot de 6"),
	line("ol-014", "Huile d'olive Puget 75cl", "ART-1009", "SKU-HO75", "3292590201006", "UNIT", 12, 5.9, 5.5, true),
	line("ol-015", "Farine Francine T45 1kg", "ART-1010", "SKU-FT45", "3012360010002", "PALLET", 200, 0.95, 5.5, false, "Palette 200"),
]
