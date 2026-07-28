const ADDRESS_KEY = "bc_checkout_address_id";

/** Bridges the address chosen on /checkout to the payment method chosen on
 * /checkout/payment — a real page navigation (as the spec's 17-page list
 * requires two distinct routes), not a wizard step, so the selection has to
 * survive the navigation via sessionStorage rather than component state. */
export function setCheckoutAddressId(id: number) {
  window.sessionStorage.setItem(ADDRESS_KEY, String(id));
}

export function getCheckoutAddressId(): number | null {
  const raw = window.sessionStorage.getItem(ADDRESS_KEY);
  return raw ? Number(raw) : null;
}

export function clearCheckoutAddressId() {
  window.sessionStorage.removeItem(ADDRESS_KEY);
}
