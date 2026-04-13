import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import HeroSection from "../components/HeroSection";
import LatestUpdates from "../components/LatestUpdates";
import USAFactsFigures from "../components/USAFactsFigures";
import WalletConnectHero from "../components/portfolio/WalletConnectHero";
import GlobalPartnersSection from "../components/GlobalPartnersSection";

const BANKING_QUOTES = [
  { quote: "Banking establishments are more dangerous than standing armies.", author: "Thomas Jefferson", title: "3rd President" },
  { quote: "Paper money has had the effect in your state that it will ever have, to ruin commerce, oppress the honest, and open the door to every species of fraud.", author: "George Washington", title: "1st President" },
  { quote: "All the perplexities, confusion and distress in America arise from the downright ignorance of the nature of coin, credit and circulation.", author: "John Adams", title: "2nd President" },
];

export default function Home() {
  return (
    <div>
      <HeroSection />

      {/* Founding Fathers Warning — compact */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border/30">
        <div className="text-center mb-6">
          <p className="font-inter text-xs tracking-[0.3em] text-red-400 uppercase mb-2">⚠️ They Warned Us</p>
          <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-foreground">Founding Fathers on Central Banking</h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-4 mb-5">
          {BANKING_QUOTES.map((q, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="bg-card border border-red-700/30 rounded-lg p-4 hover:border-red-500/50 transition-all">
              <p className="font-cinzel text-2xl text-red-400/40 leading-none mb-2">"</p>
              <p className="font-inter text-xs text-foreground/80 italic leading-relaxed mb-3">{q.quote}</p>
              <div className="pt-2 border-t border-border/30">
                <p className="font-cinzel text-xs font-semibold text-primary">{q.author}</p>
                <p className="font-inter text-[10px] text-muted-foreground mt-0.5">{q.title}</p>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="text-center">
          <Link to="/quotes" className="inline-flex items-center gap-2 font-inter text-sm text-primary hover:text-primary/80 tracking-wider transition-colors">
            View All Founding Fathers Quotes <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Marketplace + Staking + KYDSOLID — 3 compact cards */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border/30">
        <div className="grid sm:grid-cols-3 gap-5">

          {/* Marketplace */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="relative rounded-2xl overflow-hidden border border-primary/30 bg-gradient-to-br from-blue-950 via-card to-red-950/40 p-6 flex flex-col">
            <div className="absolute top-0 left-0 right-0 h-1 flex">
              <div className="flex-1 bg-red-600" /><div className="flex-1 bg-white/80" /><div className="flex-1 bg-blue-700" />
            </div>
            <p className="font-inter text-[10px] tracking-[0.3em] text-primary uppercase mb-1 mt-1">Made in USA Digital</p>
            <h3 className="font-cinzel text-xl font-bold text-white mb-2">MADEINUSA MARKETPLACE</h3>
            <p className="font-inter text-xs text-white/60 leading-relaxed mb-4 flex-1">
              KYC-verified American-made goods & services. 100+ companies. AI-powered shopping.
            </p>
            <div className="flex flex-col gap-2">
              <Link to="/hundred" className="inline-flex items-center gap-2 font-cinzel tracking-wider text-xs px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                🛒 Shop 100 Companies <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link to="/apply" className="inline-flex items-center gap-2 font-cinzel tracking-wider text-xs px-4 py-2 border border-white/20 text-white rounded-lg hover:bg-white/10 transition-colors">
                Apply to List Your Business
              </Link>
            </div>
          </motion.div>

          {/* Staking */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="relative rounded-2xl overflow-hidden border-2 border-primary/50 bg-gradient-to-br from-primary/10 via-card to-blue-950/60 p-6 flex flex-col">
            <div className="absolute top-0 left-0 right-0 h-1 flex">
              <div className="flex-1 bg-red-600" /><div className="flex-1 bg-white/80" /><div className="flex-1 bg-blue-700" />
            </div>
            <div className="flex items-center gap-2 mb-2 mt-1">
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 bg-red-600 text-white rounded-full text-[10px] font-cinzel font-bold tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span> LIVE NOW
              </span>
            </div>
            <p className="font-inter text-[10px] tracking-[0.3em] text-primary uppercase mb-1">TRUST TOKEN · Streamflow</p>
            <h3 className="font-cinzel text-xl font-bold text-white mb-2">STAKE TRUST · 30% APY</h3>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {[["30%", "APY"], ["Daily", "Rewards"], ["3 MO", "Lock"], ["50%", "Max Supply"]].map(([v, l]) => (
                <div key={l} className="bg-background/50 border border-primary/20 rounded-lg p-2 text-center">
                  <p className="font-cinzel text-base font-bold text-primary">{v}</p>
                  <p className="font-inter text-[10px] text-muted-foreground">{l}</p>
                </div>
              ))}
            </div>
            <a href="https://app.streamflow.finance/staking?search=Trust" target="_blank" rel="noopener noreferrer"
              className="mt-auto inline-flex items-center justify-center gap-2 font-cinzel tracking-wider text-xs px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-foreground animate-ping"></span>
              Stake TRUST Now
            </a>
          </motion.div>

          {/* KYDSOLID */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
            className="relative rounded-2xl overflow-hidden border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-blue-950/60 p-6 flex flex-col">
            <div className="absolute top-0 left-0 right-0 h-1 flex">
              <div className="flex-1 bg-red-600" /><div className="flex-1 bg-white/80" /><div className="flex-1 bg-blue-700" />
            </div>
            <div className="flex items-center gap-2 mb-2 mt-1">
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 bg-primary/20 border border-primary/50 text-primary rounded-full text-[10px] font-cinzel font-bold tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span> COMING SOON
              </span>
            </div>
            <p className="font-inter text-[10px] tracking-[0.3em] text-primary uppercase mb-1">Made in USA Digital · Launchpad</p>
            <h3 className="font-cinzel text-xl font-bold text-white mb-2">KYDSOLID <span className="text-primary">(SOLID)</span></h3>
            <p className="font-inter text-xs text-white/60 leading-relaxed mb-4 flex-1">
              The next launchpad from MADE IN USA DIGITAL. Preview the platform and be first in line at launch.
            </p>
            <a href="https://kydsolidbymadeintheusadigital.base44.app/" target="_blank" rel="noopener noreferrer"
              className="mt-auto inline-flex items-center justify-center gap-2 font-cinzel tracking-wider text-xs px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-foreground animate-ping inline-block"></span>
              Preview KYDSOLID →
            </a>
          </motion.div>
        </div>
      </section>

      {/* Prediction Markets — compact */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border/30">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
          <div>
            <p className="font-inter text-xs tracking-[0.3em] text-primary uppercase mb-1">Live Markets</p>
            <h2 className="font-cinzel text-2xl font-bold text-foreground">Prediction Markets</h2>
          </div>
          <Link to="/prediction-markets" className="inline-flex items-center gap-2 font-inter text-sm text-primary hover:text-primary/80 tracking-wider transition-colors shrink-0">
            AI Market Analyzer <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-card border border-primary/20 rounded-xl p-4 hover:border-primary/40 transition-all">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-cinzel text-base font-bold text-primary">🇺🇸 Kalshi</span>
              <span className="px-2 py-0.5 bg-green-900/20 border border-green-700/30 text-green-400 text-[10px] font-inter rounded-full">CFTC-Regulated</span>
            </div>
            <p className="font-inter text-xs text-muted-foreground mb-3">America's first federally regulated prediction market. Trade binary contracts on crypto, politics & more.</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {[["Bitcoin", "https://kalshi.com/markets/kxbtcd"], ["Ethereum", "https://kalshi.com/markets/kxeth"], ["All Crypto", "https://kalshi.com/browse?q=crypto"]].map(([label, url]) => (
                <a key={label} href={url} target="_blank" rel="noopener noreferrer"
                  className="px-2 py-1 bg-background border border-border rounded-lg text-xs font-inter text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors">{label}</a>
              ))}
            </div>
            <a href="https://kalshi.com/browse" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-cinzel tracking-wider text-xs px-3 py-1.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
              Open Kalshi →
            </a>
          </div>
          <div className="bg-card border border-blue-700/30 rounded-xl p-4 hover:border-blue-500/50 transition-all">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-cinzel text-base font-bold text-blue-300">🌐 Polymarket</span>
              <span className="px-2 py-0.5 bg-blue-900/20 border border-blue-700/30 text-blue-300 text-[10px] font-inter rounded-full">Global · Crypto-Powered</span>
            </div>
            <p className="font-inter text-xs text-muted-foreground mb-3">The world's largest prediction market. Trade on crypto, politics, sports & global events with on-chain settlement.</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {[["Bitcoin", "https://polymarket.com/predictions/bitcoin"], ["Ethereum", "https://polymarket.com/predictions/ethereum"], ["All Crypto", "https://polymarket.com/predictions/crypto"]].map(([label, url]) => (
                <a key={label} href={url} target="_blank" rel="noopener noreferrer"
                  className="px-2 py-1 bg-background border border-border rounded-lg text-xs font-inter text-muted-foreground hover:text-blue-300 hover:border-blue-700/40 transition-colors">{label}</a>
              ))}
            </div>
            <a href="https://polymarket.com" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-cinzel tracking-wider text-xs px-3 py-1.5 bg-blue-700 text-white rounded-lg hover:bg-blue-600 transition-colors">
              Open Polymarket →
            </a>
          </div>
        </div>
      </section>

      <GlobalPartnersSection compact />

      <WalletConnectHero />

      <LatestUpdates />

      <USAFactsFigures />

      {/* Footer CTA */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 border-t border-border/30 text-center">
        <p className="font-inter text-xs tracking-[0.3em] text-primary uppercase mb-2">Questions?</p>
        <p className="font-inter text-sm text-muted-foreground">
          Contact us at{" "}
          <a href="mailto:trusttokenbymadeinusadigital@gmail.com" className="text-primary hover:text-primary/80 transition-colors">
            trusttokenbymadeinusadigital@gmail.com
          </a>
        </p>
      </section>
    </div>
  );
}