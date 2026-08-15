import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { OrbitChat } from "@/components/orbit/chat";
import { OrbitSidebar } from "@/components/orbit/sidebar";
import { OrbitTopBar } from "@/components/orbit/topbar";
import { useTheme } from "@/components/orbit/use-theme";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SESSIONS } from "@/lib/orbit-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Orbit Code — Agentic Coding Assistant" },
      {
        name: "description",
        content:
          "Orbit Code is a minimalist agentic coding assistant workspace with session history, tool controls, and a flexible streaming prompt box.",
      },
      { property: "og:title", content: "Orbit Code — Agentic Coding Assistant" },
      {
        property: "og:description",
        content:
          "A warm, paper-cream chat workspace for agentic coding: sessions, tools, browser, background tasks, and streaming code answers.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeId, setActiveId] = useState(SESSIONS[0]!.id);
  const { theme, toggle } = useTheme();

  const active = SESSIONS.find((session) => session.id === activeId) ?? SESSIONS[0]!;

  return (
    <TooltipProvider delayDuration={200}>
      <div className="orbit-backdrop flex h-screen w-full overflow-hidden">
        <OrbitSidebar
          collapsed={collapsed}
          onToggleCollapsed={() => setCollapsed((value) => !value)}
          activeId={activeId}
          onSelect={setActiveId}
          theme={theme}
          onToggleTheme={toggle}
        />
        <main className="flex min-w-0 flex-1 flex-col">
          <OrbitTopBar title={active.title} tag={active.tag} />
          <OrbitChat />
        </main>
      </div>
    </TooltipProvider>
  );
}
