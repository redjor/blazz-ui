/**
 * Unified Library Utilities - Central Export
 *
 * This file provides convenient re-exports of all utility modules.
 * Import from here for a cleaner import structure.
 *
 * @example
 * ```typescript
 * // Direct imports (specific)
 * import { formatCurrency } from '@/lib/utils/currency-unified'
 * import { round } from '@/lib/utils/numbers'
 *
 * // Or import from index (grouped)
 * import { formatCurrency, round } from '@/lib/utils'
 * ```
 */

// ============================================================
// New Unified Utilities (Recommended)
// ============================================================

// Array utilities
export {
  chunk,
  compact,
  compactAll,
  difference,
  drop,
  ensureArray,
  first,
  flatten,
  flattenDeep,
  groupBy,
  intersection,
  isEmpty as isArrayEmpty,
  isNotEmpty as isArrayNotEmpty,
  last,
  partition,
  sample,
  sampleSize,
  shuffle,
  take,
  union,
  unique,
  uniqueBy,
} from './arrays'

// Card utilities (unified)
export * from './cards-unified'
// Currency utilities (unified)
export * from './currency-unified'
// Number utilities
export * from './numbers'
// Object utilities
export {
  deepClone,
  deepMerge,
  entries,
  filterObject,
  fromEntries,
  get,
  hasKey,
  invert,
  isEmpty as isObjectEmpty,
  isEqual,
  isNotEmpty as isObjectNotEmpty,
  isPlainObject,
  keys,
  mapKeys,
  mapValues,
  merge,
  omit,
  pick,
  removeNull,
  removeNullish,
  removeUndefined,
  set,
  values,
} from './objects'
// Pricing utilities
export * from './pricing'
// Safe operation utilities
export {
  isValidEmail,
  isValidNumber as isSafeValidNumber,
  isValidUrl,
  safeAccess,
  safeArrayAccess,
  safeDivide,
  safeJsonParse,
  safeJsonStringify,
  safeParseBoolean,
  safeParseDate,
  safeParseFloat,
  safeParseInt,
  safeParseNumber,
  safeParseUrl,
  safeRegex,
  safeTry,
  safeTryAsync,
} from './safe'
// String utilities
export * from './strings'

// ============================================================
// Legacy Exports (For Backward Compatibility)
// ============================================================

export { cn } from './cn'
export { maskCardNumber } from './mask-card'

// Note: Legacy /lib/utils/mask-card.ts is kept for backward compatibility
// Prefer cards-unified.ts for new code
