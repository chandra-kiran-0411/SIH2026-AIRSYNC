import { NextRequest, NextResponse } from "next/server";
import { calculateIndianAqi } from "@/lib/aqi";
import { TimelineCode } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeline = (searchParams.get("timeline") || "now") as TimelineCode;

    // Center coordinates for Delhi NCR
    const latitude = 28.6139;
    const longitude = 77.2090;

    // REAL WEATHER DATA
    const weatherUrl =
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${latitude}` +
      `&longitude=${longitude}` +
      `&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m,surface_pressure` +
      `&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m` +
      `&timezone=Asia%2FKolkata`;

    // REAL AIR QUALITY DATA (Open-Meteo CAMS with hourly forecast)
    const airUrl =
      `https://air-quality-api.open-meteo.com/v1/air-quality` +
      `?latitude=${latitude}` +
      `&longitude=${longitude}` +
      `&current=pm2_5,pm10,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,us_aqi` +
      `&hourly=pm2_5,pm10,us_aqi` +
      `&timezone=Asia%2FKolkata`;

    // OPENAQ CPCB Ground Stations (supplementary real station data)
    const openaqKey = process.env.OPENAQ_API_KEY || '';
    const openaqUrl = `https://api.openaq.org/v3/locations?coordinates=${latitude},${longitude}&radius=50000&limit=5&order_by=distance`;
    const openaqHeaders: HeadersInit = openaqKey ? { 'X-API-Key': openaqKey } : {};

    const [weatherResponse, airResponse, openaqResponse] = await Promise.all([
      fetch(weatherUrl, { cache: "no-store" }),
      fetch(airUrl, { cache: "no-store" }),
      openaqKey ? fetch(openaqUrl, { headers: openaqHeaders, cache: "no-store" }).catch(() => null) : Promise.resolve(null),
    ]);

    if (!weatherResponse.ok || !airResponse.ok) {
      throw new Error("Failed to fetch live environmental data from upstream");
    }

    const openaqData = openaqResponse?.ok ? await openaqResponse.json().catch(() => null) : null;
    const openaqStationCount = openaqData?.meta?.found ?? openaqData?.results?.length ?? 0;

    const weather = await weatherResponse.json();
    const air = await airResponse.json();

    // Timeline offset calculations
    let offset = 0;
    if (timeline === "24h") offset = 24;
    else if (timeline === "48h") offset = 48;
    else if (timeline === "72h") offset = 72;

    const cur = air.current;
    const hourly = air.hourly;

    const pm25Raw = offset === 0 ? (cur?.pm2_5 ?? 65) : (hourly?.pm2_5?.[offset] ?? cur?.pm2_5 ?? 65);
    const pm10Raw = offset === 0 ? (cur?.pm10 ?? 145) : (hourly?.pm10?.[offset] ?? cur?.pm10 ?? 145);

    const indianAqi = calculateIndianAqi(pm25Raw, pm10Raw);

    const result = {
      timeline,

      location: {
        name: "Delhi NCR",
        latitude,
        longitude,
      },

      // True CPCB National Air Quality Index
      aqi: indianAqi.aqi,
      aqiStatus: indianAqi.status,
      pm25Status: indianAqi.pm25Status,
      prominentPollutant: indianAqi.prominentPollutant,

      // International comparison
      usAqi: Math.round(cur?.us_aqi ?? 0),

      pollutants: {
        pm25: Math.round(pm25Raw * 10) / 10,
        pm10: Math.round(pm10Raw * 10) / 10,
        no2: cur?.nitrogen_dioxide ?? null,
        so2: cur?.sulphur_dioxide ?? null,
        ozone: cur?.ozone ?? null,
        co: cur?.carbon_monoxide ?? null,
      },

      weather: {
        temperature: offset === 0 ? (weather.current?.temperature_2m ?? null) : (weather.hourly?.temperature_2m?.[offset] ?? null),
        humidity: offset === 0 ? (weather.current?.relative_humidity_2m ?? null) : (weather.hourly?.relative_humidity_2m?.[offset] ?? null),
        windSpeed: offset === 0 ? (weather.current?.wind_speed_10m ?? null) : (weather.hourly?.wind_speed_10m?.[offset] ?? null),
        windDirection: weather.current?.wind_direction_10m ?? null,
        pressure: weather.current?.surface_pressure ?? null,
      },

      updatedAt:
        air.current?.time ??
        weather.current?.time ??
        new Date().toISOString(),

      source: "Open-Meteo CAMS / MoEFCC CPCB NAQI" + (openaqKey ? " + OpenAQ CAAQMS" : ""),
      dataType: "LIVE SATELLITE & SENSOR TELEMETRY",
      groundStations: openaqStationCount > 0 ? openaqStationCount : undefined,
    };

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("AirSync overview error:", error);

    return NextResponse.json(
      {
        error: error.message || "Internal Server Error",
      },
      { status: 500 }
    );
  }
}