'use client';

import React, { useState } from 'react';
import { ForecastResponse, ForecastPoint } from '@/lib/types';
import {
  AlertTriangle,
  TrendingUp,
  HelpCircle,
  Clock,
  Wind,
  ShieldAlert,
  ArrowUpRight,
  Sparkles,
  Zap,
  Activity
} from 'lucide-react';

interface Forecast72HoursProps {
  forecast: ForecastResponse;
}

export default function Forecast72Hours({ forecast }: Forecast72HoursProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const points = forecast.points;

  // Chart coordinates calculation (viewBox: 0 0 840 270)
  const chartWidth = 840;
  const chartHeight = 270;
  const paddingLeft = 70;
  const paddingRight = 45;
  const paddingTop = 50;
  const paddingBottom = 48;

  // Range strictly calibrated around 180 - 240
  // Y-axis spans 165 to 255 to provide vertical breathing space
  const yAxisMin = 165;
  const yAxisMax = 255;

  const getCoordinates = (index: number, aqi: number) => {
    const x = paddingLeft + (index / (points.length - 1)) * (chartWidth - paddingLeft - paddingRight);
    const clampedAqi = Math.max(yAxisMin, Math.min(yAxisMax, aqi));
    const normalizedY = (clampedAqi - yAxisMin) / (yAxisMax - yAxisMin);
    const y = chartHeight - paddingBottom - normalizedY * (chartHeight - paddingTop - paddingBottom);
    return { x, y };
  };

  const coords = points.map((p, i) => getCoordinates(i, p.aqi));

  // Generate smooth cubic bezier SVG curve path
  const pathD = coords.reduce((acc, curr, i, arr) => {
    if (i === 0) return `M ${curr.x} ${curr.y}`;
    const prev = arr[i - 1];
    const dx = curr.x - prev.x;
    const cpx1 = prev.x + dx * 0.45;
    const cpy1 = prev.y;
    const cpx2 = curr.x - dx * 0.45;
    const cpy2 = curr.y;
    return `${acc} C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${curr.x} ${curr.y}`;
  }, '');

  // Fill path for neon glowing area underneath curve
  const baselineY = chartHeight - paddingBottom;
  const fillD = `${pathD} L ${coords[coords.length - 1].x} ${baselineY} L ${coords[0].x} ${baselineY} Z`;

  // Grid reference lines at 180, 200, 220, 240
  const gridLevels = [
    { aqi: 240, label: '240 (Peak Spike)', color: '#f43f5e', dash: '3,3' },
    { aqi: 220, label: '220 (Poor Zone)', color: '#fb923c', dash: '3,3' },
    { aqi: 200, label: '200 (Mod/Poor Threshold)', color: '#facc15', dash: '3,3' },
    { aqi: 180, label: '180 (Moderate Baseline)', color: '#38bdf8', dash: '3,3' },
  ];

  const hoveredPoint = hoveredIndex !== null ? points[hoveredIndex] : null;
  const hoveredCoord = hoveredIndex !== null ? coords[hoveredIndex] : null;

  const peakPoint = points.find(p => p.isPeak) || points[2] || points[0];
  const startAqi = points[0]?.aqi ?? 186;
  const maxAqi = Math.max(...points.map(p => p.aqi));
  const endAqi = points[points.length - 1]?.aqi ?? 182;

  // Node color helper
  const getNodeColor = (aqi: number) => {
    if (aqi >= 230) return '#f43f5e';
    if (aqi >= 210) return '#fb923c';
    if (aqi >= 195) return '#f59e0b';
    return '#38bdf8';
  };

  return (
    <section id="forecast" className="scroll-mt-24 mb-16">
      
      {/* Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-amber-400 font-semibold mb-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
            <Activity className="w-3.5 h-3.5 text-amber-400" />
            <span>Section 04 / NEXT 72 HOURS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            What happens next?
          </h2>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Continuous 72-hour predictive trajectory calibrated between <span className="text-cyan-300 font-mono font-semibold">180 – 240 AQI</span> via planetary boundary layer acoustics & synoptic wind vectors.
          </p>
        </div>

        {/* Highlight Peak Badge */}
        <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-gradient-to-r from-rose-500/15 via-rose-500/10 to-amber-500/10 border border-rose-500/30 text-rose-300 font-mono text-xs shadow-xl backdrop-blur-md shrink-0">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-400 animate-ping shrink-0" />
          <div>
            <div className="font-bold text-white flex items-center gap-1.5">
              <span>Peak Window: 06:00 – 10:00 AM</span>
              <span className="px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 text-[10px]">AQI ~238</span>
            </div>
            <div className="text-[11px] text-slate-400">Diurnal nocturnal trapping over Delhi NCR</div>
          </div>
        </div>
      </div>

      {/* Main Glassmorphic Container */}
      <div className="p-5 sm:p-7 rounded-3xl bg-gradient-to-b from-[#0e1422]/90 via-[#0a0f1b]/95 to-[#070a12] border border-white/[0.12] backdrop-blur-2xl shadow-2xl relative overflow-hidden">
        
        {/* Subtle decorative background ambient glow */}
        <div className="absolute top-0 right-1/4 w-96 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-96 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* 3 Top Summary Telemetry Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 relative z-10">
          <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md">
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400 block font-semibold">01 / CURRENT BASELINE</span>
              <div className="text-xl font-bold font-mono text-cyan-300 mt-0.5">AQI {startAqi}</div>
            </div>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/25">
              NOW
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-rose-500/[0.06] border border-rose-500/20 backdrop-blur-md">
            <div>
              <span className="text-[10px] font-mono uppercase text-rose-300/80 block font-semibold">02 / PREDICTED PEAK SPIKE</span>
              <div className="text-xl font-bold font-mono text-rose-400 mt-0.5">AQI {maxAqi} (Peak)</div>
            </div>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
              +24h Spike
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/[0.05] border border-emerald-500/20 backdrop-blur-md">
            <div>
              <span className="text-[10px] font-mono uppercase text-emerald-300/80 block font-semibold">03 / 72H RECOVERY TARGET</span>
              <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5">AQI {endAqi}</div>
            </div>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              +72h Clearing
            </span>
          </div>
        </div>

        {/* Trajectory Header Info Bar */}
        <div className="flex flex-wrap items-center justify-between text-xs font-mono text-slate-400 pb-3 mb-2 border-b border-white/[0.06] relative z-10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-slate-300">
              Trajectory: <strong className="text-cyan-300">NOW ({startAqi})</strong> → <strong className="text-rose-400">+24h Peak ({maxAqi})</strong> → <strong className="text-emerald-400">+72h Recovery ({endAqi})</strong>
            </span>
          </div>
          <span className="text-cyan-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Hover nodes to inspect hourly atmospheric drivers
          </span>
        </div>

        {/* SVG Forecast Graph Container */}
        <div className="relative w-full overflow-x-auto select-none py-1 relative z-10">
          <svg viewBox="0 0 840 270" className="w-full h-auto min-w-[680px]">
            <defs>
              {/* Neon Line Glow Filter */}
              <filter id="neonLineGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Area Fill Gradient */}
              <linearGradient id="glowAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.32" />
                <stop offset="45%" stopColor="#f59e0b" stopOpacity="0.16" />
                <stop offset="85%" stopColor="#06b6d4" stopOpacity="0.05" />
                <stop offset="100%" stopColor="#080b11" stopOpacity="0.0" />
              </linearGradient>

              {/* Dynamic Stroke Gradient: Cyan -> Amber -> Rose Peak -> Amber -> Emerald */}
              <linearGradient id="glowStrokeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="20%" stopColor="#38bdf8" />
                <stop offset="38%" stopColor="#f59e0b" />
                <stop offset="50%" stopColor="#f43f5e" />
                <stop offset="70%" stopColor="#fb923c" />
                <stop offset="85%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>

              {/* Peak Danger Zone Shading */}
              <linearGradient id="peakZoneGlassGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.14" />
                <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.02" />
              </linearGradient>
            </defs>

            {/* Threshold Horizontal Guide Lines */}
            {gridLevels.map((lvl) => {
              const y = chartHeight - paddingBottom - ((lvl.aqi - yAxisMin) / (yAxisMax - yAxisMin)) * (chartHeight - paddingTop - paddingBottom);
              return (
                <g key={lvl.aqi} className="transition-opacity">
                  <line
                    x1={paddingLeft}
                    y1={y}
                    x2={chartWidth - paddingRight}
                    y2={y}
                    stroke={lvl.color}
                    strokeWidth="0.8"
                    strokeDasharray={lvl.dash}
                    opacity="0.25"
                  />
                  <text
                    x={paddingLeft - 10}
                    y={y + 3.5}
                    textAnchor="end"
                    fill={lvl.color}
                    fontSize="9.5"
                    fontFamily="monospace"
                    fontWeight="bold"
                    opacity="0.85"
                  >
                    {lvl.label}
                  </text>
                </g>
              );
            })}

            {/* Predicted Peak Window Highlight Box (+24h to +48h: coords[2] to coords[4]) */}
            {coords[2] && coords[4] && (
              <g>
                <rect
                  x={coords[2].x - 18}
                  y={paddingTop - 15}
                  width={coords[4].x - coords[2].x + 36}
                  height={baselineY - paddingTop + 15}
                  fill="url(#peakZoneGlassGrad)"
                  rx="14"
                  stroke="#f43f5e"
                  strokeWidth="1.2"
                  strokeDasharray="4,4"
                  opacity="0.8"
                />
                <rect
                  x={(coords[2].x + coords[4].x) / 2 - 120}
                  y={paddingTop - 25}
                  width="240"
                  height="20"
                  rx="10"
                  fill="#180b12"
                  stroke="#f43f5e"
                  strokeWidth="1"
                />
                <text
                  x={(coords[2].x + coords[4].x) / 2}
                  y={paddingTop - 11}
                  textAnchor="middle"
                  fill="#fca5a5"
                  fontSize="9"
                  fontFamily="monospace"
                  fontWeight="bold"
                  letterSpacing="0.05em"
                >
                  ▲ PREDICTED PEAK WINDOW (06:00 – 10:00)
                </text>
              </g>
            )}

            {/* Vertical Guideline for each point down to baseline */}
            {coords.map((c, i) => (
              <line
                key={`vert-${i}`}
                x1={c.x}
                y1={c.y}
                x2={c.x}
                y2={baselineY}
                stroke={hoveredIndex === i ? '#38bdf8' : '#ffffff'}
                strokeWidth={hoveredIndex === i ? '1.5' : '0.5'}
                strokeDasharray={hoveredIndex === i ? 'none' : '2,3'}
                opacity={hoveredIndex === i ? 0.6 : 0.15}
              />
            ))}

            {/* Smooth Fill Area */}
            <path d={fillD} fill="url(#glowAreaGrad)" />

            {/* Ambient Background Glow Layer along path */}
            <path
              d={pathD}
              fill="none"
              stroke="url(#glowStrokeGrad)"
              strokeWidth="8"
              strokeLinecap="round"
              filter="url(#neonLineGlow)"
              opacity="0.4"
            />

            {/* Crisp Foreground Trajectory Curve */}
            <path
              d={pathD}
              fill="none"
              stroke="url(#glowStrokeGrad)"
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* Data Nodes on the curve */}
            {points.map((pt, i) => {
              const { x, y } = coords[i];
              const isPeak = pt.isPeak;
              const isHovered = hoveredIndex === i;
              const nodeColor = getNodeColor(pt.aqi);

              return (
                <g
                  key={pt.hourOffset}
                  className="cursor-pointer transition-transform"
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => setHoveredIndex(i)}
                >
                  {/* Outer pulsating ring for peaks */}
                  {isPeak && (
                    <circle
                      cx={x}
                      cy={y}
                      r="14"
                      fill="#f43f5e"
                      opacity="0.25"
                      className="animate-ping"
                      style={{ animationDuration: '2.5s' }}
                    />
                  )}

                  {/* Hover halo */}
                  {isHovered && (
                    <circle cx={x} cy={y} r="16" fill={nodeColor} opacity="0.2" />
                  )}

                  {/* Main Node Circle */}
                  <circle
                    cx={x}
                    cy={y}
                    r={isHovered ? '8' : isPeak ? '6.5' : '5'}
                    fill="#080b11"
                    stroke={nodeColor}
                    strokeWidth={isPeak ? '3' : '2.5'}
                    className="transition-all duration-200"
                  />
                  <circle
                    cx={x}
                    cy={y}
                    r={isHovered ? '4' : '2.5'}
                    fill={nodeColor}
                  />

                  {/* AQI Value Pill above node */}
                  <g transform={`translate(${x}, ${y - 18})`}>
                    <rect
                      x="-20"
                      y="-12"
                      width="40"
                      height="17"
                      rx="6"
                      fill="#0b0f19"
                      stroke={isHovered ? '#38bdf8' : isPeak ? '#f43f5e' : 'rgba(255,255,255,0.2)'}
                      strokeWidth={isHovered ? '1.5' : '1'}
                    />
                    <text
                      x="0"
                      y="0.5"
                      textAnchor="middle"
                      fill={isPeak ? '#fca5a5' : '#ffffff'}
                      fontSize="11"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {pt.aqi}
                    </text>
                  </g>

                  {/* Bottom Time & Day Labels */}
                  <g transform={`translate(${x}, ${chartHeight - 20})`}>
                    <text
                      x="0"
                      y="0"
                      textAnchor="middle"
                      fill={isHovered ? '#38bdf8' : isPeak ? '#fda4af' : '#e2e8f0'}
                      fontSize="11"
                      fontFamily="monospace"
                      fontWeight={isPeak || isHovered ? 'bold' : '600'}
                    >
                      {pt.timeLabel}
                    </text>
                    <text
                      x="0"
                      y="13"
                      textAnchor="middle"
                      fill="#94a3b8"
                      fontSize="9"
                      fontFamily="sans-serif"
                    >
                      {pt.dayLabel}
                    </text>
                  </g>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Dynamic Interactive Inspector Tooltip Card */}
        {hoveredPoint && hoveredCoord && (
          <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-black/80 via-slate-900/90 to-black/80 border border-cyan-500/30 backdrop-blur-xl shadow-2xl flex flex-wrap items-center justify-between gap-4 text-xs font-mono relative z-20 animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <div className="text-white font-bold text-sm">
                  {hoveredPoint.timeLabel} ({hoveredPoint.dayLabel})
                </div>
                <div className="text-slate-400 text-[11px]">
                  Hour +{hoveredPoint.hourOffset} atmospheric forecast slice
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 border-l border-white/10 pl-4">
              <div>
                <span className="text-slate-400 text-[10px] block">PREDICTED AQI</span>
                <span className="text-lg font-extrabold text-white" style={{ color: getNodeColor(hoveredPoint.aqi) }}>
                  {hoveredPoint.aqi}
                </span>
                <span className="text-slate-400 text-[10px] ml-1">
                  ({hoveredPoint.aqi >= 200 ? 'POOR' : 'MODERATE'})
                </span>
              </div>

              <div>
                <span className="text-slate-400 text-[10px] block">ESTIMATED PM2.5</span>
                <span className="text-sm font-bold text-slate-200">
                  {hoveredPoint.pm25} <span className="text-[10px] text-slate-400 font-normal">µg/m³</span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 border-l border-white/10 pl-4 text-[11px]">
              <div className="px-2.5 py-1 rounded-lg bg-black/40 border border-white/[0.06]">
                <span className="text-slate-400 block text-[9px] uppercase">Inversion</span>
                <span className="font-bold text-rose-300">{hoveredPoint.inversion}</span>
              </div>

              <div className="px-2.5 py-1 rounded-lg bg-black/40 border border-white/[0.06]">
                <span className="text-slate-400 block text-[9px] uppercase">Dispersion</span>
                <span className="font-bold text-amber-300">{hoveredPoint.dispersion}</span>
              </div>

              <div className="px-2.5 py-1 rounded-lg bg-black/40 border border-white/[0.06]">
                <span className="text-slate-400 block text-[9px] uppercase">Plume Risk</span>
                <span className="font-bold text-cyan-300">{hoveredPoint.plumeRisk}</span>
              </div>
            </div>
          </div>
        )}

        {/* "Why will pollution peak?" Atmospheric Causality Section */}
        <div className="mt-6 pt-5 border-t border-white/[0.08] relative z-10">
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              <h4 className="text-sm font-bold uppercase font-mono tracking-wider text-white">
                Why will pollution peak during this 72h window?
              </h4>
            </div>
            <span className="text-xs font-mono text-slate-400 hidden sm:inline">
              Meteorological Drivers & Atmospheric Physics
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            {forecast.peakWindow.why.map((reason, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] hover:border-cyan-500/30 transition-all text-slate-300 flex items-start gap-3 group"
              >
                <span className="w-2 h-2 rounded-full bg-rose-400 mt-1.5 shrink-0 group-hover:scale-125 transition-transform shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
                <span className="leading-relaxed font-normal group-hover:text-white transition-colors">{reason}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
