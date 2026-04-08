import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, X, ShoppingBag } from "lucide-react";
import { SHOP_PRODUCTS, SHOP_CATEGORIES } from "../lib/shopProducts";
import ProductCard from "../components/shop/ProductCard";
import { Link } from "react-router-dom";

export default function Shop() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = SHOP_PRODUCTS.filter((p) => {
    const matchCat = category === "All" || p.category === category;
    const matchSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const featured = filtered.filter((p) => p.featured);
  const rest = filtered.filter((p) => !p.featured);

  return (
    <div className="pt-20 sm:pt-24 min-h-screen">
      {/* Hero */}
      <section className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-border/30">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/60 via-background to-red-950/30 pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-1 flex">
          <div className="flex-1 bg-red-600" />
          <div className="flex-1 bg-white/80" />
          <div className="flex-1 bg-blue-700" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-center gap-3 mb-4">
              <ShoppingBag className="w-6 h-6 text-primary" />
              <p className="font-inter text-xs tracking-[0.35em] text-primary uppercase">
                MADE IN USA DIGITAL · Shop American
              </p>
              <ShoppingBag className="w-6 h-6 text-primary" />
            </div>

            <h1 className="font-cinzel text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-3 leading-tight">
              AMERICAN-MADE<br />PRODUCTS
            </h1>
            <div className="w-32 h-0.5 bg-primary mx-auto mb-5" />
            <p className="font-inter text-sm sm:text-base text-white/65 max-w-2xl mx-auto leading-relaxed mb-10">
              Every product is made on American soil by KYC-verified manufacturers.
              Click <strong className="text-white">Buy Now</strong> to purchase directly from the maker and support domestic commerce.
            </p>

            {/* Search */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products, brands, or locations..."
                className="w-full bg-card border border-border rounded-xl pl-11 pr-10 py-3.5 text-sm font-inter text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Filter Bar */}
      <div className="sticky top-[69px] z-40 bg-background/95 backdrop-blur-md border-b border-border/50 py-2 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto pb-1">
          <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
          {SHOP_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-inter whitespace-nowrap transition-all shrink-0 ${
                category === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-muted-foreground hover:border-primary/50"
              }`}
            >
              {cat}
            </button>
          ))}
          <span className="ml-auto shrink-0 font-inter text-xs text-muted-foreground">
            {filtered.length} products
          </span>
        </div>
      </div>

      {/* Products Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Featured */}
        {featured.length > 0 && (
          <div className="mb-12">
            <h2 className="font-cinzel text-lg font-semibold text-foreground mb-5 flex items-center gap-2">
              ★ Featured Products
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featured.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        )}

        {/* All products */}
        {rest.length > 0 && (
          <div>
            {featured.length > 0 && (
              <h2 className="font-cinzel text-lg font-semibold text-foreground mb-5">All Products</h2>
            )}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {rest.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-24">
            <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="font-cinzel text-xl text-foreground mb-2">No products found</p>
            <p className="font-inter text-sm text-muted-foreground mb-6">Try a different search or category.</p>
            <button
              onClick={() => { setSearch(""); setCategory("All"); }}
              className="px-6 py-2.5 border border-border text-muted-foreground rounded-lg font-inter text-sm hover:border-primary/40 hover:text-primary transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </section>

      {/* CTA — List your product */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-border/30">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <p className="font-inter text-xs tracking-[0.3em] text-primary uppercase mb-3">Are you a maker?</p>
          <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-foreground mb-4">
            List Your American-Made Products
          </h2>
          <p className="font-inter text-sm text-muted-foreground leading-relaxed mb-6">
            Apply for KYC verification and get your products featured in the only marketplace exclusively dedicated to American-made goods.
          </p>
          <Link
            to="/apply"
            className="inline-flex items-center gap-2 font-cinzel tracking-wider text-sm px-8 py-4 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
          >
            Apply Now →
          </Link>
        </motion.div>
      </section>
    </div>
  );
}