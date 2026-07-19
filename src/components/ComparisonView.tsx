import React from "react";
import { ComparisonAnalysis } from "../types";
import { Award, CheckCircle2, TrendingUp, Shield, AlertTriangle } from "lucide-react";

interface ComparisonViewProps {
  analysis: ComparisonAnalysis;
}

export default function ComparisonView({ analysis }: ComparisonViewProps) {
  // Find highest scorer for each criterion to highlight it
  const getWinnerForCriterion = (criterion: string) => {
    let maxScore = -1;
    let winnerName = "";

    analysis.options.forEach((opt) => {
      const score = opt.scores[criterion] || 0;
      if (score > maxScore) {
        maxScore = score;
        winnerName = opt.name;
      } else if (score === maxScore) {
        // Tie
        winnerName = "Tie";
      }
    });

    return { winnerName, maxScore };
  };

  return (
    <div id="comparison-analyzer" className="space-y-8">
      {/* Winner Announcement Banner */}
      <div id="winner-announcement-card" className="bg-zinc-950 border border-white/5 text-white rounded-2xl p-6 md:p-8 space-y-6 relative overflow-hidden">
        {/* Subtle decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold tracking-widest text-indigo-300 uppercase bg-indigo-500/20 px-2.5 py-1 rounded-full border border-indigo-400/20">
              The AI Tiebreaker Decision
            </span>
            <h2 className="text-xl md:text-2xl font-black tracking-tight flex items-center gap-2">
              <Award className="w-6 h-6 text-yellow-400 animate-pulse" />
              Recommended: {analysis.recommendation.winner}
            </h2>
          </div>
          <div className="flex items-center gap-2 bg-indigo-500/20 px-4 py-2 rounded-xl border border-indigo-400/20">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-indigo-100">Recommended Winner</span>
          </div>
        </div>

        <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-3xl">
          {analysis.summary}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">
              Strategic Justification
            </span>
            <p className="text-sm text-slate-200">
              {analysis.recommendation.verdict}
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">
              Primary Differentiator
            </span>
            <p className="text-sm text-slate-200">
              {analysis.recommendation.key_reason}
            </p>
          </div>
        </div>

        {/* Action Steps */}
        <div className="pt-5 border-t border-white/5 space-y-3">
          <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider block">
            Suggested Implementation Steps
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {analysis.recommendation.action_steps.map((step, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-slate-300">
                <CheckCircle2 className="w-4.5 h-4.5 text-indigo-400 flex-shrink-0 mt-0.5" />
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Comparison Grid Table */}
      <div id="comparison-matrix-card" className="bg-zinc-900/50 rounded-2xl border border-white/5 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10 bg-black/20">
          <h3 className="font-bold text-white flex items-center gap-2">
            📊 Scoring Comparison Matrix
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Criteria scored out of 10. Highlights indicate the stronger option for each metric.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-black/10">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Criteria
                </th>
                {analysis.options.map((opt, i) => (
                  <th key={i} className="px-6 py-4 text-sm font-bold text-slate-200 text-center">
                    {opt.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {analysis.criteria.map((crit, idx) => {
                const { winnerName } = getWinnerForCriterion(crit);
                return (
                  <tr key={idx} className="hover:bg-white/5 transition">
                    <td className="px-6 py-4 font-semibold text-slate-200">
                      {crit}
                    </td>
                    {analysis.options.map((opt, oIdx) => {
                      const score = opt.scores[crit] || 0;
                      const isWinner = opt.name === winnerName;
                      return (
                        <td key={oIdx} className="px-6 py-4 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <span className={`inline-block font-bold text-sm px-3 py-1 rounded-full font-mono ${
                              isWinner
                                ? "bg-emerald-950/45 text-emerald-400 ring-1 ring-emerald-500/20"
                                : "bg-white/5 text-slate-400"
                            }`}>
                              {score}/10
                            </span>
                            {isWinner && (
                              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mt-1">
                                Leader
                              </span>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Option-by-Option Breakdown */}
      <div id="options-breakdown-container" className="space-y-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Option-by-Option SWOT/Pros/Cons Breakdown
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {analysis.options.map((opt, idx) => (
            <div key={idx} className="bg-zinc-900/50 rounded-2xl border border-white/5 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-white/10 bg-black/20 flex items-center justify-between">
                <h4 className="font-bold text-slate-100 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-white/5 text-indigo-400 flex items-center justify-center font-bold text-xs border border-white/5">
                    {idx + 1}
                  </span>
                  {opt.name}
                </h4>
                {analysis.recommendation.winner === opt.name && (
                  <span className="text-[10px] font-extrabold text-indigo-400 bg-indigo-950/40 border border-indigo-900/30 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Recommended Selection
                  </span>
                )}
              </div>

              <div className="p-6 space-y-6">
                {/* Pros */}
                <div className="space-y-2.5">
                  <h5 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Key Advantages
                  </h5>
                  <ul className="space-y-1.5">
                    {opt.pros.map((pro, pIdx) => (
                      <li key={pIdx} className="text-sm text-slate-300 flex items-start gap-2 leading-relaxed">
                        <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cons */}
                <div className="space-y-2.5">
                  <h5 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    Risks & Trade-offs
                  </h5>
                  <ul className="space-y-1.5">
                    {opt.cons.map((con, cIdx) => (
                      <li key={cIdx} className="text-sm text-slate-300 flex items-start gap-2 leading-relaxed">
                        <span className="text-rose-500 font-bold mt-0.5">✕</span>
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
