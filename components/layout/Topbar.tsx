"use client";

import { useState } from "react";
import type { KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { Bell, Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export interface TopbarProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
}

/**
 * Shared header bar for every inner app page (Discover, Opportunity Detail,
 * Compare, Test Plan, Progress). Not used on the Welcome screen.
 *
 * Search is always real, never a fake control: on Discover, typing filters
 * live via `searchValue`/`onSearchChange`. Everywhere else, those props
 * aren't passed, so this falls back to its own local, uncontrolled value —
 * typing and pressing Enter navigates to `/discover?search=...`, which
 * Discover reads back out as its initial search query. Pressing Enter
 * while already on Discover just makes the current search shareable via
 * the URL; the results don't change, since they're already filtered live.
 *
 * Two other honesty adjustments from the source design: the region chip
 * lost its dropdown chevron (there's only one region of sample data, so
 * implying a working dropdown would be a fake control), and the
 * notification bell lost its unread dot (no real notification system
 * behind it yet).
 */
export function Topbar({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search opportunities, skills or industries",
}: TopbarProps) {
  const router = useRouter();
  const [localValue, setLocalValue] = useState("");

  const isControlled = onSearchChange !== undefined;
  const value = isControlled ? (searchValue ?? "") : localValue;

  function handleChange(next: string) {
    if (onSearchChange) {
      onSearchChange(next);
    } else {
      setLocalValue(next);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter") return;
    const query = value.trim();
    router.push(
      query ? `/discover?search=${encodeURIComponent(query)}` : "/discover",
    );
  }

  return (
    <div className="flex h-16 items-center justify-between gap-4 border-b border-border bg-background px-4 sm:px-8">
      <div className="relative max-w-md flex-1">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        {/* Two inputs, not one — CSS (not JS) decides which is visible per
            breakpoint, so there's no hydration timing issue and only ever
            one is actually interactive at a time (the other is fully
            removed from layout/accessibility via `hidden`). Both share the
            same value/handlers, so switching breakpoints never loses what
            was typed. */}
        <Input
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search opportunities…"
          className="pl-9 sm:hidden"
        />
        <Input
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={searchPlaceholder}
          className="hidden pl-9 sm:block"
        />
      </div>

      <div className="flex shrink-0 items-center gap-3 sm:gap-4">
        <span className="hidden items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm sm:flex">
          <span aria-hidden>🇬🇧</span>
          United Kingdom
        </span>
        <Bell aria-hidden className="size-5 text-muted-foreground" />
        <Avatar>
          <AvatarFallback>AM</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}
