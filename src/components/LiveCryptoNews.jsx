import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Newspaper, ExternalLink, RefreshCw, Loader2, TrendingUp, TrendingDown, Minus, Clock } from "lucide-react";
import { base44 } from "@/api/base44Client";

const CATEGORY_COLORS = {
  Bitcoin: "bg-orange-900/40 text-orange-300 border-orange-800/30",
  Ethereum: "bg-blue-900/40 text-blue-300 border-blue-800/30",
  Solana: "bg-purple-900/40 text-purple-300 border-purple-800/30",
  DeFi: "bg-green-900/40 text-green-300 border-green-800/30",
  Regulation: "bg-red-900/40 text-red-300 border-red-800/30",
  NFT: "bg-pink-900/40 text-pink-300 border-pink-800/30",
  Macro: "bg-yellow-900/40 text-yellow-300 border-yellow-800/30",
  Altcoins: "bg-cyan-900/40 text-cyan-300 border-cyan-800/30",
  General: "bg-muted text-muted-foreground border-border/30",
};

const SENTIMENT_CONFIG = {
  bullish: { label: "Bullish", icon: TrendingUp, color: "text-green-400" },
  bearish: { label: "Bearish", icon: TrendingDown, color: "text-red-400" },
  neutral: { label: "Neutral", icon: Minus, color: "text-muted-foreground" },
};

const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

async function fetchNews() {
  return await base44.integrations.Core.InvokeLLM({
    prompt: `You are a crypto and blockchain news aggregator. Search the web RIGHT NOW for the 8 most recent and impactful news stories in the crypto/blockchain/DeFi space from the last 24-48 hours.

For each story return:
- title: compelling headline (max 90 chars)
- source: publication name (e.g. CoinDesk, The Block, Decrypt, Reuters, Bloomberg Crypto)
- summary: 1-2 sentence summary (max 180 chars)
- url: real URL to the article or publication homepage
- category: one of [Bitcoin, Ethereum, Solana, DeFi, Regulation, NFT, Macro, Altcoins, General]
- sentiment: one of [bullish, bearish, neutral]
- time_ago: approximate like "1h ago", "3h ago", "Today", "Yesterday"

Focus on: price moves, regulatory developments, protocol updates, institutional news, on-chain data, macro impact on crypto.`,
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
              time_ago: { type: "string" },
            },
          },
        },
        market_mood: { type: "string" },
      },
    },
  });
}

export default function LiveCryptoNews() {
  const [articles, setArticles] = useState([]);
  const [marketMood, setMarketMood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    const result = await fetchNews();
    setArticles(result?.articles || []);
    setMarketMood(result?.market_mood || null);
    setLastUpdated(new Date());
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(() => load(true), REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [load]);

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 border-t border-border/30">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="font-inter text-xs text-red-400 uppercase tracking-[0.25em] font-semibold">Live</span>
              </div>
              <p className="font-inter text-xs tracking-[0.3em] text-primary uppercase">· Blockchain & Crypto</p>
            </div>
            <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-foreground">Latest Industry News</h2>
            {marketMood && (
              <p className="font-inter text-xs text-muted-foreground mt-1">Market mood: <span className="text-primary font-semibold">{marketMood}</span></p>
            )}
          </div>
          <div className="flex items-center gap-3">
            {lastUpdated && (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span className="font-inter text-[10px]">Updated {lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
              </div>
            )}
            <button
              onClick={() => load(true)}
              disabled={loading || refreshing}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-card border border-border rounded-lg text-xs font-inter text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Articles */}
        {loading ? (
          <div className="flex items-center justify-center py-16 gap-3">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
            <span className="font-inter text-sm text-muted-foreground">Fetching latest news...</span>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={lastUpdated?.getTime()}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {articles.map((article, i) => {
                const sentiment = SENTIMENT_CONFIG[article.sentiment] || SENTIMENT_CONFIG.neutral;
                const SentimentIcon = sentiment.icon;
                const catColor = CATEGORY_COLORS[article.category] || CATEGORY_COLORS.General;
                return (
                  <motion.a
                    key={i}
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="group bg-card border border-border/50 rounded-xl p-4 flex flex-col hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/5"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-inter border ${catColor}`}>
                        {article.category}
                      </span>
                      <div className="flex items-center gap-1">
                        <SentimentIcon className={`w-3 h-3 ${sentiment.color}`} />
                        <ExternalLink className="w-3 h-3 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                      </div>
                    </div>

                    <h3 className="font-cinzel font-bold text-foreground text-sm leading-snug mb-2 group-hover:text-primary transition-colors flex-1 line-clamp-3">
                      {article.title}
                    </h3>

                    <p className="font-inter text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-2">
                      {article.summary}
                    </p>

                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/30">
                      <span className="font-inter text-xs font-semibold text-muted-foreground truncate">{article.source}</span>
                      <span className="font-inter text-[10px] text-muted-foreground/50 shrink-0 ml-2">{article.time_ago}</span>
                    </div>
                  </motion.a>
                );
              })}
            </motion.div>
          </AnimatePresence>
        )}

        <p className="font-inter text-[10px] text-muted-foreground/40 text-center mt-6">
          Auto-refreshes every 5 minutes · AI-curated from live web sources · Not financial advice
        </p>
      </div>
    </section>
  );
}