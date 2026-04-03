import React, { useState } from "react";
import { Filter, X, ChevronDown, SlidersHorizontal } from "lucide-react";

const CATEGORIES = ["All", "Clothing", "Accessories", "Home & Kitchen", "Food & Beverage", "Health & Beauty", "Technology", "Outdoor & Sport", "Furniture", "Tools & Hardware", "Services & Digital"];

const US_STATES = [
  "All States",
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY","DC"
];

const CERT_OPTIONS = [
  { value: "all", label: "Any Certification" },
  { value: "FTC Made in USA", label: "FTC Made in USA" },
  { value: "Union Label", label: "Union Label" },
  { value: "USDA Certified", label: "USDA Certified" },
  { value: "ISO Certified", label: "ISO Certified" },
  { value: "State Certification", label: "State Certification" },
  { value: "certified", label: "Any Certified" },
  { value: "none", label: "No Certification" },
];

const SORT_OPTIONS = [
  { value: "featured", label: "Featured First" },
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "name_az", label: "Name A–Z" },
  { value: "name_za", label: "Name Z–A" },
];

export default function MarketplaceFilters({ filters, onChange, resultCount }) {
  const [expanded, setExpanded] = useState(false);

  const set = (key, value) => onChange({ ...filters, [key]: value });

  const activeCount = [
    filters.category !== "All",
    filters.state !== "All States",
    filters.cert !== "all",
    filters.type !== "all",
    filters.sort !== "featured",
  ].filter(Boolean).length;

  const clearAll = () => onChange({
    category: "All",
    state: "All States",
    cert: "all",
    type: "all",
    sort: "featured",
  });

  return (
    <div className="bg-background/95 backdrop-blur-md border-b border-border/50">
      {/* Top row: categories + toggle */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => set("category", cat)}
              className={`px-3 py-1 rounded-full text-xs font-inter whitespace-nowrap transition-all shrink-0 ${
                filters.category === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}

          <div className="ml-auto flex items-center gap-2 shrink-0 pl-2">
            {activeCount > 0 && (
              <button onClick={clearAll} className="flex items-center gap-1 px-2 py-1 text-xs font-inter text-red-400 hover:text-red-300 transition-colors">
                <X className="w-3 h-3" /> Clear ({activeCount})
              </button>
            )}
            <button
              onClick={() => setExpanded((e) => !e)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-inter border transition-all ${
                expanded || activeCount > 0
                  ? "bg-primary/10 border-primary/30 text-primary"
                  : "bg-card border-border text-muted-foreground hover:border-primary/40"
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              More Filters
              {activeCount > 0 && <span className="bg-primary text-primary-foreground rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">{activeCount}</span>}
              <ChevronDown className={`w-3 h-3 transition-transform ${expanded ? "rotate-180" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Expanded row: state, cert, type, sort */}
      {expanded && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 border-t border-border/30">
          <div className="flex flex-wrap items-center gap-3">

            {/* State filter */}
            <div className="flex items-center gap-2">
              <label className="font-inter text-xs text-muted-foreground whitespace-nowrap">State:</label>
              <select
                value={filters.state}
                onChange={(e) => set("state", e.target.value)}
                className="bg-card border border-border rounded-lg px-2.5 py-1.5 text-xs font-inter text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
              >
                {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Certification filter */}
            <div className="flex items-center gap-2">
              <label className="font-inter text-xs text-muted-foreground whitespace-nowrap">Certification:</label>
              <select
                value={filters.cert}
                onChange={(e) => set("cert", e.target.value)}
                className="bg-card border border-border rounded-lg px-2.5 py-1.5 text-xs font-inter text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
              >
                {CERT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            {/* Type filter */}
            <div className="flex items-center gap-2">
              <label className="font-inter text-xs text-muted-foreground whitespace-nowrap">Type:</label>
              <div className="flex items-center gap-1">
                {[{ v: "all", l: "All" }, { v: "physical", l: "Physical" }, { v: "digital", l: "Digital" }].map(({ v, l }) => (
                  <button
                    key={v}
                    onClick={() => set("type", v)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-inter transition-all ${
                      filters.type === v
                        ? "bg-blue-700 text-white"
                        : "bg-card border border-border text-muted-foreground hover:border-blue-600/50"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2 sm:ml-auto">
              <label className="font-inter text-xs text-muted-foreground whitespace-nowrap">Sort:</label>
              <select
                value={filters.sort}
                onChange={(e) => set("sort", e.target.value)}
                className="bg-card border border-border rounded-lg px-2.5 py-1.5 text-xs font-inter text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
              >
                {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            {/* Result count */}
            <span className="font-inter text-xs text-muted-foreground ml-2">{resultCount} result{resultCount !== 1 ? "s" : ""}</span>
          </div>
        </div>
      )}
    </div>
  );
}