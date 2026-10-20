// Demo-only money: fixed top-up amounts, no card charged.
export const DEMO_TOPUPS = [
  { id: "demo-1k", amount: 1_000 },
  { id: "demo-5k", amount: 5_000 },
  { id: "demo-25k", amount: 25_000 },
  { id: "demo-100k", amount: 100_000 },
] as const;
export const orderCost = (priceCents: number, shares: number) => Math.ceil((priceCents * shares) / 100);
/** Spend promotional first, then restricted. Returns null if not enough. */
export function splitSpend(cost: number, bal: { promotional: number; restricted: number }) {
  if (cost > bal.promotional + bal.restricted) return null;
  const promotional = Math.min(cost, bal.promotional);
  return { promotional, restricted: cost - promotional };
}
