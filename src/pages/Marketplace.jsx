import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Sparkles, ArrowRight, ExternalLink, Star, Filter, X } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import CompanyCard from "../components/marketplace/CompanyCard";
import AISearchPanel from "../components/marketplace/AISearchPanel";
import { Link } from "react-router-dom";

const CATEGORIES = ["All", "Clothing", "Accessories", "Home & Kitchen", "Food & Beverage", "Health & Beauty", "Technology", "Outdoor & Sport", "Furniture", "Tools & Hardware", "Services & Digital"];

export default function Marketplace() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [showAI, setShowAI] = useState(false);
  const [typeFilter, setTypeFilter] = useState("all");

  const { data: companies = [], isLoading } = useQuery({
    queryKey: ["companies", "approved"],
    queryFn: () => base44.entities.Company.filter({ status: "approved" }),
  });

  const filtered = companies.filter((c) => {
    const matchCat = category === "All" || c.category === category;
    const matchType = typeFilter === "all" || c.type === typeFilter || c.type === "both";
    const matchSearch =
      !search ||
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.description?.toLowerCase().includes(search.toLowerCase()) ||
      c.tags?.toLowerCase().includes(search.toLowerCase()) ||
      c.location?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchType && matchSearch;
  });

  const featured = filtered.filter((c) => c.is_featured);
  const rest = filtered.filter((c) => !c.is_featured);

  return (
    <div className="pt-20 sm:pt-24 min-h-screen">
      {/* Hero Banner */}
      <section className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-background to-red-950/30 pointer-events-none" />
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="font-inter text-xs tracking-[0.3em] text-primary uppercase mb-3">
              MADEINUSA DIGITAL
            </p>
            <h1 className="font-cinzel text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
              The American Marketplace
            </h1>
            <div className="w-24 h-0.5 bg-primary mx-auto mb-6" />
            <p className="font-inter text-muted-foreground max-w-2xl mx-auto text-base mb-10">
              Discover, support, and buy from verified American-made companies and creators.
              Every listing is KYC-approved and proudly made on U.S. soil.
            </p>

            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row items-center gap-3 max-w-2xl mx-auto mb-4">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products, brands, or categories..."
                  className="w-full bg-card border border-border rounded-lg pl-11 pr-4 py-3 text-sm font-inter text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
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
                <Sparkles className="w-4 h-4" />
                AI Search
              </button>
            </div>

            <div className="flex items-center justify-center gap-4 text-xs font-inter text-muted-foreground">
              <Link to="/apply" className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors">
                <ArrowRight className="w-3 h-3" /> List Your American Business
              </Link>
              <span>•</span>
              <Link to="/companies" className="hover:text-primary transition-colors">
                Browse Curated Directory
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-[69px] z-40 bg-background/95 backdrop-blur-md border-b border-border/50 py-3 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-inter transition-all ${
                  category === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="sm:ml-auto flex items-center gap-2 shrink-0">
            {["all", "physical", "digital"].map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-3 py-1 rounded-full text-xs font-inter capitalize transition-all ${
                  typeFilter === t
                    ? "bg-blue-700 text-white"
                    : "bg-card border border-border text-muted-foreground hover:border-blue-600/50"
                }`}
              >
                {t === "all" ? "All Types" : t}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {isLoading ? (
          <div className="flex justify-center py-24">
            <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {featured.length > 0 && (
              <div className="mb-10">
                <div className="flex items-center gap-2 mb-4">
                  <Star className="w-4 h-4 text-primary" />
                  <h2 className="font-cinzel text-lg font-semibold text-foreground">Featured Companies</h2>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featured.map((c, i) => <CompanyCard key={c.id} company={c} index={i} featured />)}
                </div>
              </div>
            )}

            {rest.length > 0 ? (
              <>
                <h2 className="font-cinzel text-lg font-semibold text-foreground mb-4">
                  {filtered.length} Approved American {filtered.length === 1 ? "Company" : "Companies"}
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rest.map((c, i) => <CompanyCard key={c.id} company={c} index={i} />)}
                </div>
              </>
            ) : (
              <div className="text-center py-24">
                <p className="font-cinzel text-xl text-foreground mb-2">No matches found</p>
                <p className="font-inter text-sm text-muted-foreground mb-6">
                  Try our AI search or browse the full directory.
                </p>
                <button
                  onClick={() => setShowAI(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-cinzel text-sm tracking-wider"
                >
                  <Sparkles className="w-4 h-4" /> Ask AI
                </button>
              </div>
            )}

            {/* Source Links */}
            <div className="mt-16 border-t border-border/30 pt-10">
              <p className="font-cinzel text-sm text-muted-foreground mb-4 text-center">
                Curated from trusted sources
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {[
                  { label: "Made Index", url: "https://www.madeindex.com/" },
                  { label: "All American Clothing", url: "https://www.allamericanclothing.com/pages/100-american-companies-that-sell-usa-made-products" },
                  { label: "Authenticity50 Guide", url: "https://authenticity50.com/pages/a-guide-to-finding-american-made-products" },
                ].map((s) => (
                  <a
                    key={s.label}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 bg-card border border-border/50 rounded-lg text-xs font-inter text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" /> {s.label}
                  </a>
                ))}
              </div>
            </div>
          </>
        )}
      </section>

      {showAI && <AISearchPanel onClose={() => setShowAI(false)} />}
    </div>
  );
}