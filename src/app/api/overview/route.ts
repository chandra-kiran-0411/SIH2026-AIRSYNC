import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    // Delhi coordinates
    const latitude = 28.6139;
    const longitude = 77.2090;

    // REAL WEATHER DATA
    const weatherUrl =
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${latitude}` +
      `&longitude=${longitude}` +
      `&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m,surface_pressure` +
      `&timezone=Asia%2FKolkata`;

    // REAL AIR QUALITY DATA
    const airUrl =
      `https://air-quality-api.open-meteo.com/v1/air-quality` +
      `?latitude=${latitude}` +
      `&longitude=${longitude}` +
      `&current=pm2_5,pm10,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,us_aqi` +
      `&timezone=Asia%2FKolkata`;

    const [weatherResponse, airResponse] = await Promise.all([
      fetch(weatherUrl, { cache: "no-store" }),
      fetch(airUrl, { cache: "no-store" }),
    ]);

    if (!weatherResponse.ok || !airResponse.ok) {
      throw new Error("Failed to fetch live environmental data");
    }

    const weather = await weatherResponse.json();
    const air = await airResponse.json();

    const result = {
      timeline: "now",

      location: {
        name: "Delhi NCR",
        latitude,
        longitude,
      },

      aqi: Math.round(air.current?.us_aqi ?? 0),

      pollutants: {
        pm25: air.current?.pm2_5 ?? null,
        pm10: air.current?.pm10 ?? null,
        no2: air.current?.nitrogen_dioxide ?? null,
        so2: air.current?.sulphur_dioxide ?? null,
        ozone: air.current?.ozone ?? null,
        co: air.current?.carbon_monoxide ?? null,
      },

      weather: {
        temperature: weather.current?.temperature_2m ?? null,
        humidity: weather.current?.relative_humidity_2m ?? null,
        windSpeed: weather.current?.wind_speed_10m ?? null,
        windDirection: weather.current?.wind_direction_10m ?? null,
        pressure: weather.current?.surface_pressure ?? null,
      },

      updatedAt:
        air.current?.time ??
        weather.current?.time ??
        new Date().toISOString(),

      source: "Open-Meteo / CAMS",
      dataType: "LIVE / MODEL-BASED",
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