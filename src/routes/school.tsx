import { createFileRoute } from "@tanstack/react-router";
import { ShellPage } from "@/components/ShellPage";

export const Route = createFileRoute("/school")({
  head: () => ({
    meta: [
      { title: "DiSTRUB School — DiSTRUB" },
      { name: "description", content: "Learn to create, operate, acquire and resell attention businesses." },
      { property: "og:title", content: "DiSTRUB School — DiSTRUB" },
      { property: "og:description", content: "Learn to create, operate, acquire and resell attention businesses." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <ShellPage titleKey="nav.school" />,
});
