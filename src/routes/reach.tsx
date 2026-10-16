import { createFileRoute } from "@tanstack/react-router";
import { ShellPage } from "@/components/ShellPage";

export const Route = createFileRoute("/reach")({
  head: () => ({
    meta: [
      { title: "Reach — DiSTRUB" },
      { name: "description", content: "Book real reach from creators." },
      { property: "og:title", content: "Reach — DiSTRUB" },
      { property: "og:description", content: "Book real reach from creators." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <ShellPage titleKey="nav.reach" />,
});
