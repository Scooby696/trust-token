import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp, TrendingDown, Sparkles, Loader2, RefreshCw,
  ExternalLink, ChevronDown, ChevronUp, BarChart2, Target, Zap
} from "lucide-react";
import { base44 } from "@/api/base44Client";

const KALSHI_BASE = "https://trading.kalshi.com";
const KALSHI_API = "https://api.elections.kalshi.com/trade-api/v2";

// Hardcoded crypto-relevant Kalshi market slugs / search terms
const CRYPTO_SEARCH_TERMS = ["bitcoin", "ethereum", "crypto", "solana", "BTC", "ETH"];

async function fetchKalshiCryptoMarkets() {
  const res = await fetch(
    `${KALSHI_API}/markets?status=open&limit=50&series_ticker=KXBTC`,
    { headers: { Accept: "application/json" } }
  );
  if (res.ok) {
    const data = await res.json();
    if (data?.markets?.length > 0) return data.markets.slice(0, 15);
  }

  // Fallback: try generic crypto category
  const res2 = await fetch(
    `${KALSHI_API}/markets?status=open&limit=50`,
    { headers: { Accept: "application/json" } }
  );
  if (!res2.ok) return [];
  const data2 = await res2.json();
  const markets = data2?.markets || [];
  // Filter to crypto-relevant
  return markets.filter((m) => {
    const title = (m.title || m.subtitle || "").toLowerCase();
    return CRYPTO_SEARCH_TERMS.some((t) => title.includes(t.toLowerCase()));
  }).slice(0, 15);
}

function ProbabilityBar({ yes_bid, yes_ask }) {
  const pct = yes_bid != null ? Math.round(yes_bid * 100) : null;
  const color = pct >= 60 ? "bg-green-500" : pct >= 40 ? "bg-yellow-500" : "bg-red-500";
  if (pct == null) return null;
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className={`font-inter text-xs font-bold tabular-nums ${pct >= 60 ? "text-green-400" : pct >= 40 ? "text-yellow-400" : "text-red-400"}`}>
        {pct}¢
      </span>
    </div>
  );
}

export default function KalshiPanel({ defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadMarkets = async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const data = await fetchKalshiCryptoMarkets();
      setMarkets(data);
    } catch {}
    if (!silent) setLoading(false);
    else setRefreshing(false);
  };

  useEffect(() => {
    if (open && markets.length === 0) loadMarkets();
  }, [open]);

  const runAiAnalysis = async () => {
    if (markets.length === 0) return;
    setAiLoading(true);
    setAiAnalysis(null);

    const marketSummary = markets.map((m) => {
      const prob = m.yes_bid != null ? Math.round(m.yes_bid * 100) : "?";
      return `- "${m.title || m.subtitle}" → YES probability: ${prob}¢ (out of 100)`;
    }).join("\n");

    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a crypto trading strategist who specializes in using prediction market data from Kalshi to inform trading decisions.

Here are the currently active Kalshi crypto prediction markets and their YES probabilities (in cents, where 100¢ = 100% probability):

${marketSummary}

Based on these prediction market probabilities:
1. overall_sentiment: "Bullish" | "Bearish" | "Neutral" — overall crypto market sentiment derived from these markets
2. key_insight: 2-3 sentence interpretation of what these prediction markets are telling us about crypto right now
3. trading_signal: one of "Strong Buy" | "Buy" | "Hold" | "Sell" | "Strong Sell" — what action a crypto trader should consider
4. signal_reason: one sentence explaining the signal
5. opportunities: array of up to 3 specific opportunities or observations from individual markets (each as a string)
6. risk_warning: one sentence about the biggest risk these markets signal`,
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

  const SIGNAL_STYLE = {
    "Strong Buy": "text-green-400 bg-green-900/20 border-green-700/40",
    "Buy": "text-green-300 bg-green-900/10 border-green-800/30",
    "Hold": "text-yellow-400 bg-yellow-900/20 border-yellow-700/40",
    "Sell": "text-orange-400 bg-orange-900/20 border-orange-700/40",
    "Strong Sell": "text-red-400 bg-red-900/20 border-red-700/40",
  };

  const SENTIMENT_ICON = {
    "Bullish": <TrendingUp className="w-4 h-4 text-green-400" />,
    "Bearish": <TrendingDown className="w-4 h-4 text-red-400" />,
    "Neutral": <BarChart2 className="w-4 h-4 text-yellow-400" />,
  };

  return (
    <div className="bg-card border border-primary/20 rounded-xl overflow-hidden">
      {/* Header toggle */}
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
                <a href={`${KALSHI_BASE}/markets/crypto`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 px-2.5 py-1.5 bg-background border border-border rounded-lg text-xs font-inter text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors">
                  <ExternalLink className="w-3 h-3" /> Crypto Markets
                </a>
                <a href={`${KALSHI_BASE}/markets/bitcoin`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 px-2.5 py-1.5 bg-background border border-border rounded-lg text-xs font-inter text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors">
                  <ExternalLink className="w-3 h-3" /> Bitcoin Markets
                </a>
                <a href={`${KALSHI_BASE}/markets/ethereum`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 px-2.5 py-1.5 bg-background border border-border rounded-lg text-xs font-inter text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors">
                  <ExternalLink className="w-3 h-3" /> Ethereum Markets
                </a>
              </div>

              {/* AI Analysis */}
              <button
                onClick={runAiAnalysis}
                disabled={aiLoading || markets.length === 0}
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

              {/* Live markets list */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="font-cinzel text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Live Crypto Markets</p>
                  <button onClick={() => loadMarkets(true)} disabled={refreshing}
                    className="text-muted-foreground hover:text-primary transition-colors">
                    <RefreshCw className={`w-3 h-3 ${refreshing ? "animate-spin" : ""}`} />
                  </button>
                </div>

                {loading ? (
                  <div className="flex items-center justify-center py-6 gap-2">
                    <Loader2 className="w-4 h-4 text-primary animate-spin" />
                    <span className="font-inter text-xs text-muted-foreground">Fetching Kalshi markets...</span>
                  </div>
                ) : markets.length === 0 ? (
                  <div className="text-center py-5">
                    <p className="font-inter text-xs text-muted-foreground mb-2">No live markets loaded yet.</p>
                    <a href={`${KALSHI_BASE}/markets/crypto`} target="_blank" rel="noopener noreferrer"
                      className="font-inter text-xs text-primary hover:underline flex items-center justify-center gap-1">
                      Browse on Kalshi <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {markets.map((m, i) => (
                      <a
                        key={m.ticker || i}
                        href={`${KALSHI_BASE}/markets/${m.ticker || ""}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-2.5 bg-background border border-border/40 rounded-lg hover:border-primary/40 transition-all group"
                      >
                        <p className="font-inter text-xs text-foreground group-hover:text-primary transition-colors leading-snug mb-1.5 line-clamp-2">
                          {m.title || m.subtitle || m.ticker}
                        </p>
                        <ProbabilityBar yes_bid={m.yes_bid} yes_ask={m.yes_ask} />
                        {m.volume != null && (
                          <p className="font-inter text-[10px] text-muted-foreground/60 mt-1">
                            Vol: {m.volume?.toLocaleString() || "—"} · Closes {m.close_time ? new Date(m.close_time).toLocaleDateString() : "—"}
                          </p>
                        )}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-1 border-t border-border/20">
                <p className="font-inter text-[10px] text-muted-foreground/40 leading-relaxed">
                  Kalshi is a CFTC-regulated US prediction market · Prices reflect crowd probability estimates, not financial advice.
                </p>
                <a href="https://kalshi.com" target="_blank" rel="noopener noreferrer"
                  className="font-inter text-[10px] text-primary hover:underline flex items-center gap-1 mt-1">
                  About Kalshi <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}