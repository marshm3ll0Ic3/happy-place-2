import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — DiSTRUB" },
      { name: "description", content: "Sign in to your DiSTRUB talent account." },
      { property: "og:title", content: "Sign in — DiSTRUB" },
      { property: "og:description", content: "Sign in to your DiSTRUB talent account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  validateSearch:(s:Record<string,unknown>)=>({returnTo:s["returnTo"]==="application"?"application":"wallet"}),
  component: AuthPage,
});

function AuthPage() {
  const { t } = useT();
  const nav = useNavigate();
  const {returnTo}=Route.useSearch();
  const destination=returnTo==="application"?"/application":"/wallet";
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => data.user && nav({ to: destination }));
  }, [nav,destination]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    if (mode === "up") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin + "/wallet" },
      });
      if (error) toast.error(error.message);
      else if (data.session) nav({ to: destination });
      else toast.error(t("auth.trySignIn"));
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) toast.error(error.message);
      else nav({ to: destination });
    }
    setBusy(false);
  }

  async function google() {
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/auth" });
    if (r.error) toast.error(String(r.error));
  }

  return (
    <main className="relative mx-auto flex min-h-[80vh] max-w-sm flex-col justify-center px-5 pb-28">
      <div className="mesh pointer-events-none absolute -inset-10 -z-10 opacity-40" />
      <h1 className="text-4xl font-bold">{mode === "in" ? t("auth.signIn") : t("auth.signUp")}</h1>
      <Button variant="secondary" className="mt-8 h-12 rounded-2xl" onClick={google}>
        {t("auth.google")}
      </Button>
      <div className="my-6 text-center text-xs text-muted-foreground">{t("auth.or")}</div>
      <form onSubmit={submit} className="space-y-3">
        <Input type="email" required placeholder={t("auth.email")} value={email} onChange={(e) => setEmail(e.target.value)} className="h-12 rounded-2xl" />
        <Input type="password" required minLength={6} placeholder={t("auth.password")} value={password} onChange={(e) => setPassword(e.target.value)} className="h-12 rounded-2xl" />
        <Button disabled={busy} className="glow h-12 w-full rounded-2xl active:scale-95">
          {mode === "in" ? t("auth.signIn") : t("auth.signUp")}
        </Button>
      </form>
      <button onClick={() => setMode(mode === "in" ? "up" : "in")} className="mt-6 min-h-11 text-sm text-muted-foreground">
        {mode === "in" ? t("auth.toSignUp") : t("auth.toSignIn")}
      </button>
    </main>
  );
}
