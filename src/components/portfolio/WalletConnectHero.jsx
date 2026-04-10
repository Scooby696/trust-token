import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Wallet, Zap, BarChart2, X, ChevronDown, Loader2, CheckCircle2, AlertCircle, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { saveWallet, loadWallet, clearWallet } from "../../lib/walletStore";

const WALLETS = [
  { id: "phantom", name: "Phantom", check: () => window?.solana?.isPhantom && window.solana, url: "https://phantom.app" },
  { id: "solflare", name: "Solflare", check: () => window?.solflare?.isSolflare && window.solflare, url: "https://solflare.com" },
  { id: "backpack", name: "Backpack", check: () => window?.xnft?.solana, url: "https://backpack.app" },
];

export default function WalletConnectHero() {
  const [wallet, setWallet] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState("");
  const [showManual, setShowManual] = useState(false);
  const [manualAddress, setManualAddress] = useState("");

  useEffect(() => {
    setWallet(loadWallet());
    const handler = (e) => setWallet(e.detail);
    window.addEventListener("walletChanged", handler);
    return () => window.removeEventListener("walletChanged", handler);
  }, []);

  const connect = async (w) => {
    setConnecting(true);
    setError("");
    setShowMenu(false);

    const provider = w.check();
    if (!provider) {
      setError(`${w.name} not detected.`);
      setConnecting(false);
      return;
    }
    const resp = await provider.connect();
    const info = { address: resp.publicKey.toString(), walletName: w.name };
    saveWallet(info);
    setWallet(info);
    setConnecting(false);
  };

  const connectManual = () => {
    if (!manualAddress.trim() || manualAddress.trim().length < 32) {
      setError("Enter a valid Solana address.");
      return;
    }
    const info = { address: manualAddress.trim(), walletName: "Manual" };
    saveWallet(info);
    setWallet(info);
    setShowManual(false);
    setManualAddress("");
    setError("");
  };

  const disconnect = () => {
    clearWallet();
    setWallet(null);
  };

  return (
    <section className="py-14 px-4 sm:px-6 lg:px-8 border-t border-border/30">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <p className="font-inter text-xs tracking-[0.3em] text-primary uppercase mb-3">
            ⚡ TRUST TOKEN · Digital Hub
          </p>
          <h2 className="font-cinzel text-3xl sm:text-4xl font-bold text-foreground mb-3">
            Connect Your Solana Wallet
          </h2>
          <p className="font-inter text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
            One connection powers your <strong className="text-foreground">Portfolio Tracker</strong>, <strong className="text-foreground">AI Risk Ratings</strong>, and the <strong className="text-foreground">Digital Trading Terminal</strong>.
          </p>
        </div>

        {/* Main card */}
        <div className="relative bg-gradient-to-br from-blue-950/50 via-card to-purple-950/20 border border-primary/20 rounded-2xl p-6 sm:p-8">
          {/* Stripe accent */}
          <div className="absolute top-0 left-0 right-0 h-0.5 flex rounded-t-2xl overflow-hidden">
            <div className="flex-1 bg-red-600" />
            <div className="flex-1 bg-white/80" />
            <div className="flex-1 bg-blue-700" />
          </div>

          {!wallet ? (
            <div className="flex flex-col items-center gap-6">
              {/* Wallet connect button */}
              <div className="relative">
                {!showManual ? (
                  <>
                    <button
                      onClick={() => { setShowMenu((o) => !o); setError(""); }}
                      disabled={connecting}
                      className="flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-cinzel text-base tracking-wider hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30 disabled:opacity-60"
                    >
                      {connecting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wallet className="w-5 h-5" />}
                      {connecting ? "Connecting..." : "Connect Wallet"}
                      {!connecting && <ChevronDown className="w-4 h-4" />}
                    </button>

                    {showMenu && (
                      <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-56 bg-card border border-border/60 rounded-xl shadow-2xl overflow-hidden z-50">
                        {WALLETS.map((w) => (
                          <button key={w.id} onClick={() => connect(w)}
                            className="w-full flex items-center gap-3 px-4 py-3 text-left font-inter text-sm text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors border-b border-border/30 last:border-0">
                            <Wallet className="w-4 h-4" /> {w.name}
                          </button>
                        ))}
                        <button onClick={() => { setShowManual(true); setShowMenu(false); }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-left font-inter text-sm text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors">
                          <Wallet className="w-4 h-4" /> Enter Address Manually
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-3 w-72">
                    <input
                      value={manualAddress}
                      onChange={(e) => setManualAddress(e.target.value)}
                      placeholder="Paste Solana wallet address..."
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 text-xs font-inter text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    <div className="flex gap-2 w-full">
                      <button onClick={connectManual}
                        className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-xl font-cinzel text-xs tracking-wider hover:bg-primary/90 transition-colors">
                        Track Wallet
                      </button>
                      <button onClick={() => { setShowManual(false); setError(""); }}
                        className="px-3 py-2.5 bg-card border border-border rounded-xl text-muted-foreground hover:text-foreground">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {error && (
                <div className="flex items-center gap-2 px-4 py-2.5 bg-red-900/20 border border-red-700/30 rounded-lg max-w-sm">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <p className="font-inter text-xs text-red-300">{error}</p>
                  <div className="flex gap-2 ml-auto">
                    {WALLETS.filter(w => error.includes(w.name)).map(w => (
                      <a key={w.id} href={w.url} target="_blank" rel="noopener noreferrer"
                        className="font-inter text-xs text-primary hover:underline flex items-center gap-1">
                        Install <ExternalLink className="w-3 h-3" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Feature pills */}
              <div className="flex flex-wrap justify-center gap-3">
                {[
                  "AI Risk Ratings",
                  "Portfolio Analytics",
                  "DEX Trading",
                  "Token Research",
                ].map((f) => (
                  <span key={f} className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary rounded-full text-xs font-inter">
                    ✓ {f}
                  </span>
                ))}
              </div>

              <p className="font-inter text-[10px] text-muted-foreground/50 text-center">
                Read-only by default · No transaction signing · Your keys stay with you
              </p>
            </div>
          ) : (
            /* Connected state */
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-900/30 border border-green-700/40 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="font-cinzel text-sm font-bold text-foreground">Wallet Connected</p>
                    <div className="flex items-center gap-2">
                      <span className="font-inter text-xs text-green-400">{wallet.walletName}</span>
                      <span className="font-inter text-xs text-muted-foreground font-mono">
                        {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                      </span>
                    </div>
                  </div>
                </div>
                <button onClick={disconnect}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-card border border-border rounded-lg font-inter text-xs text-muted-foreground hover:text-red-400 hover:border-red-700/40 transition-colors">
                  <X className="w-3 h-3" /> Disconnect
                </button>
              </div>

              {/* Navigation CTAs */}
              <div className="grid sm:grid-cols-2 gap-3">
                <Link to="/portfolio"
                  className="flex items-center gap-3 p-4 bg-primary/10 border border-primary/30 rounded-xl hover:bg-primary/20 transition-all group">
                  <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center">
                    <BarChart2 className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-cinzel text-sm font-bold text-foreground group-hover:text-primary transition-colors">Portfolio Tracker</p>
                    <p className="font-inter text-xs text-muted-foreground">AI risk ratings & holdings</p>
                  </div>
                </Link>
                <Link to="/terminal"
                  className="flex items-center gap-3 p-4 bg-blue-900/20 border border-blue-700/30 rounded-xl hover:bg-blue-900/30 transition-all group">
                  <div className="w-9 h-9 rounded-lg bg-blue-900/30 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-blue-300" />
                  </div>
                  <div>
                    <p className="font-cinzel text-sm font-bold text-foreground group-hover:text-blue-300 transition-colors">Trading Terminal</p>
                    <p className="font-inter text-xs text-muted-foreground">Swap on Jupiter DEX</p>
                  </div>
                </Link>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </section>
  );
}