import React from "react";
import { SwotAnalysis } from "../types";
import { Shield, Sparkles, TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";

interface SwotViewProps {
  analysis: SwotAnalysis;
}

export default function SwotView({ analysis }: SwotViewProps) {
  return (
    <div id="swot-analyzer" className="space-y-8">
      {/* Strategic AI recommendation */}
      <div id="swot-recommendation-card" className="bg-zinc-950 border border-white/5 text-white rounded-2xl p-6 md:p-8 space-y-5 relative overflow-hidden">
        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <h3 className="text-base font-semibold tracking-tight">SWOT Strategic Recommendation</h3>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">
          {analysis.summary}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Strategic Pivot / Decision
            </span>
            <p className="text-sm text-white font-medium">
              {analysis.recommendation.verdict}
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              SWOT Alignment Core Strategy
            </span>
            <p className="text-sm text-white font-medium">
              {analysis.recommendation.key_reason}
            </p>
          </div>
        </div>

        {/* Action Steps */}
        <div className="pt-4 border-t border-white/5 space-y-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Immediate Recommended Initiatives
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {analysis.recommendation.action_steps.map((step, i) => (
              <div key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
                <CheckCircle2 className="w-4.5 h-4.5 text-amber-400 flex-shrink-0 mt-0.5" />
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SWOT 2x2 Bento Grid */}
      <div id="swot-bento-grid" className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* STRENGTHS (Internal, Positive - Emerald) */}
        <div id="swot-strengths" className="bg-emerald-950/10 border border-emerald-900/30 hover:border-emerald-500/20 rounded-2xl p-6 space-y-4 hover:shadow-sm transition duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-emerald-950/40 text-emerald-400 rounded-xl font-black text-lg w-10 h-10 flex items-center justify-center">S</span>
              <h4 className="font-bold text-emerald-400 text-base">Strengths</h4>
            </div>
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider bg-emerald-950/30 border border-emerald-900/30 px-2.5 py-0.5 rounded-full">
              Internal / Helpful
            </span>
          </div>
          <p className="text-xs text-emerald-300 leading-normal bg-emerald-950/20 p-2.5 rounded-lg border border-emerald-950/30">
            Internal resources, capabilities, or attributes that give you an advantage or support a favorable outcome.
          </p>
          <ul className="space-y-2 pt-2">
            {analysis.strengths.map((str, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-300 leading-relaxed">
                <span className="text-emerald-400 font-bold mt-0.5">•</span>
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* WEAKNESSES (Internal, Negative - Rose) */}
        <div id="swot-weaknesses" className="bg-rose-950/10 border border-rose-900/30 hover:border-rose-500/20 rounded-2xl p-6 space-y-4 hover:shadow-sm transition duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-rose-950/40 text-rose-400 rounded-xl font-black text-lg w-10 h-10 flex items-center justify-center">W</span>
              <h4 className="font-bold text-rose-400 text-base">Weaknesses</h4>
            </div>
            <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider bg-rose-950/30 border border-rose-900/30 px-2.5 py-0.5 rounded-full">
              Internal / Harmful
            </span>
          </div>
          <p className="text-xs text-rose-300 leading-normal bg-rose-950/20 p-2.5 rounded-lg border border-rose-950/30">
            Internal limitations, resource gaps, or negative attributes that hinder goals or need mitigation.
          </p>
          <ul className="space-y-2 pt-2">
            {analysis.weaknesses.map((weak, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-300 leading-relaxed">
                <span className="text-rose-400 font-bold mt-0.5">•</span>
                <span>{weak}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* OPPORTUNITIES (External, Positive - Amber) */}
        <div id="swot-opportunities" className="bg-amber-950/10 border border-amber-900/30 hover:border-amber-500/20 rounded-2xl p-6 space-y-4 hover:shadow-sm transition duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-amber-950/40 text-amber-400 rounded-xl font-black text-lg w-10 h-10 flex items-center justify-center">O</span>
              <h4 className="font-bold text-amber-400 text-base">Opportunities</h4>
            </div>
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider bg-amber-950/30 border border-amber-900/30 px-2.5 py-0.5 rounded-full">
              External / Helpful
            </span>
          </div>
          <p className="text-xs text-amber-300 leading-normal bg-amber-950/20 p-2.5 rounded-lg border border-amber-950/30">
            External conditions, industry trends, or market gaps that you can leverage to drive positive momentum.
          </p>
          <ul className="space-y-2 pt-2">
            {analysis.opportunities.map((opp, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-300 leading-relaxed">
                <span className="text-amber-400 font-bold mt-0.5">•</span>
                <span>{opp}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* THREATS (External, Negative - Slate) */}
        <div id="swot-threats" className="bg-zinc-900/50 border border-white/5 hover:border-white/10 rounded-2xl p-6 space-y-4 hover:shadow-sm transition duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-white/5 text-slate-400 rounded-xl font-black text-lg w-10 h-10 flex items-center justify-center">T</span>
              <h4 className="font-bold text-white text-base">Threats</h4>
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full">
              External / Harmful
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-normal bg-white/5 p-2.5 rounded-lg border border-white/5">
            External challenges, competitor advancements, or environmental risks that could negatively impact progress.
          </p>
          <ul className="space-y-2 pt-2">
            {analysis.threats.map((thr, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-300 leading-relaxed">
                <span className="text-slate-400 font-bold mt-0.5">•</span>
                <span>{thr}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
