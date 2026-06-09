/**
 * Carbon emission factors — sourced from EPA, IPCC, and DEFRA datasets.
 * All values in kg CO₂e per unit specified.
 */

// ─── Travel Emission Factors (kg CO₂ per km per passenger) ─────────────────

export const TRAVEL_FACTORS = {
  car_petrol: { factor: 0.21, unit: "km", label: "Car (Petrol)", icon: "🚗" },
  car_diesel: { factor: 0.171, unit: "km", label: "Car (Diesel)", icon: "🚗" },
  car_electric: { factor: 0.053, unit: "km", label: "Electric Car", icon: "⚡" },
  car_hybrid: { factor: 0.12, unit: "km", label: "Hybrid Car", icon: "🔋" },
  motorcycle: { factor: 0.113, unit: "km", label: "Motorcycle", icon: "🏍️" },
  bus: { factor: 0.089, unit: "km", label: "Bus", icon: "🚌" },
  train: { factor: 0.041, unit: "km", label: "Train", icon: "🚆" },
  metro: { factor: 0.033, unit: "km", label: "Metro/Subway", icon: "🚇" },
  flight_short: { factor: 0.255, unit: "km", label: "Flight (<1500km)", icon: "✈️" },
  flight_long: { factor: 0.195, unit: "km", label: "Flight (>1500km)", icon: "🛩️" },
  bicycle: { factor: 0, unit: "km", label: "Bicycle", icon: "🚲" },
  walking: { factor: 0, unit: "km", label: "Walking", icon: "🚶" },
  e_scooter: { factor: 0.035, unit: "km", label: "E-Scooter", icon: "🛴" },
  taxi: { factor: 0.21, unit: "km", label: "Taxi/Ride-share", icon: "🚕" },
  ferry: { factor: 0.19, unit: "km", label: "Ferry", icon: "⛴️" },
} as const;

// ─── Electricity Emission Factors (kg CO₂ per kWh) ────────────────────────

export const ELECTRICITY_FACTORS = {
  grid_average: { factor: 0.42, unit: "kWh", label: "Grid Average", icon: "🔌" },
  grid_us: { factor: 0.42, unit: "kWh", label: "US Grid", icon: "🇺🇸" },
  grid_eu: { factor: 0.276, unit: "kWh", label: "EU Grid", icon: "🇪🇺" },
  grid_india: { factor: 0.82, unit: "kWh", label: "India Grid", icon: "🇮🇳" },
  grid_china: { factor: 0.58, unit: "kWh", label: "China Grid", icon: "🇨🇳" },
  solar: { factor: 0.05, unit: "kWh", label: "Solar", icon: "☀️" },
  wind: { factor: 0.011, unit: "kWh", label: "Wind", icon: "💨" },
  natural_gas: { factor: 0.181, unit: "kWh", label: "Natural Gas", icon: "🔥" },
  coal: { factor: 0.91, unit: "kWh", label: "Coal", icon: "⛏️" },
} as const;

// ─── Food Emission Factors (kg CO₂ per kg of food) ────────────────────────

export const FOOD_FACTORS = {
  beef: { factor: 27.0, unit: "kg", label: "Beef", icon: "🥩" },
  lamb: { factor: 39.2, unit: "kg", label: "Lamb", icon: "🍖" },
  pork: { factor: 12.1, unit: "kg", label: "Pork", icon: "🥓" },
  chicken: { factor: 6.9, unit: "kg", label: "Chicken", icon: "🍗" },
  fish: { factor: 6.1, unit: "kg", label: "Fish", icon: "🐟" },
  eggs: { factor: 4.8, unit: "kg", label: "Eggs", icon: "🥚" },
  dairy_milk: { factor: 3.2, unit: "liter", label: "Milk", icon: "🥛" },
  dairy_cheese: { factor: 13.5, unit: "kg", label: "Cheese", icon: "🧀" },
  rice: { factor: 2.7, unit: "kg", label: "Rice", icon: "🍚" },
  pasta: { factor: 1.3, unit: "kg", label: "Pasta", icon: "🍝" },
  bread: { factor: 1.0, unit: "kg", label: "Bread", icon: "🍞" },
  vegetables: { factor: 2.0, unit: "kg", label: "Vegetables", icon: "🥦" },
  fruits: { factor: 1.1, unit: "kg", label: "Fruits", icon: "🍎" },
  nuts: { factor: 2.3, unit: "kg", label: "Nuts", icon: "🥜" },
  tofu: { factor: 3.0, unit: "kg", label: "Tofu", icon: "🫘" },
  coffee: { factor: 16.5, unit: "kg", label: "Coffee", icon: "☕" },
  chocolate: { factor: 19.0, unit: "kg", label: "Chocolate", icon: "🍫" },
} as const;

// ─── Shopping Emission Factors (kg CO₂ per unit/item) ──────────────────────

export const SHOPPING_FACTORS = {
  clothing_tshirt: { factor: 7.0, unit: "item", label: "T-shirt", icon: "👕" },
  clothing_jeans: { factor: 33.4, unit: "item", label: "Jeans", icon: "👖" },
  clothing_jacket: { factor: 39.0, unit: "item", label: "Jacket", icon: "🧥" },
  clothing_shoes: { factor: 14.0, unit: "pair", label: "Shoes", icon: "👟" },
  electronics_phone: { factor: 70.0, unit: "item", label: "Smartphone", icon: "📱" },
  electronics_laptop: { factor: 300.0, unit: "item", label: "Laptop", icon: "💻" },
  electronics_tablet: { factor: 130.0, unit: "item", label: "Tablet", icon: "📟" },
  furniture_chair: { factor: 72.0, unit: "item", label: "Chair", icon: "🪑" },
  furniture_table: { factor: 120.0, unit: "item", label: "Table", icon: "🪑" },
  book: { factor: 1.1, unit: "item", label: "Book", icon: "📚" },
  plastic_bag: { factor: 0.033, unit: "item", label: "Plastic Bag", icon: "🛍️" },
  general_shopping: { factor: 15.0, unit: "USD (per $50)", label: "General Shopping", icon: "🛒" },
} as const;

// ─── Water Usage Factors (kg CO₂ per liter) ────────────────────────────────

export const WATER_FACTORS = {
  tap_water: { factor: 0.000298, unit: "liter", label: "Tap Water", icon: "🚰" },
  hot_water: { factor: 0.004, unit: "liter", label: "Hot Water (heated)", icon: "♨️" },
  bottled_water: { factor: 0.16, unit: "liter", label: "Bottled Water", icon: "🍶" },
  shower_8min: { factor: 0.32, unit: "session", label: "Shower (8 min)", icon: "🚿" },
  bath: { factor: 0.56, unit: "session", label: "Bath", icon: "🛁" },
  dishwasher: { factor: 0.77, unit: "cycle", label: "Dishwasher Cycle", icon: "🍽️" },
  laundry: { factor: 0.62, unit: "cycle", label: "Laundry Cycle", icon: "👔" },
} as const;

// ─── Device Usage Factors (kg CO₂ per hour of use) ─────────────────────────

export const DEVICE_FACTORS = {
  desktop_computer: { factor: 0.06, unit: "hour", label: "Desktop PC", icon: "🖥️" },
  laptop: { factor: 0.018, unit: "hour", label: "Laptop", icon: "💻" },
  smartphone: { factor: 0.008, unit: "hour", label: "Smartphone", icon: "📱" },
  tv_lcd: { factor: 0.042, unit: "hour", label: "TV (LCD)", icon: "📺" },
  gaming_console: { factor: 0.06, unit: "hour", label: "Gaming Console", icon: "🎮" },
  streaming_video: { factor: 0.036, unit: "hour", label: "Video Streaming", icon: "🎬" },
  cloud_storage: { factor: 0.003, unit: "GB/month", label: "Cloud Storage", icon: "☁️" },
  wifi_router: { factor: 0.006, unit: "hour", label: "Wi-Fi Router", icon: "📡" },
} as const;

// ─── Environmental Equivalents ─────────────────────────────────────────────

export const EQUIVALENTS = {
  /** kg of CO₂ absorbed by one tree per year */
  treesPerYear: 22,
  /** km driven by average car per kg CO₂ */
  carKmPerKg: 4.76,
  /** number of smartphones charged per kg CO₂ */
  smartphoneCharges: 122,
  /** hours of LED light per kg CO₂ */
  ledHours: 100,
  /** liters of water boiled per kg CO₂ */
  waterBoiled: 40,
} as const;

// ─── Category Metadata ─────────────────────────────────────────────────────

export const CATEGORIES = {
  TRAVEL: { label: "Travel", icon: "🚗", color: "#3B82F6", gradient: "from-blue-500 to-cyan-500" },
  ELECTRICITY: { label: "Electricity", icon: "⚡", color: "#F59E0B", gradient: "from-amber-500 to-orange-500" },
  FOOD: { label: "Food", icon: "🍽️", color: "#10B981", gradient: "from-emerald-500 to-green-500" },
  SHOPPING: { label: "Shopping", icon: "🛍️", color: "#8B5CF6", gradient: "from-violet-500 to-purple-500" },
  WATER: { label: "Water", icon: "💧", color: "#06B6D4", gradient: "from-cyan-500 to-blue-500" },
  DEVICE: { label: "Devices", icon: "📱", color: "#EC4899", gradient: "from-pink-500 to-rose-500" },
} as const;

export type ActivityCategory = keyof typeof CATEGORIES;
export type TravelSubCategory = keyof typeof TRAVEL_FACTORS;
export type ElectricitySubCategory = keyof typeof ELECTRICITY_FACTORS;
export type FoodSubCategory = keyof typeof FOOD_FACTORS;
export type ShoppingSubCategory = keyof typeof SHOPPING_FACTORS;
export type WaterSubCategory = keyof typeof WATER_FACTORS;
export type DeviceSubCategory = keyof typeof DEVICE_FACTORS;

/** XP rewards per activity category */
export const XP_PER_ACTIVITY: Record<string, number> = {
  TRAVEL: 15,
  ELECTRICITY: 10,
  FOOD: 12,
  SHOPPING: 8,
  WATER: 10,
  DEVICE: 8,
};

/** Level XP thresholds (exponential curve) */
export const LEVEL_THRESHOLDS = [
  0, 100, 250, 500, 800, 1200, 1700, 2300, 3000, 3800, 4700, 5700, 6800,
  8000, 9300, 10700, 12200, 13800, 15500, 17300, 19200, 21200, 23300, 25500,
  27800, 30200, 32700, 35300, 38000, 40800, 50000,
];

/** Level titles */
export const LEVEL_TITLES = [
  "Eco Newbie",
  "Green Sprout",
  "Leaf Guardian",
  "Nature Ally",
  "Earth Friend",
  "Eco Warrior",
  "Green Champion",
  "Planet Protector",
  "Eco Master",
  "Climate Hero",
  "Earth Legend",
] as const;
