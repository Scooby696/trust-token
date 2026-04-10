import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { base44 } from "@/api/base44Client";
import {
  Sliders, Sparkles, TrendingUp, ArrowRight, ExternalLink,
  Loader2, ChevronDown, ChevronUp, RefreshCw, Target
} from "lucide-react";

const RISK_PROFILES = {
  Conservative: {
    label: "Conservative",
    desc: "Capital preservation, low volatility",
    color: "text-green-400",
    border: "border-green-700/40",
    bg: "bg-green-900/10",
    targets: { Stablecoin: 50, "Layer 1": 35, "Layer 2": 10, DeFi: 5, Meme: 0, AI: 0, Gaming: 0, NFT: 0, Infrastructure: 0, Unknown: 0 },
  },
  Moderate: {
    label: "Moderate",
    desc: "Balanced growth and safety",
    color: "text-blue-300",
    border: "border-blue-700/40",
    bg: "bg-blue-900/10",
    targets: { Stablecoin: 20, "Layer 1": 40, "Layer 2": 15, DeFi: 15, AI: 5, Meme: 0, Gaming: 0, NFT: 0, Infrastructure: 5, Unknown: 0 },
  },
  Aggressive: {
    label: "Aggressive",
    desc: "High growth, higher risk",
    color: "text-orange-400",
    border: "border-orange-700/40",
    bg: "bg-orange-900/10",
    targets: { "Layer 1": 35, DeFi: 25, AI: 15, "Layer 2": 10, Meme: 10, Infrastructure: 5, Stablecoin: 0, Gaming: 0, NFT: 0, Unknown: 0 },
  },
  Degen: {
    label: "Degen",
    desc: "Max risk, max potential reward",
    color: "text-red-400",
    border: "border-red-700/40",
    bg: "bg-red-900/10",
    targets: { Meme: 30, DeFi: 25, "Layer 1": 20, AI: 15, Gaming: 5, NFT: 5, "Layer 2": 0, Stablecoin: 0, Infrastructure: 0, Unknown: 0 },
  },
};

function buildJupiterSwapUrl(fromSymbol, toSymbol) {
  const MINTS = {
    SOL: "So11111111111111111111111111111111111111112",
    USDC: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    BONK: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
    JUP: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
    WIF: "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm",
    USDT: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
    RAY: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
  };
  const from = MINTS[fromSymbol] || fromSymbol;
  const to = MINTS[toSymbol] || toSymbol;
  return `https://jup.ag/swap/${from}-${to}`;
}

export default function RebalancingTool({ holdings = [] }) {
  const [open, setOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState("Moderate");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const totalValue = holdings.reduce((s, h) => s + (h.usdValue || 0), 0);

  // Current allocation by narrative
  const currentAlloc = {};
  holdings.forEach((h) => {
    const n = h.narrative || "Unknown";
    currentAlloc[n] = (currentAlloc[n] || 0) + (h.usdValue || 0);
  });
  const currentAllocPct = {};
  Object.entries(currentAlloc).forEach(([n, v]) => {
    currentAllocPct[n] = totalValue > 0 ? (v / totalValue) * 100 : 0;
  });

  const runAnalysis = async () => {
    setLoading(true);
    setAnalysis(null);
    const profile = RISK_PROFILES[selectedProfile];
    const holdingSummary = holdings.map((h) =>
      `${h.symbol} (${h.narrative}): $${h.usdValue?.toFixed(2)} = ${totalValue > 0 ? ((h.usdValue / totalValue) * 100).toFixed(1) : 0}%`
    ).join("\n");

    const targetSummary = Object.entries(profile.targets)
      .filter(([, v]) => v > 0)
      .map(([n, v]) => `${n}: ${v}%`)
      .join(", ");

    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a crypto portfolio rebalancing expert for Solana wallets.\n\nCurrent Portfolio (total: $${totalValue.toFixed(2)}):\n${holdingSummary}\n\nTarget Risk Profile: ${selectedProfile}\nTarget Allocation: ${targetSummary}\n\nAnalyze the gap between current and target allocations. Provide:\n1. summary: 2-3 sentence assessment of how far the portfolio is from the target profile\n2. swaps: array of up to 5 specific swap recommendations, each with:\n   - from_symbol: token to sell (exact symbol from holdings)\n   - to_symbol: target token to buy (e.g. SOL, USDC, JUP, BONK, RAY)\n   - usd_amount: dollar amount to swap (number)\n   - rationale: one sentence why this swap moves toward the target\n   - priority: "high" | "medium" | "low"\n3. after_rebalance: brief description of what the portfolio looks like after all swaps\n4. drift_score: 0-100 how far current allocation is from target (0=perfect match)\n\nOnly suggest swaps for tokens actually in the portfolio. If already well-aligned, say so and return empty swaps array.`,
        response_json_schema: {
          type: "object",
          properties: {
            summary: { type: "string" },
            drift_score: { type: "number" },
            swaps: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  from_symbol: { type: "string" },
                  to_symbol: { type: "string" },
                  usd_amount: { type: "number" },
                  rationale: { type: "string" },
                  priority: { type: "string" },
                }
              }
            },
            after_rebalance: { type: "string" },
          }
        }
      });
      setAnalysis(result);
    } catch {
      setAnalysis({ summary: "Analysis failed. Please try again.", drift_score: 0, swaps: [], after_rebalance: "" });
    }
    setLoading(false);
  };

  const PRIORITY_COLOR = { high: "text-red-400 bg-red-900/20 border-red-700/30", medium: "text-orange-400 bg-orange-900/20 border-orange-700/30", low: "text-blue-300 bg-blue-900/20 border-blue-700/30" };

  if (holdings.length === 0) return null;

  return (
    <div className="bg-card border border-border/50 rounded-xl overflow-hidden">
      {/* Header toggle */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-primary/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Sliders className="w-4 h-4 text-primary" />
          </div>
          <div className="text-left">
            <p className="font-cinzel font-bold text-foreground text-sm">AI Rebalancing Tool</p>
            <p className="font-inter text-xs text-muted-foreground">Analyze drift & get Jupiter swap suggestions</p>
          </div>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 sm:px-5 pb-5 space-y-5 border-t border-border/30 pt-4">

              {/* Profile selector */}
              <div>
                <p className="font-inter text-xs text-muted-foreground mb-2">Select Target Risk Profile</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {Object.entries(RISK_PROFILES).map(([key, p]) => (
                    <button key={key} onClick={() => { setSelectedProfile(key); setAnalysis(null); }}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        selectedProfile === key ? `${p.bg} ${p.border} ring-1 ring-inset ${p.border}` : "bg-background border-border hover:border-primary/30"
                      }`}>
                      <p className={`font-cinzel text-xs font-bold ${selectedProfile === key ? p.color : "text-foreground"}`}>{p.label}</p>
                      <p className="font-inter text-[10px] text-muted-foreground mt-0.5 leading-snug">{p.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Current vs target allocation */}
              <div>
                <p className="font-inter text-xs text-muted-foreground mb-2">Current vs Target Allocation</p>
                <div className="space-y-2">
                  {Object.entries(RISK_PROFILES[selectedProfile].targets)
                    .filter(([n, t]) => t > 0 || (currentAllocPct[n] || 0) > 0)
                    .map(([narrative, target]) => {
                      const current = currentAllocPct[narrative] || 0;
                      const diff = current - target;
                      return (
                        <div key={narrative} className="flex items-center gap-3">
                          <span className="font-inter text-xs text-muted-foreground w-24 shrink-0">{narrative}</span>
                          <div className="flex-1 h-2 bg-background rounded-full overflow-hidden relative">
                            <div className="absolute inset-y-0 left-0 bg-primary/30 rounded-full" style={{ width: `${Math.min(target, 100)}%` }} />
                            <div className={`absolute inset-y-0 left-0 rounded-full ${diff > 5 ? "bg-orange-400" : diff < -5 ? "bg-blue-400" : "bg-green-400"}`}
                              style={{ width: `${Math.min(current, 100)}%`, opacity: 0.7 }} />
                          </div>
                          <div className="flex items-center gap-2 shrink-0 w-28 justify-end">
                            <span className="font-mono text-xs text-muted-foreground">{current.toFixed(1)}%</span>
                            <span className="font-inter text-[10px] text-muted-foreground">→</span>
                            <span className="font-mono text-xs text-foreground">{target}%</span>
                          </div>
                        </div>
                      );
                    })}
                </div>
                <div className="flex gap-3 mt-2">
                  <span className="flex items-center gap-1 font-inter text-[10px] text-muted-foreground"><span className="w-2 h-2 rounded-full bg-primary/30 inline-block" />Target</span>
                  <span className="flex items-center gap-1 font-inter text-[10px] text-muted-foreground"><span className="w-2 h-2 rounded-full bg-green-400/70 inline-block" />Current (aligned)</span>
                  <span className="flex items-center gap-1 font-inter text-[10px] text-muted-foreground"><span className="w-2 h-2 rounded-full bg-orange-400/70 inline-block" />Overweight</span>
                </div>
              </div>

              {/* Run button */}
              <button
                onClick={runAnalysis}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground rounded-xl font-cinzel text-sm tracking-wider hover:bg-primary/90 transition-colors disabled:opacity-60 shadow-lg shadow-primary/20"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {loading ? "Analyzing with AI..." : `Generate ${selectedProfile} Rebalancing Plan`}
              </button>

              {/* Analysis results */}
              {analysis && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">

                  {/* Drift score + summary */}
                  <div className="flex flex-col sm:flex-row gap-4 p-4 bg-primary/5 border border-primary/20 rounded-xl">
                    <div className="text-center sm:border-r sm:border-border/40 sm:pr-4 shrink-0">
                      <p className="font-inter text-xs text-muted-foreground mb-1">Drift Score</p>
                      <p className={`font-cinzel text-3xl font-bold ${
                        analysis.drift_score >= 60 ? "text-red-400" :
                        analysis.drift_score >= 30 ? "text-orange-400" : "text-green-400"
                      }`}>{analysis.drift_score}</p>
                      <p className="font-inter text-[10px] text-muted-foreground">/ 100</p>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 mb-2">
                        <Target className="w-3.5 h-3.5 text-primary" />
                        <p className="font-cinzel text-xs font-bold text-foreground">AI Assessment</p>
                      </div>
                      <p className="font-inter text-sm text-muted-foreground leading-relaxed">{analysis.summary}</p>
                    </div>
                  </div>

                  {/* Swap recommendations */}
                  {analysis.swaps?.length > 0 ? (
                    <div>
                      <p className="font-cinzel text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-primary" />
                        Recommended Swaps ({analysis.swaps.length})
                      </p>
                      <div className="space-y-3">
                        {analysis.swaps.map((swap, i) => (
                          <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 bg-background border border-border/50 rounded-xl hover:border-primary/30 transition-all">
                            <div className="flex items-center gap-2 shrink-0">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-inter font-semibold border ${PRIORITY_COLOR[swap.priority] || PRIORITY_COLOR.medium}`}>
                                {swap.priority}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="font-cinzel text-sm font-bold text-foreground">{swap.from_symbol}</span>
                              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                              <span className="font-cinzel text-sm font-bold text-primary">{swap.to_symbol}</span>
                              <span className="font-inter text-xs text-muted-foreground">· ${swap.usd_amount?.toFixed(2)}</span>
                            </div>
                            <p className="font-inter text-xs text-muted-foreground flex-1 leading-relaxed">{swap.rationale}</p>
                            <a
                              href={buildJupiterSwapUrl(swap.from_symbol, swap.to_symbol)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 px-3 py-2 bg-primary text-primary-foreground rounded-lg font-cinzel text-xs tracking-wider hover:bg-primary/90 transition-colors whitespace-nowrap shrink-0"
                            >
                              Swap on Jupiter <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4 px-4 bg-green-900/10 border border-green-700/20 rounded-xl">
                      <p className="font-cinzel text-sm font-bold text-green-400 mb-1">✓ Well Aligned</p>
                      <p className="font-inter text-xs text-muted-foreground">Your portfolio is already close to the {selectedProfile} target profile.</p>
                    </div>
                  )}

                  {/* After rebalance */}
                  {analysis.after_rebalance && (
                    <div className="p-3 bg-blue-900/10 border border-blue-700/20 rounded-xl">
                      <p className="font-cinzel text-xs font-bold text-blue-300 mb-1">After Rebalancing</p>
                      <p className="font-inter text-xs text-muted-foreground leading-relaxed">{analysis.after_rebalance}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <p className="font-inter text-[10px] text-muted-foreground/50">
                      ⚠️ Not financial advice · Always review swaps before executing
                    </p>
                    <button onClick={runAnalysis} disabled={loading}
                      className="flex items-center gap-1 font-inter text-xs text-primary hover:underline">
                      <RefreshCw className="w-3 h-3" /> Re-analyze
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}