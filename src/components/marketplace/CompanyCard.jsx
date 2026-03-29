import React from "react";
import { motion } from "framer-motion";
import { ExternalLink, MapPin, Star, ShieldCheck } from "lucide-react";

const TYPE_COLORS = {
  physical: "bg-blue-900/30 text-blue-300",
  digital: "bg-purple-900/30 text-purple-300",
  both: "bg-green-900/30 text-green-300",
};

export default function CompanyCard({ company, index, featured }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: (index % 6) * 0.07 }}
      className={`group bg-card border rounded-xl p-5 hover:shadow-lg transition-all duration-300 flex flex-col ${
        featured ? "border-primary/40 shadow-primary/10 shadow-md" : "border-border/50 hover:border-primary/30"
      }`}
    >
      {featured && (
        <div className="flex items-center gap-1 mb-3">
          <Star className="w-3.5 h-3.5 text-primary fill-primary" />
          <span className="font-inter text-xs text-primary">Featured</span>
        </div>
      )}

      {company.logo_url && (
        <div className="w-12 h-12 rounded-lg bg-background border border-border/50 overflow-hidden mb-3 flex items-center justify-center">
          <img src={company.logo_url} alt={company.name} className="w-full h-full object-contain" />
        </div>
      )}

      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-cinzel font-semibold text-foreground text-sm group-hover:text-primary transition-colors leading-snug">
          {company.name}
        </h3>
        <ShieldCheck className="w-4 h-4 text-green-400 shrink-0 mt-0.5" title="KYC Verified" />
      </div>

      <p className="font-inter text-xs text-muted-foreground leading-relaxed mb-4 flex-1">
        {company.description}
      </p>

      <div className="flex items-center gap-2 flex-wrap mb-4">
        <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-inter">{company.category}</span>
        {company.type && (
          <span className={`px-2 py-0.5 rounded-full text-xs font-inter capitalize ${TYPE_COLORS[company.type] || ""}`}>
            {company.type}
          </span>
        )}
        {company.location && (
          <span className="flex items-center gap-1 text-xs text-muted-foreground font-inter">
            <MapPin className="w-3 h-3" />{company.location}
          </span>
        )}
      </div>

      {company.website && (
        <a
          href={company.website}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs font-inter text-primary hover:text-primary/80 transition-colors mt-auto"
        >
          Visit Website <ExternalLink className="w-3 h-3" />
        </a>
      )}
    </motion.div>
  );
}