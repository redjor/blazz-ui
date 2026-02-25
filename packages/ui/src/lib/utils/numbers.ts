/**
 * Number Utilities
 *
 * Common numeric operations found throughout the codebase:
 * - Clamping values (Math.max(0, value) pattern found in 6+ files)
 * - Rounding (.toFixed(2) pattern found in 30+ files)
 * - Percentage calculations
 * - Number formatting
 *
 * @example
 * ```typescript
 * import { clampMin, round, percentage } from './numbers'
 *
 * const clamped = clampMin(-5) // 0 (Math.max(0, -5))
 * const rounded = round(1.2349, 2) // 1.23
 * const percent = percentage(25, 100) // 25
 * ```
 */

/**
 * Clamp a number between a minimum and maximum value
 *
 * @param value - Value to clamp
 * @param min - Minimum allowed value
 * @param max - Maximum allowed value
 * @returns Clamped value
 *
 * @example
 * ```typescript
 * clamp(5, 0, 10) // 5
 * clamp(-5, 0, 10) // 0
 * clamp(15, 0, 10) // 10
 * ```
 */
export function clamp(value: number, min: number, max: number): number {
	return Math.min(Math.max(value, min), max)
}

/**
 * Clamp a number to a minimum value (common pattern: Math.max(0, value))
 *
 * @param value - Value to clamp
 * @param min - Minimum allowed value (defaults to 0)
 * @returns Value or minimum, whichever is greater
 *
 * @example
 * ```typescript
 * clampMin(-5) // 0
 * clampMin(5) // 5
 * clampMin(-5, 10) // 10
 * ```
 */
export function clampMin(value: number, min = 0): number {
	return Math.max(value, min)
}

/**
 * Clamp a number to a maximum value
 *
 * @param value - Value to clamp
 * @param max - Maximum allowed value
 * @returns Value or maximum, whichever is smaller
 *
 * @example
 * ```typescript
 * clampMax(15, 10) // 10
 * clampMax(5, 10) // 5
 * ```
 */
export function clampMax(value: number, max: number): number {
	return Math.min(value, max)
}

/**
 * Round a number to specified decimal places
 * Replaces common .toFixed(2) pattern
 *
 * @param value - Number to round
 * @param decimals - Number of decimal places (defaults to 2)
 * @returns Rounded number
 *
 * @example
 * ```typescript
 * round(1.2349) // 1.23
 * round(1.2349, 0) // 1
 * round(1.2349, 3) // 1.235
 * ```
 */
export function round(value: number, decimals = 2): number {
	const multiplier = 10 ** decimals
	return Math.round(value * multiplier) / multiplier
}

/**
 * Round down to specified decimal places
 *
 * @param value - Number to round down
 * @param decimals - Number of decimal places (defaults to 2)
 * @returns Rounded down number
 *
 * @example
 * ```typescript
 * roundDown(1.2389, 2) // 1.23
 * roundDown(1.99, 0) // 1
 * ```
 */
export function roundDown(value: number, decimals = 2): number {
	const multiplier = 10 ** decimals
	return Math.floor(value * multiplier) / multiplier
}

/**
 * Round up to specified decimal places
 *
 * @param value - Number to round up
 * @param decimals - Number of decimal places (defaults to 2)
 * @returns Rounded up number
 *
 * @example
 * ```typescript
 * roundUp(1.2311, 2) // 1.24
 * roundUp(1.01, 0) // 2
 * ```
 */
export function roundUp(value: number, decimals = 2): number {
	const multiplier = 10 ** decimals
	return Math.ceil(value * multiplier) / multiplier
}

/**
 * Calculate percentage of a value relative to total
 *
 * @param value - The value
 * @param total - The total
 * @param decimals - Number of decimal places (defaults to 2)
 * @returns Percentage (0-100)
 *
 * @example
 * ```typescript
 * percentage(25, 100) // 25
 * percentage(1, 3) // 33.33
 * percentage(0, 100) // 0
 * ```
 */
export function percentage(value: number, total: number, decimals = 2): number {
	if (total === 0) return 0
	return round((value / total) * 100, decimals)
}

/**
 * Calculate value from percentage
 *
 * @param percent - Percentage (0-100)
 * @param total - The total
 * @param decimals - Number of decimal places (defaults to 2)
 * @returns Calculated value
 *
 * @example
 * ```typescript
 * percentageOf(25, 100) // 25
 * percentageOf(10, 50) // 5
 * percentageOf(33.33, 100) // 33.33
 * ```
 */
export function percentageOf(percent: number, total: number, decimals = 2): number {
	return round((percent / 100) * total, decimals)
}

/**
 * Check if a number is within a range (inclusive)
 *
 * @param value - Value to check
 * @param min - Minimum value (inclusive)
 * @param max - Maximum value (inclusive)
 * @returns True if value is within range
 *
 * @example
 * ```typescript
 * inRange(5, 0, 10) // true
 * inRange(0, 0, 10) // true
 * inRange(10, 0, 10) // true
 * inRange(-1, 0, 10) // false
 * inRange(11, 0, 10) // false
 * ```
 */
export function inRange(value: number, min: number, max: number): boolean {
	return value >= min && value <= max
}

/**
 * Format a number with thousands separators
 *
 * @param value - Number to format
 * @param locale - BCP 47 locale string (defaults to 'fr-FR')
 * @returns Formatted number string
 *
 * @example
 * ```typescript
 * formatNumber(1234567.89) // "1 234 567,89" (fr-FR)
 * formatNumber(1234567.89, 'en-US') // "1,234,567.89"
 * ```
 */
export function formatNumber(value: number, locale: string = "fr-FR"): string {
	return new Intl.NumberFormat(locale).format(value)
}

/**
 * Format a number as compact notation (1K, 1M, etc.)
 *
 * @param value - Number to format
 * @param locale - BCP 47 locale string (defaults to 'fr-FR')
 * @returns Compact formatted number
 *
 * @example
 * ```typescript
 * formatCompact(1000) // "1 k"
 * formatCompact(1500000) // "1,5 M"
 * formatCompact(1234) // "1,2 k"
 * ```
 */
export function formatCompact(value: number, locale: string = "fr-FR"): string {
	return new Intl.NumberFormat(locale, {
		notation: "compact",
		maximumFractionDigits: 1,
	}).format(value)
}

/**
 * Check if a value is a valid number (not NaN, not Infinity)
 *
 * @param value - Value to check
 * @returns True if valid number
 *
 * @example
 * ```typescript
 * isValidNumber(123) // true
 * isValidNumber(NaN) // false
 * isValidNumber(Infinity) // false
 * isValidNumber('123') // false (type check)
 * ```
 */
export function isValidNumber(value: unknown): value is number {
	return typeof value === "number" && !Number.isNaN(value) && Number.isFinite(value)
}

/**
 * Calculate average of numbers
 *
 * @param numbers - Array of numbers
 * @param decimals - Number of decimal places (defaults to 2)
 * @returns Average or 0 if array is empty
 *
 * @example
 * ```typescript
 * average([1, 2, 3, 4, 5]) // 3
 * average([1.5, 2.5, 3.5]) // 2.5
 * average([]) // 0
 * ```
 */
export function average(numbers: number[], decimals = 2): number {
	if (numbers.length === 0) return 0
	const sum = numbers.reduce((acc, n) => acc + n, 0)
	return round(sum / numbers.length, decimals)
}

/**
 * Sum an array of numbers
 *
 * @param numbers - Array of numbers
 * @param decimals - Number of decimal places (defaults to 2)
 * @returns Sum of all numbers
 *
 * @example
 * ```typescript
 * sum([1, 2, 3, 4, 5]) // 15
 * sum([1.1, 2.2, 3.3]) // 6.6
 * sum([]) // 0
 * ```
 */
export function sum(numbers: number[], decimals = 2): number {
	const total = numbers.reduce((acc, n) => acc + n, 0)
	return round(total, decimals)
}

/**
 * Get minimum value from array
 *
 * @param numbers - Array of numbers
 * @returns Minimum value or undefined if array is empty
 *
 * @example
 * ```typescript
 * min([1, 2, 3]) // 1
 * min([]) // undefined
 * ```
 */
export function min(numbers: number[]): number | undefined {
	if (numbers.length === 0) return undefined
	return Math.min(...numbers)
}

/**
 * Get maximum value from array
 *
 * @param numbers - Array of numbers
 * @returns Maximum value or undefined if array is empty
 *
 * @example
 * ```typescript
 * max([1, 2, 3]) // 3
 * max([]) // undefined
 * ```
 */
export function max(numbers: number[]): number | undefined {
	if (numbers.length === 0) return undefined
	return Math.max(...numbers)
}

/**
 * Generate random integer between min and max (inclusive)
 *
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Random integer
 *
 * @example
 * ```typescript
 * randomInt(1, 10) // Random number between 1 and 10
 * randomInt(0, 1) // 0 or 1
 * ```
 */
export function randomInt(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Generate random float between min and max
 *
 * @param min - Minimum value
 * @param max - Maximum value
 * @param decimals - Number of decimal places (defaults to 2)
 * @returns Random float
 *
 * @example
 * ```typescript
 * randomFloat(0, 1) // Random number between 0 and 1
 * randomFloat(1.5, 2.5, 3) // Random number between 1.5 and 2.5 with 3 decimals
 * ```
 */
export function randomFloat(min: number, max: number, decimals = 2): number {
	return round(Math.random() * (max - min) + min, decimals)
}
