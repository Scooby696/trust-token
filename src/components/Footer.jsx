import React from "react";
import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import TokenPriceBar from "./TokenPriceBar";

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

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border/50">
      {/* Staking Promo Bar */}
      <div className="w-full bg-gradient-to-r from-blue-950 via-primary/20 to-blue-950 border-b border-primary/30">
        {/* Staking row */}
        <a
          href="https://app.streamflow.finance/staking?search=Trust"
          target="_blank"
          rel="noopener noreferrer"
          className="block hover:bg-primary/5 transition-colors group"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-center">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              <span className="font-cinzel text-xs font-bold text-red-400 tracking-[0.2em] uppercase">⚡ STAKING LIVE ON STREAMFLOW</span>
            </div>
            <div className="flex items-center gap-4 font-inter text-xs text-muted-foreground">
              <span className="text-primary font-bold">30% APY</span>
              <span className="text-border">·</span>
              <span>3-Month Lock Intervals</span>
              <span className="text-border">·</span>
              <span>50% of Supply Stakeable</span>
              <span className="text-border">·</span>
              <span>Daily Rewards</span>
            </div>
            <span className="font-cinzel text-xs text-primary group-hover:text-primary/80 underline underline-offset-2 tracking-wider">Stake Now →</span>
          </div>
        </a>
        {/* Vesting row */}
        <a
          href="https://app.streamflow.finance/contract/solana/mainnet/Sr4HoU1aNUQm3mr7VztHNNTdUSShA4NfyFLFxF7yCNg"
          target="_blank"
          rel="noopener noreferrer"
          className="block border-t border-primary/10 hover:bg-primary/5 transition-colors group"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-center">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
              <span className="font-cinzel text-xs font-bold text-yellow-400 tracking-[0.2em] uppercase">🔒 VESTING CONTRACT ON STREAMFLOW</span>
            </div>
            <div className="flex items-center gap-4 font-inter text-xs text-muted-foreground">
              <span className="text-primary font-bold">7.5% Vested</span>
              <span className="text-border">·</span>
              <span>TRUST Token Supply</span>
              <span className="text-border">·</span>
              <span>Solana Mainnet</span>
            </div>
            <span className="font-cinzel text-xs text-primary group-hover:text-primary/80 underline underline-offset-2 tracking-wider">View Contract →</span>
          </div>
        </a>
      </div>

      <TokenPriceBar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <p className="font-cinzel text-primary font-bold tracking-widest text-lg">
              MADE IN THE USA DIGITAL
            </p>
            <p className="font-inter text-xs text-muted-foreground mt-1 tracking-wider">
              powered by TRUST TOKEN
            </p>
          </div>

          <div className="flex items-center gap-6 text-sm font-inter text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <Link to="/marketplace" className="hover:text-primary transition-colors">Marketplace</Link>
            <Link to="/hundred" className="hover:text-primary transition-colors">100 Companies</Link>
            <Link to="/defense" className="hover:text-primary transition-colors">Defense</Link>
            <Link to="/digital" className="hover:text-primary transition-colors">Digital</Link>
            <Link to="/companies" className="hover:text-primary transition-colors">Companies</Link>
            <Link to="/apply" className="hover:text-primary transition-colors">Apply</Link>
            <Link to="/news" className="hover:text-primary transition-colors">News</Link>
            <Link to="/mission" className="hover:text-primary transition-colors">Mission</Link>
            <Link to="/quotes" className="hover:text-primary transition-colors">Quotes</Link>
            <a href="https://app.streamflow.finance/staking?search=Trust" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors text-red-400 font-semibold">⚡ Stake TRUST · LIVE</a>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://x.com/MITUSADIGITAL"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="X (Twitter)"
            >
              <XIcon />
            </a>
            <a
              href="https://t.me/trusttokenmadeinusa"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="Telegram"
            >
              <TelegramIcon />
            </a>
          </div>

          <div className="text-center md:text-right">
            <a href="mailto:madeintheusadigital@gmail.com" className="font-inter text-xs text-muted-foreground hover:text-primary transition-colors">
              madeintheusadigital@gmail.com
            </a>
            <p className="font-inter text-xs text-muted-foreground mt-1">
              © {new Date().getFullYear()} MADEINUSA DIGITAL
            </p>
          </div>
        </div>
        </div>
    </footer>
  );
}