import { createFileRoute } from "@tanstack/react-router";
import { ShellPage } from "@/components/ShellPage";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio — DiSTRUB" },
      { name: "description", content: "Your positions across creator markets." },
      { property: "og:title", content: "Portfolio — DiSTRUB" },
      { property: "og:description", content: "Your positions across creator markets." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <ShellPage titleKey="nav.portfolio" />,
});
