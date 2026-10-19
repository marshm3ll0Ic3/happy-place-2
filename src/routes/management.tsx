import { createFileRoute } from "@tanstack/react-router";
import { ShellPage } from "@/components/ShellPage";

export const Route = createFileRoute("/management")({
  head: () => ({
    meta: [
      { title: "Management — DiSTRUB" },
      { name: "description", content: "Unavailable secondary management module. No mandates, bidding or financial rights are operational." },
      { property: "og:title", content: "Management — DiSTRUB" },
      { property: "og:description", content: "Unavailable secondary management module. No mandates, bidding or financial rights are operational." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <ShellPage titleKey="nav.management" />,
});
