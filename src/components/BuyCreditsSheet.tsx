import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { demoMoneyAction } from "@/lib/wallet.functions";
import { demoCopy as c, DEMO_TOPUPS } from "@/lib/demo-money";
import { useTalentCopy } from "@/lib/talent-copy";
export function BuyCreditsSheet() {
 const {text,lang} = useTalentCopy();
 const qc=useQueryClient(); const act=useServerFn(demoMoneyAction);
 const [open,setOpen]=useState(false); const [bucket,setBucket]=useState<"forecast"|"resource">("forecast"); const [busy,setBusy]=useState(false);
 async function add(amount: typeof DEMO_TOPUPS[number]) {
  setBusy(true);
  try { await act({data:{action:"topup",key:crypto.randomUUID(),amount,bucket}}); await Promise.all([qc.invalidateQueries({queryKey:["demo-wallet"]}),qc.invalidateQueries({queryKey:["mk-me"]}),qc.invalidateQueries({queryKey:["profile-stats"]})]); toast.success(text(c.done)); setOpen(false); }
  catch(e){toast.error(e instanceof Error?e.message:"Error");} finally{setBusy(false);}
 }
 return <Drawer open={open} onOpenChange={setOpen}>
  <DrawerTrigger asChild><Button size="lg" className="min-h-12 h-auto w-full whitespace-normal rounded-sm"><Plus className="size-4 shrink-0"/>{text(c.add)}</Button></DrawerTrigger>
  <DrawerContent className="max-h-[85dvh] overflow-y-auto bg-popover safe-bottom">
   <DrawerHeader><DrawerTitle>{text(c.add)}</DrawerTitle></DrawerHeader>
   <div className="mx-auto w-full max-w-lg space-y-3 px-4 pb-5">
    <div className="grid grid-cols-2 gap-2">{(["forecast","resource"] as const).map(b=><Button key={b} variant={bucket===b?"default":"outline"} disabled={busy} onClick={()=>setBucket(b)} className="h-auto min-h-12 whitespace-normal rounded-sm">{text(c[b])}</Button>)}</div>
    {DEMO_TOPUPS.map(amount=><Button key={amount} disabled={busy} variant="outline" onClick={()=>add(amount)} className="flex h-16 w-full justify-between rounded-sm"><span className="font-mono text-xl">+{amount.toLocaleString(lang)}</span><span className="text-primary">{busy?"…":text(c.free)}</span></Button>)}
    <p className="text-xs text-muted-foreground">{text(c.notice)}</p>
   </div>
  </DrawerContent>
 </Drawer>;
}
