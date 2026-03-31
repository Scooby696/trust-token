import React, { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Star, MessageSquare, ChevronDown, ChevronUp, ThumbsUp } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import ProviderReviewModal from "./ProviderReviewModal";

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

function StarRow({ rating, size = "sm" }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} className={`${size === "sm" ? "w-3 h-3" : "w-4 h-4"} ${s <= Math.round(rating) ? "text-primary fill-primary" : "text-border"}`} />
      ))}
    </div>
  );
}

export default function ProviderCard({ company, index, spotlight = false }) {
  const [showReview, setShowReview] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const qc = useQueryClient();

  const slug = company.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  const { data: reviews = [] } = useQuery({
    queryKey: ["provider-reviews", slug],
    queryFn: () => base44.entities.ProviderReview.filter({ provider_slug: slug }),
  });

  const helpfulMutation = useMutation({
    mutationFn: (review) => base44.entities.ProviderReview.update(review.id, { helpful_count: (review.helpful_count || 0) + 1 }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["provider-reviews", slug] }),
  });

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: (index % 8) * 0.04 }}
        className={`bg-card border rounded-xl overflow-hidden flex flex-col transition-all group ${
          spotlight ? "border-primary/40 hover:border-primary/70" : "border-border/50 hover:border-primary/30"
        }`}
      >
        <div className="p-4 flex-1 flex flex-col">
          <div className="flex items-start justify-between mb-2">
            <span className={`px-2 py-0.5 rounded-full text-xs font-inter ${CATEGORY_COLORS[company.category] || "bg-muted text-muted-foreground"}`}>
              {company.category}
            </span>
            {company.founded && <span className="font-inter text-xs text-muted-foreground/60">Est. {company.founded}</span>}
          </div>

          <h3 className="font-cinzel font-bold text-foreground text-sm group-hover:text-primary transition-colors mb-0.5 leading-snug">
            {company.name}
          </h3>
          <p className="font-inter text-xs text-muted-foreground mb-2">{company.location}</p>

          {/* Rating row */}
          {avgRating ? (
            <div className="flex items-center gap-1.5 mb-2">
              <StarRow rating={parseFloat(avgRating)} />
              <span className="font-inter text-xs text-muted-foreground">{avgRating} ({reviews.length} review{reviews.length !== 1 ? "s" : ""})</span>
            </div>
          ) : (
            <button onClick={() => setShowReview(true)} className="flex items-center gap-1 mb-2 font-inter text-xs text-muted-foreground/60 hover:text-primary transition-colors w-fit">
              <Star className="w-3 h-3" /> Be first to review
            </button>
          )}

          <p className="font-inter text-xs text-muted-foreground/80 leading-relaxed flex-1 line-clamp-3 mb-3">
            {company.desc}
          </p>

          {/* Latest review snippet */}
          {reviews.length > 0 && (
            <div className="mb-3 px-3 py-2 bg-background/60 border border-border/30 rounded-lg">
              <div className="flex items-center gap-1.5 mb-1">
                <StarRow rating={reviews[0].rating} />
                <span className="font-inter text-xs text-muted-foreground">{reviews[0].reviewer_name}</span>
              </div>
              <p className="font-inter text-xs text-muted-foreground/80 line-clamp-2 italic">"{reviews[0].body}"</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="px-4 pb-4 flex items-center gap-2 flex-wrap">
          <a href={company.url} target="_blank" rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-primary/10 border border-primary/20 text-primary rounded-lg text-xs font-inter hover:bg-primary/20 transition-colors">
            Visit <ExternalLink className="w-3 h-3" />
          </a>
          <button onClick={() => setShowReview(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-card border border-border rounded-lg text-xs font-inter text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors">
            <MessageSquare className="w-3 h-3" /> Review
          </button>
          {reviews.length > 0 && (
            <button onClick={() => setShowReviews(!showReviews)}
              className="flex items-center gap-1 text-xs font-inter text-muted-foreground/60 hover:text-primary transition-colors">
              {showReviews ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              {reviews.length}
            </button>
          )}
        </div>

        {/* Expanded reviews */}
        {showReviews && reviews.length > 0 && (
          <div className="border-t border-border/30 px-4 py-3 space-y-3 bg-background/30">
            <p className="font-cinzel text-xs font-semibold text-foreground">All Reviews</p>
            {reviews.map((r) => (
              <div key={r.id} className="border border-border/30 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <StarRow rating={r.rating} />
                    <span className="font-inter text-xs font-semibold text-foreground">{r.reviewer_name}</span>
                  </div>
                  {r.service_used && (
                    <span className="font-inter text-xs text-muted-foreground/60 italic">{r.service_used}</span>
                  )}
                </div>
                {r.title && <p className="font-inter text-xs font-semibold text-foreground mb-1">{r.title}</p>}
                <p className="font-inter text-xs text-muted-foreground leading-relaxed mb-2">{r.body}</p>
                <button onClick={() => helpfulMutation.mutate(r)}
                  className="flex items-center gap-1 text-xs font-inter text-muted-foreground/50 hover:text-primary transition-colors">
                  <ThumbsUp className="w-3 h-3" /> Helpful {r.helpful_count > 0 ? `(${r.helpful_count})` : ""}
                </button>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {showReview && <ProviderReviewModal provider={company} onClose={() => setShowReview(false)} />}
    </>
  );
}