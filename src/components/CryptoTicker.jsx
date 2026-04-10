import React, { useState, useEffect, useRef } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

const COINS = [
  { id: "bitcoin", symbol: "BTC" },
  { id: "ethereum", symbol: "ETH" },
  { id: "solana", symbol: "SOL" },
  { id: "ripple", symbol: "XRP" },
  { id: "cardano", symbol: "ADA" },
  { id: "dogecoin", symbol: "DOGE" },
  { id: "chainlink", symbol: "LINK" },
  { id: "avalanche-2", symbol: "AVAX" },
  { id: "uniswap", symbol: "UNI" },
  { id: "jupiter", symbol: "JUP" },
];

export default function CryptoTicker() {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPrices = async () => {
    try {
      const ids = COINS.map((c) => c.id).join(",");
      const res = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`
      );
      if (!res.ok) return; // silently skip on 429 / errors, keep last known prices
      const data = await res.json();
      const mapped = COINS.map((coin) => ({
        symbol: coin.symbol,
        price: data[coin.id]?.usd ?? null,
        change: data[coin.id]?.usd_24h_change ?? null,
      })).filter((c) => c.price != null);
      if (mapped.length > 0) setPrices(mapped);
      setLoading(false);
    } catch {
      setLoading(false); // don't crash — keep showing last prices
    }
  };

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading || prices.length === 0) return null;

  // Duplicate for seamless loop
  const items = [...prices, ...prices];

  return (
    <div className="bg-background/80 border-b border-border/40 overflow-hidden h-8 flex items-center">
      <div className="flex items-center gap-0 animate-ticker whitespace-nowrap">
        {items.map((coin, i) => {
          const isUp = coin.change >= 0;
          return (
            <span key={i} className="inline-flex items-center gap-1.5 px-4 text-xs font-inter shrink-0">
              <span className="font-semibold text-foreground">{coin.symbol}</span>
              <span className="text-muted-foreground">
                ${coin.price < 1 ? coin.price.toFixed(4) : coin.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              {coin.change != null && (
                <span className={`flex items-center gap-0.5 ${isUp ? "text-green-400" : "text-red-400"}`}>
                  {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {Math.abs(coin.change).toFixed(2)}%
                </span>
              )}
              <span className="text-border mx-1">·</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}