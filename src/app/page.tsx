'use client';

import React, { useState, useEffect } from 'react';
import AtmosphericCanvas from '@/components/AtmosphericCanvas';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ForecastTimeline from '@/components/ForecastTimeline';
import CurrentConditions from '@/components/CurrentConditions';
import AtmosphericIntelligence from '@/components/AtmosphericIntelligence';
import DelhiNCRMap from '@/components/DelhiNCRMap';
import Forecast72Hours from '@/components/Forecast72Hours';
import ActionPanel from '@/components/ActionPanel';

import Footer from '@/components/Footer';
import { TimelineCode, AtmosphericSnapshot, RegionTelemetry, ForecastResponse, ActionAdvisory } from '@/lib/types';

// Weather loading/error sentinel: null = loading, string = error
// Real values are injected after /api/weather resolves.
// Hardcoded weather values (29, 62, 6, NW) are intentionally removed.
// The UI will show "--" until the API responds.
const defaultSnapshot: AtmosphericSnapshot = {
  timeline: 'now',
  timelineLabel: 'Real-time Live',
  aqi: 132,
  aqiStatus: 'MODERATE',
  pm25: 65,
  pm25Status: 'MODERATE',
  temp: null as unknown as number,       // real value injected from /api/weather
  humidity: null as unknown as number,   // real value injected from /api/weather
  windSpeed: null as unknown as number,  // real value injected from /api/weather
  windDirection: '--',
  updatedAgo: 'Synchronizing live telemetry…',
  inversion: {
    level: 'MODERATE',
    description: 'Moderate boundary layer mixing with diurnal thermal gradients across Delhi NCR basin.',
    boundaryHeightMeters: 480,
    trappingRatioPercent: 64
  },
  dispersion: {
    level: 'MODERATE',
    description: 'Surface winds maintaining horizontal dispersion across NCR corridors.',
    windSpeedKmh: 11,
    mixingStatus: 'Moderate',
    ventilationIndex: 2840
  },
  plume: {
    level: 'LOW',
    description: 'Current satellite surveillance indicates minimal agricultural burn contribution.',
    corridor: 'Punjab → Haryana → Delhi NCR',
    fireCountSatellite: 42,
    confidence: 'Low plume impact'
  },
  riskSummary: {
    level: 'MODERATE',
    headline: 'Standard Diurnal Variation',
    explanation: 'Moderate particulate load. Sensitive groups should monitor evening dispersion windows.'
  }
};

const defaultRegions: RegionTelemetry[] = [
  { id: 'delhi', name: 'Delhi', hindiName: 'दिल्ली', districtKey: 'delhi', aqi: 132, aqiStatus: 'MODERATE', pm25: 65, tomorrowAqi: 178, trend: 'up', inversion: 'MODERATE', dispersion: 'MODERATE', plumeInfluence: 'LOW', keySource: 'Vehicular + Urban Transit', coordinates: { x: 230, y: 190 }, lat: 28.6139, lng: 77.2090 },
  { id: 'noida', name: 'Noida', hindiName: 'नोएडा', districtKey: 'noida', aqi: 165, aqiStatus: 'MODERATE', pm25: 79, tomorrowAqi: 184, trend: 'up', inversion: 'MODERATE', dispersion: 'MODERATE', plumeInfluence: 'LOW', keySource: 'Construction Dust + Traffic', coordinates: { x: 310, y: 220 }, lat: 28.5355, lng: 77.3910 },
  { id: 'gurugram', name: 'Gurugram', hindiName: 'गुरुग्राम', districtKey: 'gurugram', aqi: 154, aqiStatus: 'MODERATE', pm25: 76, tomorrowAqi: 168, trend: 'up', inversion: 'LOW', dispersion: 'MODERATE', plumeInfluence: 'LOW', keySource: 'Highway Transit + Stagnation', coordinates: { x: 155, y: 275 }, lat: 28.4595, lng: 77.0266 },
  { id: 'ghaziabad', name: 'Ghaziabad', hindiName: 'गाज़ियाबाद', districtKey: 'ghaziabad', aqi: 188, aqiStatus: 'MODERATE', pm25: 86, tomorrowAqi: 195, trend: 'up', inversion: 'MODERATE', dispersion: 'LOW', plumeInfluence: 'MODERATE', keySource: 'Industrial Biomass + Transit', coordinates: { x: 325, y: 130 }, lat: 28.6692, lng: 77.4538 },
  { id: 'faridabad', name: 'Faridabad', hindiName: 'फरीदाबाद', districtKey: 'faridabad', aqi: 162, aqiStatus: 'MODERATE', pm25: 78, tomorrowAqi: 172, trend: 'up', inversion: 'MODERATE', dispersion: 'LOW', plumeInfluence: 'LOW', keySource: 'Industrial Corridor + Settling', coordinates: { x: 245, y: 315 }, lat: 28.4089, lng: 77.3178 },
  { id: 'greater_noida', name: 'Greater Noida', hindiName: 'ग्रेटर नोएडा', districtKey: 'greater_noida', aqi: 175, aqiStatus: 'MODERATE', pm25: 82, tomorrowAqi: 180, trend: 'up', inversion: 'MODERATE', dispersion: 'MODERATE', plumeInfluence: 'LOW', keySource: 'Expressway Corridors + Regional Basin', coordinates: { x: 375, y: 260 }, lat: 28.4744, lng: 77.5040 }
];

const defaultForecast: ForecastResponse = {
  points: [
    { hourOffset: 0, timeLabel: 'NOW', dayLabel: 'Today', aqi: 186, pm25: 86, isPeak: false, inversion: 'MODERATE', dispersion: 'MODERATE', plumeRisk: 'LOW' },
    { hourOffset: 12, timeLabel: '+12h', dayLabel: 'Tonight', aqi: 208, pm25: 98, isPeak: false, inversion: 'HIGH', dispersion: 'LOW', plumeRisk: 'MODERATE' },
    { hourOffset: 24, timeLabel: '+24h', dayLabel: 'Tomorrow AM', aqi: 238, pm25: 114, isPeak: true, inversion: 'HIGH', dispersion: 'LOW', plumeRisk: 'MODERATE' },
    { hourOffset: 36, timeLabel: '+36h', dayLabel: 'Tomorrow Eve', aqi: 215, pm25: 102, isPeak: false, inversion: 'MODERATE', dispersion: 'MODERATE', plumeRisk: 'MODERATE' },
    { hourOffset: 48, timeLabel: '+48h', dayLabel: 'Day 2 Peak', aqi: 232, pm25: 110, isPeak: true, inversion: 'HIGH', dispersion: 'LOW', plumeRisk: 'HIGH' },
    { hourOffset: 60, timeLabel: '+60h', dayLabel: 'Day 3 Day', aqi: 198, pm25: 92, isPeak: false, inversion: 'MODERATE', dispersion: 'GOOD', plumeRisk: 'LOW' },
    { hourOffset: 72, timeLabel: '+72h', dayLabel: 'Day 3 Eve', aqi: 182, pm25: 82, isPeak: false, inversion: 'LOW', dispersion: 'GOOD', plumeRisk: 'LOW' }
  ],
  peakWindow: {
    time: 'Tomorrow 06:00 – 10:00',
    expectedAqiRange: '225 – 240 (Poor)',
    why: [
      'Nocturnal surface inversion trapping ground emissions below 260m',
      'Weak surface winds (< 5 km/h) stalling horizontal dispersion',
      'Peripheral particulate flux channeled across eastern NCR corridors',
      'Solar thermal convection expected to restore dispersion after 10:30 AM'
    ]
  }
};

const defaultAdvisories: ActionAdvisory[] = [
  {
    id: '1',
    targetRole: 'citizens',
    badge: 'HEALTH & EXPOSURE',
    headline: 'Protect vulnerable respiratory health during morning inversion',
    bulletPoints: [
      'Sensitive groups (children, elderly, asthmatics) should reduce prolonged outdoor activity between 06:00 and 10:00 AM.',
      'Shift vigorous aerobic workouts or running to mid-afternoon (13:00–16:00) when boundary layer mixing improves.',
      'Keep windows closed during overnight hours when surface pollutants pool near ground level.',
      'Wear certified N95 / FFP2 respirators if commuting in open or two-wheeler transport during early morning.'
    ],
    primaryAction: 'Avoid morning outdoor exercise between 06:00 and 10:00 AM'
  },
  {
    id: '2',
    targetRole: 'authorities',
    badge: 'INTERVENTION & ENFORCEMENT',
    headline: 'High pollutant accumulation conditions expected across northern and eastern NCR',
    bulletPoints: [
      'Prioritize synchronized mechanized sweeping and water sprinkling along high-density corridors (Ring Road, Anand Vihar, Loni).',
      'Deploy mobile anti-smog mist guns starting at 05:00 AM before surface inversion traps vehicle exhaust.',
      'Enforce strict non-destined diesel truck bypass through Eastern and Western Peripheral Expressways.',
      'Conduct nocturnal drone thermal surveillance for unauthorized open waste burning in industrial zones.'
    ],
    primaryAction: 'Deploy synchronized misting on eastern corridors before 05:00 AM'
  },
  {
    id: '3',
    targetRole: 'industries',
    badge: 'COMPLIANCE & READINESS',
    headline: 'Atmospheric dispersion remains poor overnight; initiate clean-fuel protocol',
    bulletPoints: [
      'Heighten emission-control readiness and ensure continuous operation of Bag Filters and Wet Scrubbers.',
      'Reschedule batch operations with fugitive dust release away from the 06:00–10:00 AM low-ventilation window.',
      'Ensure zero reliance on unapproved diesel generator sets; verify primary grid power connectivity.',
      'Mandate complete covering of raw material transit trucks entering industrial clusters.'
    ],
    primaryAction: 'Maintain emission control systems at peak efficiency during nocturnal lull'
  }
];

export default function AirSyncHomePage() {
  const [timeline, setTimeline] = useState<TimelineCode>('now');
  const [snapshot, setSnapshot] = useState<AtmosphericSnapshot>(defaultSnapshot);
  const [regions, setRegions] = useState<RegionTelemetry[]>(defaultRegions);
  const [forecast, setForecast] = useState<ForecastResponse>(defaultForecast);
  const [advisories, setAdvisories] = useState<ActionAdvisory[]>(defaultAdvisories);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('noida');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);

  // Fetch data on timeline change
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [overviewRes, regionsRes] = await Promise.all([
          fetch(`/api/overview?timeline=${timeline}`),
          fetch(`/api/regions?timeline=${timeline}`)
        ]);

        if (overviewRes.ok) {
          const overviewData = await overviewRes.json();
          // overview API returns a flat shape; merge carefully to preserve
          // nested objects (inversion, dispersion, plume, riskSummary) that
          // the overview route does NOT return.
          setSnapshot(prev => ({
            ...prev,
            aqi: overviewData.aqi ?? prev.aqi,
            aqiStatus: overviewData.aqiStatus ?? prev.aqiStatus,
            pm25: overviewData.pollutants?.pm25 ?? prev.pm25,
            pm25Status: overviewData.pm25Status ?? prev.pm25Status,
            updatedAgo: 'Live Telemetry Active',
            // DO NOT overwrite weather fields here — those come from /api/weather
          }));
        }

        if (regionsRes.ok) {
          const regData = await regionsRes.json();
          if (regData.regions && regData.regions.length > 0) {
            setRegions(regData.regions);
          }
        }
      } catch (err) {
        console.error('Failed to load telemetry from AirSync API:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [timeline]);

  // Initial load for forecast and advisories
  useEffect(() => {
    async function loadStaticData() {
      try {
        const [forecastRes, actionRes] = await Promise.all([
          fetch('/api/forecast'),
          fetch('/api/action')
        ]);

        if (forecastRes.ok) {
          const fData = await forecastRes.json();
          setForecast(fData);
        }

        if (actionRes.ok) {
          const aData = await actionRes.json();
          if (aData.advisories && aData.advisories.length > 0) {
            setAdvisories(aData.advisories);
          }
        }
      } catch (err) {
        console.error('Failed to load forecast/advisories:', err);
      }
    }

    loadStaticData();
  }, []);

  // ── REAL WEATHER: fetch Open-Meteo via /api/weather ──────────────────────
  useEffect(() => {
    async function loadWeather() {
      try {
        const res = await fetch('/api/weather', { cache: 'no-store' });
        if (!res.ok) throw new Error(`Weather API returned ${res.status}`);
        const w = await res.json();
        if (w.status === 'error') throw new Error(w.error || 'Weather fetch failed');

        const cur = w.current;

        // Format timestamp for "Last updated"
        let updatedAgo = 'Weather data: Open-Meteo';
        if (cur.time) {
          const d = new Date(cur.time);
          updatedAgo = `Weather: Open-Meteo • Updated ${d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' })} IST`;
        }

        setWeatherError(null);
        setSnapshot(prev => ({
          ...prev,
          temp: cur.temperature != null ? Math.round(cur.temperature) : prev.temp,
          humidity: cur.humidity != null ? Math.round(cur.humidity) : prev.humidity,
          windSpeed: cur.windSpeed != null ? Math.round(cur.windSpeed) : prev.windSpeed,
          windDirection: cur.windDirectionLabel ?? prev.windDirection,
          updatedAgo,
          // patch dispersion windSpeedKmh with real wind speed too
          dispersion: {
            ...prev.dispersion,
            windSpeedKmh: cur.windSpeed != null ? Math.round(cur.windSpeed) : prev.dispersion.windSpeedKmh,
          },
        }));
      } catch (err: any) {
        console.error('Failed to fetch weather from /api/weather:', err);
        setWeatherError('Weather data temporarily unavailable');
        setSnapshot(prev => ({ ...prev, updatedAgo: 'Weather data temporarily unavailable' }));
      }
    }

    loadWeather();
  }, []);

  return (
    <div className="relative min-h-screen bg-[#080b11] text-slate-100 flex flex-col selection:bg-cyan-500/20 selection:text-cyan-200">
      
      {/* Background Animated Atmospheric Streamline Canvas */}
      <AtmosphericCanvas />

      {/* Top Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-2 pb-16">
        
        {/* Hero Section */}
        <Hero
          currentAqi={snapshot.aqi}
          aqiCategory={snapshot.aqiStatus}
          peakPeriod={forecast.peakWindow.time}
        />

        {/* Section 5: Forecast Timeline Selector Bar */}
        <ForecastTimeline
          currentTimeline={timeline}
          onSelectTimeline={(t) => setTimeline(t)}
          isLoading={isLoading}
        />

        {/* Section 1: NOW — Current Conditions */}
        <CurrentConditions data={snapshot} />

        {/* Section 2: WHY — Atmospheric Intelligence (The Core Differentiator) */}
        <AtmosphericIntelligence data={snapshot} />

        {/* Section 3: DELHI NCR MAP (6 Districts, Layer Toggles, Inspector) */}
        <DelhiNCRMap
          regions={regions}
          selectedDistrict={selectedDistrict}
          onSelectDistrict={(dist) => setSelectedDistrict(dist)}
        />

        {/* Section 4: NEXT 72 HOURS (Continuous Forecast Curve & Peak Alert) */}
        <Forecast72Hours forecast={forecast} />

        {/* Section 6: ACTION (Citizen, Authority, Industry Protocols) */}
        <ActionPanel advisories={advisories} />


      </main>

      {/* Footer & Data Provenance */}
      <Footer />

    </div>
  );
}
