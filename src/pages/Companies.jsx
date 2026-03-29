import React, { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Search } from "lucide-react";
import { Link } from "react-router-dom";

// Curated list aggregated from the three source sites
const CURATED_COMPANIES = [
  // Clothing
  { name: "All American Clothing Co.", category: "Clothing", location: "Arcanum, OH", desc: "100% American-made denim, jeans, shirts, and workwear since 1998.", url: "https://www.allamericanclothing.com/", source: "allamericanclothing" },
  { name: "Hertling USA", category: "Clothing", location: "New England", desc: "Men's tailored trousers, chinos, and shirts made in New England since 1925.", url: "https://www.hertlingusa.com/", source: "madeindex" },
  { name: "Loyal Stricklin", category: "Clothing", location: "Nashville, TN", desc: "Leather, denim, and waxed canvas goods. Based in Nashville.", url: "https://loyalstricklin.com/", source: "madeindex" },
  { name: "US Blanks", category: "Clothing", location: "Los Angeles, CA", desc: "Premium blank apparel — tops, bottoms, outerwear — made in the USA.", url: "https://usblanks.net/", source: "madeindex" },
  { name: "Vermont Glove", category: "Accessories", location: "Vermont", desc: "Quality leather gloves made in Vermont since 1920.", url: "https://vermontglove.com/", source: "madeindex" },
  { name: "KILLSPENCER", category: "Accessories", location: "Los Angeles, CA", desc: "Backpacks, duffle bags, and accessories designed and made in LA.", url: "https://killspencer.com/", source: "madeindex" },
  // Home & Kitchen
  { name: "All-Clad", category: "Home & Kitchen", location: "Canonsburg, PA", desc: "Stainless steel cookware and bakeware crafted in Pennsylvania for over 50 years.", url: "https://www.all-clad.com/", source: "allamericanclothing" },
  { name: "Lodge Cast Iron", category: "Home & Kitchen", location: "South Pittsburg, TN", desc: "America's oldest and largest cast iron manufacturer since 1896.", url: "https://www.lodgecastiron.com/", source: "authenticity50" },
  { name: "Finex Cast Iron", category: "Home & Kitchen", location: "Portland, OR", desc: "Innovative cast iron skillets made by Portland craftspeople.", url: "https://finexusa.com/", source: "madeindex" },
  { name: "East Fork", category: "Home & Kitchen", location: "Asheville, NC", desc: "Handmade mugs, plates, and drinkware in Asheville, NC.", url: "https://www.eastfork.com/", source: "authenticity50" },
  { name: "Vitamix", category: "Home & Kitchen", location: "Olmsted Township, OH", desc: "World-class blenders made in Ohio for over 80 years.", url: "https://www.vitamix.com/", source: "authenticity50" },
  { name: "Liberty Tabletop", category: "Home & Kitchen", location: "Sherrill, NY", desc: "The only flatware made in the USA.", url: "https://www.libertytabletop.com/", source: "authenticity50" },
  { name: "Nordicware", category: "Home & Kitchen", location: "Minneapolis, MN", desc: "Premium bakeware and kitchenware made in Minneapolis since 1946.", url: "https://www.nordicware.com/", source: "authenticity50" },
  { name: "USA Pan", category: "Home & Kitchen", location: "Pittsburgh, PA", desc: "Professional-grade bakeware made in the USA.", url: "https://www.usapan.com/", source: "authenticity50" },
  { name: "Pyrex", category: "Home & Kitchen", location: "Charleroi, PA", desc: "American-made glassware and bakeware for over 80 years.", url: "https://corelle.com/pages/pyrex", source: "authenticity50" },
  // Furniture
  { name: "Grovemade", category: "Furniture", location: "Portland, OR", desc: "Beautifully crafted wood desk accessories and home goods.", url: "https://grovemade.com/", source: "authenticity50" },
  { name: "Room and Board", category: "Furniture", location: "Minneapolis, MN", desc: "Modern furniture made with American craftsmanship.", url: "https://www.roomandboard.com/", source: "authenticity50" },
  { name: "Maiden Home", category: "Furniture", location: "North Carolina", desc: "Custom sofas, beds, and chairs made in North Carolina.", url: "https://maidenhome.com/", source: "authenticity50" },
  { name: "Shelfology", category: "Furniture", location: "Idaho", desc: "Well-designed shelving and storage crafted in Idaho.", url: "https://shelfology.com/", source: "madeindex" },
  // Accessories / Bags
  { name: "Tanner Goods", category: "Accessories", location: "Portland, OR", desc: "Leather & canvas bags, wallets, and belts made in Portland.", url: "https://www.tannergoods.com/", source: "authenticity50" },
  { name: "Duluth Pack", category: "Accessories", location: "Duluth, MN", desc: "Handcrafted canvas and leather packs since 1882.", url: "https://www.duluthpack.com/", source: "authenticity50" },
  { name: "GORUCK", category: "Outdoor & Sport", location: "Jacksonville, FL", desc: "Military-grade rucksacks and apparel designed by Special Forces.", url: "https://www.goruck.com/", source: "authenticity50" },
  { name: "Filson", category: "Accessories", location: "Seattle, WA", desc: "Canvas bags, briefcases, and work clothing built to last.", url: "https://www.filson.com/", source: "authenticity50" },
  // Health & Beauty
  { name: "Clue Perfumery", category: "Health & Beauty", location: "Chicago, IL", desc: "Independent perfumery formulating everything in-house in Chicago since 2023.", url: "https://www.clueperfumery.com/", source: "madeindex" },
  { name: "American Blanket Company", category: "Home & Kitchen", location: "Massachusetts", desc: "Premium wool, fleece, and cotton blankets made in Massachusetts.", url: "https://www.americanblanketcompany.com/", source: "allamericanclothing" },
  { name: "Authenticity50", category: "Home & Kitchen", location: "Vancouver, WA", desc: "Seed-to-Stitch® bed sheets, blankets, and home goods made 100% in the USA.", url: "https://authenticity50.com/", source: "authenticity50" },
  { name: "Pendleton", category: "Home & Kitchen", location: "Portland, OR", desc: "Iconic wool blankets and throws woven in America.", url: "https://www.pendleton-usa.com/", source: "authenticity50" },
  { name: "Sophie Buhai", category: "Accessories", location: "Los Angeles, CA", desc: "Heirloom-quality modernist jewelry designed for everyday wear.", url: "https://www.sophiebuhai.com/", source: "madeindex" },
  // Food & Tools
  { name: "American Skillet Company", category: "Home & Kitchen", location: "Wisconsin", desc: "Handmade cast iron skillets in the shape of US states.", url: "https://americanskilletcompany.com/", source: "allamericanclothing" },
  { name: "American Mule Company", category: "Home & Kitchen", location: "Arizona", desc: "Handcrafted copper Moscow Mule mugs by US artisans.", url: "https://www.theamericanmule.com/", source: "allamericanclothing" },
];

const CATEGORIES = ["All", "Clothing", "Accessories", "Home & Kitchen", "Furniture", "Outdoor & Sport", "Health & Beauty", "Food & Beverage", "Technology", "Services & Digital"];
const SOURCES = [
  { key: "all", label: "All Sources" },
  { key: "madeindex", label: "Made Index" },
  { key: "allamericanclothing", label: "All American Clothing" },
  { key: "authenticity50", label: "Authenticity50" },
];

export default function Companies() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [source, setSource] = useState("all");

  const filtered = CURATED_COMPANIES.filter((c) => {
    const matchCat = category === "All" || c.category === category;
    const matchSource = source === "all" || c.source === source;
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.desc.toLowerCase().includes(search.toLowerCase()) || c.location.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSource && matchSearch;
  });

  return (
    <div className="pt-20 sm:pt-24 min-h-screen">
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <p className="font-inter text-xs tracking-[0.3em] text-primary uppercase mb-3">Verified Directory</p>
          <h1 className="font-cinzel text-4xl sm:text-5xl font-bold text-foreground mb-4">
            American-Made Companies
          </h1>
          <div className="w-24 h-0.5 bg-primary mx-auto mb-6" />
          <p className="font-inter text-muted-foreground max-w-2xl mx-auto">
            Curated from the most trusted Made in USA directories. Every company below crafts their goods on American soil.
          </p>
        </motion.div>

        {/* Search + Filters */}
        <div className="flex flex-col gap-4 mb-8">
          <div className="relative max-w-lg mx-auto w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search companies..."
              className="w-full bg-card border border-border rounded-lg pl-11 pr-4 py-3 text-sm font-inter text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {CATEGORIES.map((cat) => (
              <button key={cat} onClick={() => setCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-inter transition-all ${category === cat ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:border-primary/50"}`}>
                {cat}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {SOURCES.map((s) => (
              <button key={s.key} onClick={() => setSource(s.key)}
                className={`px-3 py-1 rounded-full text-xs font-inter transition-all ${source === s.key ? "bg-blue-700 text-white" : "bg-card border border-border text-muted-foreground hover:border-blue-600/50"}`}>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <p className="font-inter text-xs text-muted-foreground mb-6 text-center">{filtered.length} companies</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((c, i) => (
            <motion.a
              key={c.name}
              href={c.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 9) * 0.05 }}
              className="group bg-card border border-border/50 rounded-lg p-5 hover:border-primary/40 transition-all"
            >
              <div className="flex items-start justify-between mb-2">
                <span className="font-cinzel font-semibold text-foreground group-hover:text-primary transition-colors text-sm">{c.name}</span>
                <ExternalLink className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
              </div>
              <p className="font-inter text-xs text-muted-foreground leading-relaxed mb-3">{c.desc}</p>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-inter">{c.category}</span>
                <span className="text-xs text-muted-foreground font-inter">{c.location}</span>
              </div>
            </motion.a>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="font-inter text-sm text-muted-foreground mb-4">Are you an American maker or business?</p>
          <Link to="/apply" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-cinzel text-sm tracking-wider hover:bg-primary/90 transition-colors">
            Apply for Listing <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}