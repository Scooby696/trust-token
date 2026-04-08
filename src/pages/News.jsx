import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Newspaper, RefreshCw, ExternalLink, Filter, Loader2, Globe, Zap } from "lucide-react";
import { base44 } from "@/api/base44Client";

const CATEGORIES = [
  { id: "all", label: "All News" },
  { id: "usa", label: "🇺🇸 USA Regulation" },
  { id: "defi", label: "DeFi" },
  { id: "nft", label: "NFTs" },
  { id: "layer1", label: "Layer 1" },
  { id: "layer2", label: "Layer 2" },
  { id: "bitcoin", label: "Bitcoin" },
  { id: "solana", label: "Solana" },
  { id: "institutional", label: "Institutional" },
  { id: "sec", label: "SEC & Policy" },
];

const CATEGORY_PROMPTS = {
  all: "latest cryptocurrency and blockchain industry news impacting US-based companies and service providers",
  usa: "latest US cryptocurrency regulation, SEC enforcement actions, CFTC rulings, and US government policy changes impacting American crypto companies",
  defi: "latest DeFi news including protocol updates, hacks, new launches, TVL changes, and regulatory impact on US DeFi providers",
  nft: "latest NFT market news including major sales, platform updates, legal cases, and US marketplace regulations",
  layer1: "latest Layer 1 blockchain news including Solana, Ethereum, Bitcoin, Avalanche, Sui, Aptos — upgrades, adoption, and US company impact",
  layer2: "latest Layer 2 blockchain news including Arbitrum, Optimism, Polygon, Base, zkSync — new developments and US ecosystem impact",
  bitcoin: "latest Bitcoin news including price, ETF updates, institutional adoption, US mining regulations, and legislative developments",
  solana: "latest Solana ecosystem news including network updates, new protocols, memecoin market, US-based Solana projects",
  institutional: "latest institutional crypto news including bank partnerships, ETF filings, hedge fund moves, and Wall Street crypto adoption in the US",
  sec: "latest SEC, CFTC, FinCEN, and US Treasury actions, crypto regulatory hearings, enforcement cases against US crypto companies",
};

export default function News() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("all");
  const [lastFetched, setLastFetched] = useState(null);
  const [cache, setCache] = useState({});
  const [nextRefreshIn, setNextRefreshIn] = useState(300);

  const fetchNews = async (cat) => {
    if (cache[cat]) {
      setArticles(cache[cat]);
      return;
    }
    setLoading(true);
    const prompt = `You are a crypto news aggregator focused on US-based companies and service providers.

Fetch and summarize the 12 most recent and important news articles about: ${CATEGORY_PROMPTS[cat]}

For each article provide:
- title: compelling headline (max 90 chars)
- source: publication name (e.g. CoinDesk, The Block, Reuters, Bloomberg Crypto, Decrypt, Cointelegraph)
- summary: 2-sentence summary focused on impact to US companies/providers (max 200 chars)
- url: real URL to a relevant article or publication homepage
- category: one of [DeFi, NFT, Layer 1, Layer 2, Bitcoin, Solana, Regulation, Institutional, Policy, Markets]
- sentiment: one of [bullish, bearish, neutral]
- published: approximate date like "2 hours ago", "Today", "Yesterday", "3 days ago"

Return ONLY valid JSON array. No extra text.`;

    const result = await base44.integrations.Core.InvokeLLM({
      prompt,
      add_context_from_internet: true,
      response_json_schema: {
        type: "object",
        properties: {
          articles: {
            type: "array",
            items: {
              type: "object",
              properties: {
                title: { type: "string" },
                source: { type: "string" },
                summary: { type: "string" },
                url: { type: "string" },
                category: { type: "string" },
                sentiment: { type: "string" },
                published: { type: "string" },
              },
            },
          },
        },
      },
    });

    const fetched = result?.articles || [];
    setArticles(fetched);
    setCache((prev) => ({ ...prev, [cat]: fetched }));
    setLastFetched(new Date());
    setLoading(false);
  };

  useEffect(() => {
    fetchNews(category);
  }, [category]);

  // Auto-refresh every 5 minutes, always bypassing cache
  useEffect(() => {
    setNextRefreshIn(300);
    const countdown = setInterval(() => setNextRefreshIn((s) => Math.max(0, s - 1)), 1000);
    const interval = setInterval(() => {
      setCache((prev) => { const next = { ...prev }; delete next[category]; return next; });
      fetchNews(category);
      setNextRefreshIn(300);
    }, 5 * 60 * 1000);
    return () => { clearInterval(interval); clearInterval(countdown); };
  }, [category]);

  const handleRefresh = () => {
    setCache((prev) => { const next = { ...prev }; delete next[category]; return next; });
    fetchNews(category);
  };

  const sentimentColor = {
    bullish: "text-green-400 bg-green-900/30 border-green-800/40",
    bearish: "text-red-400 bg-red-900/30 border-red-800/40",
    neutral: "text-blue-300 bg-blue-900/30 border-blue-800/40",
  };

  const categoryColor = {
    "DeFi": "bg-green-900/40 text-green-300",
    "NFT": "bg-purple-900/40 text-purple-300",
    "Layer 1": "bg-cyan-900/40 text-cyan-300",
    "Layer 2": "bg-indigo-900/40 text-indigo-300",
    "Bitcoin": "bg-orange-900/40 text-orange-300",
    "Solana": "bg-violet-900/40 text-violet-300",
    "Regulation": "bg-red-900/40 text-red-300",
    "Institutional": "bg-yellow-900/40 text-yellow-300",
    "Policy": "bg-pink-900/40 text-pink-300",
    "Markets": "bg-teal-900/40 text-teal-300",
  };

  return (
    <div className="pt-20 sm:pt-24 min-h-screen">
      {/* Hero */}
      <section className="relative py-14 sm:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-border/30">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/60 via-background to-red-950/20 pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-1 flex">
          <div className="flex-1 bg-red-600" />
          <div className="flex-1 bg-white/80" />
          <div className="flex-1 bg-blue-700" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-center gap-3 mb-4">
              <Newspaper className="w-6 h-6 text-primary" />
              <p className="font-inter text-xs tracking-[0.35em] text-primary uppercase">MADE IN USA DIGITAL · Crypto Intelligence</p>
              <Newspaper className="w-6 h-6 text-primary" />
            </div>
            <h1 className="font-cinzel text-4xl sm:text-5xl font-bold text-white mb-3 leading-tight">
              CRYPTO NEWS &<br />MARKET INTELLIGENCE
            </h1>
            <div className="w-32 h-0.5 bg-primary mx-auto mb-4" />
            <p className="font-inter text-sm text-white/60 max-w-2xl mx-auto leading-relaxed">
              AI-curated headlines from CoinDesk, The Block, Bloomberg Crypto, Decrypt, and more —
              filtered for impact on US-based crypto companies and service providers.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter bar */}
      <div className="sticky top-[69px] z-40 bg-background/95 backdrop-blur-md border-b border-border/50 py-2 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto pb-1">
          <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`px-3 py-1 rounded-full text-xs font-inter whitespace-nowrap transition-all shrink-0 ${
                category === cat.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-muted-foreground hover:border-primary/50"
              }`}
            >
              {cat.label}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-2 shrink-0">
            {lastFetched && (
              <span className="font-inter text-xs text-muted-foreground/60 whitespace-nowrap hidden sm:block">
                Updated {lastFetched.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} · refreshes in {Math.floor(nextRefreshIn / 60)}:{String(nextRefreshIn % 60).padStart(2, "0")}
              </span>
            )}
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-card border border-border rounded-lg text-xs font-inter text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors disabled:opacity-40"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="font-cinzel text-sm text-muted-foreground tracking-wider">Fetching latest headlines...</p>
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {articles.map((article, i) => (
                <motion.a
                  key={i}
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group bg-card border border-border/50 rounded-xl p-5 flex flex-col hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/5"
                >
                  {/* Top row */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-inter ${categoryColor[article.category] || "bg-muted text-muted-foreground"}`}>
                        {article.category}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-inter border ${sentimentColor[article.sentiment] || sentimentColor.neutral}`}>
                        {article.sentiment}
                      </span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-primary transition-colors shrink-0 mt-0.5" />
                  </div>

                  {/* Title */}
                  <h3 className="font-cinzel font-bold text-foreground text-sm leading-snug mb-2 group-hover:text-primary transition-colors flex-1">
                    {article.title}
                  </h3>

                  {/* Summary */}
                  <p className="font-inter text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                    {article.summary}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/30">
                    <div className="flex items-center gap-1.5">
                      <Globe className="w-3 h-3 text-muted-foreground/50" />
                      <span className="font-inter text-xs text-muted-foreground font-semibold">{article.source}</span>
                    </div>
                    <span className="font-inter text-xs text-muted-foreground/50">{article.published}</span>
                  </div>
                </motion.a>
              ))}
            </div>

            {articles.length === 0 && !loading && (
              <div className="text-center py-24">
                <Newspaper className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="font-cinzel text-xl text-foreground mb-2">No articles loaded</p>
                <button onClick={handleRefresh} className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-cinzel text-sm tracking-wider mt-4">
                  <RefreshCw className="w-4 h-4" /> Try Again
                </button>
              </div>
            )}

            {/* Disclaimer */}
            <div className="mt-12 pt-8 border-t border-border/30 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 border border-primary/20 rounded-lg">
                <Zap className="w-3.5 h-3.5 text-primary" />
                <p className="font-inter text-xs text-muted-foreground">
                  Headlines powered by AI web search · Sourced from CoinDesk, The Block, Bloomberg Crypto, Decrypt & more ·{" "}
                  <span className="text-primary/70">Not financial advice</span>
                </p>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}