import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Convert Open-Meteo WMO weather code to human-readable condition
export function weatherCodeToText(code: number): string {
  if (code === 0) return "Clear";
  if (code === 1) return "Mainly Clear";
  if (code === 2) return "Partly Cloudy";
  if (code === 3) return "Cloudy";
  if (code === 45 || code === 48) return "Fog";
  if (code >= 51 && code <= 55) return "Drizzle";
  if (code >= 56 && code <= 57) return "Freezing Drizzle";
  if (code >= 61 && code <= 65) return "Rain";
  if (code >= 66 && code <= 67) return "Freezing Rain";
  if (code >= 71 && code <= 77) return "Snow";
  if (code >= 80 && code <= 82) return "Rain Showers";
  if (code === 85 || code === 86) return "Snow Showers";
  if (code === 95) return "Thunderstorm";
  if (code >= 96 && code <= 99) return "Thunderstorm with Hail";
  return "Unknown";
}

function degreesToCompass(deg: number): string {
  const dirs = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];
  return dirs[Math.round(deg / 22.5) % 16];
}

export async function GET() {
  try {
    const latitude = 28.6139;
    const longitude = 77.2090;

    const url =
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${latitude}` +
      `&longitude=${longitude}` +
      `&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,cloud_cover,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m` +
      `&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,precipitation,surface_pressure,cloud_cover,wind_speed_10m,wind_direction_10m,wind_gusts_10m` +
      `&timezone=Asia%2FKolkata` +
      `&forecast_days=4`;

    const response = await fetch(url, { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`Open-Meteo responded with status ${response.status}`);
    }

    const data = await response.json();
    const c = data.current;
    const h = data.hourly;

    const current = {
      temperature: c.temperature_2m ?? null,
      feelsLike: c.apparent_temperature ?? null,
      humidity: c.relative_humidity_2m ?? null,
      pressure: c.surface_pressure ?? null,
      windSpeed: c.wind_speed_10m ?? null,
      windDirection: c.wind_direction_10m ?? null,
      windDirectionLabel: c.wind_direction_10m != null ? degreesToCompass(c.wind_direction_10m) : "--",
      windGust: c.wind_gusts_10m ?? null,
      cloudCover: c.cloud_cover ?? null,
      precipitation: c.precipitation ?? null,
      weatherCode: c.weather_code ?? null,
      condition: c.weather_code != null ? weatherCodeToText(c.weather_code) : "--",
      time: c.time ?? new Date().toISOString(),
    };

    const times: string[] = h.time ?? [];
    const hourly = times.slice(0, 72).map((time: string, i: number) => ({
      time,
      temperature: h.temperature_2m?.[i] ?? null,
      humidity: h.relative_humidity_2m?.[i] ?? null,
      pressure: h.surface_pressure?.[i] ?? null,
      windSpeed: h.wind_speed_10m?.[i] ?? null,
      windDirection: h.wind_direction_10m?.[i] ?? null,
      windGust: h.wind_gusts_10m?.[i] ?? null,
      cloudCover: h.cloud_cover?.[i] ?? null,
      precipitationProbability: h.precipitation_probability?.[i] ?? null,
      precipitation: h.precipitation?.[i] ?? null,
    }));

    return NextResponse.json({
      location: "Delhi NCR",
      current,
      hourly,
      source: "Open-Meteo",
      status: "live-weather",
    });
  } catch (error: any) {
    console.error("AirSync /api/weather error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch weather data", status: "error" },
      { status: 500 }
    );
  }
}
