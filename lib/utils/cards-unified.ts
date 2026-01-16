/**
 * Unified Credit Card Utilities
 *
 * Consolidates card utilities from:
 * - /lib/utils/mask-card.ts
 * - /features/bookings/lib/bbus/payment/card-utils.ts
 *
 * Provides comprehensive card validation, formatting, and masking functionality.
 *
 * @example
 * ```typescript
 * import { maskCardNumber, validateCardNumber, detectCardType } from '@/lib/utils/cards-unified'
 *
 * const masked = maskCardNumber('4111111111111111') // "************1111"
 * const isValid = validateCardNumber('4111111111111111') // true
 * const type = detectCardType('4111111111111111') // "visa"
 * ```
 */

/**
 * Supported card types
 */
export type CardType = 'visa' | 'mastercard' | 'amex' | 'unknown'

/**
 * Detect card type based on card number
 *
 * @param cardNumber - Full or partial card number
 * @returns Detected card type
 *
 * @example
 * ```typescript
 * detectCardType('4111111111111111') // 'visa'
 * detectCardType('5500000000000004') // 'mastercard'
 * detectCardType('340000000000009') // 'amex'
 * detectCardType('9999999999999999') // 'unknown'
 * ```
 */
export function detectCardType(cardNumber: string): CardType {
  const cleanNumber = cardNumber.replace(/\s+/g, '')

  // Visa: starts with 4
  if (/^4/.test(cleanNumber)) {
    return 'visa'
  }

  // Mastercard: starts with 51-55 or 2221-2720
  if (/^5[1-5]/.test(cleanNumber) || /^2[2-7]/.test(cleanNumber)) {
    return 'mastercard'
  }

  // Amex: starts with 34 or 37
  if (/^3[47]/.test(cleanNumber)) {
    return 'amex'
  }

  return 'unknown'
}

/**
 * Format card number with spaces for better readability
 *
 * @param cardNumber - Card number to format
 * @returns Formatted card number with spaces
 *
 * @example
 * ```typescript
 * formatCardNumber('4111111111111111') // '4111 1111 1111 1111'
 * formatCardNumber('378282246310005') // '3782 822463 10005' (Amex format)
 * ```
 */
export function formatCardNumber(cardNumber: string): string {
  const cleanNumber = cardNumber.replace(/\s+/g, '')
  const cardType = detectCardType(cleanNumber)

  // Amex format: 4-6-5 (XXXX XXXXXX XXXXX)
  if (cardType === 'amex') {
    return cleanNumber.replace(/(\d{4})(\d{6})(\d{5})/, '$1 $2 $3').trim()
  }

  // Other cards: 4-4-4-4 (XXXX XXXX XXXX XXXX)
  return cleanNumber
    .replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, '$1 $2 $3 $4')
    .trim()
}

/**
 * Validate card number using Luhn algorithm
 *
 * @param cardNumber - Card number to validate
 * @returns True if valid according to Luhn algorithm
 *
 * @example
 * ```typescript
 * validateCardNumber('4111111111111111') // true (valid test card)
 * validateCardNumber('1234567812345678') // false
 * ```
 */
export function validateCardNumber(cardNumber: string): boolean {
  const cleanNumber = cardNumber.replace(/\s+/g, '')

  // Must be numeric
  if (!/^\d+$/.test(cleanNumber)) {
    return false
  }

  // Must be between 13-19 digits
  if (cleanNumber.length < 13 || cleanNumber.length > 19) {
    return false
  }

  // Luhn algorithm
  let sum = 0
  let isEven = false

  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanNumber[i], 10)

    if (isEven) {
      digit *= 2
      if (digit > 9) {
        digit -= 9
      }
    }

    sum += digit
    isEven = !isEven
  }

  return sum % 10 === 0
}

/**
 * Validate expiry date (MM/YY format)
 *
 * @param month - Month (1-12 or '01'-'12')
 * @param year - Year (2-digit format, e.g., '24' for 2024)
 * @returns True if expiry date is valid and not expired
 *
 * @example
 * ```typescript
 * validateExpiryDate('12', '25') // true (if current date is before Dec 2025)
 * validateExpiryDate('01', '20') // false (expired)
 * validateExpiryDate('13', '25') // false (invalid month)
 * ```
 */
export function validateExpiryDate(month: string, year: string): boolean {
  const monthNum = parseInt(month, 10)
  const yearNum = parseInt(year, 10)

  // Validate month
  if (monthNum < 1 || monthNum > 12) {
    return false
  }

  // Get current date
  const now = new Date()
  const currentYear = now.getFullYear() % 100 // Get last 2 digits
  const currentMonth = now.getMonth() + 1

  // Check if card is expired
  if (yearNum < currentYear) {
    return false
  }

  if (yearNum === currentYear && monthNum < currentMonth) {
    return false
  }

  return true
}

/**
 * Validate CVV based on card type
 *
 * @param cvv - CVV/CVC code
 * @param cardType - Card type (affects CVV length)
 * @returns True if CVV is valid for the card type
 *
 * @example
 * ```typescript
 * validateCVV('123', 'visa') // true
 * validateCVV('1234', 'amex') // true
 * validateCVV('12', 'visa') // false (too short)
 * validateCVV('123', 'amex') // false (Amex needs 4 digits)
 * ```
 */
export function validateCVV(cvv: string, cardType: CardType): boolean {
  // Amex has 4 digits, others have 3
  const requiredLength = cardType === 'amex' ? 4 : 3

  if (!/^\d+$/.test(cvv)) {
    return false
  }

  return cvv.length === requiredLength
}

/**
 * Mask card number for display (show only last 4 digits)
 *
 * @param cardNumber - Full card number or last 4 digits
 * @returns Masked card number
 *
 * @example
 * ```typescript
 * maskCardNumber('4111111111111111') // '************1111'
 * maskCardNumber('1111') // '**** **** **** 1111' (assumes last 4)
 * ```
 */
export function maskCardNumber(cardNumber: string): string {
  const cleanNumber = cardNumber.replace(/\s+/g, '')

  // If only 4 digits provided, assume it's last 4
  if (cleanNumber.length === 4) {
    return `**** **** **** ${cleanNumber}`
  }

  // Full card number: mask all but last 4
  const last4 = cleanNumber.slice(-4)
  const masked = '*'.repeat(cleanNumber.length - 4)
  return `${masked}${last4}`
}

/**
 * Mask card number with formatting (spaces every 4 digits)
 *
 * @param cardNumber - Full card number or last 4 digits
 * @returns Formatted masked card number
 *
 * @example
 * ```typescript
 * maskCardNumberFormatted('4111111111111111') // '**** **** **** 1111'
 * maskCardNumberFormatted('1111') // '**** **** **** 1111'
 * ```
 */
export function maskCardNumberFormatted(cardNumber: string): string {
  const cleanNumber = cardNumber.replace(/\s+/g, '')

  // If only 4 digits provided, use standard format
  if (cleanNumber.length === 4) {
    return `**** **** **** ${cleanNumber}`
  }

  // Full card number: format with spaces
  const last4 = cleanNumber.slice(-4)
  return `**** **** **** ${last4}`
}

/**
 * Get the expected CVV length for a card type
 *
 * @param cardType - Card type
 * @returns Expected CVV length
 *
 * @example
 * ```typescript
 * getCVVLength('visa') // 3
 * getCVVLength('amex') // 4
 * ```
 */
export function getCVVLength(cardType: CardType): number {
  return cardType === 'amex' ? 4 : 3
}

/**
 * Get the expected card number length for a card type
 *
 * @param cardType - Card type
 * @returns Expected card number length (or range)
 *
 * @example
 * ```typescript
 * getCardNumberLength('visa') // [13, 16, 19] (Visa can be 13, 16, or 19 digits)
 * getCardNumberLength('amex') // [15]
 * getCardNumberLength('mastercard') // [16]
 * ```
 */
export function getCardNumberLength(cardType: CardType): number[] {
  switch (cardType) {
    case 'visa':
      return [13, 16, 19]
    case 'amex':
      return [15]
    case 'mastercard':
      return [16]
    default:
      return [13, 14, 15, 16, 17, 18, 19]
  }
}

/**
 * Sanitize card number (remove non-digits)
 *
 * @param cardNumber - Card number with potential spaces/dashes
 * @returns Clean card number (digits only)
 *
 * @example
 * ```typescript
 * sanitizeCardNumber('4111-1111-1111-1111') // '4111111111111111'
 * sanitizeCardNumber('4111 1111 1111 1111') // '4111111111111111'
 * ```
 */
export function sanitizeCardNumber(cardNumber: string): string {
  return cardNumber.replace(/\D/g, '')
}

/**
 * Validate complete card information
 *
 * @param cardNumber - Card number
 * @param expiryMonth - Expiry month
 * @param expiryYear - Expiry year (2-digit)
 * @param cvv - CVV code
 * @returns Validation result with detailed errors
 *
 * @example
 * ```typescript
 * validateCard('4111111111111111', '12', '25', '123')
 * // { valid: true, errors: [] }
 *
 * validateCard('1234', '12', '25', '123')
 * // { valid: false, errors: ['Invalid card number'] }
 * ```
 */
export function validateCard(
  cardNumber: string,
  expiryMonth: string,
  expiryYear: string,
  cvv: string
): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  // Validate card number
  if (!validateCardNumber(cardNumber)) {
    errors.push('Invalid card number')
  }

  // Validate expiry
  if (!validateExpiryDate(expiryMonth, expiryYear)) {
    errors.push('Invalid or expired card')
  }

  // Validate CVV
  const cardType = detectCardType(cardNumber)
  if (!validateCVV(cvv, cardType)) {
    errors.push(`Invalid CVV (${getCVVLength(cardType)} digits required)`)
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}
