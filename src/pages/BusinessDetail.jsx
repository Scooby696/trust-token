import React, { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import {
  ExternalLink, MapPin, Globe, Mail, Phone, CheckCircle2, Shield, ShieldCheck,
  Star, ArrowLeft, Calendar, Tag, Sparkles, Loader2, Package
} from "lucide-react";
import AICompanyAnalysis from "../components/AICompanyAnalysis";
import ReviewModal from "../components/marketplace/ReviewModal";

function VerificationBadge({ label, verified }) {
  return (
    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-inter border ${
      verified
        ? "bg-green-900/20 border-green-700/40 text-green-300"
        : "bg-muted border-border text-muted-foreground"
    }`}>
      {verified
        ? <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
        : <Shield className="w-3.5 h-3.5 text-muted-foreground" />}
      {label}
    </div>
  );
}

function StarRow({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} className={`w-3.5 h-3.5 ${n <= Math.round(rating) ? "text-primary fill-primary" : "text-border"}`} />
      ))}
    </div>
  );
}

export default function BusinessDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const companyId = urlParams.get("id");

  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showReview, setShowReview] = useState(false);

  const { data: company, isLoading: loadingCompany } = useQuery({
    queryKey: ["company", companyId],
    queryFn: () => base44.entities.Company.filter({ id: companyId }).then((r) => r[0]),
    enabled: !!companyId,
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ["reviews", company?.name],
    queryFn: () => base44.entities.CompanyReview.filter({ company_name: company.name }),
    enabled: !!company?.name,
  });

  if (!companyId) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="font-cinzel text-xl text-foreground mb-2">No company selected</p>
          <Link to="/marketplace" className="font-inter text-sm text-primary hover:underline">← Back to Marketplace</Link>
        </div>
      </div>
    );
  }

  if (loadingCompany) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="font-cinzel text-xl text-foreground mb-2">Company not found</p>
          <Link to="/marketplace" className="font-inter text-sm text-primary hover:underline">← Back to Marketplace</Link>
        </div>
      </div>
    );
  }

  const avgRating = reviews.length
    ? reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length
    : null;

  const tags = company.tags ? company.tags.split(",").map((t) => t.trim()).filter(Boolean) : [];

  return (
    <div className="pt-20 sm:pt-24 min-h-screen">
      {/* Back nav */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto pt-6">
        <Link
          to="/marketplace"
          className="inline-flex items-center gap-1.5 font-inter text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Marketplace
        </Link>
      </div>

      {/* Hero profile */}
      <section className="relative py-10 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/40 via-background to-red-950/20 pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-1 flex">
          <div className="flex-1 bg-red-600" />
          <div className="flex-1 bg-white/80" />
          <div className="flex-1 bg-blue-700" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row gap-6 items-start">
            {/* Logo */}
            {company.logo_url ? (
              <img src={company.logo_url} alt={company.name} className="w-24 h-24 rounded-2xl object-contain bg-card border border-border/50 p-2 shrink-0" />
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0">
                <span className="font-cinzel font-bold text-3xl text-primary">{company.name?.[0]}</span>
              </div>
            )}

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-inter">{company.category}</span>
                {company.type && (
                  <span className="px-2 py-0.5 bg-blue-900/30 text-blue-300 border border-blue-800/30 rounded-full text-xs font-inter capitalize">{company.type}</span>
                )}
                {company.status === "approved" && (
                  <span className="flex items-center gap-1 px-2 py-0.5 bg-green-900/20 text-green-300 border border-green-700/30 rounded-full text-xs font-inter">
                    <CheckCircle2 className="w-3 h-3" /> KYC Verified
                  </span>
                )}
                {company.is_featured && (
                  <span className="flex items-center gap-1 px-2 py-0.5 bg-primary/20 text-primary border border-primary/30 rounded-full text-xs font-inter">
                    <Star className="w-3 h-3 fill-primary" /> Featured
                  </span>
                )}
              </div>

              <h1 className="font-cinzel text-3xl sm:text-4xl font-bold text-white mb-2">{company.name}</h1>

              <div className="flex flex-wrap items-center gap-4 text-sm font-inter text-muted-foreground mb-3">
                {company.location && (
                  <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{company.location}</span>
                )}
                {company.founded_year && (
                  <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />Est. {company.founded_year}</span>
                )}
                {avgRating && (
                  <span className="flex items-center gap-1.5">
                    <StarRow rating={avgRating} />
                    <span>{avgRating.toFixed(1)} ({reviews.length} reviews)</span>
                  </span>
                )}
              </div>

              <p className="font-inter text-sm text-foreground/80 leading-relaxed max-w-2xl">{company.description}</p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 shrink-0">
              {company.website && (
                <a href={company.website} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-cinzel text-xs tracking-wider hover:bg-primary/90 transition-colors">
                  <Globe className="w-3.5 h-3.5" /> Visit Website
                </a>
              )}
              <button onClick={() => setShowAnalysis(true)}
                className="flex items-center gap-2 px-4 py-2 bg-card border border-primary/30 text-primary rounded-lg font-inter text-xs hover:bg-primary/10 transition-colors">
                <Sparkles className="w-3.5 h-3.5" /> AI Analysis
              </button>
              <button onClick={() => setShowReview(true)}
                className="flex items-center gap-2 px-4 py-2 bg-card border border-border text-muted-foreground rounded-lg font-inter text-xs hover:border-primary/30 hover:text-primary transition-colors">
                <Star className="w-3.5 h-3.5" /> Write Review
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main content */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-8">

            {/* Verification Status */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="bg-card border border-border/50 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <h2 className="font-cinzel font-bold text-foreground text-base">Verification Status</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                <VerificationBadge label="KYC Approved" verified={company.status === "approved"} />
                <VerificationBadge label="EIN Verified" verified={!!company.ein_verified} />
                <VerificationBadge label="ID Document" verified={!!company.kyc_submitted} />
                {company.certification_type && (
                  <VerificationBadge label={company.certification_type} verified />
                )}
              </div>
              {company.status === "approved" && (
                <p className="font-inter text-xs text-muted-foreground mt-3 leading-relaxed">
                  This business has passed our KYC verification process confirming it is a legitimate US-based company making American-made products or services.
                </p>
              )}
            </motion.div>

            {/* Products / What They Make */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="bg-card border border-border/50 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Package className="w-4 h-4 text-primary" />
                <h2 className="font-cinzel font-bold text-foreground text-base">Products & Services</h2>
              </div>
              <p className="font-inter text-sm text-foreground/80 leading-relaxed mb-4">{company.description}</p>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span key={tag} className="flex items-center gap-1 px-2 py-0.5 bg-background border border-border/50 rounded-full text-xs font-inter text-muted-foreground">
                      <Tag className="w-2.5 h-2.5" />{tag}
                    </span>
                  ))}
                </div>
              )}
              {company.website && (
                <a href={company.website} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-4 font-inter text-xs text-primary hover:underline">
                  <ExternalLink className="w-3 h-3" /> View full product catalog on their website
                </a>
              )}
            </motion.div>

            {/* Reviews */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="bg-card border border-border/50 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-primary" />
                  <h2 className="font-cinzel font-bold text-foreground text-base">
                    Reviews {reviews.length > 0 && `(${reviews.length})`}
                  </h2>
                </div>
                <button onClick={() => setShowReview(true)}
                  className="font-inter text-xs text-primary hover:underline">
                  + Write a Review
                </button>
              </div>

              {reviews.length === 0 ? (
                <div className="text-center py-8">
                  <Star className="w-8 h-8 text-border mx-auto mb-2" />
                  <p className="font-inter text-sm text-muted-foreground">No reviews yet. Be the first!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review, i) => (
                    <div key={review.id || i} className="border-b border-border/30 pb-4 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-inter text-sm font-semibold text-foreground">{review.reviewer_name}</span>
                          {review.verified_purchase && (
                            <span className="text-[10px] font-inter text-green-400 bg-green-900/20 px-1.5 py-0.5 rounded-full">✓ Verified</span>
                          )}
                        </div>
                        <StarRow rating={review.rating} />
                      </div>
                      {review.title && <p className="font-inter text-xs font-semibold text-foreground mb-1">{review.title}</p>}
                      <p className="font-inter text-xs text-muted-foreground leading-relaxed">{review.body}</p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-5">
            {/* Contact */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="bg-card border border-border/50 rounded-xl p-5">
              <h3 className="font-cinzel font-bold text-foreground text-sm mb-4">Contact & Links</h3>
              <div className="space-y-3">
                {company.website && (
                  <a href={company.website} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs font-inter text-muted-foreground hover:text-primary transition-colors">
                    <Globe className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{company.website.replace(/^https?:\/\//, "")}</span>
                  </a>
                )}
                {company.email && (
                  <a href={`mailto:${company.email}`}
                    className="flex items-center gap-2 text-xs font-inter text-muted-foreground hover:text-primary transition-colors">
                    <Mail className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{company.email}</span>
                  </a>
                )}
                {company.phone && (
                  <a href={`tel:${company.phone}`}
                    className="flex items-center gap-2 text-xs font-inter text-muted-foreground hover:text-primary transition-colors">
                    <Phone className="w-3.5 h-3.5 shrink-0" />
                    <span>{company.phone}</span>
                  </a>
                )}
                {company.location && (
                  <div className="flex items-center gap-2 text-xs font-inter text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span>{company.location}</span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Quick stats */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="bg-card border border-border/50 rounded-xl p-5">
              <h3 className="font-cinzel font-bold text-foreground text-sm mb-4">Quick Facts</h3>
              <div className="space-y-3">
                {[
                  ["Category", company.category],
                  ["Type", company.type ? company.type.charAt(0).toUpperCase() + company.type.slice(1) : null],
                  ["Founded", company.founded_year],
                  ["Status", company.status === "approved" ? "✓ KYC Approved" : company.status],
                  ["Rating", avgRating ? `${avgRating.toFixed(1)} / 5 (${reviews.length} reviews)` : "No reviews yet"],
                ].filter(([, v]) => v).map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-2">
                    <span className="font-inter text-xs text-muted-foreground">{label}</span>
                    <span className="font-inter text-xs text-foreground font-semibold text-right">{value}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Apply CTA */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-center">
              <p className="font-inter text-xs text-muted-foreground mb-2">Are you an American maker?</p>
              <Link to="/apply"
                className="inline-flex items-center gap-1.5 font-cinzel text-xs text-primary hover:underline tracking-wider">
                Apply for listing →
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {showAnalysis && <AICompanyAnalysis company={company} onClose={() => setShowAnalysis(false)} />}
      {showReview && <ReviewModal company={{ ...company, slug: company.id }} onClose={() => setShowReview(false)} />}
    </div>
  );
}