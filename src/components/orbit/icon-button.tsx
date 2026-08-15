import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type IconButtonProps = ComponentProps<typeof Button> & {
  label: string;
  side?: "top" | "bottom" | "left" | "right";
};

export function IconButton({
  label,
  side = "bottom",
  className,
  variant = "ghost",
  size = "icon-sm",
  ...props
}: IconButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          aria-label={label}
          className={cn(
            "rounded-xl text-muted-foreground hover:text-foreground hover-ghost",
            className,
          )}
          size={size}
          variant={variant}
          {...props}
        />
      </TooltipTrigger>
      <TooltipContent side={side} className="rounded-lg text-xs">
        {label}
      </TooltipContent>
    </Tooltip>
  );
}
