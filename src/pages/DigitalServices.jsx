import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Star, Filter, X, Zap, Shield, TrendingUp, Globe, Sparkles, ExternalLink } from "lucide-react";
import { SPOTLIGHT_10, ALL_100_DIGITAL, DIGITAL_CATEGORIES } from "../lib/digitalServicesData";
import ProviderCard from "../components/digital/ProviderCard";
import AIProviderSearch from "../components/digital/AIProviderSearch";
import GlobalPartnersSection from "../components/GlobalPartnersSection";

const CATEGORY_COLORS = {
  "Exchange": "bg-blue-900/40 text-blue-300",
  "Blockchain Infrastructure": "bg-cyan-900/40 text-cyan-300",
  "DeFi": "bg-green-900/40 text-green-300",
  "NFT & Marketplace": "bg-purple-900/40 text-purple-300",
  "NFT & Gaming": "bg-violet-900/40 text-violet-300",
  "Custody & Banking": "bg-yellow-900/40 text-yellow-300",
  "Stablecoin & Payments": "bg-emerald-900/40 text-emerald-300",
  "Payments": "bg-teal-900/40 text-teal-300",
  "Developer Tools": "bg-orange-900/40 text-orange-300",
  "Analytics & Compliance": "bg-red-900/40 text-red-300",
  "Venture Capital": "bg-pink-900/40 text-pink-300",
  "Identity & Security": "bg-indigo-900/40 text-indigo-300",
  "Media & Data": "bg-gray-700/40 text-gray-300",
};

function SpotlightCard({ company, index }) {
  const isSponsored = !!company.sponsored;
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07 }}
      className={`relative rounded-xl p-6 transition-all group flex flex-col ${
        isSponsored
          ? "bg-gradient-to-br from-primary/20 via-card to-yellow-900/10 border-2 border-primary shadow-lg shadow-primary/20 hover:border-primary/80"
          : "bg-gradient-to-br from-card via-card to-primary/5 border border-primary/30 hover:border-primary/60"
      }`}
    >
      {isSponsored && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-primary text-primary-foreground rounded-full text-[10px] font-inter font-bold tracking-widest uppercase shadow-lg whitespace-nowrap">
          ★ Sponsored #1 Spot
        </div>
      )}
      <div className={`absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center font-cinzel font-bold text-xs shadow-lg ${isSponsored ? "bg-primary text-primary-foreground ring-2 ring-yellow-400" : "bg-primary text-primary-foreground"}`}>
        #{company.rank}
      </div>

      <div className="flex items-start justify-between mb-3">
        <span className={`px-2 py-0.5 rounded-full text-xs font-inter ${CATEGORY_COLORS[company.category] || CATEGORY_COLORS[company.tags?.[0]] || "bg-muted text-muted-foreground"}`}>
          {company.tags?.[0]}
        </span>
        <Star className={`w-4 h-4 shrink-0 ${isSponsored ? "text-yellow-400 fill-yellow-400" : "text-primary fill-primary"}`} />
      </div>

      <h3 className="font-cinzel font-bold text-foreground text-lg group-hover:text-primary transition-colors mb-1">
        {company.name}
      </h3>
      <p className="font-inter text-xs text-muted-foreground mb-1">{company.location} · Est. {company.founded}</p>

      <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-primary/10 border border-primary/20 rounded-md mb-3 w-fit">
        <Zap className="w-3 h-3 text-primary" />
        <span className="font-inter text-xs text-primary font-semibold">{company.highlight}</span>
      </div>

      <p className="font-inter text-sm text-muted-foreground leading-relaxed mb-4 flex-1">{company.desc}</p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {company.tags.map((tag) => (
          <span key={tag} className="px-2 py-0.5 bg-background border border-border/50 rounded-full text-xs font-inter text-muted-foreground">
            {tag}
          </span>
        ))}
      </div>

      <a href={company.url} target="_blank" rel="noopener noreferrer"
        className="flex items-center justify-center gap-1.5 py-2.5 bg-primary text-primary-foreground rounded-lg text-xs font-cinzel tracking-wider hover:bg-primary/90 transition-colors">
        Visit Website <ExternalLink className="w-3 h-3" />
      </a>
    </motion.div>
  );
}

export default function DigitalServices() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [activeTab, setActiveTab] = useState("directory");
  const [showAI, setShowAI] = useState(false);

  const filtered = ALL_100_DIGITAL.filter((c) => {
    const matchCat = category === "All" || c.category === category;
    const matchSearch =
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.desc.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const TABS = [
    { id: "spotlight", label: "Top 10 Spotlight", icon: Star },
    { id: "directory", label: "Full Directory", icon: Globe },
  ];

  return (
    <div className="pt-20 sm:pt-24 min-h-screen">
      {/* Hero */}
      <section className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-border/30">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/50 via-background to-purple-950/30 pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-1 flex">
          <div className="flex-1 bg-red-600" />
          <div className="flex-1 bg-white/80" />
          <div className="flex-1 bg-blue-700" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-center gap-3 mb-4">
              <Globe className="w-6 h-6 text-primary" />
              <p className="font-inter text-xs tracking-[0.35em] text-primary uppercase">MADE IN THE USA DIGITAL · powered by TRUST TOKEN</p>
              <Globe className="w-6 h-6 text-primary" />
            </div>
            <h1 className="font-cinzel text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-3 leading-tight">
              DIGITAL SERVICES<br />DIRECTORY
            </h1>
            <div className="w-32 h-0.5 bg-primary mx-auto mb-4" />
            <p className="font-cinzel text-lg sm:text-xl text-primary tracking-[0.12em] font-semibold mb-6">
              100 US-Based Cryptocurrency & Blockchain Companies
            </p>
            <p className="font-inter text-sm sm:text-base text-white/60 max-w-2xl mx-auto leading-relaxed mb-8">
              America leads the world in blockchain innovation. AI-powered provider matching, community reviews, and verified US-based digital services — all in one place.
            </p>

            {/* Stats */}
            <div className="flex items-center justify-center gap-6 sm:gap-12 mb-8">
              {[
                { value: "100+", label: "US Companies" },
                { value: "14", label: "Categories" },
                { value: "AI", label: "Powered Search" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="font-cinzel text-xl sm:text-2xl font-bold text-primary">{stat.value}</p>
                  <p className="font-inter text-xs text-muted-foreground mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* AI Search CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
              <button onClick={() => setShowAI(true)}
                className="flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-cinzel text-sm tracking-wider hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                <Sparkles className="w-5 h-5" /> AI Provider Search + Survey
              </button>
              <p className="font-inter text-xs text-muted-foreground">Personalized recommendations from our directory + the web</p>
            </div>

            {/* Tabs */}
            <div className="flex items-center justify-center gap-2">
              {TABS.map((tab) => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-cinzel text-sm tracking-wider transition-all ${
                    activeTab === tab.id
                      ? "bg-card border border-primary/40 text-primary"
                      : "bg-card/50 border border-border text-muted-foreground hover:border-primary/30"
                  }`}>
                  <tab.icon className="w-4 h-4" /> {tab.label}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* SPOTLIGHT TAB */}
      {activeTab === "spotlight" && (
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-full mb-4">
              <Star className="w-4 h-4 text-primary fill-primary" />
              <span className="font-cinzel text-sm text-primary tracking-wider">TOP 10 SPOTLIGHT</span>
            </div>
            <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-foreground mb-3">
              America's Elite Crypto & Blockchain Companies
            </h2>
            <p className="font-inter text-sm text-muted-foreground max-w-2xl mx-auto">
              The most impactful US-based cryptocurrency and blockchain companies shaping the global digital economy.
            </p>
          </motion.div>

          {/* Paid promotion disclosure */}
          <div className="mb-8 flex items-start gap-3 px-4 py-3 bg-primary/5 border border-primary/20 rounded-xl max-w-3xl mx-auto text-center justify-center">
            <p className="font-inter text-xs text-muted-foreground leading-relaxed">
              <span className="text-primary font-semibold">★ Sponsored Disclosure:</span> The top 10 spotlight positions are paid promotional placements. All featured companies have been reviewed and are verified trusted services. Some providers may operate or offer services from the USA. Sponsored rankings do not reflect editorial endorsement beyond verification of legitimacy.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {SPOTLIGHT_10.map((company, i) => (
              <SpotlightCard key={company.name} company={company} index={i} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <button onClick={() => setActiveTab("directory")}
              className="inline-flex items-center gap-2 px-6 py-3 bg-card border border-primary/30 text-primary rounded-lg font-cinzel text-sm tracking-wider hover:bg-primary/10 transition-colors">
              <Globe className="w-4 h-4" /> View Full 100-Company Directory with Reviews
            </button>
          </div>
        </section>
      )}

      {/* DIRECTORY TAB */}
      {activeTab === "directory" && (
        <>
          {/* Filter bar */}
          <div className="sticky top-[69px] z-40 bg-background/95 backdrop-blur-md border-b border-border/50 py-2 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto space-y-2">
              <div className="flex items-center gap-2">
                <div className="relative flex-1 max-w-xl">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input value={search} onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by company, technology, or category..."
                    className="w-full bg-card border border-border rounded-lg pl-11 pr-10 py-2 text-sm font-inter text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  {search && (
                    <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                      <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                  )}
                </div>
                <button onClick={() => setShowAI(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-cinzel tracking-wider hover:bg-primary/90 transition-colors whitespace-nowrap">
                  <Sparkles className="w-3.5 h-3.5" /> AI Search
                </button>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
                {DIGITAL_CATEGORIES.map((cat) => (
                  <button key={cat} onClick={() => setCategory(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-inter whitespace-nowrap transition-all shrink-0 ${
                      category === cat
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border border-border text-muted-foreground hover:border-primary/50"
                    }`}>
                    {cat}
                  </button>
                ))}
                <span className="ml-auto shrink-0 font-inter text-xs text-muted-foreground">{filtered.length} companies</span>
              </div>
            </div>
          </div>

          <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((company, i) => (
                <ProviderCard key={company.name} company={company} index={i} />
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-24">
                <Globe className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="font-cinzel text-xl text-foreground mb-2">No results found</p>
                <p className="font-inter text-sm text-muted-foreground mb-5">Try the AI search for smarter matching.</p>
                <button onClick={() => setShowAI(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-cinzel text-sm tracking-wider">
                  <Sparkles className="w-4 h-4" /> Ask AI
                </button>
              </div>
            )}

            <div className="mt-12 pt-8 border-t border-border/30 text-center">
              <p className="font-inter text-xs text-muted-foreground">
                Source:{" "}
                <a href="https://ensun.io/search/cryptocurrency/united-states" target="_blank" rel="noopener noreferrer"
                  className="text-primary/70 hover:text-primary underline inline-flex items-center gap-1">
                  ensun.io <ExternalLink className="w-3 h-3" />
                </a>
                {" "}· Curated US-based cryptocurrency & blockchain companies
              </p>
            </div>
          </section>
        </>
      )}

      <GlobalPartnersSection />

      {showAI && <AIProviderSearch onClose={() => setShowAI(false)} />}
    </div>
  );
}