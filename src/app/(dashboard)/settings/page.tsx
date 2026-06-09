"use client";

import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import {
  User,
  Palette,
  Bell,
  Shield,
  LogOut,
  Sun,
  Moon,
  Monitor,
  Check,
  Loader2,
  Settings,
} from "lucide-react";
import { EmojiIcon } from "@/components/shared/EmojiIcon";
import { useEffect } from "react";
import { getProfileSettings, updateProfileSettings } from "@/actions/profile";

const dietOptions = [
  { value: "VEGAN", label: "Vegan", icon: "🌱" },
  { value: "VEGETARIAN", label: "Vegetarian", icon: "🥦" },
  { value: "PESCATARIAN", label: "Pescatarian", icon: "🐟" },
  { value: "MIXED", label: "Mixed / Balanced", icon: "🍽" },
  { value: "HEAVY_MEAT", label: "Heavy Meat", icon: "🥩" },
];

const transportOptions = [
  { value: "CAR", label: "Car", icon: "🚗" },
  { value: "ELECTRIC_CAR", label: "Electric Car", icon: "⚡" },
  { value: "PUBLIC_TRANSIT", label: "Public Transit", icon: "🚌" },
  { value: "BICYCLE", label: "Bicycle", icon: "🚲" },
  { value: "WALKING", label: "Walking", icon: "🚶" },
];

export default function SettingsPage() {
  const { data: session } = useSession();
  const { theme, setTheme } = useAppStore();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [name, setName] = useState("");
  const [diet, setDiet] = useState("MIXED");
  const [transport, setTransport] = useState("CAR");
  const [notifications, setNotifications] = useState({
    dailyReminder: true,
    weeklyReport: true,
    achievements: true,
    community: false,
  });

  useEffect(() => {
    async function loadSettings() {
      const res = await getProfileSettings();
      if (res.success) {
        if (res.name) setName(res.name);
        if (res.dietType) setDiet(res.dietType);
        if (res.transportMode) setTransport(res.transportMode);
      }
    }
    void loadSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await updateProfileSettings({
        name,
        dietType: diet,
        transportMode: transport,
      });
      if (res.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch (err) {
      console.error("Save settings error:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold font-heading text-zinc-100 flex items-center gap-2">
          <Settings className="w-7 h-7 text-emerald-400" /> Settings
        </h1>
        <p className="text-zinc-400 mt-1">
          Manage your account preferences
        </p>
      </div>

      {/* Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-base p-6"
      >
        <h2 className="font-semibold font-heading flex items-center gap-2 mb-4 text-zinc-100">
          <User className="w-4 h-4 text-emerald-400" /> Profile
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5 text-zinc-300">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={cn(
                "w-full px-4 py-2.5 rounded-xl text-sm",
                "bg-white/[0.03] border border-white/[0.08] text-zinc-100",
                "outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500",
              )}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 text-zinc-300">Email</label>
            <input
              type="email"
              defaultValue={session?.user?.email || ""}
              disabled
              className={cn(
                "w-full px-4 py-2.5 rounded-xl text-sm",
                "bg-white/[0.01] border border-white/[0.04]",
                "text-zinc-500 cursor-not-allowed",
              )}
            />
          </div>

          {/* Diet Preference */}
          <div>
            <label className="block text-sm font-medium mb-2 text-zinc-350">Diet Type</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {dietOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setDiet(opt.value)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-left border transition-all cursor-pointer",
                    diet === opt.value
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-400 font-medium"
                      : "border-white/[0.08] bg-white/[0.02] text-zinc-300 hover:border-white/[0.15] hover:bg-white/[0.04]",
                  )}
                >
                  <EmojiIcon emoji={opt.icon} className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Transport */}
          <div>
            <label className="block text-sm font-medium mb-2 text-zinc-350">Primary Transport</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {transportOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setTransport(opt.value)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-left border transition-all cursor-pointer",
                    transport === opt.value
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-400 font-medium"
                      : "border-white/[0.08] bg-white/[0.02] text-zinc-300 hover:border-white/[0.15] hover:bg-white/[0.04]",
                  )}
                >
                  <EmojiIcon emoji={opt.icon} className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Appearance */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card-base p-6"
      >
        <h2 className="font-semibold font-heading flex items-center gap-2 mb-4 text-zinc-100">
          <Palette className="w-4 h-4 text-emerald-400" /> Appearance
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: "light" as const, label: "Light", icon: Sun },
            { value: "dark" as const, label: "Dark", icon: Moon },
            { value: "system" as const, label: "System", icon: Monitor },
          ].map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setTheme(value)}
              className={cn(
                "flex flex-col items-center gap-2 p-4 rounded-xl border transition-all cursor-pointer",
                theme === value
                  ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                  : "border-white/[0.08] bg-white/[0.02] text-zinc-300 hover:border-white/[0.15] hover:bg-white/[0.04]",
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{label}</span>
              {theme === value && (
                <Check className="w-4 h-4 text-emerald-400" />
              )}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card-base p-6"
      >
        <h2 className="font-semibold font-heading flex items-center gap-2 mb-4 text-zinc-100">
          <Bell className="w-4 h-4 text-emerald-400" /> Notifications
        </h2>
        <div className="space-y-3">
          {Object.entries(notifications).map(([key, enabled]) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-sm text-zinc-200">
                {key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}
              </span>
              <button
                onClick={() =>
                  setNotifications((prev) => ({
                    ...prev,
                    [key]: !prev[key as keyof typeof prev],
                  }))
                }
                className={cn(
                  "relative w-11 h-6 rounded-full transition-colors cursor-pointer",
                  enabled ? "bg-emerald-500" : "bg-white/[0.08] border border-white/[0.12]",
                )}
                role="switch"
                aria-checked={enabled}
              >
                <span
                  className={cn(
                    "absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow-sm",
                    enabled && "translate-x-5",
                  )}
                />
              </button>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Security */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card-base p-6"
      >
        <h2 className="font-semibold font-heading flex items-center gap-2 mb-4 text-zinc-100">
          <Shield className="w-4 h-4 text-emerald-400" /> Account
        </h2>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </motion.div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className={cn(
          "w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold cursor-pointer",
          saved
            ? "bg-emerald-500 text-white"
            : "bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:brightness-110 shadow-lg shadow-emerald-500/20",
          "disabled:opacity-50 transition-all",
        )}
      >
        {saving ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : saved ? (
          <>
            <Check className="w-4 h-4" /> Saved!
          </>
        ) : (
          "Save Changes"
        )}
      </button>
    </div>
  );
}
