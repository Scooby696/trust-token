import React from "react";
import { motion } from "framer-motion";
import { MapPin, ShieldCheck, ExternalLink } from "lucide-react";

export default function ProductCard({ product, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: (index % 8) * 0.05 }}
      className="group bg-card border border-border/50 rounded-2xl overflow-hidden flex flex-col hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
    >
      {/* Image */}
      <div className="relative overflow-hidden h-52">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.featured && (
          <div className="absolute top-3 left-3 px-2.5 py-1 bg-primary text-primary-foreground text-[10px] font-cinzel tracking-widest rounded-full shadow-lg">
            ★ Featured
          </div>
        )}
        {product.verified && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-background/90 backdrop-blur-sm border border-green-500/40 text-green-400 text-[10px] font-inter rounded-full">
            <ShieldCheck className="w-3 h-3" /> KYC Verified
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center justify-between mb-1">
          <span className="font-inter text-xs text-primary font-semibold tracking-wider">{product.brand}</span>
          <span className="font-cinzel font-bold text-primary text-base">{product.price}</span>
        </div>

        <h3 className="font-cinzel font-bold text-foreground text-sm leading-snug mb-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        <p className="font-inter text-xs text-muted-foreground leading-relaxed mb-3 flex-1">
          {product.description}
        </p>

        <div className="flex items-center gap-1 mb-4 font-inter text-xs text-muted-foreground">
          <MapPin className="w-3 h-3 shrink-0" />
          <span>{product.location}</span>
        </div>

        {/* Buy Now */}
        <a
          href={product.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-primary-foreground rounded-xl font-cinzel text-xs tracking-wider hover:bg-primary/90 active:scale-95 transition-all shadow-md shadow-primary/20"
        >
          Buy Now <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </motion.div>
  );
}