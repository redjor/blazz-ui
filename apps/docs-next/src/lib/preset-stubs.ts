// Stub preset creators — presets were removed from @blazz/pro
// TODO: Recreate as local docs examples with inline data

// biome-ignore lint/suspicious/noExplicitAny: stub
type AnyPreset = { columns: any[]; data: any[]; views?: any[]; actions?: any[] }

function emptyPreset(): AnyPreset {
	return { columns: [], data: [], views: [], actions: [] }
}

// biome-ignore lint/suspicious/noExplicitAny: stub
export function createCompaniesPreset(_opts?: any): AnyPreset {
	return emptyPreset()
}
// biome-ignore lint/suspicious/noExplicitAny: stub
export function createContactsPreset(_opts?: any): AnyPreset {
	return emptyPreset()
}
// biome-ignore lint/suspicious/noExplicitAny: stub
export function createDealsPreset(_opts?: any): AnyPreset {
	return emptyPreset()
}
// biome-ignore lint/suspicious/noExplicitAny: stub
export function createEditableDealsPreset(_opts?: any): AnyPreset {
	return emptyPreset()
}
// biome-ignore lint/suspicious/noExplicitAny: stub
export function createProductsPreset(_opts?: any): AnyPreset {
	return emptyPreset()
}
// biome-ignore lint/suspicious/noExplicitAny: stub
export function createQuotesPreset(_opts?: any): AnyPreset {
	return emptyPreset()
}
// biome-ignore lint/suspicious/noExplicitAny: stub
export function createLinearIssuesPreset(_opts?: any): AnyPreset {
	return emptyPreset()
}
// biome-ignore lint/suspicious/noExplicitAny: stub
export function createOrderLinesPreset(_opts?: any): AnyPreset {
	return emptyPreset()
}
// biome-ignore lint/suspicious/noExplicitAny: stub
export const orderLinesColumns: any[] = []
// biome-ignore lint/suspicious/noExplicitAny: stub
export const sampleOrderLines: any[] = []
