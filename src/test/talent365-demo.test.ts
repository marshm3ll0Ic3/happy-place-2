import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";

const source = readFileSync("src/assets/talent365-demo.html", "utf8");

describe("Imported Talent / 365 simulation boundaries", () => {
  it("a confirmed forecast spends only forecast credits and records its position", async () => {
    const start = source.indexOf("case 'confirm-order':{");
    const end = source.indexOf("case 'sell':", start);
    const account = { balance: 10000, resourceBalance: 10000, positions: [] as unknown[] };
    const context = {
      action: "confirm-order", u: account,
      ui: { modal: { id: "talent-atlasfit", side: "YES", price: 58, shares: 8620, cost: 4999.6 } },
      market: () => ({ yes: 58, cat: "Fitness", resolved: null }),
      uid: () => "forecast-test", NOW: () => new Date("2026-10-20T00:00:00Z"),
      transaction: () => {}, notify: () => {}, changeMarketPrice: () => {},
      save: () => {}, toast: () => {}, go: () => {}, closeModal: () => {}, fmt: String,
    };
    await runInNewContext(`(async()=>{switch(action){${source.slice(start, end)}}})()`, context);
    expect(account.balance).toBe(5000.4);
    expect(account.resourceBalance).toBe(10000);
    expect(account.positions).toEqual([{ id: "forecast-test", marketId: "talent-atlasfit", side: "YES", shares: 8620, entryPrice: 58, cost: 4999.6, openedAt: "2026-10-20T00:00:00.000Z" }]);
  });
  it("resource allocation spends only resource units, not forecast credits", async () => {
    const start = source.indexOf("if(id==='fund-form')");
    const end = source.indexOf("if(id==='apply-1')", start);
    const account = { balance: 10000, resourceBalance: 10000, supports: [] as unknown[] };
    const programme = { id: "atlasfit", alias: "AtlasFit", funded: 5800, budget: [{ id: "internet", name: "Connectivity", goal: 1200, funded: 1000 }] };
    const context = {
      id: "fund-form", u: account, fd: new Map([["talent", "atlasfit"], ["resource", "internet"], ["amount", "100"]]),
      db: { talentChanges: {} }, ui: {}, formStr: (fd: Map<string, string>, key: string) => fd.get(key),
      talent: () => programme, uid: () => "test", NOW: () => new Date("2026-10-20T00:00:00Z"),
      resourceTransaction: () => {}, notify: () => {}, save: () => {}, toast: () => {}, go: () => {}, money: String,
    };
    await runInNewContext(`(async()=>{${source.slice(start, end)}})()`, context);
    expect(account.balance).toBe(10000);
    expect(account.resourceBalance).toBe(9900);
    expect(account.supports).toHaveLength(1);
    expect((context.db.talentChanges as Record<string, { funded: number }>)["atlasfit"]?.funded).toBe(5900);
  });
});