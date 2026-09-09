'use client';

import React, { useState } from 'react';
import { ActionAdvisory } from '@/lib/types';
import { Users, Building2, Factory, CheckCircle2, AlertOctagon, ShieldCheck } from 'lucide-react';

interface ActionPanelProps {
  advisories: ActionAdvisory[];
}

export default function ActionPanel({ advisories }: ActionPanelProps) {
  const [activeTab, setActiveTab] = useState<'citizens' | 'authorities' | 'industries'>('citizens');

  const citizenAdvisory = advisories.find((a) => a.targetRole === 'citizens');
  const authorityAdvisory = advisories.find((a) => a.targetRole === 'authorities');
  const industryAdvisory = advisories.find((a) => a.targetRole === 'industries');

  const currentAdvisory =
    activeTab === 'citizens'
      ? citizenAdvisory
      : activeTab === 'authorities'
      ? authorityAdvisory
      : industryAdvisory;

  return (
    <section id="action" className="scroll-mt-24 mb-16">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
        <div>
          <div className="text-xs font-mono tracking-wider uppercase text-emerald-400 font-semibold mb-1">
            Section 06 / ACTION
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            What should we do?
          </h2>
          <p className="text-sm text-slate-300 mt-1">
            Role-specific decision protocols. Grounded, practical actions without alarmism.
          </p>
        </div>

        {/* 3 Role Tabs */}
        <div className="flex items-center p-1 rounded-xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-md">
          <button
            onClick={() => setActiveTab('citizens')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'citizens'
                ? 'bg-emerald-500 text-slate-950 font-semibold shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Citizens
          </button>

          <button
            onClick={() => setActiveTab('authorities')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'authorities'
                ? 'bg-emerald-500 text-slate-950 font-semibold shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            Authorities
          </button>

          <button
            onClick={() => setActiveTab('industries')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'industries'
                ? 'bg-emerald-500 text-slate-950 font-semibold shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Factory className="w-3.5 h-3.5" />
            Industries
          </button>
        </div>
      </div>

      {/* Role Action Content Card */}
      {currentAdvisory && (
        <div className="p-6 sm:p-8 rounded-2xl bg-white/[0.03] border border-white/[0.09] backdrop-blur-xl shadow-2xl relative overflow-hidden">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                {currentAdvisory.badge}
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-2">
                {currentAdvisory.headline}
              </h3>
            </div>

            {/* Primary Action Callout */}
            <div className="shrink-0 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 max-w-sm">
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold block mb-1">
                Priority Direct Action
              </span>
              <p className="text-xs text-emerald-200 font-medium leading-normal">
                {currentAdvisory.primaryAction}
              </p>
            </div>
          </div>

          {/* Action Checklist Bullets */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {currentAdvisory.bulletPoints.map((point, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-black/30 border border-white/[0.05] flex items-start gap-3 group hover:border-emerald-500/30 transition-all"
              >
                <div className="p-1 rounded bg-emerald-500/10 text-emerald-400 shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <p className="text-sm text-slate-200 leading-relaxed font-normal">
                  {point}
                </p>
              </div>
            ))}
          </div>

          {/* Non-alarmist standard notice */}
          <div className="mt-6 pt-4 border-t border-white/[0.06] text-[11px] text-slate-400 flex items-center justify-between">
            <span>Aligned with Graded Response Action Plan (GRAP-III Stage Protocols)</span>
            <span className="text-slate-500 font-mono">Official Guidance Compliant</span>
          </div>

        </div>
      )}

    </section>
  );
}
