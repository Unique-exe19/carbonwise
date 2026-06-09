"use client";

import { Sun, Moon, Monitor } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

const themes = [
  { value: "light" as const, icon: Sun, label: "Light" },
  { value: "dark" as const, icon: Moon, label: "Dark" },
  { value: "system" as const, icon: Monitor, label: "System" },
];

export function ThemeToggle() {
  const { theme, setTheme } = useAppStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentTheme = themes.find((t) => t.value === theme) || themes[2];
  const Icon = currentTheme.icon;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center justify-center w-8 h-8 rounded-lg cursor-pointer",
          "bg-zinc-100 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/[0.04] hover:bg-zinc-200 dark:hover:bg-white/[0.06] text-zinc-500 dark:text-zinc-400",
          "transition-all duration-200",
        )}
        aria-label={`Current theme: ${currentTheme.label}. Click to change.`}
      >
        <Icon className="w-3.5 h-3.5" />
      </button>

      {open && (
        <div
          className={cn(
            "absolute right-0 top-full mt-2 py-1 w-36",
            "card-base border border-zinc-200 dark:border-white/[0.06] shadow-lg z-50",
            "animate-scale-in origin-top-right",
          )}
        >
          {themes.map(({ value, icon: ThemeIcon, label }) => (
            <button
              key={value}
              onClick={() => {
                setTheme(value);
                setOpen(false);
              }}
              className={cn(
                "flex items-center gap-2 w-full px-3 py-2 text-sm text-left cursor-pointer",
                "hover:bg-zinc-100 dark:hover:bg-white/[0.03] transition-colors text-zinc-700 dark:text-zinc-300",
                theme === value &&
                  "text-emerald-600 dark:text-emerald-400 font-medium",
              )}
            >
              <ThemeIcon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
