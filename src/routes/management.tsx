import { createFileRoute } from "@tanstack/react-router";
import { ShellPage } from "@/components/ShellPage";

export const Route = createFileRoute("/management")({
  head: () => ({
    meta: [
      { title: "Management — DiSTRUB" },
      { name: "description", content: "Bid on creator management mandates." },
      { property: "og:title", content: "Management — DiSTRUB" },
      { property: "og:description", content: "Bid on creator management mandates." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <ShellPage titleKey="nav.management" />,
});
