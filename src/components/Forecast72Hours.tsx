'use client';

import React, { useState } from 'react';
import { ForecastResponse, ForecastPoint } from '@/lib/types';
import { AlertTriangle, TrendingUp, HelpCircle, ArrowRight, Clock } from 'lucide-react';

interface Forecast72HoursProps {
  forecast: ForecastResponse;
}

export default function Forecast72Hours({ forecast }: Forecast72HoursProps) {
  const [hoveredPoint, setHoveredPoint] = useState<ForecastPoint | null>(null);

  const points = forecast.points;
  const maxAqi = 400;
  const minAqi = 200;

  // Chart coordinates calculation (viewBox: 0 0 700 240)
  const chartWidth = 700;
  const chartHeight = 220;
  const paddingX = 45;
  const paddingY = 30;

  const getCoordinates = (index: number, aqi: number) => {
    const x = paddingX + (index / (points.length - 1)) * (chartWidth - paddingX * 2);
    const normalizedY = (aqi - minAqi) / (maxAqi - minAqi);
    const y = chartHeight - paddingY - normalizedY * (chartHeight - paddingY * 2);
    return { x, y };
  };

  const coords = points.map((p, i) => getCoordinates(i, p.aqi));

  // Generate smooth SVG curve path
  const pathD = coords.reduce((acc, curr, i, arr) => {
    if (i === 0) return `M ${curr.x} ${curr.y}`;
    const prev = arr[i - 1];
    const cpx1 = prev.x + (curr.x - prev.x) / 2;
    const cpy1 = prev.y;
    const cpx2 = prev.x + (curr.x - prev.x) / 2;
    const cpy2 = curr.y;
    return `${acc} C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${curr.x} ${curr.y}`;
  }, '');

  // Fill path for subtle gradient
  const fillD = `${pathD} L ${coords[coords.length - 1].x} ${chartHeight - paddingY} L ${coords[0].x} ${chartHeight - paddingY} Z`;

  return (
    <section id="forecast" className="scroll-mt-24 mb-16">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
        <div>
          <div className="text-xs font-mono tracking-wider uppercase text-amber-400 font-semibold mb-1">
            Section 04 / NEXT 72 HOURS
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            What happens next?
          </h2>
          <p className="text-sm text-slate-300 mt-1">
            72-hour continuous predictive trajectory modeled via boundary layer acoustics & synoptic wind vectors.
          </p>
        </div>

        {/* Highlight Peak Badge */}
        <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 font-mono text-xs shadow-lg">
          <AlertTriangle className="w-4 h-4 text-rose-400 animate-pulse" />
          <span className="font-bold">Peak expected tomorrow morning: 06:00 – 10:00</span>
        </div>
      </div>

      {/* Main Chart Container */}
      <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.09] backdrop-blur-xl shadow-2xl">
        
        {/* Trajectory Header */}
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-4 pb-3 border-b border-white/[0.06]">
          <span>Trajectory: NOW ({points[0]?.aqi}) → +48h Peak ({Math.max(...points.map(p => p.aqi))}) → +72h Recovery ({points[points.length - 1]?.aqi})</span>
          <span className="text-cyan-400">Hover nodes to view atmospheric drivers</span>
        </div>

        {/* SVG Forecast Graph */}
        <div className="relative w-full overflow-x-auto select-none py-2">
          <svg viewBox="0 0 700 240" className="w-full h-auto min-w-[560px]">
            <defs>
              {/* Area Gradient */}
              <linearGradient id="forecastAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.35" />
                <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
              </linearGradient>

              {/* Stroke Gradient */}
              <linearGradient id="forecastStrokeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="40%" stopColor="#f43f5e" />
                <stop offset="70%" stopColor="#e11d48" />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>

              {/* Peak Danger Zone Shading */}
              <linearGradient id="peakZoneGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.02" />
              </linearGradient>
            </defs>

            {/* Threshold Guide Lines */}
            {/* Severe: 350 */}
            <g opacity="0.3">
              <line x1={paddingX} y1="40" x2={chartWidth - paddingX} y2="40" stroke="#be123c" strokeWidth="0.8" strokeDasharray="3,3" />
              <text x={paddingX - 8} y="44" textAnchor="end" fill="#be123c" fontSize="9" fontFamily="monospace">350 (Severe)</text>

              {/* Very Poor: 300 */}
              <line x1={paddingX} y1="95" x2={chartWidth - paddingX} y2="95" stroke="#f43f5e" strokeWidth="0.8" strokeDasharray="3,3" />
              <text x={paddingX - 8} y="99" textAnchor="end" fill="#f43f5e" fontSize="9" fontFamily="monospace">300 (V.Poor)</text>

              {/* Poor: 250 */}
              <line x1={paddingX} y1="150" x2={chartWidth - paddingX} y2="150" stroke="#f59e0b" strokeWidth="0.8" strokeDasharray="3,3" />
              <text x={paddingX - 8} y="154" textAnchor="end" fill="#f59e0b" fontSize="9" fontFamily="monospace">250 (Poor)</text>
            </g>

            {/* Peak Window Highlight Band (Between point 2 and 4: +24h to +48h) */}
            <rect
              x={coords[2]?.x - 15}
              y="20"
              width={coords[4]?.x - coords[2]?.x + 30}
              height="170"
              fill="url(#peakZoneGrad)"
              rx="8"
              stroke="#f43f5e"
              strokeWidth="0.8"
              strokeDasharray="4,4"
              opacity="0.8"
            />
            <text
              x={(coords[2]?.x + coords[4]?.x) / 2}
              y="32"
              textAnchor="middle"
              fill="#f43f5e"
              fontSize="9"
              fontFamily="monospace"
              fontWeight="bold"
            >
              ▲ PREDICTED PEAK WINDOW (06:00 – 10:00)
            </text>

            {/* Area Fill */}
            <path d={fillD} fill="url(#forecastAreaGrad)" />

            {/* Curve Line */}
            <path
              d={pathD}
              fill="none"
              stroke="url(#forecastStrokeGrad)"
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* Data Nodes */}
            {points.map((pt, i) => {
              const { x, y } = coords[i];
              const isPeak = pt.isPeak;
              const isHovered = hoveredPoint?.hourOffset === pt.hourOffset;

              return (
                <g
                  key={pt.hourOffset}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredPoint(pt)}
                  onMouseLeave={() => setHoveredPoint(null)}
                >
                  {/* Outer circle for pulse on peak */}
                  {isPeak && (
                    <circle cx={x} cy={y} r="10" fill="#f43f5e" opacity="0.25" className="animate-ping" />
                  )}

                  <circle
                    cx={x}
                    cy={y}
                    r={isHovered ? '8' : isPeak ? '6' : '4.5'}
                    fill={isPeak ? '#f43f5e' : '#ffffff'}
                    stroke={isPeak ? '#ffffff' : '#38bdf8'}
                    strokeWidth="2"
                    className="transition-all duration-200"
                  />

                  {/* AQI Value Label */}
                  <text
                    x={x}
                    y={y - 12}
                    textAnchor="middle"
                    fill={isPeak ? '#f43f5e' : '#ffffff'}
                    fontSize={isPeak ? '12' : '11'}
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {pt.aqi}
                  </text>

                  {/* Time Label on bottom axis */}
                  <text
                    x={x}
                    y={chartHeight - 6}
                    textAnchor="middle"
                    fill={isPeak ? '#fda4af' : '#94a3b8'}
                    fontSize="10"
                    fontFamily="monospace"
                    fontWeight={isPeak ? 'bold' : 'normal'}
                  >
                    {pt.timeLabel}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Hovered Point Inspector Tooltip Card */}
        {hoveredPoint && (
          <div className="mt-3 p-3 rounded-xl bg-black/60 border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-white font-bold">{hoveredPoint.timeLabel} ({hoveredPoint.dayLabel})</span>
              <span className="text-slate-400">|</span>
              <span className="text-rose-400 font-bold">AQI {hoveredPoint.aqi}</span>
              <span className="text-slate-400">PM2.5: {hoveredPoint.pm25} µg/m³</span>
            </div>
            <div className="flex items-center gap-3 text-slate-300">
              <span>Inversion: <strong className="text-white">{hoveredPoint.inversion}</strong></span>
              <span>Dispersion: <strong className="text-white">{hoveredPoint.dispersion}</strong></span>
              <span>Plume: <strong className="text-amber-400">{hoveredPoint.plumeRisk}</strong></span>
            </div>
          </div>
        )}

        {/* "Why?" Atmospheric Causality Section Underneath Graph */}
        <div className="mt-6 pt-5 border-t border-white/[0.08]">
          <div className="flex items-center gap-2 mb-3">
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            <h4 className="text-sm font-bold uppercase font-mono tracking-wider text-white">
              Why will pollution peak?
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            {forecast.peakWindow.why.map((reason, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-black/30 border border-white/[0.05] text-slate-300 flex items-start gap-2.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                <span className="leading-relaxed font-normal">{reason}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
