/**
 * Framework-agnostic formatting helpers.
 *
 * Lives in `type:util, scope:shared` so it can be imported by the Express API,
 * the Angular shop, and the React admin without creating any cross-domain
 * coupling. These are pure functions with no framework imports — trivially
 * testable and cacheable, and the concrete proof of cross-framework reuse:
 * the Angular product card and the React product row both render prices with
 * the exact same `formatPrice` implementation.
 */

/** Format a numeric price as a localized currency string. */
export function formatPrice(
  price: number,
  currency = 'USD',
  locale = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(price);
}

/** Format a 0–5 rating as e.g. "4.5 ★". */
export function formatRating(rating: number): string {
  return `${rating.toFixed(1)} ★`;
}

/** Compact, human-readable count, e.g. 1500 -> "1.5k". */
export function formatCount(count: number): string {
  if (count < 1000) {
    return String(count);
  }
  return `${(count / 1000).toFixed(1)}k`;
}
