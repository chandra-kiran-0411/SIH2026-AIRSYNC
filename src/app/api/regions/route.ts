import { NextRequest, NextResponse } from 'next/server';
import { getRegionsByTimeline } from '@/lib/db';
import { TimelineCode, RegionTelemetry } from '@/lib/types';
import { calculateIndianAqi } from '@/lib/aqi';

export const dynamic = 'force-dynamic';

interface DistrictConfig {
  id: string;
  name: string;
  hindiName: string;
  districtKey: string;
  lat: number;
  lng: number;
  x: number;
  y: number;
  keySource: string;
  defaultInversion: 'LOW' | 'MODERATE' | 'HIGH';
  defaultDispersion: 'LOW' | 'MODERATE' | 'GOOD';
  defaultPlume: 'LOW' | 'MODERATE' | 'HIGH';
}

const DISTRICT_CONFIGS: DistrictConfig[] = [
  {
    id: 'delhi',
    name: 'Delhi',
    hindiName: 'दिल्ली',
    districtKey: 'delhi',
    lat: 28.6139,
    lng: 77.2090,
    x: 230,
    y: 190,
    keySource: 'Vehicular + Secondary Inversion',
    defaultInversion: 'HIGH',
    defaultDispersion: 'LOW',
    defaultPlume: 'MODERATE'
  },
  {
    id: 'noida',
    name: 'Noida',
    hindiName: 'नोएडा',
    districtKey: 'noida',
    lat: 28.5355,
    lng: 77.3910,
    x: 310,
    y: 220,
    keySource: 'Construction Dust + Traffic',
    defaultInversion: 'HIGH',
    defaultDispersion: 'LOW',
    defaultPlume: 'MODERATE'
  },
  {
    id: 'gurugram',
    name: 'Gurugram',
    hindiName: 'गुरुग्राम',
    districtKey: 'gurugram',
    lat: 28.4595,
    lng: 77.0266,
    x: 155,
    y: 275,
    keySource: 'Highway Transit + Stagnation',
    defaultInversion: 'MODERATE',
    defaultDispersion: 'LOW',
    defaultPlume: 'LOW'
  },
  {
    id: 'ghaziabad',
    name: 'Ghaziabad',
    hindiName: 'गाज़ियाबाद',
    districtKey: 'ghaziabad',
    lat: 28.6692,
    lng: 77.4538,
    x: 325,
    y: 130,
    keySource: 'Industrial Biomass + Inversion',
    defaultInversion: 'HIGH',
    defaultDispersion: 'LOW',
    defaultPlume: 'MODERATE'
  },
  {
    id: 'faridabad',
    name: 'Faridabad',
    hindiName: 'फरीदाबाद',
    districtKey: 'faridabad',
    lat: 28.4089,
    lng: 77.3178,
    x: 245,
    y: 315,
    keySource: 'Industrial Corridor + Settling',
    defaultInversion: 'HIGH',
    defaultDispersion: 'LOW',
    defaultPlume: 'LOW'
  },
  {
    id: 'greater_noida',
    name: 'Greater Noida',
    hindiName: 'ग्रेटर नोएडा',
    districtKey: 'greater_noida',
    lat: 28.4744,
    lng: 77.5040,
    x: 375,
    y: 260,
    keySource: 'Expressway Corridors + Plume',
    defaultInversion: 'HIGH',
    defaultDispersion: 'LOW',
    defaultPlume: 'MODERATE'
  }
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const timeline = (searchParams.get('timeline') || 'now') as TimelineCode;

  try {
    const lats = DISTRICT_CONFIGS.map(d => d.lat).join(',');
    const lngs = DISTRICT_CONFIGS.map(d => d.lng).join(',');

    const apiUrl =
      `https://air-quality-api.open-meteo.com/v1/air-quality` +
      `?latitude=${lats}` +
      `&longitude=${lngs}` +
      `&current=pm2_5,pm10,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,us_aqi` +
      `&hourly=pm2_5,pm10,us_aqi` +
      `&timezone=Asia%2FKolkata`;

    const res = await fetch(apiUrl, { cache: 'no-store' });

    if (!res.ok) {
      throw new Error(`Air quality upstream error: ${res.statusText}`);
    }

    const dataList = await res.json();
    const results: any[] = Array.isArray(dataList) ? dataList : [dataList];

    // Determine hour offset according to selected timeline
    let hourOffset = 0;
    if (timeline === '24h') hourOffset = 24;
    else if (timeline === '48h') hourOffset = 48;
    else if (timeline === '72h') hourOffset = 72;

    const regions: RegionTelemetry[] = DISTRICT_CONFIGS.map((cfg, idx) => {
      const liveDistrict = results[idx] || results[0];
      const cur = liveDistrict?.current;
      const hourly = liveDistrict?.hourly;

      let pm25Val: number;
      let pm10Val: number | undefined;

      if (hourOffset === 0) {
        pm25Val = cur?.pm2_5 ?? 65;
        pm10Val = cur?.pm10 ?? undefined;
      } else {
        pm25Val = hourly?.pm2_5?.[hourOffset] ?? cur?.pm2_5 ?? 65;
        pm10Val = hourly?.pm10?.[hourOffset] ?? cur?.pm10 ?? undefined;
      }

      const calculated = calculateIndianAqi(pm25Val, pm10Val);

      // Calculate tomorrow's projection
      const tomorrowOffset = hourOffset + 24;
      const tomPm25 = hourly?.pm2_5?.[tomorrowOffset] ?? pm25Val;
      const tomPm10 = hourly?.pm10?.[tomorrowOffset] ?? pm10Val;
      const tomCalc = calculateIndianAqi(tomPm25, tomPm10);

      const diff = tomCalc.aqi - calculated.aqi;
      const trend: 'up' | 'down' | 'stable' = diff > 8 ? 'up' : diff < -8 ? 'down' : 'stable';

      return {
        id: cfg.id,
        name: cfg.name,
        hindiName: cfg.hindiName,
        districtKey: cfg.districtKey,
        aqi: calculated.aqi,
        aqiStatus: calculated.status,
        pm25: Math.round(pm25Val),
        tomorrowAqi: tomCalc.aqi,
        trend,
        inversion: cfg.defaultInversion,
        dispersion: cfg.defaultDispersion,
        plumeInfluence: cfg.defaultPlume,
        keySource: cfg.keySource,
        coordinates: { x: cfg.x, y: cfg.y },
        lat: cfg.lat,
        lng: cfg.lng
      };
    });

    return NextResponse.json({
      timeline,
      regions,
      source: 'LIVE_CAMS_CPCB_CALCULATED'
    });
  } catch (error: any) {
    console.warn('Live regional AQI fetch failed, falling back to database:', error?.message);
    const dbRegions = getRegionsByTimeline(timeline);
    return NextResponse.json({
      timeline,
      regions: dbRegions,
      source: 'DATABASE_FALLBACK'
    });
  }
}
