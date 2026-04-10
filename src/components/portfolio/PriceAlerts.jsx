import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, BellOff, X, TrendingUp, TrendingDown, Settings, ChevronDown, AlertTriangle } from "lucide-react";

const STORAGE_KEY = "mitusa_price_alerts";
const BASELINE_KEY = "mitusa_price_baseline";
const POLL_INTERVAL = 60 * 1000; // 1 minute

function loadSettings() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { enabled: true, threshold: 5 }; } catch { return { enabled: true, threshold: 5 }; }
}
function saveSettings(s) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch {}
}
function loadBaseline() {
  try { return JSON.parse(localStorage.getItem(BASELINE_KEY)) || {}; } catch { return {}; }
}
function saveBaseline(b) {
  try { localStorage.setItem(BASELINE_KEY, JSON.stringify(b)); } catch {}
}

async function fetchPrices(symbols) {
  // Use Jupiter price API for Solana tokens
  const TOKEN_IDS = {
    SOL: "So11111111111111111111111111111111111111112",
    USDC: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    BONK: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
    JUP: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
    WIF: "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm",
    RAY: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
    USDT: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
  };

  const ids = symbols
    .map((s) => TOKEN_IDS[s])
    .filter(Boolean)
    .join(",");

  if (!ids) return {};

  const res = await fetch(`https://price.jup.ag/v4/price?ids=${ids}`);
  const data = await res.json();
  const result = {};
  symbols.forEach((s) => {
    const id = TOKEN_IDS[s];
    if (id && data?.data?.[id]) result[s] = data.data[id].price;
  });
  return result;
}

export default function PriceAlerts({ holdings = [] }) {
  const [settings, setSettings] = useState(loadSettings);
  const [showSettings, setShowSettings] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [thresholdInput, setThresholdInput] = useState("");
  const baselineRef = useRef(loadBaseline());
  const pollRef = useRef(null);

  const symbols = holdings.map((h) => h.symbol).filter((s) => s !== "USDC" && s !== "USDT");

  const checkPrices = useCallback(async () => {
    if (!settings.enabled || symbols.length === 0) return;
    const prices = await fetchPrices(symbols);
    const baseline = baselineRef.current;
    const newAlerts = [];
    const now = Date.now();

    Object.entries(prices).forEach(([symbol, price]) => {
      const base = baseline[symbol];
      if (!base) {
        baseline[symbol] = { price, timestamp: now };
        return;
      }
      // Reset baseline if older than 1 hour
      const age = (now - base.timestamp) / 1000 / 60;
      if (age > 60) {
        baseline[symbol] = { price, timestamp: now };
        return;
      }
      const pct = ((price - base.price) / base.price) * 100;
      if (Math.abs(pct) >= settings.threshold) {
        newAlerts.push({
          id: `${symbol}-${now}`,
          symbol,
          pct,
          price,
          basePrice: base.price,
          timestamp: now,
        });
        // Reset baseline after alert
        baseline[symbol] = { price, timestamp: now };
      }
    });

    saveBaseline(baseline);
    baselineRef.current = baseline;

    if (newAlerts.length > 0) {
      setAlerts((prev) => [...newAlerts, ...prev].slice(0, 20));
      // Browser push notification if permitted
      if (typeof Notification !== "undefined" && Notification.permission === "granted") {
        newAlerts.forEach((a) => {
          try {
            new Notification(`${a.symbol} Price Alert`, {
              body: `${a.symbol} moved ${a.pct > 0 ? "+" : ""}${a.pct.toFixed(2)}% in the last hour (now $${a.price.toFixed(4)})`,
              icon: "/favicon.ico",
            });
          } catch {}
        });
      }
    }
  }, [settings, symbols.join(",")]);

  // Initialize baseline on holdings load
  useEffect(() => {
    if (holdings.length === 0) return;
    const baseline = baselineRef.current;
    const now = Date.now();
    holdings.forEach((h) => {
      if (!baseline[h.symbol] && h.usdValue && h.amount) {
        const price = h.usdValue / h.amount;
        if (price > 0) baseline[h.symbol] = { price, timestamp: now };
      }
    });
    saveBaseline(baseline);
    baselineRef.current = baseline;
  }, [holdings.length]);

  // Polling
  useEffect(() => {
    if (pollRef.current) clearInterval(pollRef.current);
    if (settings.enabled && symbols.length > 0) {
      pollRef.current = setInterval(checkPrices, POLL_INTERVAL);
    }
    return () => clearInterval(pollRef.current);
  }, [checkPrices, settings.enabled]);

  const updateSettings = (updates) => {
    const next = { ...settings, ...updates };
    setSettings(next);
    saveSettings(next);
  };

  const requestNotificationPermission = async () => {
    if (typeof Notification !== "undefined" && Notification.permission === "default") {
      await Notification.requestPermission();
    }
  };

  const notifPermission = typeof Notification !== "undefined" ? Notification.permission : "denied";

  const removeAlert = (id) => setAlerts((prev) => prev.filter((a) => a.id !== id));
  const clearAll = () => setAlerts([]);

  const THRESHOLDS = [3, 5, 10, 15, 20];

  return (
    <div className="bg-card border border-border/50 rounded-xl p-4 sm:p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {settings.enabled
            ? <Bell className="w-4 h-4 text-primary" />
            : <BellOff className="w-4 h-4 text-muted-foreground" />}
          <h3 className="font-cinzel font-bold text-foreground text-sm">Price Alerts</h3>
          {alerts.length > 0 && (
            <span className="px-1.5 py-0.5 bg-red-600 text-white rounded-full text-[10px] font-bold">
              {alerts.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {alerts.length > 0 && (
            <button onClick={clearAll} className="font-inter text-xs text-muted-foreground hover:text-red-400 transition-colors">
              Clear all
            </button>
          )}
          <button
            onClick={() => setShowSettings((o) => !o)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-inter transition-colors ${
              showSettings ? "bg-primary/10 border-primary/40 text-primary" : "bg-background border-border text-muted-foreground hover:border-primary/40"
            }`}
          >
            <Settings className="w-3 h-3" /> Config <ChevronDown className={`w-3 h-3 transition-transform ${showSettings ? "rotate-180" : ""}`} />
          </button>
          <button
            onClick={() => updateSettings({ enabled: !settings.enabled })}
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-inter transition-colors ${
              settings.enabled
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background border-border text-muted-foreground hover:border-primary/40"
            }`}
          >
            {settings.enabled ? "ON" : "OFF"}
          </button>
        </div>
      </div>

      {/* Settings panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="pb-4 mb-4 border-b border-border/30 space-y-4">
              {/* Threshold picker */}
              <div>
                <p className="font-inter text-xs text-muted-foreground mb-2">
                  Alert when token moves ≥ <strong className="text-foreground">{settings.threshold}%</strong> in one hour
                </p>
                <div className="flex flex-wrap gap-2">
                  {THRESHOLDS.map((t) => (
                    <button key={t} onClick={() => updateSettings({ threshold: t })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-inter border transition-colors ${
                        settings.threshold === t
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background border-border text-muted-foreground hover:border-primary/40"
                      }`}>
                      {t}%
                    </button>
                  ))}
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={thresholdInput}
                      onChange={(e) => setThresholdInput(e.target.value)}
                      placeholder="Custom %"
                      className="w-20 bg-background border border-border rounded-lg px-2 py-1.5 text-xs font-inter text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                    />
                    <button
                      onClick={() => {
                        const v = parseFloat(thresholdInput);
                        if (v > 0 && v <= 100) { updateSettings({ threshold: v }); setThresholdInput(""); }
                      }}
                      className="px-2 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-inter hover:bg-primary/90 transition-colors"
                    >
                      Set
                    </button>
                  </div>
                </div>
              </div>

              {/* Push notifications */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-inter text-xs text-foreground font-semibold">Browser Push Notifications</p>
                  <p className="font-inter text-[10px] text-muted-foreground">
                    {notifPermission === "granted"
                      ? "✓ Enabled — you'll get notifications even when away"
                      : notifPermission === "denied"
                      ? "✗ Blocked in browser settings"
                      : "Not yet requested"}
                  </p>
                </div>
                {notifPermission !== "granted" && notifPermission !== "denied" && (
                  <button onClick={requestNotificationPermission}
                    className="px-3 py-1.5 bg-card border border-primary/30 text-primary rounded-lg text-xs font-inter hover:bg-primary/10 transition-colors">
                    Enable
                  </button>
                )}
              </div>

              {/* Monitored tokens */}
              <div>
                <p className="font-inter text-xs text-muted-foreground mb-1.5">Monitoring {symbols.length} token{symbols.length !== 1 ? "s" : ""}</p>
                <div className="flex flex-wrap gap-1.5">
                  {symbols.map((s) => (
                    <span key={s} className="px-2 py-0.5 bg-background border border-border/50 rounded-full text-xs font-inter text-muted-foreground">
                      {s}
                    </span>
                  ))}
                  {symbols.length === 0 && <span className="font-inter text-xs text-muted-foreground/60">No tokens loaded yet</span>}
                </div>
              </div>

              <p className="font-inter text-[10px] text-muted-foreground/50">
                Prices checked every 60 seconds via Jupiter Price API · Baseline resets after alert fires or 1 hour
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Alerts list */}
      {alerts.length === 0 ? (
        <div className="flex flex-col items-center py-6 gap-2 text-center">
          <Bell className="w-6 h-6 text-muted-foreground/40" />
          <p className="font-inter text-xs text-muted-foreground/60">
            {settings.enabled
              ? `Watching for ≥${settings.threshold}% moves · Checks every 60s`
              : "Alerts are paused — toggle ON to monitor"}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {alerts.map((alert) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, height: 0, scale: 0.97 }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border ${
                  alert.pct > 0
                    ? "bg-green-900/15 border-green-700/30"
                    : "bg-red-900/15 border-red-700/30"
                }`}
              >
                {alert.pct > 0
                  ? <TrendingUp className="w-4 h-4 text-green-400 shrink-0" />
                  : <TrendingDown className="w-4 h-4 text-red-400 shrink-0" />}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-cinzel text-xs font-bold text-foreground">{alert.symbol}</span>
                    <span className={`font-inter text-xs font-semibold ${alert.pct > 0 ? "text-green-400" : "text-red-400"}`}>
                      {alert.pct > 0 ? "+" : ""}{alert.pct.toFixed(2)}%
                    </span>
                  </div>
                  <p className="font-inter text-[10px] text-muted-foreground truncate">
                    ${alert.price.toFixed(alert.price < 0.01 ? 8 : 4)} · {new Date(alert.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                <button onClick={() => removeAlert(alert.id)} className="text-muted-foreground hover:text-foreground transition-colors shrink-0">
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}