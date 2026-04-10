import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  ReferenceLine, Legend, CartesianGrid
} from "recharts";
import { Loader2, Search, CheckCircle2, XCircle, BarChart2, Sparkles, Info } from "lucide-react";
import { base44 } from "@/api/base44Client";

const SUPPORTED_TOKENS = [
  { id: "bitcoin", label: "BTC", coingecko: "bitcoin" },
  { id: "ethereum", label: "ETH", coingecko: "ethereum" },
  { id: "solana", label: "SOL", coingecko: "solana" },
];

const DAYS_OPTIONS = [
  { label: "30d", value: 30 },
  { label: "90d", value: 90 },
  { label: "180d", value: 180 },
  { label: "1yr", value: 365 },
];

// Fetch historical price data from CoinGecko (free, no key needed)
async function fetchPriceHistory(coingeckoId, days) {
  const res = await fetch(
    `https://api.coingecko.com/api/v3/coins/${coingeckoId}/market_chart?vs_currency=usd&days=${days}&interval=daily`
  );
  if (!res.ok) throw new Error("Price fetch failed");
  const data = await res.json();
  return (data.prices || []).map(([ts, price]) => ({
    date: new Date(ts).toISOString().split("T")[0],
    price: Math.round(price * 100) / 100,
    timestamp: ts,
  }));
}

// Fetch resolved Kalshi crypto markets
async function fetchKalshiResolved(tokenLabel) {
  const term = tokenLabel === "BTC" ? "bitcoin" : tokenLabel === "ETH" ? "ethereum" : "solana";
  try {
    const res = await fetch(
      `https://api.elections.kalshi.com/trade-api/v2/markets?status=finalized&limit=50`,
      { headers: { Accept: "application/json" } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    const markets = data?.markets || [];
    return markets
      .filter((m) => {
        const t = (m.title || m.subtitle || "").toLowerCase();
        return t.includes(term) || t.includes(tokenLabel.toLowerCase());
      })
      .slice(0, 20)
      .map((m) => ({
        ticker: m.ticker,
        title: m.title || m.subtitle,
        close_date: m.close_time ? new Date(m.close_time).toISOString().split("T")[0] : null,
        result: m.result, // "yes" | "no"
        final_yes_price: m.final_yes_count != null ? m.final_yes_count / 100 : null,
        // last known yes price before close as probability
        yes_price: m.yes_bid || m.last_price || null,
        volume: m.volume,
      }))
      .filter((m) => m.close_date);
  } catch {
    return [];
  }
}

function CustomTooltip({ active, payload, label, resolutions }) {
  if (!active || !payload?.length) return null;
  const res = resolutions.filter((r) => r.close_date === label);
  return (
    <div className="bg-card border border-border rounded-xl p-3 shadow-xl text-xs min-w-[180px]">
      <p className="font-cinzel font-bold text-foreground mb-1">{label}</p>
      <p className="font-inter text-primary font-semibold">
        ${payload[0]?.value?.toLocaleString(undefined, { maximumFractionDigits: 2 })}
      </p>
      {res.map((r, i) => (
        <div key={i} className={`mt-1.5 pt-1.5 border-t border-border/40 flex items-start gap-1.5`}>
          {r.result === "yes"
            ? <CheckCircle2 className="w-3 h-3 text-green-400 shrink-0 mt-0.5" />
            : <XCircle className="w-3 h-3 text-red-400 shrink-0 mt-0.5" />}
          <div>
            <p className={`font-inter ${r.result === "yes" ? "text-green-400" : "text-red-400"} font-semibold`}>
              Kalshi: {r.result?.toUpperCase()}
            </p>
            <p className="text-muted-foreground leading-snug line-clamp-2">{r.title}</p>
            {r.yes_price != null && (
              <p className="text-muted-foreground">Market prob: {Math.round(r.yes_price * 100)}%</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function PredictionAccuracyChart() {
  const [selectedToken, setSelectedToken] = useState(SUPPORTED_TOKENS[0]);
  const [days, setDays] = useState(90);
  const [priceData, setPriceData] = useState([]);
  const [resolutions, setResolutions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");
  const [aiSummary, setAiSummary] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError("");
    setAiSummary(null);
    try {
      const [prices, resolved] = await Promise.all([
        fetchPriceHistory(selectedToken.coingecko, days),
        fetchKalshiResolved(selectedToken.label),
      ]);

      // Filter resolved markets to within the date range
      const earliest = prices[0]?.date;
      const filtered = resolved.filter((r) => r.close_date >= (earliest || "2020-01-01"));

      setPriceData(prices);
      setResolutions(filtered);
      setLoaded(true);
    } catch (e) {
      setError("Failed to load data. Please try again.");
    }
    setLoading(false);
  };

  const runAiAnalysis = async () => {
    if (!resolutions.length) return;
    setAiLoading(true);
    setAiSummary(null);

    const correctPredictions = resolutions.filter((r) => {
      if (!r.yes_price || !r.result) return false;
      const predictedYes = r.yes_price > 0.5;
      return (predictedYes && r.result === "yes") || (!predictedYes && r.result === "no");
    });

    const accuracy = resolutions.length
      ? Math.round((correctPredictions.length / resolutions.length) * 100)
      : 0;

    const resSummary = resolutions.slice(0, 10).map((r) =>
      `- "${r.title}" closed ${r.close_date}: market prob was ${r.yes_price != null ? Math.round(r.yes_price * 100) + "%" : "unknown"}, resolved ${r.result?.toUpperCase()}`
    ).join("\n");

    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a crypto prediction market analyst. Analyze these resolved Kalshi ${selectedToken.label} markets over the past ${days} days:

${resSummary}

Overall accuracy (market favored correct outcome): ${accuracy}% of ${resolutions.length} markets

Provide:
1. accuracy_rating: "${accuracy}%" 
2. overall_verdict: one of "Highly Accurate" | "Mostly Accurate" | "Mixed Results" | "Mostly Inaccurate"
3. key_finding: 2 sentences — what does this accuracy tell us about using Kalshi as a ${selectedToken.label} signal?
4. best_use_case: one sentence on when Kalshi markets were most reliable
5. caution: one sentence on a limitation or edge case to watch out for`,
        response_json_schema: {
          type: "object",
          properties: {
            accuracy_rating: { type: "string" },
            overall_verdict: { type: "string" },
            key_finding: { type: "string" },
            best_use_case: { type: "string" },
            caution: { type: "string" },
          }
        }
      });
      setAiSummary(result);
    } catch {
      setAiSummary({ key_finding: "Analysis unavailable. Please try again.", overall_verdict: "Mixed Results" });
    }
    setAiLoading(false);
  };

  // Merge price data with resolution markers
  const chartData = priceData.map((p) => {
    const dayRes = resolutions.filter((r) => r.close_date === p.date);
    return {
      ...p,
      hasResolution: dayRes.length > 0,
      resolutionYes: dayRes.some((r) => r.result === "yes") ? p.price : null,
      resolutionNo: dayRes.some((r) => r.result === "no") && !dayRes.some((r) => r.result === "yes") ? p.price : null,
    };
  });

  const VERDICT_COLOR = {
    "Highly Accurate": "text-green-400",
    "Mostly Accurate": "text-green-300",
    "Mixed Results": "text-yellow-400",
    "Mostly Inaccurate": "text-red-400",
  };

  return (
    <div className="bg-card border border-border/50 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-border/30">
        <div className="flex items-center gap-2 mb-1">
          <BarChart2 className="w-4 h-4 text-primary" />
          <h3 className="font-cinzel font-bold text-foreground text-sm">Prediction Accuracy Visualizer</h3>
        </div>
        <p className="font-inter text-xs text-muted-foreground">
          Compare historical {selectedToken.label} price with resolved Kalshi market outcomes to see if crowd predictions matched reality.
        </p>
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        {/* Controls */}
        <div className="flex flex-wrap gap-3 items-end">
          <div>
            <p className="font-inter text-[10px] text-muted-foreground mb-1.5 uppercase tracking-wider">Token</p>
            <div className="flex gap-1.5">
              {SUPPORTED_TOKENS.map((t) => (
                <button key={t.id} onClick={() => { setSelectedToken(t); setLoaded(false); setAiSummary(null); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-cinzel border transition-all ${
                    selectedToken.id === t.id ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border text-muted-foreground hover:border-primary/40"
                  }`}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="font-inter text-[10px] text-muted-foreground mb-1.5 uppercase tracking-wider">Range</p>
            <div className="flex gap-1.5">
              {DAYS_OPTIONS.map((d) => (
                <button key={d.value} onClick={() => { setDays(d.value); setLoaded(false); setAiSummary(null); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-inter border transition-all ${
                    days === d.value ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border text-muted-foreground hover:border-primary/40"
                  }`}>
                  {d.label}
                </button>
              ))}
            </div>
          </div>
          <button onClick={loadData} disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-cinzel text-xs tracking-wider hover:bg-primary/90 transition-colors disabled:opacity-60 ml-auto">
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
            {loading ? "Loading..." : "Load Data"}
          </button>
        </div>

        {error && <p className="font-inter text-xs text-red-400">{error}</p>}

        {/* Chart */}
        {loaded && priceData.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            {/* Legend */}
            <div className="flex flex-wrap gap-4 text-xs font-inter text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-primary inline-block" />{selectedToken.label} Price</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-green-400" />Kalshi resolved YES</span>
              <span className="flex items-center gap-1.5"><XCircle className="w-3 h-3 text-red-400" />Kalshi resolved NO</span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" tick={{ fontSize: 9, fill: "#6b7280" }} tickFormatter={(v) => v.slice(5)}
                    interval={Math.floor(chartData.length / 6)} />
                  <YAxis tick={{ fontSize: 9, fill: "#6b7280" }}
                    tickFormatter={(v) => `$${v >= 1000 ? (v / 1000).toFixed(0) + "k" : v}`}
                    width={55} />
                  <Tooltip content={<CustomTooltip resolutions={resolutions} />} />
                  <Line type="monotone" dataKey="price" stroke="hsl(43 90% 52%)" strokeWidth={2} dot={false} />
                  {/* YES resolution dots */}
                  <Line type="monotone" dataKey="resolutionYes" stroke="#4ade80" strokeWidth={0}
                    dot={{ r: 6, fill: "#4ade80", stroke: "#166534", strokeWidth: 2 }} activeDot={false} />
                  {/* NO resolution dots */}
                  <Line type="monotone" dataKey="resolutionNo" stroke="#f87171" strokeWidth={0}
                    dot={{ r: 6, fill: "#f87171", stroke: "#991b1b", strokeWidth: 2 }} activeDot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Resolution summary */}
            {resolutions.length > 0 ? (
              <div className="grid sm:grid-cols-3 gap-3">
                <div className="bg-background border border-border/40 rounded-xl p-3 text-center">
                  <p className="font-cinzel text-xl font-bold text-primary">{resolutions.length}</p>
                  <p className="font-inter text-[10px] text-muted-foreground">Markets Resolved</p>
                </div>
                <div className="bg-background border border-green-800/30 rounded-xl p-3 text-center">
                  <p className="font-cinzel text-xl font-bold text-green-400">
                    {resolutions.filter((r) => r.result === "yes").length}
                  </p>
                  <p className="font-inter text-[10px] text-muted-foreground">Resolved YES</p>
                </div>
                <div className="bg-background border border-red-800/30 rounded-xl p-3 text-center">
                  <p className="font-cinzel text-xl font-bold text-red-400">
                    {resolutions.filter((r) => r.result === "no").length}
                  </p>
                  <p className="font-inter text-[10px] text-muted-foreground">Resolved NO</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-2.5 bg-muted/30 border border-border/30 rounded-lg">
                <Info className="w-4 h-4 text-muted-foreground shrink-0" />
                <p className="font-inter text-xs text-muted-foreground">
                  No resolved Kalshi {selectedToken.label} markets found in this time window. Try a longer range or check back later as markets settle.
                </p>
              </div>
            )}

            {/* Resolved market list */}
            {resolutions.length > 0 && (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                <p className="font-cinzel text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Resolved Markets</p>
                {resolutions.map((r, i) => (
                  <div key={i} className={`flex items-start gap-2 px-3 py-2 rounded-lg border text-xs ${
                    r.result === "yes" ? "bg-green-900/10 border-green-800/30" : "bg-red-900/10 border-red-800/30"
                  }`}>
                    {r.result === "yes"
                      ? <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0 mt-0.5" />
                      : <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />}
                    <div className="flex-1 min-w-0">
                      <p className="font-inter text-foreground/80 leading-snug line-clamp-1">{r.title}</p>
                      <p className="font-inter text-muted-foreground text-[10px]">
                        Closed {r.close_date}
                        {r.yes_price != null ? ` · Market prob: ${Math.round(r.yes_price * 100)}%` : ""}
                        {r.volume ? ` · Vol: ${r.volume?.toLocaleString()}` : ""}
                      </p>
                    </div>
                    <span className={`font-cinzel text-xs font-bold shrink-0 ${r.result === "yes" ? "text-green-400" : "text-red-400"}`}>
                      {r.result?.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* AI Analysis button */}
            {resolutions.length > 0 && (
              <button onClick={runAiAnalysis} disabled={aiLoading}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary/10 border border-primary/30 text-primary rounded-xl font-cinzel text-xs tracking-wider hover:bg-primary/20 transition-colors disabled:opacity-60">
                {aiLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                {aiLoading ? "Analyzing accuracy..." : "AI: Analyze Prediction Accuracy"}
              </button>
            )}

            {/* AI result */}
            {aiSummary && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className="space-y-3 p-4 bg-primary/5 border border-primary/20 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="font-cinzel text-sm font-bold text-foreground">Accuracy Analysis</span>
                  <span className={`font-cinzel text-sm font-bold ${VERDICT_COLOR[aiSummary.overall_verdict] || "text-foreground"}`}>
                    {aiSummary.overall_verdict}
                  </span>
                </div>
                <p className="font-inter text-xs text-muted-foreground leading-relaxed">{aiSummary.key_finding}</p>
                {aiSummary.best_use_case && (
                  <p className="font-inter text-xs text-foreground/70 leading-relaxed">
                    <strong className="text-green-400">Best use:</strong> {aiSummary.best_use_case}
                  </p>
                )}
                {aiSummary.caution && (
                  <p className="font-inter text-xs text-orange-400/80 leading-relaxed">
                    ⚠ {aiSummary.caution}
                  </p>
                )}
              </motion.div>
            )}
          </motion.div>
        )}

        {!loaded && !loading && (
          <div className="flex flex-col items-center py-10 gap-3 text-center">
            <BarChart2 className="w-8 h-8 text-muted-foreground/30" />
            <p className="font-inter text-xs text-muted-foreground max-w-sm">
              Select a token and time range, then click <strong className="text-foreground">Load Data</strong> to compare price history with Kalshi resolution outcomes.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}