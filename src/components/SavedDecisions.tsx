import React from "react";
import { SavedDecision } from "../types";
import { History, Trash2, Calendar, Layout, Award, Shield } from "lucide-react";

interface SavedDecisionsProps {
  decisions: SavedDecision[];
  onSelect: (decision: SavedDecision) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

export default function SavedDecisions({ decisions, onSelect, onDelete, onClearAll }: SavedDecisionsProps) {
  if (decisions.length === 0) {
    return (
      <div className="bg-zinc-900/40 rounded-2xl border border-dashed border-white/10 p-8 text-center space-y-3">
        <div className="w-12 h-12 rounded-xl bg-white/5 text-slate-500 flex items-center justify-center mx-auto">
          <History className="w-6 h-6 text-indigo-400" />
        </div>
        <h3 className="font-bold text-slate-300 text-sm">No saved decisions yet</h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
          Any analysis you run can be saved to your offline vault. They will appear here for quick review.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900/50 rounded-2xl border border-white/5 shadow-sm overflow-hidden" id="saved-decisions-card">
      <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-black/20">
        <h3 className="font-bold text-white flex items-center gap-2 text-sm">
          <History className="w-4 h-4 text-indigo-400" />
          Saved Decisions Vault ({decisions.length})
        </h3>
        <button
          onClick={onClearAll}
          className="text-xs font-semibold text-rose-400 hover:text-rose-300 transition cursor-pointer"
        >
          Clear All
        </button>
      </div>

      <div className="divide-y divide-white/5 max-h-[400px] overflow-y-auto">
        {decisions.map((sd) => {
          const date = new Date(sd.timestamp).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
          });

          return (
            <div
              key={sd.id}
              className="p-4 hover:bg-white/5 transition flex items-start justify-between gap-4 group"
              id={`saved-decision-row-${sd.id}`}
            >
              <button
                onClick={() => onSelect(sd)}
                className="flex-1 text-left space-y-1.5 focus:outline-none cursor-pointer"
              >
                <div className="font-bold text-sm text-slate-200 line-clamp-1 group-hover:text-indigo-400 transition-colors">
                  {sd.prompt.decision}
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {date}
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-indigo-300 capitalize bg-indigo-950/40 border border-indigo-900/40 px-2 py-0.5 rounded-full text-[10px]">
                    {sd.type === "pros_cons" ? "⚖️ Pros & Cons" : sd.type === "comparison" ? "📊 Comparison" : "📐 SWOT Analysis"}
                  </span>
                </div>
              </button>

              <button
                onClick={() => onDelete(sd.id)}
                className="p-2 text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 focus:opacity-100 transition duration-200 cursor-pointer"
                title="Delete from Vault"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
