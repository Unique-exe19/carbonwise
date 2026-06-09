"use client";

import { 
  Car, Zap, Utensils, ShoppingBag, Droplet, Smartphone,
  Battery, Bike, Bus, Train, Plane, Footprints, Ship, Plug, 
  Globe, Sun, Wind, Flame, Hammer, Fish, Egg, GlassWater, 
  Pizza, Wheat, Leaf, Apple, Coffee, Cookie, Shirt, Laptop, 
  Home, BookOpen, ShoppingCart, Bath, Monitor, Tv, Gamepad, 
  Video, Cloud, Radio, Sprout, Search, Scissors, Trophy, 
  Megaphone, Target, Sparkles, AlertTriangle, HelpCircle,
  type LucideIcon
} from "lucide-react";

const EMOJI_MAP: Record<string, LucideIcon> = {
  // Categories & Travel
  "🚗": Car,
  "⚡": Zap,
  "🔋": Battery,
  "🏍️": Bike,
  "🚌": Bus,
  "🚆": Train,
  "🚇": Train,
  "✈️": Plane,
  "🛩️": Plane,
  "🚲": Bike,
  "🚶": Footprints,
  "🛴": Bike,
  "🚕": Car,
  " Ferry ": Ship,
  "⛴️": Ship,

  // Electricity
  "🔌": Plug,
  "🇺🇸": Globe,
  "🇪🇺": Globe,
  "🇮🇳": Globe,
  "🇨🇳": Globe,
  "☀️": Sun,
  "💨": Wind,
  "🔥": Flame,
  "⛏️": Hammer,

  // Food
  "🥩": Flame,
  "🍖": Flame,
  "🥓": Flame,
  "🍗": Flame,
  "🍽️": Utensils,
  "🍽": Utensils,
  "🥦": Leaf,
  "🐟": Fish,
  "🥚": Egg,
  "🥛": GlassWater,
  "🧀": Pizza,
  "🍚": Wheat,
  "🍝": Wheat,
  "🍞": Wheat,
  "🍎": Apple,
  "🥜": Leaf,
  "🫘": Leaf,
  "☕": Coffee,
  "🍫": Cookie,

  // Shopping
  "👕": Shirt,
  "👖": Shirt,
  "🧥": Shirt,
  "👟": Shirt,
  "🛍️": ShoppingBag,
  "🛍": ShoppingBag,
  "🛒": ShoppingCart,
  "📱": Smartphone,
  "💻": Laptop,
  "📟": Smartphone,
  "🪑": Home,
  "📚": BookOpen,

  // Water
  "💧": Droplet,
  "🚰": Droplet,
  "♨️": Flame,
  "🍶": GlassWater,
  "🚿": Droplet,
  "🛁": Bath,
  "👔": Shirt,

  // Devices
  "🖥️": Monitor,
  "📺": Tv,
  "🎮": Gamepad,
  "🎬": Video,
  "☁️": Cloud,
  "📡": Radio,

  // Badges & Milestones (from seed)
  "🌱": Sprout,
  "🔍": Search,
  "✂️": Scissors,
  "🏆": Trophy,
  "📢": Megaphone,
  "🎯": Target,
  "🌟": Sparkles,
  "🌍": Globe,
  "⚠️": AlertTriangle,
};

interface EmojiIconProps {
  emoji: string;
  className?: string;
}

export function EmojiIcon({ emoji, className }: EmojiIconProps) {
  // Trim and check mapping
  const cleanEmoji = emoji?.trim() || "";
  const IconComponent = EMOJI_MAP[cleanEmoji];

  if (!IconComponent) {
    // If not found in map, render a fallback HelpCircle
    return <HelpCircle className={className} />;
  }

  return <IconComponent className={className} />;
}
