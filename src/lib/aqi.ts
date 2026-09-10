/**
 * CPCB (Central Pollution Control Board) Indian National Air Quality Index (NAQI)
 * Formula and sub-index calculation based on official MoEFCC / CPCB standards.
 */

export interface AqiCalculationResult {
  aqi: number;
  status: 'GOOD' | 'MODERATE' | 'POOR' | 'VERY POOR' | 'SEVERE';
  prominentPollutant: 'PM2.5' | 'PM10' | 'NO2' | 'SO2' | 'CO' | 'Ozone';
  pm25Status: 'NORMAL' | 'MODERATE' | 'HIGH' | 'VERY HIGH' | 'CRITICAL';
}

/**
 * Linear interpolation helper for CPCB sub-index
 * I = I_low + ((I_high - I_low) / (C_high - C_low)) * (C - C_low)
 */
function interpolate(c: number, cLow: number, cHigh: number, iLow: number, iHigh: number): number {
  return iLow + ((iHigh - iLow) / (cHigh - cLow)) * (c - cLow);
}

/**
 * CPCB PM2.5 Sub-Index (24-hr standard in µg/m³)
 * 0 - 30      -> 0 - 50     (Good)
 * 31 - 60     -> 51 - 100   (Satisfactory)
 * 61 - 90     -> 101 - 200  (Moderate)
 * 91 - 120    -> 201 - 300  (Poor)
 * 121 - 250   -> 301 - 400  (Very Poor)
 * 250+        -> 401 - 500  (Severe)
 */
export function calculatePm25SubIndex(pm25: number): number {
  if (pm25 <= 0) return 0;
  if (pm25 <= 30) return interpolate(pm25, 0, 30, 0, 50);
  if (pm25 <= 60) return interpolate(pm25, 30, 60, 51, 100);
  if (pm25 <= 90) return interpolate(pm25, 60, 90, 101, 200);
  if (pm25 <= 120) return interpolate(pm25, 90, 120, 201, 300);
  if (pm25 <= 250) return interpolate(pm25, 120, 250, 301, 400);
  return Math.min(500, interpolate(pm25, 250, 400, 401, 500));
}

/**
 * CPCB PM10 Sub-Index (24-hr standard in µg/m³)
 * 0 - 50      -> 0 - 50
 * 51 - 100    -> 51 - 100
 * 101 - 250   -> 101 - 200
 * 251 - 350   -> 201 - 300
 * 351 - 430   -> 301 - 400
 * 430+        -> 401 - 500
 */
export function calculatePm10SubIndex(pm10: number): number {
  if (pm10 <= 0) return 0;
  if (pm10 <= 50) return interpolate(pm10, 0, 50, 0, 50);
  if (pm10 <= 100) return interpolate(pm10, 50, 100, 51, 100);
  if (pm10 <= 250) return interpolate(pm10, 100, 250, 101, 200);
  if (pm10 <= 350) return interpolate(pm10, 250, 350, 201, 300);
  if (pm10 <= 430) return interpolate(pm10, 350, 430, 301, 400);
  return Math.min(500, interpolate(pm10, 430, 600, 401, 500));
}

export function getAqiCategory(aqi: number): 'GOOD' | 'MODERATE' | 'POOR' | 'VERY POOR' | 'SEVERE' {
  if (aqi <= 100) return 'GOOD';
  if (aqi <= 200) return 'MODERATE';
  if (aqi <= 300) return 'POOR';
  if (aqi <= 400) return 'VERY POOR';
  return 'SEVERE';
}

export function getPm25Status(pm25: number): 'NORMAL' | 'MODERATE' | 'HIGH' | 'VERY HIGH' | 'CRITICAL' {
  if (pm25 <= 30) return 'NORMAL';
  if (pm25 <= 60) return 'MODERATE';
  if (pm25 <= 90) return 'HIGH';
  if (pm25 <= 150) return 'VERY HIGH';
  return 'CRITICAL';
}

/**
 * Calculates Indian CPCB National AQI (NAQI) from multi-pollutant concentrations
 */
export function calculateIndianAqi(
  pm25: number,
  pm10?: number | null,
  no2?: number | null,
  so2?: number | null
): AqiCalculationResult {
  const pm25Idx = calculatePm25SubIndex(pm25);
  const pm10Idx = pm10 ? calculatePm10SubIndex(pm10) : 0;

  let maxAqi = pm25Idx;
  let prominent: 'PM2.5' | 'PM10' | 'NO2' | 'SO2' | 'CO' | 'Ozone' = 'PM2.5';

  if (pm10Idx > maxAqi) {
    maxAqi = pm10Idx;
    prominent = 'PM10';
  }

  const finalAqi = Math.max(1, Math.round(maxAqi));

  return {
    aqi: finalAqi,
    status: getAqiCategory(finalAqi),
    prominentPollutant: prominent,
    pm25Status: getPm25Status(pm25),
  };
}
