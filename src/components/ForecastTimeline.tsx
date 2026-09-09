'use client';

import React from 'react';
import { TimelineCode } from '@/lib/types';
import { Clock, Activity, CalendarClock, ChevronRight } from 'lucide-react';

interface ForecastTimelineProps {
  currentTimeline: TimelineCode;
  onSelectTimeline: (timeline: TimelineCode) => void;
  isLoading?: boolean;
}

export default function ForecastTimeline({
  currentTimeline,
  onSelectTimeline,
  isLoading
}: ForecastTimelineProps) {
  const tabs: Array<{
    code: TimelineCode;
    label: string;
    sublabel: string;
    description: string;
  }> = [
    {
      code: 'now',
      label: 'NOW',
      sublabel: 'Real-time Live',
      description: 'Current continuous telemetry'
    },
    {
      code: '24h',
      label: '+24H',
      sublabel: 'Tomorrow AM',
      description: 'Projected morning peak'
    },
    {
      code: '48h',
      label: '+48H',
      sublabel: 'Day After',
      description: 'Extended inversion window'
    },
    {
      code: '72h',
      label: '+72H',
      sublabel: '3 Days Ahead',
      description: 'Anticipated wind shift & flushing'
    }
  ];

  return (
    <div className="w-full bg-[#0c1018]/90 border border-white/[0.08] rounded-2xl p-2 sm:p-2.5 backdrop-blur-xl shadow-2xl mb-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-2 py-1 mb-2">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <CalendarClock className="w-4 h-4 text-cyan-400" />
          <span className="uppercase tracking-wider font-semibold text-slate-300">
            Temporal Simulation Mode
          </span>
          <span className="text-slate-600">/</span>
          <span>Synchronizing whole-dashboard telemetry</span>
        </div>
        <div className="text-[11px] text-slate-400 font-mono">
          Click any interval to simulate atmospheric conditions
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {tabs.map((tab) => {
          const isActive = currentTimeline === tab.code;
          return (
            <button
              key={tab.code}
              onClick={() => onSelectTimeline(tab.code)}
              className={`relative flex flex-col items-start text-left p-3 sm:p-3.5 rounded-xl transition-all duration-200 outline-none ${
                isActive
                  ? 'bg-gradient-to-b from-white/[0.12] to-white/[0.04] border border-cyan-400/40 text-white shadow-lg shadow-cyan-950/30'
                  : 'bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.05] text-slate-300 hover:text-white'
              }`}
            >
              {isActive && (
                <span className="absolute top-2 right-2 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
              )}

              <div className="flex items-center gap-2">
                <span
                  className={`text-base sm:text-lg font-mono font-bold tracking-tight ${
                    isActive ? 'text-cyan-400' : 'text-slate-200'
                  }`}
                >
                  {tab.label}
                </span>
                <span className="text-[11px] font-medium px-1.5 py-0.5 rounded bg-white/[0.06] text-slate-300">
                  {tab.sublabel}
                </span>
              </div>

              <div className="text-xs text-slate-400 mt-1 font-normal line-clamp-1">
                {tab.description}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
