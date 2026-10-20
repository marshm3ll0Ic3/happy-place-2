import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";

const source = readFileSync("src/assets/talent365-demo.html", "utf8");

describe("Imported Talent / 365 simulation boundaries", () => {
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