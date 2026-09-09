'use client';

import React from 'react';
import { AtmosphericSnapshot } from '@/lib/types';
import { Wind, Droplets, Thermometer, Radio, ArrowUpRight } from 'lucide-react';

interface CurrentConditionsProps {
  data: AtmosphericSnapshot;
}

export default function CurrentConditions({ data }: CurrentConditionsProps) {
  // Restrained contextual accents:
  // Good: Emerald | Moderate: Amber | Poor: Amber-Rose | Very Poor/Severe: Rose/Crimson
  const getAqiBadgeStyle = (status: string) => {
    switch (status.toUpperCase()) {
      case 'GOOD':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'MODERATE':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'POOR':
        return 'text-amber-300 bg-amber-500/15 border-amber-500/30';
      case 'VERY POOR':
      case 'SEVERE':
        return 'text-rose-400 bg-rose-500/15 border-rose-500/30';
      default:
        return 'text-slate-300 bg-white/10 border-white/20';
    }
  };

  return (
    <section id="now" className="scroll-mt-24 mb-14">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
        <div>
          <div className="text-xs font-mono tracking-wider uppercase text-cyan-400 font-semibold mb-1">
            Section 01 / NOW
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Current Conditions
          </h2>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.06]">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="text-slate-300 font-medium">Live Data</span>
          </div>
          <span className="text-slate-500">•</span>
          <span>{data.updatedAgo}</span>
        </div>
      </div>

      {/* 5 Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5 sm:gap-4">
        
        {/* Card 1: AQI (Primary Metric) */}
        <div className="col-span-2 md:col-span-1 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.09] backdrop-blur-xl relative overflow-hidden group hover:border-white/20 transition-all duration-300 shadow-xl">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span className="uppercase tracking-wider">Air Quality Index</span>
            <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${getAqiBadgeStyle(data.aqiStatus)}`}>
              {data.aqiStatus}
            </span>
          </div>

          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-5xl sm:text-6xl font-extrabold tracking-tight text-white font-mono">
              {data.aqi}
            </span>
          </div>

          <div className="mt-3 pt-3 border-t border-white/[0.06] text-[11px] text-slate-400 flex items-center justify-between">
            <span>Scale: 0–500 (CPCB Standard)</span>
            <span className="text-slate-500 font-mono">NCR Grid</span>
          </div>
        </div>

        {/* Card 2: PM2.5 */}
        <div className="col-span-1 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.09] backdrop-blur-xl group hover:border-white/20 transition-all duration-300 shadow-xl">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span className="uppercase tracking-wider">PM2.5</span>
            <span className="text-[11px] font-semibold text-rose-300 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
              {data.pm25Status}
            </span>
          </div>

          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-4xl sm:text-5xl font-bold tracking-tight text-white font-mono">
              {data.pm25}
            </span>
            <span className="text-xs text-slate-400 font-mono">µg/m³</span>
          </div>

          <div className="mt-3 pt-3 border-t border-white/[0.06] text-[11px] text-slate-400 flex items-center justify-between">
            <span>WHO Limit: 15 µg/m³</span>
            <span className="text-rose-400/80 font-mono">9.2x Safe</span>
          </div>
        </div>

        {/* Card 3: Temperature */}
        <div className="col-span-1 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.09] backdrop-blur-xl group hover:border-white/20 transition-all duration-300 shadow-xl">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span className="uppercase tracking-wider">Temperature</span>
            <Thermometer className="w-3.5 h-3.5 text-slate-400" />
          </div>

          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-4xl sm:text-5xl font-bold tracking-tight text-white font-mono">
              {data.temp}
            </span>
            <span className="text-sm text-slate-400 font-mono">°C</span>
          </div>

          <div className="mt-3 pt-3 border-t border-white/[0.06] text-[11px] text-slate-400 flex items-center justify-between">
            <span>Surface Ambient</span>
            <span className="text-slate-500 font-mono">IMD Obs</span>
          </div>
        </div>

        {/* Card 4: Humidity */}
        <div className="col-span-1 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.09] backdrop-blur-xl group hover:border-white/20 transition-all duration-300 shadow-xl">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span className="uppercase tracking-wider">Humidity</span>
            <Droplets className="w-3.5 h-3.5 text-cyan-400/70" />
          </div>

          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-4xl sm:text-5xl font-bold tracking-tight text-white font-mono">
              {data.humidity}
            </span>
            <span className="text-sm text-slate-400 font-mono">%</span>
          </div>

          <div className="mt-3 pt-3 border-t border-white/[0.06] text-[11px] text-slate-400 flex items-center justify-between">
            <span>Aerosol growth active</span>
            <span className="text-slate-500 font-mono">High</span>
          </div>
        </div>

        {/* Card 5: Wind */}
        <div className="col-span-1 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.09] backdrop-blur-xl group hover:border-white/20 transition-all duration-300 shadow-xl">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span className="uppercase tracking-wider">Surface Wind</span>
            <Wind className="w-3.5 h-3.5 text-cyan-400" />
          </div>

          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-4xl sm:text-5xl font-bold tracking-tight text-white font-mono">
              {data.windSpeed}
            </span>
            <span className="text-xs text-slate-400 font-mono">km/h</span>
            <span className="text-xs font-bold font-mono px-1.5 py-0.5 rounded bg-white/[0.06] text-cyan-300 ml-auto">
              {data.windDirection}
            </span>
          </div>

          <div className="mt-3 pt-3 border-t border-white/[0.06] text-[11px] text-slate-400 flex items-center justify-between">
            <span>Dispersal: Stagnant</span>
            <span className="text-amber-400/80 font-mono">Sub-10 km/h</span>
          </div>
        </div>

      </div>
    </section>
  );
}
