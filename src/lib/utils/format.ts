/**
 * The Laravel API always returns money as decimal strings (e.g. "549.00"),
 * never floats — mirrors the backend's own Money value object. Formatting
 * happens once, here, so no page reimplements currency rules.
 */
export function formatPrice(
  amount: string | number | null | undefined,
  currency: string = "INR",
): string {
  const value = typeof amount === "string" ? Number.parseFloat(amount) : amount;

  if (value === null || value === undefined || Number.isNaN(value)) {
    return "";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
}

export function toNumber(amount: string | number | null | undefined): number {
  if (amount === null || amount === undefined) return 0;
  return typeof amount === "string" ? Number.parseFloat(amount) : amount;
}

export function discountPercent(
  price: string | number,
  discountPrice: string | number | null | undefined,
): number | null {
  if (!discountPrice) return null;
  const original = toNumber(price);
  const discounted = toNumber(discountPrice);
  if (!original || discounted >= original) return null;
  return Math.round(((original - discounted) / original) * 100);
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return "";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return `${text.slice(0, length).trimEnd()}…`;
}
