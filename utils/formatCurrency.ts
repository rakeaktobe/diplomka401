/**
 * Formats a number as Kazakhstani Tenge with space-separated thousands.
 * e.g. 12990 → "12 990 ₸"
 */
export function formatCurrency(amount: number): string {
  return (
    new Intl.NumberFormat("ru-KZ", {
      style: "currency",
      currency: "KZT",
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    })
      .format(amount)
      // Intl puts "₸" at the start with ru-KZ; normalise to trailing with a thin space
      .replace(/^₸\s?/, "")
      .trim() + " ₸"
  );
}

/**
 * Formats currency without the ₸ symbol (useful when the symbol is rendered separately).
 * e.g. 12990 → "12 990"
 */
export function formatAmount(amount: number): string {
  return new Intl.NumberFormat("ru-KZ", {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(amount);
}
