/**
 * Mask credit card number showing only last 4 digits
 * @param cardLast4 - Last 4 digits of card
 * @returns Masked card number (e.g., "**** **** **** 1234")
 */
export function maskCardNumber(cardLast4: string): string {
  return `**** **** **** ${cardLast4}`
}

/**
 * Mask full card number
 * @param fullCardNumber - Full card number (e.g., "1234567812345678")
 * @returns Masked card number with last 4 visible
 */
export function maskFullCardNumber(fullCardNumber: string): string {
  const last4 = fullCardNumber.slice(-4)
  return maskCardNumber(last4)
}
