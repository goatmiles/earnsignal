import {
  BarChart3,
  Bookmark,
  CheckSquare,
  Compass,
  Database,
  Settings,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Extra path prefixes that should also count as "active" for this item. */
  activePrefixes?: string[];
  /** No real destination yet in this build — rendered but not clickable. */
  disabled?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Discover",
    href: "/discover",
    icon: Compass,
    // The source design treats opportunity detail pages as part of Discover
    // for nav-highlighting purposes (confirmed in the Evidence screenshot).
    activePrefixes: ["/opportunity"],
  },
  {
    label: "Saved",
    href: "/discover?saved=true",
    icon: Bookmark,
  },
  {
    label: "Compare",
    href: "/compare",
    icon: BarChart3,
  },
  {
    label: "My Plans",
    href: "/test-plan",
    icon: CheckSquare,
  },
  {
    label: "Progress",
    href: "/progress",
    icon: TrendingUp,
  },
  {
    label: "Sources",
    href: "/sources",
    icon: Database,
    disabled: true,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
    disabled: true,
  },
];

/**
 * Shared so Sidebar and MobileNav always agree on which item is "active".
 *
 * `isSavedOnly` disambiguates Discover vs Saved, which both point at
 * "/discover" and are only told apart by the `?saved=true` query string —
 * without this, both items would read as active together any time you're
 * on /discover, regardless of which view is actually showing.
 */
export function isNavItemActive(
  item: NavItem,
  pathname: string,
  isSavedOnly: boolean,
): boolean {
  const ownPath = item.href.split("?")[0];
  const matchesPath =
    pathname === ownPath ||
    (item.activePrefixes ?? []).some((prefix) => pathname.startsWith(prefix));

  if (!matchesPath) return false;

  if (ownPath === "/discover") {
    const wantsSavedOnly = item.href.includes("saved=true");
    return wantsSavedOnly === isSavedOnly;
  }

  return true;
}
