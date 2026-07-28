"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Zap } from "lucide-react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { NAV_ITEMS, isNavItemActive } from "./nav-items";

/**
 * Desktop sidebar. Hidden below `lg`; MobileNav takes over on small screens.
 * "Sources" and "Settings" render for visual fidelity to the source design
 * (every screenshot shows all 7 items) but are disabled — this build has no
 * real destination for them yet, so they're not clickable rather than being
 * dead links.
 */
export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col justify-between border-r border-border bg-panel p-6 lg:flex">
      <div className="flex flex-col gap-8">
        <Link href="/" className="flex items-center gap-2 px-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-accent">
            <Zap className="size-5 text-accent-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight">EarnSignal</span>
        </Link>

        {/* useSearchParams (needed to tell Discover and Saved apart) requires
            a Suspense boundary for pages that would otherwise be statically
            prerendered, like /compare. The fallback assumes "not saved-only",
            which is correct for the vast majority of page loads and is only
            ever shown momentarily during the build's static shell, not to
            real users. */}
        <Suspense fallback={<NavList pathname={pathname} isSavedOnly={false} />}>
          <NavListWithSearchParams pathname={pathname} />
        </Suspense>
      </div>

      <div className="flex items-center gap-3 border-t border-border pt-4">
        <Avatar>
          <AvatarFallback>AM</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-sm font-medium">Alex Morgan</span>
          <span className="text-xs text-muted-foreground">Free Plan</span>
        </div>
      </div>
    </aside>
  );
}

function NavListWithSearchParams({ pathname }: { pathname: string }) {
  const searchParams = useSearchParams();
  const isSavedOnly =
    pathname === "/discover" && searchParams.get("saved") === "true";
  return <NavList pathname={pathname} isSavedOnly={isSavedOnly} />;
}

function NavList({
  pathname,
  isSavedOnly,
}: {
  pathname: string;
  isSavedOnly: boolean;
}) {
  return (
    <nav className="flex flex-col gap-1">
      {NAV_ITEMS.map((item) => {
        const active = isNavItemActive(item, pathname, isSavedOnly);
        const Icon = item.icon;

        if (item.disabled) {
          return (
            <div
              key={item.label}
              aria-disabled="true"
              className="flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground/50"
            >
              <Icon className="size-4" />
              <span className="text-sm font-medium">{item.label}</span>
              <span className="ml-auto text-[10px] uppercase tracking-wide text-muted-foreground/50">
                Soon
              </span>
            </div>
          );
        }

        return (
          <Link
            key={item.label}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-lg border border-transparent px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
              active &&
                "border-accent/40 bg-accent/10 text-accent hover:text-accent",
            )}
          >
            <Icon className="size-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
