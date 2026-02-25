/**
 * Unified Currency Utilities
 *
 * Consolidates currency formatting and symbol utilities from:
 * - /lib/utils/currency.ts
 * - /lib/formatters/currency.ts
 *
 * This provides a single source of truth for currency operations.
 *
 * @example
 * ```typescript
 * import { formatCurrency, getCurrencySymbol } from './currency-unified'
 *
 * const formatted = formatCurrency(1234.56, 'EUR') // "1 234,56 €"
 * const symbol = getCurrencySymbol('USD') // "$"
 * ```
 */

/**
 * Extended currency symbol mapping
 * Combines symbols from both original implementations
 */
const CURRENCY_SYMBOLS: Record<string, string> = {
	EUR: "€",
	USD: "$",
	GBP: "£",
	CHF: "CHF",
	JPY: "¥",
	CNY: "¥",
	CAD: "CAD",
	AUD: "AUD",
} as const

/**
 * Get the symbol for a currency code
 *
 * @param currencyCode - ISO 4217 currency code (e.g., 'EUR', 'USD')
 * @returns Currency symbol or the code itself if not found
 *
 * @example
 * ```typescript
 * getCurrencySymbol('EUR') // '€'
 * getCurrencySymbol('USD') // '$'
 * getCurrencySymbol('XYZ') // 'XYZ' (fallback)
 * ```
 */
export function getCurrencySymbol(currencyCode: string): string {
	const normalized = currencyCode.toUpperCase()
	return CURRENCY_SYMBOLS[normalized] || currencyCode
}

/**
 * Format an amount with currency using Intl.NumberFormat
 *
 * @param amount - The numeric amount to format
 * @param currency - ISO 4217 currency code (e.g., 'EUR', 'USD')
 * @param locale - BCP 47 locale string (defaults to 'fr-FR')
 * @returns Formatted currency string
 *
 * @example
 * ```typescript
 * formatCurrency(1234.56, 'EUR') // "1 234,56 €"
 * formatCurrency(1234.56, 'USD', 'en-US') // "$1,234.56"
 * formatCurrency(1234.56, 'GBP', 'en-GB') // "£1,234.56"
 * ```
 */
export function formatCurrency(amount: number, currency: string, locale: string = "fr-FR"): string {
	try {
		return new Intl.NumberFormat(locale, {
			style: "currency",
			currency: currency.toUpperCase(),
		}).format(amount)
	} catch {
		// Fallback if Intl.NumberFormat fails (invalid currency/locale)
		return `${amount.toFixed(2)} ${getCurrencySymbol(currency)}`
	}
}

/**
 * Get formatted currency with custom options
 *
 * @param amount - The numeric amount to format
 * @param currency - ISO 4217 currency code
 * @param options - Intl.NumberFormatOptions for customization
 * @param locale - BCP 47 locale string (defaults to 'fr-FR')
 * @returns Formatted currency string
 *
 * @example
 * ```typescript
 * // No decimals
 * formatCurrencyAdvanced(1234.56, 'EUR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
 * // "1 235 €"
 *
 * // Always show sign
 * formatCurrencyAdvanced(1234.56, 'EUR', { signDisplay: 'always' })
 * // "+1 234,56 €"
 * ```
 */
export function formatCurrencyAdvanced(
	amount: number,
	currency: string,
	options: Intl.NumberFormatOptions = {},
	locale: string = "fr-FR"
): string {
	try {
		return new Intl.NumberFormat(locale, {
			style: "currency",
			currency: currency.toUpperCase(),
			...options,
		}).format(amount)
	} catch {
		return `${amount.toFixed(2)} ${getCurrencySymbol(currency)}`
	}
}

/**
 * Parse a currency string to a number
 * Removes currency symbols and normalizes decimal separators
 *
 * @param currencyString - Currency string to parse (e.g., "1 234,56 €")
 * @returns Parsed number or null if invalid
 *
 * @example
 * ```typescript
 * parseCurrency("1 234,56 €") // 1234.56
 * parseCurrency("$1,234.56") // 1234.56
 * parseCurrency("invalid") // null
 * ```
 */
export function parseCurrency(currencyString: string): number | null {
	// Remove all non-digit characters except comma and dot
	const cleaned = currencyString.replace(/[^\d,.-]/g, "")

	// Replace comma with dot for parsing (handles French format)
	const normalized = cleaned.replace(/,/g, ".")

	const parsed = parseFloat(normalized)

	return Number.isNaN(parsed) ? null : parsed
}

/**
 * Check if a string is a valid currency code
 *
 * @param code - String to validate
 * @returns True if valid currency code
 *
 * @example
 * ```typescript
 * isValidCurrencyCode('EUR') // true
 * isValidCurrencyCode('USD') // true
 * isValidCurrencyCode('XYZ') // false
 * ```
 */
export function isValidCurrencyCode(code: string): boolean {
	const normalized = code.toUpperCase()
	return normalized in CURRENCY_SYMBOLS
}

/**
 * Get all supported currency codes
 *
 * @returns Array of supported currency codes
 *
 * @example
 * ```typescript
 * getSupportedCurrencies() // ['EUR', 'USD', 'GBP', ...]
 * ```
 */
export function getSupportedCurrencies(): string[] {
	return Object.keys(CURRENCY_SYMBOLS)
}
