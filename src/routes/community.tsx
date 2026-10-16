import { createFileRoute } from "@tanstack/react-router";
import { ShellPage } from "@/components/ShellPage";

export const Route = createFileRoute("/community")({
  head: () => ({
    meta: [
      { title: "Community — DiSTRUB" },
      { name: "description", content: "The DiSTRUB community of creators and buyers." },
      { property: "og:title", content: "Community — DiSTRUB" },
      { property: "og:description", content: "The DiSTRUB community of creators and buyers." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <ShellPage titleKey="nav.community" />,
});
