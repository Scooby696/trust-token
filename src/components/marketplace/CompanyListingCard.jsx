import React, { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, MapPin, Star, MessageSquare, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";

const CATEGORY_COLORS = {
  "Clothing": "bg-blue-900/30 text-blue-300",
  "Accessories": "bg-purple-900/30 text-purple-300",
  "Home & Kitchen": "bg-yellow-900/30 text-yellow-300",
  "Furniture": "bg-amber-900/30 text-amber-300",
  "Outdoor & Sport": "bg-green-900/30 text-green-300",
  "Tools & Hardware": "bg-orange-900/30 text-orange-300",
  "Health & Beauty": "bg-pink-900/30 text-pink-300",
  "Food & Beverage": "bg-red-900/30 text-red-300",
  "Technology": "bg-cyan-900/30 text-cyan-300",
  "Other": "bg-gray-900/30 text-gray-300",
};

function StarRow({ rating, size = "sm" }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} className={`${size === "sm" ? "w-3 h-3" : "w-4 h-4"} ${s <= rating ? "text-primary fill-primary" : "text-border"}`} />
      ))}
    </div>
  );
}

export default function CompanyListingCard({ company, index, onReview, onAnalyze }) {
  const [expanded, setExpanded] = useState(false);

  const { data: reviews = [] } = useQuery({
    queryKey: ["reviews", company.slug],
    queryFn: () => base44.entities.CompanyReview.filter({ company_slug: company.slug }),
  });

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: (index % 8) * 0.04 }}
      className="bg-card border border-border/50 rounded-xl overflow-hidden hover:border-primary/30 transition-all group flex flex-col"
    >
      {/* Number badge */}
      <div className="flex items-start justify-between px-4 pt-4 pb-2">
        <span className="font-cinzel text-xs text-muted-foreground font-semibold">#{company.num}</span>
        <span className={`px-2 py-0.5 rounded-full text-xs font-inter ${CATEGORY_COLORS[company.category] || "bg-muted text-muted-foreground"}`}>
          {company.category}
        </span>
      </div>

      <div className="px-4 pb-2 flex-1">
        <h3 className="font-cinzel font-bold text-foreground text-sm group-hover:text-primary transition-colors mb-1 leading-snug">
          {company.name}
        </h3>

        {/* Rating row */}
        {avgRating ? (
          <div className="flex items-center gap-1.5 mb-2">
            <StarRow rating={Math.round(parseFloat(avgRating))} />
            <span className="font-inter text-xs text-muted-foreground">{avgRating} ({reviews.length})</span>
          </div>
        ) : (
          <button onClick={onReview} className="flex items-center gap-1 mb-2 font-inter text-xs text-muted-foreground/60 hover:text-primary transition-colors">
            <Star className="w-3 h-3" /> Be the first to review
          </button>
        )}

        <p className={`font-inter text-xs text-muted-foreground leading-relaxed ${expanded ? "" : "line-clamp-2"}`}>
          {company.desc}
        </p>
        {company.desc.length > 100 && (
          <button onClick={() => setExpanded(!expanded)} className="flex items-center gap-0.5 mt-1 font-inter text-xs text-primary/70 hover:text-primary">
            {expanded ? <><ChevronUp className="w-3 h-3" /> Less</> : <><ChevronDown className="w-3 h-3" /> More</>}
          </button>
        )}

        {company.location && (
          <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground font-inter">
            <MapPin className="w-3 h-3 shrink-0" /> {company.location}
          </div>
        )}
      </div>

      {/* Latest review snippet */}
      {reviews.length > 0 && (
        <div className="mx-4 mb-3 px-3 py-2 bg-background/50 border border-border/30 rounded-lg">
          <div className="flex items-center gap-1.5 mb-1">
            <StarRow rating={reviews[0].rating} />
            <span className="font-inter text-xs text-muted-foreground">{reviews[0].reviewer_name}</span>
          </div>
          <p className="font-inter text-xs text-muted-foreground/80 line-clamp-2 italic">"{reviews[0].body}"</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-2 px-4 pb-4 mt-auto">
        <div className="flex items-center gap-2">
          <a href={company.url} target="_blank" rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-primary/10 text-primary rounded-lg text-xs font-inter hover:bg-primary/20 transition-colors">
            Visit <ExternalLink className="w-3 h-3" />
          </a>
          <button onClick={onReview}
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-card border border-border rounded-lg text-xs font-inter text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors">
            <MessageSquare className="w-3 h-3" /> Review
          </button>
        </div>
        {onAnalyze && (
          <button onClick={onAnalyze}
            className="flex items-center justify-center gap-1.5 w-full py-1.5 bg-primary/5 border border-primary/20 text-primary rounded-lg text-xs font-inter hover:bg-primary/15 transition-colors">
            <Sparkles className="w-3 h-3" /> AI Analysis
          </button>
        )}
      </div>
    </motion.div>
  );
}