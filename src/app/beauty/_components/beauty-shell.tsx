"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ScanHeart,
  CalendarHeart,
  UserCircle,
  Sparkle,
  ChevronLeft,
  ChevronRight,
  Droplets,
  Wand2,
  Flower2,
  MessageCircleHeart
} from "lucide-react";
import { useState } from "react";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/beauty/dashboard",
    icon: LayoutDashboard,
    description: "Overview & routines",
  },
  {
    label: "Scanner",
    href: "/beauty/scanner",
    icon: ScanHeart,
    description: "Analyze products",
  },
  {
    label: "Chat",
    href: "/beauty/chat",
    icon: MessageCircleHeart,
    description: "Beauty AI",
  },
  {
    label: "Planner",
    href: "/beauty/planner",
    icon: CalendarHeart,
    description: "Routines & goals",
  },
  {
    label: "Profile",
    href: "/beauty/profile",
    icon: UserCircle,
    description: "Skin profile",
  },
];

export function BeautyShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div 
      className="flex h-screen w-full overflow-hidden bg-background"
      style={{
        "--primary": "oklch(0.65 0.25 340)",
        "--primary-foreground": "oklch(0.98 0.01 350)",
        "--ring": "oklch(0.65 0.25 340)",
        "--secondary": "oklch(0.7 0.15 320)",
        "--secondary-foreground": "oklch(0.98 0.01 350)",
      } as React.CSSProperties}
    >
      {/* ─── Desktop Sidebar ─── */}
      <aside
        className={cn(
          "hidden md:flex flex-col border-r border-border/50 bg-card/50 backdrop-blur-xl transition-all duration-300 ease-in-out relative z-20",
          collapsed ? "w-[72px]" : "w-[260px]"
        )}
      >
        {/* Brand header */}
        <div className="flex items-center gap-3 px-5 h-16 border-b border-border/50">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-linear-to-br from-pink-400 to-rose-500 shadow-lg shadow-rose-500/25">
            <Sparkle className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div className="flex flex-col animate-in fade-in duration-200">
              <span className="text-sm font-bold tracking-tight text-foreground">
                AuraScan
              </span>
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                Beauty AI
              </span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-1 px-3 py-4">
          {!collapsed && (
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/60 px-2 mb-2">
              Menu
            </span>
          )}
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 relative",
                  collapsed && "justify-center px-0",
                  isActive
                    ? "bg-primary/10 text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                )}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-primary" />
                )}
                <item.icon
                  className={cn(
                    "shrink-0 transition-colors duration-200",
                    collapsed ? "w-5 h-5" : "w-[18px] h-[18px]",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground group-hover:text-foreground"
                  )}
                />
                {!collapsed && (
                  <div className="flex flex-col animate-in fade-in duration-200">
                    <span>{item.label}</span>
                    <span className="text-[10px] text-muted-foreground/60 font-normal">
                      {item.description}
                    </span>
                  </div>
                )}
                {/* Tooltip for collapsed */}
                {collapsed && (
                  <div className="absolute left-full ml-2 px-2.5 py-1 rounded-md bg-popover border border-border text-xs font-medium text-popover-foreground shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Collapse toggle */}
        <div className="px-3 py-3 border-t border-border/50">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center justify-center w-full h-9 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all duration-200"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <div className="flex items-center gap-2 text-xs font-medium">
                <ChevronLeft className="w-4 h-4" />
                Collapse
              </div>
            )}
          </button>
        </div>
      </aside>

      {/* ─── Main Content ─── */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto pb-20 md:pb-0">{children}</div>
      </main>

      {/* ─── Mobile Bottom Tab Bar ─── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-xl border-t border-border/50 safe-bottom">
        <div className="flex items-center justify-around px-2 h-16">
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 min-w-[56px]",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground active:scale-95"
                )}
              >
                <div className="relative">
                  <item.icon
                    className={cn(
                      "w-5 h-5 transition-all duration-200",
                      isActive && "drop-shadow-[0_0_8px_var(--primary)]"
                    )}
                  />
                  {isActive && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-primary animate-pulse" />
                  )}
                </div>
                <span
                  className={cn(
                    "text-[10px] font-semibold transition-colors duration-200",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
