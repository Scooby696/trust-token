import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, CheckCircle2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useQueryClient } from "@tanstack/react-query";

export default function ReviewModal({ company, onClose }) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const qc = useQueryClient();

  const submit = async () => {
    if (!rating || !name || !body) return;
    setSubmitting(true);
    await base44.entities.CompanyReview.create({
      company_slug: company.slug,
      company_name: company.name,
      reviewer_name: name,
      rating,
      title,
      body,
      verified_purchase: false,
    });
    await qc.invalidateQueries({ queryKey: ["reviews", company.slug] });
    setSubmitting(false);
    setDone(true);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
          className="w-full max-w-md bg-card border border-border/50 rounded-2xl overflow-hidden"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
            <div>
              <p className="font-cinzel font-semibold text-foreground text-sm">Write a Review</p>
              <p className="font-inter text-xs text-primary">{company.name}</p>
            </div>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>

          {done ? (
            <div className="p-8 text-center">
              <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-3" />
              <p className="font-cinzel font-semibold text-foreground mb-1">Thank You!</p>
              <p className="font-inter text-sm text-muted-foreground">Your review has been posted.</p>
              <button onClick={onClose} className="mt-5 px-6 py-2 bg-primary text-primary-foreground rounded-lg font-cinzel text-sm">
                Close
              </button>
            </div>
          ) : (
            <div className="p-5 space-y-4">
              {/* Star selector */}
              <div>
                <label className="block font-inter text-xs text-muted-foreground mb-2">Your Rating *</label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      onMouseEnter={() => setHovered(s)}
                      onMouseLeave={() => setHovered(0)}
                      onClick={() => setRating(s)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star className={`w-7 h-7 transition-colors ${s <= (hovered || rating) ? "text-primary fill-primary" : "text-border"}`} />
                    </button>
                  ))}
                  {rating > 0 && <span className="ml-2 font-inter text-xs text-muted-foreground">{["", "Poor", "Fair", "Good", "Great", "Excellent"][rating]}</span>}
                </div>
              </div>

              <div>
                <label className="block font-inter text-xs text-muted-foreground mb-1.5">Your Name *</label>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="John S."
                  className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm font-inter text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>

              <div>
                <label className="block font-inter text-xs text-muted-foreground mb-1.5">Review Title</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Great quality American craftsmanship..."
                  className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm font-inter text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>

              <div>
                <label className="block font-inter text-xs text-muted-foreground mb-1.5">Your Review *</label>
                <textarea rows={4} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Share your experience with this American company..."
                  className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm font-inter text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
              </div>

              <button
                onClick={submit}
                disabled={!rating || !name || !body || submitting}
                className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-cinzel text-sm tracking-wider hover:bg-primary/90 transition-colors disabled:opacity-40"
              >
                {submitting ? "Posting..." : "Post Review 🇺🇸"}
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}