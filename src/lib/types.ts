export type TimelineCode = 'now' | '24h' | '48h' | '72h';

export interface StationData {
  id: string;
  name: string;
  district: string;
  lat: number;
  lng: number;
  aqi: number;
  aqiCategory: 'Good' | 'Moderate' | 'Poor' | 'Very Poor' | 'Severe';
  pm25: number;
  pm10: number;
  temp: number;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  lastUpdated: string;
}

export interface AtmosphericSnapshot {
  timeline: TimelineCode;
  timelineLabel: string;
  aqi: number;
  aqiStatus: string;
  pm25: number;
  pm25Status: string;
  temp: number;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  updatedAgo: string;
  inversion: {
    level: 'LOW' | 'MODERATE' | 'HIGH' | 'EXTREME';
    description: string;
    boundaryHeightMeters: number;
    trappingRatioPercent: number;
  };
  dispersion: {
    level: 'POOR' | 'LOW' | 'MODERATE' | 'GOOD';
    description: string;
    windSpeedKmh: number;
    mixingStatus: string;
    ventilationIndex: number;
  };
  plume: {
    level: 'MINIMAL' | 'LOW' | 'MODERATE' | 'HIGH';
    description: string;
    corridor: string;
    fireCountSatellite: number;
    confidence: string;
  };
  riskSummary: {
    level: 'LOW' | 'MODERATE' | 'HIGH' | 'SEVERE';
    headline: string;
    explanation: string;
  };
}

export interface RegionTelemetry {
  id: string;
  name: string;
  hindiName: string;
  districtKey: string;
  aqi: number;
  aqiStatus: string;
  pm25: number;
  tomorrowAqi: number;
  trend: 'up' | 'down' | 'stable';
  inversion: 'LOW' | 'MODERATE' | 'HIGH';
  dispersion: 'LOW' | 'MODERATE' | 'GOOD';
  plumeInfluence: 'LOW' | 'MODERATE' | 'HIGH';
  keySource: string;
  coordinates: { x: number; y: number }; // SVG canvas coordinates
  lat: number;
  lng: number;
}

export interface ForecastPoint {
  hourOffset: number;
  timeLabel: string;
  dayLabel: string;
  aqi: number;
  pm25: number;
  isPeak: boolean;
  inversion: string;
  dispersion: string;
  plumeRisk: string;
}

export interface ForecastResponse {
  points: ForecastPoint[];
  peakWindow: {
    time: string;
    expectedAqiRange: string;
    why: string[];
  };
}

export interface ActionAdvisory {
  id: string;
  targetRole: 'citizens' | 'authorities' | 'industries';
  badge: string;
  headline: string;
  bulletPoints: string[];
  primaryAction: string;
}

export interface AiExplanationQuery {
  id?: number;
  question: string;
  answer: string;
  timestamp: string;
  factors: string[];
}
