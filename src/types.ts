export type AnalysisType = "pros_cons" | "comparison" | "swot";

export interface DecisionPrompt {
  decision: string;
  context?: string;
  type: AnalysisType;
  options?: string[];
}

export interface Recommendation {
  verdict: string;
  confidence: number;
  key_reason: string;
  action_steps: string[];
  winner?: string; // specific to comparison
}

export interface ProConItem {
  id: string;
  text: string;
  impact: string; // "Low" | "Medium" | "High"
  score: number;  // 1 to 5 for Pros, -1 to -5 for Cons
  category: string;
  userWeight?: number; // 1 to 5, can be adjusted by the user
}

export interface ProsConsAnalysis {
  decision: string;
  summary: string;
  pros: ProConItem[];
  cons: ProConItem[];
  recommendation: Recommendation;
}

export interface CompareOption {
  name: string;
  scores: Record<string, number>; // e.g. { "Cost": 8, "Speed": 6 }
  pros: string[];
  cons: string[];
}

export interface ComparisonAnalysis {
  decision: string;
  summary: string;
  criteria: string[];
  options: CompareOption[];
  recommendation: Recommendation;
}

export interface SwotAnalysis {
  decision: string;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  recommendation: Recommendation;
}

export interface SavedDecision {
  id: string;
  timestamp: string;
  type: AnalysisType;
  prompt: DecisionPrompt;
  result: ProsConsAnalysis | ComparisonAnalysis | SwotAnalysis;
}
