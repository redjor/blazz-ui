/**
 * Safe Operation Utilities
 *
 * Safe wrappers for common parsing operations that can throw errors.
 * Promotes use of existing safeJsonParse from validation.ts and extends
 * the concept to other parsing operations.
 *
 * @example
 * ```typescript
 * import { safeJsonParse, safeParseInt, safeParseFloat } from './safe'
 *
 * const obj = safeJsonParse<User>('{"name":"Alice"}') // { name: "Alice" }
 * const num = safeParseInt('123', 0) // 123
 * const invalid = safeParseInt('abc', 0) // 0 (fallback)
 * ```
 */

/**
 * Safe JSON parse
 * Returns null or fallback on error instead of throwing
 *
 * NOTE: This is also available in /lib/validation.ts as safeJsonParse
 * This version adds support for a custom fallback value.
 *
 * @param json - JSON string to parse
 * @param fallback - Fallback value if parse fails (defaults to null)
 * @returns Parsed object or fallback
 *
 * @example
 * ```typescript
 * safeJsonParse<User>('{"name":"Alice"}') // { name: "Alice" }
 * safeJsonParse<User>('invalid') // null
 * safeJsonParse<User>('invalid', { name: 'Default' }) // { name: 'Default' }
 * ```
 */
export function safeJsonParse<T>(json: string, fallback: T | null = null): T | null {
	try {
		return JSON.parse(json) as T
	} catch {
		return fallback
	}
}

/**
 * Safe JSON stringify
 * Returns null or fallback on error instead of throwing
 *
 * @param value - Value to stringify
 * @param fallback - Fallback value if stringify fails (defaults to null)
 * @returns JSON string or fallback
 *
 * @example
 * ```typescript
 * safeJsonStringify({ name: 'Alice' }) // '{"name":"Alice"}'
 * safeJsonStringify(circularObj) // null (circular reference)
 * safeJsonStringify(circularObj, '{}') // '{}'
 * ```
 */
export function safeJsonStringify<T>(value: T, fallback: string | null = null): string | null {
	try {
		return JSON.stringify(value)
	} catch {
		return fallback
	}
}

/**
 * Safe parse integer with fallback
 * Replaces pattern of parseInt() with error handling
 *
 * @param value - String to parse
 * @param fallback - Fallback value if parse fails (defaults to 0)
 * @param radix - Radix for parsing (defaults to 10)
 * @returns Parsed integer or fallback
 *
 * @example
 * ```typescript
 * safeParseInt('123') // 123
 * safeParseInt('abc') // 0
 * safeParseInt('abc', -1) // -1
 * safeParseInt('ff', 0, 16) // 255 (hexadecimal)
 * safeParseInt('invalid', 0, 16) // 0
 * ```
 */
export function safeParseInt(value: string | number, fallback = 0, radix = 10): number {
	if (typeof value === "number") {
		return Number.isInteger(value) ? value : Math.floor(value)
	}

	const parsed = parseInt(value, radix)
	return Number.isNaN(parsed) ? fallback : parsed
}

/**
 * Safe parse float with fallback
 * Replaces pattern of parseFloat() with error handling
 *
 * @param value - String to parse
 * @param fallback - Fallback value if parse fails (defaults to 0)
 * @returns Parsed float or fallback
 *
 * @example
 * ```typescript
 * safeParseFloat('123.45') // 123.45
 * safeParseFloat('abc') // 0
 * safeParseFloat('abc', -1) // -1
 * safeParseFloat('1.23e+2') // 123
 * ```
 */
export function safeParseFloat(value: string | number, fallback = 0): number {
	if (typeof value === "number") {
		return value
	}

	const parsed = parseFloat(value)
	return Number.isNaN(parsed) ? fallback : parsed
}

/**
 * Safe parse number (tries parseFloat, falls back on error)
 *
 * @param value - String to parse
 * @param fallback - Fallback value if parse fails (defaults to 0)
 * @returns Parsed number or fallback
 *
 * @example
 * ```typescript
 * safeParseNumber('123.45') // 123.45
 * safeParseNumber('123') // 123
 * safeParseNumber('abc') // 0
 * ```
 */
export function safeParseNumber(value: string | number, fallback = 0): number {
	return safeParseFloat(value, fallback)
}

/**
 * Safe parse boolean
 * Handles various truthy/falsy string representations
 *
 * @param value - String to parse
 * @param fallback - Fallback value if parse fails (defaults to false)
 * @returns Parsed boolean or fallback
 *
 * @example
 * ```typescript
 * safeParseBoolean('true') // true
 * safeParseBoolean('1') // true
 * safeParseBoolean('yes') // true
 * safeParseBoolean('false') // false
 * safeParseBoolean('0') // false
 * safeParseBoolean('no') // false
 * safeParseBoolean('invalid') // false (fallback)
 * ```
 */
export function safeParseBoolean(value: string | boolean, fallback = false): boolean {
	if (typeof value === "boolean") {
		return value
	}

	const normalized = value.toLowerCase().trim()

	// Truthy values
	if (["true", "1", "yes", "on", "y"].includes(normalized)) {
		return true
	}

	// Falsy values
	if (["false", "0", "no", "off", "n"].includes(normalized)) {
		return false
	}

	return fallback
}

/**
 * Safe parse date
 * Returns null or fallback on invalid date
 *
 * @param value - String or Date to parse
 * @param fallback - Fallback value if parse fails (defaults to null)
 * @returns Parsed Date or fallback
 *
 * @example
 * ```typescript
 * safeParseDate('2024-01-15') // Date object
 * safeParseDate('invalid') // null
 * safeParseDate('invalid', new Date()) // Current date
 * ```
 */
export function safeParseDate(value: string | Date, fallback: Date | null = null): Date | null {
	if (value instanceof Date) {
		return Number.isNaN(value.getTime()) ? fallback : value
	}

	try {
		const date = new Date(value)
		return Number.isNaN(date.getTime()) ? fallback : date
	} catch {
		return fallback
	}
}

/**
 * Safe array access (no out of bounds errors)
 *
 * @param arr - Array to access
 * @param index - Index to access
 * @param fallback - Fallback value if index out of bounds
 * @returns Value at index or fallback
 *
 * @example
 * ```typescript
 * safeArrayAccess([1, 2, 3], 1) // 2
 * safeArrayAccess([1, 2, 3], 10) // undefined
 * safeArrayAccess([1, 2, 3], 10, 0) // 0
 * safeArrayAccess([1, 2, 3], -1) // undefined
 * ```
 */
export function safeArrayAccess<T>(arr: T[], index: number, fallback?: T): T | undefined {
	if (index < 0 || index >= arr.length) {
		return fallback
	}
	return arr[index]
}

/**
 * Safe object property access with path
 * Similar to lodash's _.get()
 *
 * @param obj - Object to access
 * @param path - Path to property (dot notation)
 * @param fallback - Fallback value if path not found
 * @returns Value at path or fallback
 *
 * @example
 * ```typescript
 * const obj = { user: { name: 'Alice', address: { city: 'Paris' } } }
 * safeAccess(obj, 'user.name') // 'Alice'
 * safeAccess(obj, 'user.address.city') // 'Paris'
 * safeAccess(obj, 'user.age', 25) // 25 (fallback)
 * safeAccess(obj, 'invalid.path') // undefined
 * ```
 */
export function safeAccess<T>(obj: unknown, path: string, fallback?: T): T | undefined {
	if (!obj || typeof obj !== "object") {
		return fallback
	}

	const keys = path.split(".")
	let current: unknown = obj

	for (const key of keys) {
		if (current && typeof current === "object" && key in current) {
			current = (current as Record<string, unknown>)[key]
		} else {
			return fallback
		}
	}

	return current as T
}

/**
 * Safe division (avoid division by zero)
 *
 * @param numerator - Numerator
 * @param denominator - Denominator
 * @param fallback - Fallback value if denominator is 0 (defaults to 0)
 * @returns Result of division or fallback
 *
 * @example
 * ```typescript
 * safeDivide(10, 2) // 5
 * safeDivide(10, 0) // 0 (fallback)
 * safeDivide(10, 0, Infinity) // Infinity
 * ```
 */
export function safeDivide(numerator: number, denominator: number, fallback = 0): number {
	if (denominator === 0) {
		return fallback
	}
	return numerator / denominator
}

/**
 * Safe function execution with error handling
 *
 * @param fn - Function to execute
 * @param fallback - Fallback value if function throws
 * @returns Result of function or fallback
 *
 * @example
 * ```typescript
 * safeTry(() => JSON.parse('{"valid": true}')) // { valid: true }
 * safeTry(() => JSON.parse('invalid'), {}) // {}
 * safeTry(() => riskyOperation(), null) // null if throws
 * ```
 */
export function safeTry<T>(fn: () => T, fallback: T): T {
	try {
		return fn()
	} catch {
		return fallback
	}
}

/**
 * Safe async function execution with error handling
 *
 * @param fn - Async function to execute
 * @param fallback - Fallback value if function throws
 * @returns Promise with result or fallback
 *
 * @example
 * ```typescript
 * await safeTryAsync(async () => await fetchUser(), null)
 * // Returns user or null if fetch fails
 * ```
 */
export async function safeTryAsync<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
	try {
		return await fn()
	} catch {
		return fallback
	}
}

/**
 * Safe parse URL
 * Returns null on invalid URL instead of throwing
 *
 * @param urlString - URL string to parse
 * @param fallback - Fallback value if parse fails
 * @returns Parsed URL object or fallback
 *
 * @example
 * ```typescript
 * safeParseUrl('https://example.com') // URL object
 * safeParseUrl('invalid') // null
 * ```
 */
export function safeParseUrl(urlString: string, fallback: URL | null = null): URL | null {
	try {
		return new URL(urlString)
	} catch {
		return fallback
	}
}

/**
 * Safe regex execution
 * Returns null on error instead of throwing
 *
 * @param pattern - Regex pattern
 * @param flags - Regex flags
 * @returns RegExp object or null
 *
 * @example
 * ```typescript
 * safeRegex('\\d+', 'g') // /\d+/g
 * safeRegex('[invalid', 'g') // null
 * ```
 */
export function safeRegex(pattern: string, flags?: string): RegExp | null {
	try {
		return new RegExp(pattern, flags)
	} catch {
		return null
	}
}

/**
 * Safe email validation
 * Returns true if valid email format
 *
 * @param email - Email string to validate
 * @returns True if valid email format
 *
 * @example
 * ```typescript
 * isValidEmail('user@example.com') // true
 * isValidEmail('invalid') // false
 * ```
 */
export function isValidEmail(email: string): boolean {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
	return emailRegex.test(email)
}

/**
 * Safe URL validation
 * Returns true if valid URL format
 *
 * @param url - URL string to validate
 * @returns True if valid URL
 *
 * @example
 * ```typescript
 * isValidUrl('https://example.com') // true
 * isValidUrl('invalid') // false
 * ```
 */
export function isValidUrl(url: string): boolean {
	return safeParseUrl(url) !== null
}

/**
 * Safe number validation
 * Returns true if valid finite number
 *
 * @param value - Value to check
 * @returns True if valid number
 *
 * @example
 * ```typescript
 * isValidNumber(123) // true
 * isValidNumber(NaN) // false
 * isValidNumber(Infinity) // false
 * ```
 */
export function isValidNumber(value: unknown): value is number {
	return typeof value === "number" && !Number.isNaN(value) && Number.isFinite(value)
}
