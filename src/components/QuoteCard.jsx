import React from "react";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";

export default function QuoteCard({ quote, author, title, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.15, duration: 0.6 }}
      className="bg-card border border-border/50 rounded-lg p-6 sm:p-8 hover:border-primary/30 transition-all duration-500 group"
    >
      <Quote className="w-8 h-8 text-primary/30 mb-4 group-hover:text-primary/60 transition-colors" />
      <p className="font-inter text-sm sm:text-base text-foreground/80 leading-relaxed italic mb-6">
        "{quote}"
      </p>
      <div className="border-t border-border/50 pt-4">
        <p className="font-cinzel text-primary font-semibold text-sm tracking-wider">
          {author}
        </p>
        <p className="font-inter text-xs text-muted-foreground mt-1">{title}</p>
      </div>
    </motion.div>
  );
}