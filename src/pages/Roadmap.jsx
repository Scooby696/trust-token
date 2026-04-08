import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, Clock, Zap } from "lucide-react";

const MILESTONES = [
  {
    phase: "Phase 1",
    title: "Foundation",
    date: "Q4 2024",
    status: "completed",
    items: [
      "TRUST Token launch on Solana via Pump.fun",
      "Community building on X & Telegram",
      "Initial whitepaper & mission statement published",
      "Website launch — Made in USA Digital",
    ],
  },
  {
    phase: "Phase 2",
    title: "Staking Infrastructure",
    date: "Q1 2025",
    status: "completed",
    items: [
      "Streamflow staking pools deployed (30% APY)",
      "7.5% supply vesting contract live on Streamflow",
      "3-month lock interval staking live",
      "Daily rewards distribution enabled",
    ],
  },
  {
    phase: "Phase 3",
    title: "Marketplace Expansion",
    date: "Q2 2025",
    status: "completed",
    items: [
      "100 American companies directory launched",
      "KYC verification system for makers",
      "AI shopping assistant integrated",
      "Company review & rating system live",
    ],
  },
  {
    phase: "Phase 4",
    title: "Digital Services & Ecosystem",
    date: "Q3 2025",
    status: "in_progress",
    items: [
      "US-based crypto & blockchain directory (100+ companies)",
      "AI provider matching & survey tool",
      "Defense contractor directory launched",
      "Shop page with American-made products",
    ],
  },
  {
    phase: "Phase 5",
    title: "Token Utility & Payments",
    date: "Q4 2025",
    status: "upcoming",
    items: [
      "TRUST token used for marketplace transactions",
      "Discounts for TRUST holders at verified merchants",
      "Creator payout system in TRUST tokens",
      "On-chain review verification",
    ],
  },
  {
    phase: "Phase 6",
    title: "Full Decentralization",
    date: "Q1–Q2 2026",
    status: "upcoming",
    items: [
      "DAO governance launch for community decisions",
      "Community-voted featured listings",
      "Cross-chain bridge exploration",
      "CEX listing campaign",
    ],
  },
  {
    phase: "Phase 7",
    title: "National Recognition",
    date: "Q3 2026+",
    status: "upcoming",
    items: [
      "Partnership with American manufacturers associations",
      "Media campaigns promoting USA-made economy",
      "Mobile app launch (iOS & Android)",
      "10,000+ verified American companies listed",
    ],
  },
];

const STATUS_CONFIG = {
  completed: {
    icon: CheckCircle2,
    label: "Completed",
    color: "text-green-400",
    bg: "bg-green-900/30",
    border: "border-green-500/40",
    dot: "bg-green-400",
    line: "bg-green-500/50",
  },
  in_progress: {
    icon: Zap,
    label: "In Progress",
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/50",
    dot: "bg-primary animate-pulse",
    line: "bg-primary/30",
  },
  upcoming: {
    icon: Clock,
    label: "Upcoming",
    color: "text-muted-foreground",
    bg: "bg-muted/30",
    border: "border-border/50",
    dot: "bg-border",
    line: "bg-border/40",
  },
};

export default function Roadmap() {
  return (
    <div className="pt-20 sm:pt-24 min-h-screen">
      {/* Hero */}
      <section className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-border/30">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/60 via-background to-primary/5 pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-1 flex">
          <div className="flex-1 bg-red-600" />
          <div className="flex-1 bg-white/80" />
          <div className="flex-1 bg-blue-700" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="font-inter text-xs tracking-[0.35em] text-primary uppercase mb-3">
              TRUST TOKEN · MADE IN THE USA DIGITAL
            </p>
            <h1 className="font-cinzel text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-3 leading-tight">
              PROJECT ROADMAP
            </h1>
            <div className="w-32 h-0.5 bg-primary mx-auto mb-5" />
            <p className="font-inter text-sm sm:text-base text-white/65 max-w-2xl mx-auto leading-relaxed mb-8">
              Our journey to build America's premier decentralized marketplace ecosystem — powered by the TRUST Token on Solana.
            </p>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6">
              {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                <div key={key} className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`} />
                  <span className="font-inter text-xs text-muted-foreground">{cfg.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-px bg-border/40" />

          <div className="space-y-10">
            {MILESTONES.map((milestone, i) => {
              const cfg = STATUS_CONFIG[milestone.status];
              const Icon = cfg.icon;
              return (
                <motion.div
                  key={milestone.phase}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  className="relative flex gap-6 sm:gap-10"
                >
                  {/* Icon dot */}
                  <div className="relative z-10 shrink-0">
                    <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full ${cfg.bg} border ${cfg.border} flex items-center justify-center shadow-lg`}>
                      <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${cfg.color}`} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className={`flex-1 bg-card border ${cfg.border} rounded-xl p-5 sm:p-6 hover:border-primary/30 transition-all`}>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                      <div>
                        <span className={`font-inter text-xs tracking-[0.2em] uppercase ${cfg.color} mb-1 block`}>
                          {milestone.phase} · {milestone.date}
                        </span>
                        <h3 className="font-cinzel text-lg sm:text-xl font-bold text-foreground">
                          {milestone.title}
                        </h3>
                      </div>
                      <span className={`self-start sm:self-auto px-3 py-1 rounded-full text-xs font-inter font-semibold ${cfg.bg} ${cfg.color} border ${cfg.border} whitespace-nowrap`}>
                        {cfg.label}
                      </span>
                    </div>

                    <ul className="space-y-2">
                      {milestone.items.map((item, j) => (
                        <li key={j} className="flex items-start gap-2.5 font-inter text-sm text-muted-foreground">
                          <span className={`shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-border/30">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <p className="font-inter text-xs tracking-[0.3em] text-primary uppercase mb-3">Join the Movement</p>
          <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-foreground mb-4">
            Be Part of the Journey
          </h2>
          <p className="font-inter text-sm text-muted-foreground leading-relaxed mb-6">
            Stake TRUST tokens, shop American-made, and help build the future of domestic commerce on-chain.
          </p>
          <a
            href="https://app.streamflow.finance/staking?search=Trust"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-cinzel tracking-wider text-sm px-8 py-4 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
          >
            <span className="w-2 h-2 rounded-full bg-primary-foreground animate-ping" />
            Stake TRUST · Live Now
          </a>
        </motion.div>
      </section>
    </div>
  );
}