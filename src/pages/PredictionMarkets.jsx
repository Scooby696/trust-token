import React from "react";
import { motion } from "framer-motion";
import { Target, ExternalLink, Shield, TrendingUp, BarChart2, Zap } from "lucide-react";
import KalshiPanel from "../components/trading/KalshiPanel";
import PredictionAccuracyChart from "../components/trading/PredictionAccuracyChart";

const KALSHI_CATEGORIES = [
  { label: "Bitcoin Markets", url: "https://kalshi.com/markets/kxbtcd", color: "text-orange-400", desc: "BTC price level & ETF markets" },
  { label: "Ethereum Markets", url: "https://kalshi.com/markets/kxeth", color: "text-blue-300", desc: "ETH price & upgrade markets" },
  { label: "All Crypto Markets", url: "https://kalshi.com/browse?q=crypto", color: "text-primary", desc: "Full crypto prediction board" },
  { label: "Fed & Economics", url: "https://kalshi.com/browse?q=fed", color: "text-green-400", desc: "Fed rate & macro events" },
  { label: "Politics & Policy", url: "https://kalshi.com/category/politics", color: "text-red-400", desc: "Policy decisions affecting crypto" },
  { label: "Finance Markets", url: "https://kalshi.com/browse?q=finance", color: "text-cyan-300", desc: "Stocks, indices & financial events" },
];

const POLYMARKET_CATEGORIES = [
  { label: "Bitcoin Markets", url: "https://polymarket.com/predictions/bitcoin", color: "text-orange-400", desc: "BTC price & ETF prediction markets" },
  { label: "Ethereum Markets", url: "https://polymarket.com/predictions/ethereum", color: "text-blue-300", desc: "ETH price & upgrade markets" },
  { label: "All Crypto Markets", url: "https://polymarket.com/predictions/crypto", color: "text-primary", desc: "Full crypto prediction board" },
  { label: "Politics", url: "https://polymarket.com/politics", color: "text-red-400", desc: "Political outcomes & elections" },
  { label: "Economics", url: "https://polymarket.com/predictions/economics", color: "text-green-400", desc: "Macro & economic events" },
  { label: "Science & Tech", url: "https://polymarket.com/predictions/technology", color: "text-cyan-300", desc: "Tech, AI & science outcomes" },
];

const HOW_IT_WORKS = [
  { icon: Target, title: "Markets Open", desc: "Kalshi lists regulated binary questions — e.g. 'Will BTC close above $100k this month?'" },
  { icon: TrendingUp, title: "Price = Probability", desc: "Each contract trades 0–100¢. A price of 65¢ means the market thinks there's a 65% chance of YES." },
  { icon: Zap, title: "Use as Signal", desc: "High YES probabilities on bullish crypto markets signal crowd confidence — a powerful trading edge." },
  { icon: BarChart2, title: "AI Analyzes It", desc: "Our AI reads live Kalshi market data and translates it into actionable Buy/Sell/Hold signals." },
];

export default function PredictionMarkets() {
  return (
    <div className="pt-20 sm:pt-24 min-h-screen">
      {/* Hero */}
      <section className="relative py-14 sm:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-border/30">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/60 via-background to-primary/5 pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-1 flex">
          <div className="flex-1 bg-red-600" />
          <div className="flex-1 bg-white/80" />
          <div className="flex-1 bg-blue-700" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-3">
              <Target className="w-6 h-6 text-primary" />
              <p className="font-inter text-xs tracking-[0.35em] text-primary uppercase">MADE IN USA DIGITAL · Powered by Kalshi</p>
              <span className="px-2 py-0.5 bg-green-900/30 border border-green-700/40 text-green-400 text-[10px] font-cinzel rounded-full">🇺🇸 CFTC-Regulated</span>
            </div>
            <h1 className="font-cinzel text-4xl sm:text-5xl font-bold text-white mb-3 leading-tight">
              USA PREDICTION MARKETS
            </h1>
            <div className="w-24 h-0.5 bg-primary mb-5" />
            <p className="font-inter text-sm sm:text-base text-white/65 max-w-2xl leading-relaxed mb-6">
              Kalshi is America's first federally regulated prediction market exchange, licensed by the CFTC.
              Trade on real-world outcomes — and use crowd probability data as a powerful signal for your crypto strategy.
            </p>

            <div className="flex flex-wrap gap-3">
              <a href="https://kalshi.com/browse" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-3 bg-primary text-primary-foreground rounded-xl font-cinzel text-sm tracking-wider hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                <ExternalLink className="w-4 h-4" /> Open Kalshi Markets
              </a>
              <a href="https://kalshi.com" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-3 bg-card border border-border text-muted-foreground rounded-xl font-cinzel text-sm tracking-wider hover:border-primary/40 hover:text-primary transition-colors">
                Learn How It Works
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">

        {/* Trust badges */}
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { icon: Shield, label: "CFTC Regulated", desc: "Licensed US federal exchange — not offshore", color: "text-green-400", bg: "bg-green-900/20 border-green-700/30" },
            { icon: Target, label: "Binary Contracts", desc: "Simple YES/NO markets on real-world outcomes", color: "text-primary", bg: "bg-primary/10 border-primary/20" },
            { icon: BarChart2, label: "Real-Time Signals", desc: "Market prices reflect collective crowd intelligence", color: "text-blue-300", bg: "bg-blue-900/20 border-blue-700/30" },
          ].map(({ icon: Icon, label, desc, color, bg }) => (
            <motion.div key={label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className={`flex items-start gap-3 p-4 rounded-xl border ${bg}`}>
              <Icon className={`w-5 h-5 ${color} shrink-0 mt-0.5`} />
              <div>
                <p className={`font-cinzel text-sm font-bold ${color}`}>{label}</p>
                <p className="font-inter text-xs text-muted-foreground mt-0.5 leading-relaxed">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* How It Works */}
        <div>
          <h2 className="font-cinzel text-xl font-bold text-foreground mb-5">How to Use Prediction Markets as a Trading Edge</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {HOW_IT_WORKS.map(({ icon: Icon, title, desc }, i) => (
              <motion.div key={title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border border-border/50 rounded-xl p-4 text-center">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <p className="font-cinzel text-sm font-bold text-foreground mb-1.5">{title}</p>
                <p className="font-inter text-xs text-muted-foreground leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* AI Analyzer Panel */}
        <div>
          <h2 className="font-cinzel text-xl font-bold text-foreground mb-3 flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" /> AI Market Analyzer
          </h2>
          <p className="font-inter text-sm text-muted-foreground mb-4">
            Load live Kalshi crypto markets below, then click <strong className="text-foreground">Generate AI Trading Signal</strong> to get an AI-driven interpretation of what the prediction markets are telling you.
          </p>
          <KalshiPanel defaultOpen />
        </div>

        {/* Accuracy Visualizer */}
        <div>
          <h2 className="font-cinzel text-xl font-bold text-foreground mb-3 flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-primary" /> Historical Accuracy Visualizer
          </h2>
          <p className="font-inter text-sm text-muted-foreground mb-4">
            See how past Kalshi crypto market resolutions lined up with actual price movements — and let AI score the accuracy.
          </p>
          <PredictionAccuracyChart />
        </div>

        {/* Browse by category */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-cinzel text-xl font-bold text-foreground">Browse Prediction Markets</h2>
          </div>

          {/* Kalshi */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="font-cinzel text-sm font-bold text-primary">🇺🇸 Kalshi</span>
              <span className="px-2 py-0.5 bg-green-900/20 border border-green-700/30 text-green-400 text-[10px] font-inter rounded-full">CFTC-Regulated</span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {KALSHI_CATEGORIES.map(({ label, url, color, desc }) => (
                <a key={label} href={url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 bg-card border border-border/50 rounded-xl hover:border-primary/40 transition-all group">
                  <div>
                    <p className={`font-cinzel text-sm font-bold ${color} group-hover:underline`}>{label}</p>
                    <p className="font-inter text-xs text-muted-foreground mt-0.5">{desc}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                </a>
              ))}
            </div>
          </div>

          {/* Polymarket */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="font-cinzel text-sm font-bold text-blue-300">🌐 Polymarket</span>
              <span className="px-2 py-0.5 bg-blue-900/20 border border-blue-700/30 text-blue-300 text-[10px] font-inter rounded-full">Global · Crypto-Powered</span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {POLYMARKET_CATEGORIES.map(({ label, url, color, desc }) => (
                <a key={label} href={url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 bg-card border border-border/50 rounded-xl hover:border-blue-500/40 transition-all group">
                  <div>
                    <p className={`font-cinzel text-sm font-bold ${color} group-hover:underline`}>{label}</p>
                    <p className="font-inter text-xs text-muted-foreground mt-0.5">{desc}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-blue-400 transition-colors shrink-0" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="px-4 py-4 bg-orange-900/10 border border-orange-800/20 rounded-xl">
          <p className="font-inter text-xs text-muted-foreground/70 leading-relaxed">
            ⚠️ <strong className="text-orange-400/80">Disclaimer:</strong> Prediction market prices represent crowd-sourced probability estimates and do not constitute financial advice. Trading on Kalshi involves risk of loss. MADE IN USA DIGITAL is not affiliated with Kalshi and provides these tools for informational purposes only. Always do your own research.
          </p>
        </div>
      </div>
    </div>
  );
}