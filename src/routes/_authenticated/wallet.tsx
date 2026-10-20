import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { ShellPage } from "@/components/ShellPage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BuyCreditsSheet } from "@/components/BuyCreditsSheet";
import { demoWalletOptions } from "@/lib/demo-wallet";
import { demoMoneyAction } from "@/lib/wallet.functions";
import { demoCopy as c } from "@/lib/demo-money";
import { useTalentCopy } from "@/lib/talent-copy";
import { supabase } from "@/integrations/supabase/client";
import { useT } from "@/lib/i18n";
export const Route=createFileRoute("/_authenticated/wallet")({
 head:()=>({meta:[{title:"Demo Wallet — DiSTRUB"},{name:"description",content:"Free account-based demo credits, resource units and simulated transaction history. No real payments."},{property:"og:title",content:"Demo Wallet — DiSTRUB"},{property:"og:description",content:"Test forecast orders, demo payments and refunds with free simulation balances."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary"}]}),component:Wallet,
});
function Wallet(){
 const {text,lang}=useTalentCopy();const {t}=useT();const qc=useQueryClient();const act=useServerFn(demoMoneyAction);
 const {data,error,isLoading}=useQuery(demoWalletOptions);
 const {data:legacy}=useQuery({queryKey:["legacy-wallet"],queryFn:async()=>{const r=await supabase.from("my_balances").select("*");if(r.error)throw r.error;return r.data;}});
 const [purpose,setPurpose]=useState<"support"|"commercial">("support");const [amount,setAmount]=useState("100");const [busy,setBusy]=useState(false);
 const fmt=(n:number)=>n.toLocaleString(lang,{maximumFractionDigits:2});
 async function transact(input:Parameters<typeof act>[0]){setBusy(true);try{await act(input);await qc.invalidateQueries({queryKey:["demo-wallet"]});toast.success(text(c.done));}catch(e){toast.error(e instanceof Error?e.message:"Error");}finally{setBusy(false);}}
 function pay(){const normalized=amount.trim().replace(",",".");if(!/^\d+(\.\d{1,2})?$/.test(normalized)||Number(normalized)<=0){toast.error(text(c.invalid));return;}void transact({data:{action:"spend",key:crypto.randomUUID(),amountCents:Math.round(Number(normalized)*100),purpose}});}
 const refunded=new Set(data?.transactions.map(tx=>tx.refund_of).filter(Boolean));
 return <ShellPage titleKey="nav.wallet">
  <p className="mt-5 text-sm text-primary">{text(c.notice)}</p>
  {error?<p role="alert" className="mt-4 text-no">{error.message}</p>:null}
  <div className="mt-5 grid gap-px border border-border bg-border sm:grid-cols-2">{(["forecast","resource"] as const).map(b=><div key={b} className="min-w-0 bg-card p-5"><p className="text-xs text-muted-foreground">{text(c[b])}</p><p className="mt-2 break-words font-mono text-3xl tabular">{isLoading?"…":fmt(data?.[b]??0)}</p></div>)}</div>
  <div className="mt-4"><BuyCreditsSheet/></div>
  <section className="mt-8 border-t border-border pt-6">
   <h2 className="text-xl font-semibold">{text(c.payment)}</h2>
   <div className="mt-4 grid gap-2 sm:grid-cols-2">{(["support","commercial"] as const).map(p=><Button key={p} variant={purpose===p?"default":"outline"} onClick={()=>setPurpose(p)} className="h-auto min-h-12 whitespace-normal rounded-sm">{text(c[p])}</Button>)}</div>
   <label htmlFor="demo-amount" className="mt-4 block text-sm text-muted-foreground">{text(c.amount)}</label>
   <Input id="demo-amount" type="text" inputMode="decimal" value={amount} onChange={e=>setAmount(e.target.value)} className="mt-2 h-12 rounded-sm"/>
   <Button disabled={busy||!data} onClick={pay} className="mt-3 h-auto min-h-12 w-full whitespace-normal rounded-sm">{busy?"…":text(c.pay)}</Button>
   <p className="mt-3 text-xs text-muted-foreground">{text(c.sandbox)}</p>
  </section>
  <section className="mt-8 border-t border-border pt-6"><h2 className="text-xl font-semibold">{text(c.history)}</h2>
   <ul className="mt-4 divide-y divide-border">{data?.transactions.length===0?<li className="py-4 text-sm text-muted-foreground">{text(c.empty)}</li>:null}
   {data?.transactions.map(tx=><li key={tx.id} className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] gap-3 py-4"><div className="min-w-0"><p className="break-words text-sm font-medium">{text(c[tx.kind as keyof typeof c]??c.payment)}</p><p className="mt-1 text-xs text-muted-foreground">{text(c[tx.bucket==='forecast'?'forecast':'resource'])} · {new Date(tx.created_at).toLocaleString(lang)}</p>{['support','commercial'].includes(tx.kind)?<Button variant="ghost" size="sm" disabled={busy||refunded.has(tx.id)} onClick={()=>transact({data:{action:"refund",key:crypto.randomUUID(),transactionId:tx.id}})} className="mt-2 min-h-11 rounded-sm"><RotateCcw className="size-3"/>{text(refunded.has(tx.id)?c.refunded:c.refund)}</Button>:null}</div><p className={`max-w-32 break-words text-right font-mono tabular ${tx.amount_cents>0?'text-yes':'text-no'}`}>{tx.amount_cents>0?'+':'−'}{fmt(Math.abs(tx.amount_cents)/100)}</p></li>)}
   </ul>
  </section>
  <details className="mt-8 border-t border-border pt-5"><summary className="cursor-pointer text-sm text-muted-foreground">{text(c.archived)}</summary><ul className="mt-3 space-y-2">{legacy?.map(r=><li key={r.bucket} className="flex justify-between gap-3 text-sm"><span>{t(`wallet.${r.bucket}`)}</span><span className="font-mono">{fmt(r.balance??0)} DSC</span></li>)}</ul></details>
 </ShellPage>;
}
