export const DAY_MS = 86_400_000;
export const PROGRAMME_DAYS = 365;
export const operatingMode = "demo" as const;

export function programmeEnd(start: string) {
  const timestamp = Date.parse(start);
  if (!Number.isFinite(timestamp)) throw new Error("Invalid start timestamp");
  return new Date(timestamp + PROGRAMME_DAYS * DAY_MS).toISOString();
}

export function programmeDay(start: string, now: string) {
  return Math.max(0, Math.min(PROGRAMME_DAYS, Math.floor((Date.parse(now) - Date.parse(start)) / DAY_MS) + 1));
}

export function forecastAccounting(quantity: number, entryCents: number, markCents: number, feeCents = 0) {
  if (!Number.isSafeInteger(quantity) || quantity < 0 || !Number.isInteger(entryCents) || entryCents < 0 || entryCents > 100 || !Number.isInteger(markCents) || markCents < 0 || markCents > 100 || !Number.isSafeInteger(feeCents) || feeCents < 0) throw new Error("Invalid forecast amounts");
  const costCents = quantity * entryCents;
  const payoutCents = quantity * 100;
  return { cost: costCents / 100, mark: quantity * markCents / 100, unrealised: quantity * (markCents - entryCents) / 100, fees: feeCents / 100, grossWinningPayout: payoutCents / 100, winningProfit: (payoutCents - costCents - feeCents) / 100, maximumLoss: (costCents + feeCents) / 100, losingPayout: 0 };
}

export function assertFinancialActionAllowed() {
  throw new Error("Real payments, credit purchases and withdrawals are unavailable in demo mode.");
}