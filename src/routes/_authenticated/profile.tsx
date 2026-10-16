import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { ShellPage } from "@/components/ShellPage";
import { Button } from "@/components/ui/button";
import { LangSwitcher } from "@/components/AppChrome";
import { supabase } from "@/integrations/supabase/client";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [
      { title: "Profile — DiSTRUB" },
      { name: "description", content: "Your DiSTRUB profile." },
      { property: "og:title", content: "Profile — DiSTRUB" },
      { property: "og:description", content: "Your DiSTRUB profile." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Profile,
});

function Profile() {
  const { t } = useT();
  const { user } = Route.useRouteContext();
  const qc = useQueryClient();
  const nav = useNavigate();
  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    nav({ to: "/auth", replace: true });
  }
  return (
    <ShellPage titleKey="nav.profile">
      <div className="glass mt-6 space-y-4 rounded-3xl p-6">
        <p className="text-muted-foreground">{user.email}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm">{t("lang")}</span>
          <LangSwitcher />
        </div>
        <Button variant="secondary" className="h-12 w-full rounded-2xl" onClick={signOut}>
          {t("auth.signOut")}
        </Button>
      </div>
    </ShellPage>
  );
}
