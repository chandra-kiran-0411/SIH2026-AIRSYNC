'use client';

import React from 'react';
import { ArrowRight, AlertTriangle, CloudSun, Eye } from 'lucide-react';

interface HeroProps {
  currentAqi?: number;
  aqiCategory?: string;
  peakPeriod?: string;
}

export default function Hero({ currentAqi = 287, aqiCategory = 'POOR', peakPeriod = '06:00 – 10:00 Tomorrow' }: HeroProps) {
  return (
    <section className="relative pt-12 pb-10 sm:pt-16 sm:pb-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* 5-Second Executive Briefing Pill */}
      <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-medium mb-6 backdrop-blur-md">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
        <span className="font-semibold tracking-wide uppercase text-[11px] font-mono">
          Executive Synopsis
        </span>
        <span className="text-amber-400/50">|</span>
        <span className="text-slate-300 text-xs truncate max-w-md sm:max-w-none">
          Poor air quality (AQI {currentAqi}) driven by thermal inversion trapping. Peak spike expected {peakPeriod}.
        </span>
      </div>

      {/* Main Hero Typography */}
      <div className="max-w-4xl">
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.08]">
          Understand the air.
          <br />
          <span className="text-slate-400 font-light">Before it changes.</span>
        </h1>
        
        <p className="mt-5 text-lg sm:text-xl text-slate-300 font-normal leading-relaxed max-w-2xl">
          Real-time air quality, atmospheric intelligence and 72-hour pollution forecasting for <span className="text-white font-medium">Delhi NCR</span>.
        </p>
      </div>

      {/* 4 Core Questions Fast-Navigation Bar */}
      <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-white/[0.06]">
        <a 
          href="#now" 
          className="group p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.06] hover:border-cyan-500/30 transition-all duration-200"
        >
          <div className="text-[11px] font-mono font-semibold uppercase tracking-wider text-cyan-400">
            01 / NOW
          </div>
          <div className="text-sm font-medium text-white group-hover:text-cyan-300 transition-colors">
            What is happening?
          </div>
          <div className="text-xs text-slate-400 mt-0.5">
            AQI {currentAqi} • {aqiCategory}
          </div>
        </a>

        <a 
          href="#why" 
          className="group p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.06] hover:border-rose-500/30 transition-all duration-200"
        >
          <div className="text-[11px] font-mono font-semibold uppercase tracking-wider text-rose-400">
            02 / WHY
          </div>
          <div className="text-sm font-medium text-white group-hover:text-rose-300 transition-colors">
            Why is it building up?
          </div>
          <div className="text-xs text-slate-400 mt-0.5">
            Inversion & Dispersion
          </div>
        </a>

        <a 
          href="#forecast" 
          className="group p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.06] hover:border-amber-500/30 transition-all duration-200"
        >
          <div className="text-[11px] font-mono font-semibold uppercase tracking-wider text-amber-400">
            03 / NEXT
          </div>
          <div className="text-sm font-medium text-white group-hover:text-amber-300 transition-colors">
            Next 72 hours?
          </div>
          <div className="text-xs text-slate-400 mt-0.5">
            Peak morning alert
          </div>
        </a>

        <a 
          href="#action" 
          className="group p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.06] hover:border-emerald-500/30 transition-all duration-200"
        >
          <div className="text-[11px] font-mono font-semibold uppercase tracking-wider text-emerald-400">
            04 / ACTION
          </div>
          <div className="text-sm font-medium text-white group-hover:text-emerald-300 transition-colors">
            What to do?
          </div>
          <div className="text-xs text-slate-400 mt-0.5">
            Citizens • Admin • Industry
          </div>
        </a>
      </div>

    </section>
  );
}
