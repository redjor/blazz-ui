/**
 * Array Utilities
 *
 * Common array operations found throughout the codebase:
 * - Array.isArray() checks (found in 31+ files)
 * - .filter(Boolean) pattern for removing falsy values
 * - Uniqueness operations
 * - Grouping operations
 *
 * @example
 * ```typescript
 * import { ensureArray, compact, unique } from '@/lib/utils/arrays'
 *
 * const arr = ensureArray('value') // ['value']
 * const clean = compact([1, null, 2, undefined, 3]) // [1, 2, 3]
 * const uniq = unique([1, 2, 2, 3, 3]) // [1, 2, 3]
 * ```
 */

/**
 * Ensure a value is an array
 * Common pattern to handle both single values and arrays
 *
 * @param value - Value or array of values
 * @returns Array
 *
 * @example
 * ```typescript
 * ensureArray('value') // ['value']
 * ensureArray(['a', 'b']) // ['a', 'b']
 * ensureArray(undefined) // []
 * ensureArray(null) // []
 * ```
 */
export function ensureArray<T>(value: T | T[] | null | undefined): T[] {
  if (value === null || value === undefined) return []
  return Array.isArray(value) ? value : [value]
}

/**
 * Remove null and undefined values from array
 * Replaces .filter(Boolean) pattern but preserves falsy values like 0, '', false
 *
 * @param arr - Array with potential null/undefined values
 * @returns Array with null/undefined removed
 *
 * @example
 * ```typescript
 * compact([1, null, 2, undefined, 3]) // [1, 2, 3]
 * compact([0, false, '', null]) // [0, false, '']
 * compact(['a', undefined, 'b']) // ['a', 'b']
 * ```
 */
export function compact<T>(arr: (T | null | undefined)[]): T[] {
  return arr.filter((item): item is T => item !== null && item !== undefined)
}

/**
 * Remove all falsy values from array
 * True replacement for .filter(Boolean)
 *
 * @param arr - Array with potential falsy values
 * @returns Array with falsy values removed
 *
 * @example
 * ```typescript
 * compactAll([1, 0, 2, false, 3, '', null]) // [1, 2, 3]
 * compactAll(['a', '', 'b', undefined]) // ['a', 'b']
 * ```
 */
export function compactAll<T>(arr: T[]): NonNullable<T>[] {
  return arr.filter(Boolean) as NonNullable<T>[]
}

/**
 * Get unique values from array
 *
 * @param arr - Array with potential duplicates
 * @returns Array with unique values
 *
 * @example
 * ```typescript
 * unique([1, 2, 2, 3, 3, 3]) // [1, 2, 3]
 * unique(['a', 'b', 'a', 'c']) // ['a', 'b', 'c']
 * ```
 */
export function unique<T>(arr: T[]): T[] {
  return Array.from(new Set(arr))
}

/**
 * Get unique values by a key or selector function
 *
 * @param arr - Array of objects
 * @param selector - Key or function to determine uniqueness
 * @returns Array with unique values based on selector
 *
 * @example
 * ```typescript
 * const users = [
 *   { id: 1, name: 'Alice' },
 *   { id: 2, name: 'Bob' },
 *   { id: 1, name: 'Alice Duplicate' }
 * ]
 * uniqueBy(users, 'id') // [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]
 * uniqueBy(users, u => u.id) // Same result
 * ```
 */
export function uniqueBy<T>(
  arr: T[],
  selector: keyof T | ((item: T) => unknown)
): T[] {
  const seen = new Set()
  const getValue =
    typeof selector === 'function' ? selector : (item: T) => item[selector]

  return arr.filter(item => {
    const key = getValue(item)
    if (seen.has(key)) {
      return false
    }
    seen.add(key)
    return true
  })
}

/**
 * Group array items by a key or selector function
 *
 * @param arr - Array to group
 * @param selector - Key or function to group by
 * @returns Object with grouped items
 *
 * @example
 * ```typescript
 * const users = [
 *   { role: 'admin', name: 'Alice' },
 *   { role: 'user', name: 'Bob' },
 *   { role: 'admin', name: 'Charlie' }
 * ]
 * groupBy(users, 'role')
 * // {
 * //   admin: [{ role: 'admin', name: 'Alice' }, { role: 'admin', name: 'Charlie' }],
 * //   user: [{ role: 'user', name: 'Bob' }]
 * // }
 * ```
 */
export function groupBy<T>(
  arr: T[],
  selector: keyof T | ((item: T) => string | number)
): Record<string, T[]> {
  const getValue =
    typeof selector === 'function'
      ? selector
      : (item: T) => String(item[selector])

  return arr.reduce(
    (groups, item) => {
      const key = String(getValue(item))
      if (!groups[key]) {
        groups[key] = []
      }
      groups[key].push(item)
      return groups
    },
    {} as Record<string, T[]>
  )
}

/**
 * Chunk array into smaller arrays of specified size
 *
 * @param arr - Array to chunk
 * @param size - Size of each chunk
 * @returns Array of chunks
 *
 * @example
 * ```typescript
 * chunk([1, 2, 3, 4, 5], 2) // [[1, 2], [3, 4], [5]]
 * chunk(['a', 'b', 'c'], 2) // [['a', 'b'], ['c']]
 * ```
 */
export function chunk<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size))
  }
  return chunks
}

/**
 * Flatten nested array one level deep
 *
 * @param arr - Nested array
 * @returns Flattened array
 *
 * @example
 * ```typescript
 * flatten([[1, 2], [3, 4]]) // [1, 2, 3, 4]
 * flatten([['a'], ['b', 'c']]) // ['a', 'b', 'c']
 * ```
 */
export function flatten<T>(arr: T[][]): T[] {
  return arr.flat()
}

/**
 * Flatten deeply nested array
 *
 * @param arr - Deeply nested array
 * @returns Flattened array
 *
 * @example
 * ```typescript
 * flattenDeep([1, [2, [3, [4]]]]) // [1, 2, 3, 4]
 * flattenDeep([[['a']], ['b', ['c']]]) // ['a', 'b', 'c']
 * ```
 */
export function flattenDeep<T>(arr: unknown[]): T[] {
  return arr.flat(Infinity) as T[]
}

/**
 * Get first element of array
 *
 * @param arr - Array
 * @returns First element or undefined
 *
 * @example
 * ```typescript
 * first([1, 2, 3]) // 1
 * first([]) // undefined
 * ```
 */
export function first<T>(arr: T[]): T | undefined {
  return arr[0]
}

/**
 * Get last element of array
 *
 * @param arr - Array
 * @returns Last element or undefined
 *
 * @example
 * ```typescript
 * last([1, 2, 3]) // 3
 * last([]) // undefined
 * ```
 */
export function last<T>(arr: T[]): T | undefined {
  return arr[arr.length - 1]
}

/**
 * Take first n elements from array
 *
 * @param arr - Array
 * @param n - Number of elements to take
 * @returns Array with first n elements
 *
 * @example
 * ```typescript
 * take([1, 2, 3, 4, 5], 3) // [1, 2, 3]
 * take(['a', 'b', 'c'], 2) // ['a', 'b']
 * ```
 */
export function take<T>(arr: T[], n: number): T[] {
  return arr.slice(0, n)
}

/**
 * Drop first n elements from array
 *
 * @param arr - Array
 * @param n - Number of elements to drop
 * @returns Array without first n elements
 *
 * @example
 * ```typescript
 * drop([1, 2, 3, 4, 5], 2) // [3, 4, 5]
 * drop(['a', 'b', 'c'], 1) // ['b', 'c']
 * ```
 */
export function drop<T>(arr: T[], n: number): T[] {
  return arr.slice(n)
}

/**
 * Check if array is empty
 *
 * @param arr - Array to check
 * @returns True if array is empty
 *
 * @example
 * ```typescript
 * isEmpty([]) // true
 * isEmpty([1, 2]) // false
 * ```
 */
export function isEmpty<T>(arr: T[]): boolean {
  return arr.length === 0
}

/**
 * Check if array is not empty
 *
 * @param arr - Array to check
 * @returns True if array has elements
 *
 * @example
 * ```typescript
 * isNotEmpty([1, 2]) // true
 * isNotEmpty([]) // false
 * ```
 */
export function isNotEmpty<T>(arr: T[]): boolean {
  return arr.length > 0
}

/**
 * Partition array into two arrays based on predicate
 *
 * @param arr - Array to partition
 * @param predicate - Function to test elements
 * @returns Tuple of [matching, non-matching] arrays
 *
 * @example
 * ```typescript
 * const [evens, odds] = partition([1, 2, 3, 4, 5], n => n % 2 === 0)
 * // evens: [2, 4]
 * // odds: [1, 3, 5]
 * ```
 */
export function partition<T>(
  arr: T[],
  predicate: (item: T) => boolean
): [T[], T[]] {
  const matches: T[] = []
  const nonMatches: T[] = []

  for (const item of arr) {
    if (predicate(item)) {
      matches.push(item)
    } else {
      nonMatches.push(item)
    }
  }

  return [matches, nonMatches]
}

/**
 * Find difference between two arrays
 *
 * @param arr1 - First array
 * @param arr2 - Second array
 * @returns Elements in arr1 that are not in arr2
 *
 * @example
 * ```typescript
 * difference([1, 2, 3], [2, 3, 4]) // [1]
 * difference(['a', 'b', 'c'], ['b']) // ['a', 'c']
 * ```
 */
export function difference<T>(arr1: T[], arr2: T[]): T[] {
  const set2 = new Set(arr2)
  return arr1.filter(item => !set2.has(item))
}

/**
 * Find intersection of two arrays
 *
 * @param arr1 - First array
 * @param arr2 - Second array
 * @returns Elements present in both arrays
 *
 * @example
 * ```typescript
 * intersection([1, 2, 3], [2, 3, 4]) // [2, 3]
 * intersection(['a', 'b', 'c'], ['b', 'c', 'd']) // ['b', 'c']
 * ```
 */
export function intersection<T>(arr1: T[], arr2: T[]): T[] {
  const set2 = new Set(arr2)
  return unique(arr1.filter(item => set2.has(item)))
}

/**
 * Find union of two arrays (all unique elements from both)
 *
 * @param arr1 - First array
 * @param arr2 - Second array
 * @returns All unique elements from both arrays
 *
 * @example
 * ```typescript
 * union([1, 2, 3], [2, 3, 4]) // [1, 2, 3, 4]
 * union(['a', 'b'], ['b', 'c']) // ['a', 'b', 'c']
 * ```
 */
export function union<T>(arr1: T[], arr2: T[]): T[] {
  return unique(arr1.concat(arr2))
}

/**
 * Shuffle array (Fisher-Yates algorithm)
 *
 * @param arr - Array to shuffle
 * @returns New shuffled array (does not mutate original)
 *
 * @example
 * ```typescript
 * shuffle([1, 2, 3, 4, 5]) // Random order, e.g., [3, 1, 5, 2, 4]
 * ```
 */
export function shuffle<T>(arr: T[]): T[] {
  const result = arr.slice()
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = result[i]
    result[i] = result[j]
    result[j] = temp
  }
  return result
}

/**
 * Sample random element from array
 *
 * @param arr - Array to sample from
 * @returns Random element or undefined if array is empty
 *
 * @example
 * ```typescript
 * sample([1, 2, 3, 4, 5]) // Random element, e.g., 3
 * sample([]) // undefined
 * ```
 */
export function sample<T>(arr: T[]): T | undefined {
  if (arr.length === 0) return undefined
  return arr[Math.floor(Math.random() * arr.length)]
}

/**
 * Sample n random elements from array
 *
 * @param arr - Array to sample from
 * @param n - Number of elements to sample
 * @returns Array of n random elements
 *
 * @example
 * ```typescript
 * sampleSize([1, 2, 3, 4, 5], 3) // Random 3 elements, e.g., [2, 5, 1]
 * ```
 */
export function sampleSize<T>(arr: T[], n: number): T[] {
  return shuffle(arr).slice(0, n)
}
