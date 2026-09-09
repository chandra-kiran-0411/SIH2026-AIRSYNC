'use client';

import React from 'react';
import { Wind, ShieldCheck, Sparkles, Navigation } from 'lucide-react';

interface NavbarProps {
  activeSection?: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export default function Navbar({ activeSection, onRefresh, isRefreshing }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#080b11]/80 backdrop-blur-xl transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Brand Identity */}
        <div className="flex items-center space-x-3.5">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/10 border border-cyan-500/30 text-cyan-400 shadow-inner shadow-cyan-500/10">
            <Wind className="w-5 h-5" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-cyan-400 animate-ping opacity-75" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold tracking-tight text-white font-sans">
                AirSync
              </span>
              <span className="text-[10px] uppercase font-mono tracking-wider px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-medium">
                SIH 2026
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-400 tracking-normal -mt-0.5">
              Delhi NCR Air Intelligence
            </p>
          </div>
        </div>

        {/* Center: Minimal Navigation */}
        <nav className="hidden md:flex items-center space-x-1 sm:space-x-2 text-sm font-medium text-slate-300">
          <a
            href="#now"
            className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-white/[0.05] transition-colors"
          >
            Overview
          </a>
          <a
            href="#why"
            className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-white/[0.05] transition-colors"
          >
            Why?
          </a>
          <a
            href="#map"
            className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-white/[0.05] transition-colors"
          >
            Map
          </a>
          <a
            href="#forecast"
            className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-white/[0.05] transition-colors"
          >
            Forecast
          </a>
          <a
            href="#action"
            className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-white/[0.05] transition-colors"
          >
            Action
          </a>
          <a
            href="#ask"
            className="px-3 py-1.5 rounded-lg text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Ask AI
          </a>
        </nav>

        {/* Right: Region & LIVE Status */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-medium">
            <span className="text-slate-300 font-medium">Delhi NCR</span>
            <span className="w-1 h-1 rounded-full bg-slate-600" />
            <div className="flex items-center space-x-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] font-mono font-semibold tracking-wider text-emerald-400">
                LIVE
              </span>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
}
