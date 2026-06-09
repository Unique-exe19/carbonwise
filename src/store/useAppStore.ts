import { create } from "zustand";

interface AppState {
  // Sidebar
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  // Theme
  theme: "light" | "dark" | "system";
  setTheme: (theme: "light" | "dark" | "system") => void;

  // Notifications
  unreadNotifications: number;
  setUnreadNotifications: (count: number) => void;

  // Quick activity modal
  showQuickAdd: boolean;
  setShowQuickAdd: (show: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Sidebar
  sidebarOpen: true,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  // Theme
  theme: "system",
  setTheme: (theme) => {
    set({ theme });
    // Apply to DOM
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    if (theme === "system") {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      root.classList.add(prefersDark ? "dark" : "light");
    } else {
      root.classList.add(theme);
    }
    localStorage.setItem("theme", theme);
  },

  // Notifications
  unreadNotifications: 0,
  setUnreadNotifications: (count) => set({ unreadNotifications: count }),

  // Quick activity modal
  showQuickAdd: false,
  setShowQuickAdd: (show) => set({ showQuickAdd: show }),
}));
