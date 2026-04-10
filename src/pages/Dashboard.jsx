import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from "recharts";
import { Loader2, TrendingUp, TrendingDown, Minus, RefreshCw, BarChart2, ShieldCheck, CheckCircle2, XCircle, Mail } from "lucide-react";
import { base44 } from "@/api/base44Client";

const SECTORS = ["DeFi", "NFT", "Layer 1", "Layer 2", "Bitcoin", "Solana", "Regulation", "Institutional"];

const SECTOR_PROMPTS = SECTORS.join(", ");

function SentimentBadge({ sentiment }) {
  const cfg = {
    bullish: { label: "Bullish", color: "text-green-400 bg-green-900/30 border-green-800/40", icon: TrendingUp },
    bearish: { label: "Bearish", color: "text-red-400 bg-red-900/30 border-red-800/40", icon: TrendingDown },
    neutral: { label: "Neutral", color: "text-blue-300 bg-blue-900/30 border-blue-800/40", icon: Minus },
  }[sentiment] || { label: "Neutral", color: "text-blue-300 bg-blue-900/30 border-blue-800/40", icon: Minus };
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-inter border ${cfg.color}`}>
      <Icon className="w-3 h-3" />{cfg.label}
    </span>
  );
}

const SENTIMENT_COLOR = { bullish: "#4ade80", neutral: "#93c5fd", bearish: "#f87171" };

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastFetched, setLastFetched] = useState(null);
  const [applications, setApplications] = useState([]);
  const [appLoading, setAppLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchApplications = async () => {
    setAppLoading(true);
    const apps = await base44.entities.CreatorApplication.filter({ status: "submitted" }, "-created_date", 50);
    setApplications(apps);
    setAppLoading(false);
  };

  const handleDecision = async (app, decision) => {
    setActionLoading(app.id);
    try {
      await base44.entities.CreatorApplication.update(app.id, { status: decision === "approve" ? "approved" : "rejected" });
      try {
        await base44.integrations.Core.SendEmail({
          to: app.email,
          subject: decision === "approve"
            ? `✅ Your application to MADE IN USA DIGITAL has been approved!`
            : `❌ Your application to MADE IN USA DIGITAL was not approved`,
          body: decision === "approve"
            ? `Hi ${app.owner_name},\n\nCongratulations! Your business "${app.business_name}" has been verified and approved for listing on the MADE IN USA DIGITAL Marketplace.\n\nYour listing will be live shortly. Welcome to the community!\n\n— MADE IN USA DIGITAL Team`
            : `Hi ${app.owner_name},\n\nThank you for applying to list "${app.business_name}" on MADE IN USA DIGITAL. After review, we were unable to approve your application at this time.\n\nPlease contact us at trusttokenbymadeintheusadigital@gmail.com if you have questions or wish to reapply.\n\n— MADE IN USA DIGITAL Team`,
        });
      } catch {}
      setApplications((prev) => prev.filter((a) => a.id !== app.id));
    } finally {
      setActionLoading(null);
    }
  };

  useEffect(() => { fetchApplications(); }, []);

  const fetchSentiment = async () => {
    setLoading(true);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a crypto market analyst. For each of the following sectors: ${SECTOR_PROMPTS}, analyze the current market sentiment based on recent news and events.

For each sector return:
- sector: the sector name (exactly as given)
- sentiment: one of "bullish", "bearish", or "neutral"
- bullish_score: integer 0-100 (how bullish the market is)
- bearish_score: integer 0-100 (how bearish the market is)  
- neutral_score: integer 0-100 (how neutral/mixed the market is)
- headline: a single key news headline driving this sentiment (max 100 chars)
- summary: one sentence explanation of the current sentiment (max 150 chars)

Note: bullish_score + bearish_score + neutral_score should roughly equal 100.`,
      add_context_from_internet: true,
      response_json_schema: {
        type: "object",
        properties: {
          sectors: {
            type: "array",
            items: {
              type: "object",
              properties: {
                sector: { type: "string" },
                sentiment: { type: "string" },
                bullish_score: { type: "number" },
                bearish_score: { type: "number" },
                neutral_score: { type: "number" },
                headline: { type: "string" },
                summary: { type: "string" },
              }
            }
          },
          overall_sentiment: { type: "string" },
          market_summary: { type: "string" },
        }
      }
    });
    setData(result);
    setLastFetched(new Date());
    setLoading(false);
  };

  useEffect(() => { fetchSentiment(); }, []);

  // Bar chart data — one bar per sector showing bullish/bearish/neutral breakdown
  const chartData = data?.sectors?.map((s) => ({
    name: s.sector,
    Bullish: s.bullish_score,
    Neutral: s.neutral_score,
    Bearish: s.bearish_score,
  })) || [];

  // Summary bar chart — overall bullish count
  const summaryData = data?.sectors?.map((s) => ({
    name: s.sector,
    score: s.bullish_score,
    sentiment: s.sentiment,
  })) || [];

  return (
    <div className="pt-20 sm:pt-24 min-h-screen">

      {/* Admin: Pending Applications */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="bg-card border border-primary/20 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border/30">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" />
              <h2 className="font-cinzel font-bold text-foreground">Pending Marketplace Applications</h2>
              {applications.length > 0 && (
                <span className="px-2 py-0.5 bg-red-600 text-white rounded-full text-xs font-bold">{applications.length}</span>
              )}
            </div>
            <button onClick={fetchApplications} className="text-muted-foreground hover:text-primary transition-colors">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {appLoading ? (
            <div className="flex items-center justify-center py-10 gap-2">
              <Loader2 className="w-5 h-5 text-primary animate-spin" />
              <span className="font-inter text-sm text-muted-foreground">Loading applications...</span>
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-10">
              <CheckCircle2 className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="font-inter text-sm text-muted-foreground">No pending applications — all clear!</p>
            </div>
          ) : (
            <div className="divide-y divide-border/30">
              {applications.map((app) => (
                <div key={app.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-cinzel font-bold text-foreground">{app.business_name}</p>
                      <span className="px-2 py-0.5 bg-primary/10 text-primary border border-primary/30 rounded-full text-[10px] font-inter">{app.category}</span>
                    </div>
                    <p className="font-inter text-xs text-muted-foreground mb-0.5">{app.owner_name} · {app.location} · {app.state_of_incorporation}</p>
                    <p className="font-inter text-xs text-muted-foreground mb-0.5">EIN: {app.ein_number || "—"} · Cert: {app.certification_type || "None"}</p>
                    <p className="font-inter text-xs text-muted-foreground/70 leading-relaxed line-clamp-2 mt-1">{app.product_description}</p>
                    <a href={`mailto:${app.email}`} className="flex items-center gap-1 mt-1 font-inter text-xs text-primary hover:underline">
                      <Mail className="w-3 h-3" />{app.email}
                    </a>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => handleDecision(app, "approve")}
                      disabled={actionLoading === app.id}
                      className="flex items-center gap-1.5 px-4 py-2 bg-green-700 text-white rounded-lg font-cinzel text-xs tracking-wider hover:bg-green-600 transition-colors disabled:opacity-50"
                    >
                      {actionLoading === app.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                      Approve
                    </button>
                    <button
                      onClick={() => handleDecision(app, "reject")}
                      disabled={actionLoading === app.id}
                      className="flex items-center gap-1.5 px-4 py-2 bg-red-800 text-white rounded-lg font-cinzel text-xs tracking-wider hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Hero */}
      <section className="relative py-12 sm:py-16 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-border/30">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/60 via-background to-purple-950/20 pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-1 flex">
          <div className="flex-1 bg-red-600" />
          <div className="flex-1 bg-white/80" />
          <div className="flex-1 bg-blue-700" />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <BarChart2 className="w-6 h-6 text-primary" />
                <p className="font-inter text-xs tracking-[0.35em] text-primary uppercase">MADE IN USA DIGITAL · Market Intelligence</p>
              </div>
              <h1 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">
                SENTIMENT DASHBOARD
              </h1>
              <div className="w-24 h-0.5 bg-primary mb-3" />
              <p className="font-inter text-sm text-white/60 max-w-xl">
                AI-powered real-time market sentiment across crypto sectors — updated on demand.
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              {lastFetched && (
                <p className="font-inter text-xs text-muted-foreground">
                  Updated {lastFetched.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              )}
              <button
                onClick={fetchSentiment}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-cinzel text-xs tracking-wider hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                {loading ? "Analyzing..." : "Refresh"}
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        {loading && !data ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="font-cinzel text-sm text-muted-foreground tracking-wider">Analyzing market sentiment...</p>
            <p className="font-inter text-xs text-muted-foreground/60">Scanning news feeds across all sectors</p>
          </div>
        ) : data ? (
          <>
            {/* Overall market summary */}
            {data.market_summary && (
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="mb-8 p-5 bg-card border border-primary/20 rounded-xl flex flex-col sm:flex-row items-start sm:items-center gap-4"
              >
                <div className="shrink-0">
                  <p className="font-inter text-xs text-muted-foreground uppercase tracking-wider mb-1">Overall Market</p>
                  <SentimentBadge sentiment={data.overall_sentiment} />
                </div>
                <div className="w-px h-10 bg-border hidden sm:block" />
                <p className="font-inter text-sm text-muted-foreground leading-relaxed">{data.market_summary}</p>
              </motion.div>
            )}

            {/* Bullish Score Bar Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="mb-8 bg-card border border-border/50 rounded-xl p-5 sm:p-6"
            >
              <h2 className="font-cinzel text-base font-bold text-foreground mb-1">Bullish Score by Sector</h2>
              <p className="font-inter text-xs text-muted-foreground mb-5">Higher = more bullish sentiment from recent news</p>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={summaryData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 35% 22%)" />
                  <XAxis dataKey="name" tick={{ fill: "hsl(220 15% 60%)", fontSize: 11, fontFamily: "Inter" }} />
                  <YAxis domain={[0, 100]} tick={{ fill: "hsl(220 15% 60%)", fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ background: "hsl(220 40% 12%)", border: "1px solid hsl(220 35% 22%)", borderRadius: 8, fontFamily: "Inter", fontSize: 12 }}
                    labelStyle={{ color: "hsl(0 0% 96%)", fontFamily: "Cinzel, serif" }}
                    formatter={(value) => [`${value}/100`, "Bullish Score"]}
                  />
                  <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                    {summaryData.map((entry, i) => (
                      <Cell key={i} fill={SENTIMENT_COLOR[entry.sentiment] || "#93c5fd"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              {/* Legend */}
              <div className="flex items-center gap-4 mt-3 justify-center">
                {[["bullish", "Bullish"], ["neutral", "Neutral"], ["bearish", "Bearish"]].map(([key, label]) => (
                  <div key={key} className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-sm" style={{ background: SENTIMENT_COLOR[key] }} />
                    <span className="font-inter text-xs text-muted-foreground">{label}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Stacked breakdown chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="mb-8 bg-card border border-border/50 rounded-xl p-5 sm:p-6"
            >
              <h2 className="font-cinzel text-base font-bold text-foreground mb-1">Sentiment Breakdown by Sector</h2>
              <p className="font-inter text-xs text-muted-foreground mb-5">Bullish / Neutral / Bearish split across sectors</p>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={chartData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 35% 22%)" />
                  <XAxis dataKey="name" tick={{ fill: "hsl(220 15% 60%)", fontSize: 11, fontFamily: "Inter" }} />
                  <YAxis domain={[0, 100]} tick={{ fill: "hsl(220 15% 60%)", fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ background: "hsl(220 40% 12%)", border: "1px solid hsl(220 35% 22%)", borderRadius: 8, fontFamily: "Inter", fontSize: 12 }}
                    labelStyle={{ color: "hsl(0 0% 96%)", fontFamily: "Cinzel, serif" }}
                  />
                  <Bar dataKey="Bullish" stackId="a" fill="#4ade80" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="Neutral" stackId="a" fill="#93c5fd" />
                  <Bar dataKey="Bearish" stackId="a" fill="#f87171" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Sector cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {data.sectors?.map((sector, i) => (
                <motion.div
                  key={sector.sector}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                  className="bg-card border border-border/50 rounded-xl p-4 hover:border-primary/30 transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-cinzel font-bold text-foreground text-sm">{sector.sector}</h3>
                    <SentimentBadge sentiment={sector.sentiment} />
                  </div>
                  {/* Mini bar */}
                  <div className="flex h-2 rounded-full overflow-hidden gap-px mb-3">
                    <div style={{ width: `${sector.bullish_score}%`, background: "#4ade80" }} className="rounded-l-full" />
                    <div style={{ width: `${sector.neutral_score}%`, background: "#93c5fd" }} />
                    <div style={{ width: `${sector.bearish_score}%`, background: "#f87171" }} className="rounded-r-full" />
                  </div>
                  <p className="font-inter text-xs text-primary font-semibold leading-snug mb-1 line-clamp-2">{sector.headline}</p>
                  <p className="font-inter text-xs text-muted-foreground leading-relaxed line-clamp-2">{sector.summary}</p>
                </motion.div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <p className="font-inter text-xs text-muted-foreground/50">
                Sentiment powered by AI web search · Not financial advice
              </p>
            </div>
          </>
        ) : null}
      </section>
    </div>
  );
}