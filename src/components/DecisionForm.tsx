import React, { useState } from "react";
import { AnalysisType, DecisionPrompt } from "../types";
import { HelpCircle, Sparkles, Plus, Trash2, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

interface DecisionFormProps {
  onSubmit: (data: DecisionPrompt) => void;
  isLoading: boolean;
}

const EXAMPLES = [
  {
    title: "Buy an Electric Vehicle",
    decision: "Should I buy an electric vehicle (EV) instead of a hybrid or gas car?",
    context: "I live in the suburbs, commute 40 miles round-trip daily, have a garage where I can install a home charger, and plan to keep the car for at least 6 years.",
    type: "pros_cons" as AnalysisType
  },
  {
    title: "Relocate for a New Job",
    decision: "Should I accept a job offer in Austin, Texas or stay at my current role in Chicago?",
    context: "The new job offers a 20% salary bump and better career progression, but requires relocation. My spouse works remotely. Chicago is closer to family.",
    type: "comparison" as AnalysisType,
    options: ["Stay in Chicago", "Relocate to Austin"]
  },
  {
    title: "Launch a Mobile App",
    decision: "Should we build and launch a dedicated mobile app for our SaaS platform?",
    context: "Our platform is currently web-only. 35% of web traffic comes from mobile browsers. Competitors have basic iOS and Android apps.",
    type: "swot" as AnalysisType
  }
];

export default function DecisionForm({ onSubmit, isLoading }: DecisionFormProps) {
  const [decision, setDecision] = useState("");
  const [context, setContext] = useState("");
  const [type, setType] = useState<AnalysisType>("pros_cons");
  const [options, setOptions] = useState<string[]>(["Option A", "Option B"]);

  const handleAddOption = () => {
    if (options.length < 5) {
      setOptions([...options, `Option ${String.fromCharCode(65 + options.length)}`]);
    }
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const loadExample = (ex: typeof EXAMPLES[0]) => {
    setDecision(ex.decision);
    setContext(ex.context || "");
    setType(ex.type);
    if (ex.type === "comparison" && "options" in ex) {
      setOptions(ex.options || ["Option A", "Option B"]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!decision.trim()) return;

    const payload: DecisionPrompt = {
      decision: decision.trim(),
      context: context.trim() || undefined,
      type
    };

    if (type === "comparison") {
      payload.options = options.filter(opt => opt.trim() !== "");
    }

    onSubmit(payload);
  };

  return (
    <div id="decision-form-container" className="space-y-8">
      {/* Examples Quick-Select */}
      <div id="examples-selector">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          Need inspiration? Try an example
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {EXAMPLES.map((ex, idx) => (
            <button
              key={idx}
              type="button"
              id={`example-btn-${idx}`}
              onClick={() => loadExample(ex)}
              className="text-left p-3.5 rounded-xl border border-white/5 bg-zinc-900/40 hover:bg-zinc-900/80 hover:border-indigo-500/30 transition-all duration-200 group cursor-pointer"
            >
              <div className="font-semibold text-sm text-slate-200 mb-1 group-hover:text-indigo-400 transition-colors">
                {ex.title}
              </div>
              <p className="text-xs text-slate-400 line-clamp-2">
                {ex.decision}
              </p>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} id="main-decision-form" className="bg-zinc-900/50 rounded-2xl border border-white/5 shadow-xl p-6 md:p-8 space-y-6">
        {/* Decision Prompt Textarea */}
        <div className="space-y-2">
          <label htmlFor="decision-input" className="block text-sm font-semibold text-slate-300">
            What decision are you trying to resolve? <span className="text-rose-500">*</span>
          </label>
          <textarea
            id="decision-input"
            rows={3}
            required
            placeholder="e.g., Should I take the promotion offer or start my own consulting agency?"
            value={decision}
            onChange={(e) => setDecision(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-white/10 bg-black/40 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none text-white transition placeholder-slate-500 text-sm md:text-base leading-relaxed resize-none"
          />
        </div>

        {/* Additional Context Textarea */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="context-input" className="block text-sm font-semibold text-slate-300">
              Provide Context & Constraints (Optional)
            </label>
            <div className="group relative flex items-center text-slate-500 hover:text-slate-300 cursor-help">
              <HelpCircle className="w-4 h-4" />
              <span className="absolute bottom-full right-0 mb-2 hidden group-hover:block w-64 bg-slate-900 text-white text-xs p-2 rounded-lg leading-normal shadow-lg z-10">
                Mention key limitations, preferences, budgets, timelines, or factors that the AI strategist should consider.
              </span>
            </div>
          </div>
          <textarea
            id="context-input"
            rows={3}
            placeholder="e.g., I have 3 months of emergency savings. I prefer remote work but would relocate for the perfect role. Timing is critical."
            value={context}
            onChange={(e) => setContext(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-white/10 bg-black/40 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none text-white transition placeholder-slate-500 text-sm leading-relaxed resize-none"
          />
        </div>

        {/* Framework Selector */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-slate-300">
            Choose Analysis Framework
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              type="button"
              id="framework-pros-cons"
              onClick={() => setType("pros_cons")}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                type === "pros_cons"
                  ? "border-indigo-500 bg-indigo-950/20 ring-1 ring-indigo-500"
                  : "border-white/10 bg-black/20 hover:border-white/20"
              }`}
            >
              <div className="font-semibold text-sm text-white flex items-center justify-between mb-1">
                Pros & Cons Matrix
                <span className={`w-2 h-2 rounded-full ${type === "pros_cons" ? "bg-indigo-400" : "bg-transparent"}`} />
              </div>
              <p className="text-xs text-slate-400 leading-normal">
                Standard balance scale assessment with customizable scores and interactive weights.
              </p>
            </button>

            <button
              type="button"
              id="framework-comparison"
              onClick={() => setType("comparison")}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                type === "comparison"
                  ? "border-indigo-500 bg-indigo-950/20 ring-1 ring-indigo-500"
                  : "border-white/10 bg-black/20 hover:border-white/20"
              }`}
            >
              <div className="font-semibold text-sm text-white flex items-center justify-between mb-1">
                Alternatives Comparison
                <span className={`w-2 h-2 rounded-full ${type === "comparison" ? "bg-indigo-400" : "bg-transparent"}`} />
              </div>
              <p className="text-xs text-slate-400 leading-normal">
                Score-based comparison chart for mapping 2 to 5 specific choices over multiple parameters.
              </p>
            </button>

            <button
              type="button"
              id="framework-swot"
              onClick={() => setType("swot")}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                type === "swot"
                  ? "border-indigo-500 bg-indigo-950/20 ring-1 ring-indigo-500"
                  : "border-white/10 bg-black/20 hover:border-white/20"
              }`}
            >
              <div className="font-semibold text-sm text-white flex items-center justify-between mb-1">
                SWOT Analysis
                <span className={`w-2 h-2 rounded-full ${type === "swot" ? "bg-indigo-400" : "bg-transparent"}`} />
              </div>
              <p className="text-xs text-slate-400 leading-normal">
                Strategic mapping of internal Strengths & Weaknesses vs. external Opportunities & Threats.
              </p>
            </button>
          </div>
        </div>

        {/* Dynamic Comparison Options */}
        {type === "comparison" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3 bg-black/30 p-4 md:p-5 rounded-xl border border-white/5"
            id="comparison-options-block"
          >
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-semibold text-slate-300">
                Define the Options to Compare (2 - 5)
              </label>
              <button
                type="button"
                id="add-option-btn"
                onClick={handleAddOption}
                disabled={options.length >= 5}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 disabled:text-slate-600 flex items-center gap-1 transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Option
              </button>
            </div>
            <div className="space-y-2">
              {options.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-500 w-5 text-center">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    id={`option-input-${idx}`}
                    value={opt}
                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                    placeholder={`Option Name e.g., ${idx === 0 ? "Buy a Gas car" : "Buy an EV"}`}
                    className="flex-1 px-3.5 py-2 text-sm rounded-lg border border-white/10 focus:border-indigo-500 outline-none bg-black/40 text-white placeholder-slate-600"
                  />
                  <button
                    type="button"
                    id={`remove-option-${idx}`}
                    onClick={() => handleRemoveOption(idx)}
                    disabled={options.length <= 2}
                    className="p-2 text-slate-500 hover:text-rose-400 disabled:text-slate-800 transition cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          id="submit-decision-btn"
          disabled={isLoading || !decision.trim()}
          className="w-full py-4 px-6 bg-white hover:bg-slate-250 disabled:bg-white/5 disabled:text-slate-500 text-black font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md"
        >
          {isLoading ? (
            <span className="flex items-center gap-2 text-slate-400">
              <svg className="animate-spin h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Consulting AI Tiebreaker...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Generate Strategic Analysis
              <ArrowRight className="w-4 h-4" />
            </span>
          )}
        </button>
      </form>
    </div>
  );
}
