// Current YES price (cents) per market slug. Mirrors the Markets page sample data until live pricing exists.
export const YES_PRICE: Record<string, number> = {
  "ai-agents-overtake-crypto": 49,
  "ucl-final-attention-record": 44,
  "f1-title-fight-final-race": 58,
  "shortform-overtakes-longform": 68,
  "northstar-most-searched-brand": 48,
  "esports-major-viewers-5m": 55,
  "mayabloom-1m-followers": 71,
  "summer-blockbuster-top-weekend": 62,
  "stablecoin-fees-under-1cent": 39,
  "indie-album-streaming-record": 33,
  "creator-fund-100m-payouts": 27,
  "ai-host-first-podcast-chart": 22,
};

export function currentPrice(slug: string, side: string, fallback: number) {
  const y = YES_PRICE[slug];
  if (y === undefined) return fallback;
  return side === "no" ? 100 - y : y;
}
