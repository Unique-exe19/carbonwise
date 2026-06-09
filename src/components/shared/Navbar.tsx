"use client";

import { Bell, Menu, Search } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { ThemeToggle } from "./ThemeToggle";
import { cn, getInitials } from "@/lib/utils";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export function Navbar() {
  const { setSidebarOpen, unreadNotifications } = useAppStore();
  const { data: session } = useSession();

  return (
    <header
      className={cn(
        "sticky top-0 z-30 h-14 flex items-center justify-between gap-4 px-4 md:px-6",
        "bg-white/80 dark:bg-[#0a0a0f]/80 backdrop-blur-xl",
        "border-b border-zinc-200 dark:border-white/[0.04]",
      )}
      role="banner"
    >
      {/* Left: Mobile menu + Search */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg hover:bg-zinc-100 dark:hover:bg-white/[0.04] transition-colors text-zinc-500 dark:text-zinc-400 cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/[0.04] w-56">
          <Search className="w-3.5 h-3.5 text-zinc-500" />
          <input
            type="search"
            placeholder="Search activities, tips..."
            className="bg-transparent text-sm w-full outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-600 text-zinc-800 dark:text-zinc-300"
            aria-label="Search"
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <ThemeToggle />

        {/* Notifications */}
        <button
          className={cn(
            "relative flex items-center justify-center w-8 h-8 rounded-lg cursor-pointer",
            "bg-zinc-100 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/[0.04] hover:bg-zinc-200 dark:hover:bg-white/[0.06]",
            "transition-all duration-200 text-zinc-500 dark:text-zinc-400",
          )}
          aria-label={`Notifications${unreadNotifications > 0 ? ` (${unreadNotifications} unread)` : ""}`}
        >
          <Bell className="w-3.5 h-3.5" />
          {unreadNotifications > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center rounded-full bg-red-500 text-white text-[9px] font-bold">
              {unreadNotifications > 9 ? "9+" : unreadNotifications}
            </span>
          )}
        </button>

        {/* User avatar */}
        <Link href="/profile" className="flex items-center gap-2 ml-1" aria-label="View profile">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white text-xs font-semibold shadow-lg shadow-emerald-500/15 overflow-hidden">
            {session?.user?.image ? (
              <Image src={session.user.image} alt="User Avatar" width={32} height={32} className="w-full h-full object-cover" />
            ) : (
              getInitials(session?.user?.name)
            )}
          </div>
        </Link>
      </div>
    </header>
  );
}
