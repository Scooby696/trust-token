import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Globe, ExternalLink, Shield, Loader2, Search, Filter, X, Mail } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";

const CATEGORY_COLORS = {
  "Exchange": "bg-blue-900/40 text-blue-300",
  "DeFi": "bg-green-900/40 text-green-300",
  "Blockchain Infrastructure": "bg-cyan-900/40 text-cyan-300",
  "Payments": "bg-teal-900/40 text-teal-300",
  "Custody & Banking": "bg-yellow-900/40 text-yellow-300",
  "Developer Tools": "bg-orange-900/40 text-orange-300",
  "Analytics & Compliance": "bg-red-900/40 text-red-300",
  "NFT & Marketplace": "bg-purple-900/40 text-purple-300",
  "Media & Data": "bg-gray-700/40 text-gray-300",
  "Identity & Security": "bg-indigo-900/40 text-indigo-300",
  "Other": "bg-muted text-muted-foreground",
};

const CATEGORIES = ["All", "Exchange", "DeFi", "Blockchain Infrastructure", "Payments", "Custody & Banking", "Developer Tools", "Analytics & Compliance", "NFT & Marketplace", "Media & Data", "Identity & Security", "Other"];

export default function GlobalPartners() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    base44.entities.GlobalPartner.filter({ status: "approved" }, "-created_date", 100)
      .then(setPartners)
      .finally(() => setLoading(false));
  }, []);

  const filtered = partners.filter((p) => {
    const matchCat = category === "All" || p.category === category;
    const matchSearch = !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.country.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

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

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-center gap-3 mb-4">
              <Globe className="w-6 h-6 text-primary" />
              <p className="font-inter text-xs tracking-[0.35em] text-primary uppercase">Made in USA Digital · Worldwide</p>
            </div>
            <h1 className="font-cinzel text-4xl sm:text-5xl font-bold text-white mb-3 leading-tight">
              TRUSTED DIGITAL PARTNERS<br />WORLDWIDE
            </h1>
            <div className="w-32 h-0.5 bg-primary mx-auto mb-5" />
            <p className="font-inter text-sm sm:text-base text-white/65 max-w-2xl mx-auto leading-relaxed mb-8">
              The same stringent KYC vetting standards as our USA Marketplace — applied globally. Every partner is reviewed, verified, and approved before listing. No exceptions.
            </p>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
              {[
                { icon: Shield, label: "Same KYC Standards", desc: "As USA Marketplace" },
                { icon: Globe, label: "Global Reach", desc: "Partners Worldwide" },
              ].map(({ icon: Icon, label, desc }) => (
                <div key={label} className="flex items-center gap-2 px-4 py-2.5 bg-card border border-primary/20 rounded-xl">
                  <Icon className="w-4 h-4 text-primary shrink-0" />
                  <div className="text-left">
                    <p className="font-cinzel text-xs font-bold text-primary">{label}</p>
                    <p className="font-inter text-[10px] text-muted-foreground">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 text-center">
              <Link to="/digital" className="inline-flex items-center gap-2 font-cinzel tracking-wider text-xs px-5 py-2.5 border border-border text-muted-foreground rounded-lg hover:border-primary/40 hover:text-primary transition-colors">
                ← USA Digital Directory
              </Link>
              <a href="mailto:trusttokenbymadeintheusadigital@gmail.com"
                className="inline-flex items-center gap-2 font-cinzel tracking-wider text-xs px-5 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                <Mail className="w-3.5 h-3.5" /> Apply to Be Listed
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filter bar */}
      <div className="sticky top-[69px] z-40 bg-background/95 backdrop-blur-md border-b border-border/50 py-2 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-2">
          <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, country, or category..."
                className="w-full bg-card border border-border rounded-lg pl-11 pr-10 py-2 text-sm font-inter text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              )}
            </div>
            <span className="font-inter text-xs text-muted-foreground shrink-0">{filtered.length} partner{filtered.length !== 1 ? "s" : ""}</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
            {CATEGORIES.map((cat) => (
              <button key={cat} onClick={() => setCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-inter whitespace-nowrap transition-all shrink-0 ${
                  category === cat ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:border-primary/50"
                }`}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Partners grid */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {loading ? (
          <div className="flex items-center justify-center py-24 gap-3">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <span className="font-inter text-sm text-muted-foreground">Loading global partners...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-border rounded-2xl">
            <Globe className="w-14 h-14 text-muted-foreground/20 mx-auto mb-4" />
            <p className="font-cinzel text-2xl text-foreground mb-2">
              {partners.length === 0 ? "Partners Coming Soon" : "No Results Found"}
            </p>
            <p className="font-inter text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed mb-6">
              {partners.length === 0
                ? "We are actively vetting global digital partners. Approved partners will appear here as they are verified."
                : "Try adjusting your search or filter."}
            </p>
            {partners.length === 0 && (
              <a href="mailto:trusttokenbymadeintheusadigital@gmail.com"
                className="inline-flex items-center gap-2 font-cinzel tracking-wider text-sm px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                <Mail className="w-4 h-4" /> Apply to Be Listed
              </a>
            )}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((partner, i) => (
              <motion.div key={partner.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-card border border-border/50 rounded-xl p-5 hover:border-primary/40 transition-all group flex flex-col"
              >
                {partner.is_featured && (
                  <span className="self-start px-2 py-0.5 bg-primary/20 border border-primary/40 text-primary text-[10px] font-cinzel rounded-full mb-2">★ Featured</span>
                )}
                <div className="flex items-start justify-between mb-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-inter ${CATEGORY_COLORS[partner.category] || "bg-muted text-muted-foreground"}`}>
                    {partner.category}
                  </span>
                  <span className="font-inter text-[10px] text-muted-foreground border border-border/50 px-2 py-0.5 rounded-full shrink-0 ml-1">
                    🌐 {partner.country}
                  </span>
                </div>

                {partner.logo_url && (
                  <img src={partner.logo_url} alt={partner.name} className="w-10 h-10 rounded-lg object-contain mb-3 bg-background border border-border/30 p-1" />
                )}

                <h3 className="font-cinzel font-bold text-foreground group-hover:text-primary transition-colors mb-1">{partner.name}</h3>

                {partner.highlight && (
                  <p className="font-inter text-xs text-primary font-semibold mb-2">{partner.highlight}</p>
                )}

                <p className="font-inter text-sm text-muted-foreground leading-relaxed mb-4 flex-1">{partner.description}</p>

                <div className="flex items-center justify-between pt-3 border-t border-border/30">
                  <div className="flex items-center gap-1">
                    <Shield className="w-3 h-3 text-green-400" />
                    <span className="font-inter text-[10px] text-green-400">Vetted & Approved</span>
                  </div>
                  <a href={partner.website} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 font-cinzel text-xs text-primary hover:underline">
                    Visit <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-12 pt-8 border-t border-border/30 text-center space-y-3">
          <p className="font-cinzel text-sm text-foreground">Want to be listed as a Trusted Digital Partner?</p>
          <a href="mailto:trusttokenbymadeintheusadigital@gmail.com"
            className="inline-flex items-center gap-2 font-cinzel tracking-wider text-sm px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
            <Mail className="w-4 h-4" /> Apply to Be Listed
          </a>
          <p className="font-inter text-xs text-muted-foreground/50">All partners undergo the same stringent vetting as our USA Marketplace</p>
        </div>
      </section>
    </div>
  );
}