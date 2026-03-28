/**
 * Object Utilities
 *
 * Common object operations found throughout the codebase:
 * - Object.keys/values/entries used in 32 instances across 18 files
 * - isEmpty checks
 * - pick/omit operations for object manipulation
 *
 * @example
 * ```typescript
 * import { isEmpty, pick, omit } from './objects'
 *
 * const empty = isEmpty({}) // true
 * const subset = pick({ a: 1, b: 2, c: 3 }, ['a', 'c']) // { a: 1, c: 3 }
 * const filtered = omit({ a: 1, b: 2, c: 3 }, ['b']) // { a: 1, c: 3 }
 * ```
 */

/**
 * Check if object is empty
 *
 * @param obj - Object to check
 * @returns True if object has no keys
 *
 * @example
 * ```typescript
 * isEmpty({}) // true
 * isEmpty({ a: 1 }) // false
 * isEmpty(null) // true
 * isEmpty(undefined) // true
 * ```
 */
export function isEmpty(obj: Record<string, unknown> | null | undefined): boolean {
	if (!obj) return true
	return Object.keys(obj).length === 0
}

/**
 * Check if object is not empty
 *
 * @param obj - Object to check
 * @returns True if object has keys
 *
 * @example
 * ```typescript
 * isNotEmpty({ a: 1 }) // true
 * isNotEmpty({}) // false
 * ```
 */
export function isNotEmpty(obj: Record<string, unknown> | null | undefined): boolean {
	return !isEmpty(obj)
}

/**
 * Pick specified keys from object
 *
 * @param obj - Source object
 * @param keys - Keys to pick
 * @returns New object with only specified keys
 *
 * @example
 * ```typescript
 * const user = { id: 1, name: 'Alice', email: 'alice@example.com' }
 * pick(user, ['id', 'name']) // { id: 1, name: 'Alice' }
 * ```
 */
export function pick<T extends Record<string, unknown>, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
	const result = {} as Pick<T, K>
	for (const key of keys) {
		if (key in obj) {
			result[key] = obj[key]
		}
	}
	return result
}

/**
 * Omit specified keys from object
 *
 * @param obj - Source object
 * @param keys - Keys to omit
 * @returns New object without specified keys
 *
 * @example
 * ```typescript
 * const user = { id: 1, name: 'Alice', password: 'secret' }
 * omit(user, ['password']) // { id: 1, name: 'Alice' }
 * ```
 */
export function omit<T extends Record<string, unknown>, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
	const result = { ...obj }
	for (const key of keys) {
		delete result[key]
	}
	return result as Omit<T, K>
}

/**
 * Get object keys with proper typing
 *
 * @param obj - Object to get keys from
 * @returns Array of keys
 *
 * @example
 * ```typescript
 * const obj = { a: 1, b: 2, c: 3 }
 * keys(obj) // ['a', 'b', 'c']
 * ```
 */
export function keys<T extends Record<string, unknown>>(obj: T): (keyof T)[] {
	return Object.keys(obj) as (keyof T)[]
}

/**
 * Get object values with proper typing
 *
 * @param obj - Object to get values from
 * @returns Array of values
 *
 * @example
 * ```typescript
 * const obj = { a: 1, b: 2, c: 3 }
 * values(obj) // [1, 2, 3]
 * ```
 */
export function values<T extends Record<string, unknown>>(obj: T): T[keyof T][] {
	return Object.values(obj) as T[keyof T][]
}

/**
 * Get object entries with proper typing
 *
 * @param obj - Object to get entries from
 * @returns Array of [key, value] tuples
 *
 * @example
 * ```typescript
 * const obj = { a: 1, b: 2 }
 * entries(obj) // [['a', 1], ['b', 2]]
 * ```
 */
export function entries<T extends Record<string, unknown>>(obj: T): [keyof T, T[keyof T]][] {
	return Object.entries(obj) as [keyof T, T[keyof T]][]
}

/**
 * Create object from entries
 *
 * @param entries - Array of [key, value] tuples
 * @returns Object created from entries
 *
 * @example
 * ```typescript
 * fromEntries([['a', 1], ['b', 2]]) // { a: 1, b: 2 }
 * ```
 */
export function fromEntries<K extends string | number | symbol, V>(entries: [K, V][]): Record<K, V> {
	return Object.fromEntries(entries) as Record<K, V>
}

/**
 * Check if object has specified key
 *
 * @param obj - Object to check
 * @param key - Key to look for
 * @returns True if key exists
 *
 * @example
 * ```typescript
 * hasKey({ a: 1, b: 2 }, 'a') // true
 * hasKey({ a: 1 }, 'b') // false
 * ```
 */
export function hasKey<T extends Record<string, unknown>>(obj: T, key: string | number | symbol): key is keyof T {
	return key in obj
}

/**
 * Deep clone an object
 *
 * @param obj - Object to clone
 * @returns Deep cloned object
 *
 * @example
 * ```typescript
 * const original = { a: { b: 1 } }
 * const clone = deepClone(original)
 * clone.a.b = 2
 * console.log(original.a.b) // Still 1
 * ```
 */
export function deepClone<T>(obj: T): T {
	return JSON.parse(JSON.stringify(obj))
}

/**
 * Merge multiple objects (shallow merge)
 *
 * @param objects - Objects to merge
 * @returns Merged object
 *
 * @example
 * ```typescript
 * merge({ a: 1 }, { b: 2 }, { c: 3 }) // { a: 1, b: 2, c: 3 }
 * merge({ a: 1 }, { a: 2 }) // { a: 2 } (last value wins)
 * ```
 */
export function merge<T extends Record<string, unknown>>(...objects: Partial<T>[]): T {
	return Object.assign({}, ...objects) as T
}

/**
 * Deep merge objects (nested merge)
 *
 * @param target - Target object
 * @param source - Source object
 * @returns Deeply merged object
 *
 * @example
 * ```typescript
 * const target = { a: { b: 1, c: 2 } }
 * const source = { a: { b: 3, d: 4 } }
 * deepMerge(target, source) // { a: { b: 3, c: 2, d: 4 } }
 * ```
 */
export function deepMerge<T extends Record<string, unknown>>(target: T, source: Partial<T>): T {
	const result = { ...target }

	for (const key in source) {
		const sourceValue = source[key]
		const targetValue = result[key]

		if (isPlainObject(sourceValue) && isPlainObject(targetValue)) {
			result[key] = deepMerge(targetValue as Record<string, unknown>, sourceValue as Record<string, unknown>) as T[Extract<keyof T, string>]
		} else {
			result[key] = sourceValue as T[Extract<keyof T, string>]
		}
	}

	return result
}

/**
 * Check if value is a plain object
 *
 * @param value - Value to check
 * @returns True if plain object
 *
 * @example
 * ```typescript
 * isPlainObject({}) // true
 * isPlainObject({ a: 1 }) // true
 * isPlainObject([]) // false
 * isPlainObject(null) // false
 * isPlainObject(new Date()) // false
 * ```
 */
export function isPlainObject(value: unknown): value is Record<string, unknown> {
	if (typeof value !== "object" || value === null) {
		return false
	}

	const prototype = Object.getPrototypeOf(value)
	return prototype === null || prototype === Object.prototype
}

/**
 * Map object values
 *
 * @param obj - Object to map
 * @param fn - Mapping function
 * @returns New object with mapped values
 *
 * @example
 * ```typescript
 * const obj = { a: 1, b: 2, c: 3 }
 * mapValues(obj, v => v * 2) // { a: 2, b: 4, c: 6 }
 * ```
 */
export function mapValues<T extends Record<string, unknown>, R>(obj: T, fn: (value: T[keyof T], key: keyof T) => R): Record<keyof T, R> {
	const result = {} as Record<keyof T, R>
	for (const key in obj) {
		result[key] = fn(obj[key], key)
	}
	return result
}

/**
 * Map object keys
 *
 * @param obj - Object to map
 * @param fn - Mapping function
 * @returns New object with mapped keys
 *
 * @example
 * ```typescript
 * const obj = { a: 1, b: 2 }
 * mapKeys(obj, k => k.toUpperCase()) // { A: 1, B: 2 }
 * ```
 */
export function mapKeys<T extends Record<string, unknown>>(obj: T, fn: (key: keyof T) => string): Record<string, T[keyof T]> {
	const result: Record<string, T[keyof T]> = {}
	for (const key in obj) {
		result[fn(key)] = obj[key]
	}
	return result
}

/**
 * Filter object by predicate
 *
 * @param obj - Object to filter
 * @param predicate - Filter function
 * @returns Filtered object
 *
 * @example
 * ```typescript
 * const obj = { a: 1, b: 2, c: 3 }
 * filterObject(obj, v => v > 1) // { b: 2, c: 3 }
 * ```
 */
export function filterObject<T extends Record<string, unknown>>(obj: T, predicate: (value: T[keyof T], key: keyof T) => boolean): Partial<T> {
	const result = {} as Partial<T>
	for (const key in obj) {
		if (predicate(obj[key], key)) {
			result[key] = obj[key]
		}
	}
	return result
}

/**
 * Get nested value safely
 *
 * @param obj - Object to get value from
 * @param path - Path to value (dot notation or array)
 * @param defaultValue - Default value if path not found
 * @returns Value at path or default
 *
 * @example
 * ```typescript
 * const obj = { user: { name: 'Alice', address: { city: 'Paris' } } }
 * get(obj, 'user.name') // 'Alice'
 * get(obj, 'user.address.city') // 'Paris'
 * get(obj, 'user.age', 25) // 25 (default)
 * get(obj, ['user', 'name']) // 'Alice'
 * ```
 */
export function get<T>(obj: Record<string, unknown>, path: string | string[], defaultValue?: T): T | undefined {
	const keys = Array.isArray(path) ? path : path.split(".")
	let result: unknown = obj

	for (const key of keys) {
		if (result && typeof result === "object" && key in result) {
			result = (result as Record<string, unknown>)[key]
		} else {
			return defaultValue
		}
	}

	return result as T
}

/**
 * Set nested value
 *
 * @param obj - Object to set value in
 * @param path - Path to value (dot notation or array)
 * @param value - Value to set
 * @returns Modified object
 *
 * @example
 * ```typescript
 * const obj = { user: { name: 'Alice' } }
 * set(obj, 'user.age', 25)
 * // { user: { name: 'Alice', age: 25 } }
 * ```
 */
export function set<T>(obj: Record<string, unknown>, path: string | string[], value: T): Record<string, unknown> {
	const keys = Array.isArray(path) ? path : path.split(".")
	const lastKey = keys.pop()

	if (!lastKey) return obj

	let current = obj
	for (const key of keys) {
		if (!(key in current) || typeof current[key] !== "object") {
			current[key] = {}
		}
		current = current[key] as Record<string, unknown>
	}

	current[lastKey] = value
	return obj
}

/**
 * Check if two objects are equal (shallow comparison)
 *
 * @param obj1 - First object
 * @param obj2 - Second object
 * @returns True if objects are equal
 *
 * @example
 * ```typescript
 * isEqual({ a: 1, b: 2 }, { a: 1, b: 2 }) // true
 * isEqual({ a: 1 }, { a: 2 }) // false
 * ```
 */
export function isEqual(obj1: Record<string, unknown>, obj2: Record<string, unknown>): boolean {
	const keys1 = Object.keys(obj1)
	const keys2 = Object.keys(obj2)

	if (keys1.length !== keys2.length) return false

	for (const key of keys1) {
		if (obj1[key] !== obj2[key]) return false
	}

	return true
}

/**
 * Remove keys with undefined values
 *
 * @param obj - Object to clean
 * @returns Object without undefined values
 *
 * @example
 * ```typescript
 * removeUndefined({ a: 1, b: undefined, c: 3 }) // { a: 1, c: 3 }
 * ```
 */
export function removeUndefined<T extends Record<string, unknown>>(obj: T): Partial<T> {
	return filterObject(obj, (value) => value !== undefined)
}

/**
 * Remove keys with null values
 *
 * @param obj - Object to clean
 * @returns Object without null values
 *
 * @example
 * ```typescript
 * removeNull({ a: 1, b: null, c: 3 }) // { a: 1, c: 3 }
 * ```
 */
export function removeNull<T extends Record<string, unknown>>(obj: T): Partial<T> {
	return filterObject(obj, (value) => value !== null)
}

/**
 * Remove keys with null or undefined values
 *
 * @param obj - Object to clean
 * @returns Object without null/undefined values
 *
 * @example
 * ```typescript
 * removeNullish({ a: 1, b: null, c: undefined, d: 4 }) // { a: 1, d: 4 }
 * ```
 */
export function removeNullish<T extends Record<string, unknown>>(obj: T): Partial<T> {
	return filterObject(obj, (value) => value != null)
}

/**
 * Invert object (swap keys and values)
 *
 * @param obj - Object to invert
 * @returns Inverted object
 *
 * @example
 * ```typescript
 * invert({ a: 'x', b: 'y' }) // { x: 'a', y: 'b' }
 * ```
 */
export function invert<T extends Record<string, string | number>>(obj: T): Record<string, keyof T> {
	const result: Record<string, keyof T> = {}
	for (const key in obj) {
		result[String(obj[key])] = key
	}
	return result
}
