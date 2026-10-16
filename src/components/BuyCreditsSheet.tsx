import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import confetti from "canvas-confetti";
import { toast } from "sonner";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { mockBuyPack } from "@/lib/wallet.functions";
import { useT } from "@/lib/i18n";

export function BuyCreditsSheet() {
  const { t } = useT();
  const qc = useQueryClient();
  const buy = useServerFn(mockBuyPack);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const { data: packs } = useQuery({
    queryKey: ["packs"],
    queryFn: async () => (await supabase.from("credit_packs").select("*").order("sort")).data ?? [],
  });

  async function pick(id: string) {
    setBusy(id);
    try {
      const r = await buy({ data: { packId: id, nonce: crypto.randomUUID() } });
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches)
        confetti({ particleCount: 120, spread: 70, origin: { y: 0.8 } });
      toast.success(`+${r.dsc.toLocaleString()} DSC`);
      qc.invalidateQueries({ queryKey: ["wallet"] });
      setOpen(false);
    } catch (e) {
      toast.error((e as Error).message);
    }
    setBusy(null);
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button size="lg" className="glow h-14 w-full rounded-2xl text-base active:scale-95">
          {t("wallet.buy")}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="glass bg-popover safe-bottom">
        <DrawerHeader>
          <DrawerTitle className="font-display text-2xl">{t("wallet.buy")}</DrawerTitle>
        </DrawerHeader>
        <div className="space-y-3 px-4 pb-4">
          {(packs ?? []).map((p) => (
            <button
              key={p.id}
              disabled={!!busy}
              onClick={() => pick(p.id)}
              className="glass flex min-h-16 w-full items-center justify-between rounded-2xl p-4 text-left transition-transform active:scale-[0.98] disabled:opacity-50"
            >
              <div>
                <p className="font-display text-lg font-bold">{p.name}</p>
                <p className="tabular text-sm text-primary">{p.dsc_amount.toLocaleString()} DSC</p>
              </div>
              <span className="font-display tabular text-xl font-bold">
                {busy === p.id ? "…" : `${(p.price_cents / 100).toFixed(0)} €`}
              </span>
            </button>
          ))}
          <p className="pt-2 text-xs text-muted-foreground">{t("legal.purchasedUse")}</p>
          <p className="text-xs text-primary">{t("wallet.demoMode")}</p>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
