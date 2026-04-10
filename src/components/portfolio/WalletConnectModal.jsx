import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Wallet, AlertCircle, Loader2, ExternalLink } from "lucide-react";

const WALLETS = [
  {
    id: "phantom",
    name: "Phantom",
    icon: "https://phantom.app/img/phantom-logo.svg",
    description: "Most popular Solana wallet",
    downloadUrl: "https://phantom.app",
  },
  {
    id: "solflare",
    name: "Solflare",
    icon: "https://solflare.com/assets/logo.svg",
    description: "Feature-rich Solana wallet",
    downloadUrl: "https://solflare.com",
  },
  {
    id: "backpack",
    name: "Backpack",
    icon: "https://www.backpack.app/favicon.ico",
    description: "xNFT wallet by Coral",
    downloadUrl: "https://backpack.app",
  },
  {
    id: "manual",
    name: "Enter Address Manually",
    icon: null,
    description: "Paste any Solana wallet address",
    downloadUrl: null,
  },
];

async function detectWallet(walletId) {
  if (walletId === "phantom") return window?.solana?.isPhantom ? window.solana : null;
  if (walletId === "solflare") return window?.solflare?.isSolflare ? window.solflare : null;
  if (walletId === "backpack") return window?.xnft?.solana ? window.xnft.solana : null;
  return null;
}

export default function WalletConnectModal({ onConnect, onClose }) {
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState("");
  const [manualAddress, setManualAddress] = useState("");
  const [showManual, setShowManual] = useState(false);

  const connectWallet = async (wallet) => {
    if (wallet.id === "manual") {
      setShowManual(true);
      return;
    }

    setLoading(wallet.id);
    setError("");

    const provider = await detectWallet(wallet.id);
    if (!provider) {
      setError(`${wallet.name} not detected. Please install the extension.`);
      setLoading(null);
      return;
    }

    try {
      const resp = await provider.connect();
      const address = resp.publicKey.toString();
      onConnect({ address, walletName: wallet.name });
    } catch (err) {
      if (err?.code === 4001 || err?.message?.includes("rejected") || err?.message?.includes("cancelled")) {
        setError("Connection rejected. Please approve the connection in your wallet.");
      } else {
        setError(err?.message || "Failed to connect wallet.");
      }
    }
    setLoading(null);
  };

  const submitManual = () => {
    if (!manualAddress.trim() || manualAddress.trim().length < 32) {
      setError("Please enter a valid Solana wallet address.");
      return;
    }
    onConnect({ address: manualAddress.trim(), walletName: "Manual" });
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-card border border-border rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-border/50">
            <div className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-primary" />
              <h2 className="font-cinzel font-bold text-foreground text-lg">Connect Wallet</h2>
            </div>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-5">
            {!showManual ? (
              <>
                <p className="font-inter text-xs text-muted-foreground mb-4">
                  Connect your Solana wallet to track holdings, get risk ratings, and AI-powered portfolio analysis.
                </p>

                <div className="space-y-2">
                  {WALLETS.map((wallet) => (
                    <button
                      key={wallet.id}
                      onClick={() => connectWallet(wallet)}
                      disabled={!!loading}
                      className="w-full flex items-center gap-3 p-3 bg-background border border-border rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-all text-left disabled:opacity-50"
                    >
                      {wallet.icon ? (
                        <img src={wallet.icon} alt={wallet.name} className="w-8 h-8 rounded-lg object-contain bg-white p-0.5" onError={(e) => { e.target.style.display = 'none'; }} />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                          <Wallet className="w-4 h-4 text-primary" />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="font-inter text-sm font-semibold text-foreground">{wallet.name}</p>
                        <p className="font-inter text-xs text-muted-foreground">{wallet.description}</p>
                      </div>
                      {loading === wallet.id ? (
                        <Loader2 className="w-4 h-4 text-primary animate-spin" />
                      ) : wallet.downloadUrl ? (
                        <span className="font-inter text-xs text-primary">Connect</span>
                      ) : (
                        <span className="font-inter text-xs text-muted-foreground">→</span>
                      )}
                    </button>
                  ))}
                </div>

                {error && (
                  <div className="mt-3 flex items-start gap-2 px-3 py-2.5 bg-red-900/20 border border-red-700/30 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-inter text-xs text-red-300">{error}</p>
                      {WALLETS.find((w) => error.includes(w.name))?.downloadUrl && (
                        <a
                          href={WALLETS.find((w) => error.includes(w.name)).downloadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-inter text-xs text-primary mt-1"
                        >
                          Install <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                <button onClick={() => { setShowManual(false); setError(""); }} className="font-inter text-xs text-muted-foreground hover:text-primary mb-4 flex items-center gap-1">
                  ← Back
                </button>
                <p className="font-inter text-sm font-semibold text-foreground mb-2">Enter Solana Wallet Address</p>
                <p className="font-inter text-xs text-muted-foreground mb-3">Paste your public wallet address to track holdings in read-only mode.</p>
                <input
                  value={manualAddress}
                  onChange={(e) => setManualAddress(e.target.value)}
                  placeholder="e.g. DjVE6JNiYqPL2QXyCUUh8rNjHrbz9hXHNYt99MQ59qw1"
                  className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-xs font-inter text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 mb-3"
                />
                {error && <p className="font-inter text-xs text-red-400 mb-3">{error}</p>}
                <button
                  onClick={submitManual}
                  className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg font-cinzel text-sm tracking-wider hover:bg-primary/90 transition-colors"
                >
                  Track Wallet
                </button>
              </>
            )}

            <p className="font-inter text-[10px] text-muted-foreground/50 text-center mt-4">
              Read-only access • No transaction signing required • Your keys stay with you
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}