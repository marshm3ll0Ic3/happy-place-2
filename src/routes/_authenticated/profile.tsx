import { createFileRoute } from "@tanstack/react-router";
import { ShellPage } from "@/components/ShellPage";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [
      { title: "Profile — DiSTRUB" },
      { name: "description", content: "Your DiSTRUB profile." },
      { property: "og:title", content: "Profile — DiSTRUB" },
      { property: "og:description", content: "Your DiSTRUB profile." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <ShellPage titleKey="nav.profile" />,
});
