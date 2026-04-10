import React, { useState, useEffect } from "react";
import { ExternalLink, TrendingUp, TrendingDown, Copy, Check } from "lucide-react";

const CONTRACT = "7nvr1eB96vPFGcxzDVFe4QAgG583EPS9PTPzfL2npump";

export default function TokenPriceBar() {
  const [data, setData] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const res = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${CONTRACT}`);
        if (!res.ok) return;
        const json = await res.json();
        const pair = json?.pairs?.[0];
        if (pair) setData(pair);
      } catch {
        // silently keep last known data on network failure
      }
    };
    fetchPrice();
    const interval = setInterval(fetchPrice, 30000);
    return () => clearInterval(interval);
  }, []);

  const copyContract = () => {
    navigator.clipboard.writeText(CONTRACT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const priceChange = data ? parseFloat(data.priceChange?.h24 || 0) : null;
  const isUp = priceChange > 0;

  return (
    <div className="w-full bg-background/80 border-b border-border/40 py-3 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-center">
        
        {/* Token label */}
        <div className="flex items-center gap-2">
          <span className="font-cinzel text-xs font-bold text-primary tracking-widest uppercase">🇺🇸 TRUST TOKEN</span>
          <span className="font-inter text-xs text-muted-foreground">on Solana</span>
        </div>

        {/* Price */}
        {data ? (
          <>
            <div className="flex items-center gap-3 font-inter text-xs">
              <span className="text-foreground font-bold">${parseFloat(data.priceUsd || 0).toFixed(8)}</span>
              <span className={`flex items-center gap-0.5 font-semibold ${isUp ? "text-green-400" : "text-red-400"}`}>
                {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {isUp ? "+" : ""}{priceChange?.toFixed(2)}% (24h)
              </span>
            </div>

            <div className="flex items-center gap-3 font-inter text-xs text-muted-foreground">
              {data.volume?.h24 && (
                <span>Vol 24h: <span className="text-foreground font-semibold">${parseFloat(data.volume.h24).toLocaleString()}</span></span>
              )}
              {data.liquidity?.usd && (
                <span>Liq: <span className="text-foreground font-semibold">${parseFloat(data.liquidity.usd).toLocaleString()}</span></span>
              )}
            </div>
          </>
        ) : (
          <span className="font-inter text-xs text-muted-foreground animate-pulse">Loading price...</span>
        )}

        {/* Contract address */}
        <div className="flex items-center gap-2">
          <span className="font-inter text-xs text-muted-foreground hidden sm:inline">CA:</span>
          <span className="font-mono text-xs text-muted-foreground/70">{CONTRACT.slice(0, 8)}...{CONTRACT.slice(-6)}</span>
          <button onClick={copyContract} className="text-muted-foreground hover:text-primary transition-colors" title="Copy contract address">
            {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
          </button>
        </div>

        {/* Links */}
        <div className="flex items-center gap-3">
          <a
            href={`https://dexscreener.com/solana/${CONTRACT}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 font-cinzel text-xs text-primary hover:text-primary/80 transition-colors"
          >
            Chart <ExternalLink className="w-3 h-3" />
          </a>
          <span className="text-border">·</span>
          <a
            href={`https://pump.fun/coin/${CONTRACT}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 font-cinzel text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            Pump.fun <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}