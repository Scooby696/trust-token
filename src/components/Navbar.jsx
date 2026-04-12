import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ExternalLink, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const XIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.261 5.636L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
  </svg>
);

const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

// Primary nav items shown as distinct buttons
const PRIMARY_LINKS = [
  { label: "Marketplace", to: "/marketplace", style: "blue" },
  { label: "Digital", to: "/digital", style: "cyan" },
  { label: "Defense", to: "/defense", style: "red" },
  { label: "News", to: "/news", style: "default" },
  { label: "Shop", to: "/shop", style: "blue" },
];

// Secondary items in a "More" dropdown
const MORE_LINKS = [
  { label: "100 Companies", to: "/hundred" },
  { label: "Companies", to: "/companies" },
  { label: "Our Mission", to: "/mission" },
  { label: "Quotes", to: "/quotes" },
  { label: "Apply", to: "/apply" },
  { label: "Track Status", to: "/status" },
  { label: "Roadmap", to: "/roadmap" },
  { label: "Dashboard", to: "/dashboard" },
  { label: "Portfolio", to: "/portfolio" },
  { label: "Trading Terminal", to: "/terminal" },
  { label: "Prediction Markets", to: "/prediction-markets" },
];

const ALL_MOBILE_LINKS = [
  { label: "Home", to: "/" },
  ...PRIMARY_LINKS,
  ...MORE_LINKS,
  { label: "Stake TRUST · Coming Soon", href: "#", external: false },
];

const STYLE_MAP = {
  blue: "border border-blue-700/60 text-blue-300 hover:bg-blue-900/40 hover:border-blue-500",
  cyan: "border border-cyan-700/60 text-cyan-300 hover:bg-cyan-900/40 hover:border-cyan-500",
  red: "border border-red-700/60 text-red-400 hover:bg-red-900/40 hover:border-red-500",
  default: "border border-border text-muted-foreground hover:border-primary/50 hover:text-primary",
};

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const location = useLocation();

  const isActive = (to) => location.pathname === to;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-xl border-b border-border/50">
      {/* Patriotic stripe */}
      <div className="h-1 w-full flex">
        <div className="flex-1 bg-red-600" />
        <div className="flex-1 bg-white/90" />
        <div className="flex-1 bg-blue-700" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <div className="flex flex-col leading-tight">
              <span className="font-cinzel text-primary font-bold text-base sm:text-lg tracking-widest">
                MADE IN THE USA DIGITAL
              </span>
              <span className="font-inter text-muted-foreground text-xs tracking-wider">powered by TRUST TOKEN</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-2">

            {/* Home — plain text */}
            <Link
              to="/"
              className={`font-inter text-xs tracking-wider px-3 py-1.5 rounded-lg transition-all ${
                isActive("/") ? "text-primary" : "text-muted-foreground hover:text-primary"
              }`}
            >
              Home
            </Link>

            {/* Primary section buttons */}
            {PRIMARY_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className={`font-cinzel text-xs tracking-wider px-3 py-1.5 rounded-lg transition-all ${STYLE_MAP[link.style]} ${
                  isActive(link.to) ? "bg-primary/10 border-primary/60 text-primary" : ""
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* More dropdown */}
            <div className="relative">
              <button
                onClick={() => setMoreOpen((o) => !o)}
                onBlur={() => setTimeout(() => setMoreOpen(false), 150)}
                className="flex items-center gap-1 font-inter text-xs tracking-wider px-3 py-1.5 rounded-lg border border-border text-muted-foreground hover:border-primary/50 hover:text-primary transition-all"
              >
                More <ChevronDown className={`w-3 h-3 transition-transform ${moreOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {moreOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.97 }}
                    className="absolute top-full right-0 mt-2 w-44 bg-card border border-border/60 rounded-xl shadow-xl overflow-hidden z-50"
                  >
                    {MORE_LINKS.map((link) => (
                      <Link
                        key={link.label}
                        to={link.to}
                        className={`block px-4 py-2.5 font-inter text-xs tracking-wider transition-colors ${
                          isActive(link.to)
                            ? "text-primary bg-primary/10"
                            : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                        }`}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Stake TRUST — gold CTA */}
            <a
              href="https://app.streamflow.finance/staking?search=Trust"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 font-cinzel text-xs tracking-wider px-4 py-1.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-md shadow-primary/20"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary-foreground animate-ping"></span>
              ⚡ Stake TRUST · LIVE
            </a>
          </div>

          {/* Social Icons - Desktop */}
          <div className="hidden lg:flex items-center gap-3 pl-3 border-l border-border/50 shrink-0">
            <a href="https://x.com/trust_tokenusa" target="_blank" rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors" aria-label="X (Twitter)">
              <XIcon />
            </a>
            <a href="https://t.me/trusttokenmadeinusa" target="_blank" rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors" aria-label="Telegram">
              <TelegramIcon />
            </a>
            <a href="https://www.facebook.com/share/18miZUBhXM/" target="_blank" rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors" aria-label="Facebook">
              <FacebookIcon />
            </a>
          </div>

          {/* Mobile Toggle */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden text-foreground">
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-background/95 backdrop-blur-xl border-b border-border overflow-hidden"
          >
            <div className="px-6 py-6 space-y-3">
              {ALL_MOBILE_LINKS.map((link) =>
                link.external ? (
                  <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
                    onClick={() => setMobileOpen(false)}
                    className="block font-inter text-base tracking-wider text-muted-foreground hover:text-primary transition-colors">
                    {link.label} ↗
                  </a>
                ) : (
                  <Link key={link.label} to={link.to} onClick={() => setMobileOpen(false)}
                    className={`block font-inter text-base tracking-wider transition-colors ${
                      isActive(link.to) ? "text-primary" : "text-muted-foreground hover:text-primary"
                    }`}>
                    {link.label}
                  </Link>
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}