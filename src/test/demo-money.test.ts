import {describe,expect,it} from "vitest";
import {demoActionSchema,orderCostCents,DEMO_TOPUPS} from "@/lib/demo-money";
const key="ed94db59-554a-432d-ae90-e3f757af84cb";
describe("Free account demo money",()=>{
 it("provides free repeatable amounts for existing and new accounts without a user id",()=>{
  expect(DEMO_TOPUPS).toEqual([1000,5000,25000,100000]);
  expect(demoActionSchema.parse({action:"topup",key,amount:5000,bucket:"forecast",userId:"other"})).not.toHaveProperty("userId");
 });
 it("keeps resources separate from forecast credits",()=>{
  expect(demoActionSchema.safeParse({action:"spend",key,amountCents:10000,purpose:"forecast"}).success).toBe(false);
  expect(demoActionSchema.safeParse({action:"topup",key,amount:1000,bucket:"resource"}).success).toBe(true);
 });
 it("704 shares at 71 cents reserve exactly 49984 cents",()=>expect(orderCostCents(71,704)).toBe(49984));
 it("rejects fractional negative and unknown amounts",()=>{
  for(const amount of [-1000,1.5,999])expect(demoActionSchema.safeParse({action:"topup",key,amount,bucket:"forecast"}).success).toBe(false);
  expect(demoActionSchema.safeParse({action:"spend",key,amountCents:-1,purpose:"support"}).success).toBe(false);
 });
});
