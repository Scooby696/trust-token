import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, AlertTriangle, Shield, Zap } from "lucide-react";

const NARRATIVE_COLORS = {
  "DeFi": "bg-green-900/30 text-green-300 border-green-800/40",
  "Layer 1": "bg-blue-900/30 text-blue-300 border-blue-800/40",
  "Layer 2": "bg-cyan-900/30 text-cyan-300 border-cyan-800/40",
  "NFT": "bg-purple-900/30 text-purple-300 border-purple-800/40",
  "Meme": "bg-yellow-900/30 text-yellow-300 border-yellow-800/40",
  "Gaming": "bg-orange-900/30 text-orange-300 border-orange-800/40",
  "AI": "bg-pink-900/30 text-pink-300 border-pink-800/40",
  "Stablecoin": "bg-emerald-900/30 text-emerald-300 border-emerald-800/40",
  "Infrastructure": "bg-indigo-900/30 text-indigo-300 border-indigo-800/40",
  "Unknown": "bg-muted text-muted-foreground border-border",
};

function RiskBadge({ risk }) {
  const cfg = {
    low: { color: "text-green-400 bg-green-900/20 border-green-700/40", label: "Low Risk", icon: Shield },
    medium: { color: "text-yellow-400 bg-yellow-900/20 border-yellow-700/40", label: "Medium Risk", icon: Minus },
    high: { color: "text-orange-400 bg-orange-900/20 border-orange-700/40", label: "High Risk", icon: AlertTriangle },
    extreme: { color: "text-red-400 bg-red-900/20 border-red-700/40", label: "Extreme Risk", icon: Zap },
  }[risk] || { color: "text-muted-foreground bg-muted border-border", label: "Unknown", icon: Minus };
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-inter border ${cfg.color}`}>
      <Icon className="w-2.5 h-2.5" />{cfg.label}
    </span>
  );
}

export default function HoldingsGrid({ holdings, onSelectToken }) {
  if (!holdings || holdings.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="font-cinzel text-lg text-foreground mb-2">No holdings found</p>
        <p className="font-inter text-sm text-muted-foreground">This wallet appears to have no token balances.</p>
      </div>
    );
  }

  const totalValue = holdings.reduce((s, h) => s + (h.usdValue || 0), 0);

  // Group by narrative
  const byNarrative = holdings.reduce((acc, h) => {
    const n = h.narrative || "Unknown";
    if (!acc[n]) acc[n] = [];
    acc[n].push(h);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Portfolio Value", value: `$${totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}` },
          { label: "Tokens Held", value: holdings.length },
          { label: "Narratives", value: Object.keys(byNarrative).length },
          { label: "Risk Level", value: totalValue > 10000 ? "Diversified" : totalValue > 1000 ? "Moderate" : "Starter" },
        ].map(({ label, value }) => (
          <div key={label} className="bg-card border border-border/50 rounded-xl p-4 text-center">
            <p className="font-cinzel text-xl font-bold text-primary">{value}</p>
            <p className="font-inter text-xs text-muted-foreground mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* By Narrative */}
      {Object.entries(byNarrative).map(([narrative, tokens]) => {
        const narrativeValue = tokens.reduce((s, t) => s + (t.usdValue || 0), 0);
        const pct = totalValue > 0 ? (narrativeValue / totalValue * 100).toFixed(1) : 0;
        return (
          <div key={narrative}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full text-xs font-inter border ${NARRATIVE_COLORS[narrative] || NARRATIVE_COLORS["Unknown"]}`}>
                  {narrative}
                </span>
                <span className="font-inter text-xs text-muted-foreground">{tokens.length} tokens · {pct}% of portfolio</span>
              </div>
              <span className="font-inter text-xs text-foreground font-semibold">
                ${narrativeValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </span>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {tokens.map((token, i) => (
                <motion.button
                  key={token.mint || token.symbol}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => onSelectToken(token)}
                  className="bg-card border border-border/50 rounded-xl p-4 hover:border-primary/40 transition-all text-left group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {token.logoURI ? (
                        <img src={token.logoURI} alt={token.symbol} className="w-7 h-7 rounded-full" onError={(e) => { e.target.style.display = "none"; }} />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center font-cinzel text-xs text-primary font-bold">
                          {token.symbol?.[0]}
                        </div>
                      )}
                      <div>
                        <p className="font-cinzel text-sm font-bold text-foreground group-hover:text-primary transition-colors">{token.symbol}</p>
                        <p className="font-inter text-[10px] text-muted-foreground">{token.name}</p>
                      </div>
                    </div>
                    {token.change24h !== undefined && (
                      <span className={`flex items-center gap-0.5 text-xs font-inter font-semibold ${token.change24h >= 0 ? "text-green-400" : "text-red-400"}`}>
                        {token.change24h >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {Math.abs(token.change24h).toFixed(1)}%
                      </span>
                    )}
                  </div>

                  <div className="flex items-end justify-between">
                    <div>
                      <p className="font-inter text-xs text-muted-foreground">Balance</p>
                      <p className="font-inter text-sm font-semibold text-foreground">
                        {Number(token.amount).toLocaleString(undefined, { maximumFractionDigits: 4 })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-inter text-xs text-muted-foreground">Value</p>
                      <p className="font-inter text-sm font-semibold text-foreground">
                        ${(token.usdValue || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>

                  <div className="mt-2">
                    <RiskBadge risk={token.risk} />
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}