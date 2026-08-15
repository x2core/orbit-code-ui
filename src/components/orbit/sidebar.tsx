import { useMemo, useState } from "react";
import {
  ChevronsLeft,
  ChevronsRight,
  LogOut,
  Moon,
  PanelsTopLeft,
  Plus,
  Search,
  Settings,
  Sun,
} from "lucide-react";

import orbitLogo from "@/assets/orbit-logo.png";
import { IconButton } from "@/components/orbit/icon-button";
import { SESSIONS } from "@/lib/orbit-data";
import { cn } from "@/lib/utils";

type SidebarProps = {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  activeId: string;
  onSelect: (id: string) => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
};

export function OrbitSidebar({
  collapsed,
  onToggleCollapsed,
  activeId,
  onSelect,
  theme,
  onToggleTheme,
}: SidebarProps) {
  const [groupBy, setGroupBy] = useState<"date" | "tag">("date");

  const groups = useMemo(() => {
    const map = new Map<string, typeof SESSIONS>();
    for (const session of SESSIONS) {
      const key = groupBy === "date" ? session.group : session.tag;
      map.set(key, [...(map.get(key) ?? []), session]);
    }
    return [...map.entries()];
  }, [groupBy]);

  return (
    <aside
      className={cn(
        "panel-glass z-20 m-3 mr-0 flex shrink-0 flex-col rounded-3xl transition-[width] duration-300 ease-out",
        collapsed ? "w-[68px]" : "w-[272px]",
      )}
    >
      <div
        className={cn(
          "flex items-center gap-2 px-3 pb-2 pt-3",
          collapsed && "flex-col gap-1",
        )}
      >
        <img
          src={orbitLogo}
          alt="Orbit Code"
          width={512}
          height={512}
          className="size-8 shrink-0 rounded-xl object-contain"
        />
        <span
          className={cn(
            "min-w-0 flex-1 truncate text-sm font-semibold tracking-tight transition-opacity duration-200",
            collapsed && "pointer-events-none opacity-0",
          )}
        >
          Orbit Code
        </span>
        <IconButton
          label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          side="right"
          onClick={onToggleCollapsed}
        >
          {collapsed ? <ChevronsRight /> : <ChevronsLeft />}
        </IconButton>
      </div>

      <div className={cn("flex items-center gap-1 px-3", collapsed && "flex-col")}>
        <button
          type="button"
          className={cn(
            "flex h-9 items-center gap-2 rounded-xl bg-primary px-3 text-sm font-medium text-primary-foreground shadow-soft transition-transform duration-200 hover:-translate-y-px",
            collapsed ? "w-9 justify-center px-0" : "flex-1",
          )}
          aria-label="New session"
        >
          <Plus className="size-4 shrink-0" />
          {!collapsed && <span className="truncate">New session</span>}
        </button>
        <IconButton label="Search sessions" side="right">
          <Search />
        </IconButton>
      </div>

      {!collapsed && (
        <div className="mt-4 flex items-center justify-between px-4">
          <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Sessions
          </span>
          <div className="flex rounded-lg bg-secondary/70 p-0.5">
            {(["date", "tag"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setGroupBy(mode)}
                className={cn(
                  "rounded-md px-2 py-0.5 text-[11px] capitalize transition-colors duration-200",
                  groupBy === mode
                    ? "bg-card text-foreground shadow-soft"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      )}

      <nav className="mt-2 min-h-0 flex-1 space-y-4 overflow-y-auto px-2 pb-2">
        {collapsed
          ? SESSIONS.map((session) => (
              <IconButton
                key={session.id}
                label={session.title}
                side="right"
                onClick={() => onSelect(session.id)}
                className={cn(
                  "mx-auto",
                  activeId === session.id && "bg-sidebar-accent text-foreground",
                )}
              >
                <PanelsTopLeft />
              </IconButton>
            ))
          : groups.map(([label, items]) => (
              <div key={label}>
                <p className="px-3 pb-1 text-[11px] font-medium capitalize text-muted-foreground/80">
                  {label}
                </p>
                <ul className="space-y-0.5">
                  {items.map((session) => (
                    <li key={session.id}>
                      <button
                        type="button"
                        onClick={() => onSelect(session.id)}
                        className={cn(
                          "hover-ghost group w-full rounded-xl px-3 py-2 text-left",
                          activeId === session.id &&
                            "bg-sidebar-accent/80 shadow-soft",
                        )}
                      >
                        <span className="flex items-center gap-2">
                          <span className="min-w-0 flex-1 truncate text-[13px] font-medium">
                            {session.title}
                          </span>
                          <span className="rounded-md border border-border/70 px-1.5 py-px text-[10px] text-muted-foreground opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                            {session.tag}
                          </span>
                        </span>
                        <span className="mt-0.5 block truncate text-[11px] text-muted-foreground">
                          {session.preview}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
      </nav>

      <div
        className={cn(
          "m-2 flex items-center gap-2 rounded-2xl border border-border/70 bg-card/60 p-2",
          collapsed && "flex-col",
        )}
      >
        <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-accent text-xs font-semibold text-accent-foreground">
          OV
        </span>
        {!collapsed && (
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[13px] font-medium">Oliver Valiente</span>
            <span className="block truncate text-[11px] text-muted-foreground">Pro workspace</span>
          </span>
        )}
        <div className={cn("flex items-center gap-0.5", collapsed && "flex-col")}>
          <IconButton
            label={theme === "dark" ? "Light mode" : "Dark mode"}
            side="right"
            onClick={onToggleTheme}
          >
            {theme === "dark" ? <Sun /> : <Moon />}
          </IconButton>
          <IconButton label="Settings" side="right">
            <Settings />
          </IconButton>
          <IconButton label="Sign out" side="right">
            <LogOut />
          </IconButton>
        </div>
      </div>
    </aside>
  );
}
