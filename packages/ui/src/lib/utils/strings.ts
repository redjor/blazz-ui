/**
 * String Utilities
 *
 * Common string operations for text manipulation, formatting, and validation.
 *
 * @example
 * ```typescript
 * import { capitalize, truncate, slugify } from './strings'
 *
 * const name = capitalize('john doe') // 'John doe'
 * const short = truncate('Long text...', 10) // 'Long text...'
 * const slug = slugify('Hello World!') // 'hello-world'
 * ```
 */

/**
 * Capitalize first letter of string
 *
 * @param str - String to capitalize
 * @returns String with first letter capitalized
 *
 * @example
 * ```typescript
 * capitalize('hello') // 'Hello'
 * capitalize('HELLO') // 'HELLO'
 * capitalize('') // ''
 * ```
 */
export function capitalize(str: string): string {
	if (!str) return str
	return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Capitalize first letter of each word
 *
 * @param str - String to capitalize
 * @returns String with each word capitalized
 *
 * @example
 * ```typescript
 * capitalizeWords('hello world') // 'Hello World'
 * capitalizeWords('jean-claude') // 'Jean-Claude'
 * ```
 */
export function capitalizeWords(str: string): string {
	return str.replace(/\b\w/g, (char) => char.toUpperCase())
}

/**
 * Convert string to lowercase
 *
 * @param str - String to convert
 * @returns Lowercase string
 *
 * @example
 * ```typescript
 * lowercase('HELLO') // 'hello'
 * ```
 */
export function lowercase(str: string): string {
	return str.toLowerCase()
}

/**
 * Convert string to uppercase
 *
 * @param str - String to convert
 * @returns Uppercase string
 *
 * @example
 * ```typescript
 * uppercase('hello') // 'HELLO'
 * ```
 */
export function uppercase(str: string): string {
	return str.toUpperCase()
}

/**
 * Truncate string to specified length
 *
 * @param str - String to truncate
 * @param length - Maximum length
 * @param suffix - Suffix to add when truncated (defaults to '...')
 * @returns Truncated string
 *
 * @example
 * ```typescript
 * truncate('Hello world', 8) // 'Hello...'
 * truncate('Hello world', 8, '…') // 'Hello w…'
 * truncate('Short', 10) // 'Short'
 * ```
 */
export function truncate(str: string, length: number, suffix: string = "..."): string {
	if (str.length <= length) return str
	return str.slice(0, length - suffix.length) + suffix
}

/**
 * Truncate string at word boundary
 *
 * @param str - String to truncate
 * @param length - Maximum length
 * @param suffix - Suffix to add when truncated (defaults to '...')
 * @returns Truncated string at word boundary
 *
 * @example
 * ```typescript
 * truncateWords('Hello world example', 12) // 'Hello world...'
 * truncateWords('Short', 10) // 'Short'
 * ```
 */
export function truncateWords(str: string, length: number, suffix: string = "..."): string {
	if (str.length <= length) return str

	const truncated = str.slice(0, length - suffix.length)
	const lastSpace = truncated.lastIndexOf(" ")

	if (lastSpace > 0) {
		return truncated.slice(0, lastSpace) + suffix
	}

	return truncated + suffix
}

/**
 * Convert string to URL-friendly slug
 *
 * @param str - String to slugify
 * @returns URL-friendly slug
 *
 * @example
 * ```typescript
 * slugify('Hello World!') // 'hello-world'
 * slugify('Café Français') // 'cafe-francais'
 * slugify('  Multiple   Spaces  ') // 'multiple-spaces'
 * ```
 */
export function slugify(str: string): string {
	return str
		.normalize("NFD") // Normalize unicode characters
		.replace(/[\u0300-\u036f]/g, "") // Remove diacritics
		.toLowerCase()
		.trim()
		.replace(/[^\w\s-]/g, "") // Remove non-word chars (except spaces and hyphens)
		.replace(/[\s_-]+/g, "-") // Replace spaces, underscores with single hyphen
		.replace(/^-+|-+$/g, "") // Remove leading/trailing hyphens
}

/**
 * Normalize whitespace (collapse multiple spaces, trim)
 *
 * @param str - String to normalize
 * @returns String with normalized whitespace
 *
 * @example
 * ```typescript
 * normalizeWhitespace('  Hello   World  ') // 'Hello World'
 * normalizeWhitespace('Multiple\n\nLines') // 'Multiple Lines'
 * ```
 */
export function normalizeWhitespace(str: string): string {
	return str.replace(/\s+/g, " ").trim()
}

/**
 * Remove all whitespace from string
 *
 * @param str - String to process
 * @returns String without whitespace
 *
 * @example
 * ```typescript
 * removeWhitespace('Hello World') // 'HelloWorld'
 * removeWhitespace('  a b c  ') // 'abc'
 * ```
 */
export function removeWhitespace(str: string): string {
	return str.replace(/\s/g, "")
}

/**
 * Pad string to specified length on the left
 *
 * @param str - String to pad
 * @param length - Target length
 * @param padChar - Character to pad with (defaults to space)
 * @returns Padded string
 *
 * @example
 * ```typescript
 * padLeft('5', 3, '0') // '005'
 * padLeft('abc', 5) // '  abc'
 * ```
 */
export function padLeft(str: string, length: number, padChar: string = " "): string {
	return str.padStart(length, padChar)
}

/**
 * Pad string to specified length on the right
 *
 * @param str - String to pad
 * @param length - Target length
 * @param padChar - Character to pad with (defaults to space)
 * @returns Padded string
 *
 * @example
 * ```typescript
 * padRight('5', 3, '0') // '500'
 * padRight('abc', 5) // 'abc  '
 * ```
 */
export function padRight(str: string, length: number, padChar: string = " "): string {
	return str.padEnd(length, padChar)
}

/**
 * Check if string starts with prefix (case-insensitive option)
 *
 * @param str - String to check
 * @param prefix - Prefix to look for
 * @param ignoreCase - Ignore case (defaults to false)
 * @returns True if string starts with prefix
 *
 * @example
 * ```typescript
 * startsWith('Hello World', 'Hello') // true
 * startsWith('Hello World', 'hello', true) // true
 * startsWith('Hello World', 'World') // false
 * ```
 */
export function startsWith(str: string, prefix: string, ignoreCase = false): boolean {
	if (ignoreCase) {
		return str.toLowerCase().startsWith(prefix.toLowerCase())
	}
	return str.startsWith(prefix)
}

/**
 * Check if string ends with suffix (case-insensitive option)
 *
 * @param str - String to check
 * @param suffix - Suffix to look for
 * @param ignoreCase - Ignore case (defaults to false)
 * @returns True if string ends with suffix
 *
 * @example
 * ```typescript
 * endsWith('Hello World', 'World') // true
 * endsWith('Hello World', 'world', true) // true
 * endsWith('Hello World', 'Hello') // false
 * ```
 */
export function endsWith(str: string, suffix: string, ignoreCase = false): boolean {
	if (ignoreCase) {
		return str.toLowerCase().endsWith(suffix.toLowerCase())
	}
	return str.endsWith(suffix)
}

/**
 * Check if string contains substring (case-insensitive option)
 *
 * @param str - String to check
 * @param substring - Substring to look for
 * @param ignoreCase - Ignore case (defaults to false)
 * @returns True if string contains substring
 *
 * @example
 * ```typescript
 * contains('Hello World', 'World') // true
 * contains('Hello World', 'world', true) // true
 * contains('Hello World', 'xyz') // false
 * ```
 */
export function contains(str: string, substring: string, ignoreCase = false): boolean {
	if (ignoreCase) {
		return str.toLowerCase().includes(substring.toLowerCase())
	}
	return str.includes(substring)
}

/**
 * Reverse a string
 *
 * @param str - String to reverse
 * @returns Reversed string
 *
 * @example
 * ```typescript
 * reverse('hello') // 'olleh'
 * reverse('12345') // '54321'
 * ```
 */
export function reverse(str: string): string {
	return str.split("").reverse().join("")
}

/**
 * Repeat string n times
 *
 * @param str - String to repeat
 * @param times - Number of times to repeat
 * @returns Repeated string
 *
 * @example
 * ```typescript
 * repeat('ab', 3) // 'ababab'
 * repeat('-', 5) // '-----'
 * ```
 */
export function repeat(str: string, times: number): string {
	return str.repeat(times)
}

/**
 * Count occurrences of substring in string
 *
 * @param str - String to search in
 * @param substring - Substring to count
 * @param ignoreCase - Ignore case (defaults to false)
 * @returns Number of occurrences
 *
 * @example
 * ```typescript
 * countOccurrences('hello world', 'o') // 2
 * countOccurrences('Hello World', 'o', true) // 2
 * ```
 */
export function countOccurrences(str: string, substring: string, ignoreCase = false): number {
	const searchStr = ignoreCase ? str.toLowerCase() : str
	const searchSubstr = ignoreCase ? substring.toLowerCase() : substring
	return (searchStr.match(new RegExp(searchSubstr, "g")) || []).length
}

/**
 * Replace all occurrences of search string with replacement
 *
 * @param str - String to search in
 * @param search - String to search for
 * @param replacement - Replacement string
 * @returns String with replacements
 *
 * @example
 * ```typescript
 * replaceAll('hello world', 'o', '0') // 'hell0 w0rld'
 * ```
 */
export function replaceAll(str: string, search: string, replacement: string): string {
	return str.replace(new RegExp(search, "g"), replacement)
}

/**
 * Check if string is empty or only whitespace
 *
 * @param str - String to check
 * @returns True if empty or whitespace
 *
 * @example
 * ```typescript
 * isBlank('') // true
 * isBlank('   ') // true
 * isBlank('hello') // false
 * ```
 */
export function isBlank(str: string): boolean {
	return str.trim().length === 0
}

/**
 * Check if string is not empty and not only whitespace
 *
 * @param str - String to check
 * @returns True if not blank
 *
 * @example
 * ```typescript
 * isNotBlank('hello') // true
 * isNotBlank('   ') // false
 * isNotBlank('') // false
 * ```
 */
export function isNotBlank(str: string): boolean {
	return str.trim().length > 0
}

/**
 * Extract initials from name
 *
 * @param name - Full name
 * @param maxInitials - Maximum number of initials (defaults to 2)
 * @returns Initials
 *
 * @example
 * ```typescript
 * getInitials('John Doe') // 'JD'
 * getInitials('Jean-Claude Van Damme', 3) // 'JCV'
 * getInitials('Alice') // 'A'
 * ```
 */
export function getInitials(name: string, maxInitials = 2): string {
	return name
		.split(/\s+/)
		.filter(Boolean)
		.slice(0, maxInitials)
		.map((word) => word.charAt(0).toUpperCase())
		.join("")
}

/**
 * Mask sensitive string (e.g., email, phone)
 *
 * @param str - String to mask
 * @param visibleStart - Number of visible characters at start (defaults to 2)
 * @param visibleEnd - Number of visible characters at end (defaults to 2)
 * @param maskChar - Character to use for masking (defaults to '*')
 * @returns Masked string
 *
 * @example
 * ```typescript
 * mask('john@example.com') // 'jo**************om'
 * mask('1234567890', 3, 3) // '123****890'
 * mask('secret', 0, 0, 'x') // 'xxxxxx'
 * ```
 */
export function mask(str: string, visibleStart = 2, visibleEnd = 2, maskChar = "*"): string {
	if (str.length <= visibleStart + visibleEnd) return str

	const start = str.slice(0, visibleStart)
	const end = str.slice(-visibleEnd)
	const masked = maskChar.repeat(str.length - visibleStart - visibleEnd)

	return start + masked + end
}

/**
 * Mask email address
 *
 * @param email - Email to mask
 * @returns Masked email
 *
 * @example
 * ```typescript
 * maskEmail('john.doe@example.com') // 'jo*****e@example.com'
 * ```
 */
export function maskEmail(email: string): string {
	const [localPart, domain] = email.split("@")
	if (!domain) return email

	const maskedLocal = mask(localPart, 2, 1)
	return `${maskedLocal}@${domain}`
}

/**
 * Convert string to camelCase
 *
 * @param str - String to convert
 * @returns camelCase string
 *
 * @example
 * ```typescript
 * camelCase('hello world') // 'helloWorld'
 * camelCase('hello-world') // 'helloWorld'
 * camelCase('hello_world') // 'helloWorld'
 * ```
 */
export function camelCase(str: string): string {
	return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, char) => char.toUpperCase())
}

/**
 * Convert string to PascalCase
 *
 * @param str - String to convert
 * @returns PascalCase string
 *
 * @example
 * ```typescript
 * pascalCase('hello world') // 'HelloWorld'
 * pascalCase('hello-world') // 'HelloWorld'
 * ```
 */
export function pascalCase(str: string): string {
	const camel = camelCase(str)
	return capitalize(camel)
}

/**
 * Convert string to snake_case
 *
 * @param str - String to convert
 * @returns snake_case string
 *
 * @example
 * ```typescript
 * snakeCase('helloWorld') // 'hello_world'
 * snakeCase('Hello World') // 'hello_world'
 * ```
 */
export function snakeCase(str: string): string {
	return str
		.replace(/([A-Z])/g, "_$1")
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "_")
		.replace(/^_|_$/g, "")
}

/**
 * Convert string to kebab-case
 *
 * @param str - String to convert
 * @returns kebab-case string
 *
 * @example
 * ```typescript
 * kebabCase('helloWorld') // 'hello-world'
 * kebabCase('Hello World') // 'hello-world'
 * ```
 */
export function kebabCase(str: string): string {
	return str
		.replace(/([A-Z])/g, "-$1")
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "")
}
