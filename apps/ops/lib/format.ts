export function formatMinutes(minutes: number): string {
	const h = Math.floor(minutes / 60)
	const m = minutes % 60
	return m > 0 ? `${h}h${m.toString().padStart(2, "0")}` : `${h}h`
}

export function formatCurrency(amount: number): string {
	return `€${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(Math.round(amount))}`
}
