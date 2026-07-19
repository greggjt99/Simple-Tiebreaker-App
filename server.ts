import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // API endpoints
  app.post("/api/analyze", async (req, res) => {
    const { decision, context, type, options } = req.body;

    if (!decision) {
      return res.status(400).json({ error: "Decision prompt is required" });
    }

    try {
      let prompt = "";
      let responseSchema: any = {};

      if (type === "pros_cons") {
        prompt = `Analyze the following decision: "${decision}".
Optional context: "${context || 'None provided'}".
Generate a comprehensive list of pros and cons. Score each pro/con on a scale of 1 to 5 (importance/impact), and categorize them (e.g. Financial, Career, Well-being, Relationship, Growth, etc.). Pros should have positive scores, cons should have negative scores (-1 to -5). Also provide a customized recommendation.`;
        
        responseSchema = {
          type: Type.OBJECT,
          properties: {
            decision: { type: Type.STRING },
            summary: { type: Type.STRING, description: "A detailed 2-3 sentence overview summarizing the decision factors." },
            pros: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  text: { type: Type.STRING, description: "The pro point description." },
                  impact: { type: Type.STRING, description: "Low, Medium, or High" },
                  score: { type: Type.INTEGER, description: "Importance score from 1 to 5" },
                  category: { type: Type.STRING }
                },
                required: ["id", "text", "impact", "score", "category"]
              }
            },
            cons: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  text: { type: Type.STRING, description: "The con point description." },
                  impact: { type: Type.STRING, description: "Low, Medium, or High" },
                  score: { type: Type.INTEGER, description: "Importance score from -1 to -5 (always negative)" },
                  category: { type: Type.STRING }
                },
                required: ["id", "text", "impact", "score", "category"]
              }
            },
            recommendation: {
              type: Type.OBJECT,
              properties: {
                verdict: { type: Type.STRING, description: "Clear summary recommendation (e.g., Proceed with caution, Strong YES, Hold off for now)." },
                confidence: { type: Type.INTEGER, description: "Confidence score percentage (0 to 100)" },
                key_reason: { type: Type.STRING, description: "The primary driving factor behind this recommendation." },
                action_steps: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              },
              required: ["verdict", "confidence", "key_reason", "action_steps"]
            }
          },
          required: ["decision", "summary", "pros", "cons", "recommendation"]
        };
      } else if (type === "comparison") {
        const parsedOptions = options && options.length > 0 ? options : ["Option A", "Option B"];
        prompt = `Analyze and compare the following choices for the decision "${decision}":
Options to compare: ${parsedOptions.map((o: string) => `"${o}"`).join(", ")}.
Optional context: "${context || 'None provided'}".
Identify 3-5 key criteria (e.g. Cost, Speed, Quality, Joy, Risk) and score each option from 1 to 10 for each criterion. Provide pros and cons for each option, and determine a clear winner.`;

        responseSchema = {
          type: Type.OBJECT,
          properties: {
            decision: { type: Type.STRING },
            summary: { type: Type.STRING, description: "A detailed 2-3 sentence overview of the options compared." },
            criteria: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "The 3 to 5 criteria used to compare the options."
            },
            options: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  scores: {
                    type: Type.OBJECT,
                    description: "Key-value pairs mapping each criterion name to a score from 1 to 10"
                  },
                  pros: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  cons: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  }
                },
                required: ["name", "scores", "pros", "cons"]
              }
            },
            recommendation: {
              type: Type.OBJECT,
              properties: {
                winner: { type: Type.STRING, description: "The option that is recommended as the winner." },
                verdict: { type: Type.STRING, description: "Summary justification for the choice." },
                key_reason: { type: Type.STRING, description: "The single most important differentiator." },
                action_steps: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              },
              required: ["winner", "verdict", "key_reason", "action_steps"]
            }
          },
          required: ["decision", "summary", "criteria", "options", "recommendation"]
        };
      } else if (type === "swot") {
        prompt = `Perform a comprehensive SWOT (Strengths, Weaknesses, Opportunities, Threats) analysis for this decision/proposal: "${decision}".
Optional context: "${context || 'None provided'}".
Generate 3-5 highly relevant bullet points for each of the four categories (Strengths, Weaknesses, Opportunities, Threats), along with a tailored recommendation and immediate actions.`;

        responseSchema = {
          type: Type.OBJECT,
          properties: {
            decision: { type: Type.STRING },
            summary: { type: Type.STRING, description: "A detailed 2-3 sentence overview of the SWOT analysis." },
            strengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Internal positive factors, advantages, assets."
            },
            weaknesses: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Internal negative factors, gaps, limitations."
            },
            opportunities: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "External positive trends, market shifts, future advantages."
            },
            threats: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "External negative factors, competitor movements, market risks."
            },
            recommendation: {
              type: Type.OBJECT,
              properties: {
                verdict: { type: Type.STRING, description: "Summary of whether to proceed, pivot, or delay based on the SWOT balance." },
                confidence: { type: Type.INTEGER, description: "Confidence score percentage (0 to 100)" },
                key_reason: { type: Type.STRING, description: "How strengths/opportunities mitigate weaknesses/threats." },
                action_steps: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              },
              required: ["verdict", "confidence", "key_reason", "action_steps"]
            }
          },
          required: ["decision", "summary", "strengths", "weaknesses", "opportunities", "threats", "recommendation"]
        };
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are an elite, objective, analytical decision-making strategist named The Tiebreaker. Your purpose is to help users resolve decision paralysis with balanced, logical, data-driven, and actionable advice. Never be evasive; always provide a firm, helpful, well-reasoned stance.",
          responseMimeType: "application/json",
          responseSchema: responseSchema,
        },
      });

      const text = response.text || "{}";
      const data = JSON.parse(text);
      res.json(data);
    } catch (error: any) {
      console.error("Gemini analysis failed:", error);
      res.status(500).json({ error: error?.message || "Failed to analyze decision. Please try again." });
    }
  });

  // Serve static assets and SPA logic
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`The Tiebreaker server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
