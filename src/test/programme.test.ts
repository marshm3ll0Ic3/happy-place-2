import { describe, expect, it } from "vitest";
import { assertFinancialActionAllowed, forecastAccounting, programmeEnd, DAY_MS, programmeDay } from "@/lib/programme";
import { BUDGET } from "@/lib/talents";

describe("Brief financial and lifecycle rules", () => {
  it("780 units from 58 to 64 cents gain 46.8", () => expect(forecastAccounting(780, 58, 64).unrealised).toBe(46.8));
  it("620 units from 49 to 57 cents gain 49.6", () => expect(forecastAccounting(620, 49, 57).unrealised).toBe(49.6));
  it("704 at 71 cents cost 499.84, pay 704 and profit 204.16", () => { const r = forecastAccounting(704, 71, 71); expect(r.cost).toBe(499.84); expect(r.grossWinningPayout).toBe(704); expect(r.winningProfit).toBe(204.16); });
  it("a losing outcome pays zero", () => expect(forecastAccounting(704, 71, 0).losingPayout).toBe(0));
  it("ends after exactly 365 elapsed days across leap year and DST", () => { const start = "2027-10-31T01:30:00.000Z"; expect(Date.parse(programmeEnd(start)) - Date.parse(start)).toBe(365 * DAY_MS); expect(programmeEnd(start)).toBe("2028-10-30T01:30:00.000Z"); });
  it("the programme day is bounded at expiry", () => { expect(programmeDay("2026-09-03T12:00:00Z", "2026-10-19T12:00:00Z")).toBe(47); expect(programmeDay("2026-09-03T12:00:00Z", "2028-01-01T00:00:00Z")).toBe(365); });
  it("the fixture budget allocates 6000 USD", () => { expect(BUDGET.map(r => r.amount)).toEqual([3600, 720, 480, 360, 840]); expect(BUDGET.reduce((s, r) => s + r.amount, 0)).toBe(6000); });
  it("blocks real financial actions and purchased credits in demo", () => expect(() => assertFinancialActionAllowed()).toThrow("unavailable in demo mode"));
});