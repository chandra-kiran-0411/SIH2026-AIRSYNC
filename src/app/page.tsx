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
import AskAirSync from '@/components/AskAirSync';
import Footer from '@/components/Footer';
import { TimelineCode, AtmosphericSnapshot, RegionTelemetry, ForecastResponse, ActionAdvisory } from '@/lib/types';

// Robust default state ensuring instant render without layout shift
const defaultSnapshot: AtmosphericSnapshot = {
  timeline: 'now',
  timelineLabel: 'Real-time Live',
  aqi: 287,
  aqiStatus: 'POOR',
  pm25: 138,
  pm25Status: 'HIGH',
  temp: 29,
  humidity: 62,
  windSpeed: 6,
  windDirection: 'NW',
  updatedAgo: 'Updated 2 minutes ago',
  inversion: {
    level: 'HIGH',
    description: 'Stable atmospheric conditions may trap pollutants close to the surface.',
    boundaryHeightMeters: 320,
    trappingRatioPercent: 82
  },
  dispersion: {
    level: 'LOW',
    description: 'Weak winds and low atmospheric mixing may prevent pollutants from dispersing.',
    windSpeedKmh: 6,
    mixingStatus: 'Poor',
    ventilationIndex: 1920
  },
  plume: {
    level: 'MODERATE',
    description: 'Satellite-detected agricultural fires and prevailing winds indicate possible plume transport toward NCR.',
    corridor: 'Punjab → Haryana → Delhi NCR',
    fireCountSatellite: 248,
    confidence: 'Potential plume influence'
  },
  riskSummary: {
    level: 'HIGH',
    headline: 'Pollution Build-up Risk',
    explanation: 'Strong overnight inversion combined with weak winds may cause PM2.5 accumulation across Delhi NCR.'
  }
};

const defaultRegions: RegionTelemetry[] = [
  { id: 'delhi', name: 'Delhi', hindiName: 'दिल्ली', districtKey: 'delhi', aqi: 287, aqiStatus: 'POOR', pm25: 138, tomorrowAqi: 326, trend: 'up', inversion: 'HIGH', dispersion: 'LOW', plumeInfluence: 'MODERATE', keySource: 'Vehicular + Secondary Inversion', coordinates: { x: 230, y: 190 }, lat: 28.6139, lng: 77.2090 },
  { id: 'noida', name: 'Noida', hindiName: 'नोएडा', districtKey: 'noida', aqi: 312, aqiStatus: 'VERY POOR', pm25: 156, tomorrowAqi: 347, trend: 'up', inversion: 'HIGH', dispersion: 'LOW', plumeInfluence: 'MODERATE', keySource: 'Construction Dust + Traffic', coordinates: { x: 310, y: 220 }, lat: 28.5355, lng: 77.3910 },
  { id: 'gurugram', name: 'Gurugram', hindiName: 'गुरुग्राम', districtKey: 'gurugram', aqi: 265, aqiStatus: 'POOR', pm25: 124, tomorrowAqi: 298, trend: 'up', inversion: 'MODERATE', dispersion: 'LOW', plumeInfluence: 'LOW', keySource: 'Highway Transit + Stagnation', coordinates: { x: 155, y: 275 }, lat: 28.4595, lng: 77.0266 },
  { id: 'ghaziabad', name: 'Ghaziabad', hindiName: 'गाज़ियाबाद', districtKey: 'ghaziabad', aqi: 326, aqiStatus: 'VERY POOR', pm25: 168, tomorrowAqi: 362, trend: 'up', inversion: 'HIGH', dispersion: 'LOW', plumeInfluence: 'MODERATE', keySource: 'Industrial Biomass + Inversion', coordinates: { x: 325, y: 130 }, lat: 28.6692, lng: 77.4538 },
  { id: 'faridabad', name: 'Faridabad', hindiName: 'फरीदाबाद', districtKey: 'faridabad', aqi: 294, aqiStatus: 'POOR', pm25: 142, tomorrowAqi: 328, trend: 'up', inversion: 'HIGH', dispersion: 'LOW', plumeInfluence: 'LOW', keySource: 'Industrial Corridor + Settling', coordinates: { x: 245, y: 315 }, lat: 28.4089, lng: 77.3178 },
  { id: 'greater_noida', name: 'Greater Noida', hindiName: 'ग्रेटर नोएडा', districtKey: 'greater_noida', aqi: 308, aqiStatus: 'VERY POOR', pm25: 150, tomorrowAqi: 339, trend: 'up', inversion: 'HIGH', dispersion: 'LOW', plumeInfluence: 'MODERATE', keySource: 'Expressway Corridors + Plume', coordinates: { x: 375, y: 260 }, lat: 28.4744, lng: 77.5040 }
];

const defaultForecast: ForecastResponse = {
  points: [
    { hourOffset: 0, timeLabel: 'NOW', dayLabel: 'Today', aqi: 287, pm25: 138, isPeak: false, inversion: 'HIGH', dispersion: 'LOW', plumeRisk: 'MODERATE' },
    { hourOffset: 12, timeLabel: '+12h', dayLabel: 'Tonight', aqi: 305, pm25: 149, isPeak: false, inversion: 'HIGH', dispersion: 'LOW', plumeRisk: 'MODERATE' },
    { hourOffset: 24, timeLabel: '+24h', dayLabel: 'Tomorrow AM', aqi: 326, pm25: 164, isPeak: true, inversion: 'HIGH', dispersion: 'POOR', plumeRisk: 'MODERATE' },
    { hourOffset: 36, timeLabel: '+36h', dayLabel: 'Tomorrow Eve', aqi: 341, pm25: 174, isPeak: true, inversion: 'HIGH', dispersion: 'LOW', plumeRisk: 'HIGH' },
    { hourOffset: 48, timeLabel: '+48h', dayLabel: 'Day 2 Peak', aqi: 349, pm25: 182, isPeak: true, inversion: 'HIGH', dispersion: 'POOR', plumeRisk: 'HIGH' },
    { hourOffset: 60, timeLabel: '+60h', dayLabel: 'Day 3 Day', aqi: 310, pm25: 152, isPeak: false, inversion: 'MODERATE', dispersion: 'MODERATE', plumeRisk: 'LOW' },
    { hourOffset: 72, timeLabel: '+72h', dayLabel: 'Day 3 Eve', aqi: 274, pm25: 122, isPeak: false, inversion: 'MODERATE', dispersion: 'GOOD', plumeRisk: 'LOW' }
  ],
  peakWindow: {
    time: 'Tomorrow 06:00 – 10:00',
    expectedAqiRange: '320 – 349 (Very Poor)',
    why: [
      'Strong nighttime inversion trapping ground emissions below 280m',
      'Weak surface winds (< 5 km/h) stalling horizontal dispersion',
      'Possible northwest agricultural plume transport corridor',
      'No significant rainfall or frontal wind clearing'
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
          setSnapshot(overviewData);
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

        {/* AI Atmospheric Explainer: Ask AirSync */}
        <AskAirSync />

      </main>

      {/* Footer & Data Provenance */}
      <Footer />

    </div>
  );
}
