export const SITE_LOCALE = "es-CL";
export const SITE_TIMEZONE = "America/Santiago";
export const SITE_CURRENCY = "CLP";
export const SITE_URL = "https://jonahbruzzi.me";

/**
 * Formats a CLP amount as "$19.990" (no decimals, "." thousands separator,
 * "$" prefix, no space) per the Jonahbruzzi guide's price format spec.
 * @param {number|string} amount
 * @returns {string}
 */
export function formatPrice(amount) {
  const value = typeof amount === "string" ? Number(amount) : amount;
  if (!Number.isFinite(value)) return "";

  const formatted = new Intl.NumberFormat(SITE_LOCALE, {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(Math.round(value));

  return `$${formatted}`;
}

export const siteConfig = {
  name: "Jonahbruzzi",
  tagline: "Cosas que vale la pena descubrir.",
  description:
    "Tecnología, hogar, moda y productos interesantes que encontramos por Internet.",
  locale: SITE_LOCALE,
  timezone: SITE_TIMEZONE,
  currency: SITE_CURRENCY,
  url: SITE_URL,
};
