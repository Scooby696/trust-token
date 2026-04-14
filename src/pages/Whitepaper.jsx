import React, { useState } from "react";
import { motion } from "framer-motion";
import { FileText, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";

const Section = ({ number, title, children }) => {
  const [open, setOpen] = useState(true);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="border border-border/50 rounded-xl overflow-hidden mb-4"
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-6 py-4 bg-card hover:bg-primary/5 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <span className="font-cinzel text-primary font-bold text-sm">{number}</span>
          <h2 className="font-cinzel font-bold text-foreground text-base sm:text-lg">{title}</h2>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />}
      </button>
      {open && (
        <div className="px-6 py-5 bg-background/40 space-y-4 font-inter text-sm text-muted-foreground leading-relaxed">
          {children}
        </div>
      )}
    </motion.div>
  );
};

const Quote = ({ text, author }) => (
  <blockquote className="border-l-2 border-primary/50 pl-4 py-1 my-3">
    <p className="font-inter text-sm text-foreground/80 italic">"{text}"</p>
    <p className="font-cinzel text-xs text-primary mt-1">— {author}</p>
  </blockquote>
);

const RoadmapPhase = ({ phase, title, period, status, items }) => {
  const statusColors = {
    completed: "bg-green-900/30 border-green-700/40 text-green-400",
    in_progress: "bg-primary/10 border-primary/30 text-primary",
    upcoming: "bg-blue-900/20 border-blue-700/30 text-blue-300",
    future: "bg-muted border-border text-muted-foreground",
  };
  const statusLabels = {
    completed: "✓ Completed",
    in_progress: "⚡ In Progress",
    upcoming: "◎ Upcoming",
    future: "◌ Future",
  };
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="relative pl-8 border-l-2 border-border/40 pb-8 last:pb-0"
    >
      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary border-2 border-background" />
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <span className="font-cinzel text-xs font-bold text-muted-foreground">{phase}</span>
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-cinzel border ${statusColors[status]}`}>
          {statusLabels[status]}
        </span>
        <span className="font-inter text-xs text-muted-foreground/60">{period}</span>
      </div>
      <h3 className="font-cinzel font-bold text-foreground mb-3">{title}</h3>
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 font-inter text-xs text-muted-foreground">
            <span className="text-primary mt-0.5 shrink-0">→</span> {item}
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

const PHASES = [
  {
    phase: "Phase 1",
    title: "Foundation",
    period: "Q1–Q2 2026 – Completed",
    status: "completed",
    items: [
      "Token launch on Solana",
      "High-yield staking live on Streamflow (30% APY)",
      "Digital Hub with portfolio tracker, AI risk ratings, and trading terminal",
      "Prediction market intelligence tools (Kalshi + Polymarket integration)",
      "Initial Made in USA Marketplace directory",
      "Website, community channels, and transparency reports",
    ],
  },
  {
    phase: "Phase 2",
    title: "Growth & Accountability",
    period: "Q2–Q3 2026 – In Progress",
    status: "in_progress",
    items: [
      "Full rollout of AI-powered Made in USA Marketplace",
      "KYDSOLID Launchpad beta and public launch (Know-Your-Developer verified token launches)",
      "Expanded global digital partners with uniform KYC standards",
      "Community governance proposals activated",
      "Additional staking tiers and reward multipliers for long-term holders",
    ],
  },
  {
    phase: "Phase 3",
    title: "Expansion & Adoption",
    period: "Q4 2026 – 2027",
    status: "upcoming",
    items: [
      "Mobile app for staking, marketplace, and trading",
      "Cross-chain bridges and additional DeFi integrations",
      "Enterprise partnerships with U.S. manufacturers and creators",
      "Advanced AI analytics suite and on-chain reputation system",
      "Global expansion while maintaining 'Made in USA' core values",
      "Potential fiat on-ramps and regulatory-compliant features",
    ],
  },
  {
    phase: "Phase 4",
    title: "Long-Term Vision",
    period: "2027+",
    status: "future",
    items: [
      "Full decentralized governance DAO",
      "Ecosystem fund for American innovators",
      "Metaverse / real-world asset (RWA) integrations tied to U.S. manufacturing",
      "Global recognition as the standard for accountable, values-driven crypto",
    ],
  },
];

export default function Whitepaper() {
  return (
    <div className="pt-20 sm:pt-24 min-h-screen">
      {/* Hero */}
      <section className="relative py-14 sm:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-border/30">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/60 via-background to-primary/5 pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-1 flex">
          <div className="flex-1 bg-red-600" />
          <div className="flex-1 bg-white/80" />
          <div className="flex-1 bg-blue-700" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-center gap-2 mb-4">
              <FileText className="w-6 h-6 text-primary" />
              <p className="font-inter text-xs tracking-[0.35em] text-primary uppercase">Official Document · Version 1.0</p>
            </div>
            <h1 className="font-cinzel text-4xl sm:text-5xl font-bold text-white mb-3 leading-tight">
              TRUST TOKEN ($TRUST)<br />WHITEPAPER
            </h1>
            <div className="w-32 h-0.5 bg-primary mx-auto mb-5" />
            <p className="font-cinzel text-sm text-primary tracking-widest mb-2">Made in the USA Digital — April 2026</p>
            <p className="font-inter text-sm text-white/60 italic max-w-xl mx-auto leading-relaxed mb-8">
              Honoring America's Foundation on Christian Values, Faith, Liberty, and the Principles of the Founding Fathers
            </p>
            {/* Key details */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {[
                { label: "Blockchain", value: "Solana" },
                { label: "Symbol", value: "$TRUST" },
                { label: "APY", value: "Up to 30%" },
                { label: "Staking", value: "Streamflow" },
              ].map(({ label, value }) => (
                <div key={label} className="px-4 py-2.5 bg-card border border-primary/20 rounded-xl text-center">
                  <p className="font-inter text-[10px] text-muted-foreground uppercase tracking-wider">{label}</p>
                  <p className="font-cinzel text-sm font-bold text-primary">{value}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <a href="https://app.streamflow.finance/staking?search=Trust" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-cinzel text-xs tracking-wider hover:bg-primary/90 transition-colors">
                <ExternalLink className="w-3.5 h-3.5" /> Stake TRUST Now
              </a>
              <a href="https://kydsolidbymadeintheusadigital.base44.app/" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 border border-primary/30 text-primary rounded-lg font-cinzel text-xs tracking-wider hover:bg-primary/10 transition-colors">
                Preview KYDSOLID →
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contract info bar */}
      <div className="bg-card border-b border-border/40 px-4 py-3">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-4 text-center sm:text-left">
          <div>
            <span className="font-inter text-[10px] text-muted-foreground uppercase tracking-wider">Contract (Solana): </span>
            <code className="font-mono text-xs text-primary">7nvr1eB96vPFGcxzDVFe4QAgG583EPS9PTPzfL2npump</code>
          </div>
          <span className="hidden sm:block text-border">·</span>
          <div>
            <span className="font-inter text-[10px] text-muted-foreground uppercase tracking-wider">Email: </span>
            <a href="mailto:trusttokenbymadeinusadigital@gmail.com" className="font-inter text-xs text-primary hover:underline">
              trusttokenbymadeinusadigital@gmail.com
            </a>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Executive Summary */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="mb-6 p-6 bg-primary/5 border border-primary/20 rounded-xl">
          <h2 className="font-cinzel font-bold text-foreground text-lg mb-3 flex items-center gap-2">
            <span className="text-primary">★</span> Executive Summary
          </h2>
          <p className="font-inter text-sm text-muted-foreground leading-relaxed">
            Trust Token ($TRUST) is the native utility token powering the <strong className="text-foreground">Made in USA Digital</strong> ecosystem — a transparent, accountable, and faith-aligned DeFi platform built on Solana. $TRUST combines high-yield staking (up to 30% APY with daily rewards via Streamflow), a verified Made in USA Marketplace, an AI-powered digital trading hub, prediction market intelligence tools, and the upcoming KYDSOLID Know-Your-Developer launchpad.
          </p>
          <p className="font-inter text-sm text-muted-foreground leading-relaxed mt-3">
            By embedding real-world accountability, KYC-verified participants, and American-made values into decentralized finance, Trust Token rebuilds trust in crypto while delivering tangible utility to holders who earn, verify, and support U.S.-based innovation. The project is <strong className="text-foreground">Made in the USA</strong> — transparent, secure, and rooted in the timeless principles of faith, liberty, and integrity that founded the nation.
          </p>
        </motion.div>

        {/* Sections */}
        <Section number="1." title="Introduction & Vision">
          <p>America was founded on Christian values, as affirmed by the Declaration of Independence and the words of the Founding Fathers:</p>
          <Quote text="We hold these truths to be self-evident, that all men are created equal, that they are endowed by their Creator with certain unalienable Rights…" author="Declaration of Independence" />
          <Quote text="The general principles on which the fathers achieved independence were the general principles of Christianity." author="John Adams" />
          <p>Trust Token exists to honor this heritage in the digital age. We believe <strong className="text-foreground">true decentralization requires accountability</strong>. In an era of anonymous rugs, hype-driven tokens, and eroded public trust, $TRUST delivers verifiable staking rewards, KYC-verified marketplaces, and identity-backed launches — all on the high-performance Solana blockchain.</p>
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <div className="p-4 bg-card border border-border/50 rounded-xl">
              <p className="font-cinzel text-xs font-bold text-primary mb-1">Vision</p>
              <p>To become the trusted gateway where crypto meets real American value — empowering users to earn high yields, verify quality, and support domestic creators, businesses, and innovators.</p>
            </div>
            <div className="p-4 bg-card border border-border/50 rounded-xl">
              <p className="font-cinzel text-xs font-bold text-primary mb-1">Mission</p>
              <p>Rebuild trust in cryptocurrency through a transparent, secure, and fully verifiable staking and rewards platform that bridges DeFi with real-world accountability.</p>
            </div>
          </div>
        </Section>

        <Section number="2." title="The Problem">
          {[
            { title: "Erosion of Trust in Crypto", desc: "Rug pulls, anonymous teams, and unverified projects dominate the space, eroding confidence." },
            { title: "Lack of Real-World Utility", desc: "Most tokens offer speculation without tangible products or services." },
            { title: "Disconnect from American Values", desc: "Few projects prioritize domestic manufacturing, KYC standards, or the Judeo-Christian principles that built the United States." },
            { title: "Fragmented User Experience", desc: "Traders and holders lack integrated tools for staking, portfolio tracking, AI risk analysis, prediction intelligence, and verified shopping in one ecosystem." },
          ].map(({ title, desc }) => (
            <div key={title} className="flex items-start gap-3 p-3 bg-card border border-red-900/20 rounded-lg">
              <span className="text-red-400 mt-0.5 shrink-0">✗</span>
              <div>
                <p className="font-cinzel text-xs font-bold text-foreground mb-0.5">{title}</p>
                <p>{desc}</p>
              </div>
            </div>
          ))}
        </Section>

        <Section number="3." title="Our Solution: The Made in USA Digital Ecosystem">
          <p>$TRUST is the fuel for a complete, faith-aligned digital ecosystem:</p>
          {[
            { num: "1", title: "High-Yield Staking & Vesting (Live)", items: ["Up to 30% APY with daily rewards", "3-month lock intervals", "50% of total supply stakeable", "7.5% of supply in vesting contract", "Powered by Streamflow on Solana Mainnet"] },
            { num: "2", title: "Made in USA Marketplace (Live / Expanding)", items: ["KYC-verified directory of American-made goods, services, and creators", "AI-powered shopping recommendations", "Community-rated businesses", "Direct support for U.S. jobs and innovation"] },
            { num: "3", title: "Digital Hub (Live)", items: ["Connect Solana wallet (read-only mode for security)", "Portfolio tracker", "AI Risk Ratings", "Digital Trading Terminal + DEX integration"] },
            { num: "4", title: "Prediction Market Intelligence (Live)", items: ["Integrated tools for Kalshi (CFTC-regulated U.S. prediction markets) and Polymarket", "AI-generated Buy/Sell/Hold signals based on live market probabilities"] },
            { num: "5", title: "KYDSOLID Launchpad (Coming Soon)", items: ["First accountability-first launchpad on Solana", "Know-Your-Developer (KYD) verification: real ID, facial recognition, on-chain history, legal agreements", "Zero-tolerance for anonymity — verified developers stake their identity"] },
          ].map(({ num, title, items }) => (
            <div key={num} className="p-4 bg-card border border-primary/15 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center font-cinzel text-xs font-bold text-primary shrink-0">{num}</span>
                <p className="font-cinzel text-sm font-bold text-foreground">{title}</p>
              </div>
              <ul className="space-y-1 ml-8">
                {items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs">
                    <span className="text-primary shrink-0">·</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Section>

        <Section number="4." title="Token Utility & Economics">
          <div className="grid sm:grid-cols-3 gap-3 mb-4">
            {[["Symbol", "$TRUST"], ["Blockchain", "Solana"], ["Staking APY", "Up to 30%"]].map(([l, v]) => (
              <div key={l} className="p-3 bg-card border border-primary/20 rounded-lg text-center">
                <p className="font-inter text-[10px] text-muted-foreground uppercase tracking-wider">{l}</p>
                <p className="font-cinzel text-sm font-bold text-primary">{v}</p>
              </div>
            ))}
          </div>
          <p className="font-cinzel text-xs font-bold text-primary uppercase tracking-wider mb-2">Core Utilities</p>
          {[
            ["Staking & Rewards", "Earn daily yields and participate in ecosystem growth."],
            ["Governance & Access", "Future governance rights; priority access to launches and marketplace perks."],
            ["Marketplace & Services", "Potential fee discounts, premium listings, and AI tool usage."],
            ["Launchpad Participation", "KYDSOLID launches will favor $TRUST stakers and holders."],
            ["Ecosystem Incentives", "Liquidity provision, partner rewards, and community grants."],
          ].map(([title, desc]) => (
            <div key={title} className="flex items-start gap-2">
              <span className="text-primary shrink-0 mt-0.5">→</span>
              <p><strong className="text-foreground">{title}:</strong> {desc}</p>
            </div>
          ))}
          <div className="mt-4 p-4 bg-card border border-border/40 rounded-xl">
            <p className="font-cinzel text-xs font-bold text-foreground mb-2">Tokenomics Highlights</p>
            <ul className="space-y-1">
              {["50% of total supply allocated to staking rewards pool", "7.5% vested via Streamflow (team/early contributors with lockups)", "Remaining supply supports liquidity, marketing, partnerships, and ecosystem development"].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-xs"><span className="text-primary shrink-0">·</span>{item}</li>
              ))}
            </ul>
          </div>
          <p className="text-xs italic mt-2">Full audited tokenomics dashboard will be published in official docs following community feedback and regulatory alignment.</p>
        </Section>

        <Section number="5." title="Technology Stack">
          {[
            ["Blockchain", "Solana — high throughput, low fees, mobile-first"],
            ["Staking & Vesting", "Streamflow — industry-leading vesting and staking infrastructure"],
            ["AI Layer", "Proprietary models for risk ratings, shopping recommendations, and prediction signals"],
            ["Wallet Integration", "Secure read-only connections (no transaction signing required for core hub features)"],
            ["Security", "KYC verification, on-chain transparency, and identity-backed accountability"],
          ].map(([tech, desc]) => (
            <div key={tech} className="flex items-start gap-3 p-3 bg-card border border-border/40 rounded-lg">
              <span className="font-cinzel text-xs font-bold text-primary shrink-0 mt-0.5 w-36">{tech}</span>
              <p className="text-xs">{desc}</p>
            </div>
          ))}
        </Section>

        {/* Roadmap Section */}
        <Section number="6." title="Roadmap">
          <div className="pt-2">
            {PHASES.map((phase) => (
              <RoadmapPhase key={phase.phase} {...phase} />
            ))}
          </div>
          <p className="text-xs italic mt-4">Milestones will be tracked publicly with on-chain transparency reports.</p>
        </Section>

        <Section number="7." title="Team & Values">
          <p>The project is driven by a U.S.-based team committed to transparency and accountability. All major decisions prioritize integrity, faith, and service to the American people. Detailed team information will be progressively disclosed through KYD verification processes as the ecosystem matures.</p>
        </Section>

        <Section number="8." title="Risks & Disclaimers">
          {[
            "Crypto investments are highly volatile. $TRUST is a utility token with staking rewards; past performance is not indicative of future results.",
            "Staking involves lock-up periods and smart contract risk (though Streamflow is audited).",
            "The project is not affiliated with Kalshi or Polymarket beyond informational tool integrations.",
            "Always DYOR. This whitepaper is for informational purposes only and does not constitute financial, legal, or investment advice.",
            "Compliance with all applicable U.S. laws and KYC standards is a core principle.",
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2 p-3 bg-orange-900/10 border border-orange-800/20 rounded-lg">
              <span className="text-orange-400 shrink-0 mt-0.5">⚠</span>
              <p className="text-xs text-orange-300/80">{item}</p>
            </div>
          ))}
        </Section>

        {/* Conclusion */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="mt-6 p-6 bg-gradient-to-br from-primary/10 via-card to-blue-950/40 border border-primary/30 rounded-xl text-center">
          <h2 className="font-cinzel text-xl font-bold text-foreground mb-3">Conclusion</h2>
          <p className="font-inter text-sm text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-6">
            Trust Token is more than a cryptocurrency — it is a movement to restore faith, liberty, and trust in the digital economy. By building on Solana with real yield, verified marketplaces, accountable launches, and American values, $TRUST creates a sustainable ecosystem where holders earn, communities thrive, and innovation serves the nation that made freedom possible.
          </p>
          <p className="font-cinzel text-base font-bold text-primary mb-6">Join the mission. Stake. Verify. Support what is Made in the USA.</p>
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            <a href="https://app.streamflow.finance/staking?search=Trust" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-cinzel text-xs tracking-wider hover:bg-primary/90 transition-colors">
              <ExternalLink className="w-3.5 h-3.5" /> Stake $TRUST Now
            </a>
            <a href="https://kydsolidbymadeintheusadigital.base44.app/" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 border border-primary/30 text-primary rounded-lg font-cinzel text-xs tracking-wider hover:bg-primary/10 transition-colors">
              Preview KYDSOLID →
            </a>
          </div>
          <p className="font-cinzel text-sm text-primary/80 italic">In God We Trust. Made in the USA Digital.</p>
          <p className="font-inter text-xs text-muted-foreground/50 mt-2">© 2026 Made in USA Digital. All Rights Reserved.</p>
        </motion.div>
      </div>
    </div>
  );
}