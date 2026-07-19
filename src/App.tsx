import React, { useState, useEffect } from "react";
import { DecisionPrompt, SavedDecision, AnalysisType, ProsConsAnalysis, ComparisonAnalysis, SwotAnalysis } from "./types";
import DecisionForm from "./components/DecisionForm";
import ProsConsView from "./components/ProsConsView";
import ComparisonView from "./components/ComparisonView";
import SwotView from "./components/SwotView";
import SavedDecisions from "./components/SavedDecisions";
import { HelpCircle, Sparkles, BookOpen, Scale, FileText, ArrowLeft, Save, Trash2, ShieldAlert, History, Share2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [prompt, setPrompt] = useState<DecisionPrompt | null>(null);
  const [result, setResult] = useState<ProsConsAnalysis | ComparisonAnalysis | SwotAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedDecisions, setSavedDecisions] = useState<SavedDecision[]>([]);
  const [currentView, setCurrentView] = useState<"input" | "result">("input");
  const [isSavedInVault, setIsSavedInVault] = useState(false);

  // Load saved decisions from local storage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("tiebreaker_decisions");
      if (saved) {
        setSavedDecisions(JSON.parse(saved));
      }
    } catch (err) {
      console.error("Failed to load history from localStorage", err);
    }
  }, []);

  const handleFormSubmit = async (formData: DecisionPrompt) => {
    setIsLoading(true);
    setError(null);
    setPrompt(formData);
    setIsSavedInVault(false);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to analyze decision.");
      }

      const data = await response.json();
      setResult(data);
      setCurrentView("result");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong while connecting to the Tiebreaker engine.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveToVault = () => {
    if (!prompt || !result) return;

    const newSaved: SavedDecision = {
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 11),
      timestamp: new Date().toISOString(),
      type: prompt.type,
      prompt,
      result
    };

    const updated = [newSaved, ...savedDecisions];
    setSavedDecisions(updated);
    localStorage.setItem("tiebreaker_decisions", JSON.stringify(updated));
    setIsSavedInVault(true);
  };

  const handleLoadSaved = (saved: SavedDecision) => {
    setPrompt(saved.prompt);
    setResult(saved.result);
    setCurrentView("result");
    setIsSavedInVault(true);
    setError(null);
  };

  const handleDeleteSaved = (id: string) => {
    const updated = savedDecisions.filter((d) => d.id !== id);
    setSavedDecisions(updated);
    localStorage.setItem("tiebreaker_decisions", JSON.stringify(updated));
  };

  const handleClearAllSaved = () => {
    if (confirm("Are you sure you want to permanently delete all saved analyses from your offline vault?")) {
      setSavedDecisions([]);
      localStorage.removeItem("tiebreaker_decisions");
    }
  };

  const handleStartOver = () => {
    setPrompt(null);
    setResult(null);
    setCurrentView("input");
    setError(null);
    setIsSavedInVault(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0D0D0E] text-slate-200">
      {/* Premium Header */}
      <header className="border-b border-white/10 bg-[#0D0D0E]/90 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={handleStartOver}
              className="flex items-center gap-2 text-indigo-400 transition focus:outline-none cursor-pointer"
            >
              <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-900/40 text-white font-black text-xl select-none">
                T
              </div>
              <div className="text-left">
                <span className="font-semibold text-base text-white tracking-tight block">The Tiebreaker</span>
                <span className="text-[10px] font-bold text-slate-500 tracking-widest uppercase block -mt-1">Decision Intelligence</span>
              </div>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold text-slate-400 bg-white/5 px-2.5 py-1 rounded border border-white/10 uppercase tracking-widest font-mono">
              Offline Vault Enabled
            </span>
          </div>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {currentView === "input" ? (
            <motion.div
              key="input-screen"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start"
            >
              {/* Left & Middle Column: Interactive Form */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h1 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
                    Conquer Decision Paralysis
                  </h1>
                  <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                    Set up your decision topic and let our analytical frameworks structure pros, cons, tradeoffs, and SWOT factors with logical precision.
                  </p>
                </div>

                {/* Error Banner */}
                {error && (
                  <div className="p-4 bg-rose-950/30 border border-rose-900/50 rounded-xl flex items-start gap-3">
                    <ShieldAlert className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-rose-300 text-sm">Analysis failed</h4>
                      <p className="text-xs text-rose-400 mt-0.5 leading-relaxed">{error}</p>
                    </div>
                  </div>
                )}

                <DecisionForm onSubmit={handleFormSubmit} isLoading={isLoading} />
              </div>

              {/* Right Column: History Sidebar */}
              <div className="space-y-6">
                <div className="bg-zinc-900/50 p-5 rounded-2xl border border-white/5 shadow-sm space-y-4">
                  <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-indigo-400" />
                    Strategic Frameworks
                  </h3>
                  <div className="space-y-3.5 text-xs text-slate-300 leading-normal">
                    <div className="flex gap-2.5">
                      <span className="font-bold text-indigo-400 text-sm mt-0.5">01</span>
                      <p><strong className="text-white">Pros & Cons Matrix</strong> calculates real-time weighted scoring to see which way the scale tips as your preferences shift.</p>
                    </div>
                    <div className="flex gap-2.5">
                      <span className="font-bold text-indigo-400 text-sm mt-0.5">02</span>
                      <p><strong className="text-white">Alternatives Comparison</strong> highlights leaders and trade-offs side-by-side across multiple custom criteria parameters.</p>
                    </div>
                    <div className="flex gap-2.5">
                      <span className="font-bold text-indigo-400 text-sm mt-0.5">03</span>
                      <p><strong className="text-white">SWOT Analysis</strong> breaks down internal qualities against external environments to help formulate action plans.</p>
                    </div>
                  </div>
                </div>

                <SavedDecisions
                  decisions={savedDecisions}
                  onSelect={handleLoadSaved}
                  onDelete={handleDeleteSaved}
                  onClearAll={handleClearAllSaved}
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result-screen"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Results Top bar & actions */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-900/50 p-4 rounded-2xl border border-white/5 shadow-sm">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleStartOver}
                    className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition cursor-pointer"
                    id="back-to-input-btn"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div>
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block">
                      Decision Framework: {prompt?.type === "pros_cons" ? "Pros & Cons" : prompt?.type === "comparison" ? "Comparison Table" : "SWOT Analysis"}
                    </span>
                    <h1 className="text-base md:text-lg font-bold text-white tracking-tight line-clamp-1">
                      {prompt?.decision}
                    </h1>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 self-start md:self-auto">
                  <button
                    onClick={handleSaveToVault}
                    disabled={isSavedInVault}
                    className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl border transition cursor-pointer ${
                      isSavedInVault
                        ? "bg-emerald-950/40 text-emerald-400 border-emerald-900/50"
                        : "bg-white/5 hover:bg-white/10 text-white border-white/10"
                    }`}
                    id="save-decision-btn"
                  >
                    <Save className="w-3.5 h-3.5" />
                    {isSavedInVault ? "Saved in Vault" : "Save to Vault"}
                  </button>
                  <button
                    onClick={handleStartOver}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition cursor-pointer"
                    id="new-decision-btn"
                  >
                    New Decision
                  </button>
                </div>
              </div>

              {/* Dynamic Result Rendering */}
              {prompt?.type === "pros_cons" && result && (
                <ProsConsView analysis={result as ProsConsAnalysis} />
              )}

              {prompt?.type === "comparison" && result && (
                <ComparisonView analysis={result as ComparisonAnalysis} />
              )}

              {prompt?.type === "swot" && result && (
                <SwotView analysis={result as SwotAnalysis} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Humble, Clean Footer */}
      <footer className="border-t border-white/10 bg-[#0D0D0E] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-1">
          <p className="text-xs text-slate-400 font-medium">
            The Tiebreaker Decision Engine — Powered by Google Gemini AI
          </p>
          <p className="text-[10px] text-slate-500">
            Resolving hesitation through strategic, structured analysis frameworks.
          </p>
        </div>
      </footer>
    </div>
  );
}
