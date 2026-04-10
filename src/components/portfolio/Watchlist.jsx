import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star, Plus, X, TrendingUp, TrendingDown, Bell, BellOff,
  Loader2, RefreshCw, AlertTriangle, Search
} from "lucide-react";

const STORAGE_KEY = "mitusa_watchlist";
const ALERTS_KEY = "mitusa_watchlist_alerts";
const POLL_MS = 60000;

function loadWatchlist() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; }
}
function saveWatchlist(w) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(w)); } catch {}
}
function loadAlerts() {
  try { return JSON.parse(localStorage.getItem(ALERTS_KEY)) || {}; } catch { return {}; }
}
function saveAlerts(a) {
  try { localStorage.setItem(ALERTS_KEY, JSON.stringify(a)); } catch {}
}

async function fetchTokenMeta(mintAddress) {
  // Try Jupiter token list first
  try {
    const res = await fetch("https://token.jup.ag/strict");
    if (res.ok) {
      const list = await res.json();
      const token = list.find((t) => t.address === mintAddress);
      if (token) return { symbol: token.symbol, name: token.name, logoURI: token.logoURI };
    }
  } catch {}
  return { symbol: mintAddress.slice(0, 6) + "...", name: "Unknown Token", logoURI: null };
}

async function fetchTokenPrice(mintAddress) {
  try {
    const res = await fetch(`https://price.jup.ag/v4/price?ids=${mintAddress}`);
    if (!res.ok) return null;
    const data = await res.json();
    const info = data?.data?.[mintAddress];
    if (!info) return null;
    return { price: info.price, change24h: null }; // Jupiter v4 doesn't return 24h change
  } catch { return null; }
}

async function fetchTokenPriceWithChange(mintAddress) {
  // Try DexScreener for price + 24h change
  try {
    const res = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${mintAddress}`);
    if (!res.ok) throw new Error();
    const data = await res.json();
    const pair = data?.pairs?.find((p) => p.chainId === "solana");
    if (pair) {
      return {
        price: parseFloat(pair.priceUsd) || 0,
        change24h: pair.priceChange?.h24 ?? null,
        volume24h: pair.volume?.h24 ?? null,
        liquidity: pair.liquidity?.usd ?? null,
        dexUrl: pair.url || null,
      };
    }
  } catch {}
  // Fallback to Jupiter price only
  const jp = await fetchTokenPrice(mintAddress);
  return jp;
}

export default function Watchlist() {
  const [items, setItems] = useState(loadWatchlist);
  const [alerts, setAlerts] = useState(loadAlerts);
  const [inputAddress, setInputAddress] = useState("");
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [editAlertId, setEditAlertId] = useState(null);
  const [alertInput, setAlertInput] = useState("");
  const pollRef = useRef(null);

  // Refresh all prices
  const refreshPrices = async (silent = false) => {
    if (!silent) setRefreshing(true);
    const updated = await Promise.all(
      items.map(async (item) => {
        const priceData = await fetchTokenPriceWithChange(item.address);
        if (!priceData) return item;
        return { ...item, ...priceData, lastUpdated: Date.now() };
      })
    );
    setItems(updated);
    saveWatchlist(updated);
    // Check alerts
    updated.forEach((item) => {
      const alert = alerts[item.address];
      if (!alert?.enabled || !alert.targetPrice || !item.price) return;
      const triggered =
        (alert.direction === "above" && item.price >= alert.targetPrice) ||
        (alert.direction === "below" && item.price <= alert.targetPrice);
      if (triggered && typeof Notification !== "undefined" && Notification.permission === "granted") {
        try {
          new Notification(`${item.symbol} Price Alert`, {
            body: `${item.symbol} is ${alert.direction} $${alert.targetPrice} (now $${item.price.toFixed(4)})`,
            icon: "/favicon.ico",
          });
        } catch {}
      }
    });
    if (!silent) setRefreshing(false);
  };

  useEffect(() => {
    if (items.length > 0) refreshPrices(true);
    pollRef.current = setInterval(() => refreshPrices(true), POLL_MS);
    return () => clearInterval(pollRef.current);
  }, [items.length]);

  const addToken = async () => {
    const addr = inputAddress.trim();
    if (!addr || addr.length < 32) { setAddError("Enter a valid Solana token mint address."); return; }
    if (items.find((i) => i.address === addr)) { setAddError("Token already in watchlist."); return; }

    setAdding(true);
    setAddError("");
    const meta = await fetchTokenMeta(addr);
    const priceData = await fetchTokenPriceWithChange(addr);
    const newItem = {
      address: addr,
      symbol: meta.symbol,
      name: meta.name,
      logoURI: meta.logoURI,
      price: priceData?.price ?? null,
      change24h: priceData?.change24h ?? null,
      volume24h: priceData?.volume24h ?? null,
      liquidity: priceData?.liquidity ?? null,
      dexUrl: priceData?.dexUrl ?? null,
      lastUpdated: Date.now(),
    };
    const updated = [...items, newItem];
    setItems(updated);
    saveWatchlist(updated);
    setInputAddress("");
    setShowAdd(false);
    setAdding(false);
  };

  const removeToken = (address) => {
    const updated = items.filter((i) => i.address !== address);
    setItems(updated);
    saveWatchlist(updated);
    const newAlerts = { ...alerts };
    delete newAlerts[address];
    setAlerts(newAlerts);
    saveAlerts(newAlerts);
  };

  const saveAlert = (address) => {
    const price = parseFloat(alertInput);
    if (!price || price <= 0) return;
    const item = items.find((i) => i.address === address);
    const direction = item?.price && price > item.price ? "above" : "below";
    const newAlerts = {
      ...alerts,
      [address]: { targetPrice: price, direction, enabled: true },
    };
    setAlerts(newAlerts);
    saveAlerts(newAlerts);
    setEditAlertId(null);
    setAlertInput("");
    if (typeof Notification !== "undefined" && Notification.permission === "default") {
      Notification.requestPermission();
    }
  };

  const toggleAlert = (address) => {
    const newAlerts = {
      ...alerts,
      [address]: { ...alerts[address], enabled: !alerts[address]?.enabled },
    };
    setAlerts(newAlerts);
    saveAlerts(newAlerts);
  };

  const removeAlert = (address) => {
    const newAlerts = { ...alerts };
    delete newAlerts[address];
    setAlerts(newAlerts);
    saveAlerts(newAlerts);
    setEditAlertId(null);
  };

  return (
    <div className="bg-card border border-border/50 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-5 py-4 border-b border-border/30">
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 text-primary" />
          <h3 className="font-cinzel font-bold text-foreground text-sm">Watchlist</h3>
          {items.length > 0 && (
            <span className="px-1.5 py-0.5 bg-primary/10 text-primary rounded-full text-[10px] font-inter">{items.length}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {items.length > 0 && (
            <button onClick={() => refreshPrices()} disabled={refreshing}
              className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors">
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
            </button>
          )}
          <button
            onClick={() => { setShowAdd((o) => !o); setAddError(""); setInputAddress(""); }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg font-inter text-xs hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Add Token
          </button>
        </div>
      </div>

      {/* Add token input */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b border-border/30"
          >
            <div className="px-4 sm:px-5 py-4 space-y-2">
              <p className="font-inter text-xs text-muted-foreground">Paste a Solana token mint address to add it to your watchlist.</p>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <input
                    value={inputAddress}
                    onChange={(e) => { setInputAddress(e.target.value); setAddError(""); }}
                    onKeyDown={(e) => e.key === "Enter" && addToken()}
                    placeholder="e.g. JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN"
                    className="w-full bg-background border border-border rounded-lg pl-9 pr-3 py-2 text-xs font-inter text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground/50"
                  />
                </div>
                <button onClick={addToken} disabled={adding}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-cinzel text-xs tracking-wider hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center gap-1.5">
                  {adding ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                  {adding ? "Adding..." : "Add"}
                </button>
              </div>
              {addError && (
                <div className="flex items-center gap-2 text-xs font-inter text-red-400">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> {addError}
                </div>
              )}
              <p className="font-inter text-[10px] text-muted-foreground/50">
                Find mint addresses on <a href="https://birdeye.so" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Birdeye</a> or <a href="https://dexscreener.com/solana" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">DexScreener</a>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Token list */}
      {items.length === 0 ? (
        <div className="flex flex-col items-center py-10 gap-3 text-center px-4">
          <Star className="w-8 h-8 text-muted-foreground/30" />
          <p className="font-cinzel text-sm text-foreground">No tokens in watchlist</p>
          <p className="font-inter text-xs text-muted-foreground max-w-xs">
            Add any Solana token by mint address to track its price and set custom alerts.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-border/30">
          {items.map((item) => {
            const alert = alerts[item.address];
            const isEditingAlert = editAlertId === item.address;

            return (
              <motion.div key={item.address} layout className="px-4 sm:px-5 py-3.5">
                <div className="flex items-center gap-3">
                  {/* Logo */}
                  {item.logoURI ? (
                    <img src={item.logoURI} alt={item.symbol} className="w-8 h-8 rounded-full shrink-0"
                      onError={(e) => { e.target.style.display = "none"; }} />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                      <span className="font-cinzel text-xs text-primary font-bold">{item.symbol?.[0]}</span>
                    </div>
                  )}

                  {/* Name + address */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-cinzel text-sm font-bold text-foreground">{item.symbol}</span>
                      <span className="font-inter text-[10px] text-muted-foreground truncate hidden sm:block">
                        {item.address.slice(0, 8)}...{item.address.slice(-4)}
                      </span>
                    </div>
                    <p className="font-inter text-[10px] text-muted-foreground truncate">{item.name}</p>
                  </div>

                  {/* Price */}
                  <div className="text-right shrink-0">
                    {item.price != null ? (
                      <>
                        <p className="font-inter text-sm font-semibold text-foreground">
                          ${item.price < 0.001 ? item.price.toExponential(2) : item.price.toLocaleString(undefined, { maximumFractionDigits: item.price < 1 ? 6 : 2 })}
                        </p>
                        {item.change24h != null && (
                          <span className={`flex items-center justify-end gap-0.5 text-xs font-inter font-semibold ${item.change24h >= 0 ? "text-green-400" : "text-red-400"}`}>
                            {item.change24h >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            {Math.abs(item.change24h).toFixed(2)}%
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="font-inter text-xs text-muted-foreground">—</span>
                    )}
                  </div>

                  {/* Alert toggle */}
                  <button
                    onClick={() => alert ? toggleAlert(item.address) : setEditAlertId(item.address)}
                    title={alert ? `Alert: $${alert.targetPrice} (${alert.direction})` : "Set price alert"}
                    className={`p-1.5 rounded-lg border transition-colors shrink-0 ${
                      alert?.enabled ? "bg-primary/10 border-primary/40 text-primary" : "border-border text-muted-foreground hover:border-primary/30 hover:text-primary"
                    }`}
                  >
                    {alert?.enabled ? <Bell className="w-3.5 h-3.5" /> : <BellOff className="w-3.5 h-3.5" />}
                  </button>

                  {/* Remove */}
                  <button onClick={() => removeToken(item.address)}
                    className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-red-400 hover:border-red-700/30 transition-colors shrink-0">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Alert editor */}
                <AnimatePresence>
                  {isEditingAlert && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden">
                      <div className="mt-3 pt-3 border-t border-border/30 flex flex-wrap items-center gap-2">
                        <span className="font-inter text-xs text-muted-foreground shrink-0">Alert when price reaches $</span>
                        <input
                          type="number"
                          value={alertInput}
                          onChange={(e) => setAlertInput(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && saveAlert(item.address)}
                          placeholder={item.price?.toFixed(4) || "0.00"}
                          className="w-28 bg-background border border-border rounded-lg px-2 py-1.5 text-xs font-inter text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                        />
                        <button onClick={() => saveAlert(item.address)}
                          className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-cinzel tracking-wider hover:bg-primary/90 transition-colors">
                          Set Alert
                        </button>
                        {alert && (
                          <button onClick={() => removeAlert(item.address)}
                            className="px-3 py-1.5 border border-red-700/30 text-red-400 rounded-lg text-xs font-inter hover:bg-red-900/10 transition-colors">
                            Remove
                          </button>
                        )}
                        <button onClick={() => setEditAlertId(null)}
                          className="text-muted-foreground hover:text-foreground text-xs font-inter">
                          Cancel
                        </button>
                      </div>
                      {alert && (
                        <p className="font-inter text-[10px] text-muted-foreground mt-1.5">
                          Current: Alert {alert.enabled ? "active" : "paused"} — {alert.direction} ${alert.targetPrice}
                        </p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Alert badge (when set and not editing) */}
                {alert && !isEditingAlert && (
                  <div className="mt-1.5 flex items-center gap-2">
                    <button onClick={() => { setEditAlertId(item.address); setAlertInput(String(alert.targetPrice)); }}
                      className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-inter border transition-colors hover:opacity-80 ${
                        alert.enabled ? "bg-primary/10 border-primary/30 text-primary" : "bg-muted border-border text-muted-foreground"
                      }`}>
                      <Bell className="w-2.5 h-2.5" />
                      Alert {alert.direction} ${alert.targetPrice} · {alert.enabled ? "ON" : "OFF"}
                    </button>
                  </div>
                )}

                {/* Volume/liquidity info */}
                {(item.volume24h || item.liquidity) && (
                  <div className="mt-1.5 flex gap-3">
                    {item.volume24h && (
                      <span className="font-inter text-[10px] text-muted-foreground/70">
                        Vol 24h: ${(item.volume24h / 1000).toFixed(1)}k
                      </span>
                    )}
                    {item.liquidity && (
                      <span className="font-inter text-[10px] text-muted-foreground/70">
                        Liq: ${(item.liquidity / 1000).toFixed(1)}k
                      </span>
                    )}
                    {item.dexUrl && (
                      <a href={item.dexUrl} target="_blank" rel="noopener noreferrer"
                        className="font-inter text-[10px] text-primary hover:underline">
                        View Chart ↗
                      </a>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      <div className="px-4 sm:px-5 py-2 border-t border-border/30">
        <p className="font-inter text-[10px] text-muted-foreground/40">Prices update every 60s via DexScreener · Alerts fire when page is open</p>
      </div>
    </div>
  );
}