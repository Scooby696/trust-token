import React, { useState, useEffect, useRef } from "react";
import { loadWallet, saveWallet, clearWallet } from "../lib/walletStore";
import KalshiPanel from "../components/trading/KalshiPanel";
import { motion } from "framer-motion";
import {
  Wallet, Zap, ExternalLink, RefreshCw, TrendingUp, BarChart2,
  ChevronDown, Globe, Loader2, AlertCircle, X
} from "lucide-react";

const WALLETS = [
  { id: "phantom", name: "Phantom", check: () => window?.solana?.isPhantom && window.solana },
  { id: "solflare", name: "Solflare", check: () => window?.solflare?.isSolflare && window.solflare },
  { id: "backpack", name: "Backpack", check: () => window?.xnft?.solana },
];

const FEATURED_PAIRS = [
  { from: "SOL", to: "USDC", label: "SOL → USDC" },
  { from: "USDC", to: "SOL", label: "USDC → SOL" },
  { from: "SOL", to: "BONK", label: "SOL → BONK" },
  { from: "SOL", to: "JUP", label: "SOL → JUP" },
  { from: "USDC", to: "USDT", label: "USDC → USDT" },
];

// Token mint addresses for Jupiter
const TOKEN_MINTS = {
  SOL: "So11111111111111111111111111111111111111112",
  USDC: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  BONK: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
  JUP: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
  USDT: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
  WIF: "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm",
  RAY: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
};

export default function TradingTerminal() {
  const terminalRef = useRef(null);
  const [terminalLoaded, setTerminalLoaded] = useState(false);
  const [terminalError, setTerminalError] = useState(false);
  const [wallet, setWallet] = useState(() => loadWallet());
  const [connecting, setConnecting] = useState(false);
  const [connError, setConnError] = useState("");
  const [showWalletMenu, setShowWalletMenu] = useState(false);
  const [selectedPair, setSelectedPair] = useState(FEATURED_PAIRS[0]);
  const [solPrice, setSolPrice] = useState(null);
  const [priceLoading, setPriceLoading] = useState(true);

  // Load Jupiter Terminal script
  useEffect(() => {
    if (document.getElementById("jupiter-terminal-script")) {
      initTerminal();
      return;
    }
    const script = document.createElement("script");
    script.id = "jupiter-terminal-script";
    script.src = "https://terminal.jup.ag/main-v3.js";
    script.async = true;
    script.onload = () => initTerminal();
    script.onerror = () => setTerminalError(true);
    document.head.appendChild(script);

    return () => {};
  }, []);

  const initTerminal = () => {
    setTimeout(() => {
      if (!window.Jupiter) { setTerminalError(true); return; }
      try {
        window.Jupiter.init({
          displayMode: "integrated",
          integratedTargetId: "jupiter-terminal-container",
          endpoint: "https://rpc.ankr.com/solana",
          formProps: {
            initialInputMint: TOKEN_MINTS[selectedPair.from] || TOKEN_MINTS.SOL,
            initialOutputMint: TOKEN_MINTS[selectedPair.to] || TOKEN_MINTS.USDC,
          },
          defaultExplorer: "Solscan",
          theme: "dark",
        });
        setTerminalLoaded(true);
      } catch (e) {
        setTerminalError(true);
      }
    }, 800);
  };

  // Re-init terminal when pair changes
  const switchPair = (pair) => {
    setSelectedPair(pair);
    if (!window.Jupiter) return;
    try {
      window.Jupiter.init({
        displayMode: "integrated",
        integratedTargetId: "jupiter-terminal-container",
        endpoint: "https://rpc.ankr.com/solana",
        formProps: {
          initialInputMint: TOKEN_MINTS[pair.from] || TOKEN_MINTS.SOL,
          initialOutputMint: TOKEN_MINTS[pair.to] || TOKEN_MINTS.USDC,
        },
        defaultExplorer: "Solscan",
        theme: "dark",
      });
    } catch {}
  };

  // Fetch SOL price
  useEffect(() => {
    const fetchPrice = async () => {
      setPriceLoading(true);
      try {
        const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=solana,bitcoin,ethereum,jupiter-exchange-solana,bonk&vs_currencies=usd&include_24hr_change=true");
        const data = await res.json();
        setSolPrice(data);
      } catch {}
      setPriceLoading(false);
    };
    fetchPrice();
    const interval = setInterval(fetchPrice, 30000);
    return () => clearInterval(interval);
  }, []);

  // Connect wallet
  useEffect(() => {
    const handler = (e) => setWallet(e.detail);
    window.addEventListener("walletChanged", handler);
    return () => window.removeEventListener("walletChanged", handler);
  }, []);

  const connectWallet = async (walletDef) => {
    setConnecting(true);
    setConnError("");
    setShowWalletMenu(false);

    const provider = walletDef.check();
    if (!provider) {
      setConnError(`${walletDef.name} not detected. Please install the browser extension.`);
      setConnecting(false);
      return;
    }

    let resp;
    try {
      resp = await provider.connect();
    } catch (err) {
      setConnError(err?.code === 4001 || err?.message?.includes("rejected")
        ? "Connection rejected. Please approve in your wallet."
        : err?.message || "Failed to connect.");
      setConnecting(false);
      return;
    }
    const address = resp.publicKey.toString();
    const info = { address, walletName: walletDef.name };
    saveWallet(info);
    setWallet({ address, name: walletDef.name, walletName: walletDef.name, provider });

    // Pass wallet to Jupiter terminal if loaded
    if (window.Jupiter) {
      try {
        window.Jupiter.init({
          displayMode: "integrated",
          integratedTargetId: "jupiter-terminal-container",
          endpoint: "https://solana.publicnode.com",
          formProps: {
            initialInputMint: TOKEN_MINTS[selectedPair.from],
            initialOutputMint: TOKEN_MINTS[selectedPair.to],
          },
          defaultExplorer: "Solscan",
          theme: "dark",
          passthroughWalletContextState: {
            wallet: {
                  adapter: {
                    name: walletDef.name,
                    url: "",
                    icon: "",
                    supportedTransactionVersions: new Set(["legacy", 0]),
                    readyState: "Installed",
                    publicKey: resp?.publicKey,
                    connected: true,
                    signTransaction: provider.signTransaction?.bind(provider),
                    signAllTransactions: provider.signAllTransactions?.bind(provider),
                  },
                  readyState: "Installed",
                },
            wallets: [],
            connecting: false,
            connected: true,
            disconnecting: false,
            select: () => {},
            connect: () => {},
            disconnect: () => {},
            sendTransaction: async (tx, conn, opts) => provider.signAndSendTransaction(tx, opts),
          },
        });
      } catch {}
    }
    setConnecting(false);
  };

  const disconnectWallet = async () => {
    if (wallet?.provider?.disconnect) await wallet.provider.disconnect();
    clearWallet();
    setWallet(null);
  };

  const PRICE_TICKERS = [
    { id: "solana", label: "SOL", gecko_id: "solana" },
    { id: "bitcoin", label: "BTC", gecko_id: "bitcoin" },
    { id: "ethereum", label: "ETH", gecko_id: "ethereum" },
    { id: "jupiter-exchange-solana", label: "JUP", gecko_id: "jupiter-exchange-solana" },
    { id: "bonk", label: "BONK", gecko_id: "bonk" },
  ];

  return (
    <div className="pt-20 sm:pt-24 min-h-screen">
      {/* Hero Header */}
      <section className="relative py-8 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-border/30">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/60 via-background to-purple-950/30 pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-1 flex">
          <div className="flex-1 bg-red-600" />
          <div className="flex-1 bg-white/80" />
          <div className="flex-1 bg-blue-700" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Title row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <Zap className="w-5 h-5 text-primary" />
                <p className="font-inter text-xs tracking-[0.35em] text-primary uppercase">MADE IN USA DIGITAL · Powered by Jupiter</p>
              </div>
              <h1 className="font-cinzel text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                DIGITAL TRADING TERMINAL
              </h1>
            </div>

            {/* Wallet button */}
            <div className="relative">
              {wallet ? (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 px-3 py-2 bg-green-900/20 border border-green-700/40 rounded-lg">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="font-inter text-xs text-green-300 font-semibold">{wallet.name}</span>
                    <span className="font-inter text-xs text-muted-foreground font-mono">
                      {wallet.address.slice(0, 4)}...{wallet.address.slice(-4)}
                    </span>
                  </div>
                  <button onClick={disconnectWallet}
                    className="p-2 bg-card border border-border rounded-lg text-muted-foreground hover:text-red-400 hover:border-red-700/40 transition-colors">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div>
                  <button
                    onClick={() => setShowWalletMenu((o) => !o)}
                    disabled={connecting}
                    className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-cinzel text-sm tracking-wider hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 disabled:opacity-60"
                  >
                    {connecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wallet className="w-4 h-4" />}
                    {connecting ? "Connecting..." : "Connect Wallet"}
                    {!connecting && <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  {showWalletMenu && (
                    <div className="absolute right-0 mt-2 w-52 bg-card border border-border/60 rounded-xl shadow-xl overflow-hidden z-50">
                      {WALLETS.map((w) => (
                        <button key={w.id} onClick={() => connectWallet(w)}
                          className="w-full flex items-center gap-3 px-4 py-3 text-left font-inter text-sm text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors border-b border-border/30 last:border-0">
                          <Wallet className="w-4 h-4" /> {w.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Price ticker */}
          <div className="flex flex-wrap gap-3">
            {PRICE_TICKERS.map(({ id, label, gecko_id }) => {
              const data = solPrice?.[gecko_id];
              const change = data?.usd_24h_change;
              return (
                <div key={id} className="flex items-center gap-2 px-3 py-1.5 bg-card/60 border border-border/40 rounded-lg">
                  <span className="font-cinzel text-xs font-bold text-foreground">{label}</span>
                  {priceLoading || !data ? (
                    <span className="font-inter text-xs text-muted-foreground">—</span>
                  ) : (
                    <>
                      <span className="font-inter text-xs text-foreground font-semibold">
                        ${data.usd?.toLocaleString(undefined, { maximumFractionDigits: label === "BONK" ? 8 : 2 })}
                      </span>
                      {change !== undefined && (
                        <span className={`font-inter text-[10px] font-semibold ${change >= 0 ? "text-green-400" : "text-red-400"}`}>
                          {change >= 0 ? "+" : ""}{change.toFixed(2)}%
                        </span>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Connection error */}
      {connError && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="flex items-center gap-2 px-4 py-3 bg-red-900/20 border border-red-700/30 rounded-lg">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <p className="font-inter text-sm text-red-300 flex-1">{connError}</p>
            <div className="flex gap-3">
              <a href="https://phantom.app" target="_blank" rel="noopener noreferrer"
                className="font-inter text-xs text-primary hover:underline flex items-center gap-1">
                Get Phantom <ExternalLink className="w-3 h-3" />
              </a>
              <a href="https://solflare.com" target="_blank" rel="noopener noreferrer"
                className="font-inter text-xs text-primary hover:underline flex items-center gap-1">
                Get Solflare <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <button onClick={() => setConnError("")}><X className="w-4 h-4 text-muted-foreground" /></button>
          </div>
        </div>
      )}

      {/* Main layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid lg:grid-cols-3 gap-6">

          {/* Terminal — takes 2 cols */}
          <div className="lg:col-span-2 space-y-4">
            {/* Quick pair buttons */}
            <div className="flex flex-wrap gap-2">
              {FEATURED_PAIRS.map((pair) => (
                <button key={pair.label} onClick={() => switchPair(pair)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-inter transition-all border ${
                    selectedPair.label === pair.label
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card border-border text-muted-foreground hover:border-primary/50 hover:text-primary"
                  }`}>
                  {pair.label}
                </button>
              ))}
            </div>

            {/* Jupiter Terminal embed */}
            <div className="bg-card border border-border/50 rounded-2xl overflow-hidden min-h-[580px] relative">
              {!terminalLoaded && !terminalError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10 bg-card">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  <p className="font-cinzel text-sm text-muted-foreground tracking-wider">Loading Jupiter Terminal...</p>
                  <p className="font-inter text-xs text-muted-foreground/60">Best DEX aggregator on Solana</p>
                </div>
              )}

              {terminalError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10 bg-card p-8">
                  <AlertCircle className="w-12 h-12 text-orange-400" />
                  <div className="text-center">
                    <p className="font-cinzel text-lg font-bold text-foreground mb-2">Terminal Loading Issue</p>
                    <p className="font-inter text-sm text-muted-foreground mb-6">
                      Jupiter Terminal could not be loaded. You can trade directly on Jupiter's platform.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <a href="https://jup.ag/swap/SOL-USDC" target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-cinzel text-sm tracking-wider hover:bg-primary/90 transition-colors">
                      <ExternalLink className="w-4 h-4" /> Open Jupiter Swap
                    </a>
                    <a href="https://raydium.io/swap/" target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 px-6 py-3 bg-card border border-border text-muted-foreground rounded-xl font-cinzel text-sm tracking-wider hover:border-primary/40 hover:text-primary transition-colors">
                      <ExternalLink className="w-4 h-4" /> Open Raydium
                    </a>
                  </div>
                  <div className="grid grid-cols-2 gap-3 w-full max-w-sm mt-2">
                    {FEATURED_PAIRS.map((pair) => (
                      <a key={pair.label}
                        href={`https://jup.ag/swap/${pair.from}-${pair.to}`}
                        target="_blank" rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 px-3 py-2 bg-background border border-border rounded-lg text-xs font-inter text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors">
                        <TrendingUp className="w-3 h-3" /> {pair.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div
                id="jupiter-terminal-container"
                ref={terminalRef}
                className="w-full"
                style={{ minHeight: "580px" }}
              />
            </div>

            {/* Powered by */}
            <div className="flex items-center justify-between">
              <p className="font-inter text-xs text-muted-foreground/60">
                Swaps powered by{" "}
                <a href="https://jup.ag" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Jupiter</a>
                {" "}· Best price aggregation across all Solana DEXes
              </p>
              <a href="https://jup.ag" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1 font-inter text-xs text-primary hover:underline">
                Full Jupiter <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-5">
            {/* Market Links */}
            <div className="bg-card border border-border/50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Globe className="w-4 h-4 text-primary" />
                <h3 className="font-cinzel font-bold text-foreground text-sm">Trading Platforms</h3>
              </div>
              <div className="space-y-2">
                {[
                  { label: "Jupiter Swap", url: "https://jup.ag/swap/SOL-USDC", desc: "Best DEX aggregator", color: "text-green-400" },
                  { label: "Jupiter Perps", url: "https://jup.ag/perps", desc: "Perpetual futures", color: "text-blue-300" },
                  { label: "Raydium", url: "https://raydium.io/swap/", desc: "AMM + order book", color: "text-cyan-300" },
                  { label: "Orca", url: "https://www.orca.so/", desc: "Whirlpool DEX", color: "text-purple-300" },
                  { label: "Drift Protocol", url: "https://app.drift.trade/", desc: "Perps & spot", color: "text-orange-400" },
                  { label: "Birdeye", url: "https://birdeye.so/", desc: "Charts & analytics", color: "text-yellow-400" },
                  { label: "DexScreener", url: "https://dexscreener.com/solana", desc: "Live pair tracking", color: "text-pink-400" },
                ].map(({ label, url, desc, color }) => (
                  <a key={label} href={url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-between p-2.5 bg-background border border-border/40 rounded-lg hover:border-primary/40 transition-all group">
                    <div>
                      <p className={`font-inter text-xs font-semibold ${color} group-hover:underline`}>{label}</p>
                      <p className="font-inter text-[10px] text-muted-foreground">{desc}</p>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </a>
                ))}
              </div>
            </div>

            {/* Wallet apps */}
            <div className="bg-card border border-border/50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Wallet className="w-4 h-4 text-primary" />
                <h3 className="font-cinzel font-bold text-foreground text-sm">Get a Wallet</h3>
              </div>
              <div className="space-y-2">
                {[
                  { label: "Phantom", url: "https://phantom.app", desc: "Most popular Solana wallet" },
                  { label: "Solflare", url: "https://solflare.com", desc: "Feature-rich & secure" },
                  { label: "Backpack", url: "https://backpack.app", desc: "xNFT wallet by Coral" },
                ].map(({ label, url, desc }) => (
                  <a key={label} href={url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-between p-2.5 bg-background border border-border/40 rounded-lg hover:border-primary/40 transition-all group">
                    <div>
                      <p className="font-inter text-xs font-semibold text-foreground group-hover:text-primary transition-colors">{label}</p>
                      <p className="font-inter text-[10px] text-muted-foreground">{desc}</p>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </a>
                ))}
              </div>
            </div>

            {/* Kalshi Prediction Markets */}
            <KalshiPanel />

            {/* Portfolio link */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-center">
              <BarChart2 className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="font-cinzel text-sm font-bold text-foreground mb-1">Track Your Portfolio</p>
              <p className="font-inter text-xs text-muted-foreground mb-3">View holdings, risk ratings & AI analysis for your wallet.</p>
              <a href="/portfolio"
                className="inline-flex items-center gap-1.5 font-cinzel text-xs text-primary border border-primary/30 px-3 py-1.5 rounded-lg hover:bg-primary/10 transition-colors tracking-wider">
                Open Portfolio →
              </a>
            </div>

            {/* Disclaimer */}
            <div className="px-3 py-3 bg-orange-900/10 border border-orange-800/20 rounded-xl">
              <p className="font-inter text-[10px] text-muted-foreground/60 leading-relaxed">
                ⚠️ <strong className="text-orange-400/80">Risk Disclaimer:</strong> Cryptocurrency trading involves significant risk of loss. This terminal is provided for informational purposes only and does not constitute financial advice. MADE IN USA DIGITAL is not liable for trading losses.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}