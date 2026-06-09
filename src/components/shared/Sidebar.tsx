"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import {
  LayoutDashboard, Calculator, Sparkles, Trophy, Users,
  User, Settings, ChevronLeft, Leaf, Plus, Flame, X, Home,
} from "lucide-react";

const navItems = [
  { href: "/", icon: Home, label: "Home Page" },
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/tracker", icon: Calculator, label: "Carbon Tracker" },
  { href: "/insights", icon: Sparkles, label: "AI Insights" },
  { href: "/challenges", icon: Trophy, label: "Challenges" },
  { href: "/community", icon: Users, label: "Community" },
  { href: "/profile", icon: User, label: "Profile" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar, setSidebarOpen, setShowQuickAdd } =
    useAppStore();

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full flex flex-col",
          "bg-white dark:bg-[#0d0d14] border-r border-zinc-200 dark:border-white/[0.04]",
          "transition-all duration-300 ease-in-out",
          sidebarOpen ? "w-[260px]" : "w-[68px]",
          "lg:relative",
          !sidebarOpen && "max-lg:-translate-x-full lg:translate-x-0",
          sidebarOpen && "max-lg:translate-x-0",
        )}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-zinc-200 dark:border-white/[0.04]">
          <Link href="/" className="flex items-center gap-2.5 min-w-0" title="Go to home page">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shrink-0 shadow-lg shadow-emerald-500/20">
              <Leaf className="w-4.5 h-4.5" />
            </div>
            {sidebarOpen && (
              <span className="font-heading text-base font-bold text-gradient truncate">
                CarbonWise
              </span>
            )}
          </Link>
          <button
            onClick={toggleSidebar}
            className={cn(
              "hidden lg:flex items-center justify-center w-7 h-7 rounded-lg cursor-pointer",
              "hover:bg-zinc-100 dark:hover:bg-white/[0.04] transition-colors text-zinc-500",
              !sidebarOpen && "rotate-180",
            )}
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden flex items-center justify-center w-7 h-7 rounded-lg hover:bg-zinc-100 dark:hover:bg-white/[0.04] text-zinc-500 cursor-pointer"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Add Button */}
        <div className="px-3 pt-4 pb-2">
          <button
            onClick={() => setShowQuickAdd(true)}
            className={cn(
              "flex items-center gap-2.5 w-full rounded-xl",
              "bg-gradient-to-r from-emerald-500 to-teal-600",
              "text-white font-medium shadow-lg shadow-emerald-500/15",
              "hover:shadow-emerald-500/25 hover:brightness-110",
              "transition-all duration-200 text-sm",
              sidebarOpen ? "px-4 py-2.5" : "px-0 py-2.5 justify-center",
            )}
            aria-label="Log new activity"
          >
            <Plus className="w-4 h-4 shrink-0" />
            {sidebarOpen && <span>Log Activity</span>}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto no-scrollbar py-2 px-3 space-y-0.5">
          {navItems.map(({ href, icon: Icon, label }) => {
            const isActive = href === "/"
              ? pathname === "/"
              : pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-2.5 rounded-xl px-3 py-2.5",
                  "transition-all duration-200 group relative text-sm",
                  isActive
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium border border-emerald-500/10"
                    : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-white/[0.03] hover:text-zinc-800 dark:hover:text-zinc-300",
                  !sidebarOpen && "justify-center px-0",
                )}
                aria-current={isActive ? "page" : undefined}
                onClick={() => {
                  if (window.innerWidth < 1024) setSidebarOpen(false);
                }}
              >
                <Icon className={cn("w-[18px] h-[18px] shrink-0", isActive ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-700 dark:group-hover:text-zinc-300")} />
                {sidebarOpen && <span className="truncate">{label}</span>}
                {!sidebarOpen && (
                  <div className="absolute left-full ml-2 px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#1a1a24] border border-zinc-200 dark:border-white/[0.06] text-zinc-800 dark:text-zinc-300 text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-xl">
                    {label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Streak indicator (bottom) */}
        {sidebarOpen && (
          <div className="p-3 border-t border-zinc-200 dark:border-white/[0.04]">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-orange-500/[0.06] border border-orange-500/10">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-orange-400 to-red-500 text-white shadow-lg shadow-orange-500/15">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-orange-500 dark:text-orange-400">7 Day Streak</p>
                <p className="text-[11px] text-orange-600/60 dark:text-orange-500/50">Keep it going!</p>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
