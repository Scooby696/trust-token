import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Sparkles, Star, ExternalLink, MessageSquare, Filter, X } from "lucide-react";
import { ALL_100_COMPANIES, CATEGORIES_100 } from "../lib/allAmericanCompanies";
import CompanyListingCard from "../components/marketplace/CompanyListingCard";
import AIShoppingAssistant from "../components/marketplace/AIShoppingAssistant";
import ReviewModal from "../components/marketplace/ReviewModal";
import AICompanyAnalysis from "../components/AICompanyAnalysis";

export default function Hundred() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [showAI, setShowAI] = useState(false);
  const [reviewCompany, setReviewCompany] = useState(null);
  const [analysisCompany, setAnalysisCompany] = useState(null);

  const filtered = ALL_100_COMPANIES.filter((c) => {
    const matchCat = category === "All" || c.category === category;
    const matchSearch =
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.desc.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="pt-20 sm:pt-24 min-h-screen">
      {/* Hero */}
      <section className="relative py-14 sm:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-border/30">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/60 via-background to-red-950/30 pointer-events-none" />
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="font-inter text-xs tracking-[0.3em] text-primary uppercase mb-3">
              Curated from AllAmericanClothing.com
            </p>
            <h1 className="font-cinzel text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-3">
              100 American Companies
            </h1>
            <div className="w-24 h-0.5 bg-primary mx-auto mb-5" />
            <p className="font-inter text-muted-foreground max-w-2xl mx-auto text-sm mb-8">
              Every company on this list sells products made on American soil. Shop smart, shop patriotic, keep jobs in the USA.
            </p>

            {/* Search + AI row */}
            <div className="flex flex-col sm:flex-row items-center gap-3 max-w-2xl mx-auto mb-3">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name, product, or location..."
                  className="w-full bg-card border border-border rounded-lg pl-11 pr-10 py-3 text-sm font-inter text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                {search && (
                  <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                )}
              </div>
              <button
                onClick={() => setShowAI(true)}
                className="flex items-center gap-2 px-5 py-3 bg-primary text-primary-foreground rounded-lg font-cinzel text-sm tracking-wider hover:bg-primary/90 transition-colors whitespace-nowrap"
              >
                <Sparkles className="w-4 h-4" /> AI Shopping
              </button>
            </div>

            <p className="font-inter text-xs text-muted-foreground">
              Source:{" "}
              <a href="https://www.allamericanclothing.com/pages/100-american-companies-that-sell-usa-made-products"
                target="_blank" rel="noopener noreferrer"
                className="text-primary/70 hover:text-primary underline inline-flex items-center gap-1">
                AllAmericanClothing.com <ExternalLink className="w-3 h-3" />
              </a>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category filter bar */}
      <div className="sticky top-[69px] z-40 bg-background/95 backdrop-blur-md border-b border-border/50 py-2 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
          {CATEGORIES_100.map((cat) => (
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

      {/* Grid */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((company, i) => (
            <CompanyListingCard
              key={company.slug}
              company={company}
              index={i}
              onReview={() => setReviewCompany(company)}
              onAnalyze={() => setAnalysisCompany(company)}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-24">
            <p className="font-cinzel text-xl text-foreground mb-2">No results found</p>
            <p className="font-inter text-sm text-muted-foreground mb-5">Try the AI assistant for smarter search.</p>
            <button onClick={() => setShowAI(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-cinzel text-sm tracking-wider">
              <Sparkles className="w-4 h-4" /> Ask AI
            </button>
          </div>
        )}
      </section>

      {showAI && <AIShoppingAssistant onClose={() => setShowAI(false)} />}
      {reviewCompany && <ReviewModal company={reviewCompany} onClose={() => setReviewCompany(null)} />}
      {analysisCompany && <AICompanyAnalysis company={analysisCompany} onClose={() => setAnalysisCompany(null)} />}
    </div>
  );
}