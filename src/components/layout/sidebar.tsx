"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { PerspectiveToggle } from "@/components/ui/perspective-toggle";
import { useAuth } from "@/contexts/auth-context";
import {
  LayoutDashboard,
  Wallet,
  CheckSquare,
  Store,
  Users,
  ChevronLeft,
  ChevronRight,
  Heart,
  LogOut,
} from "lucide-react";
import { useState } from "react";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/budget", label: "Budget", icon: Wallet },
  { href: "/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/vendors", label: "Vendors", icon: Store },
  { href: "/guests", label: "Guests", icon: Users },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col border-r border-border bg-card transition-all duration-300",
        collapsed ? "w-[68px]" : "w-[260px]"
      )}
    >
      <div className="flex h-16 items-center gap-2 border-b border-border px-4">
        <Heart size={24} className="shrink-0 text-accent-emerald" fill="currentColor" />
        {!collapsed && (
          <span className="text-lg font-bold tracking-tight">
            Shaadi<span className="text-accent-gold">OS</span>
          </span>
        )}
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent-emerald/10 text-accent-emerald"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon size={20} className="shrink-0" />
              {!collapsed && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-3 space-y-3">
        {!collapsed && <PerspectiveToggle />}

        {!collapsed && user && (
          <div className="rounded-lg bg-muted px-3 py-2">
            <p className="truncate text-xs font-medium text-foreground">
              {user.email}
            </p>
          </div>
        )}

        <button
          onClick={signOut}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors",
            collapsed && "justify-center"
          )}
        >
          <LogOut size={18} className="shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>

        <button
          onClick={() => setCollapsed((c) => !c)}
          className="flex w-full items-center justify-center rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
    </aside>
  );
}
