import React, { useState, useEffect } from "react";
import { ProsConsAnalysis, ProConItem } from "../types";
import { Check, X, Shield, RefreshCw, Star, Info, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ProsConsViewProps {
  analysis: ProsConsAnalysis;
  onSave?: (updatedAnalysis: ProsConsAnalysis) => void;
}

export default function ProsConsView({ analysis, onSave }: ProsConsViewProps) {
  // Store pros and cons with user-mutable weights and active toggles
  const [pros, setPros] = useState<ProConItem[]>([]);
  const [cons, setCons] = useState<ProConItem[]>([]);

  // Initialize state with default weights (all 3) and active state
  useEffect(() => {
    setPros(
      analysis.pros.map((p) => ({
        ...p,
        userWeight: p.userWeight || 3,
        active: true
      })) as any
    );
    setCons(
      analysis.cons.map((c) => ({
        ...c,
        userWeight: c.userWeight || 3,
        active: true
      })) as any
    );
  }, [analysis]);

  const handleWeightChange = (id: string, isPro: boolean, newWeight: number) => {
    if (isPro) {
      setPros((prev) =>
        prev.map((p) => (p.id === id ? { ...p, userWeight: newWeight } : p))
      );
    } else {
      setCons((prev) =>
        prev.map((c) => (c.id === id ? { ...c, userWeight: newWeight } : c))
      );
    }
  };

  const handleToggleActive = (id: string, isPro: boolean) => {
    if (isPro) {
      setPros((prev) =>
        prev.map((p: any) => (p.id === id ? { ...p, active: !p.active } : p))
      );
    } else {
      setCons((prev) =>
        prev.map((c: any) => (c.id === id ? { ...c, active: !c.active } : c))
      );
    }
  };

  const handleResetWeights = () => {
    setPros((prev) => prev.map((p) => ({ ...p, userWeight: 3 })));
    setCons((prev) => prev.map((c) => ({ ...c, userWeight: 3 })));
  };

  // Math calculation for the scale
  // Pro score: pro.score * pro.userWeight (pro.score is positive, 1 to 5)
  // Con score: Math.abs(con.score) * con.userWeight (con.score is negative, -1 to -5)
  const activePros = pros.filter((p: any) => p.active !== false);
  const activeCons = cons.filter((c: any) => c.active !== false);

  const totalProsScore = activePros.reduce((sum, p) => sum + p.score * (p.userWeight || 3), 0);
  const totalConsScore = activeCons.reduce((sum, c) => sum + Math.abs(c.score) * (c.userWeight || 3), 0);

  const totalCombined = totalProsScore + totalConsScore;
  const balancePercentage =
    totalCombined === 0 ? 50 : Math.round((totalProsScore / totalCombined) * 100);

  // Determine the verdict based on current balance
  let currentVerdict = "Undecided";
  let verdictColor = "text-slate-500";
  let bgVerdictColor = "bg-zinc-900/30";
  let borderVerdictColor = "border-white/5";

  if (balancePercentage > 58) {
    currentVerdict = "Strongly Tilted Toward YES";
    verdictColor = "text-emerald-400";
    bgVerdictColor = "bg-emerald-950/20";
    borderVerdictColor = "border-emerald-900/30";
  } else if (balancePercentage > 51) {
    currentVerdict = "Slightly Tilted Toward YES";
    verdictColor = "text-teal-400";
    bgVerdictColor = "bg-teal-950/20";
    borderVerdictColor = "border-teal-900/30";
  } else if (balancePercentage < 42) {
    currentVerdict = "Strongly Tilted Toward NO";
    verdictColor = "text-rose-400";
    bgVerdictColor = "bg-rose-950/20";
    borderVerdictColor = "border-rose-900/30";
  } else if (balancePercentage < 49) {
    currentVerdict = "Slightly Tilted Toward NO";
    verdictColor = "text-amber-400";
    bgVerdictColor = "bg-amber-950/20";
    borderVerdictColor = "border-amber-900/30";
  } else {
    currentVerdict = "Perfect Balance / Dead Tie";
    verdictColor = "text-indigo-400";
    bgVerdictColor = "bg-indigo-950/20";
    borderVerdictColor = "border-indigo-900/30";
  }

  // Trigger Save/Update callback if provided
  useEffect(() => {
    if (onSave && pros.length > 0) {
      onSave({
        ...analysis,
        pros,
        cons,
        recommendation: {
          ...analysis.recommendation,
          // Maintain original recommendation but let the user see dynamic balance updates
        }
      });
    }
  }, [pros, cons]);

  return (
    <div id="pros-cons-analyzer" className="space-y-8">
      {/* Dynamic Scale Widget */}
      <div id="decision-balance-widget" className="bg-zinc-900/50 rounded-2xl border border-white/5 shadow-xl p-6 md:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white tracking-tight flex items-center gap-2">
              <span className="p-1.5 bg-white/5 text-indigo-400 rounded-lg">⚖️</span>
              The Live Tiebreaker Balance
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Adjust importance weights (1-5★) or exclude arguments to see how the decision tips in real time.
            </p>
          </div>
          <button
            onClick={handleResetWeights}
            className="self-start md:self-auto text-xs font-medium text-slate-400 hover:text-indigo-400 flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white/5 border border-white/10 transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset all weights to 3
          </button>
        </div>

        {/* The Balance Scale Visualizer */}
        <div className="bg-black/30 rounded-2xl p-6 border border-white/5 space-y-6 relative overflow-hidden">
          {/* Subtle grid lines background */}
          <div className="absolute inset-0 bg-grid-white/5 pointer-events-none" />

          {/* Scale Pivot and Arm simulation using simple layout and rotation */}
          <div className="relative flex flex-col items-center justify-center py-6">
            <div className="w-full max-w-lg flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500 px-4 mb-2">
              <span className="text-rose-400 flex items-center gap-1">Cons ({totalConsScore})</span>
              <span className="text-emerald-400 flex items-center gap-1">Pros ({totalProsScore})</span>
            </div>

            {/* Slider track indicator */}
            <div className="w-full max-w-lg h-3 bg-zinc-800 rounded-full relative mb-1 overflow-hidden">
              <div className="absolute top-0 bottom-0 left-0 bg-rose-500/80 transition-all duration-300" style={{ width: `${100 - balancePercentage}%` }} />
              <div className="absolute top-0 bottom-0 right-0 bg-emerald-500/80 transition-all duration-300" style={{ width: `${balancePercentage}%` }} />
              {/* Perfect center line */}
              <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white z-10" />
            </div>

            {/* Scale visual balance indicator */}
            <motion.div
              animate={{ rotate: (balancePercentage - 50) * 0.4 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
              className="w-48 h-2 bg-zinc-700 rounded-full relative flex justify-between px-2 items-center"
            >
              {/* Left Weight */}
              <div className="w-4 h-4 bg-rose-500 rounded-full -mt-4 shadow-sm" />
              {/* Right Weight */}
              <div className="w-4 h-4 bg-emerald-500 rounded-full -mt-4 shadow-sm" />
              {/* Center pointer */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-1.5 h-10 bg-zinc-700 origin-top rounded-b-md" />
            </motion.div>

            {/* Pivot stand */}
            <div className="w-12 h-6 border-b-2 border-r-2 border-l-2 border-zinc-600 bg-zinc-850 rounded-b-xl -mt-1" />
          </div>

          {/* Dynamic Scoreboard Card */}
          <div className={`p-4 rounded-xl border ${borderVerdictColor} ${bgVerdictColor} text-center transition-colors duration-300`}>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">
              Dynamic Verdict
            </div>
            <div className={`text-xl font-extrabold ${verdictColor} tracking-tight`}>
              {currentVerdict}
            </div>
            <div className="text-sm font-semibold text-slate-400 mt-1">
              Pros: {balancePercentage}% vs Cons: {100 - balancePercentage}%
            </div>
          </div>
        </div>
      </div>

      {/* Strategic AI recommendation */}
      <div id="ai-strategic-recommendation" className="bg-zinc-950 border border-white/5 text-white rounded-2xl p-6 md:p-8 space-y-5">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-indigo-400" />
          <h3 className="text-base font-semibold tracking-tight">The Tiebreaker's Recommendation</h3>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">
          {analysis.summary}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Primary Driver
            </div>
            <p className="text-sm text-white font-medium">
              {analysis.recommendation.key_reason}
            </p>
          </div>
          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Confidence Index
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-zinc-900 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${analysis.recommendation.confidence}%` }} />
              </div>
              <span className="text-sm font-bold text-indigo-400">{analysis.recommendation.confidence}%</span>
            </div>
          </div>
        </div>

        {/* Action Steps */}
        <div className="pt-4 border-t border-white/5 space-y-3">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Suggested Action Steps
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {analysis.recommendation.action_steps.map((step, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-white/5 text-indigo-400 flex items-center justify-center font-bold text-xs">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{step}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Side-by-Side Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="pros-cons-grid-list">
        {/* PROS (EMERALD) */}
        <div className="bg-zinc-900/50 rounded-2xl border border-white/5 shadow-sm overflow-hidden" id="pros-column">
          <div className="bg-emerald-950/10 border-b border-white/5 px-6 py-4 flex items-center justify-between">
            <h3 className="font-bold text-emerald-400 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-950/40 text-emerald-400 flex items-center justify-center font-bold text-sm">
                ✓
              </span>
              Arguments FOR (Pros)
            </h3>
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/30 border border-emerald-900/30 px-2 py-0.5 rounded-full">
              {activePros.length} Active
            </span>
          </div>

          <div className="divide-y divide-white/5 p-2">
            <AnimatePresence initial={false}>
              {pros.map((pro: any) => (
                <motion.div
                  key={pro.id}
                  layout
                  id={`pro-item-${pro.id}`}
                  className={`p-4 space-y-3 transition ${pro.active === false ? "opacity-40" : ""}`}
                >
                  <div className="flex items-start gap-3 justify-between">
                    <div className="flex items-start gap-2.5">
                      <button
                        id={`pro-toggle-${pro.id}`}
                        onClick={() => handleToggleActive(pro.id, true)}
                        className={`w-5 h-5 rounded flex items-center justify-center border transition-colors cursor-pointer mt-0.5 ${
                          pro.active !== false
                            ? "border-emerald-500 bg-emerald-950/30 text-emerald-400"
                            : "border-white/10 bg-black/40 text-transparent hover:border-white/20"
                        }`}
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </button>
                      <div>
                        <p className={`text-sm text-slate-200 leading-relaxed font-medium ${pro.active === false ? "line-through text-slate-500" : ""}`}>
                          {pro.text}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-[10px] font-bold text-slate-400 bg-white/5 border border-white/5 px-2 py-0.5 rounded">
                            {pro.category}
                          </span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            pro.impact === "High" ? "bg-emerald-950/30 text-emerald-400 border border-emerald-900/30" :
                            pro.impact === "Medium" ? "bg-indigo-950/30 text-indigo-400 border border-indigo-900/30" :
                            "bg-zinc-800 text-slate-400 border border-white/5"
                          }`}>
                            {pro.impact} Impact
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Numeric Badge */}
                    <span className="text-xs font-bold text-emerald-400 font-mono bg-emerald-950/30 px-2 py-1 rounded">
                      +{pro.score}
                    </span>
                  </div>

                  {/* Weight Slider */}
                  {pro.active !== false && (
                    <div className="pl-7 pr-2 flex items-center justify-between gap-4 bg-black/30 p-2 rounded-lg">
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        Importance Weight: <span className="text-white font-bold">{pro.userWeight || 3}</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        id={`pro-slider-${pro.id}`}
                        value={pro.userWeight || 3}
                        onChange={(e) => handleWeightChange(pro.id, true, parseInt(e.target.value))}
                        className="w-24 accent-emerald-500 cursor-pointer h-1.5 bg-zinc-800 rounded-lg appearance-none"
                      />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* CONS (ROSE) */}
        <div className="bg-zinc-900/50 rounded-2xl border border-white/5 shadow-sm overflow-hidden" id="cons-column">
          <div className="bg-rose-950/10 border-b border-white/5 px-6 py-4 flex items-center justify-between">
            <h3 className="font-bold text-rose-400 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-rose-950/40 text-rose-400 flex items-center justify-center font-bold text-sm">
                ✕
              </span>
              Arguments AGAINST (Cons)
            </h3>
            <span className="text-xs font-semibold text-rose-400 bg-rose-950/30 border border-rose-900/30 px-2 py-0.5 rounded-full">
              {activeCons.length} Active
            </span>
          </div>

          <div className="divide-y divide-white/5 p-2">
            <AnimatePresence initial={false}>
              {cons.map((con: any) => (
                <motion.div
                  key={con.id}
                  layout
                  id={`con-item-${con.id}`}
                  className={`p-4 space-y-3 transition ${con.active === false ? "opacity-40" : ""}`}
                >
                  <div className="flex items-start gap-3 justify-between">
                    <div className="flex items-start gap-2.5">
                      <button
                        id={`con-toggle-${con.id}`}
                        onClick={() => handleToggleActive(con.id, false)}
                        className={`w-5 h-5 rounded flex items-center justify-center border transition-colors cursor-pointer mt-0.5 ${
                          con.active !== false
                            ? "border-rose-500 bg-rose-950/30 text-rose-400"
                            : "border-white/10 bg-black/40 text-transparent hover:border-white/20"
                        }`}
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </button>
                      <div>
                        <p className={`text-sm text-slate-200 leading-relaxed font-medium ${con.active === false ? "line-through text-slate-500" : ""}`}>
                          {con.text}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-[10px] font-bold text-slate-400 bg-white/5 border border-white/5 px-2 py-0.5 rounded">
                            {con.category}
                          </span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            con.impact === "High" ? "bg-rose-950/30 text-rose-400 border border-rose-900/30" :
                            con.impact === "Medium" ? "bg-indigo-950/30 text-indigo-400 border border-indigo-900/30" :
                            "bg-zinc-800 text-slate-400 border border-white/5"
                          }`}>
                            {con.impact} Impact
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Numeric Badge */}
                    <span className="text-xs font-bold text-rose-400 font-mono bg-rose-950/30 px-2 py-1 rounded">
                      {con.score}
                    </span>
                  </div>

                  {/* Weight Slider */}
                  {con.active !== false && (
                    <div className="pl-7 pr-2 flex items-center justify-between gap-4 bg-black/30 p-2 rounded-lg">
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        Importance Weight: <span className="text-white font-bold">{con.userWeight || 3}</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        id={`con-slider-${con.id}`}
                        value={con.userWeight || 3}
                        onChange={(e) => handleWeightChange(con.id, false, parseInt(e.target.value))}
                        className="w-24 accent-rose-500 cursor-pointer h-1.5 bg-zinc-800 rounded-lg appearance-none"
                      />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
