import { createFileRoute } from "@tanstack/react-router";
import { ShellPage } from "@/components/ShellPage";

export const Route = createFileRoute("/markets")({
  head: () => ({
    meta: [
      { title: "Markets — DiSTRUB" },
      { name: "description", content: "Trade YES/NO on creator milestones." },
      { property: "og:title", content: "Markets — DiSTRUB" },
      { property: "og:description", content: "Trade YES/NO on creator milestones." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <ShellPage titleKey="nav.markets" />,
});
