import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { useT } from "@/lib/i18n";

export function ShellPage({ titleKey, children }: { titleKey: string; children?: ReactNode }) {
  const { t } = useT();
  return (
    <motion.main
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mx-auto max-w-3xl px-5 pb-28 pt-10 md:pb-16 md:pt-16"
    >
      <h1 className="text-4xl font-bold md:text-5xl">{t(titleKey)}</h1>
      {children ?? (
        <div className="mt-6 space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="glass h-24 animate-pulse rounded-sm" />
          ))}
          <p className="pt-4 text-center text-sm text-muted-foreground">
            <span className="font-medium text-primary">{t("shell.soon")}</span> — {t("shell.empty")}
          </p>
        </div>
      )}
    </motion.main>
  );
}
