import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "Our Mission", to: "/mission" },
    { label: "Founding Quotes", to: "/quotes" },
    {
      label: "Stake TRUST",
      href: "https://app.streamflow.finance/staking",
      external: true,
    },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <span className="font-cinzel text-primary font-bold text-lg sm:text-xl tracking-widest">
              TRUST TOKEN
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) =>
              link.external ? (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-inter text-sm tracking-wider text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
                >
                  {link.label}
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : (
                <Link
                  key={link.label}
                  to={link.to}
                  className="font-inter text-sm tracking-wider text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-foreground"
          >
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
            className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border overflow-hidden"
          >
            <div className="px-6 py-6 space-y-4">
              {navLinks.map((link) =>
                link.external ? (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileOpen(false)}
                    className="block font-inter text-base tracking-wider text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label} ↗
                  </a>
                ) : (
                  <Link
                    key={link.label}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className="block font-inter text-base tracking-wider text-muted-foreground hover:text-primary transition-colors"
                  >
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