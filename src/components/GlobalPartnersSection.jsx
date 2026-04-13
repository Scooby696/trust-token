import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Globe, ExternalLink, Shield, Loader2, ArrowRight } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";

const CATEGORY_COLORS = {
  "Exchange": "bg-blue-900/40 text-blue-300",
  "DeFi": "bg-green-900/40 text-green-300",
  "Blockchain Infrastructure": "bg-cyan-900/40 text-cyan-300",
  "Payments": "bg-teal-900/40 text-teal-300",
  "Custody & Banking": "bg-yellow-900/40 text-yellow-300",
  "Developer Tools": "bg-orange-900/40 text-orange-300",
  "Analytics & Compliance": "bg-red-900/40 text-red-300",
  "NFT & Marketplace": "bg-purple-900/40 text-purple-300",
  "Media & Data": "bg-gray-700/40 text-gray-300",
  "Identity & Security": "bg-indigo-900/40 text-indigo-300",
  "Other": "bg-muted text-muted-foreground",
};

export default function GlobalPartnersSection({ compact = false }) {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.GlobalPartner.filter({ status: "approved" }, "-created_date", compact ? 6 : 50)
      .then(setPartners)
      .finally(() => setLoading(false));
  }, [compact]);

  return (
    <section className={`${compact ? "py-10" : "py-14"} px-4 sm:px-6 lg:px-8 border-t border-border/30`}>
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className={`${compact ? "mb-6" : "mb-10"} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3`}>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Globe className="w-5 h-5 text-primary" />
              <p className="font-inter text-xs tracking-[0.3em] text-primary uppercase">Vetted Worldwide</p>
            </div>
            <h2 className={`font-cinzel font-bold text-foreground ${compact ? "text-2xl" : "text-3xl sm:text-4xl"}`}>
              Trusted Digital Partners Worldwide
            </h2>
            <p className="font-inter text-sm text-muted-foreground mt-1 max-w-2xl leading-relaxed">
              The same stringent vetting standards as our USA Marketplace — applied globally. Every partner is reviewed and approved before listing.
            </p>
          </div>
          {compact && (
            <Link to="/global-partners" className="inline-flex items-center gap-2 font-inter text-sm text-primary hover:text-primary/80 tracking-wider transition-colors shrink-0">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap gap-3 mb-8">
          {[
            { icon: Shield, label: "Globally Vetted", desc: "Same KYC standards as USA Marketplace" },
            { icon: Globe, label: "Worldwide Reach", desc: "Partners across multiple countries" },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex items-center gap-2 px-4 py-2 bg-card border border-primary/20 rounded-xl">
              <Icon className="w-4 h-4 text-primary shrink-0" />
              <div>
                <p className="font-cinzel text-xs font-bold text-primary">{label}</p>
                <p className="font-inter text-[10px] text-muted-foreground">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Partners grid */}
        {loading ? (
          <div className="flex items-center justify-center py-16 gap-3">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
            <span className="font-inter text-sm text-muted-foreground">Loading partners...</span>
          </div>
        ) : partners.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-border rounded-2xl">
            <Globe className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="font-cinzel text-xl text-foreground mb-2">Partners Coming Soon</p>
            <p className="font-inter text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
              We are actively vetting global digital partners. Approved partners will appear here.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {partners.map((partner, i) => (
              <motion.div key={partner.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="bg-card border border-border/50 rounded-xl p-5 hover:border-primary/40 transition-all group flex flex-col"
              >
                {partner.is_featured && (
                  <div className="flex items-center gap-1 mb-2">
                    <span className="px-2 py-0.5 bg-primary/20 border border-primary/40 text-primary text-[10px] font-cinzel rounded-full">★ Featured</span>
                  </div>
                )}
                <div className="flex items-start justify-between mb-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-inter ${CATEGORY_COLORS[partner.category] || "bg-muted text-muted-foreground"}`}>
                    {partner.category}
                  </span>
                  <span className="font-inter text-[10px] text-muted-foreground border border-border/50 px-2 py-0.5 rounded-full">
                    🌐 {partner.country}
                  </span>
                </div>

                {partner.logo_url && (
                  <img src={partner.logo_url} alt={partner.name} className="w-10 h-10 rounded-lg object-contain mb-3 bg-background border border-border/30 p-1" />
                )}

                <h3 className="font-cinzel font-bold text-foreground group-hover:text-primary transition-colors mb-1">{partner.name}</h3>

                {partner.highlight && (
                  <p className="font-inter text-xs text-primary font-semibold mb-2">{partner.highlight}</p>
                )}

                <p className="font-inter text-sm text-muted-foreground leading-relaxed mb-4 flex-1">{partner.description}</p>

                <div className="flex items-center justify-between pt-3 border-t border-border/30">
                  <div className="flex items-center gap-1">
                    <Shield className="w-3 h-3 text-green-400" />
                    <span className="font-inter text-[10px] text-green-400">Vetted & Approved</span>
                  </div>
                  <a href={partner.website} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 font-cinzel text-xs text-primary hover:underline">
                    Visit <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && partners.length > 0 && compact && (
          <div className="mt-6 text-center">
            <Link to="/global-partners" className="inline-flex items-center gap-2 font-cinzel tracking-wider text-xs px-5 py-2.5 border border-primary/30 text-primary rounded-lg hover:bg-primary/10 transition-colors">
              View All Global Partners <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}