import React from "react";
import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border/50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <p className="font-cinzel text-primary font-bold tracking-widest text-lg">
              TRUST TOKEN
            </p>
            <p className="font-inter text-xs text-muted-foreground mt-1 tracking-wider">
              by MADEINUSA DIGITAL
            </p>
          </div>

          <div className="flex items-center gap-6 text-sm font-inter text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <Link to="/mission" className="hover:text-primary transition-colors">Mission</Link>
            <Link to="/quotes" className="hover:text-primary transition-colors">Quotes</Link>
            <a
              href="https://app.streamflow.finance/staking"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors flex items-center gap-1"
            >
              Stake <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <p className="font-inter text-xs text-muted-foreground">
            © {new Date().getFullYear()} MADEINUSA DIGITAL
          </p>
        </div>
      </div>
    </footer>
  );
}