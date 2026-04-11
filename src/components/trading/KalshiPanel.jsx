import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp, TrendingDown, Sparkles, Loader2,
  ExternalLink, ChevronDown, ChevronUp, BarChart2, Target, Zap
} from "lucide-react";
import { base44 } from "@/api/base44Client";

const KALSHI_BASE = "https://kalshi.com";
const KALSHI_MARKETS_BASE = "https://kalshi.com/markets";

const SIGNAL_STYLE = {
  "Strong Buy": "text-green-400 bg-green-900/20 border-green-700/40",
  "Buy": "text-green-300 bg-green-900/10 border-green-800/30",
  "Hold": "text-yellow-400 bg-yellow-900/20 border-yellow-700/40",
  "Sell": "text-orange-400 bg-orange-900/20 border-orange-700/40",
  "Strong Sell": "text-red-400 bg-red-900/20 border-red-700/40",
};

export default function KalshiPanel({ defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  const SENTIMENT_ICON = {
    "Bullish": <TrendingUp className="w-4 h-4 text-green-400" />,
    "Bearish": <TrendingDown className="w-4 h-4 text-red-400" />,
    "Neutral": <BarChart2 className="w-4 h-4 text-yellow-400" />,
  };

  const runAiAnalysis = async () => {
    setAiLoading(true);
    setAiAnalysis(null);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a crypto trading strategist specializing in Kalshi prediction markets. Search Kalshi's current live crypto prediction markets (kalshi.com) and analyze them.

1. overall_sentiment: "Bullish" | "Bearish" | "Neutral" — overall crypto market sentiment from current Kalshi markets
2. key_insight: 2-3 sentence interpretation of what current Kalshi prediction markets say about crypto right now
3. trading_signal: one of "Strong Buy" | "Buy" | "Hold" | "Sell" | "Strong Sell"
4. signal_reason: one sentence explaining the signal
5. opportunities: array of up to 3 specific market observations from current Kalshi crypto markets (each as a string, include market name and probability)
6. risk_warning: one sentence about the biggest risk these markets signal`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            overall_sentiment: { type: "string" },
            key_insight: { type: "string" },
            trading_signal: { type: "string" },
            signal_reason: { type: "string" },
            opportunities: { type: "array", items: { type: "string" } },
            risk_warning: { type: "string" },
          }
        }
      });
      setAiAnalysis(result);
    } catch {
      setAiAnalysis({ key_insight: "Analysis failed. Please try again.", overall_sentiment: "Neutral", trading_signal: "Hold", opportunities: [] });
    }
    setAiLoading(false);
  };

  return (
    <div className="bg-card border border-primary/20 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between p-4 hover:bg-primary/5 transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
            <Target className="w-3.5 h-3.5 text-primary" />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <p className="font-cinzel font-bold text-foreground text-sm">Kalshi Prediction Markets</p>
              <span className="px-1.5 py-0.5 bg-green-900/30 border border-green-700/40 text-green-400 text-[9px] font-cinzel rounded-full">🇺🇸 US</span>
            </div>
            <p className="font-inter text-[10px] text-muted-foreground">AI-powered crypto signal from prediction markets</p>
          </div>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="border-t border-border/30 p-4 space-y-4">
              {/* Kalshi direct links */}
              <div className="flex flex-wrap gap-2">
                <a href={`${KALSHI_MARKETS_BASE}?category=crypto`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 px-2.5 py-1.5 bg-background border border-border rounded-lg text-xs font-inter text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors">
                  <ExternalLink className="w-3 h-3" /> Crypto Markets
                </a>
                <a href="https://kalshi.com/markets/KXBTCD" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 px-2.5 py-1.5 bg-background border border-border rounded-lg text-xs font-inter text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors">
                  <ExternalLink className="w-3 h-3" /> Bitcoin
                </a>
                <a href="https://kalshi.com/markets/KXETH" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 px-2.5 py-1.5 bg-background border border-border rounded-lg text-xs font-inter text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors">
                  <ExternalLink className="w-3 h-3" /> Ethereum
                </a>
                <a href="https://kalshi.com/markets/KXSOL" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 px-2.5 py-1.5 bg-background border border-border rounded-lg text-xs font-inter text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors">
                  <ExternalLink className="w-3 h-3" /> Solana
                </a>
              </div>

              {/* AI Analysis */}
              <button
                onClick={runAiAnalysis}
                disabled={aiLoading}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary text-primary-foreground rounded-xl font-cinzel text-xs tracking-wider hover:bg-primary/90 transition-colors disabled:opacity-60"
              >
                {aiLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                {aiLoading ? "Analyzing markets..." : "Generate AI Trading Signal"}
              </button>

              {/* AI Result */}
              {aiAnalysis && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {SENTIMENT_ICON[aiAnalysis.overall_sentiment]}
                      <span className="font-cinzel text-xs font-bold text-foreground">{aiAnalysis.overall_sentiment}</span>
                    </div>
                    {aiAnalysis.trading_signal && (
                      <span className={`px-2.5 py-1 rounded-lg border text-xs font-cinzel font-bold ${SIGNAL_STYLE[aiAnalysis.trading_signal] || "text-foreground border-border"}`}>
                        {aiAnalysis.trading_signal}
                      </span>
                    )}
                  </div>

                  <p className="font-inter text-xs text-muted-foreground leading-relaxed">{aiAnalysis.key_insight}</p>

                  {aiAnalysis.signal_reason && (
                    <div className="flex items-start gap-2 px-3 py-2 bg-primary/5 border border-primary/20 rounded-lg">
                      <Zap className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                      <p className="font-inter text-xs text-foreground/80">{aiAnalysis.signal_reason}</p>
                    </div>
                  )}

                  {aiAnalysis.opportunities?.length > 0 && (
                    <div>
                      <p className="font-cinzel text-[10px] font-bold text-primary uppercase tracking-wider mb-1.5">Opportunities</p>
                      <ul className="space-y-1">
                        {aiAnalysis.opportunities.map((o, i) => (
                          <li key={i} className="font-inter text-xs text-muted-foreground flex gap-2">
                            <span className="text-primary shrink-0">→</span>{o}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {aiAnalysis.risk_warning && (
                    <div className="px-3 py-2 bg-orange-900/10 border border-orange-800/20 rounded-lg">
                      <p className="font-inter text-[10px] text-orange-400/80">⚠ {aiAnalysis.risk_warning}</p>
                    </div>
                  )}
                </motion.div>
              )}

              <div className="pt-1 border-t border-border/20">
                <p className="font-inter text-[10px] text-muted-foreground/40 leading-relaxed">
                  Kalshi is a CFTC-regulated US prediction market · Not financial advice.
                </p>
                <a href="https://kalshi.com" target="_blank" rel="noopener noreferrer"
                  className="font-inter text-[10px] text-primary hover:underline flex items-center gap-1 mt-1">
                  kalshi.com <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}