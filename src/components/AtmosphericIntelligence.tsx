'use client';

import React from 'react';
import { AtmosphericSnapshot } from '@/lib/types';
import { Layers, Wind, Flame, AlertCircle, ArrowRight, Gauge, ShieldAlert } from 'lucide-react';

interface AtmosphericIntelligenceProps {
  data: AtmosphericSnapshot;
}

export default function AtmosphericIntelligence({ data }: AtmosphericIntelligenceProps) {
  return (
    <section id="why" className="scroll-mt-24 mb-16">
      
      {/* Section Header */}
      <div className="mb-8">
        <div className="text-xs font-mono tracking-wider uppercase text-rose-400 font-semibold mb-1">
          Section 02 / WHY? — The Atmospheric Core
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
          Why is pollution building up?
        </h2>
        <p className="text-base text-slate-300 mt-1.5 max-w-3xl">
          AirSync explains the atmospheric conditions behind the number.
        </p>
      </div>

      {/* 3 Large Intelligence Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* CARD 1: INVERSION */}
        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.09] backdrop-blur-xl relative overflow-hidden flex flex-col justify-between group hover:border-rose-500/40 transition-all duration-300 shadow-2xl">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400">
                  <Layers className="w-5 h-5" />
                </div>
                <span className="text-base font-semibold text-white">Inversion</span>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                {data.inversion.level}
              </span>
            </div>

            {/* Description */}
            <p className="text-sm text-slate-200 leading-relaxed font-normal">
              {data.inversion.description}
            </p>

            {/* Visual: Vertical Atmospheric Layers Diagram */}
            <div className="mt-5 p-3 rounded-xl bg-black/40 border border-white/[0.06] text-xs">
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
                <span>Vertical Atmospheric Cross-Section</span>
                <span className="text-rose-400 font-mono">Boundary: ~{data.inversion.boundaryHeightMeters}m</span>
              </div>

              {/* Atmospheric layers visualization */}
              <div className="space-y-1 font-mono text-[11px]">
                {/* Upper Troposphere (Free Air) */}
                <div className="py-1.5 px-2.5 rounded bg-blue-950/30 border border-blue-500/20 text-blue-200 flex items-center justify-between">
                  <span>Upper Atmosphere (Free Air)</span>
                  <span className="text-[10px] text-blue-400 font-sans">Clean Air Flow</span>
                </div>

                {/* Inversion Lid (Warm capping layer) */}
                <div className="py-2 px-2.5 rounded bg-gradient-to-r from-rose-950/70 via-amber-950/70 to-rose-950/70 border border-rose-500/40 text-rose-200 flex items-center justify-between shadow-inner">
                  <span className="font-semibold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                    Thermal Inversion Lid (Warm Air Cap)
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-rose-300">Blocks Escape</span>
                </div>

                {/* Trapped Surface Basin Layer */}
                <div className="py-3 px-2.5 rounded bg-amber-950/40 border border-amber-500/30 text-amber-200 flex items-center justify-between relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-rose-500/15 to-amber-500/10 opacity-75" />
                  <div className="relative z-10">
                    <div className="font-semibold text-amber-300">Trapped Ground Boundary Layer</div>
                    <div className="text-[10px] text-slate-300 font-sans mt-0.5">PM2.5 & Vehicle emissions concentrated near surface</div>
                  </div>
                  <span className="relative z-10 text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {data.inversion.trappingRatioPercent}% Trapped
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/[0.06] text-[11px] text-slate-400 flex items-center justify-between">
            <span>Thermal lapse rate reversed</span>
            <span className="text-rose-400 font-mono">High Stagnation</span>
          </div>
        </div>

        {/* CARD 2: DISPERSION */}
        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.09] backdrop-blur-xl relative overflow-hidden flex flex-col justify-between group hover:border-rose-500/40 transition-all duration-300 shadow-2xl">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400">
                  <Wind className="w-5 h-5" />
                </div>
                <span className="text-base font-semibold text-white">Dispersion</span>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                {data.dispersion.level}
              </span>
            </div>

            {/* Description */}
            <p className="text-sm text-slate-200 leading-relaxed font-normal">
              {data.dispersion.description}
            </p>

            {/* Mini-indicators Box */}
            <div className="mt-5 p-3.5 rounded-xl bg-black/40 border border-white/[0.06] space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Surface Wind Velocity</span>
                <span className="font-mono font-semibold text-white">
                  {data.dispersion.windSpeedKmh} km/h (Calm)
                </span>
              </div>
              <div className="w-full bg-white/[0.08] h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-rose-500 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min((data.dispersion.windSpeedKmh / 25) * 100, 100)}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-400">Atmospheric Mixing</span>
                <span className="font-mono font-semibold text-rose-300">
                  {data.dispersion.mixingStatus}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-white/[0.06]">
                <span className="text-slate-400">Ventilation Index</span>
                <span className="font-mono text-slate-300">
                  {data.dispersion.ventilationIndex} m²/s <span className="text-rose-400 text-[10px]">(&lt;2000 Critical)</span>
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/[0.06] text-[11px] text-slate-400 flex items-center justify-between">
            <span>Horizontal flushing stalled</span>
            <span className="text-rose-400 font-mono">Calm Isobars</span>
          </div>
        </div>

        {/* CARD 3: STUBBLE PLUME INFLUENCE */}
        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.09] backdrop-blur-xl relative overflow-hidden flex flex-col justify-between group hover:border-amber-500/40 transition-all duration-300 shadow-2xl">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  <Flame className="w-5 h-5" />
                </div>
                <span className="text-base font-semibold text-white">Stubble Plume Influence</span>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                {data.plume.level}
              </span>
            </div>

            {/* Description */}
            <p className="text-sm text-slate-200 leading-relaxed font-normal">
              {data.plume.description}
            </p>

            {/* Directional Transport Corridor & Satellite Indicator */}
            <div className="mt-5 p-3.5 rounded-xl bg-black/40 border border-white/[0.06] space-y-3">
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span>Transport Corridor</span>
                <span className="text-amber-400 font-sans">NW Trajectory</span>
              </div>

              {/* Visual Arrow Sequence */}
              <div className="flex items-center justify-between text-xs font-mono px-2 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06]">
                <span className="text-slate-300">Punjab</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span className="text-slate-300">Haryana</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span className="text-white font-semibold text-amber-300">Delhi NCR</span>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-400">NASA FIRMS Fires Detected</span>
                <span className="font-mono font-semibold text-white">
                  ~{data.plume.fireCountSatellite} anomalies
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/[0.06] text-[11px] text-amber-300/90 flex items-center justify-between">
            <span className="italic">{data.plume.confidence}</span>
            <span className="text-slate-500 font-mono">VIIRS/MODIS</span>
          </div>
        </div>

      </div>

      {/* OVERALL INTELLIGENCE SUMMARY (Most Visually Prominent) */}
      <div className="mt-6 p-6 sm:p-7 rounded-2xl bg-gradient-to-r from-rose-950/40 via-[#131824] to-rose-950/30 border border-rose-500/30 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-start sm:items-center gap-4">
            <div className="p-3.5 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-400 shrink-0">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  {data.riskSummary.headline}
                </h3>
                <span className="px-3 py-0.5 rounded-full text-xs font-mono font-bold bg-rose-500 text-white tracking-wide shadow-md shadow-rose-950">
                  {data.riskSummary.level}
                </span>
              </div>
              <p className="text-sm sm:text-base text-slate-200 mt-1 leading-relaxed max-w-3xl">
                {data.riskSummary.explanation}
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center sm:flex-col sm:items-end justify-between sm:justify-center border-t sm:border-t-0 sm:border-l border-white/[0.08] pt-3 sm:pt-0 sm:pl-6 text-xs font-mono text-slate-400">
            <span>Decision Impact</span>
            <span className="text-rose-300 font-semibold text-sm">Action Advised</span>
          </div>
        </div>
      </div>

    </section>
  );
}
