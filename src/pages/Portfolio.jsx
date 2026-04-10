import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Wallet, LogOut, RefreshCw, Sparkles, Loader2, AlertTriangle, Shield, TrendingUp, BarChart2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import WalletConnectModal from "../components/portfolio/WalletConnectModal";
import HoldingsGrid from "../components/portfolio/HoldingsGrid";
import AIResearchPanel from "../components/portfolio/AIResearchPanel";
import { loadWallet, saveWallet, clearWallet } from "../lib/walletStore";
import PriceAlerts from "../components/portfolio/PriceAlerts";
import RebalancingTool from "../components/portfolio/RebalancingTool";
import Watchlist from "../components/portfolio/Watchlist";

// Narrative classification by known tokens
const NARRATIVE_MAP = {
  SOL: "Layer 1", BTC: "Layer 1", ETH: "Layer 1", AVAX: "Layer 1", BNB: "Layer 1", ADA: "Layer 1",
  MATIC: "Layer 2", ARB: "Layer 2", OP: "Layer 2", STRK: "Layer 2",
  USDC: "Stablecoin", USDT: "Stablecoin", DAI: "Stablecoin", BUSD: "Stablecoin",
  UNI: "DeFi", AAVE: "DeFi", RAY: "DeFi", JTO: "DeFi", JUP: "DeFi", ORCA: "DeFi", MNGO: "DeFi",
  BONK: "Meme", WIF: "Meme", POPCAT: "Meme", DOGWIFHAT: "Meme", MYRO: "Meme",
  RENDER: "AI", TAO: "AI", FET: "AI", OCEAN: "AI",
  MANA: "Gaming", AXS: "Gaming", IMX: "Gaming", GALA: "Gaming",
  MAGIC_EDEN: "NFT", TENSOR: "NFT",
  HNT: "Infrastructure", PYTH: "Infrastructure", LINK: "Infrastructure",
};

const RISK_BY_NARRATIVE = {
  "Stablecoin": "low",
  "Layer 1": "medium",
  "Layer 2": "medium",
  "DeFi": "high",
  "Infrastructure": "high",
  "NFT": "extreme",
  "Gaming": "extreme",
  "Meme": "extreme",
  "AI": "high",
};

async function fetchWalletHoldings(address) {
  // Use public Solana RPC for SOL balance
  const solRes = await fetch("https://api.mainnet-beta.solana.com", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0", id: 1,
      method: "getBalance",
      params: [address]
    })
  });
  const solData = await solRes.json();
  const solBalance = (solData?.result?.value || 0) / 1e9;

  // Fetch SOL price
  let solPrice = 0;
  try {
    const priceRes = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd&include_24hr_change=true");
    const priceData = await priceRes.json();
    solPrice = priceData?.solana?.usd || 0;
    const solChange = priceData?.solana?.usd_24h_change || 0;

    const holdings = [];

    if (solBalance > 0.001) {
      holdings.push({
        symbol: "SOL",
        name: "Solana",
        amount: solBalance,
        usdValue: solBalance * solPrice,
        change24h: solChange,
        narrative: "Layer 1",
        risk: "medium",
        mint: "native",
        logoURI: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
      });
    }

    // Try to get SPL tokens from public RPC
    const tokenRes = await fetch("https://api.mainnet-beta.solana.com", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0", id: 1,
        method: "getTokenAccountsByOwner",
        params: [
          address,
          { programId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA" },
          { encoding: "jsonParsed" }
        ]
      })
    });
    const tokenData = await tokenRes.json();
    const accounts = tokenData?.result?.value || [];

    // Collect mints with non-zero balance
    const mints = accounts
      .filter((a) => {
        const amt = a.account?.data?.parsed?.info?.tokenAmount?.uiAmount;
        return amt && amt > 0;
      })
      .slice(0, 20) // limit to 20 tokens
      .map((a) => ({
        mint: a.account?.data?.parsed?.info?.mint,
        amount: a.account?.data?.parsed?.info?.tokenAmount?.uiAmount,
      }));

    // Fetch token metadata from Jupiter token list
    if (mints.length > 0) {
      const mintAddresses = mints.map((m) => m.mint);
      let tokenMeta = {};
      try {
        const metaRes = await fetch("https://token.jup.ag/strict");
        const metaList = await metaRes.json();
        metaList.forEach((t) => { tokenMeta[t.address] = t; });
      } catch {}

      // Get prices from Jupiter
      let prices = {};
      try {
        const pricesRes = await fetch(`https://price.jup.ag/v6/price?ids=${mintAddresses.join(",")}`);
        const pricesData = await pricesRes.json();
        prices = pricesData?.data || {};
      } catch {}

      mints.forEach(({ mint, amount }) => {
        const meta = tokenMeta[mint];
        if (!meta) return;
        const priceInfo = prices[mint];
        const usdValue = priceInfo?.price ? amount * priceInfo.price : 0;
        const symbol = meta.symbol || "???";
        const narrative = NARRATIVE_MAP[symbol] || "Unknown";
        const risk = RISK_BY_NARRATIVE[narrative] || "high";

        holdings.push({
          symbol,
          name: meta.name || symbol,
          amount,
          usdValue,
          change24h: undefined,
          narrative,
          risk,
          mint,
          logoURI: meta.logoURI,
        });
      });
    }

    // Sort by USD value desc
    holdings.sort((a, b) => (b.usdValue || 0) - (a.usdValue || 0));
    return holdings;
  } catch (e) {
    return [{
      symbol: "SOL",
      name: "Solana",
      amount: solBalance,
      usdValue: solBalance * solPrice,
      change24h: 0,
      narrative: "Layer 1",
      risk: "medium",
      mint: "native",
      logoURI: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
    }];
  }
}

async function generatePortfolioRating(holdings) {
  if (!holdings || holdings.length === 0) return null;
  const totalValue = holdings.reduce((s, h) => s + (h.usdValue || 0), 0);
  const summary = holdings.map((h) => `${h.symbol}: $${h.usdValue?.toFixed(2)} (${h.narrative}, ${h.risk} risk)`).join(", ");

  return await base44.integrations.Core.InvokeLLM({
    prompt: `You are a crypto portfolio risk analyst. Analyze this Solana wallet portfolio:

Total Value: $${totalValue.toFixed(2)}
Holdings: ${summary}

Provide:
1. overall_risk_score: 0-100 (100 = most risky)
2. overall_risk_label: "Conservative" | "Moderate" | "Aggressive" | "Degen"
3. diversification_score: 0-100 (100 = perfectly diversified)
4. portfolio_summary: 2-3 sentences overall assessment
5. top_recommendation: single most important action the holder should consider
6. strengths: array of 2-3 portfolio strengths
7. weaknesses: array of 2-3 portfolio weaknesses`,
    response_json_schema: {
      type: "object",
      properties: {
        overall_risk_score: { type: "number" },
        overall_risk_label: { type: "string" },
        diversification_score: { type: "number" },
        portfolio_summary: { type: "string" },
        top_recommendation: { type: "string" },
        strengths: { type: "array", items: { type: "string" } },
        weaknesses: { type: "array", items: { type: "string" } },
      }
    }
  });
}

const RISK_LABEL_COLOR = {
  Conservative: "text-green-400",
  Moderate: "text-blue-300",
  Aggressive: "text-orange-400",
  Degen: "text-red-400",
};

export default function Portfolio() {
  const [wallet, setWallet] = useState(() => loadWallet());
  const [showConnect, setShowConnect] = useState(false);
  const [holdings, setHoldings] = useState([]);
  const [loadingHoldings, setLoadingHoldings] = useState(false);
  const [portfolioRating, setPortfolioRating] = useState(null);
  const [loadingRating, setLoadingRating] = useState(false);
  const [selectedToken, setSelectedToken] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const handler = (e) => setWallet(e.detail);
    window.addEventListener("walletChanged", handler);
    return () => window.removeEventListener("walletChanged", handler);
  }, []);

  useEffect(() => {
    if (wallet && holdings.length === 0) handleConnect(wallet);
  }, []);

  const handleConnect = async (walletInfo) => {
    setShowConnect(false);
    setWallet(walletInfo);
    saveWallet(walletInfo);
    setError("");
    setLoadingHoldings(true);
    let h = [];
    try {
      h = await fetchWalletHoldings(walletInfo.address);
    } catch (err) {
      setError("Failed to load wallet holdings. Please check the address and try again.");
    }
    setHoldings(h);
    setLoadingHoldings(false);

    if (h.length > 0) {
      setLoadingRating(true);
      try {
        const rating = await generatePortfolioRating(h);
        setPortfolioRating(rating);
      } catch {}
      setLoadingRating(false);
    }
  };

  const handleDisconnect = () => {
    clearWallet();
    setWallet(null);
    setHoldings([]);
    setPortfolioRating(null);
    setSelectedToken(null);
  };

  const handleRefresh = () => handleConnect(wallet);

  return (
    <div className="pt-20 sm:pt-24 min-h-screen">
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
                <p className="font-inter text-xs tracking-[0.35em] text-primary uppercase">MADE IN USA DIGITAL · Portfolio Intelligence</p>
              </div>
              <h1 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">
                WALLET PORTFOLIO
              </h1>
              <div className="w-24 h-0.5 bg-primary mb-3" />
              <p className="font-inter text-sm text-white/60 max-w-xl">
                Connect your Solana wallet to track holdings, get AI risk ratings, and research any token.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {wallet ? (
                <>
                  <div className="flex flex-col items-end">
                    <span className="font-inter text-xs text-muted-foreground">Connected via {wallet.walletName}</span>
                    <span className="font-inter text-xs text-primary font-mono">
                      {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                    </span>
                  </div>
                  <button onClick={handleRefresh} disabled={loadingHoldings}
                    className="p-2 bg-card border border-border rounded-lg text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors">
                    <RefreshCw className={`w-4 h-4 ${loadingHoldings ? "animate-spin" : ""}`} />
                  </button>
                  <button onClick={handleDisconnect}
                    className="flex items-center gap-1.5 px-3 py-2 bg-card border border-border rounded-lg font-inter text-xs text-muted-foreground hover:text-red-400 hover:border-red-700/40 transition-colors">
                    <LogOut className="w-3.5 h-3.5" /> Disconnect
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowConnect(true)}
                  className="flex items-center gap-2 px-5 py-3 bg-primary text-primary-foreground rounded-xl font-cinzel text-sm tracking-wider hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                >
                  <Wallet className="w-4 h-4" /> Connect Wallet
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        {!wallet ? (
          /* Not connected state */
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-24">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Wallet className="w-10 h-10 text-primary" />
            </div>
            <h2 className="font-cinzel text-2xl font-bold text-foreground mb-3">Connect Your Solana Wallet</h2>
            <p className="font-inter text-sm text-muted-foreground max-w-md mx-auto mb-8 leading-relaxed">
              Track your crypto holdings, get AI-powered risk ratings for each token, and access deep research on any project — all in one place.
            </p>
            <div className="grid sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-10">
              {[
                { icon: Shield, label: "Risk Ratings", desc: "AI scores every token in your wallet" },
                { icon: Sparkles, label: "AI Research", desc: "Deep analysis on any holding" },
                { icon: TrendingUp, label: "Portfolio Profile", desc: "See your overall risk & diversification" },
              ].map(({ icon: Icon, label, desc }) => (
                <div key={label} className="bg-card border border-border/50 rounded-xl p-4 text-center">
                  <Icon className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="font-cinzel text-sm font-bold text-foreground mb-1">{label}</p>
                  <p className="font-inter text-xs text-muted-foreground">{desc}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowConnect(true)}
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-cinzel text-sm tracking-wider hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
            >
              <Wallet className="w-4 h-4" /> Connect Wallet to Get Started
            </button>
          </motion.div>
        ) : error ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-24">
            <div className="w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="font-cinzel text-xl font-bold text-foreground mb-2">Failed to Load Holdings</h2>
            <p className="font-inter text-sm text-muted-foreground mb-6 max-w-md mx-auto">{error}</p>
            <button onClick={() => handleConnect(wallet)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-cinzel text-sm tracking-wider hover:bg-primary/90 transition-colors">
              <RefreshCw className="w-4 h-4" /> Try Again
            </button>
          </motion.div>
        ) : loadingHoldings ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="font-cinzel text-sm text-muted-foreground tracking-wider">Loading holdings...</p>
            <p className="font-inter text-xs text-muted-foreground/60">Fetching token balances from Solana</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Portfolio Rating Card */}
            {loadingRating ? (
              <div className="bg-card border border-border/50 rounded-xl p-5 flex items-center gap-3">
                <Loader2 className="w-5 h-5 text-primary animate-spin" />
                <span className="font-inter text-sm text-muted-foreground">Generating AI portfolio rating...</span>
              </div>
            ) : portfolioRating ? (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-primary/20 rounded-xl p-5 sm:p-6">
                <div className="flex flex-col sm:flex-row gap-5">
                  <div className="flex items-center gap-4 sm:border-r sm:border-border/50 sm:pr-6">
                    <div className="text-center">
                      <p className="font-inter text-xs text-muted-foreground mb-1">Risk Score</p>
                      <p className={`font-cinzel text-4xl font-bold ${
                        portfolioRating.overall_risk_score >= 80 ? "text-red-400" :
                        portfolioRating.overall_risk_score >= 60 ? "text-orange-400" :
                        portfolioRating.overall_risk_score >= 40 ? "text-yellow-400" : "text-green-400"
                      }`}>{portfolioRating.overall_risk_score}</p>
                      <p className="font-inter text-[10px] text-muted-foreground">/ 100</p>
                    </div>
                    <div className="text-center">
                      <p className="font-inter text-xs text-muted-foreground mb-1">Profile</p>
                      <p className={`font-cinzel text-lg font-bold ${RISK_LABEL_COLOR[portfolioRating.overall_risk_label] || "text-foreground"}`}>
                        {portfolioRating.overall_risk_label}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="font-inter text-xs text-muted-foreground mb-1">Diversification</p>
                      <p className="font-cinzel text-lg font-bold text-blue-300">{portfolioRating.diversification_score}/100</p>
                    </div>
                  </div>

                  <div className="flex-1">
                    <p className="font-inter text-sm text-foreground/80 leading-relaxed mb-3">{portfolioRating.portfolio_summary}</p>
                    {portfolioRating.top_recommendation && (
                      <div className="flex items-start gap-2 px-3 py-2 bg-primary/5 border border-primary/20 rounded-lg">
                        <Sparkles className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                        <p className="font-inter text-xs text-foreground/80"><strong className="text-primary">AI Recommendation:</strong> {portfolioRating.top_recommendation}</p>
                      </div>
                    )}
                  </div>
                </div>

                {(portfolioRating.strengths?.length > 0 || portfolioRating.weaknesses?.length > 0) && (
                  <div className="grid sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-border/30">
                    <div>
                      <p className="font-cinzel text-xs font-bold text-green-400 mb-2">✓ Strengths</p>
                      <ul className="space-y-1">
                        {portfolioRating.strengths.map((s, i) => (
                          <li key={i} className="font-inter text-xs text-muted-foreground flex gap-2"><span className="text-green-400">•</span>{s}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="font-cinzel text-xs font-bold text-red-400 mb-2">✗ Weaknesses</p>
                      <ul className="space-y-1">
                        {portfolioRating.weaknesses.map((w, i) => (
                          <li key={i} className="font-inter text-xs text-muted-foreground flex gap-2"><span className="text-red-400">•</span>{w}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </motion.div>
            ) : null}

            {/* Price Alerts */}
            <PriceAlerts holdings={holdings} />

            {/* AI Rebalancing */}
            <RebalancingTool holdings={holdings} />

            {/* Watchlist */}
            <Watchlist />

            {/* Holdings */}
            <div>
              <h2 className="font-cinzel text-xl font-bold text-foreground mb-5 flex items-center gap-2">
                <Wallet className="w-5 h-5 text-primary" /> Your Holdings
                <span className="font-inter text-sm text-muted-foreground font-normal">· click any token for AI research</span>
              </h2>
              <HoldingsGrid holdings={holdings} onSelectToken={setSelectedToken} />
            </div>
          </div>
        )}
      </section>

      {showConnect && <WalletConnectModal onConnect={handleConnect} onClose={() => setShowConnect(false)} />}
      {selectedToken && <AIResearchPanel token={selectedToken} onClose={() => setSelectedToken(null)} />}
    </div>
  );
}