"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Menu, X, Zap } from "lucide-react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { NAV_ITEMS, isNavItemActive } from "./nav-items";

/**
 * Mobile-only navigation: a slim top bar (logo + menu button) plus a
 * slide-in drawer with the same nav items as Sidebar. Visible below `lg`,
 * where Sidebar is hidden.
 */
export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the drawer on route change. Comparing against the previous
  // pathname during render (rather than in a useEffect) avoids the extra
  // render pass a `setState` inside an effect would cause here — this is
  // React's documented pattern for "adjusting state when a prop changes".
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div className="lg:hidden">
      <div className="flex h-14 items-center justify-between border-b border-border bg-panel px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-accent">
            <Zap className="size-4 text-accent-foreground" />
          </div>
          <span className="font-bold tracking-tight">EarnSignal</span>
        </Link>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          aria-expanded={open}
          className="flex size-9 items-center justify-center rounded-lg text-foreground hover:bg-card"
        >
          <Menu className="size-5" />
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-background/80"
          />

          {/* Drawer */}
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Navigation"
            className="relative flex h-full w-72 max-w-[80vw] flex-col justify-between border-r border-border bg-panel p-6"
          >
            <div className="flex flex-col gap-8">
              <div className="flex items-center justify-between">
                <Link
                  href="/"
                  className="flex items-center gap-2"
                  onClick={() => setOpen(false)}
                >
                  <div className="flex size-8 items-center justify-center rounded-lg bg-accent">
                    <Zap className="size-5 text-accent-foreground" />
                  </div>
                  <span className="text-lg font-bold tracking-tight">
                    EarnSignal
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-card hover:text-foreground"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* useSearchParams (needed to tell Discover and Saved apart)
                  requires a Suspense boundary for pages that would otherwise
                  be statically prerendered, like /compare. The fallback
                  assumes "not saved-only", correct for the vast majority of
                  page loads and only ever shown momentarily in the build's
                  static shell, not to real users. */}
              <Suspense
                fallback={
                  <NavList
                    pathname={pathname}
                    isSavedOnly={false}
                    onNavigate={() => setOpen(false)}
                  />
                }
              >
                <NavListWithSearchParams
                  pathname={pathname}
                  onNavigate={() => setOpen(false)}
                />
              </Suspense>
            </div>

            <div className="flex items-center gap-3 border-t border-border pt-4">
              <Avatar>
                <AvatarFallback>AM</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">Alex Morgan</span>
                <span className="text-xs text-muted-foreground">
                  Free Plan
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function NavListWithSearchParams({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate: () => void;
}) {
  const searchParams = useSearchParams();
  const isSavedOnly =
    pathname === "/discover" && searchParams.get("saved") === "true";
  return (
    <NavList pathname={pathname} isSavedOnly={isSavedOnly} onNavigate={onNavigate} />
  );
}

function NavList({
  pathname,
  isSavedOnly,
  onNavigate,
}: {
  pathname: string;
  isSavedOnly: boolean;
  onNavigate: () => void;
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
            onClick={onNavigate}
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
