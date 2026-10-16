import { createFileRoute } from "@tanstack/react-router";
import { ShellPage } from "@/components/ShellPage";

export const Route = createFileRoute("/deal-room")({
  head: () => ({
    meta: [
      { title: "Deal Room — DiSTRUB" },
      { name: "description", content: "Audited communities and channels for sale or rent." },
      { property: "og:title", content: "Deal Room — DiSTRUB" },
      { property: "og:description", content: "Audited communities and channels for sale or rent." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <ShellPage titleKey="nav.dealRoom" />,
});
