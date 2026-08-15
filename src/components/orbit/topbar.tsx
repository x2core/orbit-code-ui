import { Globe, ListChecks, MoreHorizontal, Wrench } from "lucide-react";

import { IconButton } from "@/components/orbit/icon-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function OrbitTopBar({ title, tag }: { title: string; tag: string }) {
  return (
    <header className="flex items-center gap-3 px-6 pt-5">
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-[15px] font-semibold tracking-tight">{title}</h1>
        <p className="truncate text-xs text-muted-foreground">
          {tag} · agentic session · autosaved
        </p>
      </div>

      <div className="panel-glass flex items-center gap-0.5 rounded-2xl p-1">
        <IconButton label="Tools">
          <Wrench />
        </IconButton>
        <IconButton label="Browser">
          <Globe />
        </IconButton>
        <IconButton label="Background tasks">
          <ListChecks />
        </IconButton>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              aria-label="More options"
              size="icon-sm"
              variant="ghost"
              className="rounded-xl text-muted-foreground hover:text-foreground hover-ghost"
            >
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52 rounded-2xl">
            <DropdownMenuItem>Rename session</DropdownMenuItem>
            <DropdownMenuItem>Share read-only link</DropdownMenuItem>
            <DropdownMenuItem>Export transcript</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Session settings</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Delete session</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
