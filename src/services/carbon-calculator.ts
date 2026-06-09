import {
  TRAVEL_FACTORS,
  ELECTRICITY_FACTORS,
  FOOD_FACTORS,
  SHOPPING_FACTORS,
  WATER_FACTORS,
  DEVICE_FACTORS,
  EQUIVALENTS,
  type TravelSubCategory,
  type ElectricitySubCategory,
  type FoodSubCategory,
  type ShoppingSubCategory,
  type WaterSubCategory,
  type DeviceSubCategory,
} from "@/lib/constants/emission-factors";

/**
 * Core carbon emission calculation engine.
 * All calculations return kg CO₂e.
 */

export function calculateTravelEmission(
  subCategory: TravelSubCategory,
  distanceKm: number,
): number {
  const factor = TRAVEL_FACTORS[subCategory];
  if (!factor) return 0;
  return Math.round(distanceKm * factor.factor * 100) / 100;
}

export function calculateElectricityEmission(
  subCategory: ElectricitySubCategory,
  kWh: number,
): number {
  const factor = ELECTRICITY_FACTORS[subCategory];
  if (!factor) return 0;
  return Math.round(kWh * factor.factor * 100) / 100;
}

export function calculateFoodEmission(
  subCategory: FoodSubCategory,
  amount: number,
): number {
  const factor = FOOD_FACTORS[subCategory];
  if (!factor) return 0;
  return Math.round(amount * factor.factor * 100) / 100;
}

export function calculateShoppingEmission(
  subCategory: ShoppingSubCategory,
  quantity: number,
): number {
  const factor = SHOPPING_FACTORS[subCategory];
  if (!factor) return 0;
  return Math.round(quantity * factor.factor * 100) / 100;
}

export function calculateWaterEmission(
  subCategory: WaterSubCategory,
  amount: number,
): number {
  const factor = WATER_FACTORS[subCategory];
  if (!factor) return 0;
  return Math.round(amount * factor.factor * 1000) / 1000;
}

export function calculateDeviceEmission(
  subCategory: DeviceSubCategory,
  hours: number,
): number {
  const factor = DEVICE_FACTORS[subCategory];
  if (!factor) return 0;
  return Math.round(hours * factor.factor * 1000) / 1000;
}

/** Dispatch to the correct calculator based on category */
export function calculateEmission(
  category: string,
  subCategory: string,
  value: number,
): number {
  switch (category) {
    case "TRAVEL":
      return calculateTravelEmission(subCategory as TravelSubCategory, value);
    case "ELECTRICITY":
      return calculateElectricityEmission(
        subCategory as ElectricitySubCategory,
        value,
      );
    case "FOOD":
      return calculateFoodEmission(subCategory as FoodSubCategory, value);
    case "SHOPPING":
      return calculateShoppingEmission(
        subCategory as ShoppingSubCategory,
        value,
      );
    case "WATER":
      return calculateWaterEmission(subCategory as WaterSubCategory, value);
    case "DEVICE":
      return calculateDeviceEmission(subCategory as DeviceSubCategory, value);
    default:
      return 0;
  }
}

/** Get the unit for a given subcategory */
export function getSubCategoryUnit(
  category: string,
  subCategory: string,
): string {
  const factorMaps: Record<string, Record<string, { unit: string }>> = {
    TRAVEL: TRAVEL_FACTORS,
    ELECTRICITY: ELECTRICITY_FACTORS,
    FOOD: FOOD_FACTORS,
    SHOPPING: SHOPPING_FACTORS,
    WATER: WATER_FACTORS,
    DEVICE: DEVICE_FACTORS,
  };
  return factorMaps[category]?.[subCategory]?.unit || "units";
}

/** Get all sub-categories for a given category */
export function getSubCategories(
  category: string,
): Array<{ value: string; label: string; icon: string; unit: string }> {
  const factorMaps: Record<
    string,
    Record<string, { label: string; icon: string; unit: string }>
  > = {
    TRAVEL: TRAVEL_FACTORS,
    ELECTRICITY: ELECTRICITY_FACTORS,
    FOOD: FOOD_FACTORS,
    SHOPPING: SHOPPING_FACTORS,
    WATER: WATER_FACTORS,
    DEVICE: DEVICE_FACTORS,
  };

  const factors = factorMaps[category];
  if (!factors) return [];

  return Object.entries(factors).map(([key, val]) => ({
    value: key,
    label: val.label,
    icon: val.icon,
    unit: val.unit,
  }));
}

/** Calculate environmental equivalents for a given CO₂ amount (in kg) */
export function getEnvironmentalEquivalents(kgCO2: number) {
  return {
    treesNeeded: Math.round((kgCO2 / EQUIVALENTS.treesPerYear) * 10) / 10,
    carKm: Math.round(kgCO2 * EQUIVALENTS.carKmPerKg),
    smartphoneCharges: Math.round(kgCO2 * EQUIVALENTS.smartphoneCharges),
    ledHours: Math.round(kgCO2 * EQUIVALENTS.ledHours),
    waterBoiled: Math.round(kgCO2 * EQUIVALENTS.waterBoiled),
  };
}

/** Get a sustainability score (0-100) based on daily average CO₂ */
export function getSustainabilityScore(dailyAvgCO2: number): {
  score: number;
  label: string;
  color: string;
} {
  // Average person: ~22 kg CO₂/day → score 50
  // Target: <10 kg → score 90+
  const score = Math.round(
    Math.max(0, Math.min(100, 100 - (dailyAvgCO2 / 22) * 50)),
  );

  if (score >= 80) return { score, label: "Excellent", color: "#10B981" };
  if (score >= 60) return { score, label: "Good", color: "#3B82F6" };
  if (score >= 40) return { score, label: "Average", color: "#F59E0B" };
  if (score >= 20) return { score, label: "Below Average", color: "#F97316" };
  return { score, label: "Needs Improvement", color: "#EF4444" };
}
