/**
 * Format price from cents to dollar string
 * @param priceInCents - Price in cents (e.g., 2499 for $24.99)
 * @returns Formatted price string (e.g., "$24.99")
 */
export function formatPrice(priceInCents: number): string {
  const dollars = priceInCents / 100;
  return `$${dollars.toFixed(2)}`;
}
