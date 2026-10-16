import { createFileRoute } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import { ShellPage } from "@/components/ShellPage";
import { CountUp } from "@/components/AppChrome";
import { Button } from "@/components/ui/button";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/wallet")({
  head: () => ({
    meta: [
      { title: "Wallet — DiSTRUB" },
      { name: "description", content: "Your DSC balances and credit purchases." },
      { property: "og:title", content: "Wallet — DiSTRUB" },
      { property: "og:description", content: "Your DSC balances and credit purchases." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Wallet,
});

function Wallet() {
  const { t } = useT();
  const rows = [
    ["wallet.promotional", 0],
    ["wallet.restricted", 0],
    ["wallet.convertible", 0],
  ] as const;
  return (
    <ShellPage titleKey="nav.wallet">
      <div className="glass mt-6 rounded-3xl p-6">
        <p className="text-sm text-muted-foreground">{t("wallet.total")}</p>
        <p className="font-display mt-1 text-5xl font-bold">
          <CountUp value={0} /> <span className="text-xl text-muted-foreground">DSC</span>
        </p>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-3">
        {rows.map(([k, v]) => (
          <div key={k} className="glass rounded-2xl p-4">
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              {k === "wallet.convertible" && <Lock className="size-3" />}
              {t(k)}
            </p>
            <p className="font-display mt-1 text-2xl font-bold"><CountUp value={v} /></p>
          </div>
        ))}
      </div>
      <div className="safe-bottom fixed inset-x-0 bottom-16 px-5 md:static md:mt-6 md:px-0">
        <Button size="lg" className="glow h-14 w-full rounded-2xl text-base active:scale-95">
          {t("wallet.buy")}
        </Button>
      </div>
    </ShellPage>
  );
}
