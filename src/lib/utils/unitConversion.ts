/**
 * Unit conversion utilities for appearance measurements
 * API accepts: cm (for length/measurements) and EU (for shoe sizes)
 * UI supports: cm, in (inches) for length/measurements, and EU for shoe sizes
 */

// Conversion factors
const INCH_TO_CM = 2.54;
const CM_TO_INCH = 1 / INCH_TO_CM;

export type MeasurementUnit = "cm" | "in" | "EU";

/**
 * Convert a measurement value to API-compatible unit (cm or EU)
 * @param value - The numeric value
 * @param currentUnit - Current unit (cm, in, or EU)
 * @param fieldType - Type of field (for EU shoe sizes, no conversion needed)
 * @returns Converted value as a number
 */
export function convertToApiUnit(
  value: number | string,
  currentUnit: MeasurementUnit,
  fieldType: "length" | "shoe_size" = "length"
): number {
  const numValue = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(numValue)) return 0;

  // Shoe sizes (EU) don't need conversion
  if (fieldType === "shoe_size") {
    return Math.round(numValue * 100) / 100;
  }

  // Length measurements
  if (currentUnit === "in") {
    // Convert inches to cm
    return Math.round(numValue * INCH_TO_CM * 100) / 100;
  }

  // Already in cm
  return Math.round(numValue * 100) / 100;
}

/**
 * Convert a measurement value from API unit (cm) to user's preferred unit
 * @param value - The numeric value in cm or EU
 * @param targetUnit - Target unit (cm, in, or EU)
 * @param fieldType - Type of field
 * @returns Converted value as a string
 */
export function convertFromApiUnit(
  value: number | string | null | undefined,
  targetUnit: MeasurementUnit,
  fieldType: "length" | "shoe_size" = "length"
): string {
  if (value === null || value === undefined) return "";

  const numValue = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(numValue)) return "";

  // Shoe sizes (EU) don't need conversion
  if (fieldType === "shoe_size") {
    return (Math.round(numValue * 100) / 100).toString();
  }

  // Length measurements - API stores in cm
  if (targetUnit === "in") {
    // Convert cm to inches
    const converted = numValue * CM_TO_INCH;
    return (Math.round(converted * 100) / 100).toString();
  }

  // Already in cm
  return (Math.round(numValue * 100) / 100).toString();
}

/**
 * Convert a value when the user changes the unit
 * @param value - Current numeric value
 * @param fromUnit - Current unit
 * @param toUnit - Target unit
 * @param fieldType - Type of field
 * @returns Converted value as a string
 */
export function convertBetweenUnits(
  value: number | string,
  fromUnit: MeasurementUnit,
  toUnit: MeasurementUnit,
  fieldType: "length" | "shoe_size" = "length"
): string {
  if (!value) return "";

  const numValue = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(numValue)) return "";

  // Shoe sizes (EU) don't need conversion
  if (fieldType === "shoe_size") {
    return (Math.round(numValue * 100) / 100).toString();
  }

  // Same unit, no conversion needed
  if (fromUnit === toUnit) {
    return (Math.round(numValue * 100) / 100).toString();
  }

  // Length conversions
  if (fromUnit === "in" && toUnit === "cm") {
    const converted = numValue * INCH_TO_CM;
    return (Math.round(converted * 100) / 100).toString();
  }

  if (fromUnit === "cm" && toUnit === "in") {
    const converted = numValue * CM_TO_INCH;
    return (Math.round(converted * 100) / 100).toString();
  }

  return (Math.round(numValue * 100) / 100).toString();
}
