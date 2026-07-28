import { Bookmark } from "lucide-react";

import { cn } from "@/lib/utils";

interface SaveButtonProps {
  saved: boolean;
  onToggle: () => void;
  className?: string;
}

export function SaveButton({ saved, onToggle, className }: SaveButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={saved}
      aria-label={saved ? "Remove from saved" : "Save opportunity"}
      title={saved ? "Remove from saved" : "Save opportunity"}
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors outline-none focus-visible:ring-2 focus-visible:ring-accent",
        saved
          ? "text-accent"
          : "text-muted-foreground hover:bg-card hover:text-foreground",
        className,
      )}
    >
      <Bookmark className={cn("size-5", saved && "fill-current")} />
    </button>
  );
}
