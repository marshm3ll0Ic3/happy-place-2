import { createFileRoute } from "@tanstack/react-router";
import { ShellPage } from "@/components/ShellPage";

export const Route = createFileRoute("/value")({
  head: () => ({
    meta: [
      { title: "Value — DiSTRUB" },
      { name: "description", content: "Get a live valuation of your audience." },
      { property: "og:title", content: "Value — DiSTRUB" },
      { property: "og:description", content: "Get a live valuation of your audience." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <ShellPage titleKey="nav.value" />,
});
