/**
 * Pricing Utilities
 *
 * Utilities for price calculations, discounts, taxes, and formatting.
 * Addresses the common .toFixed(2) pattern found in 30+ files.
 *
 * @example
 * ```typescript
 * import { formatPrice, calculateDiscount, calculateTax } from '@/lib/utils/pricing'
 *
 * const price = formatPrice(1234.567) // "1234.57"
 * const discounted = calculateDiscount(100, 20, 'percentage') // 80
 * const withTax = calculateTax(100, 20) // 120
 * ```
 */

import { round } from './numbers'

/**
 * Discount type
 */
export type DiscountType = 'percentage' | 'fixed'

/**
 * Format price to fixed decimal places (replaces .toFixed(2) pattern)
 *
 * @param amount - Amount to format
 * @param decimals - Number of decimal places (defaults to 2)
 * @returns Formatted price as string
 *
 * @example
 * ```typescript
 * formatPrice(1234.567) // "1234.57"
 * formatPrice(1234.5, 0) // "1235"
 * formatPrice(1234.5, 3) // "1234.500"
 * ```
 */
export function formatPrice(amount: number, decimals = 2): string {
  return amount.toFixed(decimals)
}

/**
 * Parse price string to number
 *
 * @param priceString - Price string to parse
 * @returns Parsed number or null if invalid
 *
 * @example
 * ```typescript
 * parsePrice("1234.56") // 1234.56
 * parsePrice("1 234,56") // 1234.56 (handles French format)
 * parsePrice("invalid") // null
 * ```
 */
export function parsePrice(priceString: string): number | null {
  // Remove spaces and replace comma with dot
  const cleaned = priceString.replace(/\s/g, '').replace(',', '.')
  const parsed = parseFloat(cleaned)
  return Number.isNaN(parsed) ? null : parsed
}

/**
 * Calculate percentage discount
 *
 * @param amount - Original amount
 * @param percent - Discount percentage (0-100)
 * @param decimals - Number of decimal places (defaults to 2)
 * @returns Amount after discount
 *
 * @example
 * ```typescript
 * calculatePercentage(100, 20) // 20
 * calculatePercentage(150, 10) // 15
 * calculatePercentage(99.99, 15) // 15
 * ```
 */
export function calculatePercentage(
  amount: number,
  percent: number,
  decimals = 2
): number {
  return round((amount * percent) / 100, decimals)
}

/**
 * Calculate discount amount and final price
 *
 * @param amount - Original amount
 * @param discount - Discount value (percentage or fixed amount)
 * @param type - Discount type ('percentage' or 'fixed')
 * @param decimals - Number of decimal places (defaults to 2)
 * @returns Final amount after discount
 *
 * @example
 * ```typescript
 * calculateDiscount(100, 20, 'percentage') // 80
 * calculateDiscount(100, 20, 'fixed') // 80
 * calculateDiscount(150, 10, 'percentage') // 135
 * calculateDiscount(150, 10, 'fixed') // 140
 * ```
 */
export function calculateDiscount(
  amount: number,
  discount: number,
  type: DiscountType = 'percentage',
  decimals = 2
): number {
  if (type === 'percentage') {
    const discountAmount = calculatePercentage(amount, discount, decimals)
    return round(amount - discountAmount, decimals)
  }

  // Fixed discount
  return round(Math.max(0, amount - discount), decimals)
}

/**
 * Calculate discount details (amount and percentage)
 *
 * @param originalPrice - Original price
 * @param discountedPrice - Discounted price
 * @param decimals - Number of decimal places (defaults to 2)
 * @returns Discount amount and percentage
 *
 * @example
 * ```typescript
 * getDiscountDetails(100, 80)
 * // { amount: 20, percentage: 20 }
 *
 * getDiscountDetails(150, 135)
 * // { amount: 15, percentage: 10 }
 * ```
 */
export function getDiscountDetails(
  originalPrice: number,
  discountedPrice: number,
  decimals = 2
): { amount: number; percentage: number } {
  const amount = round(originalPrice - discountedPrice, decimals)
  const percentage =
    originalPrice > 0 ? round((amount / originalPrice) * 100, decimals) : 0

  return { amount, percentage }
}

/**
 * Calculate tax amount
 *
 * @param amount - Amount before tax
 * @param taxRate - Tax rate percentage (e.g., 20 for 20%)
 * @param decimals - Number of decimal places (defaults to 2)
 * @returns Tax amount
 *
 * @example
 * ```typescript
 * calculateTax(100, 20) // 20
 * calculateTax(150, 5.5) // 8.25
 * ```
 */
export function calculateTax(
  amount: number,
  taxRate: number,
  decimals = 2
): number {
  return calculatePercentage(amount, taxRate, decimals)
}

/**
 * Calculate price including tax
 *
 * @param amountExcludingTax - Amount before tax
 * @param taxRate - Tax rate percentage
 * @param decimals - Number of decimal places (defaults to 2)
 * @returns Amount including tax
 *
 * @example
 * ```typescript
 * addTax(100, 20) // 120
 * addTax(150, 5.5) // 158.25
 * ```
 */
export function addTax(
  amountExcludingTax: number,
  taxRate: number,
  decimals = 2
): number {
  const tax = calculateTax(amountExcludingTax, taxRate, decimals)
  return round(amountExcludingTax + tax, decimals)
}

/**
 * Calculate price excluding tax (from price including tax)
 *
 * @param amountIncludingTax - Amount including tax
 * @param taxRate - Tax rate percentage
 * @param decimals - Number of decimal places (defaults to 2)
 * @returns Amount excluding tax
 *
 * @example
 * ```typescript
 * removeTax(120, 20) // 100
 * removeTax(158.25, 5.5) // 150
 * ```
 */
export function removeTax(
  amountIncludingTax: number,
  taxRate: number,
  decimals = 2
): number {
  return round(amountIncludingTax / (1 + taxRate / 100), decimals)
}

/**
 * Calculate price breakdown (subtotal, tax, total)
 *
 * @param items - Array of items with price and quantity
 * @param taxRate - Tax rate percentage
 * @param decimals - Number of decimal places (defaults to 2)
 * @returns Price breakdown
 *
 * @example
 * ```typescript
 * const items = [
 *   { price: 10, quantity: 2 },
 *   { price: 15, quantity: 1 }
 * ]
 * calculatePriceBreakdown(items, 20)
 * // {
 * //   subtotal: 35,
 * //   tax: 7,
 * //   total: 42
 * // }
 * ```
 */
export function calculatePriceBreakdown(
  items: Array<{ price: number; quantity: number }>,
  taxRate: number,
  decimals = 2
): { subtotal: number; tax: number; total: number } {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )
  const tax = calculateTax(subtotal, taxRate, decimals)
  const total = round(subtotal + tax, decimals)

  return {
    subtotal: round(subtotal, decimals),
    tax,
    total,
  }
}

/**
 * Calculate unit price from total and quantity
 *
 * @param totalPrice - Total price
 * @param quantity - Quantity
 * @param decimals - Number of decimal places (defaults to 2)
 * @returns Unit price
 *
 * @example
 * ```typescript
 * calculateUnitPrice(100, 5) // 20
 * calculateUnitPrice(99.99, 3) // 33.33
 * ```
 */
export function calculateUnitPrice(
  totalPrice: number,
  quantity: number,
  decimals = 2
): number {
  if (quantity === 0) return 0
  return round(totalPrice / quantity, decimals)
}

/**
 * Calculate total price from unit price and quantity
 *
 * @param unitPrice - Unit price
 * @param quantity - Quantity
 * @param decimals - Number of decimal places (defaults to 2)
 * @returns Total price
 *
 * @example
 * ```typescript
 * calculateTotalPrice(20, 5) // 100
 * calculateTotalPrice(33.33, 3) // 99.99
 * ```
 */
export function calculateTotalPrice(
  unitPrice: number,
  quantity: number,
  decimals = 2
): number {
  return round(unitPrice * quantity, decimals)
}

/**
 * Calculate margin percentage
 *
 * @param sellingPrice - Selling price
 * @param costPrice - Cost price
 * @param decimals - Number of decimal places (defaults to 2)
 * @returns Margin percentage
 *
 * @example
 * ```typescript
 * calculateMargin(150, 100) // 33.33
 * calculateMargin(200, 100) // 50
 * ```
 */
export function calculateMargin(
  sellingPrice: number,
  costPrice: number,
  decimals = 2
): number {
  if (sellingPrice === 0) return 0
  return round(((sellingPrice - costPrice) / sellingPrice) * 100, decimals)
}

/**
 * Calculate markup percentage
 *
 * @param sellingPrice - Selling price
 * @param costPrice - Cost price
 * @param decimals - Number of decimal places (defaults to 2)
 * @returns Markup percentage
 *
 * @example
 * ```typescript
 * calculateMarkup(150, 100) // 50
 * calculateMarkup(200, 100) // 100
 * ```
 */
export function calculateMarkup(
  sellingPrice: number,
  costPrice: number,
  decimals = 2
): number {
  if (costPrice === 0) return 0
  return round(((sellingPrice - costPrice) / costPrice) * 100, decimals)
}

/**
 * Calculate price from cost and desired margin
 *
 * @param costPrice - Cost price
 * @param marginPercentage - Desired margin percentage
 * @param decimals - Number of decimal places (defaults to 2)
 * @returns Selling price
 *
 * @example
 * ```typescript
 * calculatePriceFromMargin(100, 33.33) // 149.99
 * calculatePriceFromMargin(100, 50) // 200
 * ```
 */
export function calculatePriceFromMargin(
  costPrice: number,
  marginPercentage: number,
  decimals = 2
): number {
  return round(costPrice / (1 - marginPercentage / 100), decimals)
}

/**
 * Calculate price from cost and desired markup
 *
 * @param costPrice - Cost price
 * @param markupPercentage - Desired markup percentage
 * @param decimals - Number of decimal places (defaults to 2)
 * @returns Selling price
 *
 * @example
 * ```typescript
 * calculatePriceFromMarkup(100, 50) // 150
 * calculatePriceFromMarkup(100, 100) // 200
 * ```
 */
export function calculatePriceFromMarkup(
  costPrice: number,
  markupPercentage: number,
  decimals = 2
): number {
  return round(costPrice * (1 + markupPercentage / 100), decimals)
}

/**
 * Compare prices and return difference
 *
 * @param price1 - First price
 * @param price2 - Second price
 * @param decimals - Number of decimal places (defaults to 2)
 * @returns Price comparison result
 *
 * @example
 * ```typescript
 * comparePrices(120, 100)
 * // {
 * //   difference: 20,
 * //   percentageDifference: 20,
 * //   isHigher: true
 * // }
 * ```
 */
export function comparePrices(
  price1: number,
  price2: number,
  decimals = 2
): {
  difference: number
  percentageDifference: number
  isHigher: boolean
} {
  const difference = round(price1 - price2, decimals)
  const percentageDifference =
    price2 > 0 ? round((difference / price2) * 100, decimals) : 0

  return {
    difference,
    percentageDifference,
    isHigher: price1 > price2,
  }
}

/**
 * Calculate average price from array of prices
 *
 * @param prices - Array of prices
 * @param decimals - Number of decimal places (defaults to 2)
 * @returns Average price
 *
 * @example
 * ```typescript
 * averagePrice([100, 150, 200]) // 150
 * averagePrice([10.5, 20.5, 30.5]) // 20.5
 * ```
 */
export function averagePrice(prices: number[], decimals = 2): number {
  if (prices.length === 0) return 0
  const sum = prices.reduce((acc, price) => acc + price, 0)
  return round(sum / prices.length, decimals)
}

/**
 * Apply multiple discounts sequentially
 *
 * @param amount - Original amount
 * @param discounts - Array of discounts to apply
 * @param decimals - Number of decimal places (defaults to 2)
 * @returns Final amount after all discounts
 *
 * @example
 * ```typescript
 * applyMultipleDiscounts(100, [
 *   { value: 10, type: 'percentage' },
 *   { value: 5, type: 'fixed' }
 * ])
 * // 100 - 10% = 90, 90 - 5 = 85
 * ```
 */
export function applyMultipleDiscounts(
  amount: number,
  discounts: Array<{ value: number; type: DiscountType }>,
  decimals = 2
): number {
  let finalAmount = amount

  for (const discount of discounts) {
    finalAmount = calculateDiscount(
      finalAmount,
      discount.value,
      discount.type,
      decimals
    )
  }

  return finalAmount
}

/**
 * Check if price is within budget
 *
 * @param price - Price to check
 * @param budget - Budget limit
 * @returns True if within budget
 *
 * @example
 * ```typescript
 * isWithinBudget(100, 150) // true
 * isWithinBudget(200, 150) // false
 * ```
 */
export function isWithinBudget(price: number, budget: number): boolean {
  return price <= budget
}

/**
 * Calculate savings from discount
 *
 * @param originalPrice - Original price
 * @param discount - Discount value
 * @param type - Discount type
 * @param decimals - Number of decimal places (defaults to 2)
 * @returns Savings amount
 *
 * @example
 * ```typescript
 * calculateSavings(100, 20, 'percentage') // 20
 * calculateSavings(100, 15, 'fixed') // 15
 * ```
 */
export function calculateSavings(
  originalPrice: number,
  discount: number,
  type: DiscountType = 'percentage',
  decimals = 2
): number {
  if (type === 'percentage') {
    return calculatePercentage(originalPrice, discount, decimals)
  }
  return round(Math.min(discount, originalPrice), decimals)
}
