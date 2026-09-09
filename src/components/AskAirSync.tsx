'use client';

import React, { useState } from 'react';
import { Sparkles, Send, Bot, ArrowRight, HelpCircle, CheckCircle } from 'lucide-react';

export default function AskAirSync() {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<{
    answer: string;
    keyFactors: string[];
    confidence: string;
    meteorologicalBasis: string;
  } | null>({
    answer:
      'AirSync expects AQI to rise because nighttime atmospheric inversion is likely to strengthen while wind speeds remain low, reducing pollutant dispersion. Satellite fire activity northwest of Delhi may also contribute to plume transport toward NCR.',
    keyFactors: ['Nighttime atmospheric inversion', 'Low wind speed (<5 km/h)', 'Northwest plume transport'],
    confidence: 'High',
    meteorologicalBasis: 'Synoptic nocturnal radiative cooling and boundary-layer compression.'
  });

  const presetQuestions = [
    'Why will AQI increase tomorrow?',
    'What causes the 6 AM - 10 AM peak?',
    'How does stubble burning affect NCR?',
    'Is it safe to jog tomorrow morning?',
    'Why is Ghaziabad worse than Gurugram?'
  ];

  const handleSubmit = async (queryToSubmit?: string) => {
    const q = (queryToSubmit || question).trim();
    if (!q || loading) return;

    setLoading(true);
    try {
      const res = await fetch('/api/ask-airsync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q })
      });

      if (res.ok) {
        const data = await res.json();
        setResponse(data);
        if (!queryToSubmit) setQuestion('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="ask" className="scroll-mt-24 mb-16">
      <div className="p-6 sm:p-7 rounded-2xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-xl shadow-xl">
        
        {/* Header (Visually Secondary as instructed) */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Ask AirSync</h3>
              <p className="text-xs text-slate-400">
                Atmospheric causality reasoning engine
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono text-slate-500 px-2 py-0.5 rounded bg-white/[0.03] border border-white/[0.06]">
            Causal Physics + AI
          </span>
        </div>

        {/* Preset Chips */}
        <div className="flex flex-wrap gap-2 mb-4">
          {presetQuestions.map((pq, idx) => (
            <button
              key={idx}
              onClick={() => {
                setQuestion(pq);
                handleSubmit(pq);
              }}
              className="text-xs px-3 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] hover:border-cyan-500/30 text-slate-300 hover:text-white transition-all text-left"
            >
              {pq}
            </button>
          ))}
        </div>

        {/* Interactive Query Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="flex items-center gap-2 mb-5"
        >
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask anything (e.g. Why is the morning inversion dangerous?)"
            className="flex-1 px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500/50 transition-colors"
          />
          <button
            type="submit"
            disabled={loading || !question.trim()}
            className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-semibold text-sm transition-all flex items-center gap-1.5 shrink-0"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Ask</span>
                <Send className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* AI Answer Display */}
        {response && (
          <div className="p-4 rounded-xl bg-black/40 border border-cyan-500/20 text-sm">
            <div className="flex items-start gap-3">
              <Bot className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div className="space-y-3">
                <p className="text-slate-200 leading-relaxed font-normal">
                  {response.answer}
                </p>

                {response.keyFactors && response.keyFactors.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-[11px] font-mono text-slate-400">Drivers:</span>
                    {response.keyFactors.map((factor, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20"
                      >
                        {factor}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
