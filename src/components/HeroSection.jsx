import React from "react";
import { motion } from "framer-motion";
import { ChevronDown, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HERO_IMAGE = "https://media.base44.com/images/public/69c69ce535233bb19cea339d/875ff3e12_Screenshot_20260323_064053_Chrome.jpg";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${HERO_IMAGE})` }}
      />
      {/* Overlay gradient — deep navy to near-black, patriotic */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-950/70 via-black/50 to-blue-950/90" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto pt-20">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="font-inter text-xs sm:text-sm tracking-[0.35em] text-primary uppercase mb-6"
        >
          MADE IN USA DIGITAL
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="font-cinzel text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-tight mb-4"
        >
          IN GOD<br />WE TRUST
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="w-32 h-0.5 bg-primary mx-auto mb-6"
        />

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="font-cinzel text-xl sm:text-2xl md:text-3xl text-primary tracking-[0.2em] mb-8"
        >
          MADE IN USA DIGITAL · TRUST TOKEN
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="font-inter text-sm sm:text-base text-white/70 max-w-2xl mx-auto leading-relaxed mb-10"
        >
          Honoring America's foundation on Christian values. Built on faith,
          liberty, and the enduring principles of our Founding Fathers.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link to="/mission">
            <Button
              size="lg"
              className="font-cinzel tracking-wider text-sm px-8 py-6 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Our Mission
            </Button>
          </Link>
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-red-600/20 border border-red-500/50 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
              <span className="font-cinzel text-[10px] text-red-400 tracking-widest uppercase">⚡ STAKING IS LIVE!</span>
            </div>
            <a
              href="https://app.streamflow.finance/staking?search=Trust"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="lg"
                className="font-cinzel tracking-wider text-sm px-8 py-6 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/30"
              >
                Stake TRUST Now
              </Button>
            </a>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ChevronDown className="w-6 h-6 text-primary/60" />
        </motion.div>
      </motion.div>
    </section>
  );
}