import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Loader2, TrendingUp, TrendingDown, Minus, Shield, Zap, AlertTriangle, Target, Newspaper } from "lucide-react";
import { base44 } from "@/api/base44Client";

function ScoreRing({ score }) {
  const color =
    score >= 75 ? "text-green-400" :
    score >= 50 ? "text-yellow-400" :
    "text-red-400";
  const ring =
    score >= 75 ? "stroke-green-400" :
    score >= 50 ? "stroke-yellow-400" :
    "stroke-red-400";

  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className={`relative flex items-center justify-center w-24 h-24 ${color}`}>
      <svg className="absolute inset-0 -rotate-90" width="96" height="96">
        <circle cx="48" cy="48" r={radius} strokeWidth="6" className="stroke-border" fill="none" />
        <circle cx="48" cy="48" r={radius} strokeWidth="6" className={ring} fill="none"
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s ease" }} />
      </svg>
      <div className="text-center z-10">
        <p className="font-cinzel text-2xl font-bold leading-none">{score}</p>
        <p className="font-inter text-[10px] text-muted-foreground mt-0.5">/ 100</p>
      </div>
    </div>
  );
}

function SWOTCard({ type, items, icon: Icon, color, bg }) {
  return (
    <div className={`rounded-xl p-4 ${bg} border border-white/5`}>
      <div className={`flex items-center gap-2 mb-3 ${color}`}>
        <Icon className="w-4 h-4" />
        <span className="font-cinzel text-xs font-bold tracking-wider uppercase">{type}</span>
      </div>
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="font-inter text-xs text-muted-foreground leading-relaxed flex gap-2">
            <span className={`shrink-0 mt-0.5 ${color}`}>•</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function AICompanyAnalysis({ company, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a business intelligence analyst. Analyze the company "${company.name}" (${company.desc || ""}) located in ${company.location || "USA"}, category: ${company.category || "General"}.

Provide a structured analysis with:
1. A "Company Health Score" from 0-100 based on financial stability, market position, and innovation.
2. A brief SWOT analysis (2-3 bullet points each).
3. 3 key recent news or market trends impacting them.
4. A one-sentence overall verdict.

Be concise and specific. Use real knowledge of the company.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            health_score: { type: "number" },
            score_breakdown: {
              type: "object",
              properties: {
                financial_stability: { type: "number" },
                market_position: { type: "number" },
                innovation: { type: "number" },
              }
            },
            swot: {
              type: "object",
              properties: {
                strengths: { type: "array", items: { type: "string" } },
                weaknesses: { type: "array", items: { type: "string" } },
                opportunities: { type: "array", items: { type: "string" } },
                threats: { type: "array", items: { type: "string" } },
              }
            },
            key_news: { type: "array", items: { type: "string" } },
            verdict: { type: "string" },
          }
        }
      });
      setData(result);
      setLoading(false);
    };
    run();
  }, [company.name]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30 }}
          className="w-full max-w-2xl bg-card border border-border/60 rounded-2xl overflow-hidden flex flex-col"
          style={{ maxHeight: "90vh" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border/50 bg-gradient-to-r from-primary/10 via-card to-card shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/20 border border-primary/30 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-cinzel font-bold text-foreground text-sm">{company.name}</p>
                <p className="font-inter text-xs text-primary">AI Company Intelligence</p>
              </div>
            </div>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="overflow-y-auto flex-1 px-5 py-5 space-y-5">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                <p className="font-cinzel text-sm text-muted-foreground tracking-wider">Analyzing company data...</p>
                <p className="font-inter text-xs text-muted-foreground/60">Searching financial records, news, and market data</p>
              </div>
            ) : data ? (
              <>
                {/* Score section */}
                <div className="flex flex-col sm:flex-row items-center gap-5 bg-background/60 border border-border/40 rounded-xl p-5">
                  <div className="flex flex-col items-center gap-2">
                    <ScoreRing score={Math.round(data.health_score)} />
                    <p className="font-cinzel text-xs font-semibold text-muted-foreground tracking-wider">HEALTH SCORE</p>
                  </div>
                  <div className="flex-1 space-y-2 w-full">
                    {[
                      { label: "Financial Stability", value: data.score_breakdown?.financial_stability },
                      { label: "Market Position", value: data.score_breakdown?.market_position },
                      { label: "Innovation", value: data.score_breakdown?.innovation },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <div className="flex justify-between mb-1">
                          <span className="font-inter text-xs text-muted-foreground">{label}</span>
                          <span className="font-inter text-xs font-semibold text-foreground">{Math.round(value)}</span>
                        </div>
                        <div className="h-1.5 bg-border rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${value}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className={`h-full rounded-full ${value >= 75 ? "bg-green-400" : value >= 50 ? "bg-yellow-400" : "bg-red-400"}`}
                          />
                        </div>
                      </div>
                    ))}
                    {data.verdict && (
                      <p className="font-inter text-xs text-muted-foreground/80 italic pt-1 leading-relaxed">"{data.verdict}"</p>
                    )}
                  </div>
                </div>

                {/* SWOT */}
                <div>
                  <p className="font-cinzel text-xs font-semibold text-muted-foreground tracking-widest uppercase mb-3">SWOT Analysis</p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <SWOTCard type="Strengths" items={data.swot?.strengths || []} icon={Shield} color="text-green-400" bg="bg-green-900/20" />
                    <SWOTCard type="Weaknesses" items={data.swot?.weaknesses || []} icon={Minus} color="text-red-400" bg="bg-red-900/20" />
                    <SWOTCard type="Opportunities" items={data.swot?.opportunities || []} icon={TrendingUp} color="text-blue-400" bg="bg-blue-900/20" />
                    <SWOTCard type="Threats" items={data.swot?.threats || []} icon={AlertTriangle} color="text-yellow-400" bg="bg-yellow-900/20" />
                  </div>
                </div>

                {/* Key News */}
                {data.key_news?.length > 0 && (
                  <div>
                    <p className="font-cinzel text-xs font-semibold text-muted-foreground tracking-widest uppercase mb-3">Key Market News</p>
                    <div className="space-y-2">
                      {data.key_news.map((item, i) => (
                        <div key={i} className="flex gap-3 px-4 py-3 bg-background/60 border border-border/30 rounded-lg">
                          <Newspaper className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          <p className="font-inter text-xs text-muted-foreground leading-relaxed">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p className="text-center font-inter text-sm text-muted-foreground py-10">Analysis unavailable.</p>
            )}
          </div>

          <div className="px-5 py-3 border-t border-border/30 shrink-0">
            <p className="font-inter text-xs text-muted-foreground/50 text-center">Powered by AI web search · Not financial advice</p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}