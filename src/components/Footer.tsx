'use client';

import React from 'react';
import { Wind, Shield, Database, Cpu, Globe2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#06080d] py-12 px-4 sm:px-6 lg:px-8 text-xs font-mono text-slate-400">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top: Powered By Attributions (Not dominant) */}
        <div>
          <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-3">
            Telemetry & Computational Pipelines
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <div className="text-white font-semibold text-[11px] mb-0.5">CPCB CAAQMS</div>
              <div className="text-[10px] text-slate-500">Continuous surface grid</div>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <div className="text-white font-semibold text-[11px] mb-0.5">NASA FIRMS</div>
              <div className="text-[10px] text-slate-500">VIIRS/MODIS fire anomalies</div>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <div className="text-white font-semibold text-[11px] mb-0.5">ECMWF / CAMS</div>
              <div className="text-[10px] text-slate-500">Aerosol optical depth</div>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <div className="text-white font-semibold text-[11px] mb-0.5">IMD Observations</div>
              <div className="text-[10px] text-slate-500">Synoptic boundary winds</div>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <div className="text-cyan-400 font-semibold text-[11px] mb-0.5">AirSync Physics + AI</div>
              <div className="text-[10px] text-slate-500">Boundary-layer reasoning</div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Hackathon Branding */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/[0.05]">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Wind className="w-3.5 h-3.5" />
            </div>
            <span className="text-white font-bold font-sans text-sm">AirSync</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400 font-sans text-xs">
              Delhi NCR Air Quality Intelligence Platform
            </span>
          </div>

          <div className="text-center sm:text-right font-sans text-xs text-slate-500">
            Smart India Hackathon 2026 • Philosophy: <em className="text-slate-400">"Less information. More understanding."</em>
          </div>
        </div>

      </div>
    </footer>
  );
}
